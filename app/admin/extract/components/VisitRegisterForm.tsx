"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Edit3, Search } from "lucide-react";
import { VisitFormData, ExtractHistoryApiResponse } from "../types";
import CommonModal from "@/components/ui/common-modal";

interface EquipmentItem {
  id: string;
  robot_code: string;
  install_location: string;
  name?: string;
}

interface VisitRegisterFormProps {
  onSave?: (data: VisitFormData) => void;
}

export default function VisitRegisterForm({ onSave }: VisitRegisterFormProps) {
  const [formData, setFormData] = useState<VisitFormData>({
    customerName: "",
    address: "",
    scheduledDate: undefined,
    visitDate: undefined,
    collectionAmount: "",
  });

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<EquipmentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleInputChange = (
    field: keyof VisitFormData,
    value: string | Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // 필수 필드 검증
    if (!formData.customerName.trim()) {
      setModalTitle("입력 오류");
      setModalMessage("담당자명을 입력해주세요.");
      setIsModalOpen(true);
      return;
    }

    if (!formData.address.trim()) {
      setModalTitle("입력 오류");
      setModalMessage("비니봇주소를 선택해주세요.");
      setIsModalOpen(true);
      return;
    }

    if (!formData.visitDate) {
      setModalTitle("입력 오류");
      setModalMessage("방문일을 선택해주세요.");
      setIsModalOpen(true);
      return;
    }

    if (
      !formData.collectionAmount.trim() ||
      isNaN(Number(formData.collectionAmount))
    ) {
      setModalTitle("입력 오류");
      setModalMessage("올바른 수거량을 입력해주세요.");
      setIsModalOpen(true);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/extract/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          address: formData.address,
          visitDate: formData.visitDate?.toISOString().split("T")[0], // YYYY-MM-DD 형식
          collectionAmount: formData.collectionAmount,
        }),
      });

      const result: ExtractHistoryApiResponse = await response.json();

      if (result.success) {
        setModalTitle("등록 완료");
        setModalMessage("방문 등록이 성공적으로 완료되었습니다.");
        setIsModalOpen(true);
        onSave?.(formData); // 기존 콜백도 호출
      } else {
        setModalTitle("등록 실패");
        setModalMessage(result.message);
        setIsModalOpen(true);
      }
    } catch {
      setModalTitle("등록 실패");
      setModalMessage("저장 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/admin/equipment/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectEquipment = (equipment: EquipmentItem) => {
    setFormData((prev) => ({
      ...prev,
      address: equipment.install_location,
    }));
    setIsSearchExpanded(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col px-16 pt-14 pb-8 leading-snug rounded-2xl bg-zinc-100 max-w-[800px] mx-auto max-md:px-5">
      <div className="w-full max-md:max-w-full">
        <div className="flex flex-col items-start max-w-full text-2xl font-semibold text-zinc-900 w-[568px]">
          <div className="max-w-full w-[328px]">
            <div>방문 등록</div>
          </div>
        </div>

        <div className="mt-8 w-full text-base font-medium max-md:max-w-full">
          {/* 고객명 */}
          <div className="flex flex-wrap items-center w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              담당자명
            </div>
            <div className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                placeholder="담당자명을 입력하세요"
                className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full placeholder:text-neutral-500"
              />
              <Edit3 className="shrink-0 self-stretch my-auto w-4 h-4" />
            </div>
          </div>

          {/* 비니봇선택 */}
          <div className="flex flex-wrap items-center mt-5 w-full min-h-[38px] max-md:max-w-full relative">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              비니봇주소
            </div>
            <div
              className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full cursor-pointer"
              onClick={handleSearchToggle}
            >
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="클릭하여 비니봇주소를 선택해주세요"
                className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full cursor-pointer placeholder:text-neutral-500"
                readOnly
              />
              <Search className="shrink-0 self-stretch my-auto w-4 h-4 cursor-pointer hover:text-neutral-700" />
            </div>

            {/* 플로팅 검색 영역 */}
            {isSearchExpanded && (
              <div className="absolute top-full left-[120px] right-0 mt-1 p-4 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                <div className="text-sm text-neutral-600 mb-3">
                  비니봇코드 혹은 주소를 입력해주세요
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    className="flex-1 p-2 border border-gray-300 rounded-md outline-none focus:border-sky-500"
                    autoFocus
                  />
                </div>

                {/* 검색 결과 리스트 */}
                {searchQuery && (
                  <div className="max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="text-center py-4 text-neutral-500">
                        검색 중...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((equipment) => (
                          <div
                            key={equipment.id}
                            onClick={() => handleSelectEquipment(equipment)}
                            className="p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-sky-50 hover:border-sky-300"
                          >
                            <div className="font-medium text-neutral-800">
                              비니봇코드: {equipment.robot_code}
                            </div>
                            <div className="text-sm text-neutral-600">
                              주소: {equipment.install_location}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-neutral-500">
                        검색 결과가 없습니다
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 방문예정일 */}

          {/* 방문일 */}
          <div className="flex flex-wrap items-center mt-5 w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              방문일
            </div>
            <div className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
              <DatePicker
                selected={formData.visitDate}
                onSelect={(date) => handleInputChange("visitDate", date)}
                placeholder="클릭하여 방문일자를 입력하세요"
                className="flex-1 border-none shadow-none bg-transparent p-0 text-base text-neutral-500"
                icon="/calendar.svg"
              />
            </div>
          </div>

          {/* 수거량 */}
          <div className="flex flex-wrap items-center mt-5 w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              수거량(g)
            </div>
            <div className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
              <input
                type="text"
                value={formData.collectionAmount}
                onChange={(e) =>
                  handleInputChange("collectionAmount", e.target.value)
                }
                placeholder="수거량을 입력하세요 (단위: kg)"
                className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full placeholder:text-neutral-500"
              />
              <Edit3 className="shrink-0 self-stretch my-auto w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="flex gap-1 justify-center items-center self-center px-2.5 py-4 mt-16 max-w-full text-base font-semibold text-white whitespace-nowrap bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg min-h-[52px] w-[200px] max-md:mt-10"
      >
        {isSaving ? "저장 중..." : "저장"}
      </Button>

      {/* 등록 완료/오류 모달 */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        confirmText="확인"
      />
    </div>
  );
}
