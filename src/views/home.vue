<script setup>
import { computed } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'
import { siteDefaults } from '../content/siteDefaults'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()

const content = computed(() => {
  const language = languageStore.language
  const defaults = siteDefaults.home[language] || siteDefaults.home.en
  return siteContent.merge('home', language, defaults)
})

const programs = computed(() => [
  {
    icon: 'bi bi-book',
    title: content.value.olevel,
    text: content.value.olevelText
  },
  {
    icon: 'bi bi-code-slash',
    title: content.value.software,
    text: content.value.softwareText
  },
  {
    icon: 'bi bi-calculator',
    title: content.value.accounting,
    text: content.value.accountingText
  }
])

const facts = computed(() => [
  { title: content.value.fact1, text: content.value.fact1Text },
  { title: content.value.fact2, text: content.value.fact2Text },
  { title: content.value.fact3, text: content.value.fact3Text }
])

const reasons = computed(() => [
  content.value.reason1,
  content.value.reason2,
  content.value.reason3,
  content.value.reason4
])
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-inner">
        <p class="eyebrow">{{ content.welcome }}</p>
        <h1>{{ content.title }}</h1>
        <p class="lead">{{ content.description }}</p>

        <div class="hero-actions">
          <router-link to="/admissions" class="btn btn-gold">
            {{ content.applyBtn }}
          </router-link>
          <router-link to="/services" class="btn btn-ghost">
            {{ content.explore }}
          </router-link>
        </div>

        <p class="hero-meta">
          <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>
          {{ content.location }}
        </p>
      </div>
    </section>

    <section class="facts" aria-label="School highlights">
      <article v-for="(fact, index) in facts" :key="fact.title" class="fact">
        <span class="fact-index">0{{ index + 1 }}</span>
        <h2>{{ fact.title }}</h2>
        <p>{{ fact.text }}</p>
      </article>
    </section>

    <section class="intro">
      <div class="intro-media">
        <img src="/st.png" :alt="content.photoStudents" />
      </div>

      <div class="intro-copy">
        <p class="section-label">{{ content.who }}</p>
        <h2>{{ content.introTitle }}</h2>
        <p>{{ content.introText }}</p>
        <router-link to="/about" class="text-link">
          {{ content.discover }}
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </router-link>
      </div>
    </section>

    <section class="programs">
      <div class="section-heading">
        <p class="section-label">{{ content.programsLabel }}</p>
        <h2>{{ content.programsTitle }}</h2>
        <p>{{ content.programsText }}</p>
      </div>

      <div class="program-grid">
        <article v-for="program in programs" :key="program.title" class="program-card">
          <div class="program-icon" aria-hidden="true">
            <i :class="program.icon"></i>
          </div>
          <h3>{{ program.title }}</h3>
          <p>{{ program.text }}</p>
        </article>
      </div>

      <router-link to="/services" class="text-link center-link">
        {{ content.viewPrograms }}
        <i class="bi bi-arrow-right" aria-hidden="true"></i>
      </router-link>
    </section>

    <section class="why">
      <div class="why-copy">
        <p class="section-label light">{{ content.whyLabel }}</p>
        <h2>{{ content.whyTitle }}</h2>
        <p>{{ content.whyText }}</p>
        <ul>
          <li v-for="reason in reasons" :key="reason">
            <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
            {{ reason }}
          </li>
        </ul>
        <router-link to="/about" class="btn btn-gold">
          {{ content.aboutBtn2 }}
        </router-link>
      </div>

      <div class="why-media">
        <img src="/plygraund.jpg" :alt="content.photoGrounds" />
      </div>
    </section>

    <section class="campus">
      <div class="section-heading">
        <p class="section-label">{{ content.campusLabel }}</p>
        <h2>{{ content.campusTitle }}</h2>
        <p>{{ content.campusText }}</p>
      </div>

      <div class="campus-grid">
        <figure class="campus-main">
          <img src="/st.png" :alt="content.photoStudents" />
        </figure>
        <figure>
          <img src="/plygraund.jpg" :alt="content.photoGrounds" />
        </figure>
        <figure>
          <img src="/schlchch.jpg" :alt="content.photoCampus" />
        </figure>
      </div>

      <router-link to="/gallery" class="text-link center-link">
        {{ content.galleryBtn }}
        <i class="bi bi-arrow-right" aria-hidden="true"></i>
      </router-link>
    </section>

    <section class="cta">
      <div class="cta-inner">
        <h2>{{ content.ctaTitle }}</h2>
        <p>{{ content.ctaText }}</p>
        <div class="hero-actions">
          <router-link to="/admissions" class="btn btn-gold">
            {{ content.applyBtn }}
          </router-link>
          <router-link to="/contact" class="btn btn-ghost">
            {{ content.contactBtn }}
          </router-link>
        </div>
        <p class="hero-meta">
          <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>
          {{ content.location }}
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  --navy: #0c2340;
  --navy-soft: #16345a;
  --gold: #c8960c;
  --gold-deep: #9a7208;
  --ink: #1b2836;
  --muted: #5d6b7a;
  --paper: #f7f4ee;
  --line: #e6e0d4;
  width: 100%;
  overflow: hidden;
  color: var(--ink);
  font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
  background: #fff;
}

.home-page h1,
.home-page h2,
.home-page h3 {
  font-family: 'Libre Baskerville', Georgia, serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.eyebrow,
.section-label {
  margin: 0 0 14px;
  color: var(--gold-deep);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-label.light {
  color: #f0d48a;
}

.hero,
.cta {
  position: relative;
  color: #fff;
  background:
    linear-gradient(105deg, rgba(8, 20, 36, 0.88) 0%, rgba(8, 20, 36, 0.62) 48%, rgba(8, 20, 36, 0.38) 100%),
    url('/plygraund.jpg') center 42% / cover no-repeat;
}

.hero {
  min-height: 640px;
  display: flex;
  align-items: flex-end;
  padding: 120px 8% 88px;
}

.hero-inner,
.cta-inner {
  max-width: 740px;
}

.hero h1,
.cta h2 {
  margin: 0;
  font-size: clamp(2.3rem, 5vw, 4.15rem);
  line-height: 1.15;
  color: #fff;
}

.lead,
.cta p,
.hero-meta {
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.7;
}

.lead,
.cta-inner > p {
  max-width: 560px;
  margin: 18px 0 0;
  font-size: 1.12rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 22px;
  border-radius: 4px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.btn-gold {
  background: var(--gold);
  color: #1a1403;
}

.btn-gold:hover {
  background: #ddb23a;
}

.btn-ghost {
  border: 1px solid rgba(255, 255, 255, 0.75);
  color: #fff;
}

.btn-ghost:hover {
  background: #fff;
  color: var(--navy);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 26px 0 0;
  font-size: 0.95rem;
}

.facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin: -42px 8% 0;
  position: relative;
  z-index: 2;
}

.fact {
  background: #fff;
  border: 1px solid var(--line);
  border-top: 4px solid var(--gold);
  padding: 26px 24px 28px;
  box-shadow: 0 16px 40px rgba(12, 35, 64, 0.08);
}

.fact-index {
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.fact h2,
.program-card h3,
.intro-copy h2,
.why-copy h2,
.section-heading h2 {
  color: var(--navy);
  margin: 8px 0 10px;
}

.fact h2 {
  font-size: 1.45rem;
}

.fact p,
.intro-copy p,
.program-card p,
.section-heading p,
.why-copy p {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.intro,
.programs,
.campus,
.why {
  padding: 88px 8%;
}

.intro {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
  background: var(--paper);
  padding-top: 110px;
}

.intro-media img,
.why-media img,
.campus-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.intro-media {
  height: 460px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 18px 18px 0 #e7d7a4;
}

.intro-copy h2,
.section-heading h2,
.why-copy h2 {
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  line-height: 1.25;
}

.intro-copy > p:last-of-type {
  margin-top: 16px;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 22px;
  color: var(--navy);
  font-weight: 700;
  text-decoration: none;
  border-bottom: 2px solid var(--gold);
  padding-bottom: 2px;
}

.text-link:hover {
  color: var(--gold-deep);
}

.programs {
  text-align: center;
}

.section-heading {
  max-width: 680px;
  margin: 0 auto 36px;
}

.section-heading p {
  margin-top: 10px;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  text-align: left;
}

.program-card {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: 32px 26px;
  border-radius: 6px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.program-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 30px rgba(12, 35, 64, 0.08);
}

.program-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--navy);
  color: #f0d48a;
  font-size: 1.25rem;
  margin-bottom: 18px;
}

.center-link {
  margin-top: 32px;
}

.why {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  background: var(--navy);
  color: #fff;
}

.why-copy h2,
.why-copy p {
  color: #fff;
}

.why-copy p {
  color: rgba(255, 255, 255, 0.8);
}

.why-copy ul {
  list-style: none;
  margin: 24px 0 28px;
  padding: 0;
}

.why-copy li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 12px;
  color: #f4efe4;
}

.why-copy li i {
  color: #f0d48a;
  margin-top: 3px;
}

.why-media {
  height: 420px;
  border-radius: 6px;
  overflow: hidden;
}

.campus {
  background: #fff;
  text-align: center;
}

.campus-grid {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  grid-template-rows: 210px 210px;
  gap: 14px;
  text-align: left;
}

.campus-main {
  grid-row: 1 / span 2;
}

.campus-grid figure {
  margin: 0;
  overflow: hidden;
  border-radius: 6px;
  background: var(--paper);
}

.cta {
  text-align: left;
  padding: 88px 8%;
  background:
    linear-gradient(105deg, rgba(8, 20, 36, 0.92), rgba(12, 35, 64, 0.78)),
    url('/schlchch.jpg') center / cover no-repeat;
}

@media (max-width: 900px) {
  .hero {
    min-height: 0;
    align-items: flex-end;
    padding: 96px 6% 64px;
  }

  .facts,
  .intro,
  .program-grid,
  .why,
  .campus-grid {
    grid-template-columns: 1fr;
  }

  .facts {
    margin: 0;
    padding: 28px 6% 8px;
    gap: 12px;
    background: var(--paper);
  }

  .fact {
    box-shadow: none;
  }

  .intro,
  .programs,
  .why,
  .campus {
    padding: 56px 6%;
  }

  .intro {
    padding-top: 48px;
    gap: 28px;
  }

  .intro-media,
  .why-media {
    height: 280px;
    box-shadow: none;
  }

  .campus-grid {
    grid-template-rows: none;
  }

  .campus-main {
    grid-row: auto;
  }

  .campus-grid figure {
    height: 230px;
  }

  .why-media {
    order: -1;
  }

  .hero-actions .btn,
  .cta .btn {
    width: 100%;
  }

  .cta {
    padding: 64px 6%;
  }
}

@media (max-width: 420px) {
  .hero h1,
  .cta h2 {
    font-size: 2rem;
  }
}
</style>
