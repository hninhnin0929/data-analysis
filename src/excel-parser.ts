import * as XLSX from "xlsx";
import * as path from "path";

function loadAndParseExcel(fileName: string) {
  const filePath = path.join(__dirname, "..", "files", fileName);
  console.log("filePath----------", filePath);
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error("Error loading and parsing Excel file:", error);
    return [];
  }
}

// Define your filtering logic function
function applyFilterLogic(data: any[]) {

  return data.filter((row) => {
    // console.log(row); 
    const value = row["__EMPTY_1"];
    if (typeof value === 'string') {
        return value.trim() === "신규1"; // Trim whitespace and fix case
    }
    return false; 
});
}

function exportToExcel(data: any[], exportFileName: string) {
  const exportFilePath = path.resolve(__dirname, "..", "files", exportFileName);
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Filtered Data");
  XLSX.writeFile(wb, exportFilePath);
  console.log(`Filtered data exported to ${exportFilePath}.`);
}

const excelData = loadAndParseExcel("발주계획_20240531092631.xls");
// console.log("Excel data:", excelData);

// Apply the filter logic to the Excel data
const newFilterDatas = applyFilterLogic(excelData);
console.log("Filtered data:", newFilterDatas);

// Export filtered data to Excel
exportToExcel(newFilterDatas, "filtered_data.xlsx");
