import React from "react";
import StatisticsPageClient from "./components/StatisticsPageClient";

export default function StatisticsPage() {
  return (
    <div className="relative bg-white mt-10 max-w-[1668px] w-full">
      {/* Title */}
      <div className="">
        <h1 className="text-3xl font-bold text-neutral-700 max-sm:text-2xl">
          통계
        </h1>
      </div>

      <StatisticsPageClient />
    </div>
  );
}
