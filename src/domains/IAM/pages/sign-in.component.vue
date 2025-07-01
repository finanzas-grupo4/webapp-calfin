<script>
import { useAuthenticationStore } from "../services/authentication.store.js";
import { SignInRequest } from "../model/sign-in.request.js";

export default {
  name: "sign-in",
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
      errorMessage: ""
    };
  },
  methods: {
    async onSignIn() {
      this.submitted = true;
      this.errorMessage = "";
      if (this.username && this.password) {
        let authenticationStore = useAuthenticationStore();
        let signInRequest = new SignInRequest(this.username, this.password);
        try {
          await authenticationStore.signIn(signInRequest, this.$router, this.$toast);
        } catch (error) {
          this.errorMessage =
              error.response?.data?.message || "Error al iniciar sesión. Inténtalo de nuevo.";
        }
      } else {
        this.errorMessage = "Usuario y contraseña son requeridos.";
      }
    }
  }
}

</script>

<template>
  <div class="container">
    <div class="login">
      <h2 class="title">Bienvenido de vuelta!</h2>
    </div>
    <form @submit.prevent="onSignIn">
      <div class="p-fluid">
        <div class="field mt-5">
          <div class="p-float-label">
            <InputText id="username" v-model="username" :class="{'p-invalid': submitted && !username}"/>
            <label for="username">Usuario</label>
          </div>
          <small v-if="submitted && !username" class="p-invalid">Usuario es requerido.</small>
        </div>
        <div class="field mt-5">
          <div class="p-float-label">
            <InputText id="password" v-model="password" :class="{'p-invalid': submitted && !password}" type="password"/>
            <label for="password">Contraseña</label>
          </div>
          <small v-if="submitted && !password" class="p-invalid">Contraseña es requerida</small>
        </div>
        <div class="registration-question">
          <router-link style="text-decoration: none !important;" :to="{ path: '/sign-up' }">
            <span class="text-registro">¿No tienes una cuenta aún?</span> <span class="route-to-registration">Crear cuenta</span>
          </router-link>
        </div>
      </div>
      <div class="button-container">
        <Button class="btn-register" type="submit">Iniciar sesión</Button>
      </div>
      <small v-if="errorMessage" class="p-error block mt-2">{{ errorMessage }}</small>
    </form>
    <Toast />
  </div>
</template>

<style scoped>
.container {
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.login img {
  max-width: 150px;
  margin-bottom: 1rem;
}
.title {
  color: #16444E;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.field {
  margin-bottom: 1.5rem;
}

.p-float-label {
  position: relative;
}

:deep(.p-inputtext) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #A88662;
  border-radius: 1rem;
  background-color: #faf6f2;
  color: #333;
  transition: all 0.3s;
}

:deep(.p-inputtext:focus) {
  border-color: #765532;
  box-shadow: 0 0 0 2px rgba(118, 85, 50, 0.2);
}

:deep(.p-inputtext.p-invalid) {
  border-color: #ef4444;
}

:deep(label) {
  color: #765532;
}

.p-invalid {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.registration-question {
  text-align: center;
  margin: 1.5rem 0;
}
.recaptcha-container {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  flex-direction: column;
  align-items: center;
}
.text-registro {
  color: #666;
}

.route-to-registration {
  color: #765532;
  font-weight: 600;
  margin-left: 0.25rem;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;

}

:deep(.btn-register) {
  background-color: #765532;
  border: none;
  border-radius: 6rem;
  color: white;
  padding: 0.75rem 2rem;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
  width: 58%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.btn-register:hover) {
  background-color: #A88662;
  box-shadow: 0 4px 8px rgba(168, 134, 98, 0.3);
}

:deep(.btn-register:focus) {
  box-shadow: 0 0 0 2px rgba(118, 85, 50, 0.4);
}

:deep(.p-toast) {
  opacity: 0.95;
}
</style>