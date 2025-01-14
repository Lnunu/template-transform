import xlsx from "xlsx";
import path from "path";

function resolvePath(filePath) {
  return path.join(process.cwd(), filePath);
}

/**
 * 获取Excel表格数据
 * @param {string} filePath
 * @param {xlsx.Sheet2JSONOpts & {sheetIndex:number}} options
 * @returns {Array<Record<any,any>>}
 */
export function getExcelData(filePath, options) {
  const sheetIndex = options?.sheetIndex ?? 0;
  const workbook = xlsx.readFile(resolvePath(filePath));
  const sheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
  return xlsx.utils.sheet_to_json(sheet, options);
}

/**
 * 根据模板写入Excel数据
 * @param {string} templateFilePath 模板文件路径
 * @param {string} outputFilePath   输出文件路径
 * @param {Array<Record<any,any>>} jsonDataArray   json数据数组
 * @param {Object} options 配置对象
 * @param {number} options.headerCodeRow  表头行号
 * @param {number} options.bodyStartRow  表体行号
 */
export function writeExcelByTemplate(
  templateFilePath,
  outputFilePath,
  jsonDataArray,
  options
) {
  const headerCodeRow = options?.headerCodeRow ?? 1;
  const bodyStartRow = options?.bodyStartRow ?? 2;
  const workbook = xlsx.readFile(resolvePath(templateFilePath));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const headerData = xlsx.utils.sheet_to_json(sheet, {
    range: 0,
    header: 1,
    defval: null,
  });
  const headerSet = new Set(headerData[headerCodeRow]);

  // 排除掉不在模板中的字段
  jsonDataArray.forEach((rowData) => {
    for (const key in rowData) {
      if (!headerSet.has(key)) {
        delete rowData[key];
      }
    }
  });
  const headerArray = [...headerSet.values()];
  xlsx.utils.sheet_add_json(sheet, jsonDataArray, {
    header: headerArray,
    skipHeader: true,
    origin: bodyStartRow,
  });
  xlsx.writeFile(workbook, resolvePath(outputFilePath));
}

export function writeExcel(filePath, data) {
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  xlsx.writeFile(wb, resolvePath(filePath));
}
