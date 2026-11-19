import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/home.vue'
import About from '../views/about.vue'
import Services from '../views/services.vue'
import Gallery from '../views/gallery.vue'
import Contact from '../views/contact.vue'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import Admissions from '../views/admissions.vue'
import Admin from '../views/admin.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/services', component: Services },
  { path: '/gallery', component: Gallery },
  { path: '/contact', component: Contact },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admissions', component: Admissions },
  {
    path: '/admin',
    component: Admin,
    beforeEnter: () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        return localStorage.getItem('token') && user?.role === 'admin'
          ? true
          : '/login'
      } catch {
        return '/login'
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router