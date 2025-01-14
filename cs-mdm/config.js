export const mainTableConfig = {
  isFetchCsCode: true,
  headerCodeRow: 1,
  headerNameRow: 2,
  fieldMap: {
    CS_CODE: {
      field: "CS_CODE",
      description: "客商编码",
    },
    CS_NAME: {
      field: "CS_NAME",
      description: "客商名称",
    },
    SHORT_NAME: {
      field: "SHORT_NAME",
      description: "客商简称",
    },
    DATA_SOURCE: {
      field: "DATA_SOURCE",
      description: "数据来源",
      transform: {
        type: "map",
        map: {
          华山牧: "1",
          牧业分公司: "1",
          中垦供应链: "1",
          中垦天宁牧业有限公司: "1",
          天友: "2",
        },
      },
    },
    ORG_NAME: {
      field: "DATA_SOURCE",
      description: "数据来源-组织名称",
    },
    ORG_CODE: {
      field: "DATA_SOURCE",
      description: "数据来源-组织名称",
      transform: {
        type: "map",
        map: {
          华山牧: "1004",
          牧业分公司: "1005",
          中垦供应链: "1007",
          中垦天宁牧业有限公司: "1003",
          天友: "HB103",
        },
      },
    },
    LEGAL_PERSON: {
      field: "LEGAL_PERSON",
      description: "法定代表人",
    },
    TAXPAYER_ID: {
      field: "TAXPAYER_ID",
      description: "统一社会信用代码",
    },
    CONTACT: {
      field: "CONTACT",
      description: "联系人",
    },
    CONTACT_TEL: {
      field: "CONTACT_TEL",
      description: "联系人电话",
    },
    EMAIL: {
      field: "EMAIL",
      description: "邮件",
    },
    WEBSITE: {
      field: "WEBSITE",
      description: "官网网址",
    },
    REMARK: {
      field: "REMARK",
      description: "备注",
    },
  },
};
