"use client";

import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { RegionalData } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export function RegionalPieChart() {
  const regions: RegionalData[] = useMemo(
    () => [
      { name: '대야동', value: 99.81, color: '#0E8FEB' },
      { name: '계수동', value: 33.07, color: '#0E42EB' },
      { name: '신천동', value: 37.78, color: '#3CC3DF' },
      { name: '신현동', value: 47.53, color: '#4CA8FF' },
      { name: '은행동', value: 60.51, color: '#537FF1' },
      { name: '매화동', value: 85.5, color: '#001E81' },
      { name: '미산동', value: 67.08, color: '#55CFFF' },
      { name: '목감동', value: 47.97, color: '#369EFF' },
      { name: '과림동', value: 39.1, color: '#0372C6' },
      { name: '무지내동', value: 64.12, color: '#7B95C7' },
      { name: '군자동', value: 84.69, color: '#4584EA' },
      { name: '거모동', value: 78.02, color: '#428ED0' },
      { name: '월곶동', value: 36, color: '#55AEC6' },
      { name: '능곡동', value: 32, color: '#3BF4D5' },
      { name: '장현동', value: 5, color: '#00E6FF' }
    ],
    []
  );

  const total = useMemo(
    () => regions.reduce((acc, cur) => acc + cur.value, 0),
    [regions]
  );

  const data = useMemo(
    () => ({
      labels: regions.map((r) => r.name),
      datasets: [
        {
          label: '지역별 수거량',
          data: regions.map((r) => r.value),
          backgroundColor: regions.map((r) => r.color),
          borderColor: '#ffffff',
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
      cutout: '55%',
      layout: { 
        padding: {
          top: 40,
          bottom: 40,
          left: 40,
          right: 40
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value = ctx.raw as number;
              const percent = total ? ((value / total) * 100).toFixed(1) : '0';
              return `${ctx.label}: ${value.toFixed(2)}kg (${percent}%)`;
            },
          },
        },
        datalabels: {
          color: '#374151',
          align: 'end',
          anchor: 'end',
          offset: 15,
          clamp: true,
          formatter: (_: unknown, ctx) => {
            const idx = ctx.dataIndex;
            const name = regions[idx]?.name ?? '';
            const value = regions[idx]?.value ?? 0;
            return `${name}\n${value.toFixed(2)}`;
          },
          textStrokeColor: '#ffffff',
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

  // 중앙 합계 텍스트 플러그인
  const centerTextPlugin = useMemo(() => ({
    id: 'centerText',
    afterDraw: (chart: ChartJS) => {
      const { ctx, chartArea } = chart as unknown as {
        ctx: CanvasRenderingContext2D;
        chartArea: { left: number; right: number; top: number; bottom: number };
      };
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.font = '600 20px ui-sans-serif, system-ui, -apple-system';
      ctx.fillStyle = 'rgba(39,39,42,0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${total.toFixed(2)}kg`, centerX, centerY);
      ctx.restore();
    },
  }), [total]);

  return (
    <div className="flex gap-3 items-center p-2 w-full bg-white max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:w-full max-sm:max-w-[350px] justify-between">
      <div className="relative shrink-0 h-[520px] w-[500px] max-md:w-full max-md:max-w-[420px] max-sm:w-full max-sm:max-w-[280px]">
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
      {/* Legends */}
      <div className="flex flex-col gap-1 justify-evenly items-start px-3 w-full bg-stone-50 max-sm:px-2 h-full max-w-[110px] ">
        {regions.map((region) => (
          <div key={region.name} className="flex gap-1 items-center p-1 w-full max-sm:p-0.5 max-sm:text-xs">
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
