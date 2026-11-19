
<template>
  <div class="register-page">

    <div class="register-card">

      <!-- REGISTER HEADER -->
      <div class="register-header">
        <div class="register-icon">
          <i class="bi bi-person-plus-fill"></i>
        </div>

        <h1>{{ content.title }}</h1>
        <p>{{ content.subtitle }}</p>

        <h3>{{ content.schoolName }}</h3>
      </div>

      <!-- REGISTRATION FORM -->
      <form @submit.prevent="registerUser">

        <div class="form-group">
          <label>{{ content.fullname }}</label>

          <input
            type="text"
            v-model="fullname"
            :placeholder="content.fullnamePlaceholder"
            required
          />
        </div>

        <div class="form-group">
          <label>{{ content.email }}</label>

          <input
            type="email"
            v-model="email"
            :placeholder="content.emailPlaceholder"
            required
          />
        </div>

        <div class="form-group">
          <label>{{ content.phone }}</label>

          <input
            type="tel"
            v-model="phone"
            :placeholder="content.phonePlaceholder"
            required
          />
        </div>

        <div class="form-group">
          <label>{{ content.password }}</label>

          <input
            type="password"
            v-model="password"
            :placeholder="content.passwordPlaceholder"
            minlength="6"
            required
          />
        </div>

        <div class="form-group">
          <label>{{ content.confirmPassword }}</label>

          <input
            type="password"
            v-model="confirmPassword"
            :placeholder="content.confirmPlaceholder"
            minlength="6"
            required
          />
        </div>

        <label class="terms">
          <input type="checkbox" v-model="agree" required />
          {{ content.terms }}
        </label>

        <p v-if="message" :class="['register-message', messageType]">
          {{ message }}
        </p>

        <button type="submit" :disabled="loading">
          {{ loading ? content.registering : content.register }}
        </button>

      </form>

      <!-- LOGIN LINK -->
      <div class="login-link">
        {{ content.haveAccount }}

        <router-link to="/login">
          {{ content.login }}
        </router-link>
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
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'
import { apiUrl } from '../services/api'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()

const fullname = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const agree = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('error')

const translations = {
  en: {
    schoolName: 'COLLEGE BAPTISTE GACUBA II',
    title: 'Create Account',
    subtitle: 'Join College Baptiste Gacuba II today.',
    fullname: 'Full Name',
    fullnamePlaceholder: 'Enter your full name',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email',
    phone: 'Phone Number',
    phonePlaceholder: 'Enter your phone number',
    password: 'Password',
    passwordPlaceholder: 'Create a password',
    confirmPassword: 'Confirm Password',
    confirmPlaceholder: 'Confirm your password',
    terms: 'I agree to the Terms and Conditions',
    register: 'Create Account',
    registering: 'Creating account...',
    haveAccount: 'Already have an account?',
    login: 'Login here',
    backHome: 'Back to Home',
    mismatch: 'Passwords do not match!',
    success: 'Your account was created. You can now log in.',
    serverError: 'Unable to connect to the server. Please try again.',
    duplicateEmail: 'This email already has an account.',
    invalidInput: 'Please check your information and try again.'
  },

  rw: {
    schoolName: 'COLLEGE BAPTISTE GACUBA II',
    title: 'Fungura Konti',
    subtitle: 'Iyandikishe muri College Baptiste Gacuba II.',
    fullname: 'Amazina yawe yose',
    fullnamePlaceholder: 'Andika amazina yawe',
    email: 'Imeyili',
    emailPlaceholder: 'Andika imeyili yawe',
    phone: 'Nimero ya telefoni',
    phonePlaceholder: 'Andika nimero ya telefoni',
    password: 'Ijambo ry’ibanga',
    passwordPlaceholder: 'Shyiraho ijambo ry’ibanga',
    confirmPassword: 'Emeza ijambo ry’ibanga',
    confirmPlaceholder: 'Ongera wandike ijambo ry’ibanga',
    terms: 'Nemeye amabwiriza n’amategeko',
    register: 'Fungura Konti',
    registering: 'Konti irimo gufungurwa...',
    haveAccount: 'Usanzwe ufite konti?',
    login: 'Injira hano',
    backHome: 'Subira Ahabanza',
    mismatch: 'Amagambo y’ibanga ntabwo ahuye!',
    success: 'Konti yawe yafunguwe. Ushobora kwinjira.',
    serverError: 'Ntibishobotse kugera kuri server. Ongera ugerageze.',
    duplicateEmail: 'Iyi meyili isanzwe ifite konti.',
    invalidInput: 'Reba neza amakuru wanditse, wongere ugerageze.'
  }
}

const content = computed(() => {
  const language = languageStore.language
  return siteContent.merge('register', language, translations[language] || translations.en)
})

async function registerUser() {
  message.value = ''

  if (password.value !== confirmPassword.value) {
    messageType.value = 'error'
    message.value = content.value.mismatch
    return
  }

  loading.value = true

  try {
    const response = await fetch(apiUrl('/api/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullname: fullname.value,
        email: email.value,
        phone: phone.value,
        password: password.value
      })
    })
    const data = await response.json()

    if (!response.ok) {
      messageType.value = 'error'
      message.value = response.status === 409
        ? content.value.duplicateEmail
        : response.status === 400
          ? content.value.invalidInput
          : data.message || content.value.serverError
      return
    }

    messageType.value = 'success'
    message.value = content.value.success
    fullname.value = ''
    email.value = ''
    phone.value = ''
    password.value = ''
    confirmPassword.value = ''
    agree.value = false
  } catch (error) {
    console.error('Registration error:', error)
    messageType.value = 'error'
    message.value = content.value.serverError
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  background:
    linear-gradient(rgba(8, 20, 36, 0.62), rgba(8, 20, 36, 0.62)),
    url('/plygraund.jpg') center 42% / cover no-repeat;
}

.register-card {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  background: white;
  border-top: 4px solid var(--school-gold);
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

.register-header {
  text-align: center;
  margin-bottom: 25px;
}

.register-icon {
  font-size: 50px;
  color: var(--school-gold-deep);
  margin-bottom: 12px;
}

.register-header h1 {
  color: var(--school-navy);
  font-size: 28px;
}

.register-header h3 {
  color: var(--school-gold-deep);
  font-size: 14px;
  margin-top: 12px;
}

.register-header p {
  color: var(--school-muted);
  margin-top: 10px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #344054;
}

.form-group input {
  width: 100%;
  padding: 13px;
  border: 1px solid #d0d5dd;
  border-radius: 7px;
  outline: none;
  box-sizing: border-box;
  font-size: 15px;
}

.form-group input:focus {
  border-color: var(--school-gold);
}

.terms {
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--school-muted);
  font-size: 14px;
  margin-bottom: 20px;
}

.terms input {
  cursor: pointer;
}

.register-message {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 7px;
  font-size: 14px;
  text-align: center;
}

.register-message.error {
  color: #b42318;
  background: #fef3f2;
}

.register-message.success {
  color: #027a48;
  background: #ecfdf3;
}

.register-card button {
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

.register-card button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-card button:hover {
  background: #e0b333;
}

.login-link {
  text-align: center;
  margin-top: 25px;
  color: var(--school-muted);
}

.login-link a {
  color: var(--school-gold-deep);
  text-decoration: none;
  font-weight: bold;
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
  .register-card {
    padding: 25px 20px;
  }

  .register-header h1 {
    font-size: 24px;
  }
}
</style>
