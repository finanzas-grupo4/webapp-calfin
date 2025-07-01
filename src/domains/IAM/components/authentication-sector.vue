<script>
import { useAuthenticationStore } from "../services/authentication.store.js";
import router from "@/router/index.js";

export default {
  name: "authentication-section",
  data() {
    return {
      authenticationStore: useAuthenticationStore(),
      activeButton: null,
      showMenu: false,
      closingMenu: false
    };
  },
  computed: {
    isSignedIn() {
      console.log('Estado de isSignedIn:', this.authenticationStore.isSignedIn);
      return this.authenticationStore.isSignedIn;
    },
    currentUsername() {
      console.log('Username actual:', this.authenticationStore.username);
      return this.authenticationStore.username || 'Invitado';
    }
  },
  methods: {
    onSignIn() {
      this.activeButton = 'sign-in';
      router.push({ name: 'sign-in' });
      this.closeMenuWithDelay();
    },
    onSignUp() {
      this.activeButton = 'sign-up';
      router.push({ name: 'sign-up' });
      this.closeMenuWithDelay();
    },
    onSignOut() {
      this.authenticationStore.signOut(router);
    },
    updateActiveButton() {
      if (router.currentRoute.value.name === 'sign-in') {
        this.activeButton = 'sign-in';
      } else if (router.currentRoute.value.name === 'sign-up') {
        this.activeButton = 'sign-up';
      } else {
        this.activeButton = null;
      }
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.closeMenuWithDelay();
      }
    },
    closeMenuWithDelay() {
      this.closingMenu = true;
      setTimeout(() => {
        this.showMenu = false;
        this.closingMenu = false;
      }, 300); // Adjust the delay time as needed
    }
  },
  created() {
    this.updateActiveButton();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  watch: {
    '$route'() {
      this.updateActiveButton();
    }
  }
}
</script>

<template>
  <div v-if="isSignedIn">
    <a class="welcome"> Bienvenido,
      <span>{{ currentUsername }}</span>
    </a>
    <a class="signout" @click="onSignOut">Sign Out <i class="pi pi-sign-out" style="font-size: 1rem"></i>
    </a>
  </div>
  <div v-else>
    <div class="desktop-buttons">
      <pv-button :class="['signin', { active: activeButton === 'sign-in' }]" @click="onSignIn">Iniciar Sesión</pv-button>
      <pv-button :class="['signup', { active: activeButton === 'sign-up' }]" @click="onSignUp">Registrarse</pv-button>
    </div>
    <div class="mobile-menu">
      <pv-button icon="pi pi-bars" @click="toggleMenu"></pv-button>
      <div :class="['dropdown-menu', { closing: closingMenu }]" v-if="showMenu">
        <pv-button :class="['signin', { active: activeButton === 'sign-in' }]" @click="onSignIn">Iniciar Sesión</pv-button>
        <pv-button :class="['signup', { active: activeButton === 'sign-up' }]" @click="onSignUp">Registrarse</pv-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  font-family: Nunito, sans-serif;
  text-decoration: none;
  font-size: 22px;
  padding: 0.6em;
  cursor: pointer;
  color: #2C3E50;
  background-color: rgba(126, 137, 64, 0);
  align-items: center;
  width: auto !important;
  border-radius: 2em;
}

.welcome {
  border: none;
}

.signin {
  color: #27AE60;
  font-size: 18px;
  border-color: #27AE60;
  background-color: rgba(39, 174, 96, 0);
  border-radius: 2em;
  padding: 15px 30px;
  cursor: pointer;
  margin-right: 1em;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.signin:hover {
  background-color: #27AE60;
  color: white;
  transform: scale(1.1);
}

.signup {
  background-color: #27AE60;
  color: #fff;
  font-size: 18px;
  border: none;
  border-radius: 2em;
  padding: 15px 30px;
  cursor: pointer;
  margin-right: 1em;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.signup:hover {
  background-color: #2cdc78;
  transform: scale(1.1);
}

.signout {
  color: indianred;
  font-weight: bolder;
  border: none;
  border-radius: 2em;
  padding: 13px;
  cursor: pointer;
  margin-right: 1em;
  transition: color 0.3s ease, transform 0.3s ease;
}

.signout:hover {
  color: #a41f12;
  transform: scale(1.05);
}

span {
  font-weight: 800 !important;
}

.desktop-buttons {
  display: flex;
}

.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .desktop-buttons {
    display: none;
  }
  .mobile-menu {
    display: block;
  }
  .signin, .signup {
    display: block;
    margin: 0.5em;
  }
  .dropdown-menu {
    display: flex;
    flex-direction: column;
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    right: 0; /* Align the menu to the right of the container */
    transform: translateX(-0%); /* Move the menu to the left */
    transition: opacity 0.2s, transform 0.2s;
  }
  .dropdown-menu.closing {
    opacity: 0;
    transform: translateY(-10%);
  }
  .welcome {
    display: none; /* Hide the welcome message on mobile */
  }
}
</style>