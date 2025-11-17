import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const searchCondition = searchParams.get("searchCondition");
    const searchQuery = searchParams.get("searchQuery");
    const buttonType = searchParams.get("buttonType");

    let query = supabase
      .from("buttons")
      .select(
        `
        *,
        button_commands (
          id,
          send,
          receive,
          duration,
          sequence_order
        )
      `
      )
      .order("button_no", { ascending: true });

    // 버튼 타입 필터 적용
    if (buttonType && buttonType !== "all") {
      query = query.eq("button_type", buttonType);
    }

    // 검색 조건 적용
    if (searchQuery && searchCondition) {
      if (searchCondition === "전체") {
        // 전체 검색: 번호 또는 버튼 이름 중 하나라도 일치하면 검색
        const buttonNo = parseInt(searchQuery);
        if (!isNaN(buttonNo)) {
          // 숫자인 경우: 번호로 검색하거나 이름에 포함된 경우
          query = query.or(
            `button_no.eq.${buttonNo},name.ilike.%${searchQuery}%`
          );
        } else {
          // 숫자가 아닌 경우: 이름으로만 검색
          query = query.ilike("name", `%${searchQuery}%`);
        }
      } else if (searchCondition === "버튼 이름") {
        query = query.ilike("name", `%${searchQuery}%`);
      } else if (searchCondition === "번호") {
        const buttonNo = parseInt(searchQuery);
        if (!isNaN(buttonNo)) {
          query = query.eq("button_no", buttonNo);
        }
      }
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    // 데이터 변환
    const transformedData = data?.map((item) => ({
      id: item.button_no.toString(),
      button_no: item.button_no,
      name: item.name,
      button_type: item.button_type,
      commands: (item.button_commands || []).sort(
        (a: any, b: any) => a.sequence_order - b.sequence_order
      ),
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformedData || [],
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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
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

    // button_no 검증
    if (button_no) {
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

    // 버튼 생성
    const insertData: any = { name, button_type };
    if (button_no) {
      insertData.button_no = button_no;
    }

    const { data: buttonData, error: buttonError } = await supabase
      .from("buttons")
      .insert([insertData])
      .select()
      .single();

    if (buttonError) {
      return NextResponse.json(
        { success: false, message: buttonError.message },
        { status: 500 }
      );
    }

    // 명령어들 생성
    const commandsToInsert = commands.map((cmd, index) => ({
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
      // 롤백: 버튼 삭제
      await supabase
        .from("buttons")
        .delete()
        .eq("button_no", buttonData.button_no);
      return NextResponse.json(
        { success: false, message: commandsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "버튼이 성공적으로 등록되었습니다.",
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
