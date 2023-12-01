<template>
  <div class="page">
     <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item prop="name">
          <el-input size="small" v-model="searchForm.name" placeholder="连接名称" clearable></el-input>
         </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
      </el-form>
    <div class="bg-white top">
      <vxe-toolbar :refresh="{query: refreshList}" export print custom>
        <template #buttons>
          <el-button type="primary" size="small" @click="add()">新建</el-button>
          <el-button type="warning" size="small" @click="edit()"
          :disabled="$refs.dataSourceTable && $refs.dataSourceTable.getCheckboxRecords().length !== 1"  plain>修改</el-button>
          <el-button type="danger"   size="small" @click="del()"
                   :disabled="$refs.dataSourceTable && $refs.dataSourceTable.getCheckboxRecords().length === 0" plain>删除
          </el-button>
        </template>
      </vxe-toolbar>
     <div style="height: calc(100% - 85px);">
        <vxe-table
            border="inner"
            auto-resize
            resizable
            height="auto"
            :loading="loading"
            size="small"
            ref="dataSourceTable"
            show-header-overflow
            show-overflow
            highlight-hover-row
            :menu-config="{}"
            :print-config="{}"
            :import-config="{}"
            :export-config="{}"
            @sort-change="sortChangeHandle"
            :sort-config="{remote:true}"
            :data="dataList"
            :checkbox-config="{}">
            <vxe-column type="seq" width="40"></vxe-column>
            <vxe-column type="checkbox"  width="40px"></vxe-column>
            <vxe-column field="name" title="连接名"></vxe-column>
            <vxe-column field="en_name" title="连接英文名"></vxe-column>
            <vxe-column field="type" title="数据库类型">
              <template #default="scope">
                    {{ $dictUtils.getDictLabel("db_type", scope.row.type, '-') }}
                </template>
            </vxe-column>
            <vxe-column field="host" title="主机地址"></vxe-column>
            <vxe-column field="port" title="端口"></vxe-column>
            <vxe-column field="database_name" title="数据库名"></vxe-column>
            <vxe-column field="is_enable" title="是否启用"> 
              <template #default="scope">
                <el-tag size="small" v-if="scope.row.is_enable" >
                  是
                </el-tag>
                <el-tag v-else  size="small" type="danger">
                  否
                </el-tag>
              </template>
            </vxe-column>
            <vxe-column
                fixed="right"
                width="200px"
                title="操作">
                <template #default="scope">
                  <el-button link size="small" @click="view(scope.row.id)">查看</el-button>
                  <el-button link  size="small" @click="edit(scope.row.id)">修改</el-button>
                  <el-button link  size="small" @click="del(scope.row.id)">删除</el-button>
                </template>
            </vxe-column>
        </vxe-table>
        <vxe-pager
          background
          size="small"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.total"
          :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="currentChangeHandle">
        </vxe-pager>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <data-source-form  ref="dataSourceForm" @refreshDataList="refreshList"></data-source-form>
  </div>
  </div>
</template>

<script>
  import DataSourceForm from './DataSourceForm'
  import dataSourceService from '@/api/database/dataSourceService'
  import {ElTag,ElInput, ElButton,ElForm,ElFormItem,ElLink,ElDivider,ElTableColumn,ElTable,ElDialog} from 'element-plus'

  export default {
    data () {
      return {
        searchForm: {
          name: ''
        },
        filterText: '',
        dataList: [],
        officeTreeData: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        loading: false,
        selectOfficeName: ''
      }
    },
    components: {
      DataSourceForm,
      ElTag,
      ElLink,
      ElInput, 
      ElButton,
      ElForm,
      ElFormItem,
      ElDivider,
      ElTableColumn,ElTable,ElDialog
    },
    created () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        dataSourceService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          ...this.searchForm
        }).then((res) => {
          this.dataList = res.records
          this.tablePage.total = res.total
          this.loading = false
        })
      },
      // 当前页
      currentChangeHandle ({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.refreshList()
      },
      // 排序
      sortChangeHandle (column) {
        this.tablePage.orders = []
        if (column.order != null) {
          this.tablePage.orders.push({column: this.$utils.toLine(column.property), asc: column.order === 'asc'})
        }
        this.refreshList()
      },
      // 新增
      add () {
        this.$refs.dataSourceForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.$refs.dataSourceTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.dataSourceForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.dataSourceForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.dataSourceTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          dataSourceService.delete(ids).then(({msg}) => {
            ElMessage({
              type: 'success',
              message: msg
            })
            this.refreshList()
          })
        }).catch(({error}) => {
          ElMessage({
              type: 'error',
              message: error
            })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>

<style lang="scss" scoped>
.page{
  height: 100%;
    .top{
      height: calc(100% - 70px);
      padding: 10px;
      background-color: #ffffff;
    }
}
.query-form {
  padding-top: 15px;
  background-color: #ffffff;
  padding-left: 15px;
  margin-bottom: 10px;
}
</style>