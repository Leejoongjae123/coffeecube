import * as XLSX from "xlsx";
import {
  StatisticsData,
  StatisticsDetailRecord,
} from "@/app/admin/statistics/types";

interface ExportOptions {
  robotChecked: boolean;
  visitChecked: boolean;
  filename?: string;
}

/**
 * 통계 데이터를 엑셀 파일로 다운로드하는 함수
 */
export function exportStatisticsToExcel(
  data: StatisticsData[],
  options: ExportOptions
) {
  const { robotChecked, visitChecked, filename = "통계_데이터" } = options;

  if (!data || data.length === 0) {
    alert("다운로드할 데이터가 없습니다.");
    return;
  }

  // 헤더 구성
  const headers: string[] = ["날짜"];

  if (robotChecked) {
    headers.push("비니봇 수거량(g)");
  }

  if (visitChecked) {
    headers.push("방문 수거량(g)");
  }

  headers.push("합계(g)");

  // 데이터 행 구성
  const rows = data.map((row) => {
    const dataRow: (string | number)[] = [row.date];

    if (robotChecked) {
      dataRow.push(parseInt(row.robotCollection).toLocaleString());
    }

    if (visitChecked) {
      dataRow.push(parseInt(row.visitCollection).toLocaleString());
    }

    dataRow.push(row.total);

    return dataRow;
  });

  // 워크시트 데이터 생성 (헤더 + 데이터)
  const worksheetData = [headers, ...rows];

  // 워크시트 생성
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // 컬럼 너비 설정
  const columnWidths = headers.map((_, index) => {
    if (index === 0) {
      return { wch: 15 }; // 날짜 컬럼
    }
    return { wch: 20 }; // 나머지 컬럼
  });

  worksheet["!cols"] = columnWidths;

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "통계데이터");

  // 현재 날짜를 파일명에 포함
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split("T")[0];
  const finalFilename = `${filename}_${dateString}.xlsx`;

  // 파일 다운로드
  XLSX.writeFile(workbook, finalFilename);
}

/**
 * 통계 상세 데이터를 엑셀 파일로 다운로드하는 함수
 */
export function exportStatisticsDetailToExcel(
  data: StatisticsDetailRecord[],
  options: {
    robotChecked: boolean;
    visitChecked: boolean;
    filename?: string;
  }
) {
  const { robotChecked, visitChecked, filename = "통계_상세_데이터" } = options;

  if (!data || data.length === 0) {
    alert("다운로드할 데이터가 없습니다.");
    return;
  }

  // 필터링된 데이터
  let filteredData = [...data];

  // 수거 방식에 따른 필터링
  if (robotChecked && visitChecked) {
    // 둘 다 선택된 경우 모든 데이터
  } else if (robotChecked) {
    filteredData = data.filter((item) => item.collectionMethod === "비니봇");
  } else if (visitChecked) {
    filteredData = data.filter((item) => item.collectionMethod === "방문수거");
  } else {
    // 둘 다 선택되지 않은 경우 빈 데이터
    filteredData = [];
  }

  if (filteredData.length === 0) {
    alert("선택된 조건에 해당하는 데이터가 없습니다.");
    return;
  }

  // 헤더 구성
  const headers = [
    "날짜",
    "아이디",
    "주소",
    "비니봇 코드",
    "수거량",
    "수거 방식",
  ];

  // 데이터 행 구성
  const rows = filteredData.map((row) => [
    row.date,
    row.userId,
    row.address,
    row.robotCode,
    row.collectionAmount,
    row.collectionMethod,
  ]);

  // 워크시트 데이터 생성 (헤더 + 데이터)
  const worksheetData = [headers, ...rows];

  // 워크시트 생성
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // 컬럼 너비 설정
  const columnWidths = [
    { wch: 12 }, // 날짜
    { wch: 15 }, // 아이디
    { wch: 30 }, // 주소
    { wch: 15 }, // 비니봇 코드
    { wch: 12 }, // 수거량
    { wch: 12 }, // 수거 방식
  ];

  worksheet["!cols"] = columnWidths;

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "통계상세데이터");

  // 현재 날짜를 파일명에 포함
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split("T")[0];
  const finalFilename = `${filename}_${dateString}.xlsx`;

  // 파일 다운로드
  XLSX.writeFile(workbook, finalFilename);
}
