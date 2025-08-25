"use client";

import React, { useRef, useCallback } from 'react';
import type { MapCoordinates } from '../types';

interface RobotMapSelectorProps {
  onCoordinateSelect?: (x: number, y: number) => void;
  selectedCoordinates?: MapCoordinates | null;
}

export default function RobotMapSelector({ 
  onCoordinateSelect, 
  selectedCoordinates 
}: RobotMapSelectorProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // 대시보드와 비니봇 등록 폼 간의 스케일 팩터
  // 대시보드: 842x595 컨테이너, 577x563 이미지
  // 비니봇 폼: 420x300 컨테이너, 289x282 이미지
  const SCALE_FACTOR_X = 577 / 289; // ≈ 2.0
  const SCALE_FACTOR_Y = 563 / 282; // ≈ 2.0

  const handleMapClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    // 대시보드 좌표계로 변환 (정확한 매핑을 위해)
    const dashboardX = localX * SCALE_FACTOR_X;
    const dashboardY = localY * SCALE_FACTOR_Y;

    // 부모 컴포넌트에 대시보드 좌표계 기준으로 전달
    if (onCoordinateSelect) {
      onCoordinateSelect(dashboardX, dashboardY);
    }

    console.log(`로컬 좌표: (${Math.round(localX)}, ${Math.round(localY)})`);
    console.log(`대시보드 좌표: (${Math.round(dashboardX)}, ${Math.round(dashboardY)})`);
  }, [onCoordinateSelect, SCALE_FACTOR_X, SCALE_FACTOR_Y]);

  return (
    <div className="flex justify-center items-center rounded-lg bg-neutral-200 h-[360px] w-[476px] max-md:w-full max-md:h-[300px] max-sm:h-[250px] mt-5">
      <div 
        ref={mapContainerRef}
        className="relative h-[300px] w-[420px] max-md:h-[90%] max-md:w-[90%] cursor-crosshair"
        onClick={handleMapClick}
      >
        {/* 시흥시 지도 이미지 - 축소된 크기로 비례 조정 */}
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/56987c6e78c2fb004cd3a607cb62e85f430bbace?width=1154"
          alt="시흥시 행정구역 지도"
          className="absolute top-3 h-[282px] left-[60px] w-[289px] max-md:w-4/5 max-md:h-4/5 max-md:left-[10%] max-md:top-[10%] pointer-events-none"
        />

        {/* 행정구역 라벨들 - 축소된 크기로 비례 조정 */}
        <div className="absolute h-[193px] left-[125px] top-[43px] w-[215px] max-md:w-3/5 max-md:h-3/5 max-md:left-[20%] max-md:top-[20%] pointer-events-none">
          {/* 모든 행정구역 라벨을 절대 위치로 배치 - 50% 축소 */}
          <div className="absolute top-0 left-[91px] w-[17px] text-[10px] text-zinc-950">대야동</div>
          <div className="absolute top-0.5 left-[121px] w-[17px] text-[10px] text-zinc-950">계수동</div>
          <div className="absolute left-36 top-[21px] w-[17px] text-[10px] text-zinc-950">과림동</div>
          <div className="absolute left-[76px] top-[27px] w-[17px] text-[10px] text-zinc-950">신천동</div>
          <div className="absolute left-[103px] top-[23px] w-[17px] text-[10px] text-zinc-950">은행동</div>
          <div className="absolute left-[123px] top-[39px] w-[17px] text-[10px] text-zinc-950">안현동</div>
          <div className="absolute left-[118px] top-[62px] w-[17px] text-[10px] text-zinc-950">매화동</div>
          <div className="absolute left-[154px] top-[60px] w-[17px] text-[10px] text-zinc-950">무지내동</div>
          <div className="absolute left-[89px] top-[57px] w-[17px] text-[10px] text-zinc-950">미산동</div>
          <div className="absolute left-[55px] top-[55px] w-[17px] text-[10px] text-zinc-950">방산동</div>
          <div className="absolute left-[74px] top-[83px] w-[17px] text-[10px] text-zinc-950">포동</div>
          <div className="absolute left-[127px] top-[77px] w-[17px] text-[10px] text-zinc-950">도창동</div>
          <div className="absolute left-[100px] top-[92px] w-[17px] text-[10px] text-zinc-950">하중동</div>
          <div className="absolute left-[121px] top-[100px] w-[17px] text-[10px] text-zinc-950">하상동</div>
          <div className="absolute left-[151px] top-[95px] w-[17px] text-[10px] text-zinc-950">금이동</div>
          <div className="absolute left-[179px] top-[97px] w-[17px] text-[10px] text-zinc-950">논곡동</div>
          <div className="absolute left-[197px] top-[112px] w-[17px] text-[10px] text-zinc-950">목감동</div>
          <div className="absolute left-[187px] top-[134px] w-[17px] text-[10px] text-zinc-950">조남동</div>
          <div className="absolute left-[153px] top-[138px] w-[17px] text-[10px] text-zinc-950">산현동</div>
          <div className="absolute left-[150px] top-[114px] w-[17px] text-[10px] text-zinc-950">물왕동</div>
          <div className="absolute top-[120px] left-[123px] w-[17px] text-[10px] text-zinc-950">광석동</div>
          <div className="absolute left-[101px] top-[125px] w-[17px] text-[10px] text-zinc-950">장현동</div>
          <div className="absolute left-[79px] top-[117px] w-[17px] text-[10px] text-zinc-950">장곡동</div>
          <div className="absolute left-[118px] top-[141px] w-[17px] text-[10px] text-zinc-950">능곡동</div>
          <div className="absolute left-[96px] top-[156px] w-[17px] text-[10px] text-zinc-950">군자동</div>
          <div className="absolute left-[131px] top-[159px] w-[17px] text-[10px] text-zinc-950">화정동</div>
          <div className="absolute left-[44px] top-[118px] w-[17px] text-[10px] text-zinc-950">월곶동</div>
          <div className="absolute left-[75px] top-[181px] w-[17px] text-[10px] text-zinc-950">거모동</div>
          <div className="absolute left-[50px] top-[175px] w-[17px] text-[10px] text-zinc-950">죽을동</div>
          <div className="absolute left-0 top-[185px] w-[17px] text-[10px] text-zinc-950">정왕동</div>
        </div>

        {/* 선택된 좌표에 핀 표시 - pin.svg 사용 */}
        {selectedCoordinates && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${selectedCoordinates.x / SCALE_FACTOR_X}px`,
              top: `${selectedCoordinates.y / SCALE_FACTOR_Y}px`
            }}
          >
            <img
              src="/pin.svg"
              alt="선택된 위치 핀"
              width="25"
              height="25"
              className="drop-shadow-lg animate-bounce"
            />
          </div>
        )}

        {/* 사용 안내 */}
        <div className="absolute left-1 bottom-1 bg-zinc-900/80 text-white text-xs px-2 py-1 rounded max-md:text-[10px] max-md:px-1">
          <div className="font-semibold">클릭하여 위치 선택</div>
        </div>


      </div>
    </div>
  );
}
