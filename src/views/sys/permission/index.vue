<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          v-model="tree.filterTreeText"
          placeholder="输入关键字进行过滤"
        />
        <el-tree :data="tree.data" :props="tree.props" empty-text="数据加载中" @node-click="handleNodeClick" />
      </el-col>
      <el-col :span="16">
        <el-form ref="form" :model="checkedNode" label-width="80px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="checkedNode.name" />
          </el-form-item>
          <el-form-item label="权限类型" prop="type">
            <el-select v-model="checkedNode.type" placeholder="请选择权限类型" clearable>
              <el-option
                v-for="item in checkedNode.statusSelect"
                :key="item.id"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {initTree, handleNodeClick, tree, checkedNode, save} from '@/composables/sys/permission'

export default {
  name: 'Permission',
  setup() {
    // 初始化树
    initTree()
    return {
      tree,
      checkedNode,
      handleNodeClick,
      save
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #283443;
.tree-box {
  height: 400px;
  overflow: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
