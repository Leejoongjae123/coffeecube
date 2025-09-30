"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { RegionalData, RegionalPieChartProps } from "../types";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export function RegionalPieChart({
  period = "월별",
  method = "비니봇",
}: RegionalPieChartProps) {
  const [regions, setRegions] = useState<RegionalData[]>([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const url = new URL(
          "/api/admin/statistics/regions",
          window.location.origin
        );
        const periodKey =
          period === "월별"
            ? "monthly"
            : period === "주별"
            ? "weekly"
            : "daily";
        const methodKey =
          method === "비니봇"
            ? "robot"
            : method === "방문수거"
            ? "visit"
            : "both";
        url.searchParams.set("period", periodKey);
        url.searchParams.set("method", methodKey);
        const res = await fetch(url.toString(), { cache: "no-store" });
        const json = await res.json();
        const totals: Array<{ regionDong: string; amount: number }> =
          json?.totals || [];
        // 상위 15개만 사용, 색상 팔레트 순환
        const palette = [
          "#0E8FEB",
          "#0E42EB",
          "#3CC3DF",
          "#4CA8FF",
          "#537FF1",
          "#001E81",
          "#55CFFF",
          "#369EFF",
          "#0372C6",
          "#7B95C7",
          "#4584EA",
          "#428ED0",
          "#55AEC6",
          "#3BF4D5",
          "#00E6FF",
        ];
        const data: RegionalData[] = totals.slice(0, 15).map((row, idx) => ({
          name: row.regionDong || "기타",
          value: Number.isFinite(row.amount) ? row.amount : 0,
          color: palette[idx % palette.length],
        }));
        setRegions(data);
      } catch {
        setRegions([]);
      }
    };
    fetchRegions();
  }, [period, method]);

  const total = useMemo(
    () => regions.reduce((acc, cur) => acc + cur.value, 0),
    [regions]
  );

  const data = useMemo(
    () => ({
      labels: regions.map((r) => r.name),
      datasets: [
        {
          label: "지역별 수거량",
          data: regions.map((r) => r.value),
          backgroundColor: regions.map((r) => r.color),
          borderColor: "#ffffff",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [regions]
  );

  const options: React.ComponentProps<typeof Doughnut>["options"] = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%",
      layout: {
        padding: {
          top: 40,
          bottom: 40,
          left: 40,
          right: 40,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = ctx.raw as number;
              const percent = total ? ((value / total) * 100).toFixed(1) : "0";
              return `${ctx.label}: ${value.toFixed(1)}kg (${percent}%)`;
            },
          },
        },
        datalabels: {
          color: "#374151",
          align: "end",
          anchor: "end",
          offset: 15,
          clamp: true,
          formatter: (_: unknown, ctx) => {
            const idx = ctx.dataIndex;
            const name = regions[idx]?.name ?? "";
            const value = regions[idx]?.value ?? 0;
            return `${name}\n${value.toFixed(1)}`;
          },
          textStrokeColor: "#ffffff",
          textStrokeWidth: 3,
          font: {
            size: 11,
            weight: 600,
          },
        },
      },
    }),
    [regions, total]
  );

  // 중앙 합계 텍스트 플러그인 (차트의 실제 데이터에서 합계 계산)
  const centerTextPlugin = useMemo(
    () => ({
      id: "centerText",
      afterDatasetsDraw: (chart: ChartJS) => {
        const ctx: CanvasRenderingContext2D | undefined = (
          chart as unknown as {
            ctx?: CanvasRenderingContext2D;
          }
        ).ctx;
        const area = (
          chart as unknown as {
            chartArea?: {
              left: number;
              right: number;
              top: number;
              bottom: number;
            };
          }
        ).chartArea;
        if (!ctx || !area) {
          return;
        }

        const dataset = (
          chart.data as unknown as {
            datasets?: Array<{ data?: unknown[] }>;
          }
        )?.datasets?.[0];
        const values: number[] = Array.isArray(dataset?.data)
          ? dataset.data.map((v: unknown) =>
              typeof v === "number" ? v : Number(v) || 0
            )
          : [];
        const sum = values.reduce((acc: number, cur: number) => acc + cur, 0);

        const centerX = (area.left + area.right) / 2;
        const centerY = (area.top + area.bottom) / 2;
        ctx.save();
        ctx.font = "600 20px ui-sans-serif, system-ui, -apple-system";
        ctx.fillStyle = "rgba(39,39,42,0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${sum.toFixed(1)}kg`, centerX, centerY);
        ctx.restore();
      },
    }),
    []
  );

  return (
    <div className="flex gap-3 items-center p-2 w-full bg-white max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:w-full max-sm:max-w-[350px] justify-between">
      <div className="relative shrink-0 h-[520px] w-[500px] max-md:w-full max-md:max-w-[420px] max-sm:w-full max-sm:max-w-[280px]">
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
      {/* Legends */}
      <div className="flex flex-col gap-1 justify-evenly items-start px-3 w-full bg-stone-50 max-sm:px-2 h-full max-w-[110px] ">
        {regions.map((region) => (
          <div
            key={region.name}
            className="flex gap-1 items-center  w-full max-sm:p-0.5 max-sm:text-xs"
          >
            <div className="flex justify-center items-center w-4 h-4">
              <div
                className="w-[9px] h-[9px] rounded-full border border-white"
                style={{ backgroundColor: region.color }}
              />
            </div>
            <div className="text-xs text-black text-opacity-70">
              {region.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
