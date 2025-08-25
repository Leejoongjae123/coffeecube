"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { ChevronDown, Search, RotateCcw, FileSpreadsheet } from "lucide-react";

interface StatisticsDetailData {
  date: string;
  userId: string;
  memberCode: string;
  address: string;
  robotCode: string;
  collectionAmount: string;
  collectionMethod: string;
}

export default function StatisticsDetail() {
  const [timeFilter, setTimeFilter] = useState('오늘');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2025-08-08'));
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [region1, setRegion1] = useState('전체');
  const [region2, setRegion2] = useState('군');
  const [region3, setRegion3] = useState('구');
  const [robotChecked, setRobotChecked] = useState(true);
  const [visitChecked, setVisitChecked] = useState(false);
  const [sortOrder, setSortOrder] = useState('내림차순');
  const [sortBy, setSortBy] = useState('상태');

  const mockData: StatisticsDetailData[] = [
    {
      date: '2025-08-21',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-20',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-19',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-18',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-17',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-16',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방���수거'
    },
    {
      date: '2025-08-16',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-15',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-14',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-13',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    },
    {
      date: '2025-08-12',
      userId: 'user_001',
      memberCode: 'qoeidpolosiu',
      address: '시흥시 대야동 abc 센터',
      robotCode: 'asdfghjkl001',
      collectionAmount: 'nn',
      collectionMethod: '방문수거'
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-[1668px]">
      {/* Search Filter Section */}
      <div className="flex flex-col w-full">
        <div className="flex gap-4 p-8 w-full font-semibold rounded-2xl bg-stone-50 max-md:px-5 max-md:max-w-full">
          <div className="flex flex-1 gap-5 items-center">
            <div className="flex gap-3.5 items-center">
              <div className="flex gap-5 items-center">
                <div className="text-xl text-neutral-700">
                  검색조건
                </div>
                <div className="flex gap-3 items-center text-sm text-center whitespace-nowrap text-neutral-500">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-[30px] px-4 py-2.5 ${
                      timeFilter === '오늘' 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-gray-200 text-neutral-500 hover:bg-gray-300'
                    }`}
                    onClick={() => setTimeFilter('오늘')}
                  >
                    <span className="text-sm font-bold">오늘</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-[30px] px-4 py-2.5 ${
                      timeFilter === '7일' 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-gray-200 text-neutral-500 hover:bg-gray-300'
                    }`}
                    onClick={() => setTimeFilter('7일')}
                  >
                    <span className="text-sm font-bold">7일</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-[30px] px-4 py-2.5 ${
                      timeFilter === '30일' 
                        ? 'bg-primary text-white hover:bg-primary/90' 
                        : 'bg-gray-200 text-neutral-500 hover:bg-gray-300'
                    }`}
                    onClick={() => setTimeFilter('30일')}
                  >
                    <span className="text-sm font-bold">30일</span>
                  </Button>
                </div>
              </div>
              <div className="flex gap-3.5 items-center">
                <div className="text-base text-primary">
                  직접 입력
                </div>
                <div className="flex gap-2.5 items-center text-xs rounded-md text-neutral-500">
                  <DatePicker
                    selected={startDate}
                    onSelect={setStartDate}
                    placeholder="2025-08-08"
                    className="w-[140px]"
                  />
                  <div className="text-center">
                    -
                  </div>
                  <DatePicker
                    selected={endDate}
                    onSelect={setEndDate}
                    placeholder="날짜 입력"
                    className="w-[140px]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-5 items-center text-xs font-bold text-primary whitespace-nowrap">
              <div className="text-xl font-semibold text-neutral-700">
                지역
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-6 justify-between items-center p-3 bg-white rounded-md border-gray-200 w-20">
                    <span className="text-xs font-bold text-primary">{region1}</span>
                    <ChevronDown className="h-2.5 w-2.5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setRegion1('전체')}>전체</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRegion1('시')}>시</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-9 justify-between items-center p-3 bg-white rounded-md border-gray-200 w-20">
                    <span className="text-xs font-bold text-primary">{region2}</span>
                    <ChevronDown className="h-2.5 w-2.5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setRegion2('군')}>군</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRegion2('구')}>구</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-9 justify-between items-center p-3 bg-white rounded-md border-gray-200 w-20">
                    <span className="text-xs font-bold text-primary">{region3}</span>
                    <ChevronDown className="h-2.5 w-2.5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setRegion3('구')}>구</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRegion3('동')}>동</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-5 items-center text-sm">
              <div className="text-xl text-neutral-700">
                수거 방식
              </div>
              <div className="flex gap-2 items-center font-bold leading-snug text-primary whitespace-nowrap">
                <Checkbox
                  checked={robotChecked}
                  onCheckedChange={(checked) => setRobotChecked(checked as boolean)}
                  className="w-4 h-4 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="flex gap-1 items-center">
                  <div className="flex items-center">
                    <div className="text-primary">
                      비니봇
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center leading-snug whitespace-nowrap text-neutral-400">
                <Checkbox
                  checked={visitChecked}
                  onCheckedChange={(checked) => setVisitChecked(checked as boolean)}
                  className="w-4 h-4"
                />
                <div className="flex gap-1 items-center">
                  <div className="flex items-center">
                    <div>
                      방문수거
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center text-base whitespace-nowrap">
            <Button className="flex gap-2.5 justify-center items-center py-3 bg-primary hover:bg-primary/90 text-white rounded-lg w-[120px]">
              <Search className="h-4 w-4" />
              <div>검색</div>
            </Button>
            <Button variant="outline" className="flex gap-2.5 justify-center items-center py-3 text-primary bg-white rounded-lg border-primary border-solid border-[1.3px] hover:bg-primary/5 w-[120px]">
              <RotateCcw className="h-4 w-4" />
              <div className="text-primary">초기화</div>
            </Button>
          </div>
        </div>
        

      </div>

      {/* Sort Controls and Export Button */}
      <div className="flex justify-between items-center w-full mt-4 mb-4">
        <div className="flex gap-5 items-center text-xs whitespace-nowrap text-neutral-500">
          <div className="font-bold">정렬기준</div>
          <div className="flex gap-2 items-center font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border-gray-200">
                  <span className="text-xs text-neutral-500">{sortOrder}</span>
                  <ChevronDown className="h-2.5 w-2.5 text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOrder('내림차순')}>내림차순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('오름차순')}>오름차순</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2.5 items-center px-4 py-2.5 bg-white rounded-md border-gray-200">
                  <span className="text-xs text-neutral-500">{sortBy}</span>
                  <ChevronDown className="h-2.5 w-2.5 text-neutral-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('상태')}>상태</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('날짜')}>날짜</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('수거량')}>수거량</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex gap-3 items-center px-3 py-2 text-sm font-bold text-green-600 rounded-lg border-2 border-green-600 border-solid hover:bg-green-50 cursor-pointer">
          <FileSpreadsheet className="h-6 w-6" />
          <div>엑셀 저장</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full text-xs font-medium text-center max-w-[1668px] text-stone-500 max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          {/* Table Header */}
          <div className="flex overflow-hidden flex-wrap gap-10 justify-between items-center w-full rounded bg-[#EEEEEE] max-md:max-w-full">
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto font-bold whitespace-nowrap text-neutral-600 w-[140px]">
              <div className="self-stretch my-auto">날짜</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">아이디</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">회원코드</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">주소</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">비니봇 코드</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">수거량</div>
            </div>
            <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto bg-[#EEEEEE] w-[140px]">
              <div className="self-stretch my-auto">수거 방식</div>
            </div>
          </div>

          {/* Table Rows */}
          {mockData.map((row, index) => (
            <div key={index} className="flex flex-wrap gap-10 justify-between items-center w-full rounded max-md:max-w-full">
              <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto font-semibold whitespace-nowrap bg-[#EEEEEE] w-[140px]">
                <div className="self-stretch my-auto">{row.date}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap w-[140px]">
                <div className="self-stretch my-auto">{row.userId}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap w-[140px]">
                <div className="self-stretch my-auto">{row.memberCode}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto w-[140px]">
                <div className="self-stretch my-auto">{row.address}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap w-[140px]">
                <div className="self-stretch my-auto">{row.robotCode}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap w-[140px]">
                <div className="self-stretch my-auto">{row.collectionAmount}</div>
              </div>
              <div className="flex gap-2.5 justify-center items-center self-stretch px-2.5 py-4 my-auto whitespace-nowrap w-[140px]">
                <div className="self-stretch my-auto">{row.collectionMethod}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
