import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface StatisticsQueryParams {
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
  robotChecked?: string;
  visitChecked?: string;
  regionLevel1?: string;
  regionLevel2?: string;
  sortBy?: string;
  sortOrder?: string;
  period?: string; // 'daily' | 'monthly' | 'weekly'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: StatisticsQueryParams = {
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
      period: searchParams.get("period") || "daily",
    };

    const supabase = await createClient();

    const page = parseInt(params.page as string);
    const limit = parseInt(params.limit as string);
    const offset = (page - 1) * limit;

    // 날짜 범위 설정: startDate/endDate가 주어지면 그 값만 사용, 없으면 필터 미적용
    const { startDate: paramStartDate, endDate: paramEndDate } = params;
    const hasDateFilter = !!(paramStartDate && paramEndDate);
    let startDate = paramStartDate as string | undefined;
    let endDate = paramEndDate as string | undefined;

    // 지역(시/군/구) 선택 시 install_location을 포함하는 장비(robot_code)만 허용 목록으로 구성
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

        // 하위 지역(동/읍/면 등) 선택 시 추가 필터
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

      // 허용되는 장비가 없으면 바로 빈 결과 반환
      if (Array.isArray(allowedRobotCodes) && allowedRobotCodes.length === 0) {
        const page = parseInt(params.page as string);
        const limit = parseInt(params.limit as string);
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

    // 비니봇 수거량 데이터 가져오기 (input_records)
    let robotCollectionPromise = Promise.resolve({ data: [], error: null });

    if (params.robotChecked === "true") {
      let query = supabase.from("input_records").select(
        `
          input_date,
          input_amount,
          robot_code
        `
      );

      if (hasDateFilter) {
        query = query
          .gte("input_date", startDate as string)
          .lte("input_date", endDate as string);
      }

      if (Array.isArray(allowedRobotCodes)) {
        query = query.in("robot_code", allowedRobotCodes);
      }

      robotCollectionPromise = query.order("input_date", { ascending: false });
    }

    // 방문 수거량 데이터 가져오기 (extract_history)
    let visitCollectionPromise = Promise.resolve({ data: [], error: null });

    if (params.visitChecked === "true") {
      let query = supabase.from("extract_history").select(
        `
          visit_date,
          collection_amount,
          robot_code
        `
      );

      if (hasDateFilter) {
        query = query
          .gte("visit_date", startDate as string)
          .lte("visit_date", endDate as string);
      }

      if (Array.isArray(allowedRobotCodes)) {
        query = query.in("robot_code", allowedRobotCodes);
      }

      visitCollectionPromise = query.order("visit_date", { ascending: false });
    }

    const [robotCollection, visitCollection] = await Promise.all([
      robotCollectionPromise,
      visitCollectionPromise,
    ]);

    if (robotCollection.error) {
      return NextResponse.json(
        { error: "비니봇 수거량 데이터를 불러오는데 실패했습니다." },
        { status: 500 }
      );
    }

    if (visitCollection.error) {
      return NextResponse.json(
        { error: "방문 수거량 데이터를 불러오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 날짜/월별로 데이터 집계 키 계산
    const getWeekKey = (isoDate: string) => {
      const d = new Date(isoDate);
      if (Number.isNaN(d.getTime())) {
        return isoDate.slice(0, 10);
      }
      const year = d.getFullYear();
      const start = new Date(year, 0, 1);
      const diffDays =
        Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
      const week = Math.ceil(diffDays / 7);
      return `${year}-${String(week).padStart(2, "0")}`; // YYYY-WW
    };

    const getGroupKey = (isoDate: string) => {
      // isoDate: YYYY-MM-DD
      if (params.period === "monthly") {
        return isoDate.slice(0, 7); // YYYY-MM
      }
      if (params.period === "weekly") {
        return getWeekKey(isoDate); // YYYY-WW
      }
      return isoDate; // YYYY-MM-DD
    };

    const groupedStats = new Map<
      string,
      {
        date: string;
        robotCollection: number;
        visitCollection: number;
        total: number;
      }
    >();

    // 비니봇 데이터 처리
    if (robotCollection.data) {
      robotCollection.data.forEach((record: any) => {
        const dateStr = getGroupKey(record.input_date);
        const amount = parseFloat(record.input_amount || "0");

        if (!groupedStats.has(dateStr)) {
          groupedStats.set(dateStr, {
            date: dateStr,
            robotCollection: 0,
            visitCollection: 0,
            total: 0,
          });
        }

        const stat = groupedStats.get(dateStr)!;
        stat.robotCollection += amount;
        stat.total += amount;
      });
    }

    // 방문 데이터 처리
    if (visitCollection.data) {
      visitCollection.data.forEach((record: any) => {
        const dateStr = getGroupKey(record.visit_date);
        const amount = parseFloat(record.collection_amount || "0");

        if (!groupedStats.has(dateStr)) {
          groupedStats.set(dateStr, {
            date: dateStr,
            robotCollection: 0,
            visitCollection: 0,
            total: 0,
          });
        }

        const stat = groupedStats.get(dateStr)!;
        stat.visitCollection += amount;
        stat.total += amount;
      });
    }

    // 정렬 적용 (sortBy: 날짜 | 합계, sortOrder: 오름차순 | 내림차순)
    const statsArray = Array.from(groupedStats.values());
    const isAsc = params.sortOrder === "오름차순";
    const sortBy = params.sortBy || "날짜";
    const sortedStats = statsArray.sort((a, b) => {
      if (sortBy === "합계") {
        return isAsc ? a.total - b.total : b.total - a.total;
      }
      // 기본: 날짜
      // a.date, b.date가 YYYY-MM 또는 YYYY-MM-DD 포맷
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

    const totalCount = sortedStats.length;
    const paginatedStats = sortedStats.slice(offset, offset + limit);

    // 날짜 포맷팅 및 응답 데이터 구성
    const formattedData = paginatedStats.map((stat) => {
      let formattedDate = stat.date;
      if (params.period === "monthly") {
        const [yyyy, mm] = stat.date.split("-");
        formattedDate = `${yyyy}년 ${parseInt(mm, 10)}월`;
      } else if (params.period === "weekly") {
        const [yyyy, ww] = stat.date.split("-");
        const yearNum = parseInt(yyyy, 10);
        const weekNum = parseInt(ww, 10);
        const firstDayOfWeek = new Date(yearNum, 0, (weekNum - 1) * 7 + 1);
        const month = firstDayOfWeek.getMonth() + 1;
        const weekOfMonth = Math.floor((firstDayOfWeek.getDate() - 1) / 7) + 1;
        formattedDate = `${month}월${weekOfMonth}주차`;
      } else {
        const date = new Date(stat.date);
        formattedDate = `${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}월 ${String(date.getDate()).padStart(2, "0")}일`;
      }

      return {
        date: formattedDate,
        robotCollection: stat.robotCollection.toFixed(1),
        visitCollection: stat.visitCollection.toFixed(1),
        total: stat.total.toFixed(1),
      };
    });

    // 더 정확한 hasMore 판단
    const hasMoreData =
      offset + limit < totalCount && paginatedStats.length > 0;

    return NextResponse.json(
      {
        data: formattedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasMore: hasMoreData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
