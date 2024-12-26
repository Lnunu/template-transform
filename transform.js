export const whetherFieldMap = [
  {
    label: "是",
    value: "1",
  },
  {
    label: "否",
    value: "1",
  },
];

export const plTypeFieldMap = [
  {
    label: "收入要素",
    value: "1",
  },
  {
    label: "成本要素",
    value: "2",
  },
  {
    label: "管理费用",
    value: "3",
  },
  {
    label: "销售费用",
    value: "4",
  },
  {
    label: "财务费用",
    value: "5",
  },
  {
    label: "其它损益类型",
    value: "6",
  },
  {
    label: "非损益类科目",
    value: "7",
  },
];

export const accrualDirectionFieldMap = [
  {
    label: "不控制",
    value: "nocontrol",
  },
  {
    label: "借方",
    value: "debit",
  },
  {
    label: "贷方",
    value: "credit",
  },
];

export const dcFieldMap = [
  {
    label: "借",
    value: "1",
  },
  {
    label: "贷",
    value: "-1",
  },
];

export const acctCurrencyFieldMap = [
  {
    label: "不核算外币",
    value: "nocurrency",
  },
  {
    label: "指定核算币种",
    value: "descurrency",
  },
  {
    label: "核算所有币种",
    value: "allcurrency",
  },
];

export function transformMap(value, map) {
  const valueMatch = map.find((item) => item.value === value);
  if (valueMatch) {
    return valueMatch.label;
  } else {
    const labelMatch = map.find((item) => item.label === value);
    if (labelMatch) {
      return labelMatch.value;
    }
  }
  return value;
}

export function whetherFieldTransform(value) {
  return transformMap(value, whetherFieldMap);
}
export function plTypeFieldTransform(value) {
  return transformMap(value, plTypeFieldMap);
}
export function accrualDirectionFieldTransform(value) {
  return transformMap(value, accrualDirectionFieldMap);
}

export function dcFieldTransform(value) {
  return transformMap(value, dcFieldMap);
}

export function acctCurrencyFieldTransform(value) {
  return transformMap(value, acctCurrencyFieldMap);
}
