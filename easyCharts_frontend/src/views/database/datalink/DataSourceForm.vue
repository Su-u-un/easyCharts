<template>
  <el-dialog
    :title="title"
    center
    :close-on-click-modal="false"
    v-model="visible">
    <el-form size="small" :model="inputForm" ref="inputForm" @keyup.enter.native="doSubmit()"
             label-width="120px" 
             element-loading-text="正在测试数据库连接"
             :class="method==='view'?'readonly':''" :disabled="method==='view'"
             :v-loading="loading" @submit.native.prevent>
    <el-row :gutter="15">
        <el-col :span="12">
            <el-form-item label="连接名称" prop="name" :rules="[{required: true, message:'连接名称不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.name" maxlength="50" placeholder=""></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="连接英文名" prop="en_name" :rules="[{required: true, message:'连接英文名不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.en_name" maxlength="50" placeholder=""></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="数据库类型" prop="type" :rules="[{required: true, message:'数据库类型不能为空', trigger:'blur'}]">
              <el-select v-model="inputForm.type" placeholder="请选择来源"  style="width: 100%;">
                <el-option
                  v-for="item in $dictUtils.getDictList('db_type')"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="主机地址" prop="host" :rules="[{required: true, message:'主机地址不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.host" maxlength="50" placeholder=""></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="端口" prop="port" :rules="[{required: true, message:'端口不能为空', trigger:'blur'}]">
              <el-input v-model.number="inputForm.port" type="number" maxlength="50" placeholder=""></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="数据库名" prop="database_name" :rules="[{required: true, message:'数据库名不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.database_name" maxlength="50" placeholder=""></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="数据库用户名" prop="username" :rules="[{required: true, message:'数据库用户名不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.username" maxlength="50" placeholder=""></el-input>
            </el-form-item>
        </el-col>
         <el-col :span="12">
            <el-form-item label="数据库密码" prop="password" :rules="[{required: true, message:'数据库密码名不能为空', trigger:'blur'}]">
              <el-input v-model="inputForm.password" maxlength="50" placeholder=""></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="is_enable">
            <el-switch v-model="inputForm.is_enable">
            </el-switch>
          </el-form-item>
        </el-col>
    </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" v-if="method != 'view'" type="primary" @click="testDbLink()">测试连接</el-button>
      <el-button size="small" v-if="method != 'view'" @click="doSubmit()">确定</el-button>
      <el-button size="small" @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dataSourceService from '@/api/database/dataSourceService'
import {ElSwitch,ElInput,ElMenu,ElMessage,ElOption,ElSelect,ElAside,ElMenuItem,ElSubMenu,ElButton,ElHeader,ElCard,ElCol,ElTableColumn,ElTable,ElRow,ElCheckbox,ElMain,ElForm,ElFormItem,ElAlert,ElDialog,ElContainer,ElTabPane,ElTabs} from 'element-plus'


export default {
  data () {
    return {
      visible: false,
      loading: false,
      method: '',
      title: '',
      
      inputForm: {
        id: '',
        name: '',
        en_name: '',
        type: '',
        host: '',
        port: '',
        database_name: '',
        username: '',
        password: '',
        is_enable: true
      }
    }
  },
  components: {
    ElInput,ElSwitch,
    ElMenu,ElOption,ElSelect,ElAside,ElMenuItem,ElSubMenu,ElButton,ElHeader,ElCard,ElCol,ElTableColumn,ElTable,ElRow,ElCheckbox,ElMain,ElForm,ElFormItem,ElAlert,ElDialog,ElContainer,ElTabPane,ElTabs
  },
  methods: {
    init (method, id) {
      this.method = method
      this.inputForm.id = id
      if (method === 'add') {
        this.title = `新建数据库连接`
      } else if (method === 'edit') {
        this.title = '修改数据库连接'
      } else if (method === 'view') {
        this.title = '查看数据库连接'
      }
      this.visible = true
      this.$nextTick(() => {
        // this.$refs.inputForm.resetFields()
        if (method === 'edit' || method === 'view') { // 修改或者查看
          dataSourceService.queryById(this.inputForm.id).then(res => {
            this.inputForm = this.recover(this.inputForm, res.data[0])
          })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        }
      })
    },

    testDbLink () {
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          dataSourceService.test(this.inputForm).then(({data}) => {
            ElMessage({
                message:'连接成功',
                type: 'success',
            })
            this.loading = false
          }).catch(() => {
            ElMessage({
                message:'连接失败',
                type: 'error',
            })
            this.loading = false
          })
        }
      })
    },
      // 表单提交
    doSubmit () {
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          console.log(this.inputForm)
          dataSourceService.save(this.inputForm).then(({msg}) => {
            this.loading = false
            this.visible = false
            ElMessage({
                message:msg,
                type: 'success',
            })
            this.$emit('refreshDataList')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
