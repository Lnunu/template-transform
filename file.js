import xlsx from "xlsx";
export function getExcelBodyJsonArray(filePath, range) {
  const workbook = xlsx.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNameList[0]];
  return xlsx.utils.sheet_to_json(worksheet, {
    range: range,
    defval: null,
  });
}

export function getTargetHeaderAoa(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNameList[0]];
  const headerData = xlsx.utils.sheet_to_json(worksheet, {
    range: 0,
    header: 1,
    defval: null,
  });
  return headerData.splice(0, 2);
}

export function generateExcel(fileName, data) {
  const ws = xlsx.utils.json_to_sheet(data, { skipHeader: true });
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  xlsx.writeFile(wb, fileName);
}

export function getExcelColDataAoa(filePath, startCol, endCol) {
  const workbook = xlsx.readFile(filePath);
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
