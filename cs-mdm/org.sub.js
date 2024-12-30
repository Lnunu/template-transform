/**
 *
 * @param {Map<string,Array<Record<any,any>>>} uniqueMap
 */
export function generateOrgSubTableJsonData(uniqueMap) {
  const orgSubTableJsonData = [];
  for (const [_, orgDataList] of uniqueMap.entries()) {
    const orgCodeMap = getOrgCodeMap(orgDataList);
    for (const [_, orgData] of orgCodeMap.entries()) {
      let belongType;
      try {
        belongType = csTypeHandler(orgData.type);
      } catch (error) {
        console.log("type字段转换错误");
        console.log(orgData);
        console.log(error);
      }
      const _orgData = {
        cs__CS_CODE: orgData.CS_CODE,
        BELONG_TYPE: belongType,
        ORG_CODE: orgData.ORG_CODE,
        DATA_SOURCE: orgData.DATA_SOURCE,
        SCOPE_TYPE: "1",
      };
      orgSubTableJsonData.push(_orgData);
    }
  }
  return orgSubTableJsonData;
}

/**
 * 组织去重，客商在一个组织下面只能有一条数据
 */
function getOrgCodeMap(orgDataList) {
  const orgCodeMap = new Map();
  for (const orgData of orgDataList) {
    const orgCode = orgData.ORG_CODE;
    orgCodeMap.set(orgCode, orgData);
  }
  return orgCodeMap;
}

function csTypeHandler(type) {
  const map = {
    供应商: "SUPPLIER",
    客户: "CUSTOMER",
  };
  const typeArr = type.split("/");
  const typeArrTransform = typeArr.map((item) => {
    return map[item];
  });
  return typeArrTransform.join(",");
}
