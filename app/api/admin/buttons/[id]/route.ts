import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type RouteParams = Promise<{ id: string }>;

export async function PATCH(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body = await request.json();
    const { button_no, name, button_type, commands } = body;

    // 필드 검증
    if (
      !name ||
      !button_type ||
      !commands ||
      !Array.isArray(commands) ||
      commands.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "버튼 이름, 버튼 타입과 최소 1개의 명령어를 입력해주세요.",
        },
        { status: 400 }
      );
    }

    // button_type 검증
    if (button_type !== "client" && button_type !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "버튼 타입은 'client' 또는 'admin'이어야 합니다.",
        },
        { status: 400 }
      );
    }

    const buttonNo = parseInt(id);
    if (isNaN(buttonNo)) {
      return NextResponse.json(
        { success: false, message: "잘못된 버튼 번호입니다." },
        { status: 400 }
      );
    }

    // button_no 변경 시 중복 검사
    if (button_no && button_no !== buttonNo) {
      const { data: existingButton } = await supabase
        .from("buttons")
        .select("button_no")
        .eq("button_no", button_no)
        .single();

      if (existingButton) {
        return NextResponse.json(
          {
            success: false,
            message: `버튼 번호 ${button_no}는 이미 사용 중입니다.`,
          },
          { status: 400 }
        );
      }
    }

    // 1. 먼저 기존 명령어 삭제 (외래키 제약 조건 때문에)
    const { error: deleteError } = await supabase
      .from("button_commands")
      .delete()
      .eq("button_no", buttonNo);

    if (deleteError) {
      return NextResponse.json(
        { success: false, message: deleteError.message },
        { status: 500 }
      );
    }

    // 2. 버튼 업데이트 (번호 변경 포함)
    const updateData: any = { name, button_type };
    if (button_no && button_no !== buttonNo) {
      updateData.button_no = button_no;
    }

    const { data: buttonData, error: buttonError } = await supabase
      .from("buttons")
      .update(updateData)
      .eq("button_no", buttonNo)
      .select()
      .single();

    if (buttonError) {
      return NextResponse.json(
        { success: false, message: buttonError.message },
        { status: 500 }
      );
    }

    // 3. 새 명령어들 생성 (변경된 button_no 사용)
    const commandsToInsert = commands.map((cmd: any, index: number) => ({
      button_no: buttonData.button_no,
      send: cmd.send,
      receive: cmd.receive,
      duration: cmd.duration,
      sequence_order: index,
    }));

    const { data: commandsData, error: commandsError } = await supabase
      .from("button_commands")
      .insert(commandsToInsert)
      .select();

    if (commandsError) {
      return NextResponse.json(
        { success: false, message: commandsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "버튼이 성공적으로 수정되었습니다.",
      data: {
        id: buttonData.button_no.toString(),
        button_no: buttonData.button_no,
        name: buttonData.name,
        button_type: buttonData.button_type,
        commands: commandsData,
        created_at: buttonData.created_at,
        updated_at: buttonData.updated_at,
      },
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

export async function DELETE(
  request: Request,
  { params }: { params: RouteParams }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const buttonNo = parseInt(id);
    if (isNaN(buttonNo)) {
      return NextResponse.json(
        { success: false, message: "잘못된 버튼 번호입니다." },
        { status: 400 }
      );
    }

    // CASCADE로 button_commands도 자동 삭제됨
    const { error } = await supabase
      .from("buttons")
      .delete()
      .eq("button_no", buttonNo);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "버튼이 성공적으로 삭제되었습니다.",
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
