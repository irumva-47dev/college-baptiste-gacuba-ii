
<template>
  <div class="app-container">
    <!-- WEBSITE NAVBAR -->
    <Navbar />

    <!-- WEBSITE PAGES -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- WEBSITE FOOTER -->
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useSiteContentStore } from './stores/siteContent'

const siteContent = useSiteContentStore()

onMounted(() => {
  siteContent.load().catch((error) => {
    console.error('Website content load error:', error)
  })
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Source+Sans+3:wght@400;600;700&display=swap');

:root {
  --school-navy: #0c2340;
  --school-navy-soft: #16345a;
  --school-gold: #c8960c;
  --school-gold-deep: #9a7208;
  --school-paper: #f7f4ee;
  --school-ink: #1b2836;
  --school-muted: #5d6b7a;
  --school-line: #e6e0d4;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
  color: var(--school-ink);
}

body {
  background: #fff;
}

h1,
h2,
h3 {
  font-family: 'Libre Baskerville', Georgia, serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
