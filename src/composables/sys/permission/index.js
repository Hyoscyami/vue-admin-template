import {reactive} from 'vue'
import {getTree, update} from '@/api/sys/permission'
import {successMsg, warningMsg} from '@/utils/common'
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
  // 可选权限类型，下拉框使用
  typeSelect: [],
  // 可选组件，下拉框使用
  componentSelect: [],
  // 图标可选，下拉框使用
  iconSelect: [],
  // 状态可选。下拉框使用
  statusSelect: []
})
export function initType() {

}
// 被选择的节点
export const checkedNode = reactive({
  id: undefined,
  parentId: undefined,
  name: '',
  type: undefined,
  path: '',
  component: '',
  icon: '',
  hidden: false,
  sort: undefined,
  status: undefined
})
// 初始化树
export function initTree() {
  getTree().then(response => {
    tree.data = response.data
  })
}
// 节点被点击
export function handleNodeClick(node) {
  Object.assign(checkedNode, node)
  console.log('我被打印了:', checkedNode)
}
// 保存被选择的节点
export function save() {
  if (checkedNode.id === undefined) {
    warningMsg('请先在左侧点击权限进行选择')
    return
  }
  update(checkedNode).then(response => {
    successMsg('编辑成功')
  })
}
