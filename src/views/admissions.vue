<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'
import { apiUrl } from '../services/api'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()
const loading = ref(false)
const statusMessage = ref('')
const application = ref(null)
const form = reactive({
  applicantName: '',
  email: '',
  gender: '',
  religion: '',
  course: '',
  studyLevel: '',
  sport: '',
  village: '',
  district: '',
  sector: '',
  province: '',
  fatherNames: '',
  fatherPhone: '',
  motherNames: '',
  motherPhone: '',
  insurance: ''
})

const translations = {
  en: {
    schoolLabel: 'COLLEGE BAPTISTE GACUBA II',
    title: 'Apply for Admission',
    subtitle: 'Complete this form to apply to College Baptiste Gacuba II.',
    studentInfo: 'Student Information',
    studentName: 'Student full name',
    email: 'Email address (optional)',
    gender: 'Gender',
    religion: 'Religion',
    choose: 'Choose...',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    course: 'Program',
    olevel: 'O-Level',
    software: 'Software Development',
    accounting: 'Accounting',
    studyLevel: 'Year / level applying for',
    sport: 'Sport played',
    chooseSport: 'Choose sport',
    sports: 'Football',
    sportBasketball: 'Basketball',
    sportVolleyball: 'Volleyball',
    sportAthletics: 'Athletics',
    sportNone: 'No sport',
    address: 'Home Address',
    village: 'Village',
    district: 'District',
    sector: 'Sector',
    province: 'Province',
    parentInfo: 'Parent or Guardian',
    fatherNames: 'Father full name',
    fatherPhone: 'Father phone number',
    motherNames: 'Mother full name',
    motherPhone: 'Mother phone number',
    insurance: 'Health insurance used',
    insuranceChoose: 'Choose insurance',
    insuranceRssb: 'RSSB',
    insurancePrivate: 'Private insurance',
    insuranceNone: 'No insurance',
    submit: 'Submit Application',
    submitting: 'Submitting...',
    requestError: 'The application could not be saved. Please try again.',
    successTitle: 'Application received',
    applicationId: 'Application number',
    pending: 'Your application is pending review. Registration is not complete until the school confirms your payment.',
    paymentTitle: 'Registration payment',
    paymentInstruction: 'Send the registration fee of 3,000 RWF using MoMo to this number:',
    paymentWarning: 'MoMo API payment is not connected yet. Keep your payment confirmation; the school will verify it manually. Do not share your MoMo PIN.',
    backToForm: 'Submit another application'
  },
  rw: {
    schoolLabel: 'COLLEGE BAPTISTE GACUBA II',
    title: 'Saba Kwiga',
    subtitle: 'Uzuza iyi fishi usabe kwiga muri College Baptiste Gacuba II.',
    studentInfo: 'Amakuru y’Umunyeshuri',
    studentName: 'Amazina y’umunyeshuri',
    email: 'Imeyili (si ngombwa)',
    gender: 'Igitsina',
    religion: 'Idini asengeramo',
    choose: 'Hitamo...',
    male: 'Gabo',
    female: 'Gore',
    other: 'Ikindi',
    course: 'Ishami umunyeshuri ashaka',
    olevel: 'O-Level',
    software: 'Software Development',
    accounting: 'Accounting (Ibaruramari)',
    studyLevel: 'Umwaka cyangwa urwego asaba kwigamo',
    sport: 'Umukino akina',
    chooseSport: 'Hitamo umukino',
    sports: 'Umupira w’amaguru',
    sportBasketball: 'Basketball',
    sportVolleyball: 'Volleyball',
    sportAthletics: 'Imikino y’amaguru',
    sportNone: 'Nta mukino',
    address: 'Aho Umunyeshuri Atuye',
    village: 'Umudugudu',
    district: 'Akarere',
    sector: 'Umurenge',
    province: 'Intara',
    parentInfo: 'Amakuru y’Umubyeyi cyangwa Umurera',
    fatherNames: 'Amazina ya papa',
    fatherPhone: 'Nimero ya telefoni ya papa',
    motherNames: 'Amazina ya mama',
    motherPhone: 'Nimero ya telefoni ya mama',
    insurance: 'Ubwishingizi afite',
    insuranceChoose: 'Hitamo ubwishingizi',
    insuranceRssb: 'RSSB',
    insurancePrivate: 'Ubwishingizi bw’ikigo cyihariye',
    insuranceNone: 'Nta bwishingizi',
    submit: 'Ohereza Ubusabe',
    submitting: 'Ubusabe burimo koherezwa...',
    requestError: 'Ubusabe ntibwabitswe. Ongera ugerageze.',
    successTitle: 'Ubusabe bwakiriwe',
    applicationId: 'Nimero y’ubusabe',
    pending: 'Ubusabe bwawe burasuzumwa. Kwiyandikisha ntikurangira ishuri ritaragenzura ubwishyu.',
    paymentTitle: 'Amafaranga yo kwiyandikisha',
    paymentInstruction: 'Ohereza amafaranga yo kwiyandikisha angana na 3,000 Frw kuri MoMo kuri iyi nimero:',
    paymentWarning: 'Kwishyura hakoreshejwe API ya MoMo ntibirahuzwa. Bika ubutumwa bwemeza ko wishyuye; ishuri rizagenzura ubwishyu. Ntugire uwo uha PIN ya MoMo.',
    backToForm: 'Ohereza ubundi busabe'
  }
}

const content = computed(() =>
  siteContent.merge(
    'admissions',
    languageStore.language,
    translations[languageStore.language] || translations.en
  )
)

const availableLevels = computed(() => ({
  'O-Level': ['S1', 'S2', 'S3'],
  'Software Development': ['L3', 'L4', 'L5'],
  Accounting: ['S4', 'S5', 'S6']
}[form.course] || []))

function levelLabel(level) {
  if (form.course === 'Accounting') {
    return `${level} Accounting`
  }
  if (form.course === 'Software Development') {
    return `${level} Software Development`
  }
  return level
}

watch(() => form.course, () => {
  if (!availableLevels.value.includes(form.studyLevel)) {
    form.studyLevel = ''
  }
})

async function submitApplication() {
  loading.value = true
  statusMessage.value = ''

  try {
    const response = await fetch(apiUrl('/api/admissions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    const data = await response.json()

    if (!response.ok) {
      statusMessage.value = data.message || content.value.requestError
      return
    }

    application.value = data
  } catch (error) {
    console.error('Admission application error:', error)
    statusMessage.value = content.value.requestError
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
  application.value = null
  statusMessage.value = ''
}
</script>

<template>
  <main class="admissions-page">
    <header class="page-header">
      <span class="eyebrow">{{ content.schoolLabel }}</span>
      <h1>{{ content.title }}</h1>
      <p>{{ content.subtitle }}</p>
    </header>

    <section v-if="!application" class="application-card">
      <form @submit.prevent="submitApplication">
        <div class="form-section">
        <h2>{{ content.studentInfo }}</h2>

        <div class="form-grid">
          <label>
            {{ content.studentName }}
            <input v-model.trim="form.applicantName" maxlength="150" required />
          </label>

          <label>
            {{ content.email }}
            <input v-model.trim="form.email" type="email" maxlength="150" />
          </label>

          <label>
            {{ content.gender }}
            <select v-model="form.gender" required>
              <option value="" disabled>{{ content.choose }}</option>
              <option value="Male">{{ content.male }}</option>
              <option value="Female">{{ content.female }}</option>
              <option value="Other">{{ content.other }}</option>
            </select>
          </label>

          <label>
            {{ content.religion }}
            <input v-model.trim="form.religion" maxlength="100" required />
          </label>

          <label>
            {{ content.course }}
            <select v-model="form.course" required>
              <option value="" disabled>{{ content.choose }}</option>
              <option value="O-Level">{{ content.olevel }}</option>
              <option value="Software Development">{{ content.software }}</option>
              <option value="Accounting">{{ content.accounting }}</option>
            </select>
          </label>

          <label>
            {{ content.studyLevel }}
            <select v-model="form.studyLevel" :disabled="!availableLevels.length" required>
              <option value="" disabled>{{ content.choose }}</option>
              <option v-for="level in availableLevels" :key="level" :value="level">
                {{ levelLabel(level) }}
              </option>
            </select>
          </label>

          <label>
            {{ content.sport }}
            <select v-model="form.sport" required>
              <option value="" disabled>{{ content.chooseSport }}</option>
              <option value="Football">{{ content.sports }}</option>
              <option value="Basketball">{{ content.sportBasketball }}</option>
              <option value="Volleyball">{{ content.sportVolleyball }}</option>
              <option value="Athletics">{{ content.sportAthletics }}</option>
              <option value="None">{{ content.sportNone }}</option>
            </select>
          </label>
        </div>
        </div>

        <div class="form-section">
        <h2>{{ content.address }}</h2>
        <div class="form-grid">
          <label>
            {{ content.village }}
            <input v-model.trim="form.village" maxlength="100" required />
          </label>
          <label>
            {{ content.district }}
            <input v-model.trim="form.district" maxlength="100" required />
          </label>
          <label>
            {{ content.sector }}
            <input v-model.trim="form.sector" maxlength="100" required />
          </label>
          <label>
            {{ content.province }}
            <input v-model.trim="form.province" maxlength="100" required />
          </label>
        </div>
        </div>

        <div class="form-section">
        <h2>{{ content.parentInfo }}</h2>
        <div class="form-grid">
          <label>
            {{ content.fatherNames }}
            <input v-model.trim="form.fatherNames" maxlength="150" required />
          </label>
          <label>
            {{ content.fatherPhone }}
            <input v-model.trim="form.fatherPhone" type="tel" maxlength="30" required />
          </label>
          <label>
            {{ content.motherNames }}
            <input v-model.trim="form.motherNames" maxlength="150" required />
          </label>
          <label>
            {{ content.motherPhone }}
            <input v-model.trim="form.motherPhone" type="tel" maxlength="30" required />
          </label>
          <label>
            {{ content.insurance }}
            <select v-model="form.insurance" required>
              <option value="" disabled>{{ content.insuranceChoose }}</option>
              <option value="RSSB">{{ content.insuranceRssb }}</option>
              <option value="Private">{{ content.insurancePrivate }}</option>
              <option value="None">{{ content.insuranceNone }}</option>
            </select>
          </label>
        </div>
        </div>

        <p v-if="statusMessage" class="form-message error" role="alert">
          {{ statusMessage }}
        </p>

        <button class="submit-button" type="submit" :disabled="loading">
          {{ loading ? content.submitting : content.submit }}
        </button>
      </form>
    </section>

    <section v-else class="application-card confirmation" role="status">
      <div class="success-icon"><i class="bi bi-check-lg"></i></div>
      <h2>{{ content.successTitle }}</h2>
      <p>{{ content.applicationId }}: <strong>{{ application.applicationId }}</strong></p>
      <p>{{ content.pending }}</p>

      <div class="payment-instructions">
        <h3>{{ content.paymentTitle }}</h3>
        <p>{{ content.paymentInstruction }}</p>
        <p class="payment-number">{{ application.paymentNumber }}</p>
        <p class="payment-amount">3,000 RWF</p>
        <p class="payment-warning">{{ content.paymentWarning }}</p>
      </div>

      <button class="submit-button" type="button" @click="resetForm">
        {{ content.backToForm }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.admissions-page {
  min-height: 80vh;
  padding: 48px 20px 70px;
  background: #f1f5f9;
}

.page-header {
  max-width: 760px;
  margin: 0 auto 30px;
  text-align: center;
}

.eyebrow {
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
}

.page-header h1 {
  margin: 10px 0;
  color: #12346b;
  font-size: clamp(28px, 5vw, 40px);
}

.page-header p {
  color: #667085;
  line-height: 1.6;
}

.application-card {
  max-width: 850px;
  margin: 0 auto;
  padding: clamp(22px, 5vw, 42px);
  border-radius: 14px;
  background: white;
  box-shadow: 0 5px 22px rgba(0, 0, 0, 0.06);
}

.application-card h2 {
  margin: 26px 0 16px;
  color: #12346b;
  font-size: 20px;
}

.application-card h2:first-child {
  margin-top: 0;
}

.form-section {
  margin-top: 22px;
  padding: 20px;
  border: 1px solid #e4e7ec;
  border-radius: 10px;
  background: #fcfcfd;
}

.form-section:first-child {
  margin-top: 0;
}

.form-section h2 {
  margin-top: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}

.form-grid .full-width {
  grid-column: 1 / -1;
}

.form-grid input,
.form-grid select {
  width: 100%;
  min-height: 45px;
  padding: 10px 12px;
  border: 1px solid #d0d5dd;
  border-radius: 7px;
  background: white;
  color: #101828;
  font: inherit;
}

.form-grid input:focus,
.form-grid select:focus {
  border-color: #2563eb;
  outline: 2px solid rgba(37, 99, 235, 0.15);
}

.submit-button {
  width: 100%;
  margin-top: 24px;
  padding: 14px;
  border: 0;
  border-radius: 7px;
  background: #12346b;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.submit-button:hover {
  background: #2563eb;
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.form-message {
  margin-top: 18px;
  padding: 12px;
  border-radius: 7px;
}

.form-message.error {
  background: #fef3f2;
  color: #b42318;
}

.confirmation {
  max-width: 650px;
  text-align: center;
}

.success-icon {
  display: grid;
  width: 54px;
  height: 54px;
  margin: 0 auto 12px;
  place-items: center;
  border-radius: 50%;
  background: #ecfdf3;
  color: #027a48;
  font-size: 28px;
}

.confirmation h2 {
  margin-top: 0;
}

.confirmation > p {
  margin: 12px 0;
  color: #475467;
  line-height: 1.6;
}

.payment-instructions {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  background: #eff6ff;
}

.payment-instructions h3 {
  margin-bottom: 10px;
  color: #12346b;
}

.payment-instructions p {
  margin: 8px 0;
  color: #344054;
  line-height: 1.55;
}

.payment-number,
.payment-amount {
  font-size: 22px;
  font-weight: 800;
}

.payment-warning {
  font-size: 13px;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
