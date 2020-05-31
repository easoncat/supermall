export function debounce(func, delay) {
  let timer = null;
  return function (...args) { // ... 表示可以传入多个参数
    if (timer) clearTimeout(timer) // 同理，这里也是一个闭包，timer 引用了外面的timer，也不会被销毁
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay);
  }
}

/**
 * 格式化函数 ， 给日期格式化
 * date为 new Date()对象， fmt为 'yyyy-MM-dd'的格式
 */


// 正则表达式？字符串匹配 利器（规则较多）
export function formatDate(date, fmt) {
  // 1. 获取年份
  // y+ 表示 1个或者多个
  // y* 表示 0个或者多个
  // y? 表示 0个或者1个y

  // yy - 19
  // yyyy - 2019
  if (/(y+)/.test(fmt)) {
    let dateY = date.getFullYear() + ""; // 隐式转换，将num转换为str
    //RegExp.$1 在判断中出现过，且是括号括起来的，所以 RegExp.$1 就是 "yyyy"
    fmt = fmt.replace(RegExp.$1, dateY.substr(4 - RegExp.$1.length));
  }

  //获取其他
  
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

// 4:4:4 应该显示为 04:04:04
function padLeftZero(str) {
  // 传过来 4，变成 004，再截取从第1个位置开始的字符串，结果为 04
  return ("00" + str).substr(str.length);
}