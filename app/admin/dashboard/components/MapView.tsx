"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { EquipmentMapRow, MapMarker, MarkerStatus } from "../types";

export function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // 대시보드 원본 지도 기준 크기 (MapView 내 이미지의 설계 기준 크기)
  const DEFAULT_BASE_MAP_WIDTH = 577; // px
  const DEFAULT_BASE_MAP_HEIGHT = 563; // px

  interface NormalizedMarker {
    id: string;
    rx: number; // 0..1
    ry: number; // 0..1
    status: MarkerStatus;
    robotCode: string;
    locationText: string;
    todayAmountKg: number;
  }

  const [normalizedMarkers, setNormalizedMarkers] = useState<
    NormalizedMarker[]
  >([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const getStatusColors = useCallback((status: MarkerStatus) => {
    switch (status) {
      case "정상":
        return {
          bg: "bg-green-500/30",
          dot: "bg-green-600",
          solid: "bg-green-600",
        };
      case "수거 대상":
        return {
          bg: "bg-blue-500/30",
          dot: "bg-blue-600",
          solid: "bg-blue-600",
        };
      case "장애발생":
        return { bg: "bg-red-500/30", dot: "bg-red-600", solid: "bg-red-600" };
      default:
        return { bg: "bg-gray-300", dot: "bg-gray-600", solid: "bg-gray-500" };
    }
  }, []);

  const resolveStatus = useCallback((raw?: string | null): MarkerStatus => {
    if (raw === "장애발생") return "장애발생";
    if (raw === "수거필요" || raw === "수거 대상") return "수거 대상";
    return "정상";
  }, []);

  const fetchEquipments = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/equipment", {
        cache: "no-store",
      });
      if (!response.ok) {
        return;
      }
      const result = await response.json();
      const rows: EquipmentMapRow[] = (result?.data as EquipmentMapRow[]) || [];

      const normalized: NormalizedMarker[] = rows
        .filter(
          (row) =>
            row.coordinates_x !== null && row.coordinates_y !== null && true
        )
        .map((row) => {
          const x =
            typeof row.coordinates_x === "number"
              ? row.coordinates_x
              : Number(row.coordinates_x);
          const y =
            typeof row.coordinates_y === "number"
              ? row.coordinates_y
              : Number(row.coordinates_y);
          // DB의 image_x, image_y가 클릭 좌표가 저장되어 있을 수 있어
          // 실제 원본 이미지 크기로 사용하기엔 부적합할 수 있음.
          // 다음 규칙으로 기준 크기를 선택:
          // 1) image_x/image_y가 x/y보다 크고, 어느 정도 유의미한 크기(>=100)이면 기준 크기로 사용
          // 2) 그렇지 않으면 설계 기준 크기(DEFAULT_BASE_MAP_WIDTH/HEIGHT) 사용
          const rawImgW =
            typeof row.image_x === "number" ? row.image_x : Number(row.image_x);
          const rawImgH =
            typeof row.image_y === "number" ? row.image_y : Number(row.image_y);

          const looksLikeDimensionW =
            Number.isFinite(rawImgW) && rawImgW >= 100 && rawImgW >= x;
          const looksLikeDimensionH =
            Number.isFinite(rawImgH) && rawImgH >= 100 && rawImgH >= y;

          const baseW = looksLikeDimensionW ? rawImgW : DEFAULT_BASE_MAP_WIDTH;
          const baseH = looksLikeDimensionH ? rawImgH : DEFAULT_BASE_MAP_HEIGHT;

          let rx = baseW > 0 ? x / baseW : 0;
          let ry = baseH > 0 ? y / baseH : 0;
          // 안전하게 0..1 범위로 클램프
          rx = Math.max(0, Math.min(1, rx));
          ry = Math.max(0, Math.min(1, ry));
          const status = resolveStatus(
            row.latest_status?.device_status || null
          );
          const locationText =
            (row.install_location as string) || (row.region as string) || "";
          const todayAmountKg = row.today_input_amount
            ? Number(row.today_input_amount)
            : 0;

          return {
            id: row.robot_code,
            rx,
            ry,
            status,
            robotCode: row.robot_code,
            locationText,
            todayAmountKg,
          };
        });

      setNormalizedMarkers(normalized);
    } catch {
      // no-op (avoid console.error/throw)
    }
  }, [resolveStatus]);

  const recalcPositions = useCallback(() => {
    const parent = containerRef.current;
    const mapEl = mapRef.current;
    if (!parent || !mapEl) {
      return;
    }
    const parentRect = parent.getBoundingClientRect();
    const mapRect = mapEl.getBoundingClientRect();

    const offsetLeft = mapRect.left - parentRect.left;
    const offsetTop = mapRect.top - parentRect.top;
    const mapW = mapRect.width;
    const mapH = mapRect.height;

    const computed: MapMarker[] = normalizedMarkers.map((m) => {
      const cx = offsetLeft + m.rx * mapW;
      const cy = offsetTop + m.ry * mapH;
      const { bg, dot } = getStatusColors(m.status);
      return {
        id: m.id,
        robotCode: m.robotCode,
        locationText: m.locationText,
        todayAmountKg: m.todayAmountKg,
        status: m.status,
        bgColor: bg,
        dotColor: dot,
        left: cx - 26,
        top: cy - 26,
      };
    });
    setMarkers(computed);
  }, [getStatusColors, normalizedMarkers]);

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  useEffect(() => {
    recalcPositions();
  }, [recalcPositions]);

  useEffect(() => {
    const onResize = () => recalcPositions();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcPositions]);
  return (
    <div className="flex justify-center items-center rounded-3xl bg-neutral-200 h-[711px] w-[960px] max-md:w-full max-md:h-[500px] max-sm:h-[400px]">
      {/* Map Content */}
      <div
        ref={containerRef}
        className="relative h-[595px] w-[842px] max-md:h-[90%] max-md:w-[90%]"
      >
        {/* Map Image */}
        <div
          ref={mapRef}
          className="absolute top-6 left-[121px] h-[563px] w-[577px] max-md:w-4/5 max-md:h-4/5 max-md:left-[10%] max-md:top-[10%]"
        >
          <Image
            src="/map.svg"
            alt="시흥시 행정구역 지도"
            width={577}
            height={563}
            className="h-full w-full background-map"
            priority
          />
        </div>

        {/* Region Labels */}
        <div className="absolute h-[386px] left-[250px] top-[85px] w-[429px] max-md:w-3/5 max-md:h-3/5 max-md:left-[20%] max-md:top-[20%]">
          {/* All district labels positioned absolutely */}
          <div className="absolute top-0 left-[182px] w-full text-xs text-zinc-950">
            대야동
          </div>
          <div className="absolute top-0.5 left-[243px] w-full text-xs text-zinc-950">
            계수동
          </div>
          <div className="absolute left-72 top-[42px] w-full text-xs text-zinc-950">
            과림동
          </div>
          <div className="absolute left-[152px] top-[54px] w-full text-xs text-zinc-950">
            신천동
          </div>
          <div className="absolute left-[207px] top-[47px] w-full text-xs text-zinc-950">
            은행동
          </div>
          <div className="absolute left-[246px] top-[79px] w-full text-xs text-zinc-950">
            안현동
          </div>
          <div className="absolute left-[237px] top-[125px] w-full text-xs text-zinc-950">
            매화동
          </div>
          <div className="absolute left-[309px] top-[121px] w-full text-xs text-zinc-950">
            무지내동
          </div>
          <div className="absolute left-[179px] top-[114px] w-full text-xs text-zinc-950">
            미산동
          </div>
          <div className="absolute left-[111px] top-[111px] w-full text-xs text-zinc-950">
            방산동
          </div>
          <div className="absolute left-[149px] top-[167px] w-full text-xs text-zinc-950">
            포동
          </div>
          <div className="absolute left-[254px] top-[154px] w-full text-xs text-zinc-950">
            도창동
          </div>
          <div className="absolute left-[200px] top-[185px] w-full text-xs text-zinc-950">
            하중동
          </div>
          <div className="absolute left-[243px] top-[201px] w-full text-xs text-zinc-950">
            하상동
          </div>
          <div className="absolute left-[302px] top-[191px] w-full text-xs text-zinc-950">
            금이동
          </div>
          <div className="absolute left-[358px] top-[195px] w-full text-xs text-zinc-950">
            논곡동
          </div>
          <div className="absolute left-[395px] top-[225px] w-full text-xs text-zinc-950">
            목감동
          </div>
          <div className="absolute left-[374px] top-[269px] w-full text-xs text-zinc-950">
            조남동
          </div>
          <div className="absolute left-[306px] top-[277px] w-full text-xs text-zinc-950">
            산현동
          </div>
          <div className="absolute left-[301px] top-[229px] w-full text-xs text-zinc-950">
            물왕동
          </div>
          <div className="absolute top-60 left-[246px] w-full text-xs text-zinc-950">
            광석동
          </div>
          <div className="absolute left-[202px] top-[250px] w-full text-xs text-zinc-950">
            장현동
          </div>
          <div className="absolute left-[158px] top-[234px] w-full text-xs text-zinc-950">
            장곡동
          </div>
          <div className="absolute left-[237px] top-[283px] w-full text-xs text-zinc-950">
            능곡동
          </div>
          <div className="absolute left-48 top-[313px] w-full text-xs text-zinc-950">
            군자동
          </div>
          <div className="absolute left-[262px] top-[319px] w-full text-xs text-zinc-950">
            화정동
          </div>
          <div className="absolute left-[89px] top-[237px] w-full text-xs text-zinc-950">
            월곶동
          </div>
          <div className="absolute left-[150px] top-[363px] w-full text-xs text-zinc-950">
            거모동
          </div>
          <div className="absolute left-[101px] top-[350px] w-full text-xs text-zinc-950">
            죽율동
          </div>
          <div className="absolute left-0 top-[371px] w-full text-xs text-zinc-950">
            정왕동
          </div>
        </div>

        {/* Status Markers */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            className="absolute w-[52px] h-[52px] group"
            style={{
              left: `${marker.left}px`,
              top: `${marker.top}px`,
            }}
          >
            <div
              className={`w-[52px] h-[52px] rounded-full ${marker.bgColor} relative`}
            >
              <div
                className={`absolute top-[17px] left-[17px] w-[17px] h-[17px] rounded-full ${marker.dotColor}`}
              ></div>
              {/* Hover Tooltip */}
              <div className="absolute -top-[10px] left-[60px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="flex flex-col gap-3 items-start p-6 rounded-xl bg-zinc-900/80 w-[223px]">
                  <div
                    className={`flex gap-2.5 justify-center items-center px-2 py-1.5 w-20 rounded-full ${
                      getStatusColors(marker.status).solid
                    }`}
                  >
                    <div className="text-xs font-semibold text-center text-white">
                      {marker.status}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-start w-[175px]">
                    <div className="text-base font-bold leading-6 text-white">
                      비니봇 코드: {marker.robotCode}
                    </div>
                    <div className="text-base font-medium leading-6 text-[#A1A1A1]">
                      · {marker.locationText || ""}
                      <br />· {marker.todayAmountKg.toFixed(2)}kg 수거
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute left-1 top-1 flex flex-col gap-3 items-start px-6 py-5 rounded-lg bg-zinc-100 w-[160px] max-md:gap-2.5 max-md:px-5 max-md:py-4 max-md:w-[120px] max-sm:gap-2 max-sm:px-4 max-sm:py-3 max-sm:text-sm max-sm:w-[100px]">
          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 rounded-full bg-green-500/30 relative">
              <div className="absolute top-[6px] left-[6px] w-2 h-2 rounded-full bg-green-600"></div>
            </div>
            <div className="text-base font-medium leading-6 text-neutral-700 max-sm:text-sm">
              정상
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 rounded-full bg-blue-500/30 relative">
              <div className="absolute top-[6px] left-[6px] w-2 h-2 rounded-full bg-blue-600"></div>
            </div>
            <div className="text-base font-medium leading-6 text-neutral-700 max-sm:text-sm">
              수거 대상
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-5 h-5 rounded-full bg-red-500/30 relative">
              <div className="absolute top-[6px] left-[6px] w-2 h-2 rounded-full bg-red-600"></div>
            </div>
            <div className="text-base font-medium leading-6 text-neutral-700 max-sm:text-sm">
              장애 발생
            </div>
          </div>
        </div>

        {/* 고정 팝업 제거, 마커 hover 시 툴팁 표시 */}
      </div>
    </div>
  );
}
