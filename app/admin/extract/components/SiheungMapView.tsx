"use client";

import React, { useState, useRef, useCallback } from 'react';
import type { PinPoint, SiheungMapViewProps } from '../types';

export default function SiheungMapView({ 
  onCoordinateSelect, 
  selectedCoordinates 
}: SiheungMapViewProps) {
  const [pins, setPins] = useState<PinPoint[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleMapClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 새로운 핀 포인트 추가
    const newPin: PinPoint = {
      id: `pin-${Date.now()}`,
      x,
      y,
      timestamp: new Date()
    };

    setPins(prev => [...prev, newPin]);

    // 부모 컴포넌트에 좌표 전달
    if (onCoordinateSelect) {
      onCoordinateSelect(x, y);
    }

    console.log(`좌표: x=${x}, y=${y}`);
  }, [onCoordinateSelect]);

  const handlePinRemove = (pinId: string) => {
    setPins(prev => prev.filter(pin => pin.id !== pinId));
  };

  const clearAllPins = () => {
    setPins([]);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 지도 컨트롤 헤더 */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">시흥시 지도 좌표 설정</h2>
        <p className="text-gray-600 text-sm">지도를 클릭하여 원하는 위치에 핀을 추가하고 정확한 좌표를 확인하세요.</p>
      </div>

      {/* 지도 컨트롤 버튼 */}
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <button
          onClick={clearAllPins}
          disabled={pins.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
          </svg>
          모든 핀 제거
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
          <span className="font-semibold">핀 개수: {pins.length}개</span>
        </div>

        {selectedCoordinates && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
            </svg>
            <span className="font-semibold">
              선택됨: ({Math.round(selectedCoordinates.x)}, {Math.round(selectedCoordinates.y)})
            </span>
          </div>
        )}
      </div>

      {/* 지도 컨테이너 - dashboard와 동일한 크기와 스타일 */}
      <div className="flex justify-center items-center rounded-3xl bg-neutral-200 h-[711px] w-[960px] max-md:w-full max-md:h-[500px] max-sm:h-[400px]">
        <div 
          ref={mapContainerRef}
          className="relative h-[595px] w-[842px] max-md:h-[90%] max-md:w-[90%] cursor-crosshair"
          onClick={handleMapClick}
        >
          {/* 시흥시 지도 이미지 - dashboard와 동일한 이미지와 위치 */}
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/56987c6e78c2fb004cd3a607cb62e85f430bbace?width=1154"
            alt="시흥시 행정구역 지도"
            className="absolute top-6 h-[563px] left-[121px] w-[577px] max-md:w-4/5 max-md:h-4/5 max-md:left-[10%] max-md:top-[10%] pointer-events-none"
          />

          {/* 행정구역 라벨 - dashboard와 동일 */}
          <div className="absolute h-[386px] left-[250px] top-[85px] w-[429px] max-md:w-3/5 max-md:h-3/5 max-md:left-[20%] max-md:top-[20%] pointer-events-none">
            <div className="absolute top-0 left-[182px] w-[34px] text-xs text-zinc-950">대야동</div>
            <div className="absolute top-0.5 left-[243px] w-[34px] text-xs text-zinc-950">계수동</div>
            <div className="absolute left-72 top-[42px] w-[34px] text-xs text-zinc-950">과림동</div>
            <div className="absolute left-[152px] top-[54px] w-[34px] text-xs text-zinc-950">신천동</div>
            <div className="absolute left-[207px] top-[47px] w-[34px] text-xs text-zinc-950">은행동</div>
            <div className="absolute left-[246px] top-[79px] w-[34px] text-xs text-zinc-950">안현동</div>
            <div className="absolute left-[237px] top-[125px] w-[34px] text-xs text-zinc-950">매화동</div>
            <div className="absolute left-[309px] top-[121px] w-[34px] text-xs text-zinc-950">무지내동</div>
            <div className="absolute left-[179px] top-[114px] w-[34px] text-xs text-zinc-950">미산동</div>
            <div className="absolute left-[111px] top-[111px] w-[34px] text-xs text-zinc-950">방산동</div>
            <div className="absolute left-[149px] top-[167px] w-[34px] text-xs text-zinc-950">포동</div>
            <div className="absolute left-[254px] top-[154px] w-[34px] text-xs text-zinc-950">도창동</div>
            <div className="absolute left-[200px] top-[185px] w-[34px] text-xs text-zinc-950">하중동</div>
            <div className="absolute left-[243px] top-[201px] w-[34px] text-xs text-zinc-950">하상동</div>
            <div className="absolute left-[302px] top-[191px] w-[34px] text-xs text-zinc-950">금이동</div>
            <div className="absolute left-[358px] top-[195px] w-[34px] text-xs text-zinc-950">논곡동</div>
            <div className="absolute left-[395px] top-[225px] w-[34px] text-xs text-zinc-950">목감동</div>
            <div className="absolute left-[374px] top-[269px] w-[34px] text-xs text-zinc-950">조남동</div>
            <div className="absolute left-[306px] top-[277px] w-[34px] text-xs text-zinc-950">산현동</div>
            <div className="absolute left-[301px] top-[229px] w-[34px] text-xs text-zinc-950">물왕동</div>
            <div className="absolute top-60 left-[246px] w-[34px] text-xs text-zinc-950">광석동</div>
            <div className="absolute left-[202px] top-[250px] w-[34px] text-xs text-zinc-950">장현동</div>
            <div className="absolute left-[158px] top-[234px] w-[34px] text-xs text-zinc-950">장곡동</div>
            <div className="absolute left-[237px] top-[283px] w-[34px] text-xs text-zinc-950">능곡동</div>
            <div className="absolute left-48 top-[313px] w-[34px] text-xs text-zinc-950">군자동</div>
            <div className="absolute left-[262px] top-[319px] w-[34px] text-xs text-zinc-950">화정동</div>
            <div className="absolute left-[89px] top-[237px] w-[34px] text-zinc-950">월곶동</div>
            <div className="absolute left-[150px] top-[363px] w-[34px] text-xs text-zinc-950">거모동</div>
            <div className="absolute left-[101px] top-[350px] w-[34px] text-xs text-zinc-950">죽을동</div>
            <div className="absolute left-0 top-[371px] w-[34px] text-xs text-zinc-950">정왕동</div>
          </div>

          {/* 핀 포인트들 */}
          {pins.map((pin, index) => (
            <div
              key={pin.id}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
              style={{
                left: `${pin.x}px`,
                top: `${pin.y}px`
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePinRemove(pin.id);
              }}
            >
              {/* 핀 아이콘 */}
              <div className="relative">
                <svg
                  width="28"
                  height="36"
                  viewBox="0 0 28 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg group-hover:scale-110 transition-all duration-200 animate-bounce"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* 핀 그림자 */}
                  <ellipse cx="14" cy="32" rx="6" ry="2" fill="rgba(0,0,0,0.2)" />
                  
                  {/* 핀 본체 */}
                  <path
                    d="M14 0C6.268 0 0 6.268 0 14C0 21.732 14 36 14 36S28 21.732 28 14C28 6.268 21.732 0 14 0Z"
                    fill="#ef4444"
                    stroke="#b91c1c"
                    strokeWidth="1"
                  />
                  
                  {/* 핀 중앙 원 */}
                  <circle cx="14" cy="14" r="6" fill="white" stroke="#ef4444" strokeWidth="1" />
                  
                  {/* 핀 번호 */}
                  <text
                    x="14"
                    y="18"
                    textAnchor="middle"
                    className="text-xs font-bold fill-red-600"
                    style={{ fontSize: '10px' }}
                  >
                    {index + 1}
                  </text>
                </svg>
                
                {/* 핀 번호 배지 (추가 강조) */}
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {index + 1}
                </div>
              </div>
              
              {/* 상세 정보 툴팁 */}
              <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-95 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-gray-700">
                <div className="font-semibold text-yellow-300">핀 #{index + 1}</div>
                <div>좌표: ({Math.round(pin.x)}, {Math.round(pin.y)})</div>
                <div className="text-gray-300">{pin.timestamp.toLocaleTimeString()}</div>
                <div className="text-red-300 text-center mt-1">클릭하여 삭제</div>
                {/* 툴팁 화살표 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          ))}

          {/* 선택된 좌표 표시 (임시 미리보기) */}
          {selectedCoordinates && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{
                left: `${selectedCoordinates.x}px`,
                top: `${selectedCoordinates.y}px`
              }}
            >
              <div className="relative">
                <svg
                  width="32"
                  height="40"
                  viewBox="0 0 32 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-xl animate-pulse"
                >
                  {/* 선택된 핀 그림자 */}
                  <ellipse cx="16" cy="36" rx="8" ry="3" fill="rgba(0,0,0,0.3)" />
                  
                  {/* 선택된 핀 본체 */}
                  <path
                    d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40S32 24.837 32 16C32 7.163 24.837 0 16 0Z"
                    fill="#3b82f6"
                    stroke="#1d4ed8"
                    strokeWidth="2"
                  />
                  
                  {/* 선택된 핀 중앙 원 */}
                  <circle cx="16" cy="16" r="8" fill="white" stroke="#3b82f6" strokeWidth="2" />
                  
                  {/* 선택 표시 아이콘 */}
                  <path
                    d="M12 16L15 19L20 13"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                
                {/* 선택 상태 배지 */}
                <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce">
                  ✓
                </div>
              </div>
              
              {/* 선택된 좌표 정보 */}
              <div className="absolute top-[-80px] left-1/2 transform -translate-x-1/2 bg-blue-600 bg-opacity-95 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-blue-400">
                <div className="font-semibold text-blue-100">최근 선택된 좌표</div>
                <div>x: {Math.round(selectedCoordinates.x)}, y: {Math.round(selectedCoordinates.y)}</div>
                {/* 툴팁 화살표 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-blue-600"></div>
              </div>
            </div>
          )}

          {/* 클릭 가이드 */}
          <div className="absolute left-1 bottom-1 bg-zinc-900/80 text-white text-sm px-3 py-2 rounded-lg max-md:text-xs max-md:px-2 max-md:py-1">
            <div className="font-semibold">지도 사용법</div>
            <div className="text-xs text-gray-300 mt-1">
              • 지도를 클릭하여 핀 추가<br />
              • 핀을 클릭하여 삭제<br />
              • 핀에 마우스를 올려 좌표 확인
            </div>
          </div>
        </div>
      </div>

      {/* 좌표 정보 패널 */}
      {pins.length > 0 && (
        <div className="w-full max-w-4xl bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">설정된 좌표</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pins.map((pin, index) => (
              <div
                key={pin.id}
                className="bg-white p-3 rounded border flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-medium">
                    핀 {index + 1}
                  </div>
                  <div className="text-xs text-gray-600">
                    x: {Math.round(pin.x)}, y: {Math.round(pin.y)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {pin.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => handlePinRemove(pin.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
