import { getExcelData } from "../utils/index.js";

async function main() {
  const dataList = getExcelData("./cs-mdm/source/统一数据源.xlsx", {
    defval: null,
    range: 1,
    sheetIndex: 8,
  });

  const uniqueMap = new Map();

  dataList.forEach((item) => {
    if (uniqueMap.has(item.TAXPAYER_ID)) {
      console.log("重复数据", item.TAXPAYER_ID);
      const data = uniqueMap.get(item.TAXPAYER_ID);
      const type = data.TYPE;
      if (type === item.TYPE) {
        console.log("重复类型数据", item.TAXPAYER_ID);
      }
    } else {
      uniqueMap.set(item.TAXPAYER_ID, item);
    }
  });
}

main();
