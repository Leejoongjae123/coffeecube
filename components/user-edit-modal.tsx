"use client";

import * as React from "react";
import { X, Edit3, Download } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  userId: string;
  phone: string;
  code: string;
  emission: string;
  points: string;
  grade: string;
  joinDate: string;
  lastAccess: string;
  status: "사용" | "미사용";
}

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: UserData;
}

const FormField = ({ 
  label, 
  value, 
  editable = false, 
  width = "w-[272px]",
  className = ""
}: {
  label: string;
  value: string;
  editable?: boolean;
  width?: string;
  className?: string;
}) => (
  <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
    <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
      {label}
    </div>
    <div 
      className={`flex items-center ${editable ? 'p-2 border-b border-solid border-b-neutral-500' : 'px-2 py-3'} min-w-60 ${width} max-sm:w-full max-sm:min-w-[auto] ${className}`}
    >
      <div className={`flex-1 text-base leading-6 ${editable ? 'text-neutral-500' : 'text-zinc-400'}`}>
        {value}
      </div>
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
  onChange 
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
              backgroundColor: "transparent"
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
    <div className={`text-base leading-6 ${checked ? 'text-sky-500' : 'text-neutral-400'}`}>
      {label}
    </div>
  </div>
);

export default function UserEditModal({ isOpen, onClose, userData }: UserEditModalProps) {
  const [formData, setFormData] = React.useState<UserData>({
    id: userData?.id || "001",
    userId: userData?.userId || "asdfghjkl001",
    phone: userData?.phone || "010-0000-0000",
    code: userData?.code || "qwertyuiopasdfj",
    emission: userData?.emission || "nn",
    points: userData?.points || "nn",
    grade: userData?.grade || "nn",
    joinDate: userData?.joinDate || "2025-01-01-00:00:00",
    lastAccess: userData?.lastAccess || "2025-01-01-00:00:00",
    status: userData?.status || "사용"
  });

  const handleSave = () => {
    console.log("Saving user data:", formData);
    onClose();
  };

  const BarcodeImage = () => (
    <svg 
      width="200" 
      height="29" 
      viewBox="0 0 201 29" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-[200px] flex items-center"
    >
      <g clipPath="url(#clip0_710_2191)">
        <path d="M0.639648 14.6318V28.3057H1.86772H3.09579V14.6318V0.957938H1.86772H0.639648V14.6318Z" fill="black"></path>
        <path d="M4.85034 14.6318V28.3057H5.37666H5.90297V14.6318V0.957938H5.37666H4.85034V14.6318Z" fill="black"></path>
        <path d="M8.88452 14.6318V28.3057H9.41084H9.93715V14.6318V0.957938H9.41084H8.88452V14.6318Z" fill="black"></path>
        <path d="M15.9023 14.6318V28.3057H18.4462H20.9901V14.6318V0.957938H18.4462H15.9023V14.6318Z" fill="black"></path>
        <path d="M22.7451 14.6318V28.3057H23.2714H23.7977V14.6318V0.957938H23.2714H22.7451V14.6318Z" fill="black"></path>
        <path d="M25.5518 14.6318V28.3057H27.4816H29.4114V14.6318V0.957938H27.4816H25.5518V14.6318Z" fill="black"></path>
        <path d="M31.166 14.6318V28.3057H33.0081H34.8502V14.6318V0.957938H33.0081H31.166V14.6318Z" fill="black"></path>
        <path d="M36.6047 14.6318V28.3057H37.1311H37.6574V14.6318V0.957938H37.1311H36.6047V14.6318Z" fill="black"></path>
        <path d="M42.0432 14.6318V28.3057H43.2713H44.4994V14.6318V0.957938H43.2713H42.0432V14.6318Z" fill="black"></path>
        <path d="M46.2537 14.6318V28.3057H46.78H47.3063V14.6318V0.957938H46.78H46.2537V14.6318Z" fill="black"></path>
        <path d="M53.0957 14.6318V28.3057H54.3238H55.5518V14.6318V0.957938H54.3238H53.0957V14.6318Z" fill="black"></path>
        <path d="M57.3064 14.6318V28.3057H57.8327H58.359V14.6318V0.957938H57.8327H57.3064V14.6318Z" fill="black"></path>
        <path d="M61.5164 14.6318V28.3057H62.6567H63.7971V14.6318V0.957938H62.6567H61.5164V14.6318Z" fill="black"></path>
        <path d="M69.7625 14.6318V28.3057H70.2888H70.8151V14.6318V0.957938H70.2888H69.7625V14.6318Z" fill="black"></path>
        <path d="M73.9734 14.6318V28.3057H74.4997H75.026V14.6318V0.957938H74.4997H73.9734V14.6318Z" fill="black"></path>
        <path d="M76.7795 14.6318V28.3057H77.2181H77.6567V14.6318V0.957938H77.2181H76.7795V14.6318Z" fill="black"></path>
        <path d="M83.6221 14.6318V28.3057H84.8501H86.0782V14.6318V0.957938H84.8501H83.6221V14.6318Z" fill="black"></path>
        <path d="M87.6572 14.6318V28.3057H88.1835H88.7099V14.6318V0.957938H88.1835H87.6572V14.6318Z" fill="black"></path>
        <path d="M91.8679 14.6318V28.3057H92.3942H92.9206V14.6318V0.957938H92.3942H91.8679V14.6318Z" fill="black"></path>
        <path d="M94.6741 14.6318V28.3057H95.2004H95.7267V14.6318V0.957938H95.2004H94.6741V14.6318Z" fill="black"></path>
        <path d="M98.71 14.6318V28.3057H101.342H103.973V14.6318V0.957938H101.342H98.71V14.6318Z" fill="black"></path>
        <path d="M107.131 14.6318V28.3057H107.657H108.183V14.6318V0.957938H107.657H107.131V14.6318Z" fill="black"></path>
        <path d="M109.938 14.6318V28.3057H111.078H112.218V14.6318V0.957938H111.078H109.938V14.6318Z" fill="black"></path>
        <path d="M115.376 14.6318V28.3057H115.903H116.429V14.6318V0.957938H115.903H115.376V14.6318Z" fill="black"></path>
        <path d="M122.219 14.6318V28.3057H122.745H123.271V14.6318V0.957938H122.745H122.219V14.6318Z" fill="black"></path>
        <path d="M129.061 14.6318V28.3057H129.587H130.113V14.6318V0.957938H129.587H129.061V14.6318Z" fill="black"></path>
        <path d="M133.271 14.6318V28.3057H134.499H135.727V14.6318V0.957938H134.499H133.271V14.6318Z" fill="black"></path>
        <path d="M137.482 14.6318V28.3057H138.008H138.534V14.6318V0.957938H138.008H137.482V14.6318Z" fill="black"></path>
        <path d="M144.323 14.6318V28.3057H145.552H146.78V14.6318V0.957938H145.552H144.323V14.6318Z" fill="black"></path>
        <path d="M148.535 14.6318V28.3057H149.061H149.587V14.6318V0.957938H149.061H148.535V14.6318Z" fill="black"></path>
        <path d="M152.657 14.6318V28.3057H153.148H153.622V14.6318V0.957938H153.148H152.657V14.6318Z" fill="black"></path>
        <path d="M156.78 14.6318V28.3057H157.306H157.833V14.6318V0.957938H157.306H156.78V14.6318Z" fill="black"></path>
        <path d="M159.587 14.6318V28.3057H160.815H162.043V14.6318V0.957938H160.815H159.587V14.6318Z" fill="black"></path>
        <path d="M167.833 14.6318V28.3057H168.359H168.885V14.6318V0.957938H168.359H167.833V14.6318Z" fill="black"></path>
        <path d="M170.64 14.6318V28.3057H173.184H175.727V14.6318V0.957938H173.184H170.64V14.6318Z" fill="black"></path>
        <path d="M177.482 14.6318V28.3057H179.412H181.341V14.6318V0.957938H179.412H177.482V14.6318Z" fill="black"></path>
        <path d="M183.096 14.6318V28.3057H184.324H185.552V14.6318V0.957938H184.324H183.096V14.6318Z" fill="black"></path>
        <path d="M189.938 14.6318V28.3057H191.868H193.797V14.6318V0.957938H191.868H189.938V14.6318Z" fill="black"></path>
        <path d="M195.376 14.6318V28.3057H195.902H196.429V14.6318V0.957938H195.902H195.376V14.6318Z" fill="black"></path>
        <path d="M198.184 14.6318V28.3057H199.412H200.64V14.6318V0.957938H199.412H198.184V14.6318Z" fill="black"></path>
      </g>
      <defs>
        <clipPath id="clip0_710_2191">
          <rect width="200" height="27.3477" fill="white" transform="translate(0.639648 0.958008)"></rect>
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[1032px] p-0 bg-zinc-100 border-0 rounded-2xl h-[562px] max-md:max-w-[800px] max-md:w-full max-md:h-auto max-sm:max-w-[400px]">
        <div className="flex flex-col gap-16 items-start px-16 pt-14 pb-8 rounded-2xl bg-zinc-100 h-full w-full max-md:px-10 max-md:pt-8 max-md:pb-6 max-sm:gap-10 max-sm:px-5 max-sm:pt-6 max-sm:pb-5">
          <div className="flex flex-col gap-8 items-start w-full">
            {/* Header */}
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-1 items-start w-[328px]">
                <DialogTitle className="text-2xl font-bold leading-8 text-zinc-900 max-sm:text-xl">
                  사용자 정보 수정
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
                <FormField label="회원코드" value={formData.code} />
                <FormField label="아이디" value={formData.userId} editable />
                <FormField label="배출량" value={formData.emission} editable />
                <FormField label="가입일시" value={formData.joinDate} />
                <FormField label="등급" value={formData.grade} editable />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5 justify-start items-start w-[412px] max-md:w-full max-sm:gap-4">
                {/* Barcode Field */}
                <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
                  <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
                    바코드
                  </div>
                  <div className="flex flex-1 justify-between items-center w-full max-md:flex-col max-md:gap-4 max-md:items-start">
                    <div className="flex items-center">
                      <BarcodeImage />
                    </div>
                    <Button 
                      className="flex gap-1 items-center px-2 py-1 bg-sky-500 rounded text-xs leading-4 text-white hover:bg-sky-600 h-auto"
                      onClick={() => console.log("Download barcode")}
                    >
                      <Download className="w-4 h-4" />
                      저장
                    </Button>
                  </div>
                </div>

                <FormField label="휴대폰 번호" value={formData.phone} editable />
                <FormField label="포인트" value={formData.points} editable />
                <FormField label="최종접속일" value={formData.lastAccess} />

                {/* Status Field */}
                <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
                  <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
                    사용여부
                  </div>
                  <div className="flex flex-1 gap-10 items-center max-md:gap-5 max-sm:flex-col max-sm:gap-3 max-sm:items-start">
                    <RadioOption
                      label="사용"
                      checked={formData.status === "사용"}
                      onChange={() => setFormData(prev => ({ ...prev, status: "사용" }))}
                    />
                    <RadioOption
                      label="미사용"
                      checked={formData.status === "미사용"}
                      onChange={() => setFormData(prev => ({ ...prev, status: "미사용" }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-2.5 justify-center items-end w-full">
              <Button
                onClick={handleSave}
                className="flex gap-1 justify-center items-center px-2.5 py-1 bg-sky-500 rounded-lg text-base font-bold leading-6 text-white hover:bg-sky-600 h-[52px] w-[200px] max-sm:w-full"
              >
                저장
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
