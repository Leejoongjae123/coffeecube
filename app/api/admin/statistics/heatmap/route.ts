import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type PeriodKey = "monthly" | "weekly" | "daily";
type MethodKey = "robot" | "visit" | "both";

interface HeatmapCell {
  monthIndex?: number; // 0~11 (오래된 -> 최신)
  columnIndex?: number; // 월/주 모드에서 사용: 0~11
  dayIndex?: number; // 0~30
  weekIndex: number; // 0~4
  amount: number;
  hasData: boolean;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const period = (url.searchParams.get("period") || "monthly") as PeriodKey;
  const method = (url.searchParams.get("method") || "both") as MethodKey;

  const now = new Date();
  const latestMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const months: Array<{ year: number; month: number; index: number }> = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(
      latestMonth.getFullYear(),
      latestMonth.getMonth() - i,
      1
    );
    months.push({ year: d.getFullYear(), month: d.getMonth(), index: 11 - i });
  }

  // 조회 기간 설정
  const oldest = months[0];
  const latest = months[months.length - 1];

  const startDateMonthly = `${oldest.year}-${String(oldest.month + 1).padStart(
    2,
    "0"
  )}-01`;
  const endDateMonthly = (() => {
    const end = new Date(latest.year, latest.month + 1, 0);
    return `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(end.getDate()).padStart(2, "0")}`;
  })();

  // 일별 모드는 최근 5개월만 필요
  const dailyStartMonthIdx = Math.max(0, months.length - 5);
  const dailyStart = months[dailyStartMonthIdx];
  const startDateDaily = `${dailyStart.year}-${String(
    dailyStart.month + 1
  ).padStart(2, "0")}-01`;

  const supabase = await createClient();

  const needRobot = method === "robot" || method === "both";
  const needVisit = method === "visit" || method === "both";

  const dateRangeStart = period === "daily" ? startDateDaily : startDateMonthly;
  const dateRangeEnd = endDateMonthly;

  let robotPromise: Promise<any> = Promise.resolve({ data: [], error: null });
  if (needRobot) {
    robotPromise = supabase
      .from("input_records")
      .select("input_date,input_amount")
      .gte("input_date", dateRangeStart)
      .lte("input_date", dateRangeEnd)
      .order("input_date", { ascending: true });
  }

  let visitPromise: Promise<any> = Promise.resolve({ data: [], error: null });
  if (needVisit) {
    visitPromise = supabase
      .from("extract_history")
      .select("visit_date,collection_amount")
      .gte("visit_date", dateRangeStart)
      .lte("visit_date", dateRangeEnd)
      .order("visit_date", { ascending: true });
  }

  const [robotRes, visitRes] = await Promise.all([robotPromise, visitPromise]);

  if ((robotRes && robotRes.error) || (visitRes && visitRes.error)) {
    return NextResponse.json(
      { error: "데이터 조회에 실패했습니다." },
      { status: 500 }
    );
  }

  const findMonthIndex = (d: Date): number => {
    for (let i = 0; i < months.length; i++) {
      if (
        months[i].year === d.getFullYear() &&
        months[i].month === d.getMonth()
      ) {
        return i;
      }
    }
    return -1;
  };

  const addAmount = (map: Map<string, number>, key: string, amount: number) => {
    const prev = map.get(key) || 0;
    map.set(key, prev + (Number.isFinite(amount) ? amount : 0));
  };

  const weeklyBuckets = new Map<string, number>(); // key: `${monthIndex}-${weekIndex}`
  const dailyBuckets = new Map<string, number>(); // key: `${monthIndex}-${dayIndex}`

  const processRecord = (isoDate: string, amountValue: any) => {
    if (!isoDate) {
      return;
    }
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) {
      return;
    }
    const monthIndex = findMonthIndex(d);
    if (monthIndex < 0) {
      return;
    }

    const day = d.getDate();
    const weekIndex = Math.min(4, Math.floor((day - 1) / 7));
    const dayIndex = Math.max(0, Math.min(30, day - 1));
    const amount = parseFloat(String(amountValue || "0"));

    // 월/주 모드 공통 집계
    addAmount(weeklyBuckets, `${monthIndex}-${weekIndex}`, amount);

    // 일별 모드 집계 (최근 5개월만 시각화됨)
    if (monthIndex >= dailyStartMonthIdx) {
      addAmount(dailyBuckets, `${monthIndex}-${dayIndex}`, amount);
    }
  };

  (robotRes?.data || []).forEach((r: any) =>
    processRecord(r.input_date, r.input_amount)
  );
  (visitRes?.data || []).forEach((r: any) =>
    processRecord(r.visit_date, r.collection_amount)
  );

  const cells: HeatmapCell[] = [];

  if (period === "daily") {
    // y: 최근 5개월(글로벌 monthIndex 사용), x: 1~31일(dayIndex 0~30)
    dailyBuckets.forEach((value, key) => {
      const [mIdxStr, dIdxStr] = key.split("-");
      const mIdx = parseInt(mIdxStr, 10);
      const dIdx = parseInt(dIdxStr, 10);
      const amount = Number.isFinite(value) ? value : 0;
      cells.push({
        monthIndex: mIdx,
        dayIndex: dIdx,
        weekIndex: 0,
        amount,
        hasData: amount > 0,
      });
    });
  } else {
    // 월별/주별: x=월(0~11), y=주차(0~4)
    weeklyBuckets.forEach((value, key) => {
      const [mIdxStr, wIdxStr] = key.split("-");
      const cIdx = parseInt(mIdxStr, 10);
      const wIdx = parseInt(wIdxStr, 10);
      const amount = Number.isFinite(value) ? value : 0;
      cells.push({
        columnIndex: cIdx,
        weekIndex: wIdx,
        amount,
        hasData: amount > 0,
      });
    });
  }

  return NextResponse.json({ data: cells }, { status: 200 });
}
