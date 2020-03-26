// 编译的方法集合
const compileUtil = {
  getVal(expr, vm) {
    // [person,name]
    return expr.split('.').reduce((data, currentVal) => {
      return data[currentVal]
    }, vm.$data)
  },
  setVal(expr, vm, inputVal) {
    // console.log(expr)
    expr.split('.').reduce((data, currentVal) => {
      console.log(data[currentVal])
      if(typeof data[currentVal]!='object'){
        data[currentVal] = inputVal
      } else {
        return data[currentVal]
      }
    }, vm.$data)
  },
  getContentVal(expr, vm) {
    value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getVal(args[1], vm)
    })
    return value
  },
  text(node, expr, vm) { // expr:msg 或 person.name 或  {{}}
    let value;
    if (expr.indexOf('{{') > -1) {
      // {{person.age}}--{{person.name}}
      value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        // 绑定观察者,将来数据发生变化,触发回调,进行更新
        new Watcher(vm, args[1], () => {
          this.updater.textUpdater(node, this.getContentVal(expr, vm))
        })
        return this.getVal(args[1], vm)
      })
    } else {
      value = this.getVal(expr, vm); // 取值data
      new Watcher(vm, expr, (newVal) => {
        this.updater.textUpdater(node, newVal)
      })
    }
    this.updater.textUpdater(node, value)
  },
  html(node, expr, vm) {
    const value = this.getVal(expr, vm);
    new Watcher(vm, expr, (newVal) => {
      this.updater.htmlUpdater(node, newVal)
    })
    this.updater.htmlUpdater(node, value)
  },
  model(node, expr, vm) {
    const value = this.getVal(expr, vm);
    // 绑定更新函数,数据=>视图
    new Watcher(vm, expr, (newVal) => {
      this.updater.modelUpdater(node, newVal)
    })
    // 视图=>数据=>视图
    node.addEventListener('input', (e) => {
      // 设置值
      this.setVal(expr, vm, e.target.value)
    })
    this.updater.modelUpdater(node, value)
  },
  on(node, expr, vm, eventName) {
    let fn = vm.$options.methods && vm.$options.methods[expr]
    // this要指向回vm，冒泡过程中执行
    node.addEventListener(eventName, fn.bind(vm), false)
  },
  bind(node, expr, vm, attrName) {
    const value = this.getVal(expr, vm);
    node.setAttribute(attrName, value)
  },
  // 更新的函数
  updater: {
    modelUpdater(node, value) {
      node.value = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    textUpdater(node, value) {
      node.textContent = value
    }
  }
}
// 编译类
class Compile {
  constructor(el, vm) {
    // 是否是元素节点，是就直接赋值，不是则获取el节点
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    // 1. 获取文档碎片对象 放入内存中会减少页面的回流和重绘
    // 2. 文档碎片就是根节点，但是和原来的不同
    const fragment = this.node2Fragment(this.el)
    // 3. 编译模板
    this.compile(fragment)
    // 4. 追加进根元素
    this.el.appendChild(fragment)
  }
  // 编译方法
  compile(fragment) {
    // 1. 获取子节点
    const childNodes = fragment.childNodes; //NodeList(9) [text, h2, text, h2, text, h2, text, h2, text]
    [...childNodes].forEach(child => {
      // console.log(child)
      if (this.isElementNode(child)) {
        // 是元素节点，过滤文本节点
        // 编译元素节点
        this.compileElement(child)
      } else {
        // 文本节点
        // 编译文本节点
        this.compileText(child)
      }
      // 递归子节点
      if (child.childNodes && child.childNodes.length) {
        this.compile(child)
      }
    })
  }
  // 编译node类型的
  compileElement(node) {
    // <div v-text="msg"></div>
    const attributes = node.attributes;
    // console.log(attributes) //NamedNodeMap {0: v-text, v-text: v-text, length: 1}
    [...attributes].forEach(attr => {
      const { name, value } = attr;
      // console.log(name,value) //v-text msg
      if (this.isDirective(name)) { // v-开头是指令
        const [, dirctive] = name.split('-');  // 拿到v-后面的, text,model,on:click
        const [dirName, eventName] = dirctive.split(':'); // text,model,on
        // 根据不同名字处理不同的事件，this.vm是拿data的值，数据驱动视图
        compileUtil[dirName](node, value, this.vm, eventName)
        // 删除指令标签上的属性
        node.removeAttribute('v-' + dirctive)
      } else if (this.isEventName(name)) {  // @click
        let [, eventName] = name.split('@')
        compileUtil['on'](node, value, this.vm, eventName)
      }
    })
  }
  // 编译文本类型的
  compileText(node) {
    // {{}}  
    let content = node.textContent;
    if (/\{\{(.+?)\}\}/.test(content)) {
      compileUtil['text'](node, content, this.vm)
    }
  }
  // 检测绑定的事件是否用@开头
  isEventName(attrName) {
    return attrName.startsWith('@')
  }
  // 检测绑定的指令是否用v-开头
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 创建文档碎片,并将所有文档中的DOM追加进去,后续实现一次性更新,减少浏览器DOM渲染消耗
  node2Fragment(el) {
    // 创建文档碎片
    const f = document.createDocumentFragment();
    let firstChild
    // 追加进文档碎片，这个过程中，页面上DOM看不到的，已经追加进去了
    while (firstChild = el.firstChild) {
      f.appendChild(firstChild)
    }
    return f;
  }
  // 检测是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1; // 表示是元素节点对象
  }
}
// MVue类
class MVue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;
    if (this.$el) {
      // 1. 实现一个数据的观察者
      new Observer(this.$data)
      // 2. 实现一个指令解析器
      new Compile(this.$el, this)
      // 代理
      this.proxyData(this.$data)
    }
    if (this.$options.created) {
      this.$options.created.bind(this)()
    }
  }
  proxyData(data){
    for (const key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          data[key] = newVal
        }
      })
    }
  }
}
// 添加观察者和定义发布订阅模式:(compile和observer)
// 首先创建Observer,在deineProperty的get方法中创建Dep添加对应Watcher(此时get并未执行,等待compile过程),
// 而Watcher是在Compile的时候初始化数据渲染的时候触发new Watcher(每一个依赖Dep对应单个属性),
// 并把watcher绑定到Dep静态属性target中,作用就是将watcher和Dep关联起来,此时调用了属性get方法,拿到了target并addSub到依赖队列中
// (Compile的过程其实就是依赖收集的过程)