import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";
import { decryptPassword } from "@/components/lib/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, encrypted_password")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const email = (profile as any).email as string | null;
    const encrypted = (profile as any).encrypted_password as string | null;
    const password = encrypted ? decryptPassword(encrypted) : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Required profile data missing" },
        { status: 400 }
      );
    }

    const barcodeData = `${email}\t${password}`;

    const width = 400;
    const height = 100;
    const canvas = createCanvas(width, height);

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
