import {
  accrualDirectionFieldTransform,
  acctCurrencyFieldTransform,
  dcFieldTransform,
  plTypeFieldTransform,
  whetherFieldTransform,
} from "../transform.js";

const relationSubTableFieldMap = {
  ledger__LEDGER_ACCOUNT_CODE: "number",
  // _$代表字段key会自增 eg:asstactitem.name,asstactitem.name_1,asstactitem.name_2
  ACCOUNT_CATEGORY_NAME_$: {
    field: "asstactitem.name",
    transform: (value) => {
      return value;
    },
  },
  ACCOUNT_CATEGORY_CODE_$: "asstactitem.number",
};

const mainTableFieldMap = {
  LEDGER_ACCOUNT_NAME: "name.zh_CN",
  LEDGER_ACCOUNT_CODE: "number",
  PARENT_NAME: "parent.name",
  PARENT_CODE: "parent.number",
  ACCOUNT_TABLE: "accounttable.number",
  ACCOUNT_TYPE: "accounttype.number",
  INCOME_EXPENSES_TYPE_NAME: "pltype",
  INCOME_EXPENSES_TYPE_CODE: {
    field: "pltype",
    transform: plTypeFieldTransform,
  },
  ACCRUAL_DIRECTION_NAME: "accrualdirection",
  ACCRUAL_DIRECTION_CODE: {
    field: "accrualdirection",
    transform: accrualDirectionFieldTransform,
  },
  BALANCE_DIRECTION_NAME: "dc",
  BALANCE_DIRECTION_CODE: {
    field: "dc",
    transform: dcFieldTransform,
  },
  IS_ALLOW_CHILD: {
    field: "isallowca",
    transform: whetherFieldTransform,
  },
  IS_MANUAL: "ismanual",
  IS_CASH: "iscash",
  IS_BANK: "isbank",
  IS_CASH_EQUIVALENT: "iscashequivalent",
  IS_NOTICE: "acnotice",
  IS_CHANGE_CURRENCY: "ischangecurrency",
  IS_BW: "bw",
  IS_QUANTITY: "isqty",
  MEASUREMENT_UNIT_GROUP: "measureunitgroup.number",
  MEASUREMENT_UNIT_CODE: "measureunit.number",
  ACCOUNT_CURRENCY_NAME: "acctcurrency",
  ACCOUNT_CURRENCY_CODE: {
    field: "acctcurrency",
    transform: acctCurrencyFieldTransform,
  },
  START_DATE: "startdate",
};

export const mainTableConfig = {
  templateFilePath: "./target/2024-12-25-科目模板下载.xlsx",
  sourceFilePath: "./source/会计科目导入模板.xlsx",
  outputFilePath: "./output/output_科目.xlsx",
  mainTableFieldMap: mainTableFieldMap,
  bodyStart: 3,
  subTablesInfoCol: 31,
  headerRow: 4,
};

export const subTablesConfig = [
  {
    templateFilePath: "./target/2024-12-25-核算关系信息模板下载.xlsx",
    outputFilePath: "./output/output_核算关系信息.xlsx",
    subTableFieldMap: relationSubTableFieldMap,
  },
  {
    templateFilePath: "./target/2024-12-25-币种信息模板下载.xlsx",
    outputFilePath: "./output/output_币种信息.xlsx",
    subTableFieldMap: null,
  },
];
