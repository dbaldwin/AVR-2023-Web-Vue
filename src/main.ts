import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import CommentsOverlay from './plugins/CommentsOverlay'

const app = createApp(App)
app.use(router)
app.use(CommentsOverlay)
app.mount('#app')
