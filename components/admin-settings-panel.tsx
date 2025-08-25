"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

const EditIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 17 17" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
  >
    <g clipPath="url(#clip0_711_970)">
      <path 
        d="M2.56396 15.1573H5.3923L15.7633 4.78634L12.9346 1.95801L2.56396 12.329V15.1573Z" 
        stroke="#727272" 
        strokeWidth="1.4" 
        strokeLinejoin="round"
      />
      <path 
        d="M10.1062 4.78613L12.9345 7.61447" 
        stroke="#727272" 
        strokeWidth="1.4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_711_970">
        <rect width="16" height="16" fill="white" transform="translate(0.789062 0.657227)" />
      </clipPath>
    </defs>
  </svg>
);

const DownloadIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 25 25" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
  >
    <path 
      d="M12.2891 16.2322C12.1557 16.2322 12.0307 16.2116 11.9141 16.1702C11.7974 16.1289 11.6891 16.0579 11.5891 15.9572L7.98906 12.3572C7.78906 12.1572 7.69306 11.9239 7.70106 11.6572C7.70906 11.3906 7.80506 11.1572 7.98906 10.9572C8.18906 10.7572 8.42673 10.6532 8.70206 10.6452C8.9774 10.6372 9.21473 10.7329 9.41406 10.9322L11.2891 12.8072V5.65723C11.2891 5.3739 11.3851 5.13656 11.5771 4.94523C11.7691 4.7539 12.0064 4.6579 12.2891 4.65723C12.5717 4.65656 12.8094 4.75256 13.0021 4.94523C13.1947 5.1379 13.2904 5.37523 13.2891 5.65723V12.8072L15.1641 10.9322C15.3641 10.7322 15.6017 10.6362 15.8771 10.6442C16.1524 10.6522 16.3897 10.7566 16.5891 10.9572C16.7724 11.1572 16.8684 11.3906 16.8771 11.6572C16.8857 11.9239 16.7897 12.1572 16.5891 12.3572L12.9891 15.9572C12.8891 16.0572 12.7807 16.1282 12.6641 16.1702C12.5474 16.2122 12.4224 16.2329 12.2891 16.2322ZM6.28906 20.6572C5.73906 20.6572 5.2684 20.4616 4.87706 20.0702C4.48573 19.6789 4.28973 19.2079 4.28906 18.6572V16.6572C4.28906 16.3739 4.38506 16.1366 4.57706 15.9452C4.76906 15.7539 5.0064 15.6579 5.28906 15.6572C5.57173 15.6566 5.8094 15.7526 6.00206 15.9452C6.19473 16.1379 6.2904 16.3752 6.28906 16.6572V18.6572H18.2891V16.6572C18.2891 16.3739 18.3851 16.1366 18.5771 15.9452C18.7691 15.7539 19.0064 15.6579 19.2891 15.6572C19.5717 15.6566 19.8094 15.7526 20.0021 15.9452C20.1947 16.1379 20.2904 16.3752 20.2891 16.6572V18.6572C20.2891 19.2072 20.0934 19.6782 19.7021 20.0702C19.3107 20.4622 18.8397 20.6579 18.2891 20.6572H6.28906Z" 
      fill="white"
    />
  </svg>
);

const FormField = ({ 
  label, 
  value, 
  editable = false
}: {
  label: string;
  value: string;
  editable?: boolean;
}) => (
  <div className="flex items-center self-stretch h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
    <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
      {label}
    </div>
    <div className="flex items-center p-2 border-b border-solid border-b-neutral-500 flex-[1_0_0] min-w-60 max-sm:w-full max-sm:min-w-[auto]">
      <div className="text-base leading-6 flex-[1_0_0] text-neutral-500">
        {value}
      </div>
      {editable && (
        <div>
          <EditIcon />
        </div>
      )}
    </div>
  </div>
);

export default function AdminSettingsPanel() {
  const [passwordChangeData] = React.useState({
    userId: "asdfghjkl001",
    password: "***********"
  });

  const [adminRegistrationData] = React.useState({
    userId: "asdfghjkl001",
    password: "***********"
  });

  const handlePasswordChangeSave = () => {
    console.log("Saving password change:", passwordChangeData);
  };

  const handleAdminRegistrationSave = () => {
    console.log("Saving admin registration:", adminRegistrationData);
  };

  const handleBarcodeDownload = () => {
    console.log("Downloading barcode");
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="flex gap-16 items-center mx-auto w-full max-w-none max-md:flex-col max-md:gap-8 max-md:max-w-[991px] max-sm:gap-6 max-sm:max-w-screen-sm">
        {/* 관리자 암호 변경 Panel */}
        <div className="flex flex-col gap-16 items-start self-stretch px-16 pt-14 pb-8 rounded-2xl bg-zinc-100 flex-[1_0_0] max-md:gap-10 max-md:px-8 max-md:pt-10 max-md:pb-6 max-sm:gap-8 max-sm:px-4 max-sm:pt-6 max-sm:pb-4">
          <div className="flex flex-col gap-8 items-start self-stretch">
            <div className="flex flex-col gap-4 items-start w-[568px] max-md:w-full">
              <div className="self-stretch text-2xl font-bold leading-8 text-zinc-900 max-sm:text-xl">
                관리자 암호 변경
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start self-stretch">
            <FormField 
              label="아이디" 
              value={passwordChangeData.userId}
              editable={true}
            />
            <FormField 
              label="암호" 
              value={passwordChangeData.password}
              editable={true}
            />
          </div>
          <div className="flex gap-2.5 justify-center items-end self-stretch">
            <Button
              onClick={handlePasswordChangeSave}
              className="flex gap-1 justify-center items-center px-2.5 py-1 bg-sky-500 rounded-lg cursor-pointer h-[52px] w-[200px] max-sm:w-full text-base font-bold leading-6 text-white hover:bg-sky-600"
            >
              저장
            </Button>
          </div>
        </div>

        {/* 비니봇 관리자 등록 Panel */}
        <div className="flex flex-col gap-16 items-start self-stretch px-16 pt-14 pb-8 rounded-2xl bg-zinc-100 flex-[1_0_0] max-md:gap-10 max-md:px-8 max-md:pt-10 max-md:pb-6 max-sm:gap-8 max-sm:px-4 max-sm:pt-6 max-sm:pb-4">
          <div className="flex flex-col gap-8 items-start self-stretch">
            <div className="flex flex-col gap-4 items-start w-[568px] max-md:w-full">
              <div className="self-stretch text-2xl font-bold leading-8 text-zinc-900 max-sm:text-xl">
                비니봇 관리자 등록
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 items-start self-stretch">
            <FormField 
              label="아이디" 
              value={adminRegistrationData.userId}
              editable={true}
            />
            <FormField 
              label="암호" 
              value={adminRegistrationData.password}
              editable={true}
            />
            <div className="flex items-center self-stretch h-11 max-sm:flex-col max-sm:gap-2 max-sm:items-start max-sm:h-auto">
              <div className="text-base leading-6 text-neutral-700 w-[120px] max-sm:w-full">
                바코드
              </div>
              <div className="flex justify-between items-center self-stretch flex-[1_0_0] max-sm:flex-col max-sm:gap-3 max-sm:items-start">
                <div className="text-base leading-6 text-zinc-500">
                  관리자 등록을 먼저 진행해주세요
                </div>
                <button
                  onClick={handleBarcodeDownload}
                  className="flex gap-1 items-center px-2 py-1 rounded bg-zinc-400 hover:bg-zinc-500 transition-colors"
                >
                  <DownloadIcon />
                  <div className="text-xs leading-4 text-white">
                    저장
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 justify-center items-end self-stretch">
            <Button
              onClick={handleAdminRegistrationSave}
              className="flex gap-1 justify-center items-center px-2.5 py-1 bg-sky-500 rounded-lg cursor-pointer h-[52px] w-[200px] max-sm:w-full text-base font-bold leading-6 text-white hover:bg-sky-600"
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
