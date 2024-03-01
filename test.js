/*
 * @Description: 
 * @Autor: zengbotao@myhexin.com
 * @Date: 2024-02-27 10:07:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-02-27 18:43:02
 */

//字符串
let ss='ddcd'
let sd='22ff'
console.log(ss.repeat(2),'repeat');
console.log(ss.concat(sd),'concat');
console.log(ss.substr(1,2),'substr'); //from length
console.log(ss.substring(1,2),'substring'); //start end
console.log(ss.padEnd(12,'2'),'padEnd');
console.log(ss.charAt(2),'charAt');//(position:number)
console.log(sd.startsWith('2'),'startswith');//(searchstring:srting)
console.log(sd.startsWith('2',2),'startswith');//(searchstring:srting,position:number)
console.log(sd.search(/2f/g),'search');
console.log(sd.search(/2/g),'search');

console.log(Boolean(Symbol('1')));
let setSample=new Set([1,1,3,5])
setSample.forEach(it=>console.log(it))

//数组
// Array.prototype.push()//方法接收任意数量的参数，并将它们添加到数组未尾，返回数组的最新长度
// Array.prototype.unshift()//在数组开头添加任意多个值，然后返回新的数组长度
// Array.prototype.splice()//传入三个参数，分别是开始位置、0(要删除的元素数量)、插入的元素，返回空数组
// Array.prototype.concat()//首先会创建一个当前数组的副本，然后再把它的参数添加到副本未尾，最后返回这个新构建的数组，不会影响原始数组

// Array.prototype.pop()//删除数组的最后一项，同时减少数组的 length值，返回被删除的项
// Array.prototype.shift()//删除数组的第一项，同时减少数组的 length值，返回被删除的项
// Array.prototype.splice()//传入三个参数，分别是开始位置、0(要删除的元素数量)、插入的元素，返回空数组
// Array.prototype.slice()//创建一个包含原有数组中一个或多个元素的新数组，不会影响原始数组

// Array.prototype.indexOf()
// Array.prototype.includes()
// Array.prototype.find()

console.log([1,1,3,5].find(it=>it===3));