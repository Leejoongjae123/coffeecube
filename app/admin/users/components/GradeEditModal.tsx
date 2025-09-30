"use client";

import React, { useState, useEffect } from "react";
import { X, Edit3, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CommonModal from "@/components/ui/common-modal";
import { GradeData } from "../types";

interface GradeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeData?: GradeData;
  onSave: (updatedGrade: GradeData) => Promise<boolean>;
  onAdd?: (newGrade: Omit<GradeData, "id" | "created_at">) => Promise<boolean>;
  onDelete?: (gradeId: number) => Promise<boolean>;
  mode: "edit" | "add";
}

const FormField = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  required = false,
  editable = true,
  width = "w-[272px]",
  className = "",
  children,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  required?: boolean;
  editable?: boolean;
  width?: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex items-center w-full h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
    <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
      {label} {required && <span className="text-red-500">*</span>}
    </div>
    <div
      className={`flex items-center ${
        editable && !disabled && !children
          ? "p-2 border-b border-solid border-b-neutral-500"
          : "px-2 py-3"
      } min-w-60 ${width} max-sm:w-full max-sm:min-w-[auto] ${className}`}
    >
      {children ? (
        <div className="flex-1 w-full">{children}</div>
      ) : disabled ? (
        <div className="flex-1 text-base leading-6 text-zinc-400">{value}</div>
      ) : (
        <>
          <input
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            className="flex-1 text-base leading-6 text-neutral-500 bg-transparent border-0 outline-none placeholder:text-neutral-400"
          />
          {editable && (
            <div>
              <Edit3 className="w-4 h-4 text-neutral-400" />
            </div>
          )}
        </>
      )}
    </div>
  </div>
);

export default function GradeEditModal({
  isOpen,
  onClose,
  gradeData,
  onSave,
  onAdd,
  onDelete,
  mode,
}: GradeEditModalProps) {
  const [formData, setFormData] = useState({
    grade_name: "",
    min: "",
    max: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // gradeData가 변경될 때 폼 데이터 초기화
  useEffect(() => {
    if (mode === "add") {
      // 추가 모드일 때는 빈 폼
      setFormData({
        grade_name: "",
        min: "",
        max: "",
      });
    } else if (gradeData) {
      // 수정 모드일 때는 기존 데이터로 채우기
      setFormData({
        grade_name: gradeData.grade_name || "",
        min: gradeData.min?.toString() || "",
        max:
          gradeData.max === 99999999
            ? "무제한"
            : gradeData.max?.toString() || "",
      });
    } else {
      setFormData({
        grade_name: "",
        min: "",
        max: "",
      });
    }
  }, [gradeData, mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.grade_name.trim()) {
      setErrorMessage("등급명을 입력해주세요.");
      return false;
    }

    if (!formData.min.trim()) {
      setErrorMessage("최소 포인트를 입력해주세요.");
      return false;
    }

    if (!formData.max.trim()) {
      setErrorMessage("최대 포인트를 입력해주세요.");
      return false;
    }

    const minValue = parseInt(formData.min);
    const maxValue =
      formData.max === "무제한" ? 99999999 : parseInt(formData.max);

    if (isNaN(minValue) || minValue < 0) {
      setErrorMessage("유효한 최소 포인트를 입력해주세요.");
      return false;
    }

    if (formData.max !== "무제한" && (isNaN(maxValue) || maxValue < 0)) {
      setErrorMessage("유효한 최대 포인트를 입력해주세요.");
      return false;
    }

    if (maxValue <= minValue && formData.max !== "무제한") {
      setErrorMessage("최대 포인트는 최소 포인트보다 커야 합니다.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "add") {
        if (!onAdd) {
          setErrorMessage("등급 추가 기능이 설정되지 않았습니다.");
          setShowErrorModal(true);
          return;
        }

        const newGrade = {
          grade_name: formData.grade_name.trim(),
          min: parseInt(formData.min),
          max: formData.max === "무제한" ? 99999999 : parseInt(formData.max),
        };

        const success = await onAdd(newGrade);

        if (success) {
          setShowSuccessModal(true);
        } else {
          setErrorMessage("등급 추가에 실패했습니다.");
          setShowErrorModal(true);
        }
      } else {
        if (!gradeData) {
          return;
        }

        const updatedGrade: GradeData = {
          ...gradeData,
          grade_name: formData.grade_name.trim(),
          min: parseInt(formData.min),
          max: formData.max === "무제한" ? 99999999 : parseInt(formData.max),
        };

        const success = await onSave(updatedGrade);

        if (success) {
          setShowSuccessModal(true);
        } else {
          setErrorMessage("등급 정보 수정에 실패했습니다.");
          setShowErrorModal(true);
        }
      }
    } catch {
      setErrorMessage(
        mode === "add"
          ? "등급 추가 중 오류가 발생했습니다."
          : "등급 정보 수정 중 오류가 발생했습니다."
      );
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  const handleDelete = async () => {
    if (!gradeData || !onDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await onDelete(gradeData.id);

      if (success) {
        setShowDeleteConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        setShowDeleteConfirmModal(false);
        setErrorMessage("등급 삭제에 실패했습니다.");
        setShowErrorModal(true);
      }
    } catch {
      setShowDeleteConfirmModal(false);
      setErrorMessage("등급 삭제 중 오류가 발생했습니다.");
      setShowErrorModal(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmModal(false);
  };

  if (mode === "edit" && !gradeData) {
    return null;
  }

  return (
    <>
      <Dialog
        open={isOpen && !showSuccessModal && !showErrorModal}
        onOpenChange={() => onClose()}
      >
        <DialogContent className="max-w-[800px] p-0 bg-zinc-100 border-0 rounded-2xl h-[500px] max-md:max-w-[600px] max-md:w-full max-md:h-auto max-sm:max-w-[400px]">
          <div className="flex flex-col px-16 py-14 rounded-2xl bg-zinc-100 h-full w-full max-md:px-10 max-md:pt-8 max-md:pb-6 max-sm:px-5 max-sm:pt-6 max-sm:pb-5">
            {/* Content Area */}
            <div className="flex flex-col gap-8 items-start w-full flex-grow">
              {/* Header */}
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col gap-1 items-start">
                  <DialogTitle className="text-2xl font-bold leading-8 text-zinc-900 max-sm:text-xl">
                    {mode === "add" ? "새 등급 추가" : "등급 정보 수정"}
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
                <div className="flex flex-col gap-5 items-start w-full max-md:w-full max-sm:gap-4">
                  {mode === "edit" && gradeData && (
                    <FormField
                      label="등급 ID"
                      value={gradeData.id.toString()}
                      editable={false}
                    />
                  )}

                  <FormField
                    label="등급명"
                    value={formData.grade_name}
                    onChange={(value) => handleInputChange("grade_name", value)}
                    placeholder="등급명을 입력하세요"
                    required={true}
                  />

                  <FormField
                    label="최소 포인트"
                    value={formData.min}
                    onChange={(value) => handleInputChange("min", value)}
                    placeholder="최소 포인트를 입력하세요"
                    type="text"
                    required={true}
                  />

                  <FormField
                    label="최대 포인트"
                    value={formData.max}
                    onChange={(value) => handleInputChange("max", value)}
                    placeholder="최대 포인트를 입력하세요"
                    type="text"
                    required={true}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex gap-2.5 justify-center items-center w-full mt-auto">
              {mode === "edit" && (
                <Button
                  onClick={handleDeleteConfirm}
                  variant="outline"
                  className="flex gap-1 justify-center items-center px-2.5 py-1 bg-white border border-gray-300 rounded-lg text-base font-bold leading-6 text-gray-700 hover:bg-gray-50 h-[52px] w-[200px] max-sm:w-full"
                >
                  삭제
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex gap-1 justify-center items-center px-2.5 py-1 bg-sky-500 rounded-lg text-base font-bold leading-6 text-white hover:bg-sky-600 h-[52px] w-[200px] max-sm:w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {mode === "add" ? "추가 중" : "저장 중"}
                  </>
                ) : mode === "add" ? (
                  "추가"
                ) : (
                  "저장"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 성공 모달 */}
      <CommonModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={mode === "add" ? "추가 완료" : "수정 완료"}
        message={
          mode === "add"
            ? "새 등급이 성공적으로 추가되었습니다."
            : "등급 정보가 성공적으로 수정되었습니다."
        }
        confirmText="확인"
      />

      {/* 에러 모달 */}
      <CommonModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title={mode === "add" ? "추가 실패" : "작업 실패"}
        message={errorMessage}
        confirmText="확인"
      />

      {/* 삭제 확인 모달 */}
      <CommonModal
        isOpen={showDeleteConfirmModal}
        onClose={handleDeleteCancel}
        title="등급 삭제 확인"
        message={`정말로 '${gradeData?.grade_name}' 등급을 삭제하시겠습니까? 삭제된 등급은 복구할 수 없으며, 해당 등급을 사용하는 사용자들에게 영향을 줄 수 있습니다.`}
        confirmText={isDeleting ? "삭제 중..." : "확인"}
        cancelText="취소"
        onConfirm={handleDelete}
        showCancel={true}
        variant="default"
      />
    </>
  );
}
