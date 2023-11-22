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
      redirect:'/EchartsList',
      component: ()=>import('../views/main.vue'),
      children:[
        {
          path:'/EchartsList',
          name:'echartsList',
          component: ()=>import('../views/echarts/EchartsList.vue')
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
      if(res.code === '-1'){
        next({name: 'login'})
      }
      else if(res.code === '0'){
        userStore.setUsername(res.data.username)
        next()
      }
      else{
        console.log(res);
      }
    })
    next()
  }
  next({name: 'login'})
})

export default router
