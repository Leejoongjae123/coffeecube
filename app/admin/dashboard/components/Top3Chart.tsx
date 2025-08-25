"use client";

import React from 'react';
import type { TopRegionData } from '../types';

export function Top3Chart() {
  const topRegions: TopRegionData[] = [
    { name: '대야동', value: 99 },
    { name: '매화동', value: 85.5 },
    { name: '군자동', value: 84.69 }
  ];

  return (
    <div className="flex flex-col gap-2 items-start px-4 pt-8 pb-4 w-full bg-white h-[322px] max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:p-4 max-sm:w-full max-sm:h-[250px] max-sm:max-w-[350px]">
      <div className="flex flex-col flex-1 items-start w-full">
        {/* Scale */}
        <div className="flex justify-between items-start pl-10 w-full">
          {[0, 20, 40, 60, 80, 100].map((value) => (
            <div key={value} className="flex justify-center items-start w-4">
              <div className="text-xs text-black text-opacity-70">
                {value}
              </div>
            </div>
          ))}
        </div>
        
        {/* Chart */}
        <div className="flex flex-1 gap-0.5 items-center px-2 py-0 w-full">
          {/* Y-axis labels */}
          <div className="flex flex-col items-end px-0.5 py-0 h-full">
            {topRegions.map((region) => (
              <div key={region.name} className="flex flex-col flex-1 justify-center items-end">
                <div className="text-xs text-black text-opacity-70">
                  {region.name}
                </div>
              </div>
            ))}
          </div>
          
          {/* Bars */}
          <div className="relative flex-1 h-full">
            {/* Grid */}
            <div className="absolute top-0 left-0 flex flex-col justify-between items-start pt-px h-full w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-px bg-slate-950 bg-opacity-10 w-full" />
              ))}
            </div>
            
            {/* Bars container */}
            <div className="absolute top-0 left-px flex flex-col justify-between items-start border-b border-solid border-b-slate-950 border-b-opacity-30 h-full w-full">
              {topRegions.map((region) => (
                <div key={region.name} className="flex flex-1 gap-0.5 justify-center items-center h-full w-full">
                  <div className="relative w-6 h-full">
                    <div className="absolute top-0 left-0 w-6 opacity-80 bg-slate-300 bg-opacity-40 h-full" />
                    <div className="flex absolute top-0 left-0 flex-col justify-center items-center w-6 h-full">
                      <div 
                        className="absolute top-0 -left-px shrink-0 w-6 bg-sky-500 opacity-60"
                        style={{ height: `${region.value}%` }}
                      />
                    </div>
                    <div className="absolute -right-12 top-2 text-xs text-black text-opacity-70">
                      {region.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex flex-wrap justify-center content-start items-start w-full max-sm:px-1.5 max-sm:py-2.5">
        <div className="flex flex-wrap gap-0 content-start items-start px-2 py-0">
          <div className="flex gap-1 items-center p-1 max-sm:p-0.5 max-sm:text-xs">
            <div className="text-xs text-black text-opacity-70">
              * 2025년 기준
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
