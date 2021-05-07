<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="字典值" prop="code">
          <el-input v-model="formInline.code" placeholder="字典值" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formInline.description" placeholder="描述" />
        </el-form-item>
        <el-form-item label="状态" prop="enable">
          <el-select v-model="formInline.enable" placeholder="状态">
            <el-option label="启用" value="true" />
            <el-option label="禁用" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="code"
        label="码值"
        width="180"
      />
      <el-table-column
        prop="value"
        label="值"
        width="180"
      />
      <el-table-column
        prop="description"
        label="描述"
      />
      <el-table-column
        prop="enable"
        label="状态"
        :formatter="enableFormat"
      />
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template #default="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Dict',
  data() {
    return {
      tableData: [{
        code: '2016-05-02',
        value: '王小虎',
        description: '上海市普陀区金沙江路 1518 弄',
        enable: true
      }, {
        code: '2016-05-04',
        value: '王小虎',
        description: '上海市普陀区金沙江路 1517 弄',
        enable: false
      }, {
        code: '2016-05-01',
        value: '王小虎',
        description: '上海市普陀区金沙江路 1519 弄',
        enable: true
      }, {
        code: '2016-05-03',
        value: '王小虎',
        description: '上海市普陀区金沙江路 1516 弄',
        enable: true
      }],
      formInline: {
        code: '',
        description: '',
        enable: undefined
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleClick(row) {
      console.log(row)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 格式换数据字典状态
    enableFormat(row, column) {
      if (row.enable) {
        return '已启用'
      }
      return '已禁用'
    }
  }
}
</script>

<style scoped>

</style>
