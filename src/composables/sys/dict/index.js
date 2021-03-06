import {nextTick, reactive, ref} from 'vue'
import {dictConvert, isBlank, isNotEmptyCollection, successMsg, warningMsg} from '@/utils/common'
import {DictEnum} from '@/constants/dict'
import {add, del, getMaxSort, list, listChildrenByCode, update} from '@/api/sys/dict'
import {CommonEnum} from '@/constants/common'
import {toRaw} from '@vue/reactivity'
import {Tree} from '@/class/Tree'
import {Table} from '@/class/Table'

// 初始化树的对象
const initTree = new Tree()
initTree.rootNode.name = '数据字典'
// 初始化表格的对象
const initTable = new Table()

// 树相关
export const tree = reactive(initTree
)
// 父数据字典表格数据
export const table = reactive(initTable)
// 对话框
export const dialog = reactive({
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
})
// 树ref
export const treeRef = ref(null)
// 对话框新增数据字典表单ref
export const addFormRef = ref(null)
// 搜索表格的搜索表单
export const searchFormRef = ref(null)
// 初始化
export function init() {
// 初始化状态
  listStatus()
  // 初始化表格
  searchFormSubmit()
}

// 状态转换
export function viewDetailDataStatus() {
  return dictConvert(DictEnum.DictStatus, dialog.viewDetailData.status)
}

// 获取状态下拉框
export function listStatus() {
  listChildrenByCode(DictEnum.DictStatus).then(response => {
    table.statusSelect = response.data
  })
}

// 搜索数据字典表单查询
export function searchFormSubmit() {
  table.listQuery.page = 1
  getList()
}

// 搜索tree
export function filterTree(searchText) {
  // 重置树的搜索条件
  resetQuery(tree)
  if (isBlank(searchText)) {
    tree.listQuery.maxDistance = 1
  }
  tree.listQuery.parentId = toRaw(tree).rootNode.id
  tree.listQuery.name = searchText
  list(tree.listQuery).then(response => {
    tree.total = response.data.total
    treeRef.value.updateKeyChildren(toRaw(tree).rootNode.id, response.data.records)
  })
}

// 打开新增数据字典对话框
export function openAddDialog() {
  if (isBlank(tree.checkedNodeClick.id)) {
    warningMsg('请先在左侧选择节点')
    return false
  }
  dialog.addDialogFormVisible = true
  dialog.dialogStatus = CommonEnum.create
  getMaxSortValue(tree.checkedNodeClick.id)
  dialog.addForm.parentId = toRaw(tree).checkedNodeClick.id
  dialog.addForm.code = toRaw(tree).checkedNodeClick.code
}

// 查看详情
export function viewDetail(row) {
  dialog.viewDialogVisible = true
  Object.assign(dialog.viewDetailData, row)
}

// 获取当前最大排序值
export function getMaxSortValue(id) {
  getMaxSort(id).then(response => {
    dialog.addForm.sort = response.data + 1
  })
}
// 新增数据字典表单提交
export function addFormSubmit() {
  addFormRef.value.validate((valid) => {
    if (valid) {
      if (dialog.dialogStatus === CommonEnum.create) {
        add(JSON.stringify(dialog.addForm)).then(response => {
          // 关闭弹框
          cancelAddForm()
          // 刷新表格
          getList()
          // 刷新树
          console.log('刷新树:', response.data, tree.checkedNodeClick)
          treeRef.value.append(response.data, tree.checkedNodeClick)
        })
      } else if (dialog.dialogStatus === CommonEnum.update) {
        update(JSON.stringify(dialog.addForm)).then(response => {
          // 关闭弹框
          cancelAddForm()
          // 刷新表格
          getList()
          // 刷新树
          filterTree()
        })
      }
    } else {
      return false
    }
  })
}
// 新增数据字典表单取消
export function cancelAddForm() {
  dialog.addDialogFormVisible = false
  addFormRef.value.resetFields()
}
// 查看详情字典弹框取消
export function cancelView() {
  dialog.viewDialogVisible = false
}
// 获取父数据字典列表数据
export function getList() {
  table.listLoading = true
  table.listQuery.parentId = toRaw(tree).checkedNodeClick.id
  list(table.listQuery).then(response => {
    table.tableData = response.data.records
    table.total = response.data.total
    table.listLoading = false
  })
}
// 修改数据字典详情
export function updateDetail(row) {
  dialog.dialogStatus = CommonEnum.update
  dialog.addDialogFormVisible = true
  Object.assign(dialog.addForm, row)
}
// 删除数据字典
export function delRow(row) {
  del(row.id).then(response => {
    successMsg('操作成功')
    // 刷新表格数据
    searchFormSubmit()
  })
}
/**
 * 加载子树数据的方法，仅当 lazy 属性为true 时生效
 * @param node 节点
 * @param resolve
 * @returns {*}
 */
export async function loadNode(node, resolve) {
  tree.checkedNodeDropdown = node
  if (node.level === 0) {
    // 最开始的时候，默认根节点被选中
    // 默认展开第二级
    nextTick(() => {
      const rootNode = node.childNodes[0]
      rootNode.expanded = true
      // 默认选中根节点
      treeRef.value.setCurrentKey(rootNode.id, true)
      Object.assign(tree.checkedNodeClick, rootNode)
    }).then(r => node.childNodes[0].loadData())
    return resolve([tree.rootNode])
  }
  if (node.level > 0) {
    await getChildrenNode(node.data.id)
    return resolve(tree.loadChildrenTreeData)
  }
}
// 清除node的子节点查看下一页的标识
export function clearHasNext(node) {
  const childNodes = node.parent.childNodes
  // 取消之前下一页的链接
  const lastNode = treeRef.value.getNode(childNodes[childNodes.length - 1].data.id)
  lastNode.data.hasNext = false
}
// 加载下一页的数据
export function loadNextPageData() {
  tree.listQuery.page = tree.listQuery.page + 1
  tree.listQuery.parentId = toRaw(tree).chec
  Object.assign(tree.listQuery.parentId, tree.checkedNodeDropdown.data.id)
  tree.listQuery.minDistance = 1
  tree.listQuery.maxDistance = 1
  list(tree.listQuery).then(response => {
    tree.total = response.data.total
    // 数据不为空
    if (isNotEmptyCollection(response.data.records)) {
      // 追加树节点
      tree.loadChildrenTreeData = response.data.records
      tree.loadChildrenTreeData.forEach(node => {
        tree.value.append(node, tree.checkedNodeDropdown)
      })
      // 设置最后一个节点是否有下一页链接
      setHasNext()
    }
  })
}
/**
 * 根据id获取直接子节点
 * @param id 当前节点id
 */
export async function getChildrenNode(id) {
  // 重置查询条件
  resetQuery(tree)
  tree.listQuery.parentId = id
  tree.listQuery.minDistance = 1
  tree.listQuery.maxDistance = 1
  await list(tree.listQuery).then(response => {
    tree.loadChildrenTreeData = response.data.records
    tree.total = response.data.total
    // 设置最后一个节点是否有下一页链接
    setHasNext()
  })
}
// 设置最后一个节点是否有下一页链接
export function setHasNext() {
  if (isNotEmptyCollection(tree.loadChildrenTreeData)) {
    const lastNode = tree.loadChildrenTreeData[tree.loadChildrenTreeData.length - 1]
    lastNode.hasNext = tree.listQuery.page * tree.listQuery.size < tree.total
  }
}
// 节点被点击
export function handleNodeClick(data, node) {
  // 保存被选择节点
  tree.checkedNodeClick = data
  table.listQuery.parentId = data.id
  // 刷新表格
  getList()
}
// 节点被展开
export function handleNodeExpand(data) {
  // 保存被选择节点
  Object.assign(tree.checkedNodeDropdown, data)
}
// 节点被关闭
export function handleNodeCollapse(data) {
  // 保存被选择节点，此时传当前被关闭的节点的父节点，因为当前节点被关闭，有下拉分页的需求最多是当前节点的父节点
  Object.assign(tree.checkedNodeDropdown, data.parent)
}
// 更新状态
export function updateStatus(data) {
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
    successMsg('操作成功')
    data.status = param.status
  })
}
// 点击下一页
export function viewNextPage(clickedNode) {
  // 加载下一页的数据
  loadNextPageData()
  // 清除之前的下一页超链接
  clearHasNext(clickedNode)
}
// 重置树的搜索条件
export function resetQuery(tree) {
  tree.listQuery.page = 1
  tree.listQuery.parentId = undefined
  tree.listQuery.code = ''
  tree.listQuery.description = ''
  tree.listQuery.status = undefined
  tree.listQuery.name = ''
  tree.total = 0
  tree.listQuery.minDistance = 1
  tree.listQuery.maxDistance = undefined
}
// 表格的搜索表单重置
export function resetSearchForm() {
  searchFormRef.value.resetFields()
}
// 单元格样式
export function cellClass() {
  return {borderColor: '#0e2231'}
}
// 表头样式
export function headerClass() {
  return {borderColor: '#0e2231', background: '#b1b3b8', color: '#151617'}
}
