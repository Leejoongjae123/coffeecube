import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface RecordsQueryParams {
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
  robotChecked?: string; // "true" | "false"
  visitChecked?: string; // "true" | "false"
  regionLevel1?: string; // 시/군/구
  regionLevel2?: string; // 동/읍/면
  sortBy?: string; // "날짜" | "합계"
  sortOrder?: string; // "오름차순" | "내림차순"
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params: RecordsQueryParams = {
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "20",
    robotChecked: searchParams.get("robotChecked") || "true",
    visitChecked: searchParams.get("visitChecked") || "true",
    regionLevel1: searchParams.get("regionLevel1") || "전체",
    regionLevel2: searchParams.get("regionLevel2") || "전체",
    sortBy: searchParams.get("sortBy") || "날짜",
    sortOrder: searchParams.get("sortOrder") || "내림차순",
  };

  const supabase = await createClient();

  const page = parseInt(params.page as string);
  const limit = parseInt(params.limit as string);
  const offset = (page - 1) * limit;

  // 날짜 범위 처리: 전체 조회 시에는 날짜 필터 미적용
  let { startDate, endDate } = params;
  const hasDateFilter = startDate && endDate;

  // 지역 필터에 해당하는 robot_code 목록을 선별
  let allowedRobotCodes: string[] | null = null;
  if (params.regionLevel1 && params.regionLevel1 !== "전체") {
    const { data: equipments, error: equipError } = await supabase
      .from("equipment_list")
      .select("robot_code, install_location")
      .ilike("install_location", `%${params.regionLevel1}%`);

    if (!equipError) {
      let codes = (equipments || [])
        .filter((e: any) => !!e.robot_code)
        .map((e: any) => e.robot_code as string);

      if (params.regionLevel2 && params.regionLevel2 !== "전체") {
        codes = (equipments || [])
          .filter(
            (e: any) =>
              !!e.robot_code &&
              typeof e.install_location === "string" &&
              (e.install_location as string).includes(
                params.regionLevel2 as string
              )
          )
          .map((e: any) => e.robot_code as string);
      }

      allowedRobotCodes = codes;
    } else {
      allowedRobotCodes = [];
    }

    if (Array.isArray(allowedRobotCodes) && allowedRobotCodes.length === 0) {
      return NextResponse.json(
        {
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            hasMore: false,
          },
        },
        { status: 200 }
      );
    }
  }

  // 비니봇 개별 레코드
  let robotPromise: any = Promise.resolve({ data: [], error: null as any });
  if (params.robotChecked === "true") {
    let q = supabase.from("input_records").select(
      `
        input_date,
        input_amount,
        robot_code,
        user_id,
        equipment_list(region_dong, install_location)
      `
    );

    // 날짜 필터가 있을 때만 날짜 조건 추가
    if (hasDateFilter) {
      q = q
        .gte("input_date", startDate as string)
        .lte("input_date", endDate as string);
    }

    if (Array.isArray(allowedRobotCodes)) {
      q = q.in("robot_code", allowedRobotCodes);
    }

    // 기본 정렬: 날짜 내림차순
    robotPromise = q.order("input_date", {
      ascending: params.sortOrder === "오름차순",
    });
  }

  // 방문수거 개별 레코드
  let visitPromise: any = Promise.resolve({ data: [], error: null as any });
  if (params.visitChecked === "true") {
    let q = supabase.from("extract_history").select(
      `
        visit_date,
        collection_amount,
        robot_code,
        user_id,
        equipment_list(region_dong, install_location)
      `
    );

    // 날짜 필터가 있을 때만 날짜 조건 추가
    if (hasDateFilter) {
      q = q
        .gte("visit_date", startDate as string)
        .lte("visit_date", endDate as string);
    }

    if (Array.isArray(allowedRobotCodes)) {
      q = q.in("robot_code", allowedRobotCodes);
    }

    // 기본 정렬: 날짜 내림차순
    visitPromise = q.order("visit_date", {
      ascending: params.sortOrder === "오름차순",
    });
  }

  const [robotRes, visitRes] = await Promise.all([robotPromise, visitPromise]);

  if (robotRes.error || visitRes.error) {
    return NextResponse.json(
      { error: "데이터 조회에 실패했습니다." },
      { status: 500 }
    );
  }

  // user_id -> email 매핑 조회
  const userIdSet = new Set<string>();
  (robotRes.data as any[]).forEach((r: any) => {
    if (r && typeof r.user_id === "string" && r.user_id) {
      userIdSet.add(r.user_id);
    }
  });
  (visitRes.data as any[]).forEach((r: any) => {
    if (r && typeof r.user_id === "string" && r.user_id) {
      userIdSet.add(r.user_id);
    }
  });

  let userEmailById = new Map<string, string>();
  if (userIdSet.size > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", Array.from(userIdSet));

    if (!profilesError && Array.isArray(profiles)) {
      profiles.forEach((p: any) => {
        if (p && typeof p.id === "string") {
          userEmailById.set(p.id, typeof p.email === "string" ? p.email : "");
        }
      });
    }
  }

  // 통합 및 정규화
  type DetailRecord = {
    date: string;
    userId: string;
    memberCode: string;
    address: string;
    robotCode: string;
    collectionAmount: number;
    collectionMethod: string; // "비니봇" | "방문수거"
  };

  const robotRows: DetailRecord[] = (robotRes.data as any[]).map((r) => ({
    date: r.input_date,
    userId: userEmailById.get(r.user_id as string) || "",
    memberCode: "",
    address: r?.equipment_list?.install_location || "",
    robotCode: r.robot_code || "",
    collectionAmount: parseFloat(r.input_amount || "0"),
    collectionMethod: "비니봇",
  }));

  const visitRows: DetailRecord[] = (visitRes.data as any[]).map((r) => ({
    date: r.visit_date,
    userId: userEmailById.get(r.user_id as string) || "",
    memberCode: "",
    address: r?.equipment_list?.install_location || "",
    robotCode: r.robot_code || "",
    collectionAmount: parseFloat(r.collection_amount || "0"),
    collectionMethod: "방문수거",
  }));

  let merged = [...robotRows, ...visitRows];

  // 지역 필터 추가 확인 (설치주소 포함 여부)
  if (params.regionLevel1 !== "전체") {
    merged = merged.filter((row) =>
      row.address.includes(params.regionLevel1 as string)
    );
  }
  if (params.regionLevel2 !== "전체") {
    merged = merged.filter((row) =>
      row.address.includes(params.regionLevel2 as string)
    );
  }

  // 정렬: 날짜 또는 합계(=수거량)
  const isAsc = params.sortOrder === "오름차순";
  if ((params.sortBy || "날짜") === "합계") {
    merged.sort((a, b) =>
      isAsc
        ? a.collectionAmount - b.collectionAmount
        : b.collectionAmount - a.collectionAmount
    );
  } else {
    merged.sort((a, b) => {
      const ta = a.date;
      const tb = b.date;
      return isAsc
        ? ta < tb
          ? -1
          : ta > tb
          ? 1
          : 0
        : ta < tb
        ? 1
        : ta > tb
        ? -1
        : 0;
    });
  }

  const totalCount = merged.length;
  const paged = merged.slice(offset, offset + limit);

  // 응답 포맷 (문자열 형식 맞추기)
  const data = paged.map((row) => ({
    date: row.date,
    userId: row.userId,
    memberCode: row.memberCode,
    address: row.address,
    robotCode: row.robotCode,
    collectionAmount: row.collectionAmount.toString(),
    collectionMethod: row.collectionMethod,
  }));

  const hasMore = offset + limit < totalCount && paged.length > 0;
  return NextResponse.json(
    {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasMore,
      },
    },
    { status: 200 }
  );
}
