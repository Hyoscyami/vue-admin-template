export class Table {
  // 表格数据
  tableData = [];
  // 总数
  total = 0;
  // 加载状态
  listLoading = true;
  // 查询条件
  listQuery = {
    page: 1,
    size: 20,
    parentId: undefined,
    types: [],
    name: '',
    code: '',
    description: '',
    status: undefined
  };
  // 状态选择器
  statusSelect = []
}
