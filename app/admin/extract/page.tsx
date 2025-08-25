import React from 'react'
import ExtractPageClient from './components/ExtractPageClient'

export default function ExtractPage() {
  return (
    <div className="relative bg-white mt-10 max-w-[1668px] w-full">
      {/* Title */}
      <div className="">
        <h1 className="text-3xl font-bold text-neutral-700 max-sm:text-2xl">비니봇 · 방문수거 관리</h1>
      </div>

      <ExtractPageClient />
    </div>
  )
}
