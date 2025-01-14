import { getExcelData, requestMdm, requestMdmMagic } from "../utils/index.js";
import fs from "fs";

function fetchMdmRevise(id) {
  return requestMdm({
    url: `/api/mdm/data-ops/cs/revise/${id}`,
    method: "post",
  });
}
function fetchMdmUpdate(id, data) {
  return requestMdm({
    url: `/api/mdm/data-ops/cs/update-release/${id}`,
    method: "put",
    data: data,
  });
}

function fetchMdmQueryByCsCode(csCode) {
  return requestMdm({
    url: "/api/mdm/data-ops/cs/query",
    method: "post",
    params: {
      withSysColumn: false,
    },
    data: {
      args: [
        {
          name: "M_DATA_STATE",
          matchValues: ["0"],
          matchType: "in",
        },
        {
          matchValue: csCode,
          name: "CS_CODE",
        },
      ],
      parseRef: {
        parseRefReferenceField: true,
        parseRefDictField: false,
      },
    },
  });
}

function fetchMdmMagicUpdate(data) {
  return requestMdmMagic({
    url: "/mapi/cs/save",
    method: "post",
    data: data,
  });
}

async function main() {
  const dataArray = getExcelData("/cs-mdm-sub/source/组织.xlsx", {
    range: 1,
  });

  const csCodeMap = new Map();
  dataArray.forEach((subData) => {
    const _code = subData["cs__CS_CODE"] + "";
    if (!csCodeMap.has(_code)) {
      csCodeMap.set(_code, [subData]);
    } else {
      csCodeMap.get(_code).push(subData);
    }
  });

  const errorFile = fs.createWriteStream("./cs-mdm-sub/output/error.txt");
  const searchFile = fs.createWriteStream("./cs-mdm-sub/output/search.txt");

  let size = csCodeMap.size;
  console.log(`共${size}条数据`);

  for await (const [code, subData] of csCodeMap.entries()) {
    try {
      const res = await fetchMdmQueryByCsCode(code);
      const queryData = res.data.content[0];
      searchFile.write(`${code}:\n`);
      searchFile.write(`\t查询到的数据:${JSON.stringify(queryData)}\n`);
      queryData.ORG_INFO = subData;
      queryData.isCheckSubDataSource = false;
      searchFile.write(`\t推送的数据:${JSON.stringify(queryData)}\n`);
      const updateRes = await fetchMdmMagicUpdate(queryData);
      size--;
      console.log(`code:${code},message:${updateRes.data.message},剩余${size}条数据`);
      searchFile.write(`------------------------------------------------------\n`)
    } catch (error) {
      errorFile.write(`${code}:${error.message}\n`);
      console.log(error);
    }
  }
  errorFile.end();
  searchFile.end();
}

main();
