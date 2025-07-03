<template>
  <div class="home-container">
    <div class="button-container">
      <button @click="goToCalculator('emisor')">EMISOR DE BONO</button>
      <button @click="goToCalculator('inversor')">INVERSOR Y BONISTA</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToCalculator = (role) => {
  router.push({ name: 'Calculator', query: { role } })
}
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 100px;
  background-color: #ffffff;
  min-height: calc(100vh - 60px); /* espacio si hay navbar fija */
  padding: 2rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.button-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 50px;
  margin-top: 40px;
}

button {
  background-color: #99cbd6;
  padding: 30px 40px;
  border-radius: 15px;
  border: none;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #0b2e34;
}

button:hover {
  background-color: #85b9c4;
}

.page-container {
  margin-top: 60px;
}

:root.dark .home-container {
  background-color: #2c2c2c;
  color: #f5f5f5;
}

:root.dark .button-container button {
  background-color: #447e8c;
  color: #ffffff;
}

:root.dark .button-container button:hover {
  background-color: #3a6f7b;
}
</style>