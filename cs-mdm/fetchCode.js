import { requestMdm } from "../utils/index.js";

export function fetchQueryByTaxpayerId(taxpayerId) {
  const url = `/mapi/cs/duplicate_check`;
  return requestMdm(url, {
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

  for await (const taxpayerId of uniqueMap.keys()) {
    if (index % size === 0) {
      await Promise.all(stack);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      stack = [];
    }

    stack.push(
      new Promise((resolve) => {
        console.log(`正在获取${taxpayerId}的客商编码`);
        _uniqueMap.set(
          taxpayerId,
          uniqueMap.get(taxpayerId).map((i) => {
            i[field] = taxpayerId;
            return i;
          })
        );
        resolve();
        return;
        fetchQueryByTaxpayerId(taxpayerId)
          .then((res) => {
            if (res.data.code == 200) {
              _uniqueMap.set(taxpayerId, {
                code: res.data.data.cs_code,
                repeatData: uniqueMap.get(taxpayerId),
              });
            } else {
              _uniqueMap.set(taxpayerId, {
                code: "-1",
                repeatData: uniqueMap.get(taxpayerId),
              });
              console.log(`${taxpayerId}获取失败`);
            }
            resolve();
          })
          .catch(() => {
            _uniqueMap.set(taxpayerId, {
              code: "-1",
              repeatData: uniqueMap.get(taxpayerId),
            });
            console.log(`${taxpayerId}获取失败`);
            resolve();
          });
      })
    );

    index++;
  }
  return _uniqueMap;
}
