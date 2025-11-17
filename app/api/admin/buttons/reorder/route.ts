import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { buttons } = body;

    if (!buttons || !Array.isArray(buttons)) {
      return NextResponse.json(
        { success: false, message: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    // 각 버튼의 button_no 업데이트
    const updatePromises = buttons.map(
      (button: { id: string; button_no: number }) => {
        return supabase
          .from("buttons")
          .update({ button_no: button.button_no })
          .eq("button_no", parseInt(button.id));
      }
    );

    const results = await Promise.all(updatePromises);

    // 에러 체크
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "순서 업데이트 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "버튼 순서가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "서버 오류",
      },
      { status: 500 }
    );
  }
}
