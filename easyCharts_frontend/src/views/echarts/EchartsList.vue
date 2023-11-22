<template>
  <div class="page">
    <el-form size="small" :inline="true"  class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
         <el-form-item prop="name">
           <el-input size="small" v-model="searchForm.name" placeholder="组件名称" clearable></el-input>
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
            <el-button type="primary" size="small" @click="toDataSet()">数据模型管理</el-button>
            <el-button type="warning" size="small" @click="edit()" :disabled="$refs.echartsTable && $refs.echartsTable.getCheckboxRecords().length !== 1">修改</el-button>
            <el-button type="danger"   size="small" @click="del()" :disabled="$refs.echartsTable && $refs.echartsTable.getCheckboxRecords().length === 0">删除</el-button>
          </template>
        </vxe-toolbar>
        <div >
          <vxe-table
            border="inner"
            auto-resize
            resizable
            :loading="loading"
            size="small"
            ref="echartsTable"
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
            <vxe-column  title="组件名称" field="name" sortable>
                <template slot-scope="scope">
                    <el-link  type="primary" :underline="false" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
                </template>
            </vxe-column>
            <vxe-column  title="数据模型" field="dataSet.name" sortable> </vxe-column>
            <vxe-column  title="备注信息" field="remarks" sortable></vxe-column>
            <vxe-column title="操作" width="250px" fixed="right" align="center">
                <template  slot-scope="scope">
                  <el-button type="text"  icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text"  size="small" icon="el-icon-edit" @click="edit(scope.row.id)">修改</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text"  size="small" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="text"  icon="el-icon-view" size="small" @click="generate(scope.row)">预览</el-button>
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
    </div>
    <EchartsForm @refreshDataList="refreshList" ref="echartsForm"/>
    <!-- <div>GenMenuForm占位</div> -->
  </div>
</template>

<script>
  import EchartsForm from './EchartsForm'
  import echartsService from '@/api/echarts/echartsService'
  import {ElInput, ElButton,ElForm,ElFormItem,ElLink,ElDivider} from 'element-plus'
  export default {
    data () {
      return {
        searchForm: {
          name: ''
        },
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        loading: false
      }
    },
    components: {
      EchartsForm,
      ElInput, ElButton,ElForm,ElFormItem
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        console.log("youde");
        echartsService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          ...this.searchForm
        }).then(({data}) => {
          this.dataList = data.records
          this.tablePage.total = data.total
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
        this.$refs.echartsForm.init('add', '')
      },
      // 新增数据源
      toDataSet () {
        this.$router.push('/database/datamodel/DataSetList')
      },
      // 修改
      edit (id) {
        id = id || this.$refs.echartsTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.echartsForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.echartsForm.init('view', id)
      },
      // 预览
      generate (row) {
        this.$router.push(`/echarts/GenerateChart?id=${row.id}&title=${row.name}`)
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.echartsTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          echartsService.delete(ids).then(({data}) => {
            this.loading = false
            this.$message.success({dangerouslyUseHTMLString: true, message: data})
            this.refreshList()
          })
        }).catch(() => {
          this.loading = false
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>

<style lang="scss">
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