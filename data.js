export function composeHeaderDataArray(headerArray) {
  const indexMap = {};
  return headerArray
    .reverse()
    .map((colHeaders, rowIndex) => {
      const map = {};
      colHeaders.forEach((colHeader, colIndex) => {
        if (rowIndex === 0) {
          map[colHeader] = colHeader;
          indexMap[colIndex] = colHeader;
        } else {
          map[indexMap[colIndex]] = colHeader;
        }
      });
      return map;
    })
    .reverse();
}

export function composeBodyDataArray(bodyJsonArray, fieldMap) {
  return bodyJsonArray.map((bodyJson) => {
    return Object.keys(fieldMap).reduce((acc, key) => {
      acc[key] = transformHandler(bodyJson, fieldMap, key);
      return acc;
    }, {});
  });
}

// TODO 优化
export function composeSubTableBodyDataArray(
  jsonArray,
  fieldMap,
  subTableColArray
) {
  const result = [];

  for (let jsonIndex = 0; jsonIndex < jsonArray.length; jsonIndex++) {
    const json = jsonArray[jsonIndex];
    /**
     * subTableColArray
     * [
     *  ["A","B","C"]
     *  ["A","B","C"]
     * ]
     */
    if (!subTableColArray[jsonIndex][0]) continue;
    const subTableSum = subTableColArray[jsonIndex][0].split(",").length;
    let scanIndex = 0;
    while (scanIndex < subTableSum) {
      const data = {};
      for (const field in fieldMap) {
        const jsonKey = fieldMap[field];
        if (!jsonKey) {
          data[field.replace("_$", "")] = null;
          continue;
        }
        // _$结尾为自增字段
        const isAutoIncrementField = field.endsWith("_$");

        if (typeof jsonKey === "string") {
          const _key =
            scanIndex === 0 || !isAutoIncrementField
              ? jsonKey
              : `${jsonKey}_${scanIndex}`;
          data[field.replace("_$", "")] = json[_key];
        }
        if (typeof jsonKey === "object") {
          const _field = jsonKey.field;
          const transform = jsonKey.transform;
          const _key =
            scanIndex === 0 || !isAutoIncrementField
              ? _field
              : `${_field}_${scanIndex}`;
          data[field.replace("_$", "")] = transform(json[_key]);
        }
      }
      scanIndex++;
      result.push(data);
    }
  }
  return result;
}

export function transformHandler(bodyJson, fieldMap, key) {
  if (!fieldMap[key]) {
    return null;
  } else if (typeof fieldMap[key] === "string") {
    return bodyJson[fieldMap[key]];
  } else if (typeof fieldMap[key] === "object") {
    const field = fieldMap[key].field;
    const transform = fieldMap[key].transform;
    return transform(bodyJson[field]);
  }
}
