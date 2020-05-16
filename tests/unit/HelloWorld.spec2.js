import HelloWorld from '@/components/HelloWorld'
import { expect } from 'chai'
import Vue from 'vue'
import { mount } from '@vue/test-utils'
describe('Hello world .vue', () => {
  it('传递属性后是否能正常显示结果', () => {
    // 原生自己测试vue
    // extend 方法可以根据实例创建一个类
    const Constructor = Vue.extend(HelloWorld)
    // 把组件进行挂载
    // vm.$el    mocha 集成了jsdom
    const vm = new Constructor({
      propsData: { msg: 'hello' }
    }).$mount()
    expect(vm.$el.querySelector('h1').innerHTML).to.be.contain('hello')
  })
})

describe('非原生检测HellowWorld', () => {
  it('HellowWorld传参', () => {
    const wrapper = mount(HelloWorld, {
      propsData: { msg: 'hello' }
    })
    // const wrapper = mount(HelloWorld)
    // wrapper.setProps({ msg: 'hello' })
    expect(wrapper.find('h1').text()).to.be.contain('hello')
  })
})
