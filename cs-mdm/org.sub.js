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

const typeMap = {
  供应商: "SUPPLIER",
  客户: "CUSTOMER",
};

/**
 * 组织去重，客商在一个组织下面只能有一条数据
 * 增加类型字段组合：供应商/客户会根据组织组合
 */
function getOrgCodeMap(orgDataList) {
  const orgCodeMap = new Map();
  for (const orgData of orgDataList) {
    if (orgCodeMap.has(orgData.ORG_CODE)) {
      const mapOrgData = orgCodeMap.get(orgData.ORG_CODE);
      // 没有当前类型的话就添加
      if (mapOrgData.type.indexOf(orgData.type) === -1) {
        mapOrgData.type = mapOrgData.type + "/" + orgData.type;
      }
    } else {
      const orgCode = orgData.ORG_CODE;
      orgCodeMap.set(orgCode, orgData);
    }
  }
  return orgCodeMap;
}

function csTypeHandler(type) {
  const typeArr = type.split("/");
  const typeArrTransform = typeArr.map((item) => {
    return typeMap[item];
  });
  return typeArrTransform.join(",");
}
