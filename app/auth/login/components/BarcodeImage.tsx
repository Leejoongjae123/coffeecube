"use client";

import React from "react";

export default function BarcodeImage() {
  const [src, setSrc] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const urlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/barcode", {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!res.ok) {
          setError("바코드를 생성할 수 없습니다.");
          return;
        }

        const blob = await res.blob();
        if (urlRef.current) {
          URL.revokeObjectURL(urlRef.current);
        }
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setSrc(url);
      } catch {
        setError("바코드 로딩 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center space-y-3">
        <div className="w-full bg-white rounded-lg relative aspect-[4/1] p-4">
          <div className="w-full h-full animate-pulse bg-gray-200 rounded-md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!src) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-3">
      <div className="w-full bg-white rounded-lg relative aspect-[4/1] flex items-center justify-center p-2">
        <img
          src={src}
          alt="로그인 바코드"
          className="max-h-full object-contain"
        />
      </div>
    </div>
  );
}
