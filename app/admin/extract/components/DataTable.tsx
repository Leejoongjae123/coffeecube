"use client";

import React from 'react';
import { StatisticsData } from '../types';

interface DataTableProps {
  data: StatisticsData[];
}

export default function DataTable({ data }: DataTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              날짜
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              로봇 수거량
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              방문 수거량
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              총합
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{row.date}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{row.robotCollection}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{row.visitCollection}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          표시할 데이터가 없습니다.
        </div>
      )}
    </div>
  );
}
