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
  const sourceExcelData = getExcelData("./source/客商数据.xlsx", {
    defval: null,
    range: 1,
  });

  // test
  // const rangeRow = 10;
  // sourceExcelData.splice(rangeRow, sourceExcelData.length - rangeRow);
  // test

  const mainFileMap = mainTableConfig.fieldMap;

  let processedJsonDataArray = composeDataByMapConfig(
    sourceExcelData,
    mainFileMap
  );

  // 得到去重过后的Map与重复数据
  const removalDuplicateMap = duplicateRemoval(
    processedJsonDataArray,
    "TAXPAYER_ID"
  );

  // 获取编码
  const removalDuplicateMapAndCode = await getTaxpayerIdForJsonArray(
    removalDuplicateMap,
    "CS_CODE"
  );

  // 主表去重后的数据
  const removeDuplicateJsonDataArray = getDuplicateRemovalData(
    removalDuplicateMapAndCode
  );
  // 主表写入
  writeExcelByTemplate(
    "./target/2024-12-27-客商模板下载.xlsx",
    "./output/output_客商.xlsx",
    removeDuplicateJsonDataArray
  );
  // 组织子表
  const orgSubJsonData = generateOrgSubTableJsonData(
    removalDuplicateMapAndCode
  );
  // 组织子表写入
  writeExcelByTemplate(
    "./target/2024-12-27-所属组织信息模板下载.xlsx",
    "./output/output_组织.xlsx",
    orgSubJsonData
  );
}

main();
