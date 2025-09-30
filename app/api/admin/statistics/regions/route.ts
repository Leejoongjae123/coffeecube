import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type PeriodKey = "monthly" | "weekly" | "daily";

const getWeekKey = (isoDate: string) => {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) {
    return isoDate.slice(0, 10);
  }
  const year = d.getFullYear();
  const start = new Date(year, 0, 1);
  const diffDays = Math.floor((d.getTime() - start.getTime()) / 86400000) + 1;
  const week = Math.ceil(diffDays / 7);
  return `${year}-${String(week).padStart(2, "0")}`; // YYYY-WW
};

const getGroupKey = (isoDate: string, period: PeriodKey) => {
  if (period === "monthly") return isoDate.slice(0, 7); // YYYY-MM
  if (period === "weekly") return getWeekKey(isoDate); // YYYY-WW
  return isoDate.slice(0, 10); // YYYY-MM-DD
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const period = (url.searchParams.get("period") || "monthly") as PeriodKey;
    const method = url.searchParams.get("method") || "both"; // robot | visit | both

    const now = new Date();
    const endDate = now.toISOString().slice(0, 10);
    const aYearAgo = new Date(now);
    aYearAgo.setFullYear(now.getFullYear() - 1);
    const startDate = aYearAgo.toISOString().slice(0, 10);

    const supabase = await createClient();

    // input_records (비니봇)
    let robotPromise: Promise<any> = Promise.resolve({ data: [], error: null });
    if (method === "robot" || method === "both") {
      robotPromise = supabase
        .from("input_records")
        .select(
          `
            input_date,
            input_amount,
            robot_code,
            equipment_list(region_dong)
          `
        )
        .gte("input_date", startDate)
        .lte("input_date", endDate)
        .order("input_date", { ascending: false });
    }

    // extract_history (방문수거)
    let visitPromise: Promise<any> = Promise.resolve({ data: [], error: null });
    if (method === "visit" || method === "both") {
      visitPromise = supabase
        .from("extract_history")
        .select(
          `
            visit_date,
            collection_amount,
            robot_code,
            equipment_list(region_dong)
          `
        )
        .gte("visit_date", startDate)
        .lte("visit_date", endDate)
        .order("visit_date", { ascending: false });
    }

    const [robotRes, visitRes] = await Promise.all([
      robotPromise,
      visitPromise,
    ]);

    if (robotRes?.error || visitRes?.error) {
      return NextResponse.json(
        { error: "데이터 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    type Row = {
      date: string;
      regionDong: string;
      amount: number;
    };

    const rows: Row[] = [];

    const robotRows: Row[] = (robotRes?.data || []).map((r: any) => ({
      date: getGroupKey(String(r.input_date), period),
      regionDong: r?.equipment_list?.region_dong || "기타",
      amount: parseFloat(r?.input_amount || "0"),
    }));

    const visitRows: Row[] = (visitRes?.data || []).map((r: any) => ({
      date: getGroupKey(String(r.visit_date), period),
      regionDong: r?.equipment_list?.region_dong || "기타",
      amount: parseFloat(r?.collection_amount || "0"),
    }));

    rows.push(...robotRows, ...visitRows);

    // region_dong 기준 집계 (최근 1년 합계)
    const regionTotals = new Map<string, number>();
    // 기간별(dateKey) + region_dong 집계
    const seriesByDate = new Map<string, Map<string, number>>();

    rows.forEach((row) => {
      const regionKey = row.regionDong || "기타";
      const amount = Number.isFinite(row.amount) ? row.amount : 0;
      // 전체 합계
      regionTotals.set(regionKey, (regionTotals.get(regionKey) || 0) + amount);
      // 시계열 합계
      const dateKey = row.date;
      if (!seriesByDate.has(dateKey)) {
        seriesByDate.set(dateKey, new Map<string, number>());
      }
      const dateMap = seriesByDate.get(dateKey)!;
      dateMap.set(regionKey, (dateMap.get(regionKey) || 0) + amount);
    });

    const totals = Array.from(regionTotals.entries())
      .map(([regionDong, amount]) => ({ regionDong, amount }))
      .sort((a, b) => b.amount - a.amount);

    const series = Array.from(seriesByDate.entries())
      .map(([dateKey, map]) => ({
        dateKey,
        regions: Array.from(map.entries())
          .map(([regionDong, amount]) => ({ regionDong, amount }))
          .sort((a, b) => b.amount - a.amount),
      }))
      .sort((a, b) =>
        a.dateKey < b.dateKey ? -1 : a.dateKey > b.dateKey ? 1 : 0
      );

    return NextResponse.json(
      {
        totals,
        series,
        range: { startDate, endDate },
        period,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
