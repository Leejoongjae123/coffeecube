import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { encryptPassword } from "@/components/lib/crypto";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || "active"; // active, withdrawn
    const sortBy = searchParams.get("sortBy") || "register_date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const searchCondition = searchParams.get("searchCondition");
    const searchQuery = searchParams.get("searchQuery");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // RPC 함수를 사용하여 사용자 통계 데이터 가져오기
    const { data: userStats, error } = await supabase.rpc("get_user_stats", {
      user_ids: null, // 모든 사용자
      status_filter: status,
    });

    if (error) {
      return NextResponse.json(
        { error: "사용자 데이터를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }

    // 필터링 및 정렬 적용
    let filteredData = userStats || [];

    // 날짜 필터링
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // 시작일의 00:00:00으로 설정

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // 종료일의 23:59:59.999으로 설정

      filteredData = filteredData.filter((user: { created_at?: string }) => {
        if (!user.created_at) {
          return false;
        }
        const createdDate = new Date(user.created_at);
        return createdDate >= start && createdDate <= end;
      });
    }

    // 검색 조건 필터링
    if (searchCondition && searchQuery) {
      filteredData = filteredData.filter(
        (user: {
          username?: string;
          email?: string;
          phone_no?: string;
          full_name?: string;
        }) => {
          const query = searchQuery.toLowerCase();

          if (searchCondition === "아이디") {
            return (
              user.username?.toLowerCase().includes(query) ||
              user.email?.toLowerCase().includes(query)
            );
          } else if (searchCondition === "휴대폰번호") {
            return user.phone_no?.includes(searchQuery);
          } else if (searchCondition === "전체") {
            // 전체 검색 - email과 phone_no 기준으로 모두 검색
            return (
              user.email?.toLowerCase().includes(query) ||
              user.phone_no?.includes(searchQuery)
            );
          } else {
            // 기타 조건
            return (
              user.username?.toLowerCase().includes(query) ||
              user.full_name?.toLowerCase().includes(query) ||
              user.email?.toLowerCase().includes(query) ||
              user.phone_no?.includes(searchQuery)
            );
          }
        }
      );
    }

    // 정렬
    const isAscending = sortOrder === "asc" || sortOrder === "오름차순";
    filteredData.sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) => {
        let aValue, bValue;

        switch (sortBy) {
          case "last_access_date":
          case "last_at":
            aValue =
              a.last_at && typeof a.last_at === "string"
                ? new Date(a.last_at).getTime()
                : 0;
            bValue =
              b.last_at && typeof b.last_at === "string"
                ? new Date(b.last_at).getTime()
                : 0;
            break;
          case "register_date":
          case "created_at":
            aValue =
              a.created_at && typeof a.created_at === "string"
                ? new Date(a.created_at).getTime()
                : 0;
            bValue =
              b.created_at && typeof b.created_at === "string"
                ? new Date(b.created_at).getTime()
                : 0;
            break;
          case "full_name":
            aValue = typeof a.full_name === "string" ? a.full_name : "";
            bValue = typeof b.full_name === "string" ? b.full_name : "";
            break;
          case "points":
            aValue = typeof a.total_points === "number" ? a.total_points : 0;
            bValue = typeof b.total_points === "number" ? b.total_points : 0;
            break;
          default:
            aValue =
              a.created_at && typeof a.created_at === "string"
                ? new Date(a.created_at).getTime()
                : 0;
            bValue =
              b.created_at && typeof b.created_at === "string"
                ? new Date(b.created_at).getTime()
                : 0;
        }

        if (aValue < bValue) {
          return isAscending ? -1 : 1;
        }
        if (aValue > bValue) {
          return isAscending ? 1 : -1;
        }
        return 0;
      }
    );

    // 데이터 변환
    const transformedData = filteredData.map(
      (user: Record<string, unknown>, index: number) => {
        const totalPoints =
          typeof user.total_points === "number" ? user.total_points : 0;
        const totalEmission =
          typeof user.total_emission === "number" ? user.total_emission : 0;

        return {
          id: (index + 1).toString(),
          userId:
            typeof user.username === "string"
              ? user.username
              : typeof user.email === "string"
              ? user.email
              : "N/A",
          phone: typeof user.phone_no === "string" ? user.phone_no : "N/A",
          emission: totalEmission.toString(),
          points: totalPoints.toString(),
          grade:
            typeof user.grade_name === "string" ? user.grade_name : "관악산",
          joinDate:
            user.created_at && typeof user.created_at === "string"
              ? new Date(user.created_at).toLocaleDateString("ko-KR")
              : "N/A",
          lastAccess:
            user.last_at && typeof user.last_at === "string"
              ? new Date(user.last_at).toLocaleDateString("ko-KR")
              : "N/A",
          status: user.is_out ? ("withdrawn" as const) : ("active" as const),
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          originalId: user.user_id,
        };
      }
    );

    return NextResponse.json({
      success: true,
      data: transformedData,
      total: transformedData.length,
    });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 현재 사용자 권한 확인
    const supabase = await createClient();
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
    const { data: currentUserProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || currentUserProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, email, password, role } = body;

    // 새 사용자 생성인지 기존 사용자 업데이트인지 판단
    if (email && password) {
      // 새 관리자 사용자 생성
      return await createNewAdmin(email, password, role);
    } else if (id) {
      // 기존 사용자 role 업데이트
      return await updateUserRole(id, role, supabase);
    } else {
      return NextResponse.json(
        {
          error:
            "사용자 생성을 위해서는 email과 password가, 업데이트를 위해서는 id가 필요합니다.",
        },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `서버 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// 새 관리자 생성 함수
async function createNewAdmin(
  email: string,
  password: string,
  role: string = "admin"
) {
  try {
    // role 값 검증
    if (!["admin", "user"].includes(role)) {
      return NextResponse.json(
        { error: "유효하지 않은 역할입니다." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      );
    }

    // 비밀번호 검증
    if (password.length < 6) {
      return NextResponse.json(
        { error: "비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // Admin client로 새 사용자 생성
    const adminClient = createAdminClient();

    const { data, error: createError } =
      await adminClient.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // 이메일 확인을 자동으로 처리
        user_metadata: {
          role: role,
        },
      });

    if (createError) {
      if (createError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "이미 등록된 이메일입니다." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `사용자 생성 실패: ${createError.message}` },
        { status: 500 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "사용자 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    // profiles 테이블에 role 정보 및 암호화된 비밀번호 추가/업데이트
    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: data.user.id,
      email: data.user.email,
      role: role,
      encrypted_password: encryptPassword(password),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      // 사용자는 생성되었지만 프로필 생성에 실패한 경우
      // 생성된 사용자를 삭제하고 오류 반환
      await adminClient.auth.admin.deleteUser(data.user.id);
      return NextResponse.json(
        { error: `프로필 생성 실패: ${profileError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${
        role === "admin" ? "관리자" : "사용자"
      }가 성공적으로 생성되었습니다.`,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `사용자 생성 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// 기존 사용자 role 업데이트 함수
async function updateUserRole(
  id: string,
  role: string,
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  try {
    // role 값 검증
    if (!["admin", "user"].includes(role)) {
      return NextResponse.json(
        { error: "유효하지 않은 역할입니다." },
        { status: 400 }
      );
    }

    // 기존 사용자 확인
    const { data: existingUser, error: findError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", id)
      .single();

    if (findError || !existingUser) {
      return NextResponse.json(
        { error: "해당 사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // profiles 테이블에서 role 업데이트
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: role })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: `역할 업데이트 실패: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "사용자 역할이 성공적으로 업데이트되었습니다.",
      user: {
        id: existingUser.id,
        email: existingUser.email,
        role: role,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `역할 업데이트 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}
