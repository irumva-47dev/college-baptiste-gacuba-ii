
<template>
  <div class="academics-page">

    <!-- PAGE HEADER -->
    <section class="page-header">
      <span class="top-label">{{ content.label }}</span>
      <h1>{{ content.title }}</h1>
      <p>{{ content.subtitle }}</p>
    </section>

    <!-- ACADEMIC PROGRAMS -->
    <section class="programs-section">

      <div class="programs-container">

        <!-- O LEVEL -->
        <div class="program-card">
          <div class="program-icon blue">
            <i class="bi bi-mortarboard-fill"></i>
          </div>

          <h2>{{ content.olevel }}</h2>
          <p>{{ content.olevelDesc }}</p>

          <ul>
            <li>{{ content.subject1 }}</li>
            <li>{{ content.subject2 }}</li>
            <li>{{ content.subject3 }}</li>
          </ul>
        </div>

        <!-- SOFTWARE DEVELOPMENT -->
        <div class="program-card">
          <div class="program-icon green">
            <i class="bi bi-code-slash"></i>
          </div>

          <h2>{{ content.software }}</h2>
          <p>{{ content.softwareDesc }}</p>

          <ul>
            <li>{{ content.software1 }}</li>
            <li>{{ content.software2 }}</li>
            <li>{{ content.software3 }}</li>
          </ul>
        </div>

        <!-- ACCOUNTING -->
        <div class="program-card">
          <div class="program-icon orange">
            <i class="bi bi-calculator-fill"></i>
          </div>

          <h2>{{ content.accounting }}</h2>
          <p>{{ content.accountingDesc }}</p>

          <ul>
            <li>{{ content.accounting1 }}</li>
            <li>{{ content.accounting2 }}</li>
            <li>{{ content.accounting3 }}</li>
          </ul>
        </div>

      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section class="why-section">
      <h2>{{ content.whyTitle }}</h2>
      <p>{{ content.whyDesc }}</p>

      <div class="features">
        <div class="feature">
          <i class="bi bi-book-fill"></i>
          <h3>{{ content.feature1 }}</h3>
        </div>

        <div class="feature">
          <i class="bi bi-lightbulb-fill"></i>
          <h3>{{ content.feature2 }}</h3>
        </div>

        <div class="feature">
          <i class="bi bi-people-fill"></i>
          <h3>{{ content.feature3 }}</h3>
        </div>
      </div>
    </section>

    <!-- CONTACT BUTTON -->
    <section class="contact-section">
      <h2>{{ content.contactTitle }}</h2>
      <p>{{ content.contactDesc }}</p>

      <router-link to="/contact" class="contact-button">
        {{ content.contactButton }}
      </router-link>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()

const translations = {
  en: {
    label: 'LEARNING AND EDUCATION',
    title: 'Our Academic Programs',
    subtitle: 'Discover the academic programs offered at College Baptiste Gacuba II.',

    olevel: 'O-Level',
    olevelDesc: 'A foundation program that helps students develop knowledge and essential academic skills.',
    subject1: 'General academic subjects',
    subject2: 'Science and mathematics',
    subject3: 'Languages and humanities',

    software: 'Software Development',
    softwareDesc: 'Learn the fundamentals of designing and developing computer software.',
    software1: 'Programming fundamentals',
    software2: 'Web development',
    software3: 'Database concepts',

    accounting: 'Accounting',
    accountingDesc: 'Develop knowledge and skills in financial records and accounting principles.',
    accounting1: 'Financial accounting',
    accounting2: 'Bookkeeping',
    accounting3: 'Business principles',

    whyTitle: 'Why Choose Our School?',
    whyDesc: 'We aim to support students through education, practical learning and personal development.',
    feature1: 'Quality Education',
    feature2: 'Practical Skills',
    feature3: 'Student Development',

    contactTitle: 'Want to Know More?',
    contactDesc: 'Contact our school for more information about academic programs.',
    contactButton: 'Contact Us'
  },

  rw: {
    label: 'KWIGA NO KWIGISHA',
    title: 'Amasomo Atangwa',
    subtitle: 'Menya amasomo atangwa muri College Baptiste Gacuba II.',

    olevel: 'O-Level',
    olevelDesc: 'Amashuri yisumbuye afasha abanyeshuri kugira ubumenyi n’ubushobozi bw’ibanze.',
    subject1: 'Amasomo rusange',
    subject2: 'Siyansi n’imibare',
    subject3: 'Indimi n’amasomo mbonezamubano',

    software: 'Software Development',
    softwareDesc: 'Kwiga iby’ibanze byo gukora no guteza imbere porogaramu za mudasobwa.',
    software1: 'Iby’ibanze bya Programming',
    software2: 'Gukora imbuga za internet',
    software3: 'Imicungire y’amakuru muri Database',

    accounting: 'Accounting',
    accountingDesc: 'Kwiga ubumenyi n’ubushobozi mu ibaruramari n’imicungire y’imari.',
    accounting1: 'Ibaruramari ry’imari',
    accounting2: 'Kubika no kwandika ibitabo by’imari',
    accounting3: 'Amahame y’ubucuruzi',

    whyTitle: 'Kuki Wahitamo Ishuri Ryacu?',
    whyDesc: 'Dufasha abanyeshuri kwiga, kugira ubumenyi ngiro no kwiteza imbere.',
    feature1: 'Uburezi Bufite Ireme',
    feature2: 'Ubumenyi Ngiro',
    feature3: 'Iterambere ry’Abanyeshuri',

    contactTitle: 'Ushaka Kumenya Ibindi?',
    contactDesc: 'Twandikire kugira ngo umenye byinshi ku masomo yacu.',
    contactButton: 'Twandikire'
  }
}

const content = computed(() => {
  const language = languageStore.language
  return siteContent.merge('services', language, translations[language] || translations.en)
})
</script>

<style scoped>
.academics-page {
  background: #fff;
}

/* PAGE HEADER */
.page-header {
  text-align: center;
  padding: 70px 20px;
  background:
    linear-gradient(105deg, rgba(8, 20, 36, 0.9), rgba(8, 20, 36, 0.58)),
    url('/plygraund.jpg') center 42% / cover no-repeat;
  color: white;
}

.top-label {
  color: #f0d48a;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
}

.page-header h1 {
  font-size: 38px;
  margin: 15px 0;
}

.page-header p {
  color: #cbd5e1;
  max-width: 650px;
  margin: auto;
  line-height: 1.7;
}

/* PROGRAM CARDS */
.programs-section {
  padding: 65px 7%;
}

.programs-container {
  max-width: 1200px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.program-card {
  background: var(--school-paper);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid var(--school-line);
  box-shadow: 0 5px 20px rgba(12, 35, 64, 0.06);
  transition: 0.3s;
}

.program-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 10px 25px rgba(12, 35, 64, 0.12);
}

.program-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27px;
  margin-bottom: 22px;
}

.blue {
  background: #f4e9c7;
  color: var(--school-gold-deep);
}

.green {
  background: #e5eee7;
  color: #315d43;
}

.orange {
  background: #f5e8d8;
  color: #875b23;
}

.program-card h2 {
  color: #101828;
  font-size: 21px;
  margin-bottom: 15px;
}

.program-card p {
  color: #667085;
  line-height: 1.7;
  min-height: 80px;
}

.program-card ul {
  padding-left: 20px;
  color: #475467;
  line-height: 2;
}

/* WHY CHOOSE US */
.why-section {
  background: var(--school-paper);
  text-align: center;
  padding: 65px 7%;
}

.why-section > h2 {
  font-size: 30px;
  color: #101828;
}

.why-section > p {
  color: #667085;
  max-width: 650px;
  margin: 15px auto 35px;
  line-height: 1.7;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  max-width: 1000px;
  margin: auto;
}

.feature {
  padding: 25px;
  background: var(--school-paper);
  border-radius: 10px;
}

.feature i {
  font-size: 35px;
  color: var(--school-gold-deep);
}

.feature h3 {
  color: #344054;
  font-size: 17px;
  margin-top: 15px;
}

/* CONTACT SECTION */
.contact-section {
  text-align: center;
  padding: 65px 20px;
  background: var(--school-navy);
  color: white;
}

.contact-section h2 {
  font-size: 30px;
}

.contact-section p {
  color: #cbd5e1;
  margin: 15px 0 25px;
}

.contact-button {
  display: inline-block;
  padding: 13px 25px;
  background: var(--school-gold);
  color: var(--school-navy);
  border-radius: 7px;
  text-decoration: none;
  font-weight: bold;
}

.contact-button:hover {
  background: #e0b333;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .programs-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 28px;
  }

  .programs-container,
  .features {
    grid-template-columns: 1fr;
  }

  .program-card p {
    min-height: auto;
  }
}
</style>
