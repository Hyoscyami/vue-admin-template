<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="formInline" v-model="listQuery" :inline="true">
        <el-form-item label="字典值" prop="code">
          <el-input v-model="listQuery.code" placeholder="字典值" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="listQuery.description" placeholder="描述" />
        </el-form-item>
        <el-form-item label="状态" prop="enable">
          <el-select v-model="listQuery.status" placeholder="状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFormSubmit">查询</el-button>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="openAddDialog">
        新增
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
      />
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
        prop="status"
        label="状态"
      >
        <template #default="scope">
          {{ scope.row.status }}
          <el-switch :model-value="scope.row.status" :active-value="1" :inactive-value="0" />
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100"
      >
        <template #default="scope">
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :model-value="addDialogFormVisible" title="新增数据字典">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="码值" prop="code">
          <el-input v-model="addForm.code" autocomplete="off" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addForm.description" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input v-model="addForm.sort" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addForm.status">
            <el-radio v-model="addForm.status" :label="1">启用</el-radio>
            <el-radio v-model="addForm.status" :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelAddForm">取 消</el-button>
          <el-button type="primary" @click="addFormSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {add, getMaxSort, list} from '@/api/sys/dict'
import Pagination from '@/components/Pagination'

export default {
  name: 'Dict',
  components: { Pagination },
  data() {
    return {
      // 父数据字段表格数据
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        code: '',
        description: '',
        status: undefined
      },
      // 新增数据字典弹框
      addDialogFormVisible: false,
      // 新增数据字段表单
      addForm: {
        code: '',
        name: '',
        description: '',
        status: 1,
        sort: 1,
        parentId: 0
      },
      // 新增数据字典规则
      addFormRules: {
        code: [
          { required: true, message: '请输入码值', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入描述信息', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请填写排序值', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // 加载父数据字段列表
    this.getList()
  },
  methods: {
    // 搜索数据字典表单查询
    searchFormSubmit() {
      console.log('submit!')
    },
    handleClick(row) {
      console.log(row)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 打开新增数据字典对话框
    openAddDialog() {
      this.addDialogFormVisible = true
      this.getMaxSort()
    },
    // 获取当前最大排序值
    getMaxSort() {
      getMaxSort().then(response => {
        this.addForm.sort = response.data
      })
    },
    // 新增数据字典表单提交
    addFormSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          add(JSON.stringify(this.addForm)).then(response => {
            this.cancelAddForm()
          })
        } else {
          return false
        }
      })
    },
    // 新增数据字典表单取消
    cancelAddForm() {
      this.resetForm('addForm')
      this.addDialogFormVisible = false
    },
    // 获取父数据字段列表数据
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.tableData = response.data.records
        console.log('tableData', this.tableData)
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
