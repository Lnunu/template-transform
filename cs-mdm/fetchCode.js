import { requestMdmMagic } from "../utils/index.js";

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
      taxpayerId,
      uniqueMap.get(taxpayerId).map((i) => {
        i[field] = code;
        return i;
      })
    );
  }

  for await (const taxpayerId of uniqueMap.keys()) {
    stack.push(
      new Promise(async (resolve) => {
        try {
          console.log(`正在获取${taxpayerId}的客商编码`);
          // _setUniqueMap(taxpayerId, taxpayerId);
          // resolve();
          // return;
          const res = await fetchQueryByTaxpayerId(taxpayerId);
          if (res?.data?.code == 200) {
            _setUniqueMap(taxpayerId, res.data.data.code);
          } else {
            throw res.data;
          }
        } catch (error) {
          const errorMessage = `${taxpayerId}获取失败:${JSON.stringify(error)}`;
          _setUniqueMap(taxpayerId, errorMessage);
          console.log(errorMessage);
        }
        resolve();
      })
    );

    if (index % size === 0 || index === uniqueMap.size) {
      await Promise.all(stack);
      stack = [];
    }

    index++;
  }
  return _uniqueMap;
}
