export function composeDataByMapConfig(jsonDataArray, mapConfig) {
  function _transformHandler(value, transform) {
    const transformType = transform.type;
    if (transformType === "map") {
      const _map = transform.map;
      return _map[value];
    }
  }

  return jsonDataArray.reduce((acc, rowData) => {
    Object.keys(mapConfig).forEach((key) => {
      const fieldMap = mapConfig[key];
      const field = fieldMap.field;
      const transform = fieldMap.transform;
      if (transform) {
        rowData[key] = _transformHandler(rowData[field], transform);
      } else {
        rowData[key] = rowData[field];
      }
    });
    // 在处理数据后再清除字段，防止在映射过程中无法找到原字段数据
    Object.keys(mapConfig).forEach((key) => {
      const fieldMap = mapConfig[key];
      const field = fieldMap.field;
      delete rowData[field];
    });
    return acc.concat(rowData);
  }, []);
}

/**
 * [
 *   [
    '原编码',
    '客商编码',
    '客商名称',
    '客商简称',
    '数据来源',
    '法定代表人',
    '统一社会信用代码',
    '类型',
    '统一社会信用代码(新）',
    '是否合格',
    '联系人',
    '联系人电话',
    '邮件',
    '官网网址',
    '备注',
    '所属组织信息（不填写）',
    '地址信息（不填写）',
    '银行信息（不填写）'
  ],
  [
    null,           'COMPANY_CODE',
    'COMPANY_NAME', 'SHORT_NAME',
    'DATA_SOURCE',  'LEGAL_PERSON',
    'TAXPAYER_ID',  'type',
    null,           null,
    'CONTACT',      'CONTACT_TEL',
    'EMAIL',        'WEBSITE',
    'REMARK',       'ORG_INFO',
    'ADDRESS_INFO', 'BANK_INFO'
  ],]
 * @param {Array<Array>} dataAoA 
 */
export function excelDataTransform(dataAoA, options) {
  const result = [];
  const headerMap = {};
  const { headerCodeRow = 1, headerNameRow = 2 } = options || {};

  const headerCodeData = dataAoA[headerCodeRow];
  const headerNameData = headerNameRow ? dataAoA[headerNameRow] : null;
}
