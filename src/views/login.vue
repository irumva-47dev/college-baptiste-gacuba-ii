
<template>
  <div class="login-page">
    <div class="login-card">

      <!-- LOGIN HEADER -->
      <div class="login-header">
        <div class="login-icon">
          <i class="bi bi-person-circle"></i>
        </div>

        <h1>{{ content.title }}</h1>
        <p>{{ content.subtitle }}</p>
        <h3>{{ content.schoolName }}</h3>
      </div>

      <!-- LOGIN FORM -->
      <form @submit.prevent="handleLogin">

        <div class="form-group">
          <label>{{ content.email }}</label>

          <div class="input-box">
            <i class="bi bi-envelope"></i>

            <input
              type="email"
              v-model="email"
              :placeholder="content.emailPlaceholder"
              autocomplete="email"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>{{ content.password }}</label>

          <div class="input-box">
            <i class="bi bi-lock"></i>

            <input
              type="password"
              v-model="password"
              :placeholder="content.passwordPlaceholder"
              autocomplete="current-password"
              required
            />
          </div>
        </div>

        <div class="login-options">
          <label>
            <input type="checkbox" v-model="remember">
            {{ content.remember }}
          </label>
        </div>

        <!-- ERROR OR SUCCESS MESSAGE -->
        <p v-if="message" :class="['login-message', messageType]">
          {{ message }}
        </p>

        <button
          type="submit"
          class="login-button"
          :disabled="loading"
        >
          {{ loading ? content.loggingIn : content.login }}
        </button>

      </form>

      <!-- REGISTER LINK -->
      <div class="register-link">
        <p>
          {{ content.noAccount }}
          <router-link to="/register">
            {{ content.createAccount }}
          </router-link>
        </p>
      </div>

      <div class="back-home">
        <router-link to="/">
          <i class="bi bi-arrow-left"></i>
          {{ content.backHome }}
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'
import { apiUrl } from '../services/api'

const router = useRouter()
const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()

const email = ref(localStorage.getItem('rememberedEmail') || '')
const password = ref('')
const remember = ref(!!localStorage.getItem('rememberedEmail'))

const loading = ref(false)
const message = ref('')
const messageType = ref('error')

const translations = {
  en: {
    schoolName: 'COLLEGE BAPTISTE GACUBA II',
    title: 'Welcome Back!',
    subtitle: 'Login to access your school account',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    remember: 'Remember me',
    login: 'Login Now',
    loggingIn: 'Logging in...',
    noAccount: "Don't have an account?",
    createAccount: 'Create Account',
    backHome: 'Back to Home',
    loginSuccess: 'Login successful! Welcome.',
    loginError: 'Invalid email or password.',
    serverError: 'Unable to connect to the server. Please try again.',
  },

  rw: {
    schoolName: 'COLLEGE BAPTISTE GACUBA II',
    title: 'Murakaza neza!',
    subtitle: 'Injira kugira ngo ukoreshe konti yawe y’ishuri',
    email: 'Imeyili',
    emailPlaceholder: 'Andika imeyili yawe',
    password: 'Ijambo ry’ibanga',
    passwordPlaceholder: 'Andika ijambo ry’ibanga',
    remember: 'Nyibuke',
    login: 'Injira',
    loggingIn: 'Uri kwinjira...',
    noAccount: 'Nta konti uragira?',
    createAccount: 'Fungura konti',
    backHome: 'Subira Ahabanza',
    loginSuccess: 'Winjiye neza! Murakaza neza.',
    loginError: 'Imeyili cyangwa ijambo ry’ibanga si byo.',
    serverError: 'Ntibishobotse kugera kuri server. Ongera ugerageze.',
  }
}

const content = computed(() => {
  const language = languageStore.language
  return siteContent.merge('login', language, translations[language] || translations.en)
})

async function handleLogin() {
  message.value = ''
  loading.value = true

  try {
    const response = await fetch(apiUrl('/api/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      messageType.value = 'error'
      message.value = data.message || content.value.loginError
      return
    }

    // Save login token and user information
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Remember email only when checkbox is selected
    if (remember.value) {
      localStorage.setItem('rememberedEmail', email.value)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    messageType.value = 'success'
    message.value = content.value.loginSuccess

    password.value = ''

    // Send the administrator to the dashboard and other users to the school overview.
    setTimeout(() => {
      router.push(data.user.role === 'admin' ? '/admin' : '/about')
    }, 1000)

  } catch (error) {
    console.error('Login error:', error)

    messageType.value = 'error'
    message.value = content.value.serverError

  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  background:
    linear-gradient(rgba(8, 20, 36, 0.62), rgba(8, 20, 36, 0.62)),
    url('/plygraund.jpg') center 42% / cover no-repeat;
}

.login-card {
  width: 100%;
  max-width: 430px;
  background: white;
  border-top: 4px solid var(--school-gold);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-icon {
  font-size: 55px;
  color: var(--school-gold-deep);
  margin-bottom: 15px;
}

.login-header h1 {
  color: var(--school-navy);
  font-size: 28px;
}

.login-header p {
  color: var(--school-muted);
  margin-top: 10px;
}

.login-header h3 {
  color: var(--school-gold-deep);
  font-size: 14px;
  margin-top: 15px;
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  font-weight: bold;
  color: #344054;
}

.input-box {
  display: flex;
  align-items: center;
  border: 1px solid #d0d5dd;
  border-radius: 7px;
  padding: 0 12px;
}

.input-box:focus-within {
  border-color: var(--school-gold);
}

.input-box i {
  color: #667085;
}

.input-box input {
  width: 100%;
  padding: 13px;
  border: none;
  outline: none;
  font-size: 15px;
}

.login-options {
  margin-bottom: 22px;
  color: #667085;
  font-size: 14px;
}

.login-options input {
  margin-right: 7px;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: var(--school-gold);
  color: var(--school-navy);
  border: none;
  border-radius: 7px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.login-button:hover {
  background: #e0b333;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-message {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 7px;
  font-size: 14px;
  text-align: center;
}

.login-message.error {
  color: #b42318;
  background: #fef3f2;
}

.login-message.success {
  color: #027a48;
  background: #ecfdf3;
}

.register-link {
  text-align: center;
  margin-top: 25px;
  color: var(--school-muted);
}

.register-link a {
  color: var(--school-gold-deep);
  font-weight: bold;
  text-decoration: none;
}

.back-home {
  text-align: center;
  margin-top: 20px;
}

.back-home a {
  color: var(--school-muted);
  text-decoration: none;
}

.back-home a:hover {
  color: var(--school-gold-deep);
}

@media (max-width: 480px) {
  .login-card {
    padding: 25px 20px;
  }

  .login-header h1 {
    font-size: 24px;
  }
}
</style>
