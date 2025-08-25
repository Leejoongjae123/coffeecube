"use client";

import React from 'react';
import type { StatusMarker } from '../types';
import Image from 'next/image';

interface MapViewProps {
  statusMarkers: StatusMarker[];
}

export function MapView({ statusMarkers }: MapViewProps) {
  return (
    <div className="flex justify-center items-center rounded-3xl bg-neutral-200 h-[711px] w-[960px] max-md:w-full max-md:h-[500px] max-sm:h-[400px]">
      {/* Map Content */}
      <div className="relative h-[595px] w-[842px] max-md:h-[90%] max-md:w-[90%]">
        {/* Map Image */}
        <Image
          src="/map.svg"
          alt="시흥시 행정구역 지도"
          width={577}
          height={563}
          className="absolute top-6 h-[563px] left-[121px] w-[577px] max-md:w-4/5 max-md:h-4/5 max-md:left-[10%] max-md:top-[10%]"
        />

        {/* Region Labels */}
        <div className="absolute h-[386px] left-[250px] top-[85px] w-[429px] max-md:w-3/5 max-md:h-3/5 max-md:left-[20%] max-md:top-[20%]">
          {/* All district labels positioned absolutely */}
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
          <div className="absolute left-[89px] top-[237px] w-[34px] text-xs text-zinc-950">월곶동</div>
          <div className="absolute left-[150px] top-[363px] w-[34px] text-xs text-zinc-950">거모동</div>
          <div className="absolute left-[101px] top-[350px] w-[34px] text-xs text-zinc-950">죽을동</div>
          <div className="absolute left-0 top-[371px] w-[34px] text-xs text-zinc-950">정왕동</div>
        </div>

        {/* Status Markers */}
        {statusMarkers.map((marker) => (
          <div
            key={marker.id}
            className="absolute w-[52px] h-[52px]"
            style={{
              left: `${marker.position.left}px`,
              top: `${marker.position.top}px`
            }}
          >
            <div className={`w-[52px] h-[52px] rounded-full ${marker.bgColor}`}>
              <div className={`absolute top-[17px] left-[17px] w-[17px] h-[17px] rounded-full ${marker.dotColor}`}></div>
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

        {/* Bot Info Popup */}
        <div className="absolute left-[600px] top-[20px] flex flex-col gap-3 items-start p-6 rounded-xl bg-zinc-900/80 w-[223px] max-md:left-1/2 max-md:p-5 max-md:-translate-x-1/2 max-md:top-[200px] max-md:w-[200px] max-sm:p-4 max-sm:text-sm max-sm:w-[180px]">
          <div className="flex gap-2.5 justify-center items-center px-2 py-1.5 w-20 bg-blue-600 rounded-full">
            <div className="text-xs font-semibold text-center text-white">
              수거 대상
            </div>
          </div>

          <div className="flex flex-col gap-1 items-start w-[175px]">
            <div className="text-base font-bold leading-6 text-white max-sm:text-sm">
              비니봇 코드: asdfghjkl001
            </div>
            <div className="text-base font-medium leading-6 text-neutral-400 max-sm:text-sm">
              경기도 시흥시 무지내동<br />
              1.00kg 수거
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
