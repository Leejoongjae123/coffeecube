"use client";

import * as React from "react";
import { X, Edit3, Download } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Barcode from "react-barcode";
import { UserData } from "../types";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: UserData;
  onUserUpdated?: () => void; // 사용자 정보 업데이트 후 콜백
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
      {editable ? (
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 text-base leading-6 text-neutral-500 border-none p-0 h-auto focus:ring-0 focus:outline-none bg-transparent"
        />
      ) : (
        <div className="flex-1 text-base leading-6 text-zinc-400">{value}</div>
      )}
      {editable && (
        <div>
          <Edit3 className="w-4 h-4 text-neutral-400" />
        </div>
      )}
    </div>
  </div>
);

export default function UserEditModal({
  isOpen,
  onClose,
  userData,
  onUserUpdated,
}: UserEditModalProps) {
  const [formData, setFormData] = React.useState<UserData>({
    id: "",
    userId: "",
    phone: "",
    code: "",
    emission: "",
    points: "",
    grade: "",
    role: "",
    joinDate: "",
    lastAccess: "",
    status: "사용",
    email: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [barcodeData, setBarcodeData] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");

  // 날짜를 년월일 형식으로 포맷팅하는 함수
  const formatDateToYMD = (dateString: string) => {
    if (!dateString) {
      return "";
    }
    try {
      const date = new Date(dateString);
      return date
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\./g, "-")
        .replace(/ /g, "")
        .slice(0, -1);
    } catch {
      return dateString;
    }
  };

  // 사용자 정보 가져오기
  const fetchUserData = React.useCallback(async () => {
    if (!userData?.originalId) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userData.originalId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch {
      // 에러 처리
    } finally {
      setLoading(false);
    }
  }, [userData?.originalId]);

  React.useEffect(() => {
    if (isOpen && userData) {
      // 모달이 열릴 때 에러와 성공 메시지 초기화
      setError("");
      setSuccess("");

      if (userData.originalId) {
        fetchUserData();
      } else {
        setFormData({
          id: userData.id || "",
          userId: userData.userId || "",
          phone: userData.phone || "",
          code: userData.code || "",
          emission: userData.emission || "",
          points: userData.points || "",
          grade: userData.grade || "",
          role: userData.role || "",
          joinDate: userData.joinDate || "",
          lastAccess: userData.lastAccess || "",
          status: userData.status === "active" ? "사용" : "미사용",
          decryptedPassword: userData.decryptedPassword || "",
          email: userData.email || "",
        });
      }
    }
  }, [isOpen, userData, fetchUserData]);

  const handleSave = async () => {
    if (!userData?.originalId || saving) {
      return;
    }

    // 휴대폰 번호 유효성 검사
    if (formData.phone) {
      const phoneRegex = /^01[016789]\d{7,8}$/;
      if (!phoneRegex.test(formData.phone.replace(/[-\s]/g, ""))) {
        setError("올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)");
        return;
      }
    }

    // 에러와 성공 메시지 초기화
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/users/${userData.originalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("휴대폰 번호가 성공적으로 저장되었습니다.");

        // 상위 컴포넌트에 업데이트 알림
        if (onUserUpdated) {
          onUserUpdated();
        }

        // 2초 후 모달 닫기
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        // 구체적인 에러 메시지 처리
        if (response.status === 401) {
          setError("인증이 필요합니다. 다시 로그인해주세요.");
        } else if (response.status === 403) {
          setError("관리자 권한이 필요합니다.");
        } else {
          setError(result.error || "저장에 실패했습니다.");
        }
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  // SHA256 해싱 함수
  const sha256 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  // 바코드 데이터 생성 useEffect
  React.useEffect(() => {
    const generateBarcodeData = async () => {
      if (!formData.userId) {
        setBarcodeData("");
        return;
      }

      try {
        // 고정 salt 사용
        const salt = "coffee_cube_salt_2024";

        // decrypt된 비밀번호 우선 사용, 없으면 기본값
        const password = formData.decryptedPassword || "defaultpw";

        // SHA256 해싱
        const combinedData = `${formData.userId}${password}${salt}`;
        const hashedData = await sha256(combinedData);

        // 바코드 데이터에 사용자ID와 해시값 조합
        setBarcodeData(`${formData.userId}:${hashedData.substring(0, 16)}`);
      } catch {
        // 에러 발생 시 기본값 설정
        setBarcodeData(`${formData.userId}:default_hash`);
      }
    };

    generateBarcodeData();
  }, [formData.userId, formData.decryptedPassword]);

  const handleDownloadBarcode = () => {
    // 바코드 다운로드 기능 구현 (향후 추가 가능)
  };

  const BarcodeComponent = () => {
    try {
      return (
        <div className="flex flex-col gap-2 items-center">
          {userData?.originalId ? (
            <Image
              src={`/api/admin/users/${userData.originalId}/barcode`}
              alt="user-barcode"
              width={400}
              height={100}
              className="w-auto h-[80px] bg-white border border-gray-200"
            />
          ) : (
            barcodeData && (
              <Barcode
                value={barcodeData}
                width={2}
                height={50}
                fontSize={12}
                background="white"
                lineColor="black"
              />
            )
          )}
        </div>
      );
    } catch {
      return null;
    }
  };

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
            {loading ? (
              <div className="flex justify-center items-center w-full h-40">
                <div className="text-gray-500">
                  사용자 정보를 불러오는 중...
                </div>
              </div>
            ) : (
              <div className="flex gap-20 items-start w-full max-md:flex-col max-md:gap-10 max-sm:gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-5 items-start w-[412px] max-md:w-full max-sm:gap-4">
                  <FormField label="아이디" value={formData.email || ""} />
                  <FormField label="배출량" value={formData.emission || ""} />
                  <FormField label="포인트" value={formData.points || ""} />
                  <FormField label="등급" value={formData.grade || ""} />
                  <FormField
                    label="역할"
                    value={formData.role === "admin" ? "관리자" : "고객"}
                  />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-5 justify-start items-start w-[412px] max-md:w-full max-sm:gap-4">
                  {/* Barcode Field */}
                  <div className="flex items-center w-full min-h-[60px] max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
                    <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
                      바코드
                    </div>
                    <div className="flex flex-1 justify-between items-center w-full max-md:flex-col max-md:gap-4 max-md:items-start">
                      <div className="flex items-center">
                        <BarcodeComponent />
                      </div>
                      <Button
                        className="flex gap-1 items-center px-2 py-1 bg-sky-500 rounded text-xs leading-4 text-white hover:bg-sky-600 h-auto"
                        onClick={handleDownloadBarcode}
                      >
                        <Download className="w-4 h-4" />
                        저장
                      </Button>
                    </div>
                  </div>

                  <FormField
                    label="휴대폰 번호"
                    value={formData.phone || ""}
                    editable
                    onChange={handlePhoneChange}
                  />
                  <FormField
                    label="가입일시"
                    value={formatDateToYMD(formData.joinDate || "")}
                  />
                  <FormField
                    label="최종접속일"
                    value={formatDateToYMD(formData.lastAccess || "")}
                  />
                </div>
              </div>
            )}

            {/* Error and Success Messages */}
            {(error || success) && (
              <div className="flex justify-center w-full">
                {error && (
                  <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    {success}
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-2.5 justify-center items-end w-full">
              <Button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex gap-1 justify-center items-center px-2.5 py-1 bg-sky-500 rounded-lg text-base font-bold leading-6 text-white hover:bg-sky-600 h-[52px] w-[200px] max-sm:w-full disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
