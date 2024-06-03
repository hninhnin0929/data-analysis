import * as filterFunctions from "./filter";
import * as excelParse from "./excel-parser";


const excelData = excelParse.loadAndParseExcel(); // parse excel data for all .xls
// console.log("Excel data:", excelData);


const parseDataArr = Object.values(excelData).reduce((acc: any[], val: any) => acc.concat(val), []);

// *********** clean data ************
const cleanData = filterFunctions.cleanData(parseDataArr);
// console.log("cleanData data:", cleanData);
// exportToExcel(cleanData, "cleanData.xls")

// *********** filter by Pattern ************
const patterns = ['홈페이지', '정보', '시스템'];
const filterByPatternDatas = filterFunctions.filterByPattern(cleanData, '용역명', patterns);
excelParse.exportToExcel(filterByPatternDatas, "filterByPatternDatas.xlsx");

// *********** filter by KeywordScore, same as pattern filtering ************
const keywords = [
  { keyword: '홈페이지', score: 60 },
  { keyword: '정보', score: 30 },
  { keyword: '시스템', score: 50 }
];

const minScore = 50;

const filterByKeywordScoreDatas = filterFunctions.filterByKeywordScore(cleanData, '용역명', keywords, minScore);
excelParse.exportToExcel(filterByKeywordScoreDatas, "filterByKeywordScoreDatas.xlsx");


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