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


Function.prototype.myBind2 = function (context, ...args) {
    //新建一个变量赋值为this，表示当前函数
    const fn = this
    //判断有没有传参进来，若为空则赋值[]
    args = args ? args : []
    //返回一个newFn函数，在里面调用fn
    return function newFn(...newFnArgs) {
        if (this instanceof newFn) {
            return new fn(...args, ...newFnArgs)
        }
        return fn.apply(context, [...args,...newFnArgs])
    }
}

/**
 * @description: call的实现,apply与它特别相似，只是参数要是数组
 * 第一个参数为null或者undefined时，this指向全局对象window，值为原始值的指向该原始值的自动包装对象，如 String、Number、Boolean
 * 为了避免函数名与上下文(context)的属性发生冲突，使用Symbol类型作为唯一值
 * 将函数作为传入的上下文(context)属性执行
 * 函数执行完成后删除该属性
 * 返回执行结果
 * @param {*} context
 * @param {array} args
 * @return {*}
 * @author: zengbotao@myhexin.com
 */
Function.prototype.myCall = function(context,...args){
    let cxt = context || window;
    //将当前被调用的方法定义在cxt.func上.(为了能以对象调用形式绑定this)
    //新建一个唯一的Symbol变量避免重复
    let func = Symbol() 
    cxt[func] = this;
    args = args ? args : []
    //以对象调用形式调用func,此时this指向cxt 也就是传入的需要绑定的this指向
    const res = args.length > 0 ? cxt[func](...args) : cxt[func]();
    //删除该方法，不然会对传入对象造成污染（添加该方法）
    delete cxt[func];
    return res;
}
