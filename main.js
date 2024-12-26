import path from "path";
import {
  composeBodyDataArray,
  composeHeaderDataArray,
  composeSubTableBodyDataArray,
} from "./data.js";
import {
  getExcelBodyJsonArray,
  getTargetHeaderAoa,
  generateExcel,
  getExcelColDataAoa,
} from "./file.js";
import { getEnvTableConfig, systemConfig } from "./config.js";

async function main() {
  const { mainTableConfig, subTablesConfig } = await getEnvTableConfig();

  const headerArray = getTargetHeaderAoa(mainTableConfig.templateFilePath);
  const headerDataArray = composeHeaderDataArray(headerArray);
  console.log("主表头数据处理完毕");

  let sourceBodyDataArray = getExcelBodyJsonArray(
    mainTableConfig.sourceFilePath,
    mainTableConfig.bodyStart - 1
  );
  console.log("主表体数据处理完毕");
  console.log(`主表体数据从第 ${mainTableConfig.bodyStart} 行开始`);

  let subTableDataCol = getExcelColDataAoa(
    mainTableConfig.sourceFilePath,
    mainTableConfig.subTablesInfoCol,
    mainTableConfig.subTablesInfoCol
  );
  console.log(`主表子表信息列：${mainTableConfig.subTablesInfoCol}`);
  // 移除表头
  subTableDataCol.splice(0, mainTableConfig.headerRow);
  // 移除第一行无效数据
  sourceBodyDataArray.shift();

  // test start
  if (systemConfig.length) {
    sourceBodyDataArray.splice(
      systemConfig.length,
      sourceBodyDataArray.length - systemConfig.length
    );
  }
  // test end

  console.log(`对 ${sourceBodyDataArray.length} 条数据进行处理`);

  const bodyDataArray = composeBodyDataArray(
    sourceBodyDataArray,
    mainTableConfig.mainTableFieldMap
  );
  console.log("主表体数据处理完毕");

  const tableDataJsonArray = [...headerDataArray, ...bodyDataArray];
  generateExcel(mainTableConfig.outputFilePath, tableDataJsonArray);

  console.log(
    `主表生成完毕\t${path.join(process.cwd(), mainTableConfig.outputFilePath)}`
  );

  subTablesConfig.forEach((config) => {
    generateSubTable(config);
    console.log(
      `子表生成完毕\t${path.join(process.cwd(), config.outputFilePath)}`
    );
  });
  function generateSubTable(config) {
    const subTableHeaderArray = getTargetHeaderAoa(config.templateFilePath);
    const subTableHeaderDataArray = composeHeaderDataArray(subTableHeaderArray);

    const subTableBodyArray = composeSubTableBodyDataArray(
      sourceBodyDataArray,
      config.subTableFieldMap,
      subTableDataCol
    );
    const subTableData = [...subTableHeaderDataArray, ...subTableBodyArray];
    generateExcel(config.outputFilePath, subTableData);
  }
}

main();
