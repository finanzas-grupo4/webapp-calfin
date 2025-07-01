<script>
import { useAuthenticationStore } from "../services/authentication.store.js";
import { SignUpRequest } from "../model/sign-up.request.js";

export default {
  name: "sign-up",
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
      errorMessage: ""
    };
  },
  methods: {
    async onSignUp() {
      this.submitted = true;
      this.errorMessage = "";

      if (!this.username || !this.password) {
        this.errorMessage = "Todos los campos son obligatorios.";
        return;
      }

      const signUpRequest = new SignUpRequest(this.username, this.password);

      const authenticationStore = useAuthenticationStore();

      try {
        await authenticationStore.signUp(signUpRequest, this.$router, this.$toast);
      } catch (error) {
        this.errorMessage =
            error.response?.data?.message || "Error al registrarse. Inténtalo de nuevo.";
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="signup">
      <h2 class="title">¡Regístrate!</h2>
    </div>
    <form @submit.prevent="onSignUp">
      <div class="p-fluid">
        <div class="field mt-5">
          <div class="p-float-label">
            <InputText
                id="username"
                v-model="username"
                :class="{'p-invalid': submitted && !username}"
            />
            <label for="username">Usuario</label>
          </div>
          <small v-if="submitted && !username" class="p-invalid">El nombre de usuario es obligatorio.</small>
        </div>
        <div class="field mt-5">
          <div class="p-float-label">
            <InputText
                id="password"
                v-model="password"
                type="password"
                :class="{'p-invalid': submitted && !password}"
            />
            <label for="password">Contraseña</label>
          </div>
          <small v-if="submitted && !password" class="p-invalid">La contraseña es obligatoria.</small>
        </div>
        <div class="registration-question">
          <router-link to="/sign-in" class="register-link">
            <span class="text-registro">¿Ya tienes una cuenta?</span>
            <span class="route-to-registration">Iniciar Sesión</span>
          </router-link>
        </div>
      </div>
      <div class="button-container">
        <Button class="btn-register" type="submit">Registrarse</Button>
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
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.signup img {
  max-width: 150px;
  margin-bottom: 1rem;
}

.title {
  color: var(--primary-color);
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

.password-input-container {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 2;
}

.password-strength-container {
  margin-top: 0.5rem;
}

.password-strength-meter {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  margin-bottom: 0.25rem;
  overflow: hidden;
}

.password-strength-progress {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.very-weak { background-color: #f44336; }
.weak { background-color: #ff9800; }
.medium { background-color: #ffeb3b; }
.strong { background-color: #8bc34a; }
.very-strong { background-color: #4caf50; }

.password-strength-text {
  font-size: 0.8rem;
  font-weight: 500;
}

.very-weak-text { color: #f44336; }
.weak-text { color: #ff9800; }
.medium-text { color: #a3a300; }
.strong-text { color: #8bc34a; }
.very-strong-text { color: #4caf50; }

.password-requirements {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-light);
}

.requirement-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.requirement-item i {
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.requirement-item:not(.requirement-met) i {
  color: var(--error-color);
}

.requirement-met {
  color: var(--primary-color);
}

.requirement-met i {
  color: #4caf50;
}
.recaptcha-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  flex-direction: column;
  align-items: center;
}
.terms-checkbox-container {
  display: flex;
  align-items: flex-start;
  margin: 0.5rem 0;
}

.terms-label {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--text-dark);
}

.terms-link {
  color: var(--primary-color);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.terms-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}
:deep(.p-inputtext) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--primary-light);
  border-radius: 1rem;
  background-color: var(--primary-lighter);
  color: var(--text-dark);
  transition: all 0.3s;
}
:deep(.p-dropdown) {
  width: 100%;
  border: 1px solid var(--primary-light);
  border-radius: 1rem;
  background-color: var(--primary-lighter);
  transition: all 0.3s;
}

:deep(.p-dropdown-label) {
  padding: 0.75rem;
  color: var(--text-dark);
}

:deep(.p-dropdown-trigger) {
  width: 3rem;
  background-color: transparent;
  color: var(--primary-color);
}

:deep(.p-dropdown-panel) {
  border: 1px solid var(--primary-light);
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  box-shadow: var(--shadow);
  background-color: var(--white);
}

:deep(.p-dropdown-items) {
  padding: 0.5rem 0;
}

:deep(.p-dropdown-item) {
  padding: 0.75rem 1rem;
  color: var(--text-dark);
  transition: all 0.2s;
}

:deep(.p-dropdown-item:hover) {
  background-color: var(--primary-lighter);
  color: var(--primary-color);
}

:deep(.p-dropdown-item.p-highlight) {
  background-color: var(--primary-lighter);
  color: var(--primary-color);
  font-weight: 600;
}

:deep(.p-dropdown.p-focus) {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(118, 85, 50, 0.2);
}

:deep(.p-dropdown.p-invalid) {
  border-color: var(--error-color);
}
:deep(.p-inputtext:focus){
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(118, 85, 50, 0.2);
}

:deep(.p-inputtext.p-invalid){
  border-color: var(--error-color);
}

:deep(label) {
  color: var(--primary-color);
}

.p-invalid, .p-error {
  color: var(--error-color);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.registration-question {
  text-align: center;
  margin: 1.5rem 0;
}

.text-registro {
  color: var(--text-light);
}

.route-to-registration {
  color: var(--primary-color);
  font-weight: 600;
  margin-left: 0.25rem;
}

.register-link {
  text-decoration: none;
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
  width: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.btn-register:hover) {
  background-color: var(--primary-light);
  box-shadow: 0 4px 8px rgba(168, 134, 98, 0.3);
}

:deep(.btn-register:focus) {
  box-shadow: 0 0 0 2px rgba(118, 85, 50, 0.4);
}

:deep(.p-toast) {
  opacity: 0.95;
}
</style>

