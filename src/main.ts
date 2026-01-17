import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/index.css'
import { useDark } from '@vueuse/core'

// Initialize dark mode with localStorage persistence, default to dark
useDark({
  storageKey: 'theme',
  valueDark: 'dark',
  initialValue: 'dark', // Default to dark mode
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
