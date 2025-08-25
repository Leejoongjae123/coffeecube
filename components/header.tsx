"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import Image from "next/image";

const menuItems = [
  { href: "/admin/dashboard", label: "대시보드" },
  { href: "/admin/users", label: "사용자 관리" },
  { href: "/admin/extract", label: "비니봇 · 방문수거 관리" },
  { href: "/admin/statistics", label: "통계" },
];

function HeaderContent() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/auth/login");
        router.refresh();
      } else {
        // 로그아웃 실패 시에도 로그인 페이지로 이동 (안전장치)
        router.push("/auth/login");
      }
    } catch {
      // 에러 발생 시에도 로그인 페이지로 이동
      router.push("/auth/login");
    }
  };

  return (
    <div
      className="flex flex-col justify-center py-3.5 font-semibold leading-tight bg-white shadow-[0px_3px_4px_rgba(0,0,0,0.12)] w-full"
      data-name="header"
    >
      <div className="flex flex-wrap gap-5 justify-between w-full px-10 max-md:px-5">
        <Link href="/admin/dashboard">
          <Image
            src="/logo2.svg"
            className="object-contain shrink-0 max-w-full "
            width={138}
            height={40}
            alt="Logo"
          />
        </Link>
        <div
          className="flex flex-wrap gap-10 items-center text-xl tracking-tight min-h-[52px] text-neutral-600"
          data-name="menu"
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`self-stretch my-auto cursor-pointer hover:text-sky-500 transition-colors ${
                pathname === item.href ? "text-sky-500" : ""
              }`}
              data-name="label"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div 
          onClick={handleLogout}
          className="flex gap-3 items-center px-5 py-3 my-auto text-lg tracking-tight text-white whitespace-nowrap rounded-lg border border-solid bg-neutral-400 border-neutral-400 cursor-pointer hover:bg-neutral-500 transition-colors"
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/a7cda39c9c86e607955f49ac0449986939e9f812?placeholderIfAbsent=true&apiKey=304aa4871c104446b0f8164e96d049f4"
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            alt="Logout icon"
          />
          <div className="self-stretch my-auto" data-name="label">
            로그아웃
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <React.Suspense fallback={<div className="w-full h-[68px] bg-white shadow-[0px_3px_4px_rgba(0,0,0,0.12)]" />}>
      <HeaderContent />
    </React.Suspense>
  );
}

export default Header;
