"use client";

import React, { useState } from "react";
import Script from "next/script";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Daum Postcode API 타입 정의
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose?: () => void;
        width?: string | number;
        height?: string | number;
      }) => {
        open: () => void;
      };
    };
  }
}

interface DaumPostcodeData {
  zonecode: string; // 우편번호
  address: string; // 주소
  addressEnglish: string; // 영문 주소
  addressType: "R" | "J"; // R: 도로명, J: 지번
  bname: string; // 법정동/법정리 이름
  buildingName: string; // 건물명
  apartment: "Y" | "N"; // 공동주택 여부
  jibunAddress: string; // 지번 주소
  roadAddress: string; // 도로명 주소
  autoRoadAddress: string; // 도로명 주소(참고항목 제외)
  autoJibunAddress: string; // 지번 주소(참고항목 제외)
  userSelectedType: "R" | "J"; // 사용자가 선택한 주소 타입
  sido?: string; // 시/도
  sigungu?: string; // 시/군/구
  bcode?: string; // 법정동 코드
}

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (payload: {
    address: string;
    regionDong?: string;
    regionSi?: string;
  }) => void;
}

export default function AddressSearchModal({
  isOpen,
  onClose,
  onSelect,
}: AddressSearchModalProps) {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [regionDong, setRegionDong] = useState<string>("");
  const [regionSi, setRegionSi] = useState<string>("");

  const handlePostcodeSearch = () => {
    if (!isScriptLoaded || !window.daum) {
      alert("주소 검색 서비스를 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const postcode = new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        // 사용자가 선택한 주소 타입에 따라 주소 설정
        let fullAddress = data.address;
        let extraAddress = "";

        // 도로명 주소인 경우
        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== ""
                ? ", " + data.buildingName
                : data.buildingName;
          }
          fullAddress += extraAddress !== "" ? " (" + extraAddress + ")" : "";
        }

        setSelectedAddress(fullAddress);
        setRegionDong(data.bname || "");
        setRegionSi(data.sigungu || "");
      },
      onclose: () => {
        // 검색 창이 닫힐 때 처리할 내용 (필요시)
      },
      width: "100%",
      height: "100%",
    });

    postcode.open();
  };

  const handleConfirm = () => {
    if (!selectedAddress.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }

    const finalAddress = detailAddress.trim()
      ? `${selectedAddress} ${detailAddress}`
      : selectedAddress;
    onSelect({ address: finalAddress, regionDong, regionSi });
    handleClose();
  };

  const handleClose = () => {
    setSelectedAddress("");
    setDetailAddress("");
    setRegionDong("");
    setRegionSi("");
    onClose();
  };

  return (
    <>
      {/* Daum Postcode Script */}
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="lazyOnload"
      />

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>주소 검색</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="selected-address">기본 주소</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="selected-address"
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  placeholder="주소를 검색하거나 직접 입력하세요"
                  className="flex-1"
                  readOnly
                />
                <Button
                  type="button"
                  onClick={handlePostcodeSearch}
                  variant="outline"
                  className="whitespace-nowrap"
                  disabled={!isScriptLoaded}
                >
                  주소 검색
                </Button>
              </div>
              {!isScriptLoaded && (
                <p className="text-sm text-gray-500 mt-1">
                  주소 검색 서비스를 로딩 중입니다...
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="detail-address">상세주소 (선택사항)</Label>
              <Input
                id="detail-address"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="동, 호수 등 상세주소를 입력하세요"
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose}>
                취소
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedAddress.trim()}
              >
                확인
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
