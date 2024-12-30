import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

export function resolvePath(filePath) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, filePath);
}
export function getExcelBodyJsonArray(filePath, range) {
  const workbook = xlsx.readFile(resolvePath(filePath));
  const sheetNameList = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNameList[0]];
  return xlsx.utils.sheet_to_json(worksheet, {
    range: range,
    defval: null,
  });
}

export function getTargetHeaderAoa(filePath) {
  const workbook = xlsx.readFile(resolvePath(filePath));
  const sheetNameList = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNameList[0]];
  const headerData = xlsx.utils.sheet_to_json(worksheet, {
    range: 0,
    header: 1,
    defval: null,
  });
  return headerData.splice(0, 2);
}

export function generateExcel(filePath, data) {
  const ws = xlsx.utils.json_to_sheet(data, { skipHeader: true });
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  xlsx.writeFile(wb, resolvePath(filePath));
}

export function getExcelColDataAoa(filePath, startCol, endCol) {
  const workbook = xlsx.readFile(resolvePath(filePath));
  const sheetNameList = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNameList[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet, {
    range: 0,
    header: 1,
    defval: null,
  });
  return jsonData.map((row) => {
    return row.slice(startCol, endCol + 1);
  });
}
