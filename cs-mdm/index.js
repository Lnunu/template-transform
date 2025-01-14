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
  const sourceExcelData = getExcelData("./cs-mdm/source/客商数据.xlsx", {
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
    "./cs-mdm/target/客商模板.xlsx",
    "./cs-mdm/output/output_客商.xlsx",
    mainTableJsonDataArray
  );
  console.log("主表写入完成");
  // 组织子表
  const orgSubJsonData = generateOrgSubTableJsonData(
    removalDuplicateMapAndCode
  );
  // 组织子表写入
  writeExcelByTemplate(
    "./cs-mdm/target/所属组织信息模板.xlsx",
    "./cs-mdm/output/output_组织.xlsx",
    orgSubJsonData
  );
  console.log("子表写入完成");
  console.log("done!");
}

main();
