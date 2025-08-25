"use client";

import React from 'react';
import type { RegionalData } from '../types';

export function RegionalPieChart() {
  const regions: RegionalData[] = [
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
  ];

  return (
    <div className="flex gap-3 items-start p-2 w-full bg-white max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:w-full max-sm:max-w-[350px]">
      <div className="relative shrink-0 h-[446px] w-[604px] max-md:w-full max-md:max-w-[500px] max-sm:w-full max-sm:max-w-[300px]">
        {/* Pie Chart SVG Placeholder */}
        <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
          <div className="text-2xl font-semibold text-zinc-800 text-opacity-90">
            818.18kg
          </div>
        </div>
      </div>
      
      {/* Legends */}
      <div className="flex flex-col gap-1 justify-center items-start px-2.5 py-5 w-full bg-stone-50 max-sm:px-1.5 max-sm:py-2.5">
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
