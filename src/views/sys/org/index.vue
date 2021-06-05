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
            ref="treeRef"
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
          <el-form ref="searchFormRef" :model="table.listQuery" :inline="true">
            <el-form-item label="名称" prop="description">
              <el-input v-model="table.listQuery.name" placeholder="模糊查询名称" />
            </el-form-item>
            <el-form-item label="机构编号" prop="orgNo">
              <el-input v-model="table.listQuery.orgNo" placeholder="精确查询机构编号" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchFormSubmit">查询</el-button>
              <el-button @click="resetSearchForm">重置</el-button>
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
            prop="orgNo"
            label="机构编号"
          />
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="orgPath"
            label="所属组织"
          />
          <el-table-column
            prop="type"
            label="类型"
            :filters="table.typeSelect"
            :filter-method="filterTableType"
          />
          <el-table-column
            prop="status"
            label="状态"
            :filters="table.statusSelect"
            :filter-method="filterTableStatus"
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
                title="确定删除吗？"
                @confirm="delRow(scope.row)"
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
          <el-form ref="addFormRef" :model="dialog.addForm" :rules="dialog.addFormRules" label-width="80px">
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="dialog.addForm.name" autocomplete="off" tabindex="1" />
            </el-form-item>
            <!--            <el-form-item label="机构编号" prop="orgNo">-->
            <!--              <el-input v-model="dialog.addForm.orgNo" autocomplete="off" tabindex="2" />-->
            <!--            </el-form-item>-->
            <el-form-item label="机构类型" prop="type" tabindex="3">
              <el-select v-model="dialog.addForm.type" placeholder="请选择机构类型" clearable>
                <el-option v-for="item in table.typeSelect" :key="item.id" :label="item.text" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="排序值" prop="sort" tabindex="4">
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
import Pagination from '@/components/Pagination'
import {dictConvert} from '@/utils/common'
import {format} from '@/utils/time'
import {DictEnum} from '@/constants/dict'
import {
  addFormRef,
  addFormSubmit,
  cancelAddForm,
  cancelView,
  delRow,
  dialog, filterTableStatus, filterTableType,
  filterTree,
  getList,
  handleNodeClick,
  handleNodeCollapse,
  handleNodeExpand,
  init,
  loadNode,
  openAddDialog,
  resetSearchForm, searchFormRef,
  searchFormSubmit,
  table,
  tree, treeRef,
  updateDetail,
  updateStatus,
  viewDetail,
  viewNextPage
} from '@/composables/sys/org'
import {cellClass, headerClass} from '@/composables/sys/dict'
import {computed, watch} from 'vue'

export default {
  name: 'Org',
  components: {Pagination},
  setup() {
    // 初始化
    init()
    // 详情状态转换
    const viewDetailDataStatus = computed(() => {
      return dictConvert(DictEnum.DictStatus, dialog.viewDetailData.status)
    })
    // 日期转换
    const viewDetailDataCreateTime = computed(() => {
      return format(this.dialog.viewDetailData.createTime)
    })
    // 搜索树
    watch(() => tree.filterTreeText, (searchText) => filterTree(searchText))
    return {
      tree,
      table,
      dialog,
      treeRef,
      addFormRef,
      searchFormRef,
      viewDetailDataStatus,
      viewDetailDataCreateTime,
      viewDetail,
      openAddDialog,
      updateDetail,
      delRow,
      loadNode,
      handleNodeClick,
      handleNodeExpand,
      handleNodeCollapse,
      viewNextPage,
      searchFormSubmit,
      resetSearchForm,
      cellClass,
      headerClass,
      updateStatus,
      getList,
      cancelAddForm,
      addFormSubmit,
      cancelView,
      filterTableType,
      filterTableStatus
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
.tree-box {
  height: 1300px;
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

</style>
