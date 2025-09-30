"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import type { TopRegionData, Top3ChartProps } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export function Top3Chart({
  period = "월별",
  method = "비니봇",
}: Top3ChartProps) {
  const [topRegions, setTopRegions] = useState<TopRegionData[]>([]);

  useEffect(() => {
    const fetchTop3 = async () => {
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
        const top = totals
          .slice(0, 3)
          .map((r) => ({ name: r.regionDong || "기타", value: r.amount }));
        setTopRegions(top);
      } catch {
        setTopRegions([]);
      }
    };
    fetchTop3();
  }, [period, method]);

  const data = {
    labels: topRegions.map((region) => region.name),
    datasets: [
      {
        label: "수거량",
        data: topRegions.map((region) => region.value),
        backgroundColor: ["#0E8FEB", "#79C7FF", "#ABB7C0"],
        borderColor: ["#0E8FEB", "#79C7FF", "#ABB7C0"],
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  const maxValue = useMemo(() => {
    const v = topRegions.length
      ? Math.max(...topRegions.map((r) => r.value))
      : 0;
    const rounded = Math.ceil(v / 10) * 10;
    return Math.max(rounded, 10);
  }, [topRegions]);

  const options: ChartOptions<"bar"> = {
    indexAxis: "y" as const, // 수평 막대 차트
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 48,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${Number(context.parsed.x).toFixed(1)}kg`;
          },
        },
      },
      datalabels: {
        anchor: "end",
        align: "right",
        color: "#374151",
        font: {
          size: 12,
          weight: 600,
        },
        formatter: (value) => `${Number(value).toFixed(1)}kg`,
        offset: 8,
        clip: false,
        clamp: true,
      },
    },
    scales: {
      x: {
        position: "top", // x축을 상단으로 이동
        beginAtZero: true,
        max: maxValue,
        ticks: {
          stepSize: 20,
          callback: function (value) {
            return Number(value as number).toFixed(1);
          },
        },
        grid: {
          color: "rgba(156, 163, 175, 0.3)",
          lineWidth: 1,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
            weight: 500,
          },
          color: "#374151",
        },
      },
    },
    elements: {
      bar: {
        borderRadius: {
          topRight: 8,
          bottomRight: 8,
          topLeft: 0,
          bottomLeft: 0,
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 items-start px-6 pt-6 pb-4 w-full bg-white h-[350px] max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:p-4 max-sm:w-full max-sm:h-[300px] max-sm:max-w-[350px] rounded-lg">
      {/* Chart Container */}
      <div className="flex-1 w-full">
        <Bar data={data} options={options} />
      </div>

      {/* Footer */}
      <div className="flex justify-center w-full mt-2">
        <div className="text-xs text-gray-500">최근 1년간</div>
      </div>
    </div>
  );
}
