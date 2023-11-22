<template>
    <div class="login_container">
        <div class="login_box">
            <!--登录界面-->
            <el-form
                class="login_form"
                label-width="80px"
                :model="loginForm"
                :rules="formRules"
                ref="loginRef"
                autocomplete=”off”
                v-show="turn">
                <!--用户名-->
                <el-form-item label="用户名" prop="username">
                    <el-input
                        placeholder="请输入用户名"
                        v-model="loginForm.username"
                    />
                </el-form-item>
                <!--密码-->
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="loginForm.password"
                        show-password
                    />
                <el-form-item label="验证码" prop="code">
                    <el-image @click="getCaptcha" :src="captchaImg" style="height:34px"></el-image>
                </el-form-item>
                </el-form-item>
                <el-form-item class="login_btn">
                    <el-button :loading="loading"  type="primary" @click="handleLogin()">登录</el-button>
                    <el-button type="info" @click="resetForm(loginRef)">清空</el-button>
                </el-form-item>
            </el-form>

            <!--注册界面-->
            <el-form
                class="register_form"
                label-width="80px"
                :model="registerForm"
                :rules="formRules"
                ref="registerRef"
                autocomplete=”off”
                v-show="!turn">
                <el-form-item  label="用户名" prop="username">
                    <el-input
                        placeholder="用户名"
                        v-model="registerForm.username"
                    />
                </el-form-item>
                <el-form-item  label="密码" prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="registerForm.password"
                        show-password
                    />
                </el-form-item>
                <el-form-item label="确认密码" prop="re_password">
                    <el-input
                        type="password"
                        placeholder="确认密码"
                        v-model="registerForm.re_password"
                        show-password
                    />
                </el-form-item>
                <el-form-item class="login_btn">
                    <el-button :loading="loading"  type="primary" @click="handleRegister()">注册</el-button>
                    <el-button type="info" @click="resetForm(registerRef)">清空</el-button>
                </el-form-item>
            </el-form>
            <!--切换登录注册-->
            <div>
                <div v-show="turn">
                    没有账户，<button @click="turnForm">立即注册</button>
                </div>
                <div v-show="!turn">
                    已有账户，<button @click="turnForm">立即登录</button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import {ElForm,ElFormItem,ElInput,ElButton,ElMessage,ElImage} from 'element-plus'
import {ref,onMounted} from 'vue'
import {useRouter} from 'vue-router'
import loginService from '@/api/auth/authService'
import {setToken} from '@/utils/cookies'

onMounted(() => {
  getCaptcha()
})

//登录中
let loading = ref(false)
//表单切换
let turn = ref(true)
const loginRef = ref()
const registerRef = ref()

const router = useRouter()

const checkPwd = (rule, value, callback) => {
        if (registerForm.value.re_password && value !== registerForm.value.re_password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
const checkRePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== registerForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
//登录表单
const loginForm = ref({
          username:'',
          password:'',
          uuid:'',
          code:''
        })
//注册表单
const registerForm = ref({
          username:'',
          password:'',
          re_password:''
        })
//表单校验
const formRules = ref({
          username:[
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 5, message: '用户名最少5位数', trigger: 'blur' }
          ],
          password:[
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 5, message: '密码最少5位数', trigger: 'blur' },
            {validator:checkPwd,trigger: 'blur'},
          ],
          re_password:[
            {required: true,message:'请确认密码', trigger: 'blur',},
            {validator:checkRePwd,trigger: 'blur'},
          ],
        //   imageCode:[
        //     {required:true,message:'请输入验证码',trigger:'change'},
        //     {len:4,message:'请输入正确的验证码'}
        //   ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        })
//切换表单
const turnForm = ()=>{
    turn.value = !turn.value
}
// 重置表单
const resetForm = (e)=>{
    e.resetFields()
}
//登录按钮
const handleLogin = ()=>{
    loginRef.value.validate(valid=>{
        if(valid){
            loading.value = true
            loginService.login(loginForm.value).then(res=>{
              if (res.code === "0") {
                setToken(res.data)
                router.push({path: '/',});
                ElMessage({
                    message: "登录成功!",
                    type: 'success',
                })
              }
              else
                ElMessage({
                    message: "账号或密码错误!",
                    type: 'error',
                })
              loading.value = false
            }).catch(err=>{
              loading.value = false
            })            
        }
        else {
            ElMessage({
                message: "error!",
                type: 'error'
            })
            return false
        }
    })
}
//注册按钮
const handleRegister = ()=>{
    registerRef.value.validate(valid=>{
        if(valid){
            loginService.register(registerForm.value).then(res=>{
                if(res.code === "0") {
                    ElMessage({
                        message: "注册成功，请返回登录",
                        type: 'success',
                    })
                    //切换界面
                    turn = !this.turn
                    //重置表单
                    resetForm(registerRef)
                }
                else{
                    ElMessage({
                        message: res.error,
                        type: 'error',
                    })
                    //切换界面
                    turn.value = !turn.value
                    //重置表单
                    resetForm(registerRef)
                }
            }).catch(err=>{
                console.log(err);
            })
        }
        //报错说明表单校验错误，有的框框不对
        else ElMessage({
                message: "error",
                type: 'error',
            })
    })
}
// 获取验证码
const getCaptcha = ()=>{
    loginService.getCode().then(({data}) => {
        const captchaImg = ref('data:image/gif;base64,' + data.codeImg)
        loginForm.value.uuid = data.uuid
    })
}
</script>
  
<style scoped>
.login_container{
    background-color: #2f3c4c;
    height:100%
}
.login_box{
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    background-color: white;
    border-radius: 4px;
    height:300px;
    width:500px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
}
.login_btn{
    display: flex;
    justify-content: flex-end;/*靠右*/
}
.login_form{
    position: absolute;
    bottom:55px;
    left: 65px;
    width:350px;
}
.register_form{
    position: absolute;
    bottom:50px;
    left: 65px;
    width:350px;
}
</style>
