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
import Portal from '../views/portal.vue'
import SchoolInfo from '../views/schoolInfo.vue'

function requireAccount() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return localStorage.getItem('token') && user
      ? true
      : '/login'
  } catch {
    return '/login'
  }
}

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About, beforeEnter: requireAccount },
  { path: '/services', component: Services, beforeEnter: requireAccount },
  { path: '/gallery', component: Gallery, beforeEnter: requireAccount },
  { path: '/contact', component: Contact, beforeEnter: requireAccount },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/admissions', component: Admissions, beforeEnter: requireAccount },
  { path: '/portal', component: Portal, beforeEnter: requireAccount },
  { path: '/announcements', component: SchoolInfo, beforeEnter: requireAccount, meta: { type: 'announcements' } },
  { path: '/calendar', component: SchoolInfo, beforeEnter: requireAccount, meta: { type: 'calendar' } },
  { path: '/teachers', component: SchoolInfo, beforeEnter: requireAccount, meta: { type: 'teachers' } },
  { path: '/parents', component: SchoolInfo, beforeEnter: requireAccount, meta: { type: 'parents' } },
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