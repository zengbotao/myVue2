// 编译模板工具类
const compileUtil = {
    // 获取值的方法
    getVal(expr, vm) {
        return expr.split('.').reduce((data, currentVal) => {
            return data[currentVal]
        }, vm.$data)
    },
    //设置值
    setVal(vm, expr, val) {
        return expr.split('.').reduce((data, currentVal, index, arr) => {
            return data[currentVal] = val
        }, vm.$data)
    },
    //获取新值 对{{a}}--{{b}} 这种格式进行处理
    getContentVal(expr, vm) {
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return this.getVal(args[1], vm);
        })
    },
    text(node, expr, vm) { //expr 可能是 {{obj.name}}--{{obj.age}} 
        let val;
        if (expr.indexOf('{{') !== -1) {
            // 
            val = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
                //绑定watcher从而更新视图
                new Watcher(vm, args[1], () => {
                    this.updater.textUpdater(node, this.getContentVal(expr, vm));
                })
                return this.getVal(args[1], vm);
            })
        } else { //也可能是v-text='obj.name' v-text='msg'
            val = this.getVal(expr, vm);
        }
        this.updater.textUpdater(node, val);

    },
    html(node, expr, vm) {
        // html处理 非常简单 直接取值 然后调用更新函数即可
        let val = this.getVal(expr, vm);
        // 订阅数据变化时 绑定watcher,从而更新函数
        new Watcher(vm, expr, (newVal) => {
            this.updater.htmlUpdater(node, newVal);
        })
        this.updater.htmlUpdater(node, val);
    },
    model(node, expr, vm) {
        const val = this.getVal(expr, vm);
        // 订阅数据变化时 绑定更新函数 更新视图的变化

        // 数据==>视图
        new Watcher(vm, expr, (newVal) => {
            this.updater.modelUpdater(node, newVal);
        })
        // 视图==>数据
        node.addEventListener('input', (e) => {
            // 设置值
            this.setVal(vm, expr, e.target.value);

        }, false);
        this.updater.modelUpdater(node, val);
    },
    // 对事件进行处理
    on(node, expr, vm, eventName) {
        // 获取事件函数
        let fn = vm.$options.methods && vm.$options.methods[expr];
        // 添加事件 因为我们使用vue时 都不需要关心this的指向问题,这是因为源码的内部帮咱们处理了this的指向
        node.addEventListener(eventName, fn.bind(vm), false);
    },
    // 绑定属性 简单的属性 已经处理 类名样式的绑定有点复杂 因为对应的值可能是对象 也可能是数组 大家根据个人能力尝试写一下
    bind(node, expr, vm, attrName) {
        let attrVal = this.getVal(expr, vm);
        this.updater.attrUpdater(node, attrName, attrVal);
    },
    updater: {
        attrUpdater(node, attrName, attrVal) {
            node.setAttribute(attrName, attrVal);
        },
        modelUpdater(node, value) {
            node.value = value;
        },
        textUpdater(node, value) {
            node.textContent = value;
        },
        htmlUpdater(node, value) {
            node.innerHTML = value;
        }
    }

}


class Dep {
    constructor() {
        this.subs = []
    }
    // 添加订阅者
    addSub(watcher) {
        this.subs.push(watcher);

    }
    // 通知变化
    notify() {
        // 观察者中有个update方法 来更新视图
        this.subs.forEach(w => w.update());
    }
}

//Watcher.js
class Watcher {
    constructor(vm, expr, cb) {
        // 观察新值和旧值的变化,如果有变化 更新视图
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 先把旧值存起来  
        //构造函数在new Watch的时候会比较值
        this.oldVal = this.getOldVal();
    }
    getOldVal() {
        Dep.target = this;
        let oldVal = compileUtil.getVal(this.expr, this.vm);
        Dep.target = null; //很关键，把旧的watch绑定的对象销毁掉
        return oldVal;
    }
    update() {
        // 更新操作 数据变化后 Dep会发生通知 告诉观察者更新视图
        let newVal = compileUtil.getVal(this.expr, this.vm);
        if (newVal !== this.oldVal) {
            this.cb(newVal);
        }
    }
}



// 创建一个数据监听者  劫持并监听所有数据的变化
class Observer {
    constructor(data) {
        this.observe(data);
    }
    observe(data) {
        // 如果当前data是一个对象才劫持并监听
        if (data && typeof data === 'object') {
            // 遍历对象的属性做监听
            Object.keys(data).forEach(key => {
                this.defineReactive(data, key, data[key]);
            })

        }
    }
    //
    // 数据修改时，因为初始化已经对数据做了响应式处理，所以当修改数据时，
    // 首先会走observer中的get方法，由于初始化已经对该数据进行监听，
    // 添加了watcher，并且此时Dep.target为null，所以不会再次收集订阅者信息，
    // 而是去通知视图进行更新，走了set中的notify，
    // notify去通知所有的watcher去执行update方法



    defineReactive(obj, key, value) {
        // 循环递归 对所有层的数据进行观察
        this.observe(value);//这样obj也能被观察了
        const dep = new Dep(Dep.target);
        //是compile后才会存在Dep.target
        console.log(value,Dep.target,'Detarget')
        Object.defineProperty(obj, key, {
            get() {
                //订阅数据变化,往Dep中添加观察者
                console.log(Dep.target, 'Dep.target')
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set: (newVal) => { //箭头函数有利语this指向
                if (newVal !== value) {
                    // 如果外界直接修改对象 则对新修改的值重新观察
                    this.observe(newVal);
                    value = newVal;
                    // 通知变化
                    console.log(Dep.target, 'notify')
                    dep.notify();
                }
            }
        })
    }
}
