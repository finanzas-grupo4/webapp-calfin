<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthenticationStore } from '@/domains/IAM/services/authentication.store.js';

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
</script>

<template>
  <header class="header-nav">
    <nav class="nav-container">
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
  background-color: #765532;
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
  color: #A88662;
}

.nav-item.sign-out {
  margin-left: auto !important;
}

.sign-out a {
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

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .nav-items {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #765532;
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

  .nav-item.sign-out {
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.2);
  }
}
</style>
