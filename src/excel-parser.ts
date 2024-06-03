import * as XLSX from "xlsx";
import * as path from "path";
import * as glob from 'glob';
import * as filterFunctions from "./filter";

// Load data with file name
function loadAndParseExcel1(fileName: string) {
  const filePath = path.join(__dirname, "..", "files", fileName);
  console.log("filePath----------", filePath);
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // return XLSX.utils.sheet_to_json(worksheet);
    const columnNames = [
      "용역 발주계획목록",
      "업무",
      "유형",
      "발주기관",
      "발주시기",
      "조달방식",
      "계약방법",
      "용역명",
      "용역구분",
      "예산액(원)",
      "담당부서",
      "담당자",
      "연락처",
    ];
    return XLSX.utils.sheet_to_json(worksheet, { header: columnNames });
  } catch (error) {
    console.error("Error loading and parsing Excel file:", error);
    return [];
  }
}

// Load all files .xls in files dir
function loadAndParseExcel() {
  const directoryPath = path.join(__dirname, '..', 'files');
  console.log("directoryPath------------", directoryPath);
  const xlsFiles = glob.sync(path.join(directoryPath, '*.xls').replace(/\\/g,'/'));

  console.log('Found .xls files:', xlsFiles);

  try {
    const parsedData = xlsFiles.map(file => {
      console.log('Parsing file:', file);

      const workbook = XLSX.readFile(file);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const columnNames = [
        '용역 발주계획목록 번호',
        '업무',
        '유형',
        '발주기관',
        '발주시기',
        '조달방식',
        '계약방법',
        '용역명',
        '용역구분',
        '예산액(원)',
        '담당부서',
        '담당자',
        '연락처',
      ];

      // return { fileName: path.basename(file), data: XLSX.utils.sheet_to_json(worksheet, { header: columnNames }) };
      return XLSX.utils.sheet_to_json(worksheet, { header: columnNames });
    });

    return parsedData;
  } catch (error) {
    console.error('Error loading and parsing Excel files:', error);
    return [];
  }
}

function exportToExcel(data: any[], exportFileName: string) {
  const exportFilePath = path.resolve(__dirname, "..", "filtered-files", exportFileName);
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
  XLSX.writeFile(wb, exportFilePath);
  console.log(`Filtered data exported to ${exportFilePath}.`);
}

// General filter: testing
function applyFilterLogic(data: any[]) {
  return data.filter((row) => {
    // console.log(row);
    const value = row["유형"];
    if (typeof value === "string") {
      return value.trim() === "신규1"; // Trim whitespace and fix case
    }
    return false;
  });
}

// const excelData = loadAndParseExcel1("발주계획_20240531092631.xls"); // parse excel data

const excelData = loadAndParseExcel(); // parse excel data for all .xls
// console.log("Excel data:", excelData);

// Apply the filter logic to the Excel data
// const newFilterDatas = applyFilterLogic(excelData);
// exportToExcel(newFilterDatas, "filtered_data.xlsx"); // Export filtered data to Excel

const parseDataArr = Object.values(excelData).reduce((acc: any[], val: any) => acc.concat(val), []);

// *********** clean data ************
const cleanData = filterFunctions.cleanData(parseDataArr);
// console.log("cleanData data:", cleanData);
// exportToExcel(cleanData, "cleanData.xls");

// *********** filter by Pattern ************
const patterns = ['해외', '정보', 'PMO'];
const filterByPatternDatas = filterFunctions.filterByPattern(cleanData, '용역명', patterns);
exportToExcel(filterByPatternDatas, "filterByPatternDatas.xlsx");

// ******************** filter by Date range ******************************************
// const startDate = new Date(2024, 4, 1); // May 1, 2024 (Month is zero-based)
// const endDate = new Date(2024, 4, 31); // May 31, 2024
// const filterByDateRangeDatas = filterFunctions.filterByDateRange(cleanData, startDate, endDate);
// exportToExcel(filterByDateRangeDatas, "filterByDateRangeDatas.xlsx");

// *********** filter by Category ************
// const filterByCategoryDatas = filterFunctions.filterByCategory(cleanData, '유형', '장기');// (excelData, column name, data value)
// exportToExcel(filterByCategoryDatas, "filterByCategoryDatas.xlsx");

// *********** filter by Threshold ************
// const filterByThresholdDatas = filterFunctions.filterByThreshold(cleanData, '예산액(원)', 500000000);
// exportToExcel(filterByThresholdDatas, "filterByThresholdDatas.xlsx");


// *********** filter by Frequency ************
// const filterByFrequencyDatas = filterFunctions.filterByFrequency(excelData, '유형', 50);
// exportToExcel(filterByFrequencyDatas, "filterByFrequencyDatas.xlsx");

// *********** filter by TopN ************
// const getTopNDatas = filterFunctions.getTopN(cleanData, '예산액(원)', 3);
// exportToExcel(getTopNDatas, "getTopNDatas.xlsx");


// *********** filter by multiCriteriaFilter ************
// const multiCriteriaFilterDatas = filterFunctions.multiCriteriaFilter(cleanData, [
//     { column: '계약방법', value: '일반경쟁' },
//     { column: '예산액(원)', value: 10131000000 }  
// ]);
// exportToExcel(multiCriteriaFilterDatas, "multiCriteriaFilterDatas.xlsx");


// *********** filter by Pattern ************
// const filterOutliersDatas = filterFunctions.filterOutliers(cleanData, '예산액(원)', 2);
// exportToExcel(filterOutliersDatas, "filterOutliersDatas.xlsx");


