<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-4">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <BondInputForm @submit="handleBondSubmit" />
      </div>
    </div>

    <div class="lg:col-span-8">
      <div v-if="bond && cashFlows.length > 0" class="space-y-8">
        <BondSummary :bond="bond" :bond-price="bondPrice" />

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="flex" aria-label="Tabs">
              <button
                  @click="activeTab = 'table'"
                  :class="[
                  'px-4 py-3 text-sm font-medium',
                  activeTab === 'table'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                Cuadro de flujo de caja
              </button>
              <button
                  @click="activeTab = 'chart'"
                  :class="[
                  'px-4 py-3 text-sm font-medium',
                  activeTab === 'chart'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                ]"
              >
                Flujo de caja
              </button>
            </nav>
          </div>
          <div class="p-6">
            <CashFlowTable v-if="activeTab === 'table'" :cash-flows="cashFlows" :currency="bond.currency" />
            <CashFlowChart v-else :cash-flows="cashFlows" :currency="bond.currency" />
          </div>
        </div>
      </div>
      <div v-else class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center min-h-[400px]">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <h3 class="text-xl font-medium mb-2">No hay datos sobre bonos</h3>
          <p>Sin datos de bonosIntroduzca los parámetros de los bonos para generar proyecciones de flujo de caja</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import {ref, onMounted} from 'vue';
import BondInputForm from './BondInputForm.vue';
import CashFlowTable from './CashFlowTable.vue';
import CashFlowChart from './CashFlowChart.vue';
import BondSummary from './BondSummary.vue';
import {calculateBondCashFlow, calculateBondPrice} from '../lib/BondCalculations.js';
import { CalculatorService } from '../services/calculator.services.js';
import { useAuthenticationStore } from '../../IAM/services/authentication.store.js';

const bond = ref(null);
const cashFlows = ref([]);
const bondPrice = ref(null);
const activeTab = ref('table');
const bonds = ref([]);

const calculatorService = new CalculatorService();
const authStore = useAuthenticationStore();

const handleBondSubmit = async (bondData) => {
  bond.value = bondData;
  const flows = calculateBondCashFlow(bondData);
  cashFlows.value = flows;

  if (bondData.discountRate) {
    bondPrice.value = calculateBondPrice(flows, bondData.discountRate);
  } else {
    bondPrice.value = null;
  }

  // Guardar bono en backend asociado al usuario autenticado
  if (authStore.isSignedIn) {
    try {
      // Debug: verificar datos que se envían
      console.log('Datos que se envían al backend:', bondData);
      console.log('Token JWT:', localStorage.getItem('token'));
      console.log('Usuario autenticado:', authStore.id);

      // El mapeo ya se hace en BondInputForm.vue, usar bondData directamente
      const response = await calculatorService.createBond(bondData);
      console.log('Respuesta del backend:', response);
      // Opcional: mostrar mensaje de éxito
      // alert('Bono guardado correctamente');
    } catch (error) {
      // Mostrar detalles del error
      console.error('Error completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      // alert('Error al guardar el bono');
    }
  } else {
    console.log('Usuario no autenticado, no se enviará al backend');
  }
};

onMounted(async () => {
  if (authStore.isSignedIn && authStore.id) {
    try {
      const response = await calculatorService.getBondsByUser(authStore.id);
      bonds.value = response.data;
      if (bonds.value && bonds.value.length > 0) {
        // Selecciona el bono más reciente (último)
        const lastBond = bonds.value[bonds.value.length - 1];
        bond.value = lastBond;
        const flows = calculateBondCashFlow(lastBond);
        cashFlows.value = flows;
        if (lastBond.discountRate) {
          bondPrice.value = calculateBondPrice(flows, lastBond.discountRate);
        } else {
          bondPrice.value = null;
        }
      }
    } catch (error) {
      console.error('Error al obtener los bonos:', error);
    }
  }
});
</script>
