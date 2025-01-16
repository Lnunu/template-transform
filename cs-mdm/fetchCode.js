import { requestMdmMagic, writeExcel } from "../utils/index.js";
import { mainTableConfig } from "./config.js";

export function fetchQueryByTaxpayerId(taxpayerId) {
  const url = `/mapi/cs/duplicate_check`;
  return requestMdmMagic(url, {
    method: "get",
    params: {
      uniqueValue: taxpayerId,
    },
  });
}

export async function getTaxpayerIdForJsonArray(uniqueMap, field) {
  let size = 10;
  let stack = [];
  let index = 1;
  const _uniqueMap = new Map();

  function _setUniqueMap(taxpayerId, code) {
    _uniqueMap.set(
      code,
      uniqueMap.get(taxpayerId).map((i) => {
        i[field] = code;
        return i;
      })
    );
  }
  const csCodeRecordData = [];

  function _record(data) {
    csCodeRecordData.push({
      社会信用代码: data?.data?.taxpayerId,
      数据客商名称: data?.data?.dataCsName,
      集团客商名称: data?.data?.queryCsName,
      INFO: JSON.stringify(data),
    });
  }

  function _error(message, data) {
    return {
      message,
      data,
    };
  }

  function _validateIsSameForTaxpayerId(dataList) {
    const _field = mainTableConfig.fieldMap.CS_NAME.field;
    const isSame = dataList.every((i) => i[_field] == dataList[0][_field]);
    if (!isSame) {
      throw _error(`数据客商名称不一致`, {
        repeat: dataList.map((i) => i[_field]).join(","),
      });
    }
  }

  const dataSize = uniqueMap.size;
  console.log(`开始获取${dataSize}个客商编码`);
  for await (const taxpayerId of uniqueMap.keys()) {
    stack.push(
      new Promise(async (resolve) => {
        try {
          const taxpayerIdDataList = uniqueMap.get(taxpayerId);
          // 客商名称是否相等
          _validateIsSameForTaxpayerId(taxpayerIdDataList);
          const codeData = uniqueMap.get(taxpayerId).find((i) => i[field]);
          if (codeData) {
            console.log(`存在${taxpayerId}的客商编码:${codeData[field]}`);
            _setUniqueMap(taxpayerId, codeData[field]);
          } else {
            console.log(`正在获取${taxpayerId}的客商编码`);
            const res = await fetchQueryByTaxpayerId(taxpayerId);
            // 最后一项数据的公司名称
            const dataCsName =
              taxpayerIdDataList[taxpayerIdDataList.length - 1][
                mainTableConfig.fieldMap.CS_NAME.field
              ];
            if (res?.data?.code == 200) {
              const queryCsName = res.data.data.name_chs;
              if (dataCsName == queryCsName) {
                _setUniqueMap(taxpayerId, res.data.data.code);
              } else {
                throw _error(
                  `浪潮客商名称：${queryCsName}；数据客商名称：${dataCsName}`,
                  {
                    taxpayerId,
                    queryCsName,
                    dataCsName,
                  }
                );
              }
            } else {
              throw _error("接口错误", {
                taxpayerId,
                dataCsName,
                response: res.data,
              });
            }
          }
        } catch (error) {
          let errorMessage;
          if (error.type) {
            errorMessage = `${taxpayerId}:${error.type}-${JSON.stringify(
              error.data
            )}`;
          } else {
            errorMessage = error.message;
          }
          // 不将错误信息写入数据表
          // _setUniqueMap(taxpayerId, errorMessage);
          _record(error);
          console.log(errorMessage);
        }
        resolve();
      })
    );

    if (index % size === 0 || index === uniqueMap.size) {
      await Promise.all(stack);
      stack = [];
    }
    console.log(`${index}/${dataSize}`);
    index++;
  }

  writeExcel("./cs-mdm/output/record.xlsx", csCodeRecordData);
  return _uniqueMap;
}
