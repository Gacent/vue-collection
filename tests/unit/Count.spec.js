import { expect } from 'chai'
import { mount } from '@vue/test-utils'
// import Vue from 'vue'

import Count from '@/components/Count.vue'
describe('测试count组件', () => {
  it('测试 点击按钮是否加1', () => {
    const wrapper = mount(Count)
    expect(wrapper.find('#count').text()).to.be.equal('10')
    wrapper.find('#button').trigger('click')
    // Vue.config.errorHandler = done
    // Vue.nextTick(() => {
    //   expect(wrapper.find('#count').text()).to.be.equal('11')
    //   done()
    // })
    expect(wrapper.vm.count).to.be.equal(11)
  })
})
