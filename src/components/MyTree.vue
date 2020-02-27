<template>
  <el-tree :data="allData"></el-tree>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'MyTree',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      allData: []
    }
  },
  mounted () {
    // 需要根据数据进行克隆，克隆后的数据进行操作，防止在子组件中操作父组件的数据
    const AllData = _.cloneDeep(this.data)
    // {1:{name: "文件1", pid: 1, id: 10001}}
    // 以id为键，本身对象为值，生成树
    const treeMapList = AllData.reduce((memo, current) => {
      memo[current.id] = current
      return memo
    }, {})
    // 寻找当前的pid是否存在于treeMapList中，存在则在parent的children中添加进去，不存在且pid为0则表示根，直接push进arr
    const result = AllData.reduce((arr, current) => {
      const pid = current.pid
      const parent = treeMapList[pid]
      if (parent) { // 有父亲则将current加进去parent内
        parent.children ? parent.children.push(current) : parent.children = [current]
      } else if (pid === 0) { // 根文件
        arr.push(current)
      }
      return arr
    }, [])
    this.allData = result
  }
}
</script>

<style lang="scss" scoped>

</style>
