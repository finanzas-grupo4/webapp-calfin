<script setup>
import {ref} from 'vue';
import BondInputForm from './BondInputForm.vue';
import CashFlowTable from './CashFlowTable.vue';
import CashFlowChart from './CashFlowChart.vue';
import BondSummary from './BondSummary.vue';
import {calculateBondCashFlow, calculateBondPrice} from '../lib/BondCalculations.js';
import calculatorService from '../services/calculator.services.js';
import { useToast } from "primevue/usetoast";

const bond = ref(null);
const cashFlows = ref([]);
const bondPrice = ref(null);
const activeTab = ref('table');
const toast = useToast();
const loading = ref(false);

const handleBondSubmit = async (bondData) => {
  console.log('Datos de bono recibidos en BondAnalyzer:', bondData);

  // Crear copia modificada con valores correctos para el backend
  const modifiedBondData = {
    ...bondData,
    // TermUnits: Debe ser en MAYÚSCULAS (YEARS, MONTHS)
    termUnit: bondData.termUnit?.toUpperCase(),

    // Mapeo de valores de frecuencia de pago
    paymentFrequency: mapPaymentFrequency(bondData.paymentFrequency),

    // Mapeo de valores de frecuencia de capitalización
    compoundingFrequency: mapCompoundingFrequency(bondData.compoundingFrequency),

    // GracePeriodType: Primera letra mayúscula (Total, Parcial, None)
    gracePeriodType: mapGracePeriodType(bondData.gracePeriodType)

    // Currency ya está en mayúscula en el frontend (USD, EUR, etc)
  };

  console.log('Datos de bono modificados para el backend:', modifiedBondData);
  bond.value = modifiedBondData;

  const flows = calculateBondCashFlow(modifiedBondData);
  cashFlows.value = flows;

  if (modifiedBondData.discountRate) {
    bondPrice.value = calculateBondPrice(flows, modifiedBondData.discountRate);
  } else {
    bondPrice.value = null;
  }

  // Guardar en el backend con los datos modificados
  loading.value = true;
  try {
    console.log('Intentando guardar bono en el backend...');
    const result = await calculatorService.createBond({
      ...modifiedBondData, // Usar modifiedBondData en lugar de bondData
      price: bondPrice.value,
      cashFlows: flows
    });

    if (result.success) {
      console.log('Bono guardado exitosamente:', result.data);
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Bono agregado correctamente',
        life: 3000
      });
    } else {
      console.error('Error al guardar bono:', result.message);
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: result.message,
        life: 5000
      });
    }
  } catch (error) {
    console.error('Excepción al guardar bono:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error inesperado al guardar el bono',
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

// Funciones para mapear valores del frontend al backend
function mapPaymentFrequency(value) {
  const map = {
    'monthly': 'MENSUAL',
    'quarterly': 'TRIMESTRAL',
    'semi-annual': 'SEMESTRAL',
    'annual': 'ANUAL'
  };
  return map[value] || value;
}

function mapCompoundingFrequency(value) {
  const map = {
    'monthly': 'MENSUAL',
    'quarterly': 'TRIMESTRAL',
    'semi-annual': 'SEMESTRAL',
    'annual': 'ANUAL',
    'continuous': 'CONTINUO',
    'none': 'NONE'
  };
  return map[value] || value;
}

function mapGracePeriodType(value) {
  const map = {
    'partial': 'PARCIAL',
    'total': 'TOTAL',
    'none': 'NONE'
  };
  return map[value] || value;
}
</script>


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



