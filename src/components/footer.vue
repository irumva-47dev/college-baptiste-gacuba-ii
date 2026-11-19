
<template>
  <footer class="footer">
    <div class="footer-container">

      <!-- SCHOOL INFORMATION -->
      <div class="footer-section">
        <h2>{{ content.school }}</h2>

        <p>{{ content.description }}</p>

        <p class="location">
          <i class="bi bi-geo-alt"></i>
          {{ content.location }}
        </p>
      </div>

      <!-- QUICK LINKS -->
      <div class="footer-section">
        <h3>{{ content.quickLinks }}</h3>

        <ul>
          <li>
            <router-link to="/">{{ content.home }}</router-link>
          </li>

          <li>
            <router-link to="/about">{{ content.about }}</router-link>
          </li>

          <li>
            <router-link to="/services">{{ content.academics }}</router-link>
          </li>

          <li>
            <router-link to="/admissions">{{ content.admissions }}</router-link>
          </li>

          <li>
            <router-link to="/contact">{{ content.contact }}</router-link>
          </li>
        </ul>
      </div>

      <!-- ACADEMIC PROGRAMS -->
      <div class="footer-section">
        <h3>{{ content.programs }}</h3>

        <ul>
          <li>{{ content.olevel }}</li>
          <li>{{ content.software }}</li>
          <li>{{ content.accounting }}</li>
        </ul>
      </div>

      <!-- CONTACT INFORMATION -->
      <div class="footer-section">
        <h3>{{ content.contactUs }}</h3>

        <p>
          <i class="bi bi-geo-alt"></i>
          {{ content.location }}
        </p>

        <p>
          <i class="bi bi-envelope"></i>
          {{ content.email }}
        </p>

        <p>
          <i class="bi bi-telephone"></i>
          {{ content.phone }}
        </p>

        <div class="social-links">
          <a href="https://www.facebook.com/" :aria-label="content.facebook">
            <i class="bi bi-facebook" :aria-label="content.facebook"></i>
          </a>

          <a href="https://www.instagram.com/chopor47/" :aria-label="content.instagram">
            <i class="bi bi-instagram" :aria-label="content.instagram"></i>
          </a>

          <a href="https://www.youtube.com/" :aria-label="content.youtube">
            <i class="bi bi-youtube" :aria-label="content.youtube"></i>
          </a>
        </div>
      </div>

    </div>

    <!-- COPYRIGHT -->
    <div class="footer-bottom">
      <p>{{ content.copyright }}</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()

const translations = {
  en: {
    school: 'COLLEGE BAPTISTE GACUBA II',
    description:
      'Committed to quality education, discipline and preparing students for a better future.',
    location: 'Gisenyi Sector, Rubavu District, Rwanda',
    quickLinks: 'Quick Links',
    home: 'Home',
    about: 'About Us',
    academics: 'Academics',
    admissions: 'Admissions',
    contact: 'Contact',
    programs: 'Academic Programs',
    olevel: 'O-Level',
    software: 'Software Development',
    accounting: 'Accounting',
    contactUs: 'Contact Information',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    email: 'irumvamugisha47@gmail.com',
    phone: 'School phone number to be added',
    copyright:
      '© 2026 College Baptiste Gacuba II. All Rights Reserved.'
  },

  rw: {
    school: 'COLLEGE BAPTISTE GACUBA II',
    description:
      'Twiyemeje gutanga uburezi bufite ireme, ikinyabupfura no gutegurira abanyeshuri ahazaza heza.',
    location: 'Umurenge wa Gisenyi, Akarere ka Rubavu, Rwanda',
    quickLinks: 'Aho Wahera',
    home: 'Ahabanza',
    about: 'Ibitwerekeye',
    academics: 'Amasomo',
    admissions: 'Kwiyandikisha',
    contact: 'Twandikire',
    programs: 'Amasomo Atangwa',
    olevel: 'Amashuri yisumbuye (O-Level)',
    software: 'Gukora porogaramu za mudasobwa',
    accounting: 'Ibaruramari',
    contactUs: 'Amakuru yo Kutwandikira',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    email: 'irumvamugisha47@gmail.com',
    phone: 'Telefoni y’ishuri izashyirwamo',
    copyright:
      '© 2026 College Baptiste Gacuba II. Uburenganzira bwose burubahirijwe.'
  }
}

const content = computed(() => {
  const language = languageStore.language
  return siteContent.merge('footer', language, translations[language] || translations.en)
})
</script>

<style scoped>
.footer {
  background: var(--school-navy);
  color: #ffffff;
  padding: 55px 7% 0;
  margin-top: 0;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 35px;
  max-width: 1200px;
  margin: auto;
}

.footer-section h2 {
  color: #f0d48a;
  font-size: 21px;
  margin-bottom: 18px;
  line-height: 1.5;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #ffffff;
}

.footer-section p {
  color: #cbd5e1;
  line-height: 1.8;
  margin-bottom: 10px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  color: #cbd5e1;
  margin-bottom: 12px;
}

.footer-section a {
  color: #cbd5e1;
  text-decoration: none;
  transition: 0.3s;
}

.footer-section a:hover {
  color: #f0d48a;
}

.footer-section i {
  margin-right: 7px;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 18px;
}

.social-links a {
  background: var(--school-navy-soft);
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 18px;
}

.social-links a:hover {
  background: var(--school-gold);
  color: var(--school-navy);
}

.footer-bottom {
  border-top: 1px solid #334155;
  text-align: center;
  margin-top: 45px;
  padding: 22px 0;
}

.footer-bottom p {
  color: #94a3b8;
  margin: 0;
}

@media (max-width: 900px) {
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .footer-container {
    grid-template-columns: 1fr;
  }
}
</style>
