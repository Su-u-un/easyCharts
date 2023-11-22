<template>
  <div class="top">
    <div>logo</div>
    <div class="info">
      <el-dropdown>
        <h3 style="color: rgb(245, 247, 250)">
          欢迎使用，{{username}}
        </h3>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="updatePWD = true">修改密码</el-dropdown-item>
            <el-dropdown-item @click="quit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog
      v-model="updatePWD"
      title="修改密码"
      width="30%"
      @close="canel(formRef)"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        autocomplete=”off”  
      >
        <el-form-item label="新的密码" prop="newPWD">
          <el-input
            type="password"
            placeholder="请输入新密码"
            v-model="form.newPWD"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="reNewPWD">
          <el-input
            type="password"
            placeholder="请确认密码"
            v-model="form.reNewPWD"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="canel">取消</el-button>
          <el-button type="primary" @click="update">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ElForm,ElFormItem,ElInput,ElButton,ElMessage,ElDropdown,ElDropdownMenu,ElDropdownItem,ElDialog} from 'element-plus'
import {useUserStore} from '@/store/user.js';
import authService from '@/api/auth/authService'
import {clearToken} from '@/utils/cookies.js'
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useRouter} from 'vue-router'

const userStore = useUserStore()
const {username} = storeToRefs(userStore)
const router = useRouter()

const updatePWD = ref(false)
const formRef = ref()



const checkPwd = (rule, value, callback) => {
        if (form.value.reNewPWD && value !== form.value.reNewPWD) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
const checkRePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== form.value.newPWD) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }

// 修改密码表单
const form = ref({
  newPWD:'',
  reNewPWD:''
})

// 表单校验
const rules = ref({
  newPWD:[
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 5, message: '密码最少5位数', trigger: 'blur' },
    {validator:checkPwd,trigger: 'blur'},
  ],
  reNewPWD:[
    {required: true,message:'请确认密码', trigger: 'blur',},
    {validator:checkRePwd,trigger: 'blur'},
  ],
})


// 取消修改按钮
const canel = (e)=>{
  if (!e) return
  e.resetFields()
}

// 确定修改按钮
const update = ()=>{
  formRef.value.validate().then(valid=>{
    if(valid){
      authService.updatePWD({'username':username.value,'password':form.value.newPWD}).then(res=>{
        if(res.code === "0"){
          ElMessage({
              message: "修改成功，请返回登录",
              type: 'success',
          })
          clearToken()
          router.push({path: '/login'})
          updatePWD.value = false
        }else{
          ElMessage({
              message: res.error,
              type: 'error',
          })
        }
      })
      formRef.value.resetFields()
    }else ElMessage({
                message: "error",
                type: 'error',
            })
  })
}

// 退出登录
const quit = ()=>{
  clearToken()
  router.push({path: '/login'})
}
</script>


<style lang="scss" scoped>
.top{
  display:flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 67px;
  background-color: rgb(64, 158, 255);
}
.info{
  margin-right:30px;
}
.el-dropdown:focus-visible {
  outline: unset;
}
h3:focus-visible {
  outline: unset;
}
</style>