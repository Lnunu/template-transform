import { getExcelData, writeExcel } from "../utils/index.js";
import { requestMdmMagic } from "../utils/index.js";
import { mainTableConfig } from "./config.js";

function fetchMdmMagicUpdate(data) {
  return requestMdmMagic({
    url: "/mapi/cs/save",
    method: "post",
    data: data,
  });
}
async function main() {
  const mainExcelData = getExcelData(mainTableConfig.mainTableOutputFilePath, {
    defval: null,
    range: 1,
    sheetIndex: 0,
  });

  const orgSubExcelData = getExcelData(
    mainTableConfig.orgSubTableOutputFilePath,
    {
      defval: null,
      range: 1,
      sheetIndex: 0,
    }
  );

  const orgSubExcelDataMap = new Map();
  orgSubExcelData.forEach((item) => {
    if (orgSubExcelDataMap.has(item.cs__CS_CODE)) {
      orgSubExcelDataMap.get(item.cs__CS_CODE).push(item);
    } else {
      orgSubExcelDataMap.set(item.cs__CS_CODE, [item]);
    }
  });

  const errorDataList = [];

  console.log(`共${mainExcelData.length}条数据`);

  for (let i = 0; i < mainExcelData.length; i++) {
    try {
      console.log(`正在处理：${i + 1}/${mainExcelData.length}`);
      const mainData = mainExcelData[i];
      mainData.ORG_INFO = orgSubExcelDataMap.get(mainData.CS_CODE);
      const res = await fetchMdmMagicUpdate(mainData);
      console.log("更新结果：", res.data?.message);
      if (res?.data?.code != 200) {
        throw {
          message: res,
        };
      }
    } catch (error) {
      errorDataList.push({
        index: i + 1,
        error: JSON.stringify(error.message),
        data: mainExcelData[i],
      });
    }
  }

  console.log("更新完成");
  writeExcel("./cs-mdm/output/update_record.xlsx", errorDataList);
}

main();
