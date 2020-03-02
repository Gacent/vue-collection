<template>
  <div>
    <MyTree
    :data="data"
    :fileDrop="fileDrop"
    :diectoryDrop="diectoryDrop"
    ></MyTree>
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
      data: [],
      fileDrop: [
        { text: 'rm', value: '删除文件' }
      ],
      diectoryDrop: [
        { text: 'rn', value: '修改名字' },
        { text: 'rm', value: '删除文件夹' }
      ]
    }
  },
  mounted () {
    getTreeList().then((res) => {
      const data = res.data
      //  1. 扁平数据变成多层数据 递归数据
      data.parent.forEach(p => { p.type = 'parent' })
      this.data = [...data.parent, ...data.child] // 数据所有合并
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
