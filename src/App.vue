<template>
  <div>
    <MyTree :data="data"></MyTree>
  </div>
</template>

<script>
import MyTree from '@/components/MyTree.vue'
import { getTreeList } from './api'
export default {
  components: {
    MyTree
  },
  data () {
    return {
      data: []
    }
  },
  mounted () {
    getTreeList().then((res) => {
      const data = res.data
      //  1. 扁平数据变成多层数据 递归数据
      this.data = [...data.parent, ...data.child] // 数据所有合并
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
