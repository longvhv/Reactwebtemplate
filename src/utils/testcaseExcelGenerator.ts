/**
 * Testcase Excel Generator - Hierarchical Format with ExcelJS
 * 
 * Generate XLSX files for testcases with Vietnamese format
 * Sheet 1: Tổng hợp kết quả (Summary by Category with formulas)
 * Sheet 2: Testcase (Detailed test cases with 3-level hierarchy)
 * 
 * Using ExcelJS for full styling support
 */

import ExcelJS from 'exceljs';
import { Testcase } from '../data/testcases';

interface GroupedTestcases {
  level1: string;
  level2Groups: {
    level2: string;
    testcases: Testcase[];
  }[];
}

/**
 * Generate and download Excel file for testcases
 */
export async function generateTestcasesExcel(testcases: Testcase[], filename?: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  // Create both sheets
  await createTestcaseSheet(workbook, testcases);
  await createSummarySheet(workbook, testcases);

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Download file
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `Testcase_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Group testcases by level1 and level2
 */
function groupTestcases(testcases: Testcase[]): GroupedTestcases[] {
  const grouped = new Map<string, Map<string, Testcase[]>>();

  testcases.forEach(tc => {
    const level1 = tc.level1Group || 'Khác';
    const level2 = tc.level2Group || 'Khác';

    if (!grouped.has(level1)) {
      grouped.set(level1, new Map());
    }

    const level2Map = grouped.get(level1)!;
    if (!level2Map.has(level2)) {
      level2Map.set(level2, []);
    }

    level2Map.get(level2)!.push(tc);
  });

  const result: GroupedTestcases[] = [];
  grouped.forEach((level2Map, level1) => {
    const level2Groups: { level2: string; testcases: Testcase[] }[] = [];
    level2Map.forEach((tcs, level2) => {
      level2Groups.push({ level2, testcases: tcs });
    });
    result.push({ level1, level2Groups });
  });

  return result;
}

/**
 * Sheet 1: Tổng hợp kết quả
 */
async function createSummarySheet(workbook: ExcelJS.Workbook, testcases: Testcase[]): Promise<void> {
  const sheet = workbook.addWorksheet('Tổng hợp kết quả');

  // Title row
  sheet.mergeCells('A1:J1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'TỔNG HỢP KẾT QUẢ TESTCASE';
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFF0000' }
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };
  sheet.getRow(1).height = 25;

  // Header row
  const headers = [
    'STT',
    'Tên màn hình/chức năng',
    'Số trường hợp kiểm thử đạt (P)',
    'Số trường hợp kiểm thử không đạt (F)',
    'Số trường hợp kiểm thử đang xem xét (PE)',
    'Số trường hợp kiểm thử chưa thực hiện',
    'Tổng số trường hợp kiểm thử',
    'Tỉ lệ trường hợp kiểm thử đạt (%P)',
    'Tỉ lệ trường hợp kiểm thử không đạt (%F)',
    'Tỉ lệ trường hợp kiểm thử đã thực hiện (%Cover)'
  ];
  
  sheet.getRow(2).values = headers;
  sheet.getRow(2).height = 40;
  sheet.getRow(2).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00FFFF' } // Cyan
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Single data row for all testcases grouped as "Testcase"
  const rowNum = 3;
  const row = sheet.getRow(rowNum);

  const passedCount = testcases.filter(tc => tc.status === 'passed').length;
  const failedCount = testcases.filter(tc => tc.status === 'failed').length;
  const pendingCount = testcases.filter(tc => tc.status === 'pending').length;
  const skippedCount = testcases.filter(tc => tc.status === 'skipped').length;
  const totalCount = testcases.length;
  
  row.values = [
    1,
    'Testcase',
    passedCount,
    failedCount,
    pendingCount,
    skippedCount,
    totalCount,
    totalCount > 0 ? `${Math.round((passedCount / totalCount) * 100)}%` : '0%',
    totalCount > 0 ? `${Math.round((failedCount / totalCount) * 100)}%` : '0%',
    totalCount > 0 ? `${Math.round(((passedCount + failedCount) / totalCount) * 100)}%` : '0%'
  ];

  row.height = 18;
  row.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8F5E9' } // Light green
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Total row (same as data row since we only have one group)
  const totalRow = 4;
  const totalRowObj = sheet.getRow(totalRow);
  
  totalRowObj.values = row.values;
  totalRowObj.getCell(1).value = 'Total';
  totalRowObj.getCell(2).value = '';

  totalRowObj.height = 20;
  totalRowObj.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC8E6C9' } // Darker green
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    };
  });

  // Set column widths
  sheet.columns = [
    { width: 8 },
    { width: 25 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 }
  ];
}

/**
 * Sheet 2: Testcase with hierarchical structure
 */
async function createTestcaseSheet(workbook: ExcelJS.Workbook, testcases: Testcase[]): Promise<void> {
  const sheet = workbook.addWorksheet('Testcase');

  // Statistics section
  sheet.mergeCells('C1:L1');
  const titleCell = sheet.getCell('C1');
  titleCell.value = 'KỊCH BẢN KIỂM THỬ *';
  titleCell.font = { bold: true, size: 12 };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF99' }
  };
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  titleCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // Stats rows
  const passedCount = testcases.filter(tc => tc.status === 'passed').length;
  const failedCount = testcases.filter(tc => tc.status === 'failed').length;
  const pendingCount = testcases.filter(tc => tc.status === 'pending').length;
  const skippedCount = testcases.filter(tc => tc.status === 'skipped').length;
  const totalCount = testcases.length;

  const statsRows = [
    ['', '', 'Tên màn hình/Tên chức năng', 'Testcase'],
    ['', '', 'Mã trường hợp kiểm thử', 'TEST'],
    ['', '', 'Số trường hợp kiểm thử đạt (P)', passedCount],
    ['', '', 'Số trường hợp kiểm thử không đạt (F)', failedCount],
    ['', '', 'Số trường hợp kiểm thử đang xem xét (PE)', pendingCount],
    ['', '', 'Số trường hợp kiểm thử chưa thực hiện', skippedCount],
    ['', '', 'Tổng số trường hợp kiểm thử', totalCount]
  ];

  statsRows.forEach((rowData, index) => {
    const rowNum = index + 2;
    sheet.mergeCells(`D${rowNum}:L${rowNum}`);
    sheet.getRow(rowNum).values = rowData;
    
    sheet.getRow(rowNum).eachCell((cell, colNum) => {
      if (colNum >= 3) {
        cell.font = { bold: colNum === 3, size: 10 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFFCC' }
        };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    });
  });

  // Empty row
  sheet.getRow(9).values = [''];

  // Table headers
  const headerRow = sheet.getRow(10);
  headerRow.values = [
    'Mã trường hợp kiểm thử',
    'Mục đích kiểm thử',
    'Tiêu đề',
    'Các bước thực hiện',
    'Kết quả mong muốn',
    'Hình ảnh',
    'Chuẩn',
    '',
    'Kết quả',
    '',
    'Mã lỗi',
    'Ghi chú'
  ];
  
  sheet.mergeCells('G10:H10');
  sheet.mergeCells('I10:J10');
  
  headerRow.height = 35;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00FFFF' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Sub-header
  const subHeaderRow = sheet.getRow(11);
  subHeaderRow.values = [
    '', '', '', '', '',
    '',
    'Lần 1', 'Lần 2', 'Thực tế',
    '', '', ''
  ];
  
  subHeaderRow.height = 25;
  subHeaderRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Group testcases hierarchically
  const grouped = groupTestcases(testcases);
  let currentRow = 12;

  // Iterate through level 1 groups
  grouped.forEach((level1Group) => {
    // Level 1 header row (e.g., "Giao diện", "Chức năng", "An toàn thông tin")
    const level1Row = sheet.getRow(currentRow);
    sheet.mergeCells(`A${currentRow}:L${currentRow}`);
    level1Row.getCell(1).value = level1Group.level1.toUpperCase();
    level1Row.height = 25;
    level1Row.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' } // Yellow
      };
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'thin' },
        bottom: { style: 'medium' },
        right: { style: 'thin' }
      };
    });
    currentRow++;

    // Iterate through level 2 groups
    level1Group.level2Groups.forEach((level2Group) => {
      // Level 2 header row (e.g., "Đăng nhập", "Quản lý người dùng")
      const level2Row = sheet.getRow(currentRow);
      sheet.mergeCells(`A${currentRow}:L${currentRow}`);
      level2Row.getCell(1).value = level2Group.level2;
      level2Row.height = 20;
      level2Row.eachCell((cell) => {
        cell.font = { bold: true, italic: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE8F5E9' } // Light green
        };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      currentRow++;

      // Add testcases for this level 2 group
      level2Group.testcases.forEach((tc) => {
        const row = sheet.getRow(currentRow);
        
        // Format steps with line breaks
        const steps = tc.steps.map((step, idx) => `${idx + 1}. ${step}`).join('\n');
        
        let statusLan1 = '', statusLan2 = '', statusThucTe = '';
        if (tc.status === 'passed') {
          statusLan1 = statusLan2 = statusThucTe = 'P';
        } else if (tc.status === 'failed') {
          statusLan1 = statusLan2 = statusThucTe = 'F';
        } else if (tc.status === 'pending') {
          statusLan1 = statusLan2 = statusThucTe = 'PE';
        }

        row.values = [
          tc.id,
          tc.category,
          tc.title,
          steps,
          tc.expectedResult,
          '',
          statusLan1,
          statusLan2,
          statusThucTe,
          '',
          '',
          tc.actualResult || ''
        ];

        // Calculate row height based on content
        const stepCount = tc.steps.length;
        row.height = Math.max(60, stepCount * 15 + 10);

        row.eachCell((cell, colNum) => {
          // Determine background color
          let bgColor = 'FFFFFFFF'; // White default
          
          if (colNum >= 7 && colNum <= 9) {
            const value = cell.value;
            if (value === 'P') {
              bgColor = 'FFCCFFCC'; // Green
            } else if (value === 'F') {
              bgColor = 'FFFFCCCC'; // Red
            } else if (value === 'PE') {
              bgColor = 'FFFFFFCC'; // Yellow
            }
          }

          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgColor }
          };
          
          cell.alignment = {
            horizontal: (colNum >= 7 && colNum <= 9) ? 'center' : 'left',
            vertical: 'top',
            wrapText: true
          };
          
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF999999' } },
            left: { style: 'thin', color: { argb: 'FF999999' } },
            bottom: { style: 'thin', color: { argb: 'FF999999' } },
            right: { style: 'thin', color: { argb: 'FF999999' } }
          };
        });

        currentRow++;
      });
    });
  });

  // Set column widths
  sheet.columns = [
    { width: 18 },
    { width: 20 },
    { width: 35 },
    { width: 40 },
    { width: 40 },
    { width: 12 },
    { width: 8 },
    { width: 8 },
    { width: 10 },
    { width: 3 },
    { width: 12 },
    { width: 30 }
  ];
}

/**
 * Export testcases by category
 */
export async function generateTestcasesByCategory(testcases: Testcase[], category: string): Promise<void> {
  const filtered = testcases.filter(tc => tc.category === category);
  const filename = `Testcase_${category}_${new Date().toISOString().split('T')[0]}.xlsx`;
  await generateTestcasesExcel(filtered, filename);
}

/**
 * Export testcases by status
 */
export async function generateTestcasesByStatus(testcases: Testcase[], status: string): Promise<void> {
  const filtered = testcases.filter(tc => tc.status === status);
  const filename = `Testcase_${status}_${new Date().toISOString().split('T')[0]}.xlsx`;
  await generateTestcasesExcel(filtered, filename);
}
