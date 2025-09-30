"use client";

import * as React from "react";
import { X, Edit3, Loader2 } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RobotMapSelector from "./RobotMapSelector";
import type { RobotData, MapCoordinates } from "../types";

interface RobotEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  robotData?: RobotData;
  onSave?: () => void;
}

const FormField = ({
  label,
  value,
  editable = false,
  width = "w-[272px]",
  className = "",
  onChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  width?: string;
  className?: string;
  onChange?: (value: string) => void;
}) => (
  <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
    <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
      {label}
    </div>
    <div
      className={`flex items-center ${
        editable
          ? "p-2 border-b border-solid border-b-neutral-500"
          : "px-2 py-3"
      } min-w-60 ${width} max-sm:w-full max-sm:min-w-[auto] ${className}`}
    >
      {editable && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-base leading-6 text-neutral-500 bg-transparent border-none outline-none"
        />
      ) : (
        <div
          className={`flex-1 text-base leading-6 ${
            editable ? "text-neutral-500" : "text-zinc-400"
          }`}
        >
          {value}
        </div>
      )}
      {editable && (
        <div>
          <Edit3 className="w-4 h-4 text-neutral-400" />
        </div>
      )}
    </div>
  </div>
);

const RadioOption = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex gap-1 items-center w-[100px] max-sm:w-auto">
    <div className="flex justify-center items-center w-11 h-11">
      <div className="flex justify-center items-center rounded-full">
        <div className="flex justify-center items-center p-2">
          <button
            onClick={onChange}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
            style={{
              borderColor: checked ? "#0E8FEB" : "#909092",
              backgroundColor: "transparent",
            }}
          >
            {checked && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#0E8FEB" }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
    <div
      className={`text-base leading-6 ${
        checked ? "text-sky-500" : "text-neutral-400"
      }`}
    >
      {label}
    </div>
  </div>
);

export default function RobotEditModal({
  isOpen,
  onClose,
  robotData,
  onSave,
}: RobotEditModalProps) {
  // 원본 이미지 크기 (참고값) - 현재 컴포넌트 내 직접 사용 없음
  // const ORIGINAL_W = 289;
  // const ORIGINAL_H = 282;

  const [formData, setFormData] = React.useState<RobotData>({
    id: robotData?.id || "001",
    code: robotData?.code || "",
    isActive: robotData?.isActive || "Y",
    location: robotData?.location || "",
    currentCollection: robotData?.currentCollection || "0kg",
    status: robotData?.status || "정상",
    lastCollectionDate: robotData?.lastCollectionDate || "",
    installationDate: robotData?.installationDate || "",
    totalCollection: robotData?.totalCollection || "0kg",
    todayInputAmount: robotData?.todayInputAmount || 0,
    totalInputAmount: robotData?.totalInputAmount || 0,
    region: robotData?.region || "시흥시",
    coordinates: robotData?.coordinates,
    coordinates_x: robotData?.coordinates_x,
    coordinates_y: robotData?.coordinates_y,
  });

  // coordinates_x, coordinates_y가 있으면 MapCoordinates로 변환 (원본 좌표 그대로)
  const getInitialCoordinates = (): MapCoordinates | null => {
    if (
      robotData?.coordinates_x !== undefined &&
      robotData?.coordinates_y !== undefined &&
      robotData.coordinates_x !== null &&
      robotData.coordinates_y !== null
    ) {
      // DB는 원본(289x282) 좌표를 저장 → 그대로 사용
      return {
        x: Number(robotData.coordinates_x),
        y: Number(robotData.coordinates_y),
      };
    }
    if (robotData?.coordinates) {
      return robotData.coordinates;
    }
    return null;
  };

  const [selectedCoordinates, setSelectedCoordinates] =
    React.useState<MapCoordinates | null>(getInitialCoordinates());
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const regions = ["시흥시"];

  // robotData가 변경될 때마다 formData와 좌표 업데이트
  React.useEffect(() => {
    if (robotData) {
      setFormData({
        ...robotData,
        region: robotData.region || "시흥시",
        coordinates: robotData.coordinates,
        coordinates_x: robotData.coordinates_x,
        coordinates_y: robotData.coordinates_y,
      });

      // coordinates_x, coordinates_y가 있으면 그 값을 우선 사용 (원본 좌표)
      let coordinatesFromData: MapCoordinates | null = null;

      // 숫자 타입인지 확인하고 null/undefined가 아닌지 체크
      if (
        typeof robotData.coordinates_x === "number" &&
        typeof robotData.coordinates_y === "number" &&
        !isNaN(robotData.coordinates_x) &&
        !isNaN(robotData.coordinates_y)
      ) {
        // 원본 좌표 그대로 사용
        coordinatesFromData = {
          x: robotData.coordinates_x,
          y: robotData.coordinates_y,
        };
      } else if (robotData.coordinates) {
        coordinatesFromData = robotData.coordinates;
      }

      setSelectedCoordinates(coordinatesFromData);

      // 디버깅 로그
      if (coordinatesFromData) {
        console.log(
          "RobotEditModal - 기존 좌표 설정됨:",
          `x=${coordinatesFromData.x}, y=${coordinatesFromData.y}`
        );
      } else {
        console.log("RobotEditModal - 좌표 없음");
      }
    } else {
      // robotData가 없으면 초기화
      setSelectedCoordinates(null);
    }
  }, [robotData]);

  // RobotMapSelector로부터 원본 좌표(x,y)를 그대로 받음
  const handleCoordinateSelect = (x: number, y: number) => {
    const coordinates = { x, y };
    setSelectedCoordinates(coordinates);
    setFormData((prev) => ({
      ...prev,
      coordinates,
      coordinates_x: x,
      coordinates_y: y,
    }));
    console.log(
      "RobotEditModal - 새로운 좌표 선택:",
      `x=${Math.round(x)}, y=${Math.round(y)}`
    );
  };

  const handleRegionChange = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      region,
    }));
  };

  const handleSave = async () => {
    if (!robotData) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/equipment", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          robotCode: robotData.code,
          usable: formData.isActive === "Y",
          installLocation: formData.location,
          region: formData.region,
          coordinates_x: formData.coordinates_x,
          coordinates_y: formData.coordinates_y,
          image_x: 289,
          image_y: 282,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "저장에 실패했습니다.");
        return;
      }

      onSave?.();
      onClose();
    } catch {
      alert("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[1032px] p-0 bg-zinc-100 border-0 rounded-2xl max-h-[90vh] max-md:max-w-[800px] max-md:w-full max-sm:max-w-[400px] overflow-y-auto">
        <div className="flex flex-col gap-16 items-start px-16 pt-14 pb-8 rounded-2xl bg-zinc-100 w-full max-md:px-10 max-md:pt-8 max-md:pb-6 max-sm:gap-10 max-sm:px-5 max-sm:pt-6 max-sm:pb-5">
          <div className="flex flex-col gap-8 items-start w-full">
            {/* Header */}
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-1 items-start w-[328px]">
                <DialogTitle className="text-2xl font-bold leading-8 text-zinc-900 max-sm:text-xl">
                  비니봇 정보 수정
                </DialogTitle>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-transparent"
              >
                <X className="h-8 w-8 text-gray-500" strokeWidth={2} />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="flex gap-20 items-start w-full max-md:flex-col max-md:gap-10 max-sm:gap-6">
              {/* Left Column */}
              <div className="flex flex-col gap-5 items-start w-[412px] max-md:w-full max-sm:gap-4">
                <FormField label="번호" value={formData.id} />
                <FormField label="비니봇 코드" value={formData.code} />
                <FormField
                  label="비니봇 위치"
                  value={formData.location}
                  editable
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, location: value }))
                  }
                />
                <FormField
                  label="금일 투입량"
                  value={`${formData.todayInputAmount || 0}kg`}
                />
                <FormField
                  label="설치 일시"
                  value={formData.installationDate}
                />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5 justify-start items-start w-[412px] max-md:w-full max-sm:gap-4">
                <FormField
                  label="마지막 투입일시"
                  value={formData.lastCollectionDate}
                />
                <FormField
                  label="누적 투입량"
                  value={`${formData.totalInputAmount || 0}kg`}
                />

                {/* 사용 여부 Field */}
                <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
                  <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
                    사용 여부
                  </div>
                  <div className="flex flex-1 gap-10 items-center max-md:gap-5 max-sm:flex-col max-sm:gap-3 max-sm:items-start">
                    <RadioOption
                      label="Y"
                      checked={formData.isActive === "Y"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, isActive: "Y" }))
                      }
                    />
                    <RadioOption
                      label="N"
                      checked={formData.isActive === "N"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, isActive: "N" }))
                      }
                    />
                  </div>
                </div>

                {/* 상태 Field - 읽기 전용 */}
                <FormField label="상태" value={formData.status} />
              </div>
            </div>

            {/* Region Section */}
            <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
              <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
                지역
              </div>
              <div className="flex-1 min-w-60 max-w-[400px] max-sm:w-full">
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsRegionDropdownOpen(!isRegionDropdownOpen)
                    }
                    className="flex gap-10 justify-between items-center p-3 w-full bg-white rounded-md border border-gray-200 border-solid text-xs font-bold text-sky-500"
                  >
                    <span className="self-stretch my-auto text-sky-500">
                      {formData.region}
                    </span>
                    <Image
                      src="/arrow_down.svg"
                      alt="dropdown arrow"
                      width={10}
                      height={7}
                      className="flex-shrink-0"
                    />
                  </button>

                  {isRegionDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => {
                            handleRegionChange(region);
                            setIsRegionDropdownOpen(false);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 text-sky-500 first:rounded-t-md last:rounded-b-md text-xs font-bold"
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="flex items-start w-full max-sm:flex-col max-sm:items-start">
              <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full"></div>
              <div className="flex flex-col gap-3 flex-1">
                <RobotMapSelector
                  onCoordinateSelect={handleCoordinateSelect}
                  selectedCoordinates={selectedCoordinates}
                />
                {/* 좌표 정보 표시 */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 justify-center items-end w-full">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex gap-1 justify-center items-center px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-base font-bold leading-6 text-gray-700 hover:bg-gray-50 h-[52px] w-[200px] max-sm:w-full"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex gap-1 justify-center items-center px-2.5 py-1 bg-sky-500 rounded-lg text-base font-bold leading-6 text-white hover:bg-sky-600 h-[52px] w-[200px] max-sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mx-2" />
                    저장 중
                  </>
                ) : (
                  "저장"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
