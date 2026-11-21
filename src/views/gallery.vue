
<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useSiteContentStore } from '../stores/siteContent'
import { siteDefaults } from '../content/siteDefaults'

const languageStore = useLanguageStore()
const siteContent = useSiteContentStore()
const uploadedPhotos = ref([])
const fileInput = ref(null)
const content = computed(() => {
  const language = languageStore.language
  return siteContent.merge('gallery', language, siteDefaults.gallery[language])
})
const schoolContent = computed(() => {
  const language = languageStore.language
  return siteContent.merge('home', language, siteDefaults.home[language] || siteDefaults.home.en)
})
const photos = computed(() => [
  { id: 'students', name: schoolContent.value.photoStudents, url: '/st.png' },
  { id: 'grounds', name: schoolContent.value.photoGrounds, url: '/schol.png' },
  { id: 'campus', name: schoolContent.value.photoCampus, url: '/schlchch.jpg' },
  ...uploadedPhotos.value
])

function openFilePicker() {
  fileInput.value.click()
}

function uploadPhotos(event) {
  const files = Array.from(event.target.files)

  files.forEach((file) => {
    if (!file.type.startsWith('image/')) {
      alert(`${file.name} ${content.value.invalidImage}`)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(`${file.name} ${content.value.tooLarge}`)
      return
    }

    const photo = {
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file)
    }

    uploadedPhotos.value.push(photo)
  })

  // Allows selecting the same image again
  event.target.value = ''
}

function deletePhoto(id) {
  const photo = uploadedPhotos.value.find(item => item.id === id)

  if (photo) {
    URL.revokeObjectURL(photo.url)
  }

  uploadedPhotos.value = uploadedPhotos.value.filter(item => item.id !== id)
}

onBeforeUnmount(() => {
  uploadedPhotos.value.forEach(photo => {
    URL.revokeObjectURL(photo.url)
  })
})
</script>

<template>
  <div class="gallery-page">

    <!-- GALLERY HERO -->
    <section class="gallery-hero">
      <span class="hero-label">{{ content.label }}</span>
      <h1>{{ content.title }}</h1>
      <p>{{ content.description }}</p>

      <button class="upload-btn" @click="openFilePicker">
        <i class="bi bi-cloud-arrow-up"></i>
        {{ content.upload }}
      </button>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        hidden
        @change="uploadPhotos"
      />

      <small>{{ content.uploadHelp }}</small>
    </section>

    <!-- GALLERY CONTENT -->
    <section class="gallery-content">

      <div class="gallery-heading">
        <div>
          <h2>{{ content.memories }}</h2>
          <p>{{ content.activities }}</p>
        </div>

        <span class="photo-count">
          {{ photos.length }} {{ content.photos }}
        </span>
      </div>

      <!-- EMPTY GALLERY -->
      <div v-if="photos.length === 0" class="empty-gallery">
        <i class="bi bi-images"></i>
        <h3>{{ content.emptyTitle }}</h3>
        <p>{{ content.emptyDescription }}</p>

        <button @click="openFilePicker">
          {{ content.choosePhotos }}
        </button>
      </div>

      <!-- UPLOADED PHOTOS -->
      <div v-else class="photo-grid">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="photo-card"
        >
          <img :src="photo.url" :alt="photo.name" />

          <div class="photo-overlay">
            <span>{{ photo.name }}</span>

            <button
              v-if="typeof photo.id === 'number'"
              class="delete-btn"
              @click="deletePhoto(photo.id)"
              :title="content.deletePhoto"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<style scoped>
.gallery-page {
  min-height: 80vh;
  background: #fff;
}

/* HERO */
.gallery-hero {
  text-align: center;
  padding: 75px 20px;
  color: white;
  background:
    linear-gradient(105deg, rgba(8, 20, 36, 0.9), rgba(8, 20, 36, 0.58)),
    url('/schol.png') center 42% / cover no-repeat;
}

.hero-label {
  color: #f0d48a;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 2px;
}

.gallery-hero h1 {
  color: white;
  font-size: 42px;
  font-weight: 800;
  margin: 15px 0;
}

.gallery-hero p {
  color: rgba(255, 255, 255, 0.88);
  font-size: 17px;
  line-height: 1.7;
  max-width: 650px;
  margin: 0 auto 25px;
}

.upload-btn {
  background: var(--school-gold);
  color: var(--school-navy);
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.upload-btn:hover {
  background: #e0b333;
  transform: translateY(-2px);
}

.upload-btn i {
  margin-right: 8px;
}

.gallery-hero small {
  display: block;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 15px;
}

/* GALLERY CONTENT */
.gallery-content {
  max-width: 1300px;
  margin: auto;
  padding: 55px 6%;
}

.gallery-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.gallery-heading h2 {
  color: var(--school-navy);
  font-size: 28px;
  margin-bottom: 8px;
}

.gallery-heading p {
  color: #667085;
}

.photo-count {
  background: var(--school-paper);
  color: var(--school-navy);
  padding: 9px 15px;
  border-radius: 20px;
  font-weight: 600;
}

/* EMPTY STATE */
.empty-gallery {
  background: white;
  text-align: center;
  padding: 65px 20px;
  border: 2px dashed var(--school-line);
  border-radius: 14px;
}

.empty-gallery > i {
  font-size: 55px;
  color: var(--school-gold-deep);
}

.empty-gallery h3 {
  color: var(--school-navy);
  margin: 15px 0 8px;
}

.empty-gallery p {
  color: #667085;
  margin-bottom: 20px;
}

.empty-gallery button {
  background: var(--school-gold);
  color: var(--school-navy);
  border: none;
  border-radius: 7px;
  padding: 12px 22px;
  cursor: pointer;
}

/* PHOTO GRID */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.photo-card {
  position: relative;
  height: 260px;
  overflow: hidden;
  border-radius: 12px;
  background: #e2e8f0;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.08);
}

.photo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.photo-card:hover img {
  transform: scale(1.07);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 15px;
  color: white;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
}

.photo-overlay span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 9px 11px;
  cursor: pointer;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .gallery-hero h1 {
    font-size: 30px;
  }

  .photo-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .photo-card {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .photo-grid {
    grid-template-columns: 1fr;
  }

  .gallery-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
