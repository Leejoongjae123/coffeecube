"use client";

import React from 'react';

export function WeeklyHeatmap() {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const weeks = ['1주차', '2주차', '3주차', '4주차', '5주차'];
  
  const getIntensityClass = (month: number, week: number) => {
    const intensities = [
      ['bg-sky-100', 'bg-sky-100', 'bg-sky-100', 'bg-sky-100', 'bg-sky-100'],
      ['bg-sky-100', 'bg-sky-200', 'bg-sky-200', 'bg-sky-100', 'bg-sky-100'],
      ['bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-200', 'bg-sky-100'],
      ['bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-300', 'bg-sky-100'],
      ['bg-sky-100', 'bg-sky-300', 'bg-sky-500', 'bg-sky-300', 'bg-sky-100'],
      ['bg-sky-200', 'bg-sky-500', 'bg-blue-600', 'bg-sky-500', 'bg-sky-200'],
      ['bg-sky-200', 'bg-sky-500', 'bg-blue-600', 'bg-sky-500', 'bg-sky-300'],
      ['bg-sky-200', 'bg-sky-500', 'bg-blue-600', 'bg-sky-500', 'bg-sky-300'],
      ['bg-sky-200', 'bg-sky-300', 'bg-sky-500', 'bg-blue-600', 'bg-sky-500'],
      ['bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-500', 'bg-sky-300'],
      ['bg-sky-100', 'bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-200'],
      ['bg-sky-100', 'bg-sky-100', 'bg-sky-200', 'bg-sky-100', 'bg-sky-100']
    ];
    return intensities[month][week];
  };

  return (
    <div className="flex flex-col gap-6 items-center px-4 pt-8 pb-4 w-full bg-white h-[455px] max-w-[715px] max-md:w-full max-md:max-w-[600px] max-sm:p-4 max-sm:w-full max-sm:h-[300px] max-sm:max-w-[350px]">
      <div className="flex gap-1.5 items-end w-full">
        <div className="flex flex-col justify-between items-center px-2 py-2.5 h-[279px]">
          {weeks.map((week) => (
            <div key={week} className="flex gap-2.5 justify-center items-center px-3 py-1 bg-zinc-100 rounded-[100px]">
              <div className="text-base font-bold text-sky-500 max-sm:text-sm">
                {week}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-1 gap-2.5 items-center">
          {months.map((month, monthIndex) => (
            <div key={month} className="flex flex-col flex-1 gap-2.5 items-center">
              <div className="w-full text-base font-medium text-center text-neutral-600 max-sm:text-sm">
                {month}
              </div>
              {weeks.map((_, weekIndex) => (
                <div key={weekIndex} className={`w-full h-12 rounded-lg ${getIntensityClass(monthIndex, weekIndex)}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-6 justify-center items-start pl-20 w-full">
        <div className="flex flex-col flex-1 gap-3.5 items-center">
          <div className="flex gap-2 items-center pr-2.5 w-full h-[45px]">
            {['0kg', '3kg', '10kg', '20kg', '25kg'].map((weight, index) => {
              const colors = ['bg-sky-100', 'bg-sky-200', 'bg-sky-300', 'bg-sky-500', 'bg-sky-600'];
              return (
                <div key={weight} className="flex flex-col flex-1 gap-2 justify-center items-start h-full">
                  <div className={`flex-1 w-full ${colors[index]} rounded-lg`} />
                  <div className="w-full text-base font-medium text-center text-neutral-600 max-sm:text-sm">
                    {weight}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
