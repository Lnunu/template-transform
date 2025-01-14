export const mainTableConfig = {
  isFetchCsCode: true,
  headerCodeRow: 1,
  headerNameRow: 2,
  fieldMap: {
    TYPE: {
      field: "type",
    },
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
          中垦华山牧乳业有限公司: "1",
          "中垦牧乳业（集团）股份有限公司供应链分公司": "1",
          牧业分公司: "1",
          "重庆市天友乳业股份有限公司（合并）": "2",
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
          中垦华山牧乳业有限公司: "1006",
          牧业分公司: "1005",
          "中垦牧乳业（集团）股份有限公司供应链分公司": "1007",
          "重庆市天友乳业股份有限公司（合并）": "HB103",
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
