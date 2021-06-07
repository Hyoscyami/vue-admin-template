import {getRootNode} from '@/class/TreeNode'
import {Query} from '@/class/Query'

export class Tree {
  // 过滤树的字段
  filterTreeText = '';
  // 树的属性重命名
  treeProps = {
    label: 'name',
    isLeaf: 'isLeaf'
  };
  // 根节点
  rootNode = getRootNode();
  // 单击被选中节点，给右侧表格列表查询使用，默认是根节点，因为mounted里会初始化表格，而tree初始化这个字段在初始化表格之后
  checkedNodeClick = getRootNode();
  // 点击下拉图标选中的节点，给树滚动加载使用
  checkedNodeDropdown = {};
  // 当前被点击节点懒加载子树的数据
  loadChildrenTreeData = [];
  // 最开始默认展开的node对应的keys
  defaultExpandedKeys = [];
  // tree分页查询对象
  listQuery = new Query();
  // 树查询结果返回节点的总数
  total = 0
}
