
<script setup>


import HeaderNav from './shared/components/HeaderNav.vue';
import { ref, computed, onMounted } from 'vue';
import { useAuthenticationStore } from '@/domains/IAM/services/authentication.store.js';

const authStore = useAuthenticationStore();
const isAuthenticated = computed(() => authStore.isSignedIn);

const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
};

onMounted(() => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'true') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }

  // Verificar si hay token guardado al cargar la app
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  if (token && username) {
    authStore.id = null;
    authStore.username = username;
    authStore.token = token;
    authStore.isSignedIn = true;
  }
});

</script>

<template>
  <div class="app-container">
    <HeaderNav v-if="isAuthenticated" />
    <main class="main-content" :class="{ 'no-header': !isAuthenticated }">
      <router-view />
    </main>
    <button
        @click="toggleDarkMode"
        class="fixed bottom-4 right-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 z-50"
    >
      {{ isDarkMode ? 'Modo Claro' : 'Modo Oscuro' }}
    </button>
  </div>
</template>

<style scoped>
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.video-background video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
}

:global(.dark) .video-overlay {
  background: rgba(17, 24, 39, 0.3);

}

main {
  position: relative;
  z-index: 1;
  background-color: transparent !important;
}
</style>