<template>
  <div class="wrap">
    <el-tree
    :data="allData"
    :default-expand-all="true"
    :render-content="render"
    :expand-on-click-node="false"></el-tree>
  </div>
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
  watch: {
    data () {
      // 需要监控父组件传递的data属性，如果有更新重新渲染
      // 数据更新了就需要重新渲染
      this.transformData()
    }
  },
  methods: {
    isParent (data) {
      return data.type === 'parent'
    },
    render (h, { node, data, store }) {
      return (
        <div class="tree">
          <div>
            {
              this.isParent(data) ? (node.expanded ? <i class="el-icon-folder-opened"></i> : <i class="el-icon-folder"></i>) : <i class="el-icon-tickets"></i>
            }

            {data.name}
          </div>
          <el-dropdown placement="bottom-start" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      )
    },
    transformData () {
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
        // current.label = current.name
        if (parent) { // 有父亲则将current加进去parent内
          parent.children ? parent.children.push(current) : parent.children = [current]
        } else if (pid === 0) { // 根文件
          arr.push(current)
        }
        return arr
      }, [])
      this.allData = result
    }
  },
  mounted () {
    this.transformData()
  }
}
</script>

<style lang="scss">
.tree{
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
}
.wrap{
  width: 30%
}
</style>
