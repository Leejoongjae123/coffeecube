"use client";

import React, { useState } from "react";
import CustomDropdown from "./custom-dropdown";

/**
 * CustomDropdown 컴포넌트 사용 예제
 * StatisticsDetail에서 사용하는 것과 동일한 스타일의 드랍다운
 */
export default function CustomDropdownExample() {
  // 지역 선택 예제 (StatisticsDetail의 region 드랍다운과 동일)
  const [region1, setRegion1] = useState("전체");
  const [region2, setRegion2] = useState("군");
  const [region3, setRegion3] = useState("구");

  // 정렬 기준 예제 (StatisticsDetail의 sort 드랍다운과 동일)
  const [sortOrder, setSortOrder] = useState("내림차순");
  const [sortBy, setSortBy] = useState("상태");

  const region1Options = [
    { label: "전체", value: "전체" },
    { label: "시", value: "시" },
  ];

  const region2Options = [
    { label: "군", value: "군" },
    { label: "구", value: "구" },
  ];

  const region3Options = [
    { label: "구", value: "구" },
    { label: "동", value: "동" },
  ];

  const sortOrderOptions = [
    { label: "내림차순", value: "내림차순" },
    { label: "오름차순", value: "오름차순" },
  ];

  const sortByOptions = [
    { label: "상태", value: "상태" },
    { label: "날짜", value: "날짜" },
    { label: "수거량", value: "수거량" },
  ];

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-xl font-bold text-neutral-700">
        CustomDropdown 사용 예제
      </h2>

      {/* 지역 선택 드랍다운 (StatisticsDetail 스타일) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-700">지역 선택</h3>
        <div className="flex gap-5 items-center text-xs font-bold text-primary whitespace-nowrap">
          <div className="text-xl font-semibold text-neutral-700">지역</div>

          <CustomDropdown
            value={region1}
            options={region1Options}
            onValueChange={setRegion1}
            width="w-20"
            arrowType="primary"
          />

          <CustomDropdown
            value={region2}
            options={region2Options}
            onValueChange={setRegion2}
            width="w-20"
            arrowType="primary"
          />

          <CustomDropdown
            value={region3}
            options={region3Options}
            onValueChange={setRegion3}
            width="w-20"
            arrowType="primary"
          />
        </div>
      </div>

      {/* 정렬 기준 드랍다운 (StatisticsDetail 스타일) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-700">정렬 기준</h3>
        <div className="flex gap-5 items-center text-xs whitespace-nowrap text-neutral-500">
          <div className="font-bold">정렬기준</div>
          <div className="flex gap-2 items-center font-medium">
            <CustomDropdown
              value={sortOrder}
              options={sortOrderOptions}
              onValueChange={setSortOrder}
              width="min-w-[120px]"
              arrowType="gray"
              textSize="text-xs"
            />

            <CustomDropdown
              value={sortBy}
              options={sortByOptions}
              onValueChange={setSortBy}
              width="min-w-[100px]"
              arrowType="gray"
              textSize="text-xs"
            />
          </div>
        </div>
      </div>

      {/* 다양한 옵션 예제 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-700">다양한 옵션</h3>
        <div className="flex gap-4 items-center flex-wrap">
          {/* 기본 스타일 */}
          <CustomDropdown
            value={region1}
            options={region1Options}
            onValueChange={setRegion1}
            placeholder="선택하세요"
          />

          {/* 넓은 버전 */}
          <CustomDropdown
            value={sortOrder}
            options={sortOrderOptions}
            onValueChange={setSortOrder}
            width="w-32"
            arrowType="gray"
          />

          {/* 비활성화된 상태 */}
          <CustomDropdown
            value="비활성화"
            options={[{ label: "비활성화", value: "비활성화" }]}
            onValueChange={() => {}}
            disabled={true}
          />
        </div>
      </div>

      {/* 현재 선택된 값들 표시 */}
      <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-neutral-700">현재 선택된 값들:</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>지역1: {region1}</li>
          <li>지역2: {region2}</li>
          <li>지역3: {region3}</li>
          <li>정렬순서: {sortOrder}</li>
          <li>정렬기준: {sortBy}</li>
        </ul>
      </div>
    </div>
  );
}
