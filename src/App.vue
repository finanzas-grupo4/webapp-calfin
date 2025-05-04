<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto py-8 px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analizador de flujo de caja de bonos corporativos</h1>
        <button
            @click="toggleDarkMode"
            class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {{ isDarkMode ? 'Modo Claro' : 'Modo Oscuro' }}
        </button>
      </div>
      <BondAnalyzer />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BondAnalyzer from './Calculator/Components/BondAnalyzer.vue';

// Estado reactivo para rastrear el modo oscuro
const isDarkMode = ref(false);

// Función para cambiar el modo
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    // Añade la clase 'dark' al elemento <html>
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    // Remueve la clase 'dark' del elemento <html>
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
};

// Comprueba la preferencia guardada al montar el componente
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode');
  // Comprueba explícitamente si es 'true'
  if (savedMode === 'true') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    // Asegúrate de que la clase 'dark' no esté presente si no está activado
    // y actualiza el estado reactivo si es necesario
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
});
</script>