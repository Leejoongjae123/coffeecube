"use client";

import React, { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function MonthlyChart() {
  const monthlyData = [44, 66, 78, 48, 54, 23, 20, 35, 81, 23, 45, 68];
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const [hoveredData, setHoveredData] = useState<{ month: string; value: number; x: number; y: number } | null>(null);
  const chartRef = useRef<ChartJS<'bar'> | null>(null);

  // 라운드 바 플러그인
  const roundedBarPlugin: Plugin<'bar'> = {
    id: 'roundedBar',
    beforeDraw: (chart) => {
      const { ctx } = chart;
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar) => {
          // Chart.js BarElement 속성에 안전하게 접근
          const barElement = bar as unknown as Record<string, number>;
          const x = barElement.x || 0;
          const y = barElement.y || 0;
          const base = barElement.base || 0;
          const width = barElement.width || 0;
          const radius = width / 2; // 완전히 둥근 탑
          
          ctx.save();
          ctx.fillStyle = dataset.backgroundColor as string;
          
          // 라운드 탑 바 그리기
          ctx.beginPath();
          ctx.roundRect(x - width / 2, y, width, base - y, [radius, radius, 0, 0]);
          ctx.fill();
          
          ctx.restore();
        });
      });
    }
  };

  const data = {
    labels: months,
    datasets: [
      {
        label: '수거량 (kg)',
        data: monthlyData,
        backgroundColor: '#0ea5e9', // sky-500
        borderColor: '#0ea5e9',
        borderWidth: 0,
        borderRadius: {
          topLeft: 50,
          topRight: 50,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
        maxBarThickness: 40,
        datalabels: {
          display: false, // 데이터셋 레벨에서 데이터 라벨 비활성화
        },
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // 기본 툴팁 비활성화
      },
      datalabels: {
        display: false, // 데이터 라벨 완전 비활성화
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(15, 23, 42, 0.1)', // slate-950 bg-opacity-10
          lineWidth: 1,
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12,
          },
        },
        border: {
          display: true,
          color: 'rgba(113, 113, 122, 1)', // zinc-500
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          display: true,
          color: 'rgba(15, 23, 42, 0.1)', // slate-950 bg-opacity-10
          lineWidth: 1,
        },
        ticks: {
          stepSize: 20,
          color: 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12,
          },
          callback: function(value) {
            return value;
          },
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        backgroundColor: '#0ea5e9',
      },
    },
    onHover: (event, elements) => {
      if (elements.length > 0 && chartRef.current) {
        const element = elements[0];
        const dataIndex = element.index;
        const chart = chartRef.current;
        const meta = chart.getDatasetMeta(0);
        const barElement = meta.data[dataIndex];
        
        // 캔버스 좌표를 컨테이너 좌표로 변환
        
        setHoveredData({
          month: months[dataIndex],
          value: monthlyData[dataIndex],
          x: barElement.x,
          y: barElement.y
        });
      } else {
        setHoveredData(null);
      }
    },
  };

  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-4 w-full h-[455px] max-w-[794px] max-md:w-full max-md:max-w-[650px] max-sm:p-4 max-sm:w-full max-sm:h-[300px] max-sm:max-w-[400px]">
      <div className="relative flex flex-col flex-1 gap-0 items-start w-full max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:w-full max-sm:max-w-[350px]">
        {/* 커스텀 툴팁 - 막대기 끝에 위치 */}
        {hoveredData && (
          <div 
            className="absolute inline-flex flex-col gap-1 items-center px-4 py-3 rounded-lg bg-neutral-900 bg-opacity-90 z-20 shadow-lg border border-neutral-700 pointer-events-none"
            style={{
              left: `${hoveredData.x}px`,
              top: `${hoveredData.y - 10}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="text-sm font-bold text-white">
              2025년 {hoveredData.month}
            </div>
            <div className="text-sm font-medium text-sky-300">
              수거량: {hoveredData.value}kg
            </div>
          </div>
        )}
        
        <div className="flex flex-1 w-full h-[400px] mt-4">
          <Bar 
            ref={chartRef}
            data={data} 
            options={options} 
            plugins={[roundedBarPlugin]}
          />
        </div>
      </div>
    </div>
  );
}
