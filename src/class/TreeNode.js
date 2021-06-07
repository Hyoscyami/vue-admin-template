export class TreeNode {
  id= undefined;
  name= undefined;
  parentId= undefined;
  isLeaf= false
}
export function getRootNode() {
  const rootNode = new TreeNode()
  rootNode.id = 1
  rootNode.name = '根节点'
  rootNode.parentId = 0
  rootNode.isLeaf = false
  return rootNode
}
