import i18n from '@/i18n/i18n' // 语言国际化，中英...

const vm = i18n._vm;
// console.log(vm)
const lang = vm.locale; // 判断语言环境

export function setTxsType(type) {
  // 设置交易展示内容
  if (type === "send") {

    if (lang == 'cn') {
      return "转账";
    } else {
      return "Transfer";
    }

  } else if (type === "create_validator") {

    if (lang == 'cn') {
      return "创建验证者";
    } else {
      return "Create Verifier";
    }

  } else if (type === "issue") {

    if (lang == 'cn') {
      return "发币";
    } else {
      return "Issue Currency";
    }

  } else if (type === "add sys Address") {

    if (lang == 'cn') {
      return "设置地址";
    } else {
      return "Set Address";
    }

  }else if (type === "destory" || type === "destory_user") {

    if (lang == 'cn') {
      return "销毁";
    } else {
      return "Destory";
    }

  }
}
// 设置统一延时时间
export const setDelayTimer = 3000
