"use client";

import React from 'react';

export function MonthlyChart() {
  const monthlyData = [44, 66, 78, 48, 54, 23, 20, 35, 81, 23, 45, 68];
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  
  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-4 w-full h-[455px] max-w-[794px] max-md:w-full max-md:max-w-[650px] max-sm:p-4 max-sm:w-full max-sm:h-[300px] max-sm:max-w-[400px]">
      <div className="flex flex-col flex-1 gap-0 items-start w-full max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:w-full max-sm:max-w-[350px]">
        <div className="flex flex-1 items-center w-full">
          {/* Y-axis */}
          <div className="flex flex-col justify-between items-end px-1 py-0 h-full">
            {[100, 80, 60, 40, 20, 0].map((value) => (
              <div key={value} className="text-xs text-black text-opacity-70">
                {value}
              </div>
            ))}
          </div>
          
          {/* Chart Area */}
          <div className="relative flex-1 h-full">
            {/* Grid lines */}
            <div className="absolute top-0 left-0 flex flex-col justify-between items-start px-px py-1.5 w-full h-[394px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="w-full h-px bg-slate-950 bg-opacity-10" />
              ))}
            </div>
            
            {/* Vertical grid lines */}
            <div className="absolute top-0 left-0 flex justify-between items-start px-px py-1.5 w-full h-[394px]">
              {Array.from({ length: 11 }).map((_, i) => (
                <div key={i} className="w-px bg-slate-950 bg-opacity-10 h-[382px]" />
              ))}
            </div>
            
            {/* Bars */}
            <div className="absolute left-0 top-1.5 flex items-start w-full border-b border-solid border-b-zinc-500 h-[381px]">
              <div className="w-px h-[381px]" />
              {monthlyData.map((value, index) => (
                <div key={index} className="flex flex-1 gap-0.5 items-start px-2.5 py-0 h-full">
                  <div className="relative flex-1 h-full">
                    <div className="absolute bottom-0 left-0 w-full" style={{ height: `${(value / 100) * 381}px` }}>
                      <div className="w-full bg-sky-500 rounded-t-[200px]" style={{ height: `${(value / 100) * 381}px` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tooltip */}
            <div className="absolute right-[20%] top-[20%] inline-flex flex-col gap-3 items-start px-3 py-2 h-16 rounded-md bg-neutral-900 bg-opacity-80 w-[118px]">
              <div className="flex flex-col gap-1 items-start w-full">
                <div className="w-full text-base font-bold text-white max-sm:text-sm">
                  2025년 9월
                </div>
                <div className="text-base font-medium text-white max-sm:text-sm">
                  수거량: 124kg
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex items-start pl-7 w-full">
          {months.map((month) => (
            <div key={month} className="flex flex-col flex-1 items-end">
              <div className="w-full text-xs text-center text-black text-opacity-70">
                {month}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
