<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '../stores/language'
import { apiUrl } from '../services/api'

const route = useRoute()
const languageStore = useLanguageStore()
const items = ref([])
const loading = ref(false)

const dataType = computed(() => route.meta.type)
const translations = {
  en: {
    announcements: { title: 'Announcements', subtitle: 'Latest school announcements', icon: 'bi-megaphone' },
    calendar: { title: 'School Calendar', subtitle: 'School dates and events', icon: 'bi-calendar-event' },
    teachers: { title: 'Teachers', subtitle: 'Our teachers and the subjects they teach', icon: 'bi-person-badge' },
    parents: { title: 'Parent Information', subtitle: 'Information for parents to keep up with', icon: 'bi-people' },
    school: { title: 'School Information', subtitle: '', icon: 'bi-info-circle' },
    loading: 'Loading information...',
    empty: 'No information available.'
  },
  rw: {
    announcements: { title: 'Amatangazo', subtitle: 'Amatangazo mashya y’ishuri', icon: 'bi-megaphone' },
    calendar: { title: 'Ingengabihe y’amasomo', subtitle: 'Iminsi n’ibikorwa by’ishuri', icon: 'bi-calendar-event' },
    teachers: { title: 'Abarimu', subtitle: 'Abarimu n’amasomo bigisha', icon: 'bi-person-badge' },
    parents: { title: 'Amakuru y’ababyeyi', subtitle: 'Ibyo ababyeyi bakeneye gukurikirana', icon: 'bi-people' },
    school: { title: 'Amakuru y’ishuri', subtitle: '', icon: 'bi-info-circle' },
    loading: 'Amakuru arimo gufunguka...',
    empty: 'Nta makuru aboneka.'
  }
}
const content = computed(() => {
  const language = translations[languageStore.language] ? languageStore.language : 'en'
  return translations[language]
})
const page = computed(() => content.value[dataType.value] || content.value.school)

async function loadData() {
  loading.value = true
  try {
    const response = await fetch(apiUrl(`/api/school-data/${dataType.value}`))
    const data = await response.json()
    items.value = response.ok ? data : []
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

watch(dataType, loadData)
onMounted(loadData)
</script>

<template>
  <main class="school-info">
    <header>
      <i :class="['bi', page.icon]"></i>
      <div><p class="eyebrow">COLLEGE BAPTISTE GACUBA II</p><h1>{{ page.title }}</h1><p>{{ page.subtitle }}</p></div>
    </header>
    <p v-if="loading" class="empty">{{ content.loading }}</p>
    <div v-else-if="!items.length" class="empty">{{ content.empty }}</div>
    <section v-else class="cards">
      <article v-for="item in items" :key="item.id">
        <h2>{{ item.title }}</h2>
        <p v-if="item.description">{{ item.description }}</p>
        <p v-if="item.body">{{ item.body }}</p>
        <small v-if="item.date">{{ new Date(item.date).toLocaleDateString() }}</small>
        <small v-if="item.subject">{{ item.subject }}</small>
      </article>
    </section>
  </main>
</template>

<style scoped>
.school-info { min-height: 70vh; padding: 48px 5%; background: #f7f4ee; }
header { max-width: 1100px; margin: 0 auto 24px; display: flex; align-items: center; gap: 16px; }
header > i { font-size: 42px; color: #c8960c; }
.eyebrow { color: #9a7208; font-weight: 800; font-size: 12px; }
h1 { color: #0c2340; margin: 4px 0; }
.cards { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 16px; }
article { padding: 20px; border-radius: 10px; background: white; box-shadow: 0 4px 16px rgba(0,0,0,.05); }
article h2 { color: #0c2340; font-size: 18px; } article p { margin: 10px 0; line-height: 1.6; } article small { display:block; color:#667085; }
.empty { max-width: 1100px; margin: 30px auto; padding: 30px; text-align:center; color:#667085; }
@media(max-width:700px){ .cards{grid-template-columns:1fr;} }
</style>
