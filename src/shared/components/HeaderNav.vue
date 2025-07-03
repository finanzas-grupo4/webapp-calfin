<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthenticationStore } from '@/domains/IAM/services/authentication.store.js';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const router = useRouter();
const authStore = useAuthenticationStore();

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const signOut = () => {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    authStore.signOut(router);
  }
};


// Lógica de Dark Mode
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
});

</script>

<template>
  <header class="header-nav">
    <nav class="nav-container">
      <div class="logo-container">
        <router-link to="/">
          <img src="@/assets/calfin.png" alt="CalFin Logo" class="nav-logo" />
        </router-link>
      </div>
      <div class="mobile-menu-toggle" @click="toggleMobileMenu">
        <font-awesome-icon icon="bars" />
      </div>

      <div class="nav-items" :class="{ 'mobile-open': isMobileMenuOpen }">
        <div class="nav-item home" @click="closeMobileMenu">
          <router-link to="/">
            <font-awesome-icon icon="home" />
            <span>Inicio</span>
          </router-link>
        </div>

        <div class="nav-item profile" @click="closeMobileMenu">
          <router-link to="/profile">
            <font-awesome-icon icon="user" />
            <span>Mi Cuenta</span>
          </router-link>
        </div>

        <!-- Espacio flexible que empuja los elementos a la derecha -->
        <div class="flex-spacer"></div>

        <!-- Toggle Switch para Dark Mode -->
        <div class="nav-item dark-mode-toggle">
          <span class="mode-label">{{ isDarkMode ? 'Oscuro' : 'Claro' }}</span>
          <label class="switch">
            <input type="checkbox" @change="toggleDarkMode" :checked="isDarkMode">
            <span class="slider round">
              <font-awesome-icon :icon="isDarkMode ? 'moon' : 'sun'" class="toggle-icon" />
            </span>
          </label>
        </div>

        <div class="nav-item sign-out" @click="closeMobileMenu">
          <a href="#" @click.prevent="signOut">
            <font-awesome-icon icon="sign-out-alt" />
            <span>Cerrar Sesión</span>
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header-nav {
  background-color: #16444E;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.flex-spacer {
  flex-grow: 1;
}

.nav-item a {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item a:hover {
  color: #DEF5FA;
}

.nav-item.dark-mode {
  margin-left: auto;
}

.nav-item.dark-mode a {
  color: #ffd700;
}

.nav-item.sign-out a {
  color: #ff6b6b;
}

.mobile-menu-toggle {
  display: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
}

span {
  margin-left: 5px;
}

:root.dark {
  --bg-color: #121212;
  --text-color: #f5f5f5;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .nav-items {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #16444E;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-150%);
    opacity: 0;
    transition: transform 0.3s ease-in-out, opacity 0.3s;
    z-index: 999;
    height: auto;
    visibility: hidden;
  }

  .nav-items.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-items .nav-item {
    width: 100%;
    text-align: left;
    padding: 10px 0;
  }

  .nav-items .nav-item a {
    font-size: 16px;
    padding: 5px 0;
    display: block;
  }

  .flex-spacer {
    display: none;
  }

  .nav-item.dark-mode {
    margin-left: 0;
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 10px;
  }

  .nav-item.sign-out {
    margin-top: 5px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.2);
  }
}

/* Estilos para el toggle switch */
.dark-mode-toggle {
  display: flex;
  align-items: center;
  margin-right: 5px;
}

.mode-label {
  color: white;
  margin-right: 8px;
  font-size: 0.9rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1d5561;
  transition: .4s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  z-index: 2;
}

input:checked + .slider {
  background-color: #0c2429;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.toggle-icon {
  color: white;
  font-size: 12px;
  z-index: 1;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .dark-mode-toggle {
    margin-left: 0;
    justify-content: space-between;
    width: 100%;
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 10px;
  }
}
/* Estilos para el logo */
.logo-container {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.nav-logo {
  height: 40px;
  width: auto;
}

@media (max-width: 768px) {
  .nav-logo {
    height: 30px;
  }
}
</style>
