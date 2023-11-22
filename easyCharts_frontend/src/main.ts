import { createApp } from 'vue'
import {createPinia} from 'pinia'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import App from './App.vue'
import router from './router'
import '@/assets/normal.css'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(VXETable)
app.use(router)
app.use(createPinia())

app.mount('#app')
