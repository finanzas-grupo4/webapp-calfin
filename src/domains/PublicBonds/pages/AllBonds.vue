<!-- src/domains/PublicBonds/pages/AllBonds.vue -->

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import BondCard from '../components/BondCard.vue';
import publicBondsService from '../services/public-bonds.service.js';
import { useToast } from 'primevue/usetoast';

const bonds = ref([]);
const loading = ref(true);
const toast = useToast();

// Añadir una marca para indicar que estamos en la página de bonos públicos
onBeforeMount(() => {
  document.body.classList.add('public-bonds-page');
});

// Limpiar la marca cuando salgamos de la página
onMounted(() => {
  loadBonds();

  return () => {
    document.body.classList.remove('public-bonds-page');
  };
});

const loadBonds = async () => {
  try {
    loading.value = true;
    console.log('Cargando bonos públicos...');
    const response = await publicBondsService.getAllPublicBonds();

    if (response.success) {
      bonds.value = response.data;
      console.log('Información de depuración:');
      console.log(`Bonds cargados: ${bonds.value.length}`);
      if (bonds.value.length > 0) {
        console.log(JSON.stringify(bonds.value[0], null, 2));
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.message || 'No se pudieron cargar los bonos',
        life: 5000
      });
    }
  } catch (error) {
    console.error('Error al cargar bonos:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error inesperado',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!-- Navbar personalizado para bonos públicos -->
  <header class="public-navbar">
    <div class="navbar-container">
      <div class="logo-container">
        <router-link to="/">
          <img src="@/assets/calfin.png" alt="CalFin Logo" class="nav-logo" />
        </router-link>
      </div>
      <div class="auth-buttons">
        <router-link to="/sign-in" class="auth-button login">Iniciar Sesión</router-link>
        <router-link to="/sign-up" class="auth-button signup">Registrarse</router-link>
      </div>
    </div>
  </header>

  <!-- Video de fondo -->
  <div class="video-background">
    <video autoplay muted loop playsinline>
      <source src="https://st3.depositphotos.com/2218438/18033/v/600/depositphotos_180339756-stock-video-blue-digital-animation-stock-market.mp4" type="video/mp4">
    </video>
    <div class="video-overlay"></div>
  </div>

  <main class="min-h-screen relative z-10 pt-[80px] pb-8 px-4">
    <div class="container mx-auto py-8">
      <div class="header-section">
        <h1>Bonos Corporativos Disponibles</h1>
        <p>Explore los bonos corporativos disponibles en nuestra plataforma. Analice sus características y rendimientos.</p>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Cargando bonos disponibles...</p>
      </div>

      <div v-else-if="bonds.length > 0" class="bonds-container">
        <div class="bonds-grid">
          <BondCard v-for="bond in bonds" :key="bond.id" :bond="bond" />
        </div>

        <div class="bonds-counter">
          <p>Se han cargado <strong>{{ bonds.length }}</strong> bonos</p>
        </div>
      </div>

      <div v-else class="empty-state">
        <h3>No hay bonos disponibles</h3>
        <p>No se encontraron bonos disponibles para mostrar en este momento.</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
  /* Estilos para la barra de navegación personalizada */
  .public-navbar {
    background-color: #DEF5FA;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  height: 60px;
}

  .navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

  .logo-container {
  display: flex;
  align-items: center;
}

  .nav-logo {
  height: 40px;
  width: auto;
}

  .auth-buttons {
  display: flex;
  gap: 15px;
}

  .auth-button {
    font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
}

  .auth-button.login {
  color: #16444E;
  background-color: transparent;
  border: 1.5px solid #16444E;
}

  .auth-button.login:hover {
    background-color: #16444E;
  color: #DEF5FA;
}

  .auth-button.signup {
  color: #DEF5FA;
  background-color: #16444E;
}

  .auth-button.signup:hover {
    background-color: #0f2f38;
}

/* Estilos para el video de fondo - corregidos para pantalla completa */
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

/* Otros estilos existentes */
.header-section {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 2rem 1rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:global(.dark) .header-section {
  background-color: rgba(31, 41, 55, 0.85);
}

.header-section h1 {
  font-size: 2.5rem;
  color: #16444E;
  margin-bottom: 0.8rem;
  font-weight: 700;
}

:global(.dark) .header-section h1 {
  color: #DEF5FA;
}

.header-section p {
  font-size: 1.1rem;
  color: #555;
  max-width: 700px;
  margin: 0 auto;
}

:global(.dark) .header-section p {
  color: #aaa;
}

.bonds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.8rem;
  margin-bottom: 2rem;
}

.bonds-container {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:global(.dark) .bonds-container {
  background-color: rgba(31, 41, 55, 0.85);
}

/* Contador de bonos */
.bonds-counter {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(22, 68, 78, 0.2);
}

.bonds-counter p {
  font-size: 1.1rem;
  color: #16444E;
}

:global(.dark) .bonds-counter p {
  color: #DEF5FA;
}

.bonds-counter strong {
  font-weight: 700;
  font-size: 1.2rem;
}

/* Estilos para la sección vacía */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:global(.dark) .empty-state {
  background-color: rgba(31, 41, 55, 0.85);
}

.empty-state h3 {
  color: #16444E;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

:global(.dark) .empty-state h3 {
  color: #DEF5FA;
}

.empty-state p {
  color: #555;
  font-size: 1.1rem;
}

:global(.dark) .empty-state p {
  color: #aaa;
}
  /* Animación de carga y estados vacíos */
  .loading-container, .empty-state {
    text-align: center;
  padding: 4rem 2rem;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

  :global(.dark) .loading-container,
  :global(.dark) .empty-state {
    background-color: rgba(31, 41, 55, 0.85);
}

  .spinner {
  border: 4px solid rgba(22, 68, 78, 0.1);
  border-radius: 50%;
  border-top: 4px solid #16444E;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

  @keyframes spin {
    0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

  /* Responsive para móviles */
  @media (max-width: 640px) {
  .auth-buttons {
  gap: 8px;
}

  .auth-button {
  padding: 6px 12px;
  font-size: 0.9rem;
}

  .nav-logo {
  height: 32px;
}
}
</style>

