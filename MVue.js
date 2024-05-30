
class MVue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        //保存 options参数,后面处理数据要用到
        this.$options = options;
        // 如果这个根元素存在则开始编译模板
        if (this.$el) {
            // 1.实现一个数据监听器Observe
            // 能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
            // Object.definerProperty()来定义
            new Observer(this.$data);

            // 把数据获取操作 vm上的取值操作 都代理到vm.$data上
            this.proxyData(this.$data);

            // 2.实现一个指令解析器Compile
            new Compile(this.$el, this);

        }
    }
    // 做个代理
    proxyData(data) {
        for (const key in data) {
            Object.defineProperty(this, key, {
                get() {
                    return data[key];
                },
                set(newVal) {
                    data[key] = newVal;
                }
            })
        }
    }
}


// 编译数据的类
class Compile {
    constructor(el, vm) {
        //编译过程中，绑定watch
        console.log('开始编译',Dep.target);
        // 判断el参数是否是一个元素节点,如果是直接赋值,如果不是 则获取赋值
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        // 因为每次匹配到进行替换时,会导致页面的回流和重绘,影响页面的性能
        // 所以需要创建文档碎片来进行缓存,减少页面的回流和重绘
        // 1.获取文档碎片对象
        const fragment = this.node2Fragment(this.el);
        console.log(fragment);
        // 2.编译模板
        this.compile(fragment)

        // 3.把子元素的所有内容添加到根元素中
        this.el.appendChild(fragment);

    }
    compile(fragment) {
        // 1.获取子节点
        const childNodes = fragment.childNodes;
        console.log(childNodes);
        // 2.遍历子节点
        [...childNodes].forEach(child => {

            // 3.对子节点的类型进行不同的处理
            if (this.isElementNode(child)) {
                // 是元素节点
                // 编译元素节点
                console.log('我是元素节点', child);
                this.compileElement(child);
            } else {
                // console.log('我是文本节点',child);
                this.compileText(child);
                // 剩下的就是文本节点
                // 编译文本节点
            }
            // 4.一定要记得,递归遍历子元素
            if (child.childNodes && child.childNodes.length) {
                this.compile(child);
            }
        })
    }
    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        // console.log(el.firstChild);
        let firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild);
        }
        return fragment
    }
    isElementNode(el) {
        return el.nodeType === 1;
    }
    compileElement(node) {
        // 获取该节点的所有属性
        const attributes = node.attributes;
        console.log(attributes,[...attributes],'attributes');
        // 对属性进行遍历
        [...attributes].forEach(attr => {
            console.log(attr);
            const { name, value } = attr; //v-text v-model   v-on:click  @click 
            // 看当前name是否是一个指令
            if (this.isDirective(name)) {
                //对v-text进行操作
                const [, directive] = name.split('-'); //text model html
                // v-bind:src
                const [dirName, eventName] = directive.split(':'); //对v-on:click 进行处理
                // 更新数据
                compileUtil[dirName] && compileUtil[dirName](node, value, this.vm, eventName);
                // 移除当前元素中的属性
                node.removeAttribute('v-' + directive);

            } else if (this.isEventName(name)) {
                // 对事件进行处理 在这里处理的是@click
                let [, eventName] = name.split('@');
                compileUtil['on'](node, value, this.vm, eventName)
            }

        })

    }
    // 编译文本的方法
    compileText(node) {
        const content = node.textContent;
        // 匹配{{xxx}}的内容
        if (/\{\{(.+?)\}\}/.test(content)) {
            // 处理文本节点
            compileUtil['text'](node, content, this.vm)
        }

    }

    // 是否是@click这样事件名字
    isEventName(attrName) {
        return attrName.startsWith('@')
    }
    //判断是否是一个指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

}


