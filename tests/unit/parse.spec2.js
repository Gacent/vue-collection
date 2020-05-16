import { stringify, parser } from '@/code/parse'
import { expect } from 'chai'
// mocha+chai（断言库）

// 一个用例

// 常见的关系 相等  大于/小于  包含和不包含
// describe
describe('专门测试parser', () => {
  it('我要测试parser是否靠谱', () => {
    // to.be xxxx
    // to.be.deep.equal表示两个对象是否完全相等(引用空间无所谓)
    expect(parser('name=wode')).to.be.deep.equal({ name: 'wode' })
  })
})
describe('专门测试stringify', () => {
  it('我要测试stringify是否靠谱', () => {
    // to.be xxxx
    // to.be.deep.equal表示两个对象是否完全相等(引用空间无所谓)
    expect(stringify({ name: 'wode' })).to.be.equal('name=wode')
  })
})

describe('测试方法', () => {
  it('相等关系', () => {
    expect(1 + 1).to.be.equal(2)
    expect([1, 2, 3]).to.be.lengthOf(3)
    expect(true).to.be.true
  })
  it('包含关系', () => {
    expect('zfpx').to.be.contain('zf')
    expect('zfpx').to.be.match(/zf/)
  })
  it('大于小于', () => {
    expect(5).to.be.greaterThan(3)
    expect(5).to.be.not.greaterThan(10)
  })
})
