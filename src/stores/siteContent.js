import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiUrl } from '../services/api'

export const useSiteContentStore = defineStore('siteContent', () => {
  const overrides = ref({})
  const loaded = ref(false)

  async function load() {
    const response = await fetch(apiUrl('/api/content'))
    if (!response.ok) {
      throw new Error(`Content request failed (${response.status}).`)
    }

    overrides.value = await response.json()
    loaded.value = true
  }

  function merge(page, language, defaults) {
    return {
      ...defaults,
      ...(overrides.value[page]?.[language] || {})
    }
  }

  function setOverrides(value) {
    overrides.value = value
  }

  return { overrides, loaded, load, merge, setOverrides }
})
