"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import Image from "next/image";
import RobotMapSelector from "./RobotMapSelector";
import AddressSearchModal from "./AddressSearchModal";
import CommonModal from "@/components/ui/common-modal";
import type { MapCoordinates } from "../types";

interface RobotFormData {
  name: string;
  robotCode: string;
  installLocation: string;
  region: string;
  coordinates?: MapCoordinates;
  imageCoordinates?: MapCoordinates;
  regionSi?: string;
  regionDong?: string;
}

interface RobotRegisterFormProps {
  onSave?: (data: RobotFormData) => void;
}

export default function RobotRegisterForm({ onSave }: RobotRegisterFormProps) {
  const [formData, setFormData] = useState<RobotFormData>({
    name: "",
    robotCode: "",
    installLocation: "",
    region: "시흥시",
    regionSi: "시흥시",
    regionDong: "",
  });

  const [selectedCoordinates, setSelectedCoordinates] =
    useState<MapCoordinates | null>(null);
  const [selectedImageCoordinates, setSelectedImageCoordinates] =
    useState<MapCoordinates | null>(null);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regions = ["시흥시"];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCoordinateSelect = (x: number, y: number) => {
    const coordinates = { x, y };
    setSelectedCoordinates(coordinates);
    setFormData((prev) => ({
      ...prev,
      coordinates,
    }));
    console.log(`비니봇 설치 좌표 선택: x=${x}, y=${y}`);
  };

  const handleImageCoordinateSelect = (imageX: number, imageY: number) => {
    const imageCoordinates = { x: imageX, y: imageY };
    setSelectedImageCoordinates(imageCoordinates);
    setFormData((prev) => ({
      ...prev,
      imageCoordinates,
    }));
    console.log(`전체 이미지 좌표 선택: x=${imageX}, y=${imageY}`);
  };

  const handleAddressSelect = (payload: {
    address: string;
    regionDong?: string;
    regionSi?: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      installLocation: payload.address,
      regionSi: payload.regionSi || prev.regionSi,
      regionDong: payload.regionDong || prev.regionDong,
      region: payload.regionSi || prev.region || "시흥시",
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return "이름을 입력해주세요.";
    }
    if (!formData.robotCode.trim()) {
      return "비니봇 코드를 입력해주세요.";
    }
    if (!formData.installLocation.trim()) {
      return "설치 위치를 입력해주세요.";
    }
    if (!formData.region.trim()) {
      return "지역을 선택해주세요.";
    }
    if (!selectedImageCoordinates) {
      return "지도에서 설치 위치를 클릭하여 선택해주세요.";
    }
    return null;
  };

  const showModal = (title: string, message: string) => {
    setModalState({
      isOpen: true,
      title,
      message,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSave = async () => {
    // 폼 유효성 검사
    const validationError = validateForm();
    if (validationError) {
      showModal("입력 확인 필요", validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSave = {
        name: formData.name,
        robotCode: formData.robotCode,
        installLocation: formData.installLocation,
        regionSi: formData.regionSi || formData.region,
        regionDong: formData.regionDong || "",
        // DB 저장 규칙:
        // - coordinates_x/y: 이미지 로컬 좌표계(배경 이미지 좌상단 0,0) 기준 클릭 좌표
        // - image_x/y: 원본 이미지 크기 (289, 282)
        coordinates: selectedImageCoordinates,
        imageCoordinates: { x: 289, y: 282 },
      };

      const response = await fetch("/api/admin/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();

      if (!response.ok) {
        showModal("등록 실패", result.error || "등록에 실패했습니다.");
        return;
      }

      // 성공 처리
      if (onSave) {
        onSave({
          ...dataToSave,
          region: formData.regionSi || formData.region,
          coordinates: selectedImageCoordinates || undefined,
          imageCoordinates: { x: 289, y: 282 },
        });
      }

      // 폼 초기화
      setFormData({
        name: "",
        robotCode: "",
        installLocation: "",
        region: "시흥시",
        regionSi: "시흥시",
        regionDong: "",
      });
      setSelectedCoordinates(null);
      setSelectedImageCoordinates(null);

      showModal("등록 완료", "장비가 성공적으로 등록되었습니다.");
    } catch {
      showModal("네트워크 오류", "네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="px-16 pt-14 pb-8 rounded-2xl bg-zinc-100 max-md:px-5 w-full max-w-[1339px]">
        <div className="w-full max-w-[1211px] max-md:max-w-full">
          {/* Title */}
          <div className="flex flex-col items-start max-w-full text-2xl font-semibold leading-snug text-zinc-900 w-[568px]">
            <div className="max-w-full w-[328px]">
              <h2>비니봇 등록</h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="mt-8 w-full text-base font-medium max-md:max-w-full">
            <div className="flex flex-wrap gap-10 w-full max-md:max-w-full">
              {/* Left Column - Form Fields */}
              <div className="flex-1 shrink self-start basis-0 min-w-60 max-md:max-w-full">
                {/* Name Field */}
                <div className="flex flex-wrap items-center w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
                  <div className="self-stretch my-auto text-neutral-700 w-[120px]">
                    담당자 이름
                  </div>
                  <div className="flex overflow-hidden flex-1 shrink items-center self-stretch p-2 my-auto leading-snug border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full placeholder:text-neutral-500"
                      placeholder="이름을 입력하세요"
                    />
                    <Edit3 className="shrink-0 self-stretch my-auto w-4 h-4" />
                  </div>
                </div>

                {/* Robot Code Field */}
                <div className="flex flex-wrap items-center mt-5 w-full min-h-[38px] max-md:max-w-full">
                  <div className="self-stretch my-auto text-neutral-700 w-[120px]">
                    비니봇 코드
                  </div>
                  <div className="flex overflow-hidden flex-1 shrink items-center self-stretch p-2 my-auto leading-snug whitespace-nowrap border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
                    <input
                      type="text"
                      value={formData.robotCode}
                      onChange={(e) =>
                        handleInputChange("robotCode", e.target.value)
                      }
                      className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full placeholder:text-neutral-500"
                      placeholder="비니봇 코드를 입력하세요"
                    />
                    <Edit3 className="shrink-0 self-stretch my-auto w-4 h-4" />
                  </div>
                </div>

                {/* Installation Location Field */}
                <div className="flex flex-wrap items-center mt-5 w-full min-h-[38px] max-md:max-w-full">
                  <div className="self-stretch my-auto text-neutral-700 w-[120px]">
                    설치 위치
                  </div>
                  <div className="flex overflow-hidden flex-1 shrink items-center self-stretch p-2 my-auto leading-snug border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
                    <input
                      type="text"
                      value={formData.installLocation}
                      onChange={(e) =>
                        handleInputChange("installLocation", e.target.value)
                      }
                      onClick={() => setIsAddressModalOpen(true)}
                      className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full cursor-pointer placeholder:text-neutral-500"
                      placeholder="설치 위치를 입력하세요"
                      readOnly
                    />
                    <Image
                      src="/search.svg"
                      alt="search"
                      width={16}
                      height={16}
                      className="shrink-0 self-stretch my-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Region Selection and Map */}
              <div className="flex-1 shrink basis-0 min-w-60 max-md:max-w-full">
                {/* Region Label and Select on same line */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-neutral-700 w-24 text-base font-medium">
                    지역
                  </div>
                  <div className="flex-1">
                    {/* Region Dropdown */}
                    <div className="text-xs font-bold text-sky-500">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setIsRegionDropdownOpen(!isRegionDropdownOpen)
                          }
                          className="flex gap-10 justify-between items-center p-3 w-full bg-white rounded-md border border-gray-200 border-solid"
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
                                  handleInputChange("region", region);
                                  setIsRegionDropdownOpen(false);
                                }}
                                className="w-full p-3 text-left hover:bg-gray-50 text-sky-500 first:rounded-t-md last:rounded-b-md"
                              >
                                {region}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Section - aligned with select box */}
                <div className="ml-28">
                  <RobotMapSelector
                    onCoordinateSelect={handleCoordinateSelect}
                    onImageCoordinateSelect={handleImageCoordinateSelect}
                    selectedCoordinates={selectedCoordinates}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full mt-16 max-md:mt-10">
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex gap-1 justify-center items-center px-2.5 py-4 text-base font-semibold text-white whitespace-nowrap bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg min-h-[52px] w-[200px]"
          >
            {isSubmitting ? "등록 중..." : "저장"}
          </Button>
        </div>

        {/* Address Search Modal */}
        <AddressSearchModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSelect={handleAddressSelect}
        />

        {/* Common Modal */}
        <CommonModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={modalState.title}
          message={modalState.message}
        />
      </div>
    </div>
  );
}
