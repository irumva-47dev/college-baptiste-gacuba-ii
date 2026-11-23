
<template>
  <nav class="navbar">
    <!-- SCHOOL LOGO / NAME -->
    <router-link to="/" class="logo">
      <img
        class="logo-icon"
        src="/college-baptiste-gacuba-ii-logo.png"
        alt="College Baptiste Gacuba II"
      />
      <div class="logo-text">
        <span>{{ content.schoolLine1 }}</span>
        <strong>{{ content.schoolLine2 }}</strong>
      </div>
    </router-link>

    <!-- MOBILE MENU BUTTON -->
    <button
      class="menu-toggle"
      @click="menuOpen = !menuOpen"
      :aria-expanded="menuOpen"
      :aria-label="content.menuToggle"
    >
      {{ menuOpen ? '✕' : '☰' }}
    </button>

    <!-- NAVIGATION LINKS -->
    
<ul class="nav-links" :class="{ 'show-menu': menuOpen }">
  <li>
    <router-link to="/" @click="closeMenu">
      {{ content.home }}
    </router-link>
  </li>

  <li>
    <router-link to="/about" @click="closeMenu">
      {{ content.about }}
    </router-link>
  </li>

  <li>
    <router-link to="/services" @click="closeMenu">
      {{ content.academics }}
    </router-link>
  </li>

  <li>
    <router-link to="/admissions" @click="closeMenu">
      {{ content.admissions }}
    </router-link>
  </li>

  <li>
    <router-link to="/gallery" @click="closeMenu">
      {{ content.gallery }}
    </router-link>
  </li>

  <li>
    <router-link to="/contact" @click="closeMenu">
      {{ content.contact }}
    </router-link>
  </li>

  <li><router-link to="/portal" @click="closeMenu">Portal</router-link></li>
  <li><router-link to="/announcements" @click="closeMenu">Amatangazo</router-link></li>
  <li><router-link to="/calendar" @click="closeMenu">Ingengabihe</router-link></li>
  <li><router-link to="/teachers" @click="closeMenu">Abarimu</router-link></li>
  <li><router-link to="/parents" @click="closeMenu">Ababyeyi</router-link></li>

  <li>
    <router-link to="/admin" @click="closeMenu">
      {{ content.admin }}
    </router-link>
  </li>
</ul>


    <!-- LANGUAGE AND AUTH BUTTONS -->
    <div class="nav-actions" :class="{ 'show-menu': menuOpen }">

<div class="language-switch">
  <button
    :class="{ selected: languageStore.language === 'en' }"
    @click="changeLanguage('en')"
  >
    EN
  </button>

  <button
    :class="{ selected: languageStore.language === 'rw' }"
    @click="changeLanguage('rw')"
  >
    RW
  </button>
</div>


      <router-link to="/login" class="login-btn" @click="closeMenu">
        {{ content.login }}
      </router-link>

      <router-link to="/register" class="register-btn" @click="closeMenu">
        {{ content.register }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()

const menuOpen = ref(false)

const translations = {
  en: {
    schoolLine1: 'COLLEGE BAPTISTE',
    schoolLine2: 'GACUBA II',
    menuToggle: 'Toggle navigation',
    home: 'Home',
    about: 'About',
    academics: 'Academics',
    admissions: 'Apply',
    contact: 'Contact',
    gallery: 'Gallery',
    admin: 'Admin',
    login: 'Login',
    register: 'Register'
  },

  rw: {
    schoolLine1: 'COLLEGE BAPTISTE',
    schoolLine2: 'GACUBA II',
    menuToggle: 'Fungura cyangwa ufunge menu',
    home: 'Ahabanza',
    about: 'Ibitwerekeye',
    academics: 'Amasomo',
    admissions: 'Saba Kwiga',
    contact: 'Twandikire',
    gallery: 'Amafoto',
    admin: 'Ubuyobozi',
    login: 'Injira',
    register: 'Iyandikishe'
  }
}

const content = computed(() => {
  const language = languageStore.language
  return siteContent.merge('navbar', language, translations[language] || translations.en)
})

function changeLanguage(language) {
  languageStore.setLanguage(language)
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 5%;
  background: var(--school-navy);
  color: white;
  gap: 20px;
  position: relative;
  z-index: 100;
}

/* LOGO */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
}

.logo-icon {
  width: 52px;
  height: 52px;
  object-fit: contain;
  object-position: center;
}

.logo-text {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  letter-spacing: 1px;
}

.logo-text strong {
  color: #f0d48a;
  font-size: 16px;
}

/* NAVIGATION */
.nav-links {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 25px;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-size: 15px;
  transition: 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  color: #f0d48a;
}

/* ACTION BUTTONS */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-switch {
  display: flex;
  gap: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 3px;
  border-radius: 6px;
}

.language-switch button {
  border: none;
  background: transparent;
  color: white;
  padding: 6px 9px;
  cursor: pointer;
  border-radius: 4px;
}

.language-switch button.selected {
  background: var(--school-gold);
  color: var(--school-navy);
}

.login-btn,
.register-btn {
  text-decoration: none;
  padding: 9px 15px;
  border-radius: 5px;
  color: white;
  font-size: 14px;
}

.login-btn {
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.register-btn {
  background: var(--school-gold);
  color: var(--school-navy);
}

.login-btn:hover,
.register-btn:hover {
  opacity: 0.8;
}

/* MOBILE MENU BUTTON */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 27px;
  cursor: pointer;
}

/* RESPONSIVE DESIGN */
@media (max-width: 900px) {
  .navbar {
    flex-wrap: wrap;
  }

  .menu-toggle {
    display: block;
  }

  .nav-links,
  .nav-actions {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .nav-links.show-menu,
  .nav-actions.show-menu {
    display: flex;
  }

  .nav-links {
    gap: 0;
  }

  .nav-links li {
    padding: 12px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
  }

  .nav-actions {
    padding-bottom: 12px;
  }

  .language-switch {
    align-self: flex-start;
  }

  .login-btn,
  .register-btn {
    text-align: center;
  }
}
</style>
