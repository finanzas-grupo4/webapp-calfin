<template>
  <div class="home-container">
    <h1>Inicio</h1>
    <hr />
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
  margin-top: 50px;
}

hr {
  width: 90%;
  margin: 20px auto;
}

.button-container {
  display: flex;
  justify-content: center;
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
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #85b9c4;
}
</style>
