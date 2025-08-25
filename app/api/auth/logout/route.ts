import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const supabase = await createClient();
    
    // 수파베이스에서 로그아웃 처리
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return NextResponse.json(
        { error: "로그아웃 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 쿠키 삭제
    const cookieStore = await cookies();
    cookieStore.delete("sb-access-token");
    cookieStore.delete("sb-refresh-token");

    return NextResponse.json(
      { message: "성공적으로 로그아웃되었습니다." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "로그아웃 처리 중 예상치 못한 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
