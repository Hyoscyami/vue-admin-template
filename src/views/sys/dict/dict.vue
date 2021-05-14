<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="tree.filterTreeText"
          placeholder="输入关键字进行过滤"
        />
        <div
          v-infinite-scroll="scrollTreeData"
          :infinite-scroll-disabled="tree.scrollTreeDisable"
          :infinite-scroll-immediate="false"
          class="tree-box"
        >
          <el-tree
            ref="tree"
            :props="tree.treeProps"
            node-key="id"
            :load="loadNode"
            :default-expanded-keys="tree.defaultExpandedKeys"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :highlight-current="true"
            lazy
            @node-click="handleNodeClick"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
          />
        </div>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-form ref="formInline" v-model="table.listQuery" :inline="true">
            <el-form-item label="字典值" prop="code" @keyup.enter.native="searchFormSubmit">
              <el-input v-model="table.listQuery.code" placeholder="字典值" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="table.listQuery.description" placeholder="描述" />
            </el-form-item>
            <el-form-item label="状态" prop="enable">
              <el-select v-model="table.listQuery.status" placeholder="状态">
                <el-option v-for="item in table.statusSelect" :key="item.id" :label="item.name" :value="item.value" />
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
          v-loading="table.listLoading"
          :data="table.tableData"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="code"
            label="码值"
          />
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="value"
            label="值"
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
              <el-switch
                :model-value="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="updateStatus(scope.row)"
              />
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

        <pagination
          v-show="table.total>0"
          :total="table.total"
          :page.sync="table.listQuery.page"
          :limit.sync="table.listQuery.limit"
          @pagination="getList"
        />
        <!--新增或编辑弹框-->
        <el-dialog
          :model-value="dialog.addDialogFormVisible"
          :title="dialog.textMap[dialog.dialogStatus]"
          :before-close="cancelAddForm"
        >
          <el-form ref="addForm" :model="dialog.addForm" :rules="dialog.addFormRules" label-width="80px">
            <el-form-item label="码值" prop="code">
              <el-input v-model="dialog.addForm.code" autocomplete="off" />
            </el-form-item>
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="dialog.addForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="值" prop="value">
              <el-input v-model="dialog.addForm.value" autocomplete="off" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="dialog.addForm.description" autocomplete="off" />
            </el-form-item>
            <el-form-item label="排序值" prop="sort">
              <el-input v-model="dialog.addForm.sort" autocomplete="off" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="dialog.addForm.status">
                <el-radio v-model="dialog.addForm.status" :label="1">启用</el-radio>
                <el-radio v-model="dialog.addForm.status" :label="0">禁用</el-radio>
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
        <!--查看详情弹框-->
        <el-dialog
          :model-value="dialog.viewDialogVisible"
          title="详情"
          :before-close="cancelView"
        >
          <el-descriptions title="字典">
            <el-descriptions-item label="码值">
              <el-tag size="small">{{ dialog.viewDetailData.code }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="名称">
              <el-tag size="small">{{ dialog.viewDetailData.name }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="值">
              <el-tag size="small">{{ dialog.viewDetailData.value }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="描述">
              <el-tag size="small">{{ dialog.viewDetailData.description }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag size="small">{{ viewDetailDataStatus }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="排序值">
              <el-tag size="small">{{ dialog.viewDetailData.sort }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              <el-tag size="small">{{ viewDetailDataCreateTime }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建人">
              <el-tag size="small">{{ dialog.viewDetailData.creatorName }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="修改时间">
              <el-tag size="small">{{ dialog.viewDetailData.modifyTime }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="修改人">
              <el-tag size="small">{{ dialog.viewDetailData.modifierName }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancelView">关闭</el-button>
            </span>
          </template>
        </el-dialog>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {add, del, getMaxSort, list, listChildrenByCode, update} from '@/api/sys/dict'
import Pagination from '@/components/Pagination'
import {dictConvert, isBlank, isNotEmptyCollection} from '@/utils/common'
import {format} from '@/utils/time'

export default {
  name: 'Dict',
  components: {Pagination},
  data() {
    return {
      // 树相关
      tree: {
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
        // 单击被选中节点，给右侧表格列表查询使用
        checkedNodeClick: {},
        // 点击下拉图标选中的节点，给树使用
        checkedNodeDropdown: {},
        // 子树的数据
        childrenTreeData: [],
        // 最开始默认展开的node对应的keys
        defaultExpandedKeys: [],
        // tree分页查询对象
        listQuery: {
          page: 1,
          limit: 20,
          parentId: '',
          code: '',
          description: '',
          status: undefined
        },
        // 树查询结果返回节点的总数
        total: 0,
        // 是否能下拉加载数据
        scrollTreeDisable: false
      },
      // 表格
      table: {
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
        // 状态选择器
        statusSelect: []
      },
      // 对话框
      dialog: {
        // 新增数据字典弹框
        addDialogFormVisible: false,
        // 查看详情对话框
        viewDialogVisible: false,
        // 查看详情的数据
        viewDetailData: {
          code: '',
          name: '',
          value: '',
          description: '',
          status: undefined,
          sort: 1,
          createTime: '',
          creatorName: '',
          modifyTime: '',
          modifierName: ''
        },
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
            {required: true, message: '请输入码值', trigger: 'blur'},
            {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入字典名称', trigger: 'change'}
          ],
          value: [
            {required: true, message: '请输入值', trigger: 'change'}
          ],
          description: [
            {message: '请输入描述信息', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ],
          sort: [
            {required: true, message: '请填写排序值', trigger: 'change'}
          ]
        }
      }
    }
  },
  computed: {
    // 状态转换
    viewDetailDataStatus: function() {
      return dictConvert('status', this.dialog.viewDetailData.status)
    },
    // 日期转换
    viewDetailDataCreateTime: function() {
      return format(this.dialog.viewDetailData.createTime)
    }
  },
  watch: {
    // 搜索权限树的时候联动过滤名称符合的树
    'tree.filterTreeText'(val) {
      this.$refs.tree.filter(val)
    },
    // total改变了 ，计算是否能继续滚动加载树
    'tree.total'(val) {
      // 小于总数，启用滚动
      this.tree.scrollTreeDisable = this.tree.listQuery.page * this.tree.listQuery.limit >= this.tree.total
      console.log('监听到total改变，scrollTreeDisable', this.tree.scrollTreeDisable)
    }
  },
  created() {
    // 初始化状态
    this.listStatus()
    // 初始化表格
    this.searchFormSubmit()
  },
  methods: {
    // 搜索数据字典表单查询
    searchFormSubmit() {
      this.table.listQuery.page = 1
      this.getList()
    },
    // 查看详情
    viewDetail(row) {
      this.dialog.viewDialogVisible = true
      Object.assign(this.dialog.viewDetailData, row)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 打开新增数据字典对话框
    openAddDialog() {
      if (isBlank(this.tree.checkedNodeClick.id)) {
        this.$message({
          message: '请先在左侧选择节点',
          type: 'warning'
        })
        return false
      }
      this.dialog.addDialogFormVisible = true
      this.dialog.dialogStatus = 'create'
      this.getMaxSort(this.tree.checkedNodeClick.id)
      this.dialog.addForm.parentId = this.tree.checkedNodeClick.id
    },
    // 获取当前最大排序值
    getMaxSort(id) {
      getMaxSort(id).then(response => {
        this.dialog.addForm.sort = response.data
      })
    },
    // 新增数据字典表单提交
    addFormSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          add(JSON.stringify(this.dialog.addForm)).then(response => {
            this.cancelAddForm()
          })
        } else {
          return false
        }
      })
    },
    // 新增数据字典表单取消
    cancelAddForm() {
      this.dialog.addDialogFormVisible = false
      this.resetForm('addForm')
    },
    // 查看详情字典弹框取消
    cancelView() {
      this.dialog.viewDialogVisible = false
    },
    // 获取父数据字段列表数据
    getList() {
      this.table.listLoading = true
      list(this.table.listQuery).then(response => {
        this.table.tableData = response.data.records
        this.table.total = response.data.total
        this.table.listLoading = false
      })
    },
    // 修改数据字典详情
    updateDetail(row) {
      this.dialog.dialogStatus = 'update'
      this.dialog.addDialogFormVisible = true
      Object.assign(this.dialog.addForm, row)
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
      Object.assign(this.tree.checkedNodeDropdown, node)
      if (node.level === 0) {
        // 最开始的时候，默认根节点被选中
        console.log('node.level===0,node:', node)
        console.log('根节点加载，this.tree.checkedNode', this.tree.checkedNodeDropdown)
        return resolve([this.tree.rootNode])
      }
      if (node.level > 0) {
        await this.getChildrenNode(node.data.id)
        console.log('node.level>0,node:', node)
        return resolve(this.tree.childrenTreeData)
      }
    },
    // 滚动下拉树的数据
    scrollTreeData() {
      console.log('下拉加载,this.tree', this.tree)
      this.tree.listQuery.page = this.tree.listQuery.page + 1
      this.tree.listQuery.parentId = this.tree.checkedNodeDropdown.data.id
      list(this.tree.listQuery).then(response => {
        this.tree.total = response.data.total
        // 数据不为空，且滚动框未禁用
        if (isNotEmptyCollection(response.data.records) && !this.tree.scrollTreeDisable) {
          // 追加树节点
          response.data.records.forEach(node => {
            this.$refs['tree'].append(node, this.tree.checkedNodeDropdown)
          })
        }
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
     * 根据id获取直接子节点
     * @param id 当前节点id
     */
    async getChildrenNode(id) {
      this.tree.listQuery.parentId = id
      await list(this.tree.listQuery).then(response => {
        this.tree.childrenTreeData = response.data.records
        this.tree.total = response.data.total
      })
    },
    // 节点被点击
    handleNodeClick(data) {
      // 保存被选择节点
      Object.assign(this.tree.checkedNodeClick, data)
      this.table.listQuery.parentId = data.id
      // 刷新表格
      this.getList()
    },
    // 节点被展开
    handleNodeExpand(data) {
      // 保存被选择节点
      Object.assign(this.tree.checkedNodeDropdown, data)
    },
    // 节点被关闭
    handleNodeCollapse(data) {
      // 保存被选择节点，此时传当前被关闭的节点的父节点，因为当前节点被关闭，有下拉分页的需求最多是当前节点的父节点
      Object.assign(this.tree.checkedNodeDropdown, data.parent)
    },
    // 获取状态下拉框
    listStatus() {
      listChildrenByCode('status').then(response => {
        this.table.statusSelect = response.data
      })
    },
    // 更新状态
    updateStatus(data) {
      if (!data.id) {
        return
      }
      const param = {}
      Object.assign(param, data)
      if (param.status === 1) {
        param.status = 0
      } else {
        param.status = 1
      }
      console.log('param:', param)
      update(param).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        data.status = param.status
      })
    }
  }
}
</script>

<style scoped>
.tree-box {
  height: 800px;
  overflow: auto;
}
</style>
