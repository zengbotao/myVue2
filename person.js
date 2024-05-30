/*
 * @Description: 
 * @Autor: zengbotao@myhexin.com
 * @Date: 2024-03-01 18:41:12
 * @LastEditors: 
 * @LastEditTime: 2024-03-01 18:45:01
 */
// 函数的组合式继承（Combination Inheritance）是一种常用的 JavaScript 继承模式，它结合了原型链继承和借用构造函数继承的优点。它的原理是通过在子类构造函数中调用父类构造函数，
// 实现对父类属性的继承，并通过将子类的原型对象指向一个父类实例，实现对父类方法的继承。
function Person(obj) {
    this.name = obj.name
    this.age = obj.age
}
// 函数对象的方法需要通过原型去增加
Person.prototype.add = function(value){
    console.log(value)
}
var p1 = new Person({name:"番茄", age: 18})

function Person1(obj) {
    Person.call(this, obj)//继承属性
    this.sex = obj.sex
}
// 这一步是继承的关键
Person1.prototype = Object.create(Person.prototype);//继承方法
Person1.prototype.constructor = Person1;//子类特有的构造函数

Person1.prototype.play = function(value){
    console.log(value)
}
var p2 = new Person1({name:"鸡蛋", age: 118, sex: "男"})


//class 相当于es5中构造函数
//class中定义方法时，前后不能加function，全部定义在class的protopyte属性中
//class中定义的所有方法是不可枚举的
//class中只能定义方法，不能定义对象，变量等
//class和方法内默认都是严格模式
//es5中constructor为隐式属性
class People{
    constructor(name='wang',age='27'){
      this.name = name;
      this.age = age;
    }
    eat(){
      console.log(`${this.name} ${this.age} eat food`)
    }
  }
  //继承父类
  class Woman extends People{ 
     constructor(name = 'ren',age = '27'){ 
       //继承父类属性
       super(name, age); 
     } 
      eat(){ 
       //继承父类方法
        super.eat() 
      } 
  } 
  let wonmanObj=new Woman('xiaoxiami'); 
  wonmanObj.eat();
  
  //es5继承先创建子类的实例对象，然后再将父类的方法添加到this上（Parent.apply(this)）。 
  //es6继承是使用关键字super先创建父类的实例对象this，最后在子类class中修改this。
  