<script setup>
import BondAnalyzer from '../Components/BondAnalyzer.vue';
</script>

<template>
  <!-- Video de fondo -->
  <div class="video-background">
    <video autoplay muted loop playsinline>
      <source src="https://st3.depositphotos.com/2218438/18033/v/600/depositphotos_180339756-stock-video-blue-digital-animation-stock-market.mp4" type="video/mp4">
    </video>
    <div class="video-overlay"></div>
  </div>


  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 relative z-10 pt-[60px]">
    <div class="container mx-auto py-8 px-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Analizador de flujo de caja de bonos corporativos</h1>
      </div>
      <BondAnalyzer />
    </div>
  </main>
</template>



<style scoped>
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

main {
  position: relative;
  z-index: 1;
  background-color: transparent !important;
  margin-top: 0; /* Elimina el margen si existiera y usa padding en su lugar */
}
</style>