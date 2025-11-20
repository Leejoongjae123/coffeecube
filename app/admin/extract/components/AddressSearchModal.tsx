/**
 * Daum 우편번호 서비스를 사용한 주소 검색 모달 컴포넌트
 * @see https://postcode.map.daum.net/guide
 *
 * 주요 기능:
 * - Daum Postcode API를 통한 주소 검색
 * - 도로명 주소 및 지번 주소 지원
 * - 사용자가 선택한 주소 타입 반영
 * - 상세주소 입력 지원
 */
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
    daum?: {
      Postcode: new (options: PostcodeOptions) => PostcodeInstance;
    };
  }
}

interface PostcodeOptions {
  oncomplete: (data: DaumPostcodeData) => void;
  onclose?: () => void;
  onresize?: (size: { width: number; height: number }) => void;
  onsearch?: (searchData: { q: string }) => void;
  width?: string | number;
  height?: string | number;
  animation?: boolean;
  focusInput?: boolean;
  theme?: {
    bgColor?: string;
    searchBgColor?: string;
    contentBgColor?: string;
    pageBgColor?: string;
    textColor?: string;
    queryTextColor?: string;
    postcodeTextColor?: string;
    emphTextColor?: string;
    outlineColor?: string;
  };
}

interface PostcodeInstance {
  open: (openOptions?: {
    q?: string;
    left?: number;
    top?: number;
    popupTitle?: string;
    autoClose?: boolean;
  }) => void;
  embed: (
    targetElement: HTMLElement,
    embedOptions?: { q?: string; autoClose?: boolean }
  ) => void;
}

interface DaumPostcodeData {
  zonecode: string; // 우편번호
  address: string; // 주소
  addressEnglish: string; // 영문 주소
  addressType: "R" | "J"; // R: 도로명, J: 지번
  userSelectedType: "R" | "J"; // 사용자가 선택한 주소 타입
  roadAddress: string; // 도로명 주소
  roadAddressEnglish: string; // 영문 도로명 주소
  jibunAddress: string; // 지번 주소
  jibunAddressEnglish: string; // 영문 지번 주소
  autoRoadAddress: string; // 도로명 주소(참고항목 제외)
  autoRoadAddressEnglish: string; // 영문 도로명 주소(참고항목 제외)
  autoJibunAddress: string; // 지번 주소(참고항목 제외)
  autoJibunAddressEnglish: string; // 영문 지번 주소(참고항목 제외)
  buildingCode: string; // 건물 관리 번호
  buildingName: string; // 건물명
  apartment: "Y" | "N"; // 공동주택 여부
  sido: string; // 시/도
  sidoEnglish: string; // 영문 시/도
  sigungu: string; // 시/군/구
  sigunguEnglish: string; // 영문 시/군/구
  sigunguCode: string; // 시/군/구 코드
  roadnameCode: string; // 도로명 코드
  bcode: string; // 법정동/법정리 코드
  roadname: string; // 도로명
  roadnameEnglish: string; // 영문 도로명
  bname: string; // 법정동/법정리 이름
  bnameEnglish: string; // 영문 법정동/법정리 이름
  bname1: string; // 법정리의 읍/면 이름
  bname1English: string; // 영문 법정리의 읍/면 이름
  bname2: string; // 법정동/법정리 이름
  bname2English: string; // 영문 법정동/법정리 이름
  hname: string; // 행정동 이름
  query: string; // 검색어
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
  const [scriptError, setScriptError] = useState(false);
  const [regionDong, setRegionDong] = useState<string>("");
  const [regionSi, setRegionSi] = useState<string>("");

  const handlePostcodeSearch = () => {
    if (!window.daum) {
      alert("주소 검색 서비스를 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      const postcode = new window.daum.Postcode({
        oncomplete: (data: DaumPostcodeData) => {
          // 사용자가 선택한 주소 타입에 따라 주소 설정
          let fullAddress = "";
          let extraAddress = "";

          // 사용자가 선택한 주소 타입 기준으로 주소 설정
          if (data.userSelectedType === "R") {
            // 도로명 주소 선택
            fullAddress = data.roadAddress;
          } else {
            // 지번 주소 선택
            fullAddress = data.jibunAddress;
          }

          // 참고항목 추가 (도로명 주소인 경우)
          if (data.userSelectedType === "R") {
            if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
              extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
              extraAddress +=
                extraAddress !== ""
                  ? `, ${data.buildingName}`
                  : data.buildingName;
            }
            if (extraAddress !== "") {
              fullAddress += ` (${extraAddress})`;
            }
          }

          setSelectedAddress(fullAddress);
          setRegionDong(data.bname || data.bname1 || "");
          setRegionSi(data.sigungu || "");
        },
        width: "100%",
        height: "100%",
        animation: true,
        focusInput: true,
      });

      postcode.open();
    } catch {
      alert("주소 검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
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
      {/* Daum Postcode Script - 공식 CDN */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        onLoad={() => {
          setIsScriptLoaded(true);
          setScriptError(false);
        }}
        onError={() => {
          setScriptError(true);
          setIsScriptLoaded(false);
        }}
        strategy="afterInteractive"
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
              {!isScriptLoaded && !scriptError && (
                <p className="text-sm text-muted-foreground mt-1">
                  주소 검색 서비스를 로딩 중입니다...
                </p>
              )}
              {scriptError && (
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-destructive">
                    주소 검색 서비스를 불러올 수 없습니다.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    네트워크 연결을 확인하거나 페이지를 새로고침해주세요.
                  </p>
                </div>
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
