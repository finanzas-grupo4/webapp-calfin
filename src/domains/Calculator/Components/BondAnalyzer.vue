<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-4">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <BondInputForm @submit="handleBondSubmit" />
      </div>

      <!-- Lista de bonos guardados -->
      <div v-if="bonds.length > 0" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Bonos Guardados ({{ bonds.length }})
        </h3>
        <div class="space-y-2">
          <div
            v-for="(savedBond, index) in bonds"
            :key="index"
            @click="selectBond(savedBond)"
            :class="[
              'p-3 rounded-md cursor-pointer transition-colors',
              bond && bond === savedBond
                ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
            ]"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ savedBond.name || 'Bono ' + (index + 1) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Valor: {{ formatCurrency(savedBond.nominalValue, savedBond.currency) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Tasa: {{ savedBond.interestRate }}%
                </p>
              </div>
              <div class="text-xs text-gray-400">
                {{ formatDate(savedBond.issueDate) }}
              </div>
            </div>
          </div>
        </div>
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
            <!-- Debug: mostrar información de los datos -->
            <div v-if="bond" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded">
              <p class="text-sm text-blue-700 dark:text-blue-300">
                Debug: Bond: {{ bond.name }}, CashFlows: {{ cashFlows.length }} períodos, Moneda: {{ bond.currency }}
              </p>
            </div>

            <CashFlowTable v-if="activeTab === 'table'" :cash-flows="cashFlows" :currency="bond.currency" />
            <CashFlowChart v-else :cash-flows="cashFlows" :currency="bond.currency" />
          </div>
        </div>
      </div>
      <div v-else class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center min-h-[400px]">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <h3 class="text-xl font-medium mb-2">No hay datos sobre bonos</h3>
          <p>{{ bonds.length > 0 ? 'Selecciona un bono de la lista o' : 'Sin datos de bonos.' }} Introduzca los parámetros de los bonos para generar proyecciones de flujo de caja</p>
          <!-- Debug info -->
          <div class="mt-4 text-xs">
            <p>Debug: Bond: {{ bond ? 'Existe' : 'Null' }}, CashFlows: {{ cashFlows.length }}, Bonds: {{ bonds.length }}</p>
          </div>
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

// Cargar bonos del usuario al iniciar el componente
onMounted(async () => {
  console.log('🔍 BondAnalyzer montado');

  // Debug: verificar qué hay en localStorage
  console.log('📦 Contenido de localStorage:', {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    userId: localStorage.getItem('userId')
  });

  console.log('🔐 Estado de autenticación:', {
    isSignedIn: authStore.isSignedIn,
    userId: authStore.id,
    token: authStore.token,
    authStoreState: authStore
  });

  // Si hay token pero no hay userId en el store, intentar forzar la inicialización
  if (localStorage.getItem('token') && !authStore.id) {
    console.log('🔄 Forzando reinicialización del authStore...');
    authStore.initialize();
    console.log('🔄 Estado después de reinicialización:', {
      isSignedIn: authStore.isSignedIn,
      userId: authStore.id
    });
  }

  await loadUserBonds();
});

// Función para cargar los bonos del usuario
const loadUserBonds = async () => {
  console.log('🔍 Iniciando loadUserBonds...');
  console.log('🔐 Verificando autenticación:', {
    isSignedIn: authStore.isSignedIn,
    userId: authStore.id
  });

  if (authStore.isSignedIn && authStore.id) {
    try {
      console.log('✅ Usuario autenticado, cargando bonos del usuario:', authStore.id);
      const response = await calculatorService.getBondsByUser(authStore.id);
      bonds.value = response.data;
      console.log('📊 Bonos cargados desde backend:', bonds.value);

      if (bonds.value && bonds.value.length > 0) {
        // Selecciona el bono más reciente (último)
        const lastBond = bonds.value[bonds.value.length - 1];
        console.log('🎯 Último bono seleccionado (RAW):', lastBond);

        // Verificar que el bono tiene todos los campos necesarios
        const bondForCalculation = {
          name: lastBond.bondName || lastBond.name || `Bono ${bonds.value.length}`,
          nominalValue: parseFloat(lastBond.nominalValue) || parseFloat(lastBond.nominal_value) || 0,
          interestRate: parseFloat(lastBond.interestRate) || parseFloat(lastBond.interest_rate) || 0,
          termInMonths: parseInt(lastBond.term) * 12 || parseInt(lastBond.termInMonths) || parseInt(lastBond.term_in_months) || 0, // Convertir años a meses
          paymentFrequency: mapPaymentFrequency(lastBond.paymentFrequency || lastBond.payment_frequency || 'MENSUAL'),
          issueDate: lastBond.issueDate || lastBond.issue_date || new Date().toISOString(),
          currency: lastBond.currency || 'USD',
          isEffectiveRate: lastBond.isEffectiveRate || lastBond.is_effective_rate || false,
          compoundingFrequency: mapPaymentFrequency(lastBond.compoundingFrequency || lastBond.compounding_frequency || 'MENSUAL'),
          hasGracePeriod: lastBond.hasGracePeriod || lastBond.has_grace_period || false,
          gracePeriodLength: parseInt(lastBond.gracePeriodLength) || parseInt(lastBond.grace_period_length) || 0,
          gracePeriodType: lastBond.gracePeriodType || lastBond.grace_period_type || 'total',
          discountRate: parseFloat(lastBond.discountRate) || parseFloat(lastBond.discount_rate) || null
        };

        console.log('⚙️ Bono preparado para cálculo:', bondForCalculation);

        // Asignar el bono y calcular flujos
        bond.value = bondForCalculation;

        try {
          const flows = calculateBondCashFlow(bondForCalculation);
          cashFlows.value = flows;
          console.log('💰 Flujos de caja calculados:', flows);

          // Calcular precio del bono si hay tasa de descuento
          if (bondForCalculation.discountRate) {
            bondPrice.value = calculateBondPrice(flows, bondForCalculation.discountRate);
            console.log('💵 Precio del bono calculado:', bondPrice.value);
          } else {
            bondPrice.value = null;
          }
        } catch (calcError) {
          console.error('❌ Error en el cálculo de flujos de caja:', calcError);
          cashFlows.value = [];
          bondPrice.value = null;
        }
      } else {
        console.log('⚠️ No se encontraron bonos para el usuario');
        // Limpiar datos si no hay bonos
        bond.value = null;
        cashFlows.value = [];
        bondPrice.value = null;
      }
    } catch (error) {
      console.error('❌ Error al obtener los bonos:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
  } else {
    console.log('🚫 Usuario no autenticado o sin ID');
    console.log('📊 Estado del authStore completo:', authStore);

    // Intentar recargar el estado de autenticación desde localStorage
    if (localStorage.getItem('token')) {
      console.log('🔄 Token encontrado en localStorage, intentando recargar estado...');
      // Aquí podrías intentar recargar el estado de autenticación
    }
  }
};

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
      console.log('Datos que se envían al backend:', bondData);
      const response = await calculatorService.createBond(bondData);
      console.log('Respuesta del backend:', response);

      // Recargar los bonos después de crear uno nuevo
      await loadUserBonds();

    } catch (error) {
      console.error('Error completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
  } else {
    console.log('Usuario no autenticado, no se enviará al backend');
  }
};

// Función para seleccionar un bono guardado
const selectBond = (savedBond) => {
  console.log('Seleccionando bono:', savedBond);

  // Mapear los datos del bono igual que en loadUserBonds
  const bondForCalculation = {
    name: savedBond.name || `Bono ${bonds.value.findIndex(b => b === savedBond) + 1}`,
    nominalValue: parseFloat(savedBond.nominalValue) || parseFloat(savedBond.nominal_value) || 0,
    interestRate: parseFloat(savedBond.interestRate) || parseFloat(savedBond.interest_rate) || 0,
    termInMonths: parseInt(savedBond.term) * 12 || parseInt(savedBond.termInMonths) || parseInt(savedBond.term_in_months) || 0, // Convertir años a meses
    paymentFrequency: mapPaymentFrequency(savedBond.paymentFrequency || savedBond.payment_frequency || 'MENSUAL'),
    issueDate: savedBond.issueDate || savedBond.issue_date || new Date().toISOString(),
    currency: savedBond.currency || 'USD',
    isEffectiveRate: savedBond.isEffectiveRate || savedBond.is_effective_rate || false,
    compoundingFrequency: mapPaymentFrequency(savedBond.compoundingFrequency || savedBond.compounding_frequency || 'MENSUAL'),
    hasGracePeriod: savedBond.hasGracePeriod || savedBond.has_grace_period || false,
    gracePeriodLength: parseInt(savedBond.gracePeriodLength) || parseInt(savedBond.grace_period_length) || 0,
    gracePeriodType: savedBond.gracePeriodType || savedBond.grace_period_type || 'total',
    discountRate: parseFloat(savedBond.discountRate) || parseFloat(savedBond.discount_rate) || null
  };

  console.log('Bono mapeado para cálculo:', bondForCalculation);

  bond.value = bondForCalculation;

  try {
    const flows = calculateBondCashFlow(bondForCalculation);
    cashFlows.value = flows;
    console.log('Flujos calculados para bono seleccionado:', flows);

    if (bondForCalculation.discountRate) {
      bondPrice.value = calculateBondPrice(flows, bondForCalculation.discountRate);
      console.log('Precio calculado:', bondPrice.value);
    } else {
      bondPrice.value = null;
    }
  } catch (calcError) {
    console.error('Error calculando flujos para bono seleccionado:', calcError);
    cashFlows.value = [];
    bondPrice.value = null;
  }
};

// Función para formatear moneda
const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Función para formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Función para mapear frecuencia de pago
const mapPaymentFrequency = (frequency) => {
  if (!frequency) return 'monthly';

  switch (frequency.toUpperCase()) {
    case 'ANUAL':
    case 'ANUALMENTE':
    case 'YEARLY':
      return 'annual';
    case 'SEMESTRAL':
    case 'SEMESTRALMENTE':
    case 'HALF_YEARLY':
      return 'semi-annual';
    case 'TRIMESTRAL':
    case 'QUARTERLY':
      return 'quarterly';
    case 'MENSUAL':
    case 'MENSUALMENTE':
    case 'MONTHLY':
    default:
      return 'monthly';
  }
};
</script>
