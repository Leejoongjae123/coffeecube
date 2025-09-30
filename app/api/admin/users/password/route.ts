import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { encryptPassword } from "@/components/lib/crypto";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 현재 로그인한 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const { newPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: "새 비밀번호가 필요합니다." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // Supabase Auth 비밀번호 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        { error: "비밀번호 변경에 실패했습니다." },
        { status: 500 }
      );
    }

    // profiles 테이블의 encrypted_password도 업데이트
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        encrypted_password: encryptPassword(newPassword),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileUpdateError) {
      return NextResponse.json(
        { error: "프로필 비밀번호 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "비밀번호가 성공적으로 변경되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
