<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="tree.filterTreeText"
          placeholder="输入关键字进行过滤"
        />
        <div
          class="tree-box"
        >
          <el-tree
            ref="tree"
            :props="tree.treeProps"
            node-key="id"
            :load="loadNode"
            :default-expanded-keys="tree.defaultExpandedKeys"
            :expand-on-click-node="false"
            :highlight-current="true"
            lazy
            @node-click="handleNodeClick"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <el-space spacer="|">
                  <el-link v-if="data.hasNext" href="javascript:void(0);" @click.stop="viewNextPage(node)">下一页</el-link>
                </el-space>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-form ref="formInline" :model="table.listQuery" :inline="true">
            <el-form-item label="字典值" prop="code" @keyup.enter.native="searchFormSubmit">
              <el-input v-model="table.listQuery.code" placeholder="字典值" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="table.listQuery.description" placeholder="描述" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="table.listQuery.status" placeholder="状态" clearable>
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
          class="el-table"
          :cell-style="cellClass"
          :header-cell-style="headerClass"
          :data="table.tableData"
          style="width: 100%"
          border
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
          :limit.sync="table.listQuery.size"
          @pagination="getList"
        />
        <!--新增或编辑弹框-->
        <el-dialog
          :model-value="dialog.addDialogFormVisible"
          :title="dialog.textMap[dialog.dialogStatus]"
          :before-close="cancelAddForm"
        >
          <el-form ref="addForm" :model="dialog.addForm" :rules="dialog.addFormRules" label-width="80px">
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="dialog.addForm.name" autocomplete="off" tabindex="1" />
            </el-form-item>
            <el-form-item label="码值" prop="code">
              <el-input v-model="dialog.addForm.code" autocomplete="off" tabindex="2" />
            </el-form-item>
            <el-form-item label="值" prop="value">
              <el-input v-model="dialog.addForm.value" autocomplete="off" tabindex="3" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="dialog.addForm.description" autocomplete="off" tabindex="4" />
            </el-form-item>
            <el-form-item label="排序值" prop="sort">
              <el-input v-model="dialog.addForm.sort" autocomplete="off" tabindex="5" />
            </el-form-item>
            <el-form-item label="状态" prop="status" tabindex="6">
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
import {DictEnum} from '@/constants/dict'
import {CommonEnum} from '@/constants/common'

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
        // 单击被选中节点，给右侧表格列表查询使用，默认是根节点，因为mounted里会初始化表格，而tree初始化这个字段在初始化表格之后
        checkedNodeClick: {
          id: 0
        },
        // 点击下拉图标选中的节点，给树滚动加载使用
        checkedNodeDropdown: {},
        // 当前被点击节点懒加载子树的数据
        loadChildrenTreeData: [],
        // 最开始默认展开的node对应的keys
        defaultExpandedKeys: [],
        // tree分页查询对象
        listQuery: {
          page: 1,
          size: 100,
          name: '',
          isSearch: false,
          parentId: undefined,
          code: '',
          description: '',
          status: undefined
        },
        // 树查询结果返回节点的总数
        total: 0
      },
      // 表格
      table: {
        // 父数据字段表格数据
        tableData: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          size: 20,
          parentId: undefined,
          isSearch: true,
          name: '',
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
            {message: '请输入值', trigger: 'change'}
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
      return dictConvert(DictEnum.DictStatus, this.dialog.viewDetailData.status)
    },
    // 日期转换
    viewDetailDataCreateTime: function() {
      return format(this.dialog.viewDetailData.createTime)
    }
  },
  watch: {
    // 搜索权限树的时候联动过滤名称符合的树
    'tree.filterTreeText'(searchText) {
      this.filterTree(searchText)
    }
  },
  mounted() {
    // 初始化状态
    this.listStatus()
    // 初始化表格
    this.searchFormSubmit()
  },
  methods: {
    // 搜索tree
    filterTree(searchText) {
      // 重置树的搜索条件
      this.resetTreeQuery()
      if (isBlank(searchText)) {
        this.tree.listQuery.parentId = this.tree.rootNode.id
      }
      this.tree.listQuery.name = searchText
      this.tree.listQuery.isSearch = true
      list(this.tree.listQuery).then(response => {
        this.tree.total = response.data.total
        this.$refs.tree.updateKeyChildren(this.tree.rootNode.id, response.data.records)
      })
    },
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
      this.dialog.dialogStatus = CommonEnum.create
      this.getMaxSort(this.tree.checkedNodeClick.id)
      this.dialog.addForm.parentId = this.tree.checkedNodeClick.id
    },
    // 获取当前最大排序值
    getMaxSort(id) {
      getMaxSort(id).then(response => {
        this.dialog.addForm.sort = response.data + 1
      })
    },
    // 新增数据字典表单提交
    addFormSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.dialog.dialogStatus === CommonEnum.create) {
            add(JSON.stringify(this.dialog.addForm)).then(response => {
              // 关闭弹框
              this.cancelAddForm()
              // 刷新表格
              this.getList()
              // 刷新树
              this.filterTree()
            })
          } else if (this.dialog.dialogStatus === CommonEnum.update) {
            update(JSON.stringify(this.dialog.addForm)).then(response => {
              // 关闭弹框
              this.cancelAddForm()
              // 刷新表格
              this.getList()
              // 刷新树
              this.filterTree()
            })
          }
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
      this.table.listQuery.parentId = this.tree.checkedNodeClick.id
      list(this.table.listQuery).then(response => {
        this.table.tableData = response.data.records
        this.table.total = response.data.total
        this.table.listLoading = false
      })
    },
    // 修改数据字典详情
    updateDetail(row) {
      this.dialog.dialogStatus = CommonEnum.update
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
      this.tree.checkedNodeDropdown = node
      if (node.level === 0) {
        // 最开始的时候，默认根节点被选中
        // 默认展开第二级
        this.$nextTick(() => {
          const rootNode = node.childNodes[0]
          rootNode.expanded = true
          // 默认选中根节点
          this.$refs.tree.setCurrentKey(rootNode.id, true)
          Object.assign(this.tree.checkedNodeClick, node)
        }).then(r => node.childNodes[0].loadData())
        return resolve([this.tree.rootNode])
      }
      if (node.level > 0) {
        await this.getChildrenNode(node.data.id)
        return resolve(this.tree.loadChildrenTreeData)
      }
    },
    // 清除node的子节点查看下一页的标识
    clearHasNext(node) {
      const childNodes = node.parent.childNodes
      // 取消之前下一页的链接
      const lastNode = this.$refs.tree.getNode(childNodes[childNodes.length - 1].data.id)
      lastNode.data.hasNext = false
    },
    // 加载下一页的数据
    loadNextPageData() {
      this.tree.listQuery.page = this.tree.listQuery.page + 1
      this.tree.listQuery.parentId = this.tree.checkedNodeDropdown.data.id
      list(this.tree.listQuery).then(response => {
        this.tree.total = response.data.total
        // 数据不为空
        if (isNotEmptyCollection(response.data.records)) {
          // 追加树节点
          this.tree.loadChildrenTreeData = response.data.records
          this.tree.loadChildrenTreeData.forEach(node => {
            this.$refs.tree.append(node, this.tree.checkedNodeDropdown)
          })
          // 设置最后一个节点是否有下一页链接
          this.setHasNext()
        }
      })
    },
    /**
     * 根据id获取直接子节点
     * @param id 当前节点id
     */
    async getChildrenNode(id) {
      // 重置查询条件
      this.resetTreeQuery()
      this.tree.listQuery.parentId = id
      await list(this.tree.listQuery).then(response => {
        this.tree.loadChildrenTreeData = response.data.records
        this.tree.total = response.data.total
        // 设置最后一个节点是否有下一页链接
        this.setHasNext()
      })
    },
    // 设置最后一个节点是否有下一页链接
    setHasNext() {
      if (isNotEmptyCollection(this.tree.loadChildrenTreeData)) {
        const lastNode = this.tree.loadChildrenTreeData[this.tree.loadChildrenTreeData.length - 1]
        lastNode.hasNext = this.tree.listQuery.page * this.tree.listQuery.size < this.tree.total
      }
    },
    // 节点被点击
    handleNodeClick(data, node) {
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
      listChildrenByCode(DictEnum.DictStatus).then(response => {
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
      update(param).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        data.status = param.status
      })
    },
    // 点击下一页
    viewNextPage(clickedNode) {
      this.loadNextPageData()
      // 清除之前的下一页超链接
      this.clearHasNext(clickedNode)
      this.tree.loadChildrenTreeData.forEach(node => {
        this.$refs.tree.append(node, clickedNode.parent)
      })
    },
    // 重置树的搜索条件
    resetTreeQuery() {
      this.tree.listQuery.page = 1
      this.tree.listQuery.parentId = undefined
      this.tree.listQuery.code = ''
      this.tree.listQuery.description = ''
      this.tree.listQuery.status = undefined
      this.tree.listQuery.isSearch = false
      this.tree.listQuery.name = ''
      this.tree.total = 0
    },
    // 单元格样式
    cellClass() {
      return {borderColor: '#0e2231'}
    },
    // 表头样式
    headerClass() {
      return {borderColor: '#0e2231', background: '#b1b3b8', color: '#151617'}
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
.el-table{
  border: #0e2231 solid 1px;
}
</style>
