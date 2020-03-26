// 观察者
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // 先把旧值保存起来
    this.oldVal = this.getOldVal()
  }
  getOldVal() {
    Dep.target = this;
    // console.log(this.expr)
    const oldVal = compileUtil.getVal(this.expr, this.vm) // 每次new,会触发对应的get,所以target下面能拿到,并添加依赖,之后要将target赋值null
    Dep.target = null;
    return oldVal
  }
  update() {
    const newVal = compileUtil.getVal(this.expr, this.vm)
    if (newVal !== this.oldVal) {
      this.cb(newVal)
    }
  }
}
// 订阅器:收集依赖,和通知视图更新
class Dep {
  constructor() {
    // 和属性相关,即一个属性,一个Dep队列里面可以有多个watcher(如果界面template中key存在多个)
    this.subs = []
  }
  // 收集观察者
  addSub(watcher) {
    this.subs.push(watcher);
  }
  // 通知观察者更新
  notify() {
    console.log('通知了',this.subs)
    this.subs.forEach(w=>w.update())
  }
}
class Observer {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    // 只针对对象 
    /*
      person:{name:'zhangzhan',fav:{a:'aihao'}}
    */
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.defineReactive(data, key, data[key])
      })
    }
  }
  defineReactive(obj, key, value) {
    // 递归遍历
    this.observe(value)
    const dep = new Dep() // 一个属性对应一个依赖队列,跟着data一起初始化了
    Object.defineProperty(obj, key, {
      enumerable: true,  // 可枚举
      configurable: true, // 可更改可配置
      get() {
        // 编译之前初始化
        // 订阅数据变化时,往Dep中添加观察者,观察数据是否发生变化,发生变化就回调函数去更新视图,收集依赖,一个属性一个watcher
        Dep.target && dep.addSub(Dep.target)
        return value;
      },
      set: (newVal) => {
        this.observe(newVal)
        if (newVal !== value) {
          value = newVal
        }
        // 通知变化
        dep.notify()
      }
    })
  }
}