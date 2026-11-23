<script setup>
import { computed, onMounted, ref } from 'vue'
import { useLanguageStore } from '../stores/language'
import { apiUrl } from '../services/api'

const languageStore = useLanguageStore()
const results = ref([])
const loading = ref(false)
const errorMessage = ref('')

const translations = {
  en: {
    title: 'Student Portal',
    results: 'Your Results',
    loading: 'Loading information...',
    loadError: 'Results could not be loaded. Please try again.',
    empty: 'No results are available.',
    term: 'Term',
    subject: 'Subject',
    score: 'Score',
    grade: 'Grade'
  },
  rw: {
    title: 'Urubuga rw’Umunyeshuri',
    results: 'Amanota yawe',
    loading: 'Amakuru arimo gufunguka...',
    loadError: 'Amanota ntiyashoboye gufunguka. Ongera ugerageze.',
    empty: 'Nta manota araboneka.',
    term: 'Igihembwe',
    subject: 'Isomo',
    score: 'Amanota',
    grade: 'Ikiciro'
  }
}
const content = computed(() => translations[languageStore.language] || translations.en)

function getToken() {
  return localStorage.getItem('token')
}

async function loadResults() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await fetch(apiUrl('/api/school-data/results/me'), {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    if (!response.ok) throw new Error('Results request failed.')
    results.value = await response.json()
  } catch (error) {
    console.error('Student results load error:', error)
    errorMessage.value = content.value.loadError
  } finally {
    loading.value = false
  }
}

onMounted(loadResults)
</script>

<template>
  <main class="portal-page">
    <header>
      <p class="eyebrow">COLLEGE BAPTISTE GACUBA II</p>
      <h1>{{ content.title }}</h1>
    </header>

    <section class="portal-card">
      <h2>{{ content.results }}</h2>
      <p v-if="loading">{{ content.loading }}</p>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
      <div v-if="!loading && !errorMessage && !results.length" class="empty">
        {{ content.empty }}
      </div>
      <div v-else-if="results.length" class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ content.term }}</th>
              <th>{{ content.subject }}</th>
              <th>{{ content.score }}</th>
              <th>{{ content.grade }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in results" :key="item.id">
              <td>{{ item.term }}</td><td>{{ item.subject }}</td><td>{{ item.score }}</td><td>{{ item.grade || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style scoped>
.portal-page { min-height: 70vh; padding: 48px 5%; background: #f7f4ee; }
header, .portal-card { max-width: 1000px; margin: 0 auto; }
.eyebrow { color: #9a7208; font-size: 13px; font-weight: 800; }
h1 { margin: 8px 0 24px; color: #0c2340; }
.portal-card { padding: 24px; border-radius: 12px; background: white; box-shadow: 0 5px 20px rgba(0,0,0,.05); }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px; border-bottom: 1px solid #eaecf0; text-align: left; }
.error { color: #b42318; }.empty { padding: 30px; color: #667085; text-align: center; }
</style>
