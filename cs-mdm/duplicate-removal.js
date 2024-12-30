export function duplicateRemoval(jsonDataArray, uniqueField) {
  const uniqueMap = new Map();
  for (let rowIndex = 0; rowIndex < jsonDataArray.length; rowIndex++) {
    const rowData = jsonDataArray[rowIndex];
    let uniqueValue = rowData[uniqueField];
    if (
      uniqueValue === undefined ||
      uniqueValue === null ||
      uniqueValue.length !== 18
    ) {
      continue;
    }
    // 统一大写处理
    uniqueValue = uniqueValue.toUpperCase();

    if (!uniqueMap.has(uniqueValue)) {
      const repeatData = [];
      repeatData.push(rowData);
      uniqueMap.set(uniqueValue, repeatData);
    } else {
      uniqueMap.get(uniqueValue).push(rowData);
    }
  }
  return uniqueMap;
}

export function getDuplicateRemovalData(Map) {
  const jsonDataArray = [...Map.values()].map((repeatData) => {
    // 最后一个的重复数据代表最新的值
    return JSON.parse(JSON.stringify(repeatData[repeatData.length - 1]));
  });
  return jsonDataArray;
}
