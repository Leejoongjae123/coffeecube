import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { decryptPassword } from "@/components/lib/crypto";
import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: me, error: meErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (meErr || me?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admin = createAdminClient();
    const { data: profile, error: profErr } = await admin
      .from("profiles")
      .select("username, encrypted_password")
      .eq("id", id)
      .single();

    if (profErr || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const username = (profile as any).username as string | null;
    const encrypted = (profile as any).encrypted_password as string | null;
    const password = encrypted ? decryptPassword(encrypted) : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Required profile data missing" },
        { status: 400 }
      );
    }

    // 바코드 데이터: 아이디 + 탭 + 비밀번호
    const barcodeData = `${username}\t${password}`;

    // 바코드 전용 캔버스 생성
    const width = 400;
    const height = 100;
    const canvas = createCanvas(width, height);

    // JsBarcode로 바코드 그리기 (CODE128)
    JsBarcode(canvas as unknown as any, barcodeData, {
      format: "CODE128",
      width: 2,
      height: 80,
      displayValue: false,
      background: "#ffffff",
      lineColor: "#000000",
      margin: 10,
    } as any);

    const png = canvas.toBuffer("image/png");
    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (_err) {
    return NextResponse.json(
      { error: "Barcode generation failed" },
      { status: 500 }
    );
  }
}
