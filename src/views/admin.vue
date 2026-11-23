<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language'
import { siteDefaults } from '../content/siteDefaults'
import { useSiteContentStore } from '../stores/siteContent'
import { apiUrl } from '../services/api'

const router = useRouter()
const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()
const tab = ref('admissions')
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const deletingData = ref(false)
const admissions = ref([])
const users = ref([])
const contactMessages = ref([])
const schoolItems = ref([])
const schoolType = ref('announcements')
const schoolDraft = reactive({ title: '', description: '', date: '', subject: '' })
const resultsCsv = ref('')
const analytics = ref({
  total: 0,
  today: 0,
  week: 0,
  uniqueSessions: 0,
  byPath: [],
  recent: []
})
const adminEmail = ref('')
const selectedPage = ref('home')
const selectedLanguage = ref(languageStore.language)
const draft = reactive({})

const labels = {
  'Ubuyobozi bw’urubuga': 'Website Administration',
  'Birimo gusibwa...': 'Deleting...',
  'Siba amakuru yose': 'Delete all data',
  'Sohoka': 'Log out',
  'Ibice by’ubuyobozi': 'Administration sections',
  'Abasaba kwiga': 'Applicants',
  'Konti z’abakoresha': 'User accounts',
  'Ubutumwa': 'Messages',
  'Amagambo y’urubuga': 'Website content',
  'Abasura urubuga': 'Website visits',
  'Amakuru y’ishuri': 'School information',
  'Kuvugurura': 'Refresh',
  'Amakuru arimo gufunguka...': 'Loading information...',
  'Ubusabe bwo kwiga': 'Admission applications',
  'Nta busabe buraboneka.': 'No applications available.',
  'Umunyeshuri': 'Student',
  'Ishami': 'Program',
  'Aho atuye': 'Address',
  'Umubyeyi': 'Parent',
  'Papa:': 'Father:',
  'Mama:': 'Mother:',
  'Kwiyandikisha': 'Registration',
  'Icyemezo': 'Status',
  'Umukino:': 'Sport:',
  'Ubwishingizi:': 'Insurance:',
  'Imiterere y’ubwishyu': 'Payment status',
  'Ntarishyura': 'Unpaid',
  'Yemejwe n’ishuri': 'Confirmed by school',
  'Imiterere y’ubusabe': 'Application status',
  'Birategereje': 'Pending',
  'Yemewe': 'Approved',
  'Yanzwe': 'Rejected',
  'Ubutumwa bwo kuri Contact': 'Contact messages',
  'Nta butumwa buraboneka.': 'No messages available.',
  'Amazina': 'Name',
  'Imeyili': 'Email',
  'Umutwe': 'Title',
  'Umutwe w’ubutumwa': 'Subject',
  'Ubutumwa bwanditse': 'Message',
  'Itariki': 'Date',
  'Umubare w’ibihe urubuga rusuwe': 'Total visits',
  'Uyu munsi': 'Today',
  'Iminsi 7 ishize': 'Last 7 days',
  'Sessions zitandukanye': 'Unique sessions',
  'Pages zakunze gusurwa': 'Most visited pages',
  'Nta sura ryanditswe.': 'No visits recorded.',
  'Surwa ziheruka': 'Recent visits',
  'Nta konti ziraboneka.': 'No accounts available.',
  'Uruhare': 'Role',
  'Imiterere': 'Status',
  'Igikorwa': 'Action',
  'Ifunguye': 'Active',
  'Yahagaritswe': 'Disabled',
  'Hagarika': 'Disable',
  'Fungura': 'Enable',
  'Admin wenyine': 'Administrator',
  'Amatangazo y’ishuri': 'School announcements',
  'Ubwoko bw’amakuru': 'Information type',
  'Amatangazo': 'Announcements',
  'Ibisobanuro': 'Description',
  'Isomo cyangwa amakuru y’inyongera': 'Subject or additional information',
  'Bika amakuru': 'Save information',
  'Siba': 'Delete',
  'Kuzana amanota ukoresheje CSV': 'Import results using CSV',
  'Ingeramo amanota': 'Import results',
  'Guhindura amagambo agaragara ku rubuga': 'Edit website text',
  'Hitamo page n’ururimi. Amagambo ahinduwe agaragara ku rubuga nyuma yo kubika.': 'Choose a page and language. Changes appear on the website after saving.',
  'Page': 'Page',
  'Ururimi': 'Language',
  'Ikinyarwanda': 'Kinyarwanda',
  'Birimo kubikwa...': 'Saving...',
  'Bika impinduka': 'Save changes',
  'Subiza amagambo asanzwe': 'Restore default text',
  'Server yasubije ibisubizo bitari JSON.': 'The server returned a non-JSON response.',
  'Izina ry’itangazo cyangwa umutwe urakenewe.': 'An announcement name or title is required.',
  'CSV y’amanota ifite header n’imirongo itazuyaza.': 'The results CSV must include headers and at least one data row.',
  'Amakuru y’ubusabe yavuguruwe.': 'Application updated.',
  'Amakuru y’ishuri yabitswe.': 'School information saved.',
  'Urifuza gusiba iki kintu?': 'Are you sure you want to delete this item?',
  'Amakuru yasibwe.': 'Information deleted.',
  'Urifuza kongera gufungura iyi konti?': 'Do you want to enable this account?',
  'Urifuza guhagarika iyi konti?': 'Do you want to disable this account?',
  'Konti yavuguruwe.': 'Account updated.',
  'Amagambo yabitswe ku rubuga.': 'Website text saved.',
  'Subiza amagambo y’uru rupapuro ku ya mbere?': 'Restore the default text for this page?',
  'Amagambo asanzwe yagaruwe.': 'Default text restored.',
  'Ibi bizasiba ubusabe bwose, ubutumwa bwose, n’konti z’abakoresha zose zitari admin. Ntibishobora gusubizwa. Komeza?': 'This will permanently delete all applications, messages, and non-admin accounts. Continue?',
  'Andika "SIBA BYOSE" kugira ngo wemeze gusiba amakuru yose.': 'Type "DELETE ALL" to confirm deleting all data.',
  'SIBA BYOSE': 'DELETE ALL',
  'Amakuru yasibwe: {admissions} ubusabe, {contacts} ubutumwa, {users} konti, na {visits} sura.': 'Deleted: {admissions} applications, {contacts} messages, {users} accounts, and {visits} visits.'
}
const pageNames = computed(() => languageStore.language === 'en'
  ? {
      home: 'Home',
      about: 'About the school',
      services: 'Academics',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      navbar: 'Navigation',
      footer: 'Footer',
      gallery: 'Gallery',
      admissions: 'Admissions'
    }
  : {
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
    })

function tr(text) {
  return languageStore.language === 'en' ? labels[text] || text : text
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
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      response.ok
        ? 'Server yasubije ibisubizo bitari JSON.'
        : `Server ntabonetse (${response.status}).`
    )
  }
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
    const [overview, rows, messages, visitOverview] = await Promise.all([
      request('/api/admin/overview'),
      request('/api/admin/content'),
      request('/api/admin/contacts'),
      request('/api/analytics/overview')
    ])
    admissions.value = overview.admissions
    users.value = overview.users
    contactMessages.value = messages
    adminEmail.value = overview.adminEmail
    analytics.value = visitOverview
    siteContent.setOverrides(parseSavedContent(rows))
    loadDraft()
    await loadSchoolItems()
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
    successMessage.value = tr('Amakuru y’ubusabe yavuguruwe.')
  } catch (error) {
    console.error('Admission update error:', error)
    errorMessage.value = error.message
  }
}

async function loadSchoolItems() {
  try {
    schoolItems.value = await request(`/api/school-data/${schoolType.value}`)
  } catch (error) {
    schoolItems.value = []
    errorMessage.value = error.message
  }
}

watch(schoolType, loadSchoolItems)

async function saveSchoolItem() {
  if (!schoolDraft.title.trim()) {
    errorMessage.value = tr('Izina ry’itangazo cyangwa umutwe urakenewe.')
    return
  }
  try {
    await request(`/api/school-data/admin/${schoolType.value}`, {
      method: 'POST',
      body: JSON.stringify(schoolDraft)
    })
    Object.keys(schoolDraft).forEach(key => { schoolDraft[key] = '' })
    await loadSchoolItems()
    successMessage.value = tr('Amakuru y’ishuri yabitswe.')
  } catch (error) {
    errorMessage.value = error.message
  }
}

async function deleteSchoolItem(item) {
  if (!window.confirm(tr('Urifuza gusiba iki kintu?'))) return
  try {
    await request(`/api/school-data/admin/${schoolType.value}/${item.id}`, { method: 'DELETE' })
    await loadSchoolItems()
    successMessage.value = tr('Amakuru yasibwe.')
  } catch (error) {
    errorMessage.value = error.message
  }
}

function parseResultsCsv(csv) {
  const lines = csv.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines.shift().split(',').map(value => value.trim().toLowerCase())
  return lines.map(line => {
    const values = line.split(',').map(value => value.trim())
    const row = {}
    headers.forEach((header, index) => { row[header] = values[index] || '' })
    return row
  })
}

async function importResults() {
  const rows = parseResultsCsv(resultsCsv.value)
  if (!rows.length) {
    errorMessage.value = tr('CSV y’amanota ifite header n’imirongo itazuyaza.')
    return
  }
  try {
    const result = await request('/api/school-data/admin/results/import', {
      method: 'POST',
      body: JSON.stringify({ rows })
    })
    resultsCsv.value = ''
    successMessage.value = languageStore.language === 'en'
      ? `${result.imported} result(s) imported.`
      : `Amanota ${result.imported} yashyizwemo.`
  } catch (error) {
    errorMessage.value = error.message
  }
}

async function setUserActive(user) {
  const nextStatus = !Boolean(user.is_active)
  if (!window.confirm(nextStatus
    ? tr('Urifuza kongera gufungura iyi konti?')
    : tr('Urifuza guhagarika iyi konti?'))) {
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
    successMessage.value = tr('Konti yavuguruwe.')
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
    successMessage.value = tr('Amagambo yabitswe ku rubuga.')
  } catch (error) {
    console.error('Website content save error:', error)
    errorMessage.value = error.message
  } finally {
    saving.value = false
  }
}

async function restoreDefaults() {
  if (!window.confirm(tr('Subiza amagambo y’uru rupapuro ku ya mbere?'))) {
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
    successMessage.value = tr('Amagambo asanzwe yagaruwe.')
  } catch (error) {
    console.error('Website content reset error:', error)
    errorMessage.value = error.message
  }
}

async function deleteAllData() {
  if (!window.confirm(
    tr('Ibi bizasiba ubusabe bwose, ubutumwa bwose, n’konti z’abakoresha zose zitari admin. Ntibishobora gusubizwa. Komeza?')
  )) {
    return
  }

  const confirmation = window.prompt(
    tr('Andika "SIBA BYOSE" kugira ngo wemeze gusiba amakuru yose.')
  )
  if (confirmation !== tr('SIBA BYOSE')) {
    return
  }

  deletingData.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const result = await request('/api/admin/data', { method: 'DELETE' })
    admissions.value = []
    contactMessages.value = []
    users.value = users.value.filter(user =>
      user.email.toLowerCase() === adminEmail.value.toLowerCase()
    )
    analytics.value = {
      total: 0,
      today: 0,
      week: 0,
      uniqueSessions: 0,
      byPath: [],
      recent: []
    }
    successMessage.value = tr('Amakuru yasibwe: {admissions} ubusabe, {contacts} ubutumwa, {users} konti, na {visits} sura.')
      .replace('{admissions}', result.deleted.admissions)
      .replace('{contacts}', result.deleted.contactMessages)
      .replace('{users}', result.deleted.users)
      .replace('{visits}', result.deleted.pageVisits || 0)
  } catch (error) {
    console.error('Admin data deletion error:', error)
    errorMessage.value = error.message
  } finally {
    deletingData.value = false
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
        <h1>{{ tr('Ubuyobozi bw’urubuga') }}</h1>
      </div>
      <div class="header-actions">
        <button
          class="danger-button"
          type="button"
          :disabled="deletingData"
          @click="deleteAllData"
        >
          {{ deletingData ? tr('Birimo gusibwa...') : tr('Siba amakuru yose') }}
        </button>
        <button class="logout-button" type="button" @click="logout">{{ tr('Sohoka') }}</button>
      </div>
    </header>

    <nav class="tabs" :aria-label="tr('Ibice by’ubuyobozi')">
      <button :class="{ active: tab === 'admissions' }" @click="tab = 'admissions'">
        {{ tr('Abasaba kwiga') }}
      </button>
      <button :class="{ active: tab === 'users' }" @click="tab = 'users'">
        {{ tr('Konti z’abakoresha') }}
      </button>
      <button :class="{ active: tab === 'contacts' }" @click="tab = 'contacts'">
        {{ tr('Ubutumwa') }}
      </button>
      <button :class="{ active: tab === 'content' }" @click="tab = 'content'">
        {{ tr('Amagambo y’urubuga') }}
      </button>
      <button :class="{ active: tab === 'analytics' }" @click="tab = 'analytics'">
        {{ tr('Abasura urubuga') }}
      </button>
      <button :class="{ active: tab === 'school' }" @click="tab = 'school'; loadSchoolItems()">
        {{ tr('Amakuru y’ishuri') }}
      </button>
      <button type="button" @click="loadAdminData">{{ tr('Kuvugurura') }}</button>
    </nav>

    <p v-if="errorMessage" class="notice error" role="alert">{{ errorMessage }}</p>
    <p v-if="successMessage" class="notice success" role="status">{{ successMessage }}</p>
    <p v-if="loading" class="notice">{{ tr('Amakuru arimo gufunguka...') }}</p>

    <section v-if="tab === 'admissions' && !loading" class="panel">
      <h2>{{ tr('Ubusabe bwo kwiga') }}</h2>
      <div v-if="!admissions.length" class="empty-state">{{ tr('Nta busabe buraboneka.') }}</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ tr('Umunyeshuri') }}</th>
              <th>{{ tr('Ishami') }}</th>
              <th>{{ tr('Aho atuye') }}</th>
              <th>{{ tr('Umubyeyi') }}</th>
              <th>{{ tr('Kwiyandikisha') }}</th>
              <th>{{ tr('Icyemezo') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in admissions" :key="item.id">
              <td>
                <strong>{{ item.applicant_name }}</strong>
                <small>{{ item.email || item.phone }}</small>
                <small>{{ item.gender }} · {{ item.religion }}</small>
              </td>
              <td>
                {{ item.course }} · {{ item.study_level }}
                <small>{{ tr('Umukino:') }} {{ item.sport || '-' }}</small>
              </td>
              <td>{{ [item.village, item.sector, item.district, item.province].filter(Boolean).join(', ') }}</td>
              <td>
                {{ tr('Papa:') }} {{ item.father_names || item.parent_names || '-' }}
                <small>{{ item.father_phone || item.parent_phone || '-' }}</small>
                {{ tr('Mama:') }} {{ item.mother_names || '-' }}
                <small>{{ item.mother_phone || '-' }}</small>
                <small>{{ tr('Ubwishingizi:') }} {{ item.insurance || '-' }}</small>
              </td>
              <td>
                <strong>{{ Number(item.registration_fee).toLocaleString() }} Frw</strong>
                <select
                  :value="item.payment_status"
                  :aria-label="tr('Imiterere y’ubwishyu')"
                  @change="updateAdmission(item, { paymentStatus: $event.target.value })"
                >
                  <option value="unpaid">{{ tr('Ntarishyura') }}</option>
                  <option value="confirmed">{{ tr('Yemejwe n’ishuri') }}</option>
                </select>
              </td>
              <td>
                <select
                  :value="item.status"
                  :aria-label="tr('Imiterere y’ubusabe')"
                  @change="updateAdmission(item, { status: $event.target.value })"
                >
                  <option value="pending">{{ tr('Birategereje') }}</option>
                  <option value="approved">{{ tr('Yemewe') }}</option>
                  <option value="rejected">{{ tr('Yanzwe') }}</option>
                </select>
                <small>{{ new Date(item.application_date).toLocaleDateString() }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="tab === 'contacts' && !loading" class="panel">
      <h2>{{ tr('Ubutumwa bwo kuri Contact') }}</h2>
      <div v-if="!contactMessages.length" class="empty-state">{{ tr('Nta butumwa buraboneka.') }}</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ tr('Amazina') }}</th>
              <th>{{ tr('Imeyili') }}</th>
              <th>{{ tr('Umutwe w’ubutumwa') }}</th>
              <th>{{ tr('Ubutumwa bwanditse') }}</th>
              <th>{{ tr('Itariki') }}</th>
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

    <section v-if="tab === 'analytics' && !loading" class="panel">
      <h2>{{ tr('Abasuye urubuga') }}</h2>
      <div class="analytics-cards">
        <div><strong>{{ analytics.total }}</strong><span>{{ tr('Umubare w’ibihe urubuga rusuwe') }}</span></div>
        <div><strong>{{ analytics.today }}</strong><span>{{ tr('Uyu munsi') }}</span></div>
        <div><strong>{{ analytics.week }}</strong><span>{{ tr('Iminsi 7 ishize') }}</span></div>
        <div><strong>{{ analytics.uniqueSessions }}</strong><span>{{ tr('Sessions zitandukanye') }}</span></div>
      </div>

      <div class="analytics-grid">
        <div>
          <h3>{{ tr('Pages zakunze gusurwa') }}</h3>
          <div v-if="!analytics.byPath.length" class="empty-state">{{ tr('Nta sura ryanditswe.') }}</div>
          <ol v-else class="path-list">
            <li v-for="item in analytics.byPath" :key="item.path">
              <code>{{ item.path }}</code>
              <strong>{{ item.count }}</strong>
            </li>
          </ol>
        </div>

        <div>
          <h3>{{ tr('Surwa ziheruka') }}</h3>
          <div v-if="!analytics.recent.length" class="empty-state">{{ tr('Nta sura ryanditswe.') }}</div>
          <div v-else class="recent-visits">
            <div v-for="item in analytics.recent" :key="item.id">
              <code>{{ item.path }}</code>
              <small>{{ new Date(item.visited_at).toLocaleString() }}</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="tab === 'users' && !loading" class="panel">
      <h2>{{ tr('Konti z’abakoresha') }}</h2>
      <div v-if="!users.length" class="empty-state">{{ tr('Nta konti ziraboneka.') }}</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ tr('Amazina') }}</th>
              <th>{{ tr('Imeyili') }}</th>
              <th>{{ tr('Uruhare') }}</th>
              <th>{{ tr('Imiterere') }}</th>
              <th>{{ tr('Igikorwa') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.full_name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.email.toLowerCase() === adminEmail ? 'Admin' : user.role === 'student' ? tr('Umunyeshuri') : user.role }}</td>
              <td>{{ user.is_active ? tr('Ifunguye') : tr('Yahagaritswe') }}</td>
              <td>
                <button
                  v-if="user.email.toLowerCase() !== adminEmail"
                  class="small-button"
                  type="button"
                  @click="setUserActive(user)"
                >
                  {{ user.is_active ? tr('Hagarika') : tr('Fungura') }}
                </button>
                <span v-else>{{ tr('Admin wenyine') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="tab === 'school' && !loading" class="panel">
      <h2>{{ tr('Amatangazo y’ishuri') }}</h2>
      <div class="content-controls">
        <label>
          {{ tr('Ubwoko bw’amakuru') }}
          <select v-model="schoolType">
            <option value="announcements">{{ tr('Amatangazo') }}</option>
          </select>
        </label>
      </div>

      <div class="school-editor">
        <label>{{ tr('Umutwe') }}
          <input v-model="schoolDraft.title" maxlength="200" />
        </label>
        <label>{{ tr('Ibisobanuro') }}
          <textarea v-model="schoolDraft.description" rows="3"></textarea>
        </label>
        <label>{{ tr('Itariki') }}
          <input v-model="schoolDraft.date" type="date" />
        </label>
        <label>{{ tr('Isomo cyangwa amakuru y’inyongera') }}
          <input v-model="schoolDraft.subject" maxlength="200" />
        </label>
        <button class="primary-button" type="button" @click="saveSchoolItem">{{ tr('Bika amakuru') }}</button>
      </div>

      <div v-if="schoolItems.length" class="school-items">
        <article v-for="item in schoolItems" :key="item.id">
          <div><strong>{{ item.title }}</strong><small v-if="item.date">{{ item.date }}</small></div>
          <button class="secondary-button" type="button" @click="deleteSchoolItem(item)">{{ tr('Siba') }}</button>
        </article>
      </div>

      <hr />
      <h3>{{ tr('Kuzana amanota ukoresheje CSV') }}</h3>
      <p class="panel-description">
        CSV itangirana na headers: student_email,student_name,term,subject,score,grade
      </p>
      <textarea v-model="resultsCsv" class="csv-editor" rows="5"
        placeholder="student_email,student_name,term,subject,score,grade&#10;student@example.com,Name,Term 1,Mathematics,85,A"></textarea>
      <button class="primary-button import-button" type="button" @click="importResults">
        {{ tr('Ingeramo amanota') }}
      </button>
    </section>

    <section v-if="tab === 'content' && !loading" class="panel">
      <h2>{{ tr('Guhindura amagambo agaragara ku rubuga') }}</h2>
      <p class="panel-description">
        {{ tr('Hitamo page n’ururimi. Amagambo ahinduwe agaragara ku rubuga nyuma yo kubika.') }}
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
          {{ tr('Ururimi') }}
          <select v-model="selectedLanguage">
            <option value="rw">{{ tr('Ikinyarwanda') }}</option>
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
          {{ saving ? tr('Birimo kubikwa...') : tr('Bika impinduka') }}
        </button>
        <button class="secondary-button" type="button" @click="restoreDefaults">
          {{ tr('Subiza amagambo asanzwe') }}
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
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

.danger-button {
  border: 1px solid #b42318;
  background: #b42318;
  color: white;
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

.analytics-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.analytics-cards div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  background: #fcfcfd;
}

.analytics-cards strong {
  color: var(--school-navy);
  font-size: 28px;
}

.analytics-cards span {
  color: var(--school-muted);
  font-size: 13px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.analytics-grid h3 {
  margin-bottom: 10px;
  color: var(--school-navy);
  font-size: 16px;
}

.path-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.path-list li,
.recent-visits div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid #eaecf0;
}

.path-list code,
.recent-visits code {
  overflow-wrap: anywhere;
}

.recent-visits div {
  align-items: flex-start;
  flex-direction: column;
  gap: 3px;
}

.school-editor {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.school-editor label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--school-navy);
  font-weight: 600;
}

.school-editor input,
.school-editor textarea,
.csv-editor {
  width: 100%;
  padding: 9px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  font: inherit;
}

.school-items {
  margin: 12px 0 20px;
}

.school-items article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eaecf0;
}

.school-items small {
  display: block;
  color: var(--school-muted);
}

.csv-editor {
  min-height: 110px;
  resize: vertical;
}

.import-button {
  margin-top: 10px;
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

  .analytics-cards,
  .analytics-grid,
  .school-editor {
    grid-template-columns: 1fr;
  }

  .content-controls,
  .editor-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
