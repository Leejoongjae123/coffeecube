"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex relative justify-center items-start bg-white h-screen w-full max-md:flex-col">
      {/* Left Section */}
      <div className="flex relative flex-col justify-between items-start px-20 pt-20 pb-36 h-full bg-slate-900 w-[65%] max-md:p-10 max-md:w-full max-md:h-[400px] max-sm:p-5">
        <Image alt="bg_login" src="https://cqihatirfrohbypgdefv.supabase.co/storage/v1/object/public/images/bg_login.webp" fill></Image>
        <div className="relative h-[51px] w-[219px] max-md:h-[35px] max-md:w-[150px] max-sm:h-7 max-sm:w-[120px]">
          <Image className="" src="https://cqihatirfrohbypgdefv.supabase.co/storage/v1/object/public/images/logo.svg" alt="logo" width={219} height={51}/>
        </div>
        
        <div className="flex relative flex-col gap-5 items-start self-stretch">
          <div className="relative self-stretch text-6xl font-bold text-right text-white leading-[84px] max-md:text-4xl max-md:text-center max-sm:text-3xl">
            더 많은 곳에서의
            <br />
            창조와 환경, 그 이상의 실천
          </div>
          <div className="relative self-stretch text-3xl leading-10 text-right text-white max-md:text-xl max-md:text-center max-sm:text-base">
            환경을 위한 제품을 만드는 회사와 개인을 응원합니다.
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex relative gap-2.5 justify-center items-center p-14 bg-primary h-full w-[35%] max-md:p-10 max-md:w-full max-md:h-auto max-sm:p-5">
        <div className="flex relative flex-col gap-11 items-start w-[400px] max-md:w-full max-md:max-w-[400px] max-sm:gap-8">
          <div className="flex relative gap-4 justify-center items-center self-stretch">
            <div className="relative text-3xl font-bold text-white max-md:text-3xl max-sm:text-2xl">
              관리자 로그인
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="flex relative flex-col gap-8 items-start self-stretch">
            <div className="flex relative flex-col gap-5 items-start self-stretch">
              <div className="flex relative flex-col gap-2.5 justify-center items-start self-stretch p-6 bg-primary rounded-xl border border-blue-300 border-solid max-sm:p-5">
                <input
                  type="email"
                  placeholder="아이디"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-primary border-none outline-none text-base font-semibold leading-6 text-white placeholder:text-gray-300 max-sm:text-sm"
                />
              </div>
              <div className="flex relative flex-col gap-2.5 justify-center items-start self-stretch p-6 bg-primary rounded-xl border border-blue-300 border-solid max-sm:p-5">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-primary border-none outline-none text-base font-semibold leading-6 text-white placeholder:text-gray-300 max-sm:text-sm"
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-red-200">{error}</p>}
            
            <div className="flex relative flex-col gap-8 items-center self-stretch">
              <button 
                type="submit"
                disabled={isLoading}
                className="flex relative flex-col gap-2.5 justify-center items-center self-stretch p-6 bg-white rounded-xl cursor-pointer hover:bg-gray-100 transition-colors max-sm:p-5"
              >
                <div className="relative text-xl font-black leading-7 text-center text-primary max-sm:text-lg">
                  {isLoading ? "로그인 중..." : "로그인"}
                </div>
              </button>
              <div className="relative self-stretch text-base leading-6 text-center text-white max-sm:text-sm">
                비밀번호 분실 시, 관리자에게 변경을 요청하세요.
                <br />
                관리자 이메일: info@coffeecube.co.kr
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
