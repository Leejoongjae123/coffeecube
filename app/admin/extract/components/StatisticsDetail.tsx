"use client";

import React from 'react';

export default function StatisticsDetail() {
  return (
    <div className="w-full p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">통계 상세</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">총 수거량</h4>
            <p className="text-2xl font-bold text-blue-600">1,234 kg</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">로봇 수거량</h4>
            <p className="text-2xl font-bold text-green-600">856 kg</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-orange-900 mb-2">방문 수거량</h4>
            <p className="text-2xl font-bold text-orange-600">378 kg</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-semibold mb-3">상세 분석</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              이곳에서 더 자세한 통계 분석 내용을 표시할 수 있습니다.
              차트, 그래프, 추가적인 데이터 분석 결과 등을 포함할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
