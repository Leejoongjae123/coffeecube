import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

interface EquipmentData {
  name: string;
  robotCode: string;
  installLocation: string;
  region?: string; // backward compatibility
  regionSi?: string;
  regionDong?: string;
  coordinates?: {
    x: number;
    y: number;
  };
  imageCoordinates?: {
    x: number;
    y: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: EquipmentData = await request.json();
    const supabase = await createClient();

    // 필수 필드 검증
    if (
      !data.name ||
      !data.robotCode ||
      !data.installLocation ||
      !(data.regionSi || data.region)
    ) {
      return NextResponse.json(
        { error: "모든 필수 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    // 좌표 검증
    if (
      !data.coordinates ||
      data.coordinates.x === undefined ||
      data.coordinates.y === undefined
    ) {
      return NextResponse.json(
        { error: "지도에서 설치 위치를 선택해주세요." },
        { status: 400 }
      );
    }

    // 비니봇 코드 중복 검사
    const { data: existingEquipment, error: checkError } = await supabase
      .from("equipment_list")
      .select("robot_code")
      .eq("robot_code", data.robotCode)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "데이터베이스 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (existingEquipment) {
      return NextResponse.json(
        { error: "이미 등록된 비니봇 코드입니다." },
        { status: 409 }
      );
    }

    // 장비 등록
    const insertData: any = {
      name: data.name,
      robot_code: data.robotCode,
      install_location: data.installLocation,
      region_si: data.regionSi || data.region,
      region_dong: data.regionDong || null,
      coordinates_x: data.coordinates.x,
      coordinates_y: data.coordinates.y,
    };

    // 이미지 좌표가 있으면 추가
    if (
      data.imageCoordinates &&
      typeof data.imageCoordinates.x === "number" &&
      typeof data.imageCoordinates.y === "number"
    ) {
      insertData.image_x = data.imageCoordinates.x;
      insertData.image_y = data.imageCoordinates.y;
    }

    const { data: newEquipment, error: insertError } = await supabase
      .from("equipment_list")
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "장비 등록에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "장비가 성공적으로 등록되었습니다.", data: newEquipment },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const {
      robotCode,
      usable,
      installLocation,
      region,
      regionSi,
      regionDong,
      coordinates_x,
      coordinates_y,
      image_x,
      image_y,
    } = await request.json();
    const supabase = await createClient();

    // 필수 필드 검증
    if (!robotCode) {
      return NextResponse.json(
        { error: "비니봇 코드는 필수입니다." },
        { status: 400 }
      );
    }

    // 업데이트할 데이터 준비
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (usable !== undefined) {
      updateData.usable = usable;
    }

    if (installLocation !== undefined) {
      updateData.install_location = installLocation;
    }

    if (region !== undefined || regionSi !== undefined) {
      updateData.region_si = regionSi ?? region;
    }
    if (regionDong !== undefined) {
      updateData.region_dong = regionDong;
    }

    // 좌표가 숫자로 전달되면 업데이트에 포함
    if (
      typeof coordinates_x === "number" &&
      typeof coordinates_y === "number" &&
      !isNaN(coordinates_x) &&
      !isNaN(coordinates_y)
    ) {
      updateData.coordinates_x = coordinates_x;
      updateData.coordinates_y = coordinates_y;
    }

    // 이미지 좌표가 숫자로 전달되면 업데이트에 포함
    if (
      typeof image_x === "number" &&
      typeof image_y === "number" &&
      !isNaN(image_x) &&
      !isNaN(image_y)
    ) {
      updateData.image_x = image_x;
      updateData.image_y = image_y;
    }

    // 장비 정보 업데이트
    const { data: updatedEquipment, error: updateError } = await supabase
      .from("equipment_list")
      .update(updateData)
      .eq("robot_code", robotCode)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "장비 정보 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    if (!updatedEquipment) {
      return NextResponse.json(
        { error: "해당 비니봇 코드를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "장비 정보가 성공적으로 업데이트되었습니다.",
        data: updatedEquipment,
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

export async function GET() {
  try {
    const supabase = await createClient();

    // equipment_list 가져오기 (last_used_at 포함)
    const { data: equipmentList, error: equipmentError } = await supabase
      .from("equipment_list")
      .select("*")
      .order("created_at", { ascending: false });

    if (equipmentError) {
      return NextResponse.json(
        { error: "장비 목록을 불러오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 오늘 날짜 (한국 시간 기준) - 필요 시 사용
    // const koreaTime = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
    // const today = koreaTime.toISOString().split("T")[0];

    // 모든 장비의 robot_code 목록 추출
    const robotCodes =
      equipmentList?.map((equipment: any) => equipment.robot_code) || [];

    // 모든 장비의 상태 정보를 한 번에 가져오기 (robot_code 기준)
    const { data: allStatusData } = await supabase
      .from("equipment_status")
      .select("*")
      .in("robot_code", robotCodes)
      .order("updated_at", { ascending: false });

    // 금일 투입량: created_at 기준 집계 RPC 사용 (KST)
    const { data: todayGrouped } = await supabase.rpc(
      "get_today_inputs_by_created",
      { robot_codes: robotCodes, tz: "Asia/Seoul" }
    );

    // 누적 투입량을 robot_code별로 집계하여 가져오기 (DB 집계 함수 사용)
    const { data: groupedTotals } = await supabase.rpc("get_total_inputs", {
      robot_codes: robotCodes,
    });

    // 각 장비별로 최신 상태 정보 매핑
    const statusMap = new Map();
    allStatusData?.forEach((status: any) => {
      if (!statusMap.has(status.robot_code)) {
        statusMap.set(status.robot_code, status);
      }
    });

    // 각 장비별로 금일 투입량 맵 구성
    const todayInputMap = new Map();
    robotCodes.forEach((code) => todayInputMap.set(code, 0));
    todayGrouped?.forEach((row: any) => {
      todayInputMap.set(row.robot_code, parseFloat(row.total_amount || "0"));
    });

    // 각 장비별로 누적 투입량 맵 구성
    const totalInputMap = new Map();
    robotCodes.forEach((code) => totalInputMap.set(code, 0));
    groupedTotals?.forEach((row: any) => {
      totalInputMap.set(row.robot_code, parseFloat(row.total_amount || "0"));
    });

    // 최종 데이터 구성
    const enrichedData = [];

    for (const equipment of equipmentList || []) {
      const latestStatus = statusMap.get(equipment.robot_code) || null;
      const todayTotal = todayInputMap.get(equipment.robot_code) || 0;
      const totalAmount = totalInputMap.get(equipment.robot_code) || 0;

      enrichedData.push({
        ...equipment,
        latest_status: latestStatus,
        today_input_amount: todayTotal,
        total_input_amount: totalAmount,
      });
    }

    return NextResponse.json({ data: enrichedData }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
