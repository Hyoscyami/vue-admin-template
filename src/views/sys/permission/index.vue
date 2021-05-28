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
                v-for="item in tree.typeSelect"
                :key="item.id"
                :label="item.name"
                :value="Number(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="路径" prop="path">
            <el-input v-model="checkedNode.path" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-select v-model="checkedNode.icon" placeholder="请选择图标类型" clearable>
              <el-option
                v-for="item in tree.iconSelect"
                :key="item.id"
                :label="item.name"
                :value="Number(item.value)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="checkedNode.status">
              <el-radio v-for="item in tree.statusSelect" :key="item.id" :label="Number(item.value)">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import {checkedNode, handleNodeClick, init, save, tree} from '@/composables/sys/permission'

export default {
  name: 'Permission',
  setup() {
    // 初始化
    init()
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
