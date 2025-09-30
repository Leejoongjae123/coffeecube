"use client";

import * as React from "react";
import { X, Edit3, Loader2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { VisitScheduleData } from "../types";

interface VisitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitData?: VisitScheduleData;
  onSave?: () => void;
}

const FormField = ({
  label,
  value,
  editable = false,
  width = "w-[272px]",
  className = "",
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  editable?: boolean;
  width?: string;
  className?: string;
  onChange?: (value: string) => void;
  type?: "text" | "number";
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
          type={type}
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

const DateField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
      <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
        {label}
      </div>
      <div className="flex items-center p-2 border-b border-solid border-b-neutral-500 min-w-60 w-[272px] max-sm:w-full max-sm:min-w-[auto]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="YYYY-MM-DD 형식으로 입력하세요"
          className="flex-1 text-base leading-6 text-neutral-500 bg-transparent border-none outline-none placeholder:text-neutral-400"
        />
        <Calendar className="w-4 h-4 text-neutral-400 ml-2" />
      </div>
    </div>
  );
};

export default function VisitEditModal({
  isOpen,
  onClose,
  visitData,
  onSave,
}: VisitEditModalProps) {
  const [formData, setFormData] = React.useState<VisitScheduleData>({
    id: visitData?.id || "",
    customerName: visitData?.customerName || "",
    address: visitData?.address || "",
    visitDate: visitData?.visitDate || "",
    collectionAmount: visitData?.collectionAmount || "",
    status: visitData?.status || "normal",
  });

  const [saving, setSaving] = React.useState(false);

  // visitData가 변경될 때마다 formData 업데이트
  React.useEffect(() => {
    if (visitData) {
      setFormData({
        ...visitData,
      });
    }
  }, [visitData]);

  const handleSave = async () => {
    if (!visitData) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/extract/history", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          customerName: formData.customerName,
          address: formData.address,
          visitDate: formData.visitDate,
          collectionAmount: parseFloat(formData.collectionAmount),
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
                  방문 일정 정보 수정
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
                <FormField label="번호" value={formData.id.slice(-3)} />
                <FormField
                  label="고객명"
                  value={formData.customerName}
                  editable
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, customerName: value }))
                  }
                />
                <FormField
                  label="주소"
                  value={formData.address}
                  editable
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, address: value }))
                  }
                />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-5 justify-start items-start w-[412px] max-md:w-full max-sm:gap-4">
                <DateField
                  label="방문일"
                  value={formData.visitDate}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, visitDate: value }))
                  }
                />
                <FormField
                  label="수거량"
                  value={formData.collectionAmount}
                  editable
                  type="number"
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      collectionAmount: value,
                    }))
                  }
                />
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
