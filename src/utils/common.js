export function setTxsType(type) {
  if (type === "send") {
    return "转账";
  } else if (type === "create_validator" ) {
    return "创建验证者";
  }
}