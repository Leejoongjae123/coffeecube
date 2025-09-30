import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // 검색 파라미터들 추출
    const searchCondition = searchParams.get("searchCondition") || "";
    const searchQuery = searchParams.get("searchQuery") || "";
    const period = searchParams.get("period") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    let query = supabase
      .from("extract_history")
      .select("*")
      .order("created_at", { ascending: false });

    // 기간 필터링
    if (period && period !== "전체") {
      const now = new Date();
      let filterDate = new Date();

      switch (period) {
        case "오늘":
          filterDate.setHours(0, 0, 0, 0);
          query = query.gte(
            "visit_date",
            filterDate.toISOString().split("T")[0]
          );
          break;
        case "7일":
          filterDate.setDate(now.getDate() - 7);
          query = query.gte(
            "visit_date",
            filterDate.toISOString().split("T")[0]
          );
          break;
        case "30일":
          filterDate.setDate(now.getDate() - 30);
          query = query.gte(
            "visit_date",
            filterDate.toISOString().split("T")[0]
          );
          break;
      }
    }

    // 직접 입력 날짜 범위 필터링
    if (startDate) {
      query = query.gte("visit_date", startDate);
    }
    if (endDate) {
      query = query.lte("visit_date", endDate);
    }

    // 검색 조건 필터링
    if (searchQuery && searchCondition !== "전체") {
      switch (searchCondition) {
        case "주소":
          query = query.ilike("address", `%${searchQuery}%`);
          break;
        case "담당자명":
        case "고객명":
          query = query.ilike("customer_name", `%${searchQuery}%`);
          break;
        case "수거량":
          // 수거량은 숫자로 검색 (정확히 일치하거나 범위 검색)
          const numericValue = parseFloat(searchQuery);
          if (!isNaN(numericValue)) {
            query = query.eq("collection_amount", numericValue);
          }
          break;
        case "로봇코드":
          query = query.ilike("robot_code", `%${searchQuery}%`);
          break;
      }
    } else if (searchQuery && searchCondition === "전체") {
      // 전체 검색의 경우 모든 텍스트 필드에서 검색
      const numericValue = parseFloat(searchQuery);
      let orConditions = [
        `address.ilike.%${searchQuery}%`,
        `customer_name.ilike.%${searchQuery}%`,
        `robot_code.ilike.%${searchQuery}%`,
      ];

      // 숫자로 변환 가능한 경우 수거량 검색도 포함
      if (!isNaN(numericValue)) {
        orConditions.push(`collection_amount.eq.${numericValue}`);
      }

      query = query.or(orConditions.join(","));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "데이터를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 사용자 이메일 매핑 (profiles에서 id,email 조회)
    const userIds: string[] = Array.from(
      new Set(
        (data || [])
          .map((row: any) => row?.user_id)
          .filter(
            (v: any): v is string => typeof v === "string" && v.length > 0
          )
      )
    );

    let userEmailById: Record<string, string> = {};
    if (userIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (!profileError && Array.isArray(profileRows)) {
        userEmailById = profileRows.reduce(
          (acc: Record<string, string>, cur: any) => {
            if (cur?.id) {
              acc[cur.id] = cur?.email || "";
            }
            return acc;
          },
          {}
        );
      }
    }

    // 응답에 user_email 보강
    const enriched = (data || []).map((row: any) => ({
      ...row,
      user_email: userEmailById[row?.user_id] || "",
    }));

    return NextResponse.json({ data: enriched });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { customerName, address, visitDate, collectionAmount } = body;

    // 필수 필드 검증
    if (!customerName?.trim()) {
      return NextResponse.json(
        { success: false, message: "담당자명을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!address?.trim()) {
      return NextResponse.json(
        { success: false, message: "비니봇주소를 선택해주세요." },
        { status: 400 }
      );
    }

    if (!visitDate) {
      return NextResponse.json(
        { success: false, message: "방문일을 선택해주세요." },
        { status: 400 }
      );
    }

    if (!collectionAmount?.trim() || isNaN(Number(collectionAmount))) {
      return NextResponse.json(
        { success: false, message: "올바른 수거량을 입력해주세요." },
        { status: 400 }
      );
    }

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: "사용자 인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 주소에서 robot_code 찾기
    const { data: equipmentData, error: equipmentError } = await supabase
      .from("equipment_list")
      .select("robot_code")
      .eq("install_location", address)
      .single();

    let robotCode = null;
    if (!equipmentError && equipmentData) {
      robotCode = equipmentData.robot_code;
    }

    // 방문 기록 추가
    const { data, error } = await supabase
      .from("extract_history")
      .insert({
        user_id: user.id,
        customer_name: customerName,
        address: address,
        robot_code: robotCode,
        visit_date: visitDate,
        collection_amount: parseFloat(collectionAmount),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: "방문 등록에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "방문 등록이 성공적으로 완료되었습니다.",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { id, customerName, address, visitDate, collectionAmount } = body;

    if (!id) {
      return NextResponse.json({ error: "ID가 필요합니다." }, { status: 400 });
    }

    // 데이터 업데이트
    const { data, error } = await supabase
      .from("extract_history")
      .update({
        customer_name: customerName,
        address: address,
        visit_date: visitDate,
        collection_amount:
          typeof collectionAmount === "number"
            ? collectionAmount
            : parseFloat(collectionAmount),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "데이터 수정에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "성공적으로 수정되었습니다.",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
