<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="tree.filterTreeText"
          placeholder="输入关键字进行过滤"
        />
        <el-tree :data="tree.data" :props="tree.props" empty-text="数据加载中" @node-click="handleNodeClick" />
      </el-col>
      <!--      <el-col :span="18">-->
      <!--        <el-form ref="form" :model="form" label-width="80px">-->
      <!--          <el-form-item label="活动名称">-->
      <!--            <el-input v-model="form.name" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="活动区域">-->
      <!--            <el-select v-model="form.region" placeholder="请选择活动区域">-->
      <!--              <el-option label="区域一" value="shanghai" />-->
      <!--              <el-option label="区域二" value="beijing" />-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="活动时间">-->
      <!--            <el-col :span="11">-->
      <!--              <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />-->
      <!--            </el-col>-->
      <!--            <el-col class="line" :span="2">-</el-col>-->
      <!--            <el-col :span="11">-->
      <!--              <el-time-picker v-model="form.date2" placeholder="选择时间" style="width: 100%;" />-->
      <!--            </el-col>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="即时配送">-->
      <!--            <el-switch v-model="form.delivery" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="活动性质">-->
      <!--            <el-checkbox-group v-model="form.type">-->
      <!--              <el-checkbox label="美食/餐厅线上活动" name="type" />-->
      <!--              <el-checkbox label="地推活动" name="type" />-->
      <!--              <el-checkbox label="线下主题活动" name="type" />-->
      <!--              <el-checkbox label="单纯品牌曝光" name="type" />-->
      <!--            </el-checkbox-group>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="特殊资源">-->
      <!--            <el-radio-group v-model="form.resource">-->
      <!--              <el-radio label="线上品牌商赞助" />-->
      <!--              <el-radio label="线下场地免费" />-->
      <!--            </el-radio-group>-->
      <!--          </el-form-item>-->
      <!--          <el-form-item label="活动形式">-->
      <!--            <el-input v-model="form.desc" type="textarea" />-->
      <!--          </el-form-item>-->
      <!--          <el-form-item>-->
      <!--            <el-button type="primary" @click="onSubmit">立即创建</el-button>-->
      <!--            <el-button>取消</el-button>-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--      </el-col>-->
    </el-row>
  </div>
</template>

<script>

import {initTree, handleNodeClick, tree} from '@/composables/sys/permission/permission'

export default {
  name: 'Permission',
  setup() {
    // 初始化树
    initTree()
    return {
      tree,
      handleNodeClick
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
