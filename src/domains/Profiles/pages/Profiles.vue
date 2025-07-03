<template>
  <div class="profile-page">
    <div class="card">
      <h1 class="title">MI CUENTA</h1>

      <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          class="avatar"
          alt="Avatar"
      />
      <p class="section-label">PERFIL</p>

      <div class="info-box">{{ profile.username }}</div>
      <div class="info-box">{{ profile.email || 'Email' }}</div>
      <div class="info-box">
        {{ profile.age !== null && profile.age !== '' ? profile.age : 'Edad' }}
      </div>

      <button class="edit-btn" @click="goToEdit">Editar Perfil</button>
      <button class="logout-btn" @click="logout">Cerrar Sesión</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthenticationStore } from '@/domains/IAM/services/authentication.store';
import { ProfileService } from '@/domains/Profiles/services/profiles.service.js';

const profile = ref({ username: '', email: '', age: '' });
const authStore = useAuthenticationStore();
const router = useRouter();
const profileService = new ProfileService();

onMounted(async () => {
  const userId = Number(localStorage.getItem('userId'));
  if (!userId) return;

  try {
    const response = await profileService.getProfileByUserId(userId);
    profile.value = response.data;
  } catch (error) {
    console.error('Error al cargar el perfil', error);
    alert('No se pudo cargar el perfil');
  }
});

const goToEdit = () => {
  router.push('/profile/edit');
};

const logout = () => {
  localStorage.clear();
  authStore.$reset();
  router.push('/sign-in');
};
</script>

<style scoped>
.profile-page {
  text-align: center;
  padding-top: 6rem;
  min-height: 100vh;
  background-color: #f4f6f8;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 2rem;
  color: #16444e;
  margin-bottom: 2rem;
  font-weight: 700;
}

.card {
  background-color: #ffffff;
  padding: 2rem;
  margin: auto;
  max-width: 400px;
  border-radius: 20px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 90px;
  height: 90px;
  margin-bottom: 1rem;
  border-radius: 50%;
  border: 3px solid #16444e;
}

.section-label {
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #16444e;
}

.info-box {
  width: 100%;
  padding: 0.6rem 1rem;
  margin: 0.4rem 0;
  background-color: #e1e9ec;
  border-radius: 12px;
  font-size: 1rem;
  color: #333;
  text-align: left;
}

.edit-btn,
.logout-btn {
  width: 100%;
  padding: 0.6rem;
  margin-top: 1rem;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #16444e;
  color: white;
}

.edit-btn:hover {
  background-color: #1d5a66;
}

.logout-btn {
  background-color: #c0392b;
  color: white;
}

.logout-btn:hover {
  background-color: #e74c3c;
}


:root.dark .profile-page {
  background-color: #1e1e1e;
  color: #f5f5f5;
}

:root.dark .card {
  background-color: #2c2c2c;
}

:root.dark .info-box {
  background-color: #3a3a3a;
  color: #f5f5f5;
}

:root.dark .edit-btn {
  background-color: #555;
  color: #f5f5f5;
}

:root.dark .logout-btn {
  background-color: #aa0000;
  color: #fff;
}

</style>