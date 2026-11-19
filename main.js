
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './src/App.vue'
import router from './src/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
