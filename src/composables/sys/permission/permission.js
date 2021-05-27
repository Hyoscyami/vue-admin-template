import {reactive} from 'vue'
import {getTree} from '@/api/sys/permission'
// 树相关
export const tree = reactive({
  // 搜索树的名称
  filterTreeText: '',
  // 树的数据，全量数据
  data: [],
  props: {
    label: 'name',
    isLeaf: 'isLeaf'
  }
})
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
