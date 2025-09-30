import { NextRequest, NextResponse } from "next/server";

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json();

    if (!keyword || !keyword.trim()) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    // 카카오 Local API 키워드로 장소 검색
    const kakaoApiKey = process.env.KAKAO_REST_API_KEY || ""; // 카카오 REST API 키

    if (!kakaoApiKey) {
      // API 키가 없으면 간단한 더미 데이터 반환 (개발용)
      const dummyResults = [
        {
          roadAddress: `${keyword.trim()} 123`,
          jibunAddress: `${keyword.trim()} 123번지`,
          zipcode: "12345",
          category: "도로명주소",
          placeName: `${keyword.trim()} 건물`,
        },
        {
          roadAddress: `${keyword.trim()} 456`,
          jibunAddress: `${keyword.trim()} 456번지`,
          zipcode: "12346",
          category: "도로명주소",
          placeName: `${keyword.trim()} 센터`,
        },
      ];

      return NextResponse.json({
        addresses: dummyResults,
        total: dummyResults.length,
      });
    }

    const encodedKeyword = encodeURIComponent(keyword.trim());
    const apiUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodedKeyword}&size=15`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `KakaoAK ${kakaoApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "주소 검색 API 호출 실패" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // 카카오 API 응답을 우리 형식으로 변환
    const addresses =
      data.documents?.map((place: any) => ({
        roadAddress: place.road_address_name || place.address_name,
        jibunAddress: place.address_name,
        zipcode: place.zone_no || "",
        category: place.category_group_name || "기타",
        placeName: place.place_name,
      })) || [];

    return NextResponse.json({
      addresses,
      total: data.meta?.total_count || addresses.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
