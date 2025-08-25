"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import type { TopRegionData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export function Top3Chart() {
  const topRegions: TopRegionData[] = [
    { name: '대야동', value: 99 },
    { name: '매화동', value: 85.5 },
    { name: '군자동', value: 84.69 }
  ];

  const data = {
    labels: topRegions.map(region => region.name),
    datasets: [
      {
        label: '수거량',
        data: topRegions.map(region => region.value),
        backgroundColor: ['#0E8FEB', '#79C7FF', '#ABB7C0'],
        borderColor: ['#0E8FEB', '#79C7FF', '#ABB7C0'],
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const, // 수평 막대 차트
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.x}kg`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'right',
        color: '#374151',
        font: {
          size: 12,
          weight: 600,
        },
        formatter: (value) => `${value}kg`,
        offset: 8,
      }
    },
    scales: {
      x: {
        position: 'top', // x축을 상단으로 이동
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function(value) {
            return value;
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
          lineWidth: 1,
        }
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
          color: '#374151',
        }
      }
    },
    elements: {
      bar: {
        borderRadius: {
          topRight: 8,
          bottomRight: 8,
          topLeft: 0,
          bottomLeft: 0,
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 items-start px-6 pt-6 pb-4 w-full bg-white h-[350px] max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:p-4 max-sm:w-full max-sm:h-[300px] max-sm:max-w-[350px] rounded-lg">
      {/* Chart Container */}
      <div className="flex-1 w-full">
        <Bar data={data} options={options} />
      </div>
      
      {/* Footer */}
      <div className="flex justify-center w-full mt-2">
        <div className="text-xs text-gray-500">
          2025년 8월 기준
        </div>
      </div>
    </div>
  );
}
