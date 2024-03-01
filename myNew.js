/*
 * @Description:
 * @Autor: zengbotao@myhexin.com
 * @Date: 2024-02-26 15:14:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-27 09:50:08
 */
// 实现 new ，成为三部分
// 创建一个新的对象 obj
// 将对象与构建函数通过原型链连接起来
// 将构建函数中的 this 绑定到新建的对象 obj上

const { prototype } = require("events");

// 根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理
function myNew(fn, ...args) {
  let obj = {};
  obj.__proto__ = fn.prototype;
  let result = fn.apply(obj, args);
  return result instanceof Object ? result : obj;
}

// 实现 bind ，成为三部分
// 修改 this 指向
// 动态传递参数
// 兼容 new 关键字
Function.prototype.myBind = function (context) {
  // 判断调用对象是否为函数
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  // 获取参数
  const args = [...arguments].slice(1); //函数参数

  console.log(args.concat(...arguments), "args.concat(...arguments)");
  let fn = this; //函数  修改 this 指向
  return function Fn() {
    // 根据调用方式，传入不同绑定值
    return fn.apply(
      this instanceof Fn ? new fn(...arguments) : context, //修改this指向
      args.concat(...arguments) //新的参数
    );
  };
};

function isElementNode(el = {}) {
  console.log(el, "gg");
  el.nodeType = 1;
  return el;
}

// let ss=myNew(isElementNode.myBind({ns:'dd'},{fd:'ff'}))
// console.log(ss);

/**
 * @description:你尽管触发事件，但是我一定在事件触发 n 秒后才执行
 * @param {*} func 要进行防抖的函数
 * @param {*} wait 等待的时间间隔，单位为毫秒
 * @param {*} immediate 是否立即执行函数
 * @return {*}
 * @author: zengbotao@myhexin.com
 */
function debounce(func, wait, immediate = false) {
  let timeout;
  return function () {
    let context = this; //不配置会指向windows
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
  };
}
// let dd = debounce(isElementNode, 1000);
// dd();
// dd();

// 使用时间戳
/**
 * @description:
 * @param {*} func
 * @param {*} wait
 * @return {*}
 * @author: zengbotao@myhexin.com
 */
function throttle(func, wait) {
  let preTime = 0;

  return function () {
    let nowTime = +new Date();
    let context = this;
    let args = arguments;
    if (nowTime - preTime > wait) {
      func.apply(context, args);
      preTime = nowTime;
    }
  };
}

// 定时器实现
function throttle2(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (!timeout) {
      timeout = setTimeout(function () {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
/**
 * @description: 这个手写一定要懂原型及原型链。
 * @param {*} target 函数或者实例
 * @param {*} origin 构造函数
 * @return {*}
 * @author: zengbotao@myhexin.com
 */
function myInstanceof(target, origin) {
  if (typeof target !== "object" || target === null) return false;
  if (typeof origin !== "function")
    throw new TypeError("origin must be function");
  let proto = Object.getPrototypeOf(target); // 相当于 proto = target.__proto__;
  while (proto) {
    if (proto === origin.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

/**
 * @description: 将多重数组通过递归合并成一个数组
 * @param {*} arr
 * @param {*} depth
 * @return {*}
 * @author: zengbotao@myhexin.com
 */
function flat(arr, depth = 1) {
  if (depth > 0) {
    // 以下代码还可以简化，不过为了可读性，还是....
    //reduce(callback,initialValue)
    // callback(accumulator,currentValue,currentIndex,array)
    return arr.reduce((pre, cur) => {
        console.log(pre);
        
      return pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur);
    }, []);
  }
  return arr.slice();
}
// let ss = [1, [1, [1, 2, 2, 3], 2, 3], 2, 3];
// let flat2 = flat(ss, 1);
// console.log(flat2);
// [
//     1, 1, 1, 2, 2,
//     3, 2, 3, 2, 3
//   ]

/**
 * @description: reduce
 * @param {*} cb
 * @param {*} initialValue 表示初始值，作为累加器的初始值。
 * 如果提供了初始值，则从数组的第一个元素开始迭代；
 * 如果没有提供初始值，则从数组的第二个元素开始迭代，并将第一个元素作为初始值。
 * @return {*}
 * @author: zengbotao@myhexin.com
 */
Array.prototype.reduce2 = function (cb, initialValue) {
  const arr = this;
  let total = initialValue || arr[0];
  // 有初始值的话从0遍历，否则从1遍历
  for (let i = initialValue ? 0 : 1; i < arr.length; i++) {
    total = cb(total, arr[i], i, arr);
  }
  return total;
};
// let ss2=[
//     1, 1, 1, 2, 2,
//     3, 2, 3, 2, 3
//   ]
//   let s3=ss2.reduce2((p,c)=>{
//     return p+c
//   },0)
//   console.log(s3);

/**
 * 深拷贝完整版实现
 * @param {Object} target 
 * @returns 
 */
function deepClone(target = {}) {
  // WeakMap作为记录对象的hash表 （用于防止循环引用）
  const map = new WeakMap()

  // 工具函数
  function isObject(target) {
      return (typeof target === 'object') || typeof target === 'function'
  }

  // 拷贝主逻辑
  function clone(data) {

      // 基础类型直接返回
      if (isObject(data)) {
          return data
      }

      // 日期或者正则对象，则直接构造一个新的对象返回
      if ([Date, RegExp].includes(data.constructor)) {
          return new data.constructor(data)
      }

      // 处理函数对象
      if (typeof data === 'function') {
          return new Function('return' + data.toString())()
      }

      // 如果对象已经存在，则直接返回该对象
      const exist = map.get(data)
      if (exist) {
          return exist
      }

      // 处理 Map 对象
      if (data instanceof Map) {
          const result = new Map()
          map.set(data, result)
          data.forEach((val, key) => {
              // 注意：map种的值为 object 的话也得深拷贝
              if (isObject(val)) {
                  result.set(key.clone(val))
              } else {
                  result.set(key, val)
              }
          })
          return result
      }

      // 处理 Set 对象
      if (data instanceof Set) {
          const res = new Set()
          map.set(data, res)
          data.forEach(val => {
              if (isObject(val)) {
                  res.add(clone(val))
              } else {
                  res.add(val)
              }
          })
          return res
      }

      // 收集键名（考虑以Symbol作为key以及不可枚举的属性）
      // Reflect.ownKeys(obj)相当于[...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]
      const keys = Reflect.ownKeys(data)
      // 获得对象的所有属性以及对应的属性描述
      const allDesc = Object.getOwnPropertyDescriptors(data)
      // 创建一个新对象， 继承传入对象的原型链、（浅拷贝）
      const result = Object.create(Object.getPrototypeOf(data), allDesc)

      // 新对象加入map中，进行记录
      map.set(data, result)

      // Object.create() 是浅拷贝，所以要判断值的类型并递归进行深拷贝
      keys.forEach(key => {
          const val = data[key]
          if (isObject(key)) {
              result[key] = clone(val)
          } else {
              result[key] = val
          }
      })
      return result
  }

  return clone(data)
}

