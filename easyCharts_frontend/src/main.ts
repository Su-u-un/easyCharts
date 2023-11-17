import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/normal.css'
import 'element-plus/dist/index.css'
import '@/assets/scss/index.scss'

const app = createApp(App)

app.use(router)

app.mount('#app')
