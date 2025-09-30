import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const supabase = await createClient();

    // robot_code 또는 install_location에서 부분 검색
    const { data: equipmentList, error } = await supabase
      .from("equipment_list")
      .select("id, robot_code, install_location, name")
      .or(`robot_code.ilike.%${query}%, install_location.ilike.%${query}%`)
      .order("robot_code", { ascending: true })
      .limit(10);

    if (error) {
      return NextResponse.json(
        { error: "검색 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: equipmentList || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
