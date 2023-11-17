import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: import('../views/main.vue'),
      children:[
        {
          path:'/echarts',
          name:'echarts',
          component: import('../views/echarts/index.vue')
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component: import('../views/login/index.vue')
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if (to.path==='/login')
    return next();
  //获取token
  const tokenStr= ''
  if(!tokenStr)
    return next('/login')
  next()
})

export default router
