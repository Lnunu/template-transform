import { getExcelData } from "../utils/index.js";

/**
 * node执行验证重复
 */
function main() {
  const repeat = getExcelData("./validate/validate-repeat.xlsx", {
    defval: null,
    sheetIndex: 0,
    header: 1,
  });
  const source = getExcelData("./validate/validate-repeat.xlsx", {
    defval: null,
    sheetIndex: 1,
    header: 1,
  });
  const repeatMap = new Map();
  console.log(source.length);
  console.log(repeat.length);

  repeat.forEach((item) => {
    repeatMap.set(item[0], item[0]);
  });

  source.forEach((item) => {
    if (!repeatMap.has(item[0])) {
      console.log(item[0]);
    }
  });
}

main();
