"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, X } from "lucide-react";
import RobotMapSelector from './RobotMapSelector';
import type { MapCoordinates } from '../types';

interface RobotFormData {
  name: string;
  robotCode: string;
  installLocation: string;
  region: string;
  coordinates?: MapCoordinates;
}

interface RobotRegisterFormProps {
  onSave?: (data: RobotFormData) => void;
}

export default function RobotRegisterForm({ onSave }: RobotRegisterFormProps) {
  const [formData, setFormData] = useState<RobotFormData>({
    name: 'OOO',
    robotCode: 'asdfghjkl001',
    installLocation: '서울 금천구 가산디지털1로 171',
    region: '시흥시'
  });

  const [selectedCoordinates, setSelectedCoordinates] = useState<MapCoordinates | null>(null);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  const regions = ['시흥시'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoordinateSelect = (x: number, y: number) => {
    const coordinates = { x, y };
    setSelectedCoordinates(coordinates);
    setFormData(prev => ({
      ...prev,
      coordinates
    }));
    console.log(`비니봇 설치 좌표 선택: x=${x}, y=${y}`);
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      coordinates: selectedCoordinates || undefined
    };
    
    if (onSave) {
      onSave(dataToSave);
    }
    console.log('저장:', dataToSave);
  };

  return (
    <div className="w-full flex justify-center">
    <div className="px-16 pt-14 pb-8 rounded-2xl bg-zinc-100 max-md:px-5 w-full max-w-[1339px]">
      <div className="w-full max-w-[1211px] max-md:max-w-full">
        {/* Title */}
        <div className="flex flex-col items-start max-w-full text-2xl font-semibold leading-snug text-zinc-900 w-[568px]">
          <div className="max-w-full w-[328px]">
            <h2>비니봇 등록 · 수정</h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex flex-wrap gap-10 mt-8 w-full max-md:max-w-full">
          {/* Left Column - Form Fields */}
          <div className="flex-1 shrink self-start text-base font-medium basis-0 min-w-60 max-md:max-w-full">
            {/* Name Field */}
            <div className="flex flex-wrap items-center w-full whitespace-nowrap min-h-[38px] max-md:max-w-full">
              <Label className="self-stretch my-auto leading-6 text-neutral-700 w-[120px]">
                이름
              </Label>
              <div className="flex overflow-hidden flex-1 shrink items-center self-stretch p-2 my-auto leading-snug border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="flex-1 shrink self-stretch my-auto basis-0 border-0 shadow-none p-0 h-auto bg-transparent focus-visible:ring-0"
                  placeholder="이름을 입력하세요"
                />
                <X className="shrink-0 self-stretch my-auto w-4 h-4 text-neutral-500" />
              </div>
            </div>

            {/* Robot Code Field */}
            <div className="flex flex-wrap items-center mt-5 w-full min-h-[38px] max-md:max-w-full">
              <Label className="self-stretch my-auto leading-6 text-neutral-700 w-[120px]">
                비니봇 코드
              </Label>
              <div className="flex overflow-hidden flex-1 shrink items-center self-stretch p-2 my-auto leading-snug whitespace-nowrap border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
                <Input
                  value={formData.robotCode}
                  onChange={(e) => handleInputChange('robotCode', e.target.value)}
                  className="flex-1 shrink self-stretch my-auto basis-0 border-0 shadow-none p-0 h-auto bg-transparent focus-visible:ring-0"
                  placeholder="비니봇 코드를 입력하세요"
                />
                <X className="shrink-0 self-stretch my-auto w-4 h-4 text-neutral-500" />
              </div>
            </div>

            {/* Installation Location Field */}
            <div className="flex flex-wrap items-center mt-5 w-full min-h-[38px] max-md:max-w-full">
              <Label className="self-stretch my-auto leading-6 text-neutral-700 w-[120px]">
                설치 위치
              </Label>
              <div className="flex overflow-hidden flex-1 shrink items-center self-stretch p-2 my-auto leading-snug border-solid basis-0 border-b border-b-neutral-500 min-w-60 text-neutral-500 max-md:max-w-full">
                <Input
                  value={formData.installLocation}
                  onChange={(e) => handleInputChange('installLocation', e.target.value)}
                  className="flex-1 shrink self-stretch my-auto basis-0 border-0 shadow-none p-0 h-auto bg-transparent focus-visible:ring-0"
                  placeholder="설치 위치를 입력하세요"
                />
                <X className="shrink-0 self-stretch my-auto w-4 h-4 text-neutral-500" />
              </div>
            </div>
          </div>

          {/* Right Column - Region Selection */}
          <div className="flex flex-wrap items-start h-full whitespace-nowrap min-w-60 w-[596px] max-md:max-w-full">
            <Label className="grow shrink w-24 font-medium leading-6 text-neutral-700">
              지역
            </Label>
            <div className="grow shrink min-w-60 w-[452px] max-md:max-w-full">
              {/* Region Dropdown */}
              <div className="w-full text-xs font-bold text-sky-500 max-w-[476px] max-md:max-w-full">
                <div className="relative">
                  <button
                    onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                    className="flex gap-10 justify-between items-center p-3 w-full bg-white rounded-md border border-gray-200 border-solid max-md:max-w-full"
                  >
                    <span className="self-stretch my-auto text-sky-500">
                      {formData.region}
                    </span>
                    <ChevronDown className="shrink-0 self-stretch my-auto w-2.5 h-2.5 text-sky-500" />
                  </button>
                  
                  {isRegionDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => {
                            handleInputChange('region', region);
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

              {/* Map Section */}
              <RobotMapSelector
                onCoordinateSelect={handleCoordinateSelect}
                selectedCoordinates={selectedCoordinates}
              />

              {/* 좌표 정보 표시 */}
              
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-2.5 justify-center items-end mt-16 w-full text-base font-semibold leading-snug text-white whitespace-nowrap max-md:mt-10 max-md:max-w-full">
        <Button
          onClick={handleSave}
          className="flex gap-1 justify-center items-center px-2.5 py-4 bg-sky-500 rounded-lg min-h-[52px] w-[200px] hover:bg-sky-600"
        >
          저장
        </Button>
      </div>
    </div>
    </div>
  );
}