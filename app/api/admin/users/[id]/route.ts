import { createClient, createAdminClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { decryptPassword } from "@/components/lib/crypto";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // 현재 사용자 권한 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 현재 사용자의 프로필 확인 (admin 권한 체크)
    const { data: currentUserProfile, error: authProfileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (authProfileError || currentUserProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // 관리자 권한으로 사용자 정보 조회 (RLS 우회)
    const adminClient = createAdminClient();

    // 사용자 프로필 정보 가져오기
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "사용자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 사용자 포인트 합계 계산
    const { data: pointsData, error: pointsError } = await adminClient
      .from("user_points")
      .select("points_earned")
      .eq("user_id", id);

    const totalPoints =
      pointsData?.reduce((sum, point) => sum + (point.points_earned || 0), 0) ||
      0;

    // 등급 정보 가져오기
    const { data: gradeData, error: gradeError } = await adminClient
      .from("grade_list")
      .select("*")
      .order("min", { ascending: true });

    let userGrade = "등급없음";
    if (gradeData && !gradeError) {
      const grade = gradeData.find(
        (g) => totalPoints >= (g.min || 0) && totalPoints <= (g.max || 999999)
      );
      userGrade = grade?.grade_name || "등급없음";
    }

    // 배출량 계산 (input_records에서)
    const { data: inputData, error: inputError } = await adminClient
      .from("input_records")
      .select("input_amount")
      .eq("user_id", id);

    const totalEmission =
      inputData?.reduce(
        (sum, record) => sum + Number(record.input_amount || 0),
        0
      ) || 0;

    // 암호화된 비밀번호 복호화
    let decryptedPassword = "defaultpw";
    const encryptedValue = (profile as any).encrypted_password as string | null;
    if (encryptedValue) {
      try {
        const decrypted = decryptPassword(encryptedValue);
        if (decrypted && decrypted.trim() !== "") {
          decryptedPassword = decrypted;
        }
      } catch {}
    }

    // 응답 데이터 구성
    const userData = {
      id: profile.id,
      userId: profile.username || "",
      phone: profile.phone_no || "",
      code: profile.id.substring(0, 8), // ID의 일부를 회원코드로 사용
      emission: totalEmission.toString(),
      points: totalPoints.toString(),
      grade: userGrade,
      joinDate: profile.register_date || profile.created_at,
      lastAccess: profile.last_access_date || profile.last_at,
      status: profile.is_out ? "미사용" : "사용",
      email: profile.email,
      fullName: profile.full_name,
      decryptedPassword, // 바코드 생성용
    };

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = await createClient();

    // 현재 사용자 권한 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 현재 사용자의 프로필 확인 (admin 권한 체크)
    const { data: currentUserProfile, error: authProfileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (authProfileError || currentUserProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // 휴대폰 번호와 역할 업데이트 허용
    const { phone, role } = body;

    // 휴대폰 번호 유효성 검사
    if (phone !== undefined && phone !== "") {
      const phoneRegex = /^01[016789]\d{7,8}$/;
      if (!phoneRegex.test(phone.replace(/[-\s]/g, ""))) {
        return NextResponse.json(
          { error: "올바른 휴대폰 번호 형식이 아닙니다." },
          { status: 400 }
        );
      }
    }

    // 업데이트할 필드들을 동적으로 구성
    const updateFields: any = {
      updated_at: new Date().toISOString(),
    };

    if (phone !== undefined) {
      updateFields.phone_no = phone;
    }

    if (role !== undefined) {
      updateFields.role = role;
    }

    // 관리자 권한으로 데이터 업데이트 (RLS 우회)
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("profiles")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "업데이트에 실패했습니다." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "성공적으로 업데이트되었습니다.",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
