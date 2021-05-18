// 搜索tree
import {isBlank} from '@/utils/common'
import {list, listChildrenByCode} from '@/api/sys/dict'
import {unref} from 'vue'
import {DictEnum} from '@/constants/dict'

// 重置树的搜索条件
const resetTreeQuery = (tree) => {
  tree.listQuery.page = 1
  tree.listQuery.parentId = undefined
  tree.listQuery.code = ''
  tree.listQuery.description = ''
  tree.listQuery.status = undefined
  tree.listQuery.isSearch = false
  tree.listQuery.name = ''
  tree.total = 0
}

export function useFilterTree(tree, treeRef) {
  const filterTree = () => {
    // 重置树的搜索条件
    resetTreeQuery(tree)
    if (isBlank(unref(tree.searchText))) {
      tree.listQuery.parentId = unref(tree.rootNode.id)
    }
    tree.listQuery.name = unref(tree.searchText)
    tree.listQuery.isSearch = true
    list(this.tree.listQuery).then(response => {
      tree.total = response.data.total
      treeRef.updateKeyChildren(unref(tree.rootNode.id), response.data.records)
    })
  }
  return {filterTree}
}
// 重置树的搜索条件
export function useResetTreeQuery(tree) {
  return () => { resetTreeQuery(tree) }
}
// 获取状态下拉框
export function useListStatus(table) {
  const listStatus = () => {
    listChildrenByCode(DictEnum.DictStatus).then(response => {
      table.statusSelect = response.data
    })
  }
  return {listStatus}
}
// 获取父数据字段列表数据
export function useGetList(table, tree) {
  const getList = () => {
    table.listLoading = true
    table.listQuery.parentId = unref(tree.checkedNodeClick.id)
    list(table.listQuery).then(response => {
      table.tableData = response.data.records
      table.total = response.data.total
      table.listLoading = false
    })
  }
  // 搜索数据字典表单查询
  const searchFormSubmit = () => {
    table.listQuery.page = 1
    // 获取父数据字段列表数据
    getList()
  }
  return {getList, searchFormSubmit}
}
// 查看详情
export function useViewDetail(dialog, row) {
  const viewDetail = () => {
    dialog.viewDialogVisible = true
    Object.assign(this.dialog.viewDetailData, unref(row))
  }
  return {viewDetail}
}
