<template>
  <div class="edit-profile">
    <div class="edit-profile-card">
      <h2 class="edit-title">Editar Perfil</h2>
      <form @submit.prevent="handleUpdate" class="edit-form">

        <label for="email">Email</label>
        <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Ingresa tu correo electrónico"
        />

        <label for="age">Edad</label>
        <input
            id="age"
            v-model="form.age"
            type="number"
            min="0"
            required
            placeholder="Ingresa tu edad"
        />

        <button type="submit">Guardar Cambios</button>

        <small v-if="errorMessage" class="p-error">{{ errorMessage }}</small>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ProfileService } from '@/domains/Profiles/services/profiles.service.js';

const profileService = new ProfileService();
const router = useRouter();

const form = ref({
  id: null,
  username: '',
  email: '',
  age: '',
});

const errorMessage = ref('');

onMounted(async () => {
  const userId = Number(localStorage.getItem('userId'));
  try {
    const response = await profileService.getProfileByUserId(userId);
    const profile = response.data;
    form.value = {
      id: profile.id,
      username: profile.username,
      email: profile.email || '',
      age: profile.age || '',
    };
  } catch (error) {
    console.error('Error al cargar perfil', error);
    alert('No se pudo cargar el perfil');
  }
});

const handleUpdate = async () => {
  errorMessage.value = '';

  // Validaciones
  if (!form.value.username || !form.value.email || form.value.age === '') {
    errorMessage.value = 'Todos los campos son obligatorios.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = 'Ingrese un email válido.';
    return;
  }

  try {
    await profileService.updateProfile(form.value.id, {
      email: form.value.email,
      age: form.value.age,
    });
    alert('Perfil actualizado correctamente');
    router.push('/profile');
  } catch (error) {
    console.error('Error al actualizar perfil', error);
    alert('Error al guardar cambios');
  }
};
</script>

<style scoped>
.edit-profile {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 6rem;
  min-height: 100vh;
  background-color: #f4f6f8;
}

.edit-profile-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

.edit-title {
  font-size: 1.6rem;
  color: #16444e;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 700;
}

.edit-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #16444e;
}

input {
  margin-bottom: 1.2rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 1rem;
  background-color: white;
  color: #000;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #16444e;
  outline: none;
}

button {
  padding: 0.6rem;
  background-color: #16444e;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1d5a66;
}

.p-error {
  color: #c0392b;
  font-size: 0.9rem;
  margin-top: 0.8rem;
  text-align: center;
}

:root.dark .edit-profile {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

:root.dark .edit-profile-card {
  background-color: #2a2a2a;
}

:root.dark .edit-profile label {
  color: #f5f5f5;
}

:root.dark .edit-profile input {
  background-color: #3a3a3a;
  color: #f5f5f5;
  border-color: #555;
}

:root.dark .edit-profile input:focus {
  border-color: #79c2d0;
}

:root.dark .edit-profile button {
  background-color: #446d73;
}

:root.dark .edit-profile button:hover {
  background-color: #5d8a96;
}

:root.dark .p-error {
  color: #ff6b6b;
}
</style>


