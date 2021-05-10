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
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-form ref="formInline" v-model="listQuery" :inline="true">
            <el-form-item label="字典值" prop="code" @keyup.enter.native="searchFormSubmit">
              <el-input v-model="listQuery.code" placeholder="字典值" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="listQuery.description" placeholder="描述" />
            </el-form-item>
            <el-form-item label="状态" prop="enable">
              <el-select v-model="listQuery.status" placeholder="状态">
                <el-option v-for="item in statusSelect" :key="item.id" :label="item.name" :value="item.value" />
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
              <el-switch :model-value="scope.row.status" :active-value="1" :inactive-value="0" @change="" />
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
          >
            <template #default="scope">
              <el-button type="text" size="small" @click="updateDetail(scope.row)">编辑</el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @confirm="del(scope.row)"
              >
                <template #reference>
                  <el-button type="text" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button type="text" size="small" @click="viewDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

        <el-dialog :model-value="addDialogFormVisible" :title="textMap[dialogStatus]" :before-close="cancelAddForm">
          <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
            <el-form-item label="码值" prop="code">
              <el-input v-model="addForm.code" autocomplete="off" />
            </el-form-item>
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="addForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="值" prop="value">
              <el-input v-model="addForm.value" autocomplete="off" />
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
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {add, del, getMaxSort, list, listChildrenByCode, listChildrenById} from '@/api/sys/dict'
import Pagination from '@/components/Pagination'
import {isBlank} from '@/utils/common'

export default {
  name: 'Dict',
  components: { Pagination },
  data() {
    return {
      // 过滤树的字段
      filterTreeText: '',
      // 树的属性重命名
      treeProps: {
        label: 'name',
        isLeaf: 'isLeaf'
      },
      // 根节点
      rootNode: {
        id: 0,
        name: '数据字典',
        parentId: 0,
        isLeaf: false
      },
      // 被选中节点
      checkedNode: {},
      // 子树的数据
      childrenTreeData: [],
      // 父数据字段表格数据
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        parentId: '',
        code: '',
        description: '',
        status: undefined
      },
      // 新增数据字典弹框
      addDialogFormVisible: false,
      // 新增或编辑数据字段对话框状态
      dialogStatus: '',
      // 新增或编辑数据字典弹框
      textMap: {
        update: '编辑',
        create: '新增'
      },
      // 新增数据字段表单
      addForm: {
        code: '',
        name: '',
        value: '',
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
          { required: true, message: '请输入字典名称', trigger: 'change' }
        ],
        value: [
          { required: true, message: '请输入值', trigger: 'change' }
        ],
        description: [
          { message: '请输入描述信息', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请填写排序值', trigger: 'change' }
        ]
      },
      // 状态选择器
      statusSelect: []
    }
  },
  created() {
    // 初始化状态
    this.listStatus()
  },
  methods: {
    // 搜索数据字典表单查询
    searchFormSubmit() {
      this.listQuery.page = 1
      this.getList()
    },
    // 查看详情
    viewDetail(row) {
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 打开新增数据字典对话框
    openAddDialog() {
      if (isBlank(this.checkedNode.id)) {
        this.$message({
          message: '请先在左侧选择节点',
          type: 'warning'
        })
        return false
      }
      this.addDialogFormVisible = true
      this.dialogStatus = 'create'
      this.getMaxSort(this.checkedNode.id)
      this.addForm.parentId = this.checkedNode.id
    },
    // 获取当前最大排序值
    getMaxSort(id) {
      getMaxSort(id).then(response => {
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
      this.addDialogFormVisible = false
      this.resetForm('addForm')
    },
    // 获取父数据字段列表数据
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.tableData = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 修改数据字典详情
    updateDetail(row) {
      this.dialogStatus = 'update'
      this.addDialogFormVisible = true
      Object.assign(this.addForm, row)
    },
    // 删除数据字典
    del(row) {
      del(row.id).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        // 刷新表格数据
        this.searchFormSubmit()
      })
    },
    /**
     * 加载子树数据的方法，仅当 lazy 属性为true 时生效
     * @param node 节点
     * @param resolve
     * @returns {*}
     */
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([this.rootNode])
      }
      if (node.level > 0) {
        await this.getChildrenNode(node.data.id)
        return resolve(this.childrenTreeData)
      }
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
     * 根据id获取直接子节点
     * @param id 当前节点id
     */
    async getChildrenNode(id) {
      await listChildrenById(id).then(response => {
        this.childrenTreeData = response.data
      })
    },
    // 节点被点击
    handleNodeClick(data) {
      // 保存被选择节点
      Object.assign(this.checkedNode, data)
      if (data.id !== 0) {
        this.listQuery.parentId = data.id
        // 刷新表格
        this.getList()
      }
    },
    // 获取状态下拉框
    listStatus() {
      listChildrenByCode('status').then(response => {
        this.statusSelect = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
