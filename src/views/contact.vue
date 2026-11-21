
<script setup>
import { ref, computed } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'
import { apiUrl } from '../services/api'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()

// English and Kinyarwanda translations
const translations = {
  en: {
    schoolName: 'College Baptiste Gacuba II',
    locationDetails: 'Gisenyi Sector, Rubavu District, Rwanda',
    title: 'Contact Our School',
    subtitle: 'We are happy to hear from you. Contact College Baptiste Gacuba II.',
    getInTouch: 'Get In Touch',
    description: 'Do you have a question about our school or academic programs? Send us a message.',
    location: 'Our Location',
    school: 'School Name',
    email: 'Email Address',
    phone: 'Phone Number',
    emailPlaceholder: 'irumvamugisha47@gmail.com',
    phonePlaceholder: 'School phone number to be added',
    sendMessage: 'Send Us a Message',
    fullName: 'Full Name',
    namePlaceholder: 'Enter your full name',
    emailInputPlaceholder: 'Enter your email address',
    subject: 'Subject',
    subjectPlaceholder: 'Enter message subject',
    message: 'Your Message',
    messagePlaceholder: 'Write your message here...',
    sendButton: 'Send Message',
    success: 'Thank you',
    received: 'Your message has been received.',
    error: 'Please complete all fields.',
    sending: 'Sending...',
    sendError: 'The message could not be sent. Please try again.',
  },

  rw: {
    schoolName: 'College Baptiste Gacuba II',
    locationDetails: 'Umurenge wa Gisenyi, Akarere ka Rubavu, Rwanda',
    title: 'Twandikire',
    subtitle: 'Twishimiye kumva ibitekerezo byanyu. Twandikire kuri College Baptiste Gacuba II.',
    getInTouch: 'Tuganire',
    description: 'Ese ufite ikibazo kijyanye n’ishuri ryacu cyangwa amasomo dutanga? Twoherereze ubutumwa.',
    location: 'Aho Ishuri Riherereye',
    school: 'Izina ry’Ishuri',
    email: 'Imeyili',
    phone: 'Telefoni',
    emailPlaceholder: 'irumvamugisha47@gmail.com',
    phonePlaceholder: 'Telefoni y’ishuri izongerwamo',
    sendMessage: 'Twoherereze Ubutumwa',
    fullName: 'Amazina Yuzuye',
    namePlaceholder: 'Andika amazina yawe',
    emailInputPlaceholder: 'Andika imeyili yawe',
    subject: 'Umutwe w’Ubutumwa',
    subjectPlaceholder: 'Andika umutwe w’ubutumwa',
    message: 'Ubutumwa Bwawe',
    messagePlaceholder: 'Andika ubutumwa bwawe hano...',
    sendButton: 'Ohereza Ubutumwa',
    success: 'Murakoze',
    received: 'Ubutumwa bwanyu bwakiriwe.',
    error: 'Uzuza imyanya yose.',
    sending: 'Ubutumwa burimo koherezwa...',
    sendError: 'Ubutumwa ntibwoherejwe. Ongera ugerageze.',
  }
}

const t = computed(() =>
  siteContent.merge(
    'contact',
    languageStore.language,
    translations[languageStore.language] || translations.en
  )
)

// Form fields
const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const loading = ref(false)
const statusMessage = ref('')
const statusType = ref('error')

// Submit contact form
async function sendMessage() {
  statusMessage.value = ''

  if (
    !name.value.trim() ||
    !email.value.trim() ||
    !subject.value.trim() ||
    !message.value.trim()
  ) {
    statusMessage.value = t.value.error
    return
  }

  loading.value = true

  try {
    const response = await fetch(apiUrl('/api/contact'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        subject: subject.value,
        message: message.value
      })
    })
    const data = await response.json()

    if (!response.ok) {
      statusType.value = 'error'
      statusMessage.value = data.message || t.value.sendError
      return
    }

    statusType.value = 'success'
    statusMessage.value = `${t.value.success}, ${name.value}! ${t.value.received}`
    name.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
  } catch (error) {
    console.error('Contact form error:', error)
    statusType.value = 'error'
    statusMessage.value = t.value.sendError
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="contact-page">

    <!-- HERO SECTION -->
    <section class="contact-hero">
      <h1>{{ t.title }}</h1>
      <p>{{ t.subtitle }}</p>
    </section>

    <!-- CONTACT CONTENT -->
    <section class="contact-container">

      <!-- SCHOOL INFORMATION -->
      <div class="contact-info">
        <h2>{{ t.getInTouch }}</h2>

        <p>{{ t.description }}</p>

        <div class="info-item">
          <i class="bi bi-geo-alt"></i>
          <div>
            <h3>{{ t.location }}</h3>
            <p>{{ t.locationDetails }}</p>
          </div>
        </div>

        <div class="info-item">
          <i class="bi bi-building"></i>
          <div>
            <h3>{{ t.school }}</h3>
            <p>{{ t.schoolName }}</p>
          </div>
        </div>

        <div class="info-item">
          <i class="bi bi-envelope"></i>
          <div>
            <h3>{{ t.email }}</h3>
            <p>{{ t.emailPlaceholder }}</p>
          </div>
        </div>

        <div class="info-item">
          <i class="bi bi-telephone"></i>
          <div>
            <h3>{{ t.phone }}</h3>
            <p>{{ t.phonePlaceholder }}</p>
          </div>
        </div>
      </div>

      <!-- CONTACT FORM -->
      <div class="contact-form">
        <h2>{{ t.sendMessage }}</h2>

        <form @submit.prevent="sendMessage">

          <label>{{ t.fullName }}</label>
          <input
            type="text"
            v-model="name"
            :placeholder="t.namePlaceholder"
            required
          />

          <label>{{ t.email }}</label>
          <input
            type="email"
            v-model="email"
            :placeholder="t.emailInputPlaceholder"
            required
          />

          <label>{{ t.subject }}</label>
          <input
            type="text"
            v-model="subject"
            :placeholder="t.subjectPlaceholder"
            required
          />

          <label>{{ t.message }}</label>
          <textarea
            v-model="message"
            :placeholder="t.messagePlaceholder"
            rows="5"
            required
          ></textarea>

          <p v-if="statusMessage" :class="['form-message', statusType]" role="status" aria-live="polite">
            {{ statusMessage }}
          </p>

          <button type="submit" :disabled="loading">
            <i class="bi bi-send"></i>
            {{ loading ? t.sending : t.sendButton }}
          </button>

        </form>
      </div>

    </section>
  </div>
</template>

<style scoped>
.contact-page {
  background: #fff;
  min-height: 80vh;
}

/* HERO SECTION */
.contact-hero {
  background:
    linear-gradient(105deg, rgba(8, 20, 36, 0.9), rgba(8, 20, 36, 0.58)),
    url('/schol.png') center 42% / cover no-repeat;
  text-align: center;
  padding: 65px 20px;
}

.contact-hero h1 {
  font-size: 38px;
  color: #fff;
  margin-bottom: 15px;
  font-weight: 800;
}

.contact-hero p {
  color: rgba(255, 255, 255, 0.88);
  font-size: 17px;
  line-height: 1.6;
}

/* MAIN CONTENT */
.contact-container {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 35px;
  padding: 60px 8%;
  max-width: 1400px;
  margin: auto;
}

.contact-info,
.contact-form {
  background: white;
  padding: 35px;
  border-radius: 14px;
  box-shadow: 0 5px 22px rgba(0, 0, 0, 0.06);
}

.contact-info h2,
.contact-form h2 {
  font-size: 25px;
  margin-bottom: 20px;
  color: var(--school-navy);
}

.contact-info > p {
  color: var(--school-muted);
  line-height: 1.8;
  margin-bottom: 30px;
}

/* CONTACT INFORMATION */
.info-item {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 27px;
}

.info-item i {
  font-size: 25px;
  color: var(--school-gold-deep);
  background: var(--school-paper);
  padding: 12px;
  border-radius: 10px;
  flex-shrink: 0;
}

.info-item h3 {
  font-size: 16px;
  margin-bottom: 6px;
  color: var(--school-navy);
}

.info-item p {
  color: var(--school-muted);
  line-height: 1.5;
}

/* CONTACT FORM */
.contact-form form {
  display: flex;
  flex-direction: column;
}

.contact-form label {
  margin: 13px 0 7px;
  font-weight: 600;
  color: #344054;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 13px;
  border: 1px solid #d0d5dd;
  border-radius: 7px;
  font-size: 15px;
  font-family: Arial, sans-serif;
  outline: none;
  transition: 0.3s;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--school-gold);
  box-shadow: 0 0 0 3px rgba(200, 150, 12, 0.14);
}

.contact-form textarea {
  resize: vertical;
}

.contact-form button {
  margin-top: 22px;
  padding: 14px;
  background: var(--school-gold);
  color: var(--school-navy);
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.contact-form button:hover {
  background: #e0b333;
}

.contact-form button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 7px;
  text-align: center;
}

.form-message.error {
  color: #b42318;
  background: #fef3f2;
}

.form-message.success {
  color: #027a48;
  background: #ecfdf3;
}

.contact-form button i {
  margin-right: 8px;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .contact-hero h1 {
    font-size: 30px;
  }

  .contact-container {
    grid-template-columns: 1fr;
    padding: 35px 5%;
  }

  .contact-info,
  .contact-form {
    padding: 25px;
  }
}
</style>
