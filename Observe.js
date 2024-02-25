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
    defineReactive(obj, key, value) {
        // 循环递归 对所有层的数据进行观察
        this.observe(value);//这样obj也能被观察了
        Object.defineProperty(obj, key, {
            get() {
                return value;
            },
            set: (newVal) => {
                if (newVal !== value) {
                    // 如果外界直接修改对象 则对新修改的值重新观察
                    this.observe(newVal);
                    value = newVal;
                    // 通知变化
                    dep.notify();
                }
            }
        })
    }
}
