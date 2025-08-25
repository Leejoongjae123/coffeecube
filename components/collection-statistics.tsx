"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search, RotateCcw, Check } from "lucide-react";

export function CollectionStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState('월별');
  const [selectedMethods, setSelectedMethods] = useState(['비니봇', '방문수거']);

  const periods = ['월별', '주별', '일별'];
  const methods = ['비니봇', '방문수거'];

  const toggleMethod = (method: string) => {
    setSelectedMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  return (
    <div className="flex flex-col gap-8 items-start w-full min-h-screen bg-white">
      {/* Filter Controls */}
      <div className="flex justify-between items-end p-8 w-full rounded-2xl bg-stone-50 max-sm:p-4">
        <div className="flex gap-14 items-center max-md:gap-8 max-sm:flex-col max-sm:gap-4 max-sm:items-start">
          <div className="flex gap-5 items-center max-sm:flex-col max-sm:gap-3 max-sm:items-start">
            <div className="text-xl font-semibold text-neutral-700 max-md:text-lg max-sm:text-base">
              통계조건
            </div>
            <div className="flex gap-3 items-center h-[39px]">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`flex gap-2.5 justify-center items-center px-4 py-2.5 rounded-[30px] ${
                    selectedPeriod === period 
                      ? 'bg-sky-500 text-white font-bold' 
                      : 'bg-gray-200 text-neutral-500 font-semibold'
                  }`}
                >
                  <div className="text-sm text-center">
                    {period}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-5 items-center max-sm:flex-col max-sm:gap-3 max-sm:items-start">
            <div className="text-xl font-semibold text-neutral-700 max-md:text-lg max-sm:text-base">
              수거 방식
            </div>
            <div className="flex gap-2 items-center">
              {methods.map((method) => {
                const isSelected = selectedMethods.includes(method);
                return (
                  <div key={method} className="flex gap-2 items-center">
                    <div className="relative">
                      <div className={`w-[17px] h-[17px] rounded-full border-[1.2px] flex items-center justify-center ${
                        isSelected ? 'bg-sky-500 border-sky-500' : 'bg-gray-400 border-gray-400'
                      }`}>
                        {isSelected && (
                          <Check className="w-3 h-3 text-white stroke-[1.2]" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleMethod(method)}
                      className={`text-sm font-bold ${
                        isSelected ? 'text-sky-500' : 'text-neutral-400 font-semibold'
                      }`}
                    >
                      {method}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button className="flex gap-2.5 justify-center items-center px-0 py-3 bg-sky-500 rounded-lg w-[120px] max-sm:w-[100px] hover:bg-sky-600">
            <Search className="w-[17px] h-[17px] text-white" />
            <span className="text-base font-semibold text-white max-sm:text-sm">
              검색
            </span>
          </Button>
          <Button 
            variant="outline" 
            className="flex gap-2.5 justify-center items-center px-0 py-3 bg-white rounded-lg border-sky-500 border-solid border-[1.3px] w-[120px] max-sm:w-[100px] hover:bg-sky-50"
          >
            <RotateCcw className="w-[17px] h-[17px] text-sky-500" />
            <span className="text-base font-semibold text-sky-500 max-sm:text-sm">
              초기화
            </span>
          </Button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="flex flex-col gap-11 items-start w-full max-md:gap-6">
        <div className="flex gap-11 items-start w-full max-md:flex-col max-md:gap-6">
          {/* Monthly Collection Chart */}
          <div className="flex flex-col flex-1 gap-3 justify-center items-center px-8 py-6 bg-white rounded-3xl border-2 border-solid shadow-sm border-zinc-300">
            <div className="text-3xl font-bold text-neutral-700 max-md:text-2xl max-sm:text-xl">
              2025년 월별 수거량
            </div>
            <MonthlyChart />
            <WeeklyHeatmap />
          </div>

          {/* Right Side Charts */}
          <div className="flex flex-col flex-1 justify-between items-start h-[1020px] max-md:h-auto">
            {/* Regional Statistics */}
            <div className="flex flex-col gap-3 justify-center items-center px-8 py-6 w-full bg-white rounded-3xl border-2 border-solid shadow-sm border-zinc-300">
              <div className="text-3xl font-bold text-neutral-700 max-md:text-2xl max-sm:text-xl">
                2025년 지역별 통계
              </div>
              <RegionalPieChart />
            </div>

            {/* Top 3 Chart */}
            <div className="flex flex-col gap-3 justify-center items-center px-8 py-6 w-full bg-white rounded-3xl border-2 border-solid shadow-sm border-zinc-300">
              <div className="text-3xl font-bold text-neutral-700 max-md:text-2xl max-sm:text-xl">
                2025년 수거량 Top3
              </div>
              <Top3Chart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthlyChart() {
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

function WeeklyHeatmap() {
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

function RegionalPieChart() {
  const regions = [
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

function Top3Chart() {
  const topRegions = [
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
