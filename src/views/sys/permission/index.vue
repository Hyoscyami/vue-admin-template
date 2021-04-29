<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="filterTreeText"
          placeholder="输入关键字进行过滤"
        />
        <el-tree
          ref="tree"
          :props="treeProps"
          :data="treeData"
          :load="loadDirectChildNodes"
          :filter-node-method="filterNode"
          lazy
        />
      </el-col>
      <el-col :span="18">
        <p>这里编辑权限</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {isEmptyCollection} from '@/utils/common'

export default {
  name: 'Permission',
  data() {
    return {
      // 过滤树的字段
      filterTreeText: '',
      // 树的属性重命名
      treeProps: {
        label: 'name',
        children: 'zones'
      },
      // 树的数据
      treeData: []
    }
  },
  watch: {
    // 搜索权限树的时候联动过滤名称符合的树
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    // 初始化树
    this.initTree()
  },
  methods: {
    /**
     * 初始化树
     */
    initTree() {
      console.log('开始初始化树')
      this.treeData = this.getTreeRootNode()
    },
    /**
     * 获取根节点
     */
    getTreeRootNode() {
      console.log('开始获取根节点')
      return [{name: '根节点'}]
    },
    /**
     * 根据id获取直接子节点
     * @param id 当前节点id
     */
    getChildrenNode(id) {

    },
    /**
     * 过滤tree的节点
     * @param value 搜索关键字
     * @param data 数据
     * @returns {boolean} 匹配成功返回true，不成功返回false
     */
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
     * 加载子树数据的方法，仅当 lazy 属性为true 时生效
     * @param node 节点
     * @param resolve
     * @returns {*}
     */
    loadDirectChildNodes(node, resolve) {
      console.log('开始加载子树方法，node:', node)
      if (isEmptyCollection(node.children)) {
        node.isLeaf = true
      } else {
        node.isLeaf = false
      }
    }
  }
}
</script>

<style scoped>

</style>
