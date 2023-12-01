import { createApp } from 'vue'
import {createPinia} from 'pinia'
import VueClipboard from 'vue-clipboard2'
import lodash from 'lodash/object'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import App from './App.vue'
import router from './router'
import '@/assets/normal.css'
import 'element-plus/dist/index.css'
import utils from '@/utils'
import dictUtils from '@/utils/dictUtils'

const app = createApp(App)

VueClipboard.config.autoSetContainer = true

app.config.globalProperties.recover = utils.recover
app.config.globalProperties.lodash = lodash
app.config.globalProperties.$dictUtils = dictUtils

app.use(VXETable)
app.use(router)
app.use(createPinia())
app.use(VueClipboard)

app.mount('#app')
