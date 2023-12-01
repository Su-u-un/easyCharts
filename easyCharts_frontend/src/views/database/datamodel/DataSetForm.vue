<template>
<div class="wrap wrap-white padding-20">
  <div class="el-scrollbar__view">    
      <el-row :gutter="20" :v-loading="loading">
        <el-col :span="24">
           <el-row :gutter="20">
              <el-col :span="12"><h3>数据模型配置</h3></el-col>
               <el-col :span="12" style="text-align:right">
                  <el-button v-if="$route.query.method!='view'" type="primary" @click="doSubmit" size="small">保存数据模型</el-button>
                  <el-button type="info" size="small" @click="goBack">返回</el-button>
                </el-col>
           </el-row>
        </el-col>
        <el-col :span="12">
          <el-form size="small" :model="inputForm" ref="inputForm" :v-loading="loading" label-width="150px">
              <el-form-item label="目标数据库" prop="dataSource.id"
                  :rules="[
                    {required: true, message:'目标数据库不能为空', trigger:'blur'}
                  ]">
                select
            </el-form-item>
              <el-form-item label="模型名称" prop="name"
                  :rules="[
                    {required: true, message:'模型名称不能为空', trigger:'blur'}
                  ]">
                <el-input v-model="inputForm.name" placeholder="请填写模型名称"     ></el-input>
            </el-form-item>
              <el-form-item label="sql语句" prop="sqlCmd"
                  :rules="[
                    {required: true, message:'sql语句不能为空', trigger:'blur'}
                  ]">
                  编辑器
                <!-- <editor v-model="inputForm.sqlCmd" @init="editorInitSQL" lang="sql" height="200px" style="border: 1px solid #d9d9d9;"></editor> -->
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24">
          <h3>数据源列配置</h3>
           <el-table
            :data="columnForm.columnList"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="字段名"
              >
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
              >
            </el-table-column>
            <el-table-column
              prop="label"
              label="标签">
              <template #default="scope">
                <el-input v-model="scope.row.label"></el-input>
              </template>
            </el-table-column>
             <el-table-column>
                 <template #header>
                    <el-checkbox v-model="columnForm.isNeedAll" :indeterminate="isIndeterminate"  @change="handleCheckAllChange">参与分析</el-checkbox>
                </template>
                <template #default="scope">
                     <el-checkbox v-model="scope.row.isNeed" @change="handleCheckedNeedChange"></el-checkbox>
                </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
</div>
</div>
</template>

<script>
  import omit from 'lodash.omit'
  import dataSetService from '@/api/database/dataSetService'
  import {ElInput,ElMenu,ElMessage,ElOption,ElSelect,ElAside,ElMenuItem,ElSubMenu,ElButton,ElHeader,ElCard,ElCol,ElTableColumn,ElTable,ElRow,ElCheckbox,ElMain,ElForm,ElFormItem,ElAlert,ElDialog,ElContainer,ElTabPane,ElTabs} from 'element-plus'

  export default {
    data () {
      return {
        title: '',
        method: '',
        loading: false,
        previewVisible: false,
        isIndeterminate: false,
        inputForm: {
          id: '',
          dataSource: {
            id: ''
          },
          name: '',
          sqlCmd: ''
        },
        paramForm: {
          tableData: []
        },
        previewData: {
          column: [],
          html: '',
          json: [],
          json_str: '',
          xml: ''
        },
        columnForm: {
          isNeedAll: true,
          columnList: []
        }
      }
    },
    created () {
      // this.$refs['inputForm'].resetFields()
      this.paramForm.tableData = []
      this.columnForm.columnList = []
      this.inputForm.id = this.$route.query.id
      if (this.inputForm.id) {
        dataSetService.queryById(this.inputForm.id).then(({data}) => {
          this.inputForm = this.recover(this.inputForm, data)
          this.columnForm.columnList = data.columnList
          this.paramForm.tableData = data.params
        })
      }
    },
    components: {
      ElMessage,
      ElInput,
      ElMenu,ElOption,ElSelect,ElAside,ElMenuItem,ElSubMenu,ElButton,ElHeader,ElCard,ElCol,ElTableColumn,ElTable,ElRow,ElCheckbox,ElMain,ElForm,ElFormItem,ElAlert,ElDialog,ElContainer,ElTabPane,ElTabs
    },
    methods: {
      deleteRow (index, rows) {
        rows.splice(index, 1)
      },
      addRow () {
        this.paramForm.tableData.push({field: '', defaultValue: ''})
      },
      handleCheckAllChange (val) {
        this.columnForm.columnList.forEach((column) => {
          column.isNeed = val
        })
        this.columnForm.columnList = JSON.parse(JSON.stringify(this.columnForm.columnList))
        this.isIndeterminate = false
      },
      handleCheckedNeedChange (val) {
        let trueCount = 0
        let falseCount = 0
        this.columnForm.columnList.forEach((column) => {
          if (column.isNeed) {
            trueCount++
          } else {
            falseCount++
          }
        })
        this.isIndeterminate = trueCount > 0 && falseCount > 0
        this.columnForm.isNeedAll = trueCount > 0
      },
      editorInitXML: function () {
        require('brace/ext/language_tools') // language extension prerequsite...
        require('brace/mode/xml')
        require('brace/theme/twilight')
      },
      editorInitSQL: function () {
        require('brace/ext/language_tools') // language extension prerequsite...
        require('brace/mode/sql')
        require('brace/theme/chrome')
      },
      editorInitJSON: function () {
        require('brace/ext/language_tools') // language extension prerequsite...
        require('brace/mode/json')
        require('brace/theme/twilight')
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            let params = []
            let columnList = []
            this.paramForm.tableData.forEach((item, index) => {
              item.sort = index
              params.push(omit(item, 'id'))
            })
            this.columnForm.columnList.forEach((item, index) => {
              item.sort = index
              columnList.push(omit(item, 'id'))
            })
            dataSetService.save({
              ...this.inputForm,
              params: params,
              columnList: columnList

            }).then(({data}) => {
              this.loading = false
              this.goBack()
            }).catch(() => {
              this.loading = false
            })
          }
        }).catch(() => {
          this.loading = false
        })
      },
      goBack () {
        this.$store.dispatch('tagsView/delView', {fullPath: this.$route.fullPath})
        this.$router.push('/database/datamodel/DataSetList')
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  height: calc(100% - 30px);
  overflow: hidden !important;
  padding: 20px;
}
.wrap-white {
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  -webkit-transition: .3s;
  transition: .3s;
  border-radius: 4px;
}
</style>