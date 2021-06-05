import {reactive, ref} from 'vue'
import {add, getMaxSort, getTree, update} from '@/api/sys/permission'
import {isNotEmptyCollection, successMsg, warningMsg} from '@/utils/common'
import {listChildrenByCode} from '@/api/sys/dict'
import {DictEnum} from '@/constants/dict'
import {CommonEnum} from '@/constants/common'
import {toRaw} from '@vue/reactivity'
import {resetQuery} from '@/composables/sys/dict'
// 树相关
export const tree = reactive({
  // 搜索树的名称
  filterTreeText: '',
  // 树的数据，全量数据
  data: [],
  props: {
    label: 'name',
    isLeaf: 'isLeaf'
  },
  // 默认展开key
  defaultExpandedKeys: [],
  // 可选权限类型，下拉框使用
  typeSelect: [],
  // 可选组件，下拉框使用
  componentSelect: [],
  // 图标可选，下拉框使用
  iconSelect: [],
  // 状态可选。下拉框使用
  statusSelect: [],
  // 表单状态
  formStatus: '',
  // tree分页查询对象
  listQuery: {
    page: 1,
    size: 100,
    name: '',
    parentId: undefined,
    code: '',
    description: '',
    status: undefined,
    minDistance: 1,
    maxDistance: undefined
  },
  // 根节点
  rootNode: {
    id: 1,
    name: '菜单',
    parentId: 0,
    isLeaf: false
  }
})

// 被单击选择的节点
export const checkedNode = {
  id: undefined,
  parentId: undefined,
  name: '',
  type: '',
  path: '',
  component: '',
  icon: '',
  hidden: false,
  sort: '',
  status: ''
}
// 表单对应对象
export const form = reactive({
  id: undefined,
  parentId: undefined,
  name: '',
  type: '',
  path: '',
  component: '',
  icon: '',
  hidden: false,
  sort: '',
  status: ''
})
// 重置表单
function resetForm() {
  form.id = undefined
  form.parentId = undefined
  form.name = ''
  form.type = ''
  form.path = ''
  form.component = ''
  form.icon = ''
  form.hidden = false
  form.sort = ''
  form.status = ''
}
// 新增和编辑表单规则
export const rules = {
  name: [
    {required: true, message: '请输入权限名称', trigger: 'change'}
  ],
  type: [
    {required: true, message: '请选择权限类型', trigger: 'change'}
  ],
  path: [
    {required: true, message: '请输入路径', trigger: 'change'}
  ],
  status: [
    {required: true, message: '请选择状态', trigger: 'change'}
  ]
}
// treeRef
export const treeRef = ref(null)
// formRef
export const formRef = ref(null)
// 初始化树
export function initTree() {
  // 重置树查询条件
  resetQuery(tree)
  tree.listQuery.minDistance = 0
  tree.listQuery.parentId = toRaw(tree).rootNode.id
  getTree(tree.listQuery).then(response => {
    tree.data = response.data
    if (isNotEmptyCollection(tree.data)) {
      tree.defaultExpandedKeys.push(tree.data[0].id)
    }
  })
}

// 节点被点击
export function handleNodeClick(node) {
  Object.assign(checkedNode, node)
  Object.assign(form, node)
  tree.formStatus = CommonEnum.update
}

// 初始化statusSelect
export function initStatusSelect() {
  listChildrenByCode(DictEnum.DictStatus).then(response => {
    tree.statusSelect = response.data
  })
}

// 初始化权限类型
export function initTypeSelect() {
  listChildrenByCode(DictEnum.PermissionTypes).then(response => {
    tree.typeSelect = response.data
  })
}

// 初始化权限图标
export function initIconSelect() {
  listChildrenByCode(DictEnum.PermissionIcon).then(response => {
    tree.iconSelect = response.data
  })
}

// 保存被选择的节点
export function save() {
  if (!canSubmit()) {
    return
  }
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('tree.formStatus', tree)
      if (CommonEnum.create === tree.formStatus) {
        add(form).then(response => {
          successMsg('新增成功')
          treeRef.value.append(response.data, checkedNode)
        })
      } else if (CommonEnum.update === tree.formStatus) {
        update(form).then(response => {
          successMsg('编辑成功')
          const node = treeRef.value.getNode(checkedNode.id)
          Object.assign(node.data, form)
        })
      }
    } else {
      return false
    }
  })
}
// 是否能提交表单
function canSubmit() {
  if (checkedNode.id === undefined) {
    warningMsg('请先在左侧点击权限进行选择')
    return false
  }
  return true
}
// 初始化
export function init() {
  // 初始化树
  initTree()
  // 初始化status
  initStatusSelect()
  // 初始化权限类型
  initTypeSelect()
  // 初始化权限图标
  initIconSelect()
}

// 点击新增
export function handleAddClick() {
  tree.formStatus = CommonEnum.create
  if (!canSubmit()) {
    return
  }
  // 重置表单
  resetForm()
  form.parentId = checkedNode.id
  form.path = checkedNode.path
  form.status = 1
  getMaxSort(checkedNode.id).then(response => {
    form.sort = response.data + 1
  })
}

// 点击编辑
export function handleEditClick() {
  form.status = CommonEnum.update
  if (!canSubmit()) {
    return
  }
  Object.assign(form, checkedNode)
}
// 搜索tree
export function filterTree(searchText) {
  console.log('搜索:', searchText)
  treeRef.value.filter(searchText)
  // // 重置树的搜索条件
  // resetTreeQuery(tree)
  // tree.listQuery.minDistance = 0
  // if (searchText) {
  //   tree.listQuery.maxDistance = 1
  // }
  // tree.listQuery.parentId = toRaw(tree).rootNode.id
  // tree.listQuery.name = searchText
  // getTree(tree.listQuery).then(response => {
  //   if (response.data) {
  //     // 有数据返回，更新到根节点下，并去除返回的根节点
  //     treeRef.value.updateKeyChildren(toRaw(tree).rootNode.id, response.data[0].children || [])
  //   } else {
  //     treeRef.value.updateKeyChildren(toRaw(tree).rootNode.id, [])
  //   }
  // })
}
// 过滤节点，全量加载树的时候用
export function filterNode(value, data) {
  if (!value) return true
  return data.name.indexOf(value) !== -1
}
