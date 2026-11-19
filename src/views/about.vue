
<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()

const content = computed(() => {
  const translations = {
    en: {
      title: 'About Our School',
      schoolLabel: 'COLLEGE BAPTISTE GACUBA II',
      sectionLabel: 'OUR SCHOOL',
      imageAlt: 'Students learning at school',
      subtitle: 'Discover College Baptiste Gacuba II',
      heading: 'Who We Are',
      paragraph1: 'College Baptiste Gacuba II is an educational institution located in Gisenyi Sector, Rubavu District, Rwanda.',
      paragraph2: 'Our school provides education and practical learning opportunities to help students develop knowledge, skills and prepare for their future.',
      button: 'Explore Our Academics',
      mission: 'Our Mission',
      missionText: 'To provide quality education and develop students with knowledge, practical skills and good values.',
      vision: 'Our Vision',
      visionText: 'To become a center of excellence that prepares responsible, skilled and innovative future generations.',
      focus: 'Our Academic Programs',
      programs: [
        'Ordinary Level (O-Level)',
        'Software Development',
        'Accounting'
      ],
      location: 'Location',
      locationText: 'Gisenyi Sector, Rubavu District, Rwanda'
    },

    rw: {
      title: 'Ibyerekeye Ishuri Ryacu',
      schoolLabel: 'COLLEGE BAPTISTE GACUBA II',
      sectionLabel: 'ISHURI RYACU',
      imageAlt: 'Abanyeshuri bigira ku ishuri',
      subtitle: 'Menya College Baptiste Gacuba II',
      heading: 'Abo Turibo',
      paragraph1: 'College Baptiste Gacuba II ni ikigo cy’amashuri giherereye mu Murenge wa Gisenyi, Akarere ka Rubavu, mu Rwanda.',
      paragraph2: 'Ishuri ryacu ritanga uburezi n’amahugurwa afasha abanyeshuri kugira ubumenyi, ubushobozi ngiro no kwitegura ejo hazaza habo.',
      button: 'Reba Amasomo Yacu',
      mission: 'Intego yacu',
      missionText: 'Gutanga uburezi bufite ireme no gufasha abanyeshuri kugira ubumenyi, ubushobozi ngiro n’indangagaciro nziza.',
      vision: 'Icyerekezo cyacu',
      visionText: 'Kuba ikigo cy’indashyikirwa gitegura urubyiruko rushoboye, rushinzwe inshingano kandi rufite udushya.',
      focus: 'Porogaramu z’amasomo',
      programs: [
        'Amashuri yisumbuye (O-Level)',
        'Gukora porogaramu za mudasobwa (Software Development)',
        'Ibaruramari (Accounting)'
      ],
      location: 'Aho riherereye',
      locationText: 'Umurenge wa Gisenyi, Akarere ka Rubavu, Rwanda'
    }
  }

  const language = languageStore.language
  return siteContent.merge('about', language, translations[language] || translations.en)
})
</script>

<template>
  <div class="about-page">

    <!-- Hero Section -->
    <section class="about-hero">
      <div class="hero-content">
        <span>{{ content.schoolLabel }}</span>
        <h1>{{ content.title }}</h1>
        <p>{{ content.subtitle }}</p>
      </div>
    </section>

    <!-- About Content -->
    <section class="about-content">

      <div class="about-text">
        <span class="section-label">{{ content.sectionLabel }}</span>

        <h2>{{ content.heading }}</h2>

        <p>{{ content.paragraph1 }}</p>

        <p>{{ content.paragraph2 }}</p>

        <router-link to="/services" class="about-btn">
          {{ content.button }}
        </router-link>
      </div>

      <div class="about-image">
        <img
          src="/st.png"
          :alt="content.imageAlt"
        />
      </div>

    </section>

    <!-- Mission and Vision -->
    <section class="mission-section">

      <div class="mission-card">
        <div class="card-icon">🎯</div>
        <h2>{{ content.mission }}</h2>
        <p>{{ content.missionText }}</p>
      </div>

      <div class="mission-card">
        <div class="card-icon">🌍</div>
        <h2>{{ content.vision }}</h2>
        <p>{{ content.visionText }}</p>
      </div>

    </section>

    <!-- Academic Programs -->
    <section class="program-section">

      <h2>{{ content.focus }}</h2>

      <div class="program-grid">
        <div
          v-for="(program, index) in content.programs"
          :key="index"
          class="program-card"
        >
          <span v-if="index === 0">📚</span>
          <span v-else-if="index === 1">💻</span>
          <span v-else>📊</span>

          <h3>{{ program }}</h3>
        </div>
      </div>

    </section>

    <!-- Location -->
    <section class="location-section">
      <h2>📍 {{ content.location }}</h2>
      <p>{{ content.locationText }}</p>
    </section>

  </div>
</template>

<style scoped>
.about-page {
  width: 100%;
  color: var(--school-ink);
}

/* Hero */
.about-hero {
  background:
    linear-gradient(105deg, rgba(8, 20, 36, 0.9), rgba(8, 20, 36, 0.55)),
    url('/plygraund.jpg') center 42% / cover no-repeat;
  text-align: center;
  padding: 85px 20px;
  color: white;
}

.hero-content span {
  color: #f0d48a;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
}

.about-hero h1 {
  font-size: 42px;
  margin: 18px 0 12px;
}

.about-hero p {
  font-size: 17px;
  color: #e2e8f0;
}

/* About content */
.about-content {
  display: flex;
  align-items: center;
  gap: 50px;
  padding: 75px 8%;
}

.about-text,
.about-image {
  flex: 1;
}

.section-label {
  color: var(--school-gold-deep);
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 13px;
}

.about-text h2 {
  font-size: 32px;
  margin: 15px 0 20px;
  color: var(--school-navy);
}

.about-text p {
  line-height: 1.9;
  color: var(--school-muted);
  margin-bottom: 18px;
}

.about-image img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
}

.about-btn {
  display: inline-block;
  background: var(--school-gold);
  color: var(--school-navy);
  padding: 14px 25px;
  border-radius: 6px;
  text-decoration: none;
  margin-top: 12px;
  transition: 0.3s;
}

.about-btn:hover {
  background: var(--school-navy);
  color: white;
  transform: translateY(-3px);
}

/* Mission and vision */
.mission-section {
  display: flex;
  gap: 25px;
  padding: 35px 8% 65px;
}

.mission-card {
  flex: 1;
  background: var(--school-paper);
  padding: 35px;
  border-radius: 12px;
  border-bottom: 4px solid var(--school-gold);
}

.card-icon {
  font-size: 35px;
  margin-bottom: 15px;
}

.mission-card h2 {
  color: var(--school-navy);
  margin-bottom: 15px;
}

.mission-card p {
  color: var(--school-muted);
  line-height: 1.8;
}

/* Academic programs */
.program-section {
  padding: 60px 8%;
  background: var(--school-paper);
  text-align: center;
}

.program-section > h2 {
  font-size: 30px;
  color: var(--school-navy);
  margin-bottom: 35px;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.program-card {
  background: white;
  padding: 35px 20px;
  border-radius: 12px;
  border: 1px solid var(--school-line);
  box-shadow: 0 4px 15px rgba(12, 35, 64, 0.06);
  transition: 0.3s;
}

.program-card:hover {
  transform: translateY(-5px);
}

.program-card span {
  font-size: 38px;
}

.program-card h3 {
  color: var(--school-navy);
  margin-top: 18px;
}

/* Location */
.location-section {
  padding: 55px 20px;
  text-align: center;
}

.location-section h2 {
  color: var(--school-gold-deep);
  margin-bottom: 15px;
}

.location-section p {
  color: var(--school-muted);
}

/* Responsive */
@media (max-width: 768px) {
  .about-content,
  .mission-section {
    flex-direction: column;
  }

  .about-hero h1 {
    font-size: 30px;
  }

  .about-image img {
    height: 260px;
  }

  .program-grid {
    grid-template-columns: 1fr;
  }
}
</style>
