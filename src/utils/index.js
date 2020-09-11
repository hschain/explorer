/**
 * 时间的展示方式
 * time : 需转换的时间值
 * getTime : 是否直接返回原本时间，false则返回与现实时间的时差
 */
export function formatTime(time, getTime) {
  let arr = time.slice(0, -1).split("T");
  let timeStamp = new Date(arr[0] + " " + arr[1] + " GMT+0000");

  if (getTime) {
    let y = timeStamp.getFullYear(),
      m = timeStamp.getMonth() + 1,
      d = timeStamp.getDate(),
      h = timeStamp.getHours(),
      min = timeStamp.getMinutes(),
      s = timeStamp.getSeconds();
    return y + "-" + m + "-" + d + "/" + h + ":" + min + ":" + s;
  } else {
    let diff = new Date().getTime() - timeStamp.getTime()
    if (diff <= 1000) {
      return "刚刚";
    } else if (diff <= 1000*60) {
      return parseInt(diff/(1000)) + "秒前";
    } else if (diff <= 1000*60*60) {
      return parseInt(diff/(1000*60)) + "分钟前";
    } else if (diff <= 1000*60*60*24) {
      return parseInt(diff/(1000*60*60)) + "小时前";
    } else if (diff <= 1000*60*60*24*30) {
      return parseInt(diff/(1000*60*60*24)) + "天前";
    } else if (diff <= 1000*60*60*365) {
      return parseInt(diff/(1000*60*60*24*30)) + "个月前";
    } else {
      return parseInt(diff/(1000*60*60*365)) + "年前";
    }
  }
  // if (getTime) {
  //   return arr;
  // } else {
  //   let timeStamp = [
  //     ...(arr[0] = arr[0].split("-")),
  //     ...(arr[1] = arr[1].split(":"))
  //   ];
  //   let now = new Date();
  //   if (now.getFullYear() - timeStamp[0] > 0) {
  //     return now.getFullYear() - timeStamp[0] + "年前";
  //   } else if (now.getMonth() + 1 - timeStamp[1] > 0) {
  //     return now.getMonth() + 1 - timeStamp[1] + "个月前";
  //   } else if (now.getDate() - timeStamp[2] > 0) {
  //     return now.getDate() - timeStamp[2] + "天前";
  //   } else if (now.getHours() - timeStamp[3] > 0) {
  //     return now.getHours() - timeStamp[3] + "小时前";
  //   } else if (now.getMinutes() - timeStamp[4] > 0) {
  //     return now.getMinutes() - timeStamp[4] + "分钟前";
  //   } else if (now.getSeconds() - timeStamp[4] > 0) {
  //     return now.getSeconds() - timeStamp[5] + "秒前";
  //   } else {
  //     return "刚刚";
  //   }
  // }
}

/**
 * 货币格式
 * value : 需转换货币格式的值
 * intOnly : 是否保留整数
 */
export function currencyFormat(value, intOnly) {
  let valueArray = value.toString().split(".");
  valueArray[0] = valueArray[0].replace(/\B(?=(\d{3})+\b)/g, ",");
  valueArray[1] && !intOnly
    ? (value = valueArray[0] + "." + valueArray[1])
    : (value = valueArray[0]);
  return value;
}
