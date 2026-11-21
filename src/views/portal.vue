<script setup>
import { onMounted, ref } from 'vue'
import { apiUrl } from '../services/api'

const results = ref([])
const loading = ref(false)
const errorMessage = ref('')

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
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Results could not be loaded.')
    results.value = data
  } catch (error) {
    errorMessage.value = error.message
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
      <h1>Student Portal</h1>
    </header>

    <section class="portal-card">
      <h2>Amanota yawe</h2>
      <p v-if="loading">Amakuru arimo gufunguka...</p>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
      <div v-if="!loading && !errorMessage && !results.length" class="empty">
        Nta manota araboneka.
      </div>
      <div v-else-if="results.length" class="table-wrap">
        <table>
          <thead><tr><th>Term</th><th>Subject</th><th>Score</th><th>Grade</th></tr></thead>
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
