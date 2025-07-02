<!-- src/domains/PublicBonds/components/BondCard.vue -->
<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';

const props = defineProps({
  bond: {
    type: Object,
    required: true
  }
});

// Formatear la fecha
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return dateString;
  }
};

// Formatear número con 2 decimales
const formatNumber = (num) => {
  if (typeof num !== 'number') return '0.00';
  return num.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Convertir nombres de frecuencia en español
const translateFrequency = (frequency) => {
  const translations = {
    'MENSUAL': 'Mensual',
    'TRIMESTRAL': 'Trimestral',
    'SEMESTRAL': 'Semestral',
    'ANUAL': 'Anual'
  };
  return translations[frequency] || frequency;
};

// Traducir unidades de tiempo
const translateTermUnit = (unit) => {
  return unit === 'YEARS' ? 'años' : 'meses';
};
</script>

<template>
  <Card class="bond-card">
    <template #header>
      <div class="card-header">
        <h3>{{ bond.bondName || 'Bono sin nombre' }}</h3>
        <span class="currency-badge">{{ bond.currency }}</span>
      </div>
    </template>
    <template #content>
      <div class="bond-info">
        <div class="info-row">
          <span class="info-label">Valor Nominal:</span>
          <span class="info-value">{{ formatNumber(bond.nominalValue) }} {{ bond.currency }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tasa de Interés:</span>
          <span class="info-value">{{ bond.interestRate }}%
            <span class="badge">{{ bond.isEffectiveRate ? 'Efectiva' : 'Nominal' }}</span>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Plazo:</span>
          <span class="info-value">{{ bond.term }} {{ translateTermUnit(bond.termUnit) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Frecuencia de Pago:</span>
          <span class="info-value">{{ translateFrequency(bond.paymentFrequency) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Fecha de Emisión:</span>
          <span class="info-value">{{ formatDate(bond.issueDate) }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<!-- src/domains/PublicBonds/components/BondCard.vue -->
<style scoped>
.bond-card {
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 1rem;
  background-color: #16444E !important; /* Color de fondo corporativo */
  color: white !important; /* Texto en blanco */
  border-radius: 12px;
  overflow: hidden;
}

.bond-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

.currency-badge {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
}

.bond-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.6rem 0;
}

.info-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.info-value {
  font-weight: 500;
  color: white;
}

.badge {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 4px;
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

/* Agregar un borde brillante al pasar el cursor */
.bond-card:hover {
  box-shadow: 0 8px 25px rgba(222, 245, 250, 0.3);
  border: 1px solid rgba(222, 245, 250, 0.3);
}

/* Forzar colores en modo oscuro también */
:global(.dark) .bond-card {
  background-color: #16444E !important;
  color: white !important;
}

:global(.dark) .card-header h3 {
  color: white !important;
}

:global(.dark) .info-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

:global(.dark) .info-value {
  color: white !important;
}

:global(.p-card-content) {
  color: white !important;
  padding: 1rem 1.2rem !important;
}
</style>