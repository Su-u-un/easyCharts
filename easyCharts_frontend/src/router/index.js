import { createRouter, createWebHistory } from 'vue-router'
import {setToken,getToken} from '@/utils/cookies'
import {useUserStore} from '@/store/user.js'
import authService from '@/api/auth/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      redirect:'/echartsList',
      component: ()=>import('../views/main.vue'),
      children:[
        {
          path:'/EchartsList',
          name:'echartsList',
          component: ()=>import('../views/echarts/EchartsList.vue')
        },
        // 数据集详情
        {
          path:'/DataSetList',
          name:'dataSetList',
          component: ()=>import('../views/database/datamodel/DataSetList.vue')
        },
        // 数据集管理
        {
          path:'/DataSetForm',
          name:'dataSetForm',
          component: ()=>import('../views/database/datamodel/DataSetForm.vue')
        },
        // 数据源管理
        {
          path:'/DataSourceList',
          name:'dataSourceList',
          component: ()=>import('../views/database/datalink/DataSourceList.vue')
        },
        // 数据库管理
        {
          path:'/DataTable',
          name:'dataTable',
          component: ()=>import('../views/database/datatable/Table.vue')
        },
        // 创建表
        {
          path:'/DataTableForm',
          name:'dataTableForm',
          component: ()=>import('../views/database/datatable/TableForm.vue')
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component: ()=>import('../views/login/index.vue')
    }
  ]
})



router.beforeEach((to,from,next)=>{
  if (to.path==='/login')
    return next();
  //获取token
  const hasToken = getToken()
  if(hasToken) {
    const userStore = useUserStore()
    authService.info().then(res=>{
      // token过期
      if(res.code === '-1'){
        next({name: 'login'})
      }
      // 没过期继续进入
      else if(res.code === '0'){
        userStore.setUsername(res.data.username)
        next()
      }
      // 有错误直接报错
      else{
        console.log(res);
      }
    })
    next()
  }
  next({name: 'login'})
})

export default router
