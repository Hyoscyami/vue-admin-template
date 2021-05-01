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
          node-key="id"
          :load="loadNode"
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
import request from '@/utils/request'

export default {
  name: 'Permission',
  data() {
    return {
      // 过滤树的字段
      filterTreeText: '',
      // 树的属性重命名
      treeProps: {
        label: 'name'
      },
      // 根节点
      rootNode: {},
      // 子树的数据
      childrenTreeData: []
    }
  },
  watch: {
    // 搜索权限树的时候联动过滤名称符合的树
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    /**
     * 获取根节点
     */
    async initTree() {
      await request({
        url: '/permission/getRootPermission',
        method: 'get'
      }).then(response => {
        this.rootNode = response.data
        console.log('获取到根节点', this.rootNode)
      })
    },
    /**
     * 根据id获取直接子节点
     * @param id 当前节点id
     */
    getChildrenNode(id) {
      request({
        url: '/permission/listChildren',
        method: 'get'
      }).then(response => {
        this.childrenTreeData = response.data
        console.log('节点子节点数据', this.childrenTreeData)
      })
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
    async loadNode(node, resolve) {
      console.log('开始加载树，node:', node)
      if (node.level === 0) {
        await this.initTree()
        console.log('开始初始化根节点', this.rootNode)
        return resolve([this.rootNode])
      }
    }
  }
}
</script>

<style scoped>

</style>
