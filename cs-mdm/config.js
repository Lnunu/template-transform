export const mainTableConfig = {
  headerCodeRow: 1,
  headerNameRow: 2,
  fieldMap: {
    CS_CODE: {
      field: "cs_code",
      description: "客商编码",
    },
    CS_NAME: {
      field: "cs_name",
      description: "客商名称",
    },
    SHORT_NAME: {
      field: "short_name",
      description: "客商简称",
    },
    DATA_SOURCE: {
      field: "data_source",
      description: "数据来源",
      transform: {
        type: "map",
        map: {
          华山牧: "1",
          牧业分公司: "1",
          中垦供应链: "1",
          天友: "2",
        },
      },
    },
    ORG_NAME: {
      field: "data_source",
      description: "数据来源-组织名称",
    },
    ORG_CODE: {
      field: "data_source",
      description: "数据来源-组织名称",
      transform: {
        type: "map",
        map: {
          华山牧: "00",
          牧业分公司: "01",
          中垦供应链: "02",
          天友: "03",
        },
      },
    },
    LEGAL_PERSON: {
      field: "legal_person",
      description: "法定代表人",
    },
    TAXPAYER_ID: {
      field: "taxpayer_id",
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
