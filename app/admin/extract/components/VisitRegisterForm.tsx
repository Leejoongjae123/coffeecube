"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { ChevronDown, Edit3 } from "lucide-react";

interface VisitFormData {
  customerName: string;
  address: string;
  scheduledDate: Date | undefined;
  visitDate: Date | undefined;
  collectionAmount: string;
}

interface VisitRegisterFormProps {
  onSave?: (data: VisitFormData) => void;
}

export default function VisitRegisterForm({ onSave }: VisitRegisterFormProps) {
  const [formData, setFormData] = useState<VisitFormData>({
    customerName: '김비니',
    address: '서울 금천구 가산디지털1로 171',
    scheduledDate: new Date('2025-08-08'),
    visitDate: new Date('2025-08-08'),
    collectionAmount: 'nn'
  });

  const handleInputChange = (field: keyof VisitFormData, value: string | Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  return (
    <div className="flex flex-col px-16 pt-14 pb-8 leading-snug rounded-2xl bg-zinc-100 max-w-[800px] mx-auto max-md:px-5">
      <div className="w-full max-md:max-w-full">
        <div className="flex flex-col items-start max-w-full text-2xl font-semibold text-zinc-900 w-[568px]">
          <div className="max-w-full w-[328px]">
            <div>방문 등록 · 수정</div>
          </div>
        </div>
        
        <div className="mt-8 w-full text-base font-medium max-md:max-w-full">
          {/* 고객명 */}
          <div className="flex flex-wrap items-center w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              고객명
            </div>
            <div className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full"
              />
              <ChevronDown className="shrink-0 self-stretch my-auto w-4 h-4" />
            </div>
          </div>

          {/* 주소 */}
          <div className="flex flex-wrap items-center mt-5 w-full min-h-[38px] max-md:max-w-full">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              주소
            </div>
            <div className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full"
              />
              <Edit3 className="shrink-0 self-stretch my-auto w-4 h-4" />
            </div>
          </div>

          {/* 방문예정일 */}
          <div className="flex flex-wrap items-center mt-5 w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              방문예정일
            </div>
            <div className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
              <DatePicker
                selected={formData.scheduledDate}
                onSelect={(date) => handleInputChange('scheduledDate', date)}
                placeholder="방문예정일 선택"
                className="flex-1 border-none shadow-none bg-transparent p-0"
              />
            </div>
          </div>

          {/* 방문일 */}
          <div className="flex flex-wrap items-center mt-5 w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              방문일
            </div>
            <div className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
              <DatePicker
                selected={formData.visitDate}
                onSelect={(date) => handleInputChange('visitDate', date)}
                placeholder="방문일 선택"
                className="flex-1 border-none shadow-none bg-transparent p-0"
              />
            </div>
          </div>

          {/* 수거량 */}
          <div className="flex flex-wrap items-center mt-5 w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
            <div className="self-stretch my-auto text-neutral-700 w-[120px]">
              수거량
            </div>
            <div className="flex overflow-hidden flex-wrap flex-1 shrink items-center self-stretch p-2 my-auto border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
              <input
                type="text"
                value={formData.collectionAmount}
                onChange={(e) => handleInputChange('collectionAmount', e.target.value)}
                className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none max-md:max-w-full"
              />
              <Edit3 className="shrink-0 self-stretch my-auto w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
      
      <Button
        onClick={handleSave}
        className="flex gap-1 justify-center items-center self-center px-2.5 py-4 mt-16 max-w-full text-base font-semibold text-white whitespace-nowrap bg-sky-500 hover:bg-sky-600 rounded-lg min-h-[52px] w-[200px] max-md:mt-10"
      >
        저장
      </Button>
    </div>
  );
}
