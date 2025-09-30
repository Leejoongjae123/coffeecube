import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET: 등급 리스트 조회
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("grade_list")
      .select("*")
      .order("min", { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PUT: 등급 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { id, grade_name, min, max } = await request.json();

    // 필수 필드 검증
    if (!id || !grade_name || min === undefined || max === undefined) {
      return NextResponse.json(
        { success: false, error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 포인트 범위 유효성 검증
    if (min < 0 || (max < min && max !== 99999999)) {
      return NextResponse.json(
        { success: false, error: "포인트 범위가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // 다른 등급들과의 중복 범위 체크
    const { data: existingGrades, error: fetchError } = await supabase
      .from("grade_list")
      .select("*")
      .neq("id", id);

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: "등급 데이터를 확인할 수 없습니다." },
        { status: 500 }
      );
    }

    // 범위 중복 검사
    const hasOverlap = existingGrades?.some((grade) => {
      const gradeMin = grade.min;
      const gradeMax = grade.max;

      // 새로 설정하려는 범위와 기존 등급의 범위가 겹치는지 확인
      return (
        (min >= gradeMin && min <= gradeMax) ||
        (max >= gradeMin && max <= gradeMax) ||
        (min <= gradeMin && max >= gradeMax)
      );
    });

    if (hasOverlap) {
      return NextResponse.json(
        { success: false, error: "다른 등급과 포인트 범위가 중복됩니다." },
        { status: 400 }
      );
    }

    // 등급 정보 업데이트
    const { data, error } = await supabase
      .from("grade_list")
      .update({
        grade_name,
        min,
        max,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 새 등급 추가
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { grade_name, min, max } = await request.json();

    // 필수 필드 검증
    if (!grade_name || min === undefined || max === undefined) {
      return NextResponse.json(
        { success: false, error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 포인트 범위 유효성 검증
    if (min < 0 || (max < min && max !== 99999999)) {
      return NextResponse.json(
        { success: false, error: "포인트 범위가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // 등급명 중복 체크
    const { data: existingNameGrade, error: nameCheckError } = await supabase
      .from("grade_list")
      .select("id")
      .eq("grade_name", grade_name)
      .single();

    if (nameCheckError && nameCheckError.code !== "PGRST116") {
      return NextResponse.json(
        { success: false, error: "등급명 중복 확인 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (existingNameGrade) {
      return NextResponse.json(
        { success: false, error: "이미 존재하는 등급명입니다." },
        { status: 400 }
      );
    }

    // 다른 등급들과의 중복 범위 체크
    const { data: existingGrades, error: fetchError } = await supabase
      .from("grade_list")
      .select("*");

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: "등급 데이터를 확인할 수 없습니다." },
        { status: 500 }
      );
    }

    // 범위 중복 검사
    const hasOverlap = existingGrades?.some((grade) => {
      const gradeMin = grade.min;
      const gradeMax = grade.max;

      // 새로 설정하려는 범위와 기존 등급의 범위가 겹치는지 확인
      return (
        (min >= gradeMin && min <= gradeMax) ||
        (max >= gradeMin && max <= gradeMax) ||
        (min <= gradeMin && max >= gradeMax)
      );
    });

    if (hasOverlap) {
      return NextResponse.json(
        { success: false, error: "다른 등급과 포인트 범위가 중복됩니다." },
        { status: 400 }
      );
    }

    // 새 등급 추가
    const { data, error } = await supabase
      .from("grade_list")
      .insert({
        grade_name,
        min,
        max,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE: 등급 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { id } = await request.json();

    // 필수 필드 검증
    if (!id) {
      return NextResponse.json(
        { success: false, error: "등급 ID가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 해당 등급을 사용하는 사용자가 있는지 확인
    const { data: usersWithGrade, error: userCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("grade", id)
      .limit(1);

    if (userCheckError) {
      return NextResponse.json(
        {
          success: false,
          error: "등급 사용 여부 확인 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    if (usersWithGrade && usersWithGrade.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "해당 등급을 사용하는 사용자가 있어 삭제할 수 없습니다.",
        },
        { status: 400 }
      );
    }

    // 등급 삭제
    const { error } = await supabase.from("grade_list").delete().eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "등급이 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
