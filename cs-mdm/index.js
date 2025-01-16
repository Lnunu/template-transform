import {
  getExcelData,
  writeExcelByTemplate,
  composeDataByMapConfig,
} from "../utils/index.js";
import { mainTableConfig } from "./config.js";
import {
  duplicateRemoval,
  getDuplicateRemovalData,
} from "./duplicate-removal.js";
import { getTaxpayerIdForJsonArray } from "./fetchCode.js";
import { generateOrgSubTableJsonData } from "./org.sub.js";

async function main() {
  const sourceExcelData = getExcelData(mainTableConfig.sourceFilePath, {
    defval: null,
    range: 1,
    sheetIndex: mainTableConfig.sheetIndex,
  });

  // test
  // const rangeRow = 10;
  // sourceExcelData.splice(rangeRow, sourceExcelData.length - rangeRow);
  // test

  const mainFileMap = mainTableConfig.fieldMap;

  let processedJsonDataArray = composeDataByMapConfig(
    sourceExcelData,
    mainFileMap,
    mainTableConfig.isTransform
  );

  // 得到去重过后的Map与重复数据
  const removalDuplicateMap = duplicateRemoval(
    processedJsonDataArray,
    "TAXPAYER_ID"
  );

  // 获取编码
  let removalDuplicateMapAndCode = removalDuplicateMap;

  if (mainTableConfig.isFetchCsCode) {
    removalDuplicateMapAndCode = await getTaxpayerIdForJsonArray(
      removalDuplicateMap,
      "CS_CODE"
    );
  }

  // 主表数据
  const mainTableJsonDataArray = getDuplicateRemovalData(
    removalDuplicateMapAndCode
  );
  // 主表写入
  writeExcelByTemplate(
    mainTableConfig.mainTableTargetFilePath,
    mainTableConfig.mainTableOutputFilePath,
    mainTableJsonDataArray
  );
  console.log("主表写入完成");
  // 组织子表
  const orgSubJsonData = generateOrgSubTableJsonData(
    removalDuplicateMapAndCode
  );
  // 组织子表写入
  writeExcelByTemplate(
    mainTableConfig.orgSubTableTargetFilePath,
    mainTableConfig.orgSubTableOutputFilePath,
    orgSubJsonData
  );
  console.log("子表写入完成");
  console.log("done!");
}

main();
