<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { siteDefaults } from '../content/siteDefaults'
import { useSiteContentStore } from '../stores/siteContent'
import { apiUrl } from '../services/api'

const router = useRouter()
const siteContent = useSiteContentStore()
const tab = ref('admissions')
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const admissions = ref([])
const users = ref([])
const contactMessages = ref([])
const adminEmail = ref('')
const selectedPage = ref('home')
const selectedLanguage = ref('rw')
const draft = reactive({})

const pageNames = {
  home: 'Ahabanza',
  about: 'Ibitwerekeye ishuri',
  services: 'Amasomo',
  contact: 'Twandikire',
  login: 'Kwinjira',
  register: 'Kwiyandikisha',
  navbar: 'Menu',
  footer: 'Umusozo w’urubuga',
  gallery: 'Amafoto',
  admissions: 'Gusaba kwiga'
}

const contentFields = computed(() => Object.entries(draft))

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers
    }
  })
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status}).`)
    error.status = response.status
    throw error
  }
  return data
}

function parseSavedContent(rows) {
  const saved = {}
  for (const row of rows) {
    saved[row.page] ||= {}
    saved[row.page][row.language] ||= {}
    try {
      saved[row.page][row.language][row.content_key] = JSON.parse(row.content_value)
    } catch {
      saved[row.page][row.language][row.content_key] = row.content_value
    }
  }
  return saved
}

function loadDraft() {
  const defaults = siteDefaults[selectedPage.value]?.[selectedLanguage.value] || {}
  const saved = siteContent.overrides[selectedPage.value]?.[selectedLanguage.value] || {}
  for (const key of Object.keys(draft)) {
    delete draft[key]
  }
  for (const [key, defaultValue] of Object.entries(defaults)) {
    const value = saved[key] ?? defaultValue
    draft[key] = Array.isArray(value) ? value.join('\n') : String(value)
  }
}

watch([selectedPage, selectedLanguage], loadDraft)

async function loadAdminData() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [overview, rows, messages] = await Promise.all([
      request('/api/admin/overview'),
      request('/api/admin/content'),
      request('/api/admin/contacts')
    ])
    admissions.value = overview.admissions
    users.value = overview.users
    contactMessages.value = messages
    adminEmail.value = overview.adminEmail
    siteContent.setOverrides(parseSavedContent(rows))
    loadDraft()
  } catch (error) {
    console.error('Admin data load error:', error)
    errorMessage.value = error.message
    if (error.status === 401 || error.status === 403 || error.status === 503) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.replace('/login')
    }
  } finally {
    loading.value = false
  }
}

async function updateAdmission(admission, updates) {
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await request(`/api/admin/admissions/${admission.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
    Object.assign(admission, updates)
    successMessage.value = 'Amakuru y’ubusabe yavuguruwe.'
  } catch (error) {
    console.error('Admission update error:', error)
    errorMessage.value = error.message
  }
}

async function setUserActive(user) {
  const nextStatus = !Boolean(user.is_active)
  if (!window.confirm(nextStatus
    ? 'Urifuza kongera gufungura iyi konti?'
    : 'Urifuza guhagarika iyi konti?')) {
    return
  }

  errorMessage.value = ''
  successMessage.value = ''
  try {
    await request(`/api/admin/users/${user.id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: nextStatus })
    })
    user.is_active = nextStatus ? 1 : 0
    successMessage.value = 'Konti yavuguruwe.'
  } catch (error) {
    console.error('Account update error:', error)
    errorMessage.value = error.message
  }
}

async function saveContent() {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const defaults = siteDefaults[selectedPage.value][selectedLanguage.value]
  const content = {}
  for (const [key, value] of Object.entries(draft)) {
    content[key] = Array.isArray(defaults[key])
      ? value.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
      : value
  }

  try {
    await request('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify({
        page: selectedPage.value,
        language: selectedLanguage.value,
        content
      })
    })
    siteContent.overrides[selectedPage.value] ||= {}
    siteContent.overrides[selectedPage.value][selectedLanguage.value] = content
    successMessage.value = 'Amagambo yabitswe ku rubuga.'
  } catch (error) {
    console.error('Website content save error:', error)
    errorMessage.value = error.message
  } finally {
    saving.value = false
  }
}

async function restoreDefaults() {
  if (!window.confirm('Subiza amagambo y’uru rupapuro ku ya mbere?')) {
    return
  }

  errorMessage.value = ''
  successMessage.value = ''
  try {
    await request(
      `/api/admin/content/${selectedPage.value}/${selectedLanguage.value}`,
      { method: 'DELETE' }
    )
    if (siteContent.overrides[selectedPage.value]) {
      delete siteContent.overrides[selectedPage.value][selectedLanguage.value]
    }
    loadDraft()
    successMessage.value = 'Amagambo asanzwe yagaruwe.'
  } catch (error) {
    console.error('Website content reset error:', error)
    errorMessage.value = error.message
  }
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.replace('/login')
}

onMounted(loadAdminData)
</script>

<template>
  <main class="admin-page">
    <header class="admin-header">
      <div>
        <p class="eyebrow">COLLEGE BAPTISTE GACUBA II</p>
        <h1>Ubuyobozi bw’urubuga</h1>
      </div>
      <button class="logout-button" type="button" @click="logout">Sohoka</button>
    </header>

    <nav class="tabs" aria-label="Ibice by’ubuyobozi">
      <button :class="{ active: tab === 'admissions' }" @click="tab = 'admissions'">
        Abasaba kwiga
      </button>
      <button :class="{ active: tab === 'users' }" @click="tab = 'users'">
        Konti z’abakoresha
      </button>
      <button :class="{ active: tab === 'contacts' }" @click="tab = 'contacts'">
        Ubutumwa
      </button>
      <button :class="{ active: tab === 'content' }" @click="tab = 'content'">
        Amagambo y’urubuga
      </button>
      <button type="button" @click="loadAdminData">Kuvugurura</button>
    </nav>

    <p v-if="errorMessage" class="notice error" role="alert">{{ errorMessage }}</p>
    <p v-if="successMessage" class="notice success" role="status">{{ successMessage }}</p>
    <p v-if="loading" class="notice">Amakuru arimo gufunguka...</p>

    <section v-if="tab === 'admissions' && !loading" class="panel">
      <h2>Ubusabe bwo kwiga</h2>
      <div v-if="!admissions.length" class="empty-state">Nta busabe buraboneka.</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Umunyeshuri</th>
              <th>Ishami</th>
              <th>Aho atuye</th>
              <th>Umubyeyi</th>
              <th>Kwiyandikisha</th>
              <th>Icyemezo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in admissions" :key="item.id">
              <td>
                <strong>{{ item.applicant_name }}</strong>
                <small>{{ item.email || item.phone }}</small>
                <small>{{ item.gender }} · {{ item.religion }}</small>
              </td>
              <td>{{ item.course }} · {{ item.study_level }}</td>
              <td>{{ [item.village, item.sector, item.district, item.province].filter(Boolean).join(', ') }}</td>
              <td>
                {{ item.parent_names }}
                <small>{{ item.parent_phone }}</small>
              </td>
              <td>
                <strong>{{ Number(item.registration_fee).toLocaleString() }} Frw</strong>
                <select
                  :value="item.payment_status"
                  aria-label="Imiterere y’ubwishyu"
                  @change="updateAdmission(item, { paymentStatus: $event.target.value })"
                >
                  <option value="unpaid">Ntarishyura</option>
                  <option value="confirmed">Yemejwe n’ishuri</option>
                </select>
              </td>
              <td>
                <select
                  :value="item.status"
                  aria-label="Imiterere y’ubusabe"
                  @change="updateAdmission(item, { status: $event.target.value })"
                >
                  <option value="pending">Birategereje</option>
                  <option value="approved">Yemewe</option>
                  <option value="rejected">Yanzwe</option>
                </select>
                <small>{{ new Date(item.application_date).toLocaleDateString() }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="tab === 'contacts' && !loading" class="panel">
      <h2>Ubutumwa bwo kuri Contact</h2>
      <div v-if="!contactMessages.length" class="empty-state">Nta butumwa buraboneka.</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Amazina</th>
              <th>Imeyili</th>
              <th>Umutwe</th>
              <th>Ubutumwa</th>
              <th>Itariki</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in contactMessages" :key="item.id">
              <td>{{ item.name }}</td>
              <td><a :href="`mailto:${item.email}`">{{ item.email }}</a></td>
              <td>{{ item.subject }}</td>
              <td class="message-cell">{{ item.message }}</td>
              <td>{{ new Date(item.created_at).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="tab === 'users' && !loading" class="panel">
      <h2>Konti z’abakoresha</h2>
      <div v-if="!users.length" class="empty-state">Nta konti ziraboneka.</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Amazina</th>
              <th>Imeyili</th>
              <th>Uruhare</th>
              <th>Imiterere</th>
              <th>Igikorwa</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.full_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.email.toLowerCase() === adminEmail ? 'Admin' : user.role }}</td>
              <td>{{ user.is_active ? 'Ifunguye' : 'Yahagaritswe' }}</td>
              <td>
                <button
                  v-if="user.email.toLowerCase() !== adminEmail"
                  class="small-button"
                  type="button"
                  @click="setUserActive(user)"
                >
                  {{ user.is_active ? 'Hagarika' : 'Fungura' }}
                </button>
                <span v-else>Admin wenyine</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="tab === 'content' && !loading" class="panel">
      <h2>Guhindura amagambo agaragara ku rubuga</h2>
      <p class="panel-description">
        Hitamo page n’ururimi. Amagambo ahinduwe agaragara ku rubuga nyuma yo kubika.
      </p>
      <div class="content-controls">
        <label>
          Page
          <select v-model="selectedPage">
            <option v-for="(label, page) in pageNames" :key="page" :value="page">
              {{ label }}
            </option>
          </select>
        </label>
        <label>
          Ururimi
          <select v-model="selectedLanguage">
            <option value="rw">Ikinyarwanda</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>

      <div class="editor-fields">
        <label v-for="[key, value] in contentFields" :key="key">
          {{ key }}
          <textarea v-model="draft[key]" rows="2"></textarea>
        </label>
      </div>

      <div class="editor-actions">
        <button class="primary-button" type="button" :disabled="saving" @click="saveContent">
          {{ saving ? 'Birimo kubikwa...' : 'Bika impinduka' }}
        </button>
        <button class="secondary-button" type="button" @click="restoreDefaults">
          Subiza amagambo asanzwe
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  min-height: 80vh;
  padding: 36px 5% 70px;
  background: var(--school-paper);
}

.admin-header,
.tabs,
.content-controls,
.editor-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.admin-header {
  max-width: 1400px;
  margin: 0 auto 24px;
}

.eyebrow {
  color: var(--school-gold-deep);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
}

.admin-header h1 {
  margin-top: 6px;
  color: var(--school-navy);
  font-size: clamp(24px, 4vw, 34px);
}

.tabs,
.panel,
.notice {
  max-width: 1400px;
  margin: 0 auto 18px;
}

.tabs {
  justify-content: flex-start;
  flex-wrap: wrap;
}

.tabs button,
.logout-button,
.small-button,
.primary-button,
.secondary-button {
  padding: 10px 14px;
  border: 1px solid #d0d5dd;
  border-radius: 7px;
  background: white;
  color: #344054;
  font-weight: 600;
  cursor: pointer;
}

.tabs button.active,
.primary-button {
  border-color: var(--school-navy);
  background: var(--school-navy);
  color: #f0d48a;
}

.logout-button {
  border-color: #fda29b;
  color: #b42318;
}

.panel {
  padding: 24px;
  border-top: 3px solid var(--school-gold);
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.panel h2 {
  margin-bottom: 16px;
  color: var(--school-navy);
}

.panel-description {
  margin: -5px 0 18px;
  color: var(--school-muted);
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #eaecf0;
  vertical-align: top;
}

th {
  color: var(--school-navy);
  font-size: 13px;
}

td {
  color: var(--school-ink);
  font-size: 14px;
}

td small {
  display: block;
  margin-top: 4px;
  color: var(--school-muted);
}

td select,
.content-controls select {
  display: block;
  max-width: 190px;
  margin-top: 6px;
  padding: 8px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  background: white;
}

.empty-state {
  padding: 30px;
  color: var(--school-muted);
  text-align: center;
}

.notice {
  padding: 12px 16px;
  border-radius: 7px;
  background: white;
}

.notice.error {
  background: #fef3f2;
  color: #b42318;
}

.notice.success {
  background: #ecfdf3;
  color: #027a48;
}

.content-controls {
  justify-content: flex-start;
  margin-bottom: 22px;
}

.content-controls label,
.editor-fields label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: var(--school-navy);
  font-size: 14px;
  font-weight: 600;
}

.content-controls select {
  min-width: 200px;
  margin-top: 0;
}

.editor-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.editor-fields textarea {
  width: 100%;
  min-height: 60px;
  padding: 10px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  resize: vertical;
  font: inherit;
}

.message-cell {
  min-width: 240px;
  max-width: 480px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.editor-actions {
  justify-content: flex-start;
  margin-top: 20px;
}

.secondary-button {
  color: #b42318;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

@media (max-width: 700px) {
  .admin-page {
    padding-right: 4%;
    padding-left: 4%;
  }

  .panel {
    padding: 18px 14px;
  }

  .editor-fields {
    grid-template-columns: 1fr;
  }

  .content-controls,
  .editor-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
