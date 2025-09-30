"use client";

import React, { useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import type { MapCoordinates } from "../types";

interface RobotMapSelectorProps {
  onCoordinateSelect?: (x: number, y: number) => void;
  onImageCoordinateSelect?: (imageX: number, imageY: number) => void;
  selectedCoordinates?: MapCoordinates | null;
}

export default function RobotMapSelector({
  onCoordinateSelect,
  onImageCoordinateSelect,
  selectedCoordinates,
}: RobotMapSelectorProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // selectedCoordinates 변경 시 디버깅 로그
  useEffect(() => {
    if (selectedCoordinates) {
      console.log(
        "RobotMapSelector - 좌표 받음:",
        `x=${Math.round(selectedCoordinates.x)}, y=${Math.round(
          selectedCoordinates.y
        )}`
      );
    } else {
      console.log("RobotMapSelector - 좌표 없음");
    }
  }, [selectedCoordinates]);

  // 원본 이미지 크기 (배경 지도 고정 원본)
  const ORIGINAL_W = 289;
  const ORIGINAL_H = 282;

  const handleMapClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!mapContainerRef.current) {
        return;
      }

      // 이미지 엘리먼트를 찾아 실제 렌더 크기/위치 기준 좌표 계산 (좌측상단 0,0)
      const imageEl = mapContainerRef.current.querySelector(
        ".background-map-selector"
      ) as HTMLElement | null;

      if (imageEl) {
        const imageRect = imageEl.getBoundingClientRect();
        let imageLocalX = event.clientX - imageRect.left;
        let imageLocalY = event.clientY - imageRect.top;

        // 이미지 영역 밖 클릭 시 0~w/h로 클램핑
        imageLocalX = Math.max(0, Math.min(imageLocalX, imageRect.width));
        imageLocalY = Math.max(0, Math.min(imageLocalY, imageRect.height));

        // 비율 -> 원본 좌표로 환산
        const ratioX = imageRect.width > 0 ? imageLocalX / imageRect.width : 0;
        const ratioY =
          imageRect.height > 0 ? imageLocalY / imageRect.height : 0;
        const normX = ratioX * ORIGINAL_W;
        const normY = ratioY * ORIGINAL_H;

        // 이미지 기준 좌표 전달
        if (onImageCoordinateSelect) {
          onImageCoordinateSelect(normX, normY);
        }

        // 필요 시 추가 콜백에도 동일 좌표 전달 (호환용)
        if (onCoordinateSelect) {
          onCoordinateSelect(normX, normY);
        }
      }
    },
    [onCoordinateSelect, onImageCoordinateSelect]
  );

  return (
    <div className="flex justify-center items-center rounded-lg bg-neutral-200 h-[360px] w-[476px] max-md:w-full max-md:h-[300px] max-sm:h-[250px] mt-5">
      <div
        ref={mapContainerRef}
        className="relative h-[300px] w-[420px] max-md:h-[90%] max-md:w-[90%] cursor-crosshair"
        onClick={handleMapClick}
      >
        {/* 시흥시 지도 이미지 - 축소된 크기로 비례 조정 */}
        <Image
          src="/map.svg"
          alt="시흥시 행정구역 지도"
          width={289}
          height={282}
          className="absolute top-3 h-[282px] left-[60px] w-[289px] max-md:w-4/5 max-md:h-4/5 max-md:left-[10%] max-md:top-[10%] pointer-events-none background-map-selector"
        />

        {/* 행정구역 라벨들 - 축소된 크기로 비례 조정 */}
        <div className="absolute h-[193px] left-[125px] top-[43px] w-[215px] max-md:w-3/5 max-md:h-3/5 max-md:left-[20%] max-md:top-[20%] pointer-events-none">
          {/* 모든 행정구역 라벨을 절대 위치로 배치 - 50% 축소 */}
          <div className="absolute top-0 left-[91px] w-full text-[10px] text-zinc-950">
            대야동
          </div>
          <div className="absolute top-0.5 left-[121px] w-full text-[10px] text-zinc-950">
            계수동
          </div>
          <div className="absolute left-36 top-[21px] w-full text-[10px] text-zinc-950">
            과림동
          </div>
          <div className="absolute left-[76px] top-[27px] w-full text-[10px] text-zinc-950">
            신천동
          </div>
          <div className="absolute left-[103px] top-[23px] w-full text-[10px] text-zinc-950">
            은행동
          </div>
          <div className="absolute left-[123px] top-[39px] w-full text-[10px] text-zinc-950">
            안현동
          </div>
          <div className="absolute left-[118px] top-[62px] w-full text-[10px] text-zinc-950">
            매화동
          </div>
          <div className="absolute left-[154px] top-[60px] w-full text-[10px] text-zinc-950">
            무지내동
          </div>
          <div className="absolute left-[89px] top-[57px] w-full text-[10px] text-zinc-950">
            미산동
          </div>
          <div className="absolute left-[55px] top-[55px] w-full text-[10px] text-zinc-950">
            방산동
          </div>
          <div className="absolute left-[74px] top-[83px] w-full text-[10px] text-zinc-950">
            포동
          </div>
          <div className="absolute left-[127px] top-[77px] w-full text-[10px] text-zinc-950">
            도창동
          </div>
          <div className="absolute left-[100px] top-[92px] w-full text-[10px] text-zinc-950">
            하중동
          </div>
          <div className="absolute left-[121px] top-[100px] w-full text-[10px] text-zinc-950">
            하상동
          </div>
          <div className="absolute left-[151px] top-[95px] w-full text-[10px] text-zinc-950">
            금이동
          </div>
          <div className="absolute left-[179px] top-[97px] w-full text-[10px] text-zinc-950">
            논곡동
          </div>
          <div className="absolute left-[197px] top-[112px] w-full text-[10px] text-zinc-950">
            목감동
          </div>
          <div className="absolute left-[187px] top-[134px] w-full text-[10px] text-zinc-950">
            조남동
          </div>
          <div className="absolute left-[153px] top-[138px] w-full text-[10px] text-zinc-950">
            산현동
          </div>
          <div className="absolute left-[150px] top-[114px] w-full text-[10px] text-zinc-950">
            물왕동
          </div>
          <div className="absolute top-[120px] left-[123px] w-full text-[10px] text-zinc-950">
            광석동
          </div>
          <div className="absolute left-[101px] top-[125px] w-full text-[10px] text-zinc-950">
            장현동
          </div>
          <div className="absolute left-[79px] top-[117px] w-full text-[10px] text-zinc-950">
            장곡동
          </div>
          <div className="absolute left-[118px] top-[141px] w-full text-[10px] text-zinc-950">
            능곡동
          </div>
          <div className="absolute left-[96px] top-[156px] w-full text-[10px] text-zinc-950">
            군자동
          </div>
          <div className="absolute left-[131px] top-[159px] w-full text-[10px] text-zinc-950">
            화정동
          </div>
          <div className="absolute left-[44px] top-[118px] w-full text-[10px] text-zinc-950">
            월곶동
          </div>
          <div className="absolute left-[75px] top-[181px] w-full text-[10px] text-zinc-950">
            거모동
          </div>
          <div className="absolute left-[50px] top-[175px] w-full text-[10px] text-zinc-950">
            죽율동
          </div>
          <div className="absolute left-0 top-[185px] w-full text-[10px] text-zinc-950">
            정왕동
          </div>
        </div>

        {/* 선택된 좌표에 핀 표시 - 이미지 비율 기준(좌상단 0,0) */}
        <div className="absolute top-3 h-[282px] left-[60px] w-[289px] max-md:w-4/5 max-md:h-4/5 max-md:left-[10%] max-md:top-[10%] pointer-events-none">
          {selectedCoordinates &&
            typeof selectedCoordinates.x === "number" &&
            typeof selectedCoordinates.y === "number" &&
            !isNaN(selectedCoordinates.x) &&
            !isNaN(selectedCoordinates.y) && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-full z-10"
                style={{
                  left: `${(selectedCoordinates.x / ORIGINAL_W) * 100}%`,
                  top: `${(selectedCoordinates.y / ORIGINAL_H) * 100}%`,
                }}
              >
                <Image
                  src="/pin.svg"
                  alt="선택된 위치 핀"
                  width={25}
                  height={25}
                  className="drop-shadow-lg animate-bounce"
                />
              </div>
            )}
        </div>

        {/* 사용 안내 */}
        <div className="absolute left-1 bottom-1 bg-zinc-900/80 text-white text-xs px-2 py-1 rounded max-md:text-[10px] max-md:px-1">
          <div className="font-semibold">클릭하여 위치 선택</div>
        </div>
      </div>
    </div>
  );
}
