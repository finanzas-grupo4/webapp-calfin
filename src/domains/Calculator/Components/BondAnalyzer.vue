<script setup>
import {ref, onMounted, computed} from 'vue';
import BondInputForm from './BondInputForm.vue';
import CashFlowTable from './CashFlowTable.vue';
import CashFlowChart from './CashFlowChart.vue';
import BondSummary from './BondSummary.vue';
import {
    calculateBondCashFlow,
    calculateBondPrice,
    calculateTCEA,
    calculateMacaulayDuration,
    calculateConvexity,
    getPaymentsPerYear
} from '../lib/BondCalculations.js';
import calculatorService from '../services/calculator.services.js';
import { useToast } from "primevue/usetoast";
import { useAuthenticationStore } from '../../IAM/services/authentication.store.js';

const authStore = useAuthenticationStore();
const bond = ref(null);
const cashFlows = ref([]);
const bondPrice = ref(null);
const activeTab = ref('table');
const toast = useToast();
const loading = ref(false);
const userBonds = ref([]);
const selectedBondId = ref(null);
const isInitialLoad = ref(true); // Nueva variable para controlar la carga inicial
const bondApiData = ref(null); // Para guardar los datos del endpoint

const financialSummary = computed(() => {
  if (!cashFlows.value || cashFlows.value.length === 0) {
    return null;
  }

  const totalInterest = cashFlows.value.reduce((acc, flow) => acc + flow.interestPayment, 0);
  const totalPrincipal = cashFlows.value.reduce((acc, flow) => acc + flow.principalPayment, 0);
  const totalPayment = totalInterest + totalPrincipal;

  const paymentsPerYear = getPaymentsPerYear(bond.value.paymentFrequency);
  const tcea = calculateTCEA(cashFlows.value, bondPrice.value, paymentsPerYear);

  const periodicDiscountRate = (bond.value.discountRate / 100) / paymentsPerYear;
  const duration = calculateMacaulayDuration(cashFlows.value, bondPrice.value, periodicDiscountRate, paymentsPerYear);
  const convexity = calculateConvexity(cashFlows.value, bondPrice.value, periodicDiscountRate, paymentsPerYear);

  return {
    totalInterest,
    totalPrincipal,
    totalPayment,
    tcea,
    duration,
    convexity,
    bondPrice: bondPrice.value
  };
});

// Función para cargar bonos del usuario
const loadUserBonds = async () => {
  if (!authStore.id) {
    console.log('Usuario no autenticado');
    isInitialLoad.value = false; // Marcar como carga completada
    return;
  }

  try {
    console.log('Cargando bonos del usuario:', authStore.id);
    const result = await calculatorService.getBondsByUser(authStore.id);

    if (result.success && result.data) {
      userBonds.value = result.data;
      console.log('Bonos cargados:', result.data);

      // Si hay bonos, seleccionar el último creado automáticamente
      if (userBonds.value.length > 0) {
        const lastBond = userBonds.value[userBonds.value.length - 1];
        await loadBondDetails(lastBond.id);
      } else {
        // No hay bonos, mostrar mensaje inicial
        isInitialLoad.value = false;
      }
    } else {
      console.log('No se encontraron bonos o error:', result.message);
      isInitialLoad.value = false; // Marcar como carga completada
    }
  } catch (error) {
    console.error('Error al cargar bonos del usuario:', error);
    isInitialLoad.value = false; // Marcar como carga completada
  }
};

// Función para cargar detalles de un bono específico
const loadBondDetails = async (bondId) => {
  try {
    console.log('Cargando detalles del bono:', bondId);
    const result = await calculatorService.getBondById(bondId);

    if (result.success && result.data) {
      const bondData = result.data;
      console.log('Detalles del bono cargados:', bondData);

      // Calcular termInMonths basado en term y termUnit
      const termInMonths = bondData.termUnit?.toLowerCase() === 'years'
        ? (parseInt(bondData.term) || 0) * 12
        : (parseInt(bondData.term) || 0);

      console.log('Calculando termInMonths:', {
        term: bondData.term,
        termUnit: bondData.termUnit,
        termInMonths: termInMonths
      });

      // Determinar si tiene período de gracia
      const hasGracePeriod = (parseInt(bondData.gracePeriodLength) || 0) > 0 &&
                            bondData.gracePeriodType?.toLowerCase() !== 'none';

      // Mapear los datos del backend al formato que espera el frontend
      const mappedBondData = {
        ...bondData,
        // Propiedades críticas para cálculos - ASEGURAR VALORES VÁLIDOS
        faceValue: parseFloat(bondData.nominalValue) || parseFloat(bondData.faceValue) || 1000,
        nominalValue: parseFloat(bondData.nominalValue) || parseFloat(bondData.faceValue) || 1000,
        interestRate: parseFloat(bondData.couponRate) || 5, // Valor por defecto 5%
        termInMonths: termInMonths || 12, // Valor por defecto 12 meses
        hasGracePeriod: hasGracePeriod,

        // Propiedades de configuración con valores por defecto
        bondName: bondData.bondName || 'Bono sin nombre',
        couponRate: parseFloat(bondData.couponRate) || 5,
        term: parseInt(bondData.term) || 1,
        termUnit: bondData.termUnit?.toLowerCase() || 'years',
        paymentFrequency: mapBackendToFrontendFrequency(bondData.paymentFrequency) || 'monthly',
        compoundingFrequency: mapBackendToFrontendFrequency(bondData.compoundingFrequency) || 'annual',
        gracePeriodType: bondData.gracePeriodType?.toLowerCase() || 'none',
        gracePeriodLength: parseInt(bondData.gracePeriodLength) || 0,
        currency: bondData.currency || 'USD',
        issueDate: bondData.issueDate || new Date().toISOString().split('T')[0],
        discountRate: parseFloat(bondData.discountRate) || null,
        additionalCosts: parseFloat(bondData.additionalCosts) || 0,

        // Propiedades adicionales que podrían necesitarse
        isEffectiveRate: false // Asumir que es nominal por defecto
      };

      console.log('Datos originales del backend:', bondData);
      console.log('Datos del bono mapeados para el frontend:', mappedBondData);
      console.log('Verificando propiedades críticas:');
      console.log('- nominalValue:', mappedBondData.nominalValue, 'tipo:', typeof mappedBondData.nominalValue);
      console.log('- interestRate:', mappedBondData.interestRate, 'tipo:', typeof mappedBondData.interestRate);
      console.log('- termInMonths:', mappedBondData.termInMonths, 'tipo:', typeof mappedBondData.termInMonths);
      console.log('- paymentFrequency:', mappedBondData.paymentFrequency);
      console.log('- hasGracePeriod:', mappedBondData.hasGracePeriod);

      // Validar datos antes de proceder
      if (!mappedBondData.nominalValue || !mappedBondData.interestRate || !mappedBondData.termInMonths) {
        console.error('Datos críticos faltantes después del mapeo:', {
          nominalValue: mappedBondData.nominalValue,
          interestRate: mappedBondData.interestRate,
          termInMonths: mappedBondData.termInMonths
        });
        toast.add({
          severity: 'error',
          summary: 'Error de datos',
          detail: 'Los datos del bono están incompletos. Verifique la información en la base de datos.',
          life: 5000
        });
        isInitialLoad.value = false;
        return;
      }

      // Asignar los datos del bono mapeados
      bond.value = mappedBondData;
      selectedBondId.value = bondId;

      // Recalcular flujos de caja con los datos mapeados
      const flows = calculateBondCashFlow(mappedBondData);
      cashFlows.value = flows;
      console.log('Flujos de caja calculados:', flows);
      console.log('Número de flujos generados:', flows.length);

      // Calcular precio si hay tasa de descuento
      if (mappedBondData.discountRate) {
        const paymentsPerYear = getPaymentsPerYear(mappedBondData.paymentFrequency);
        bondPrice.value = calculateBondPrice(flows, mappedBondData.discountRate, paymentsPerYear);
      } else {
        bondPrice.value = null;
      }

      // Obtener datos adicionales del endpoint
      try {
        const apiResult = await calculatorService.getBondCashflows(bondId);
        if (apiResult && apiResult.success && apiResult.data) {
          bondApiData.value = apiResult.data;
        } else {
          bondApiData.value = null;
        }
      } catch (e) {
        bondApiData.value = null;
      }

      // Marcar como carga completada después de cargar los datos
      isInitialLoad.value = false;

      // Verificar que tengamos datos válidos antes de mostrar el toast
      if (flows.length > 0) {
        toast.add({
          severity: 'success',
          summary: 'Bono cargado exitosamente',
          detail: `${mappedBondData.bondName || 'Bono'} - ${flows.length} períodos calculados`,
          life: 3000
        });
      } else {
        console.error('No se generaron flujos de caja - revisar datos del bono');
        toast.add({
          severity: 'warning',
          summary: 'Advertencia',
          detail: 'Bono cargado pero no se pudieron calcular los flujos de caja',
          life: 5000
        });
      }
    }
  } catch (error) {
    console.error('Error al cargar detalles del bono:', error);
    isInitialLoad.value = false; // Marcar como carga completada incluso con error
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los detalles del bono',
      life: 5000
    });
  }
};

// Función para cambiar de bono
const selectBond = async (bondId) => {
  await loadBondDetails(bondId);
};

// Función para crear un nuevo bono (limpiar formulario)
const createNewBond = () => {
  bond.value = null;
  cashFlows.value = [];
  bondPrice.value = null;
  selectedBondId.value = null;
};

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

      // Recargar la lista de bonos del usuario
      await loadUserBonds();
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

// Cargar bonos al montar el componente
onMounted(() => {
  authStore.initialize();
  loadUserBonds();
});

// Funciones para mapear valores del backend al frontend
function mapBackendToFrontendFrequency(value) {
  const map = {
    'MENSUAL': 'monthly',
    'TRIMESTRAL': 'quarterly',
    'SEMESTRAL': 'semi-annual',
    'ANUAL': 'annual',
    'CONTINUO': 'continuous',
    'NONE': 'none'
  };
  return map[value] || value?.toLowerCase();
}

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
      <!-- Selector de bonos guardados -->
      <div v-if="userBonds.length > 0" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-white">Mis Bonos Guardados</h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ userBonds.length }} bono(s) encontrado(s)</span>
            <button
              @click="createNewBond"
              class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              + Crear Nuevo
            </button>
          </div>
          <div class="max-h-40 overflow-y-auto">
            <button
              v-for="bondItem in userBonds"
              :key="bondItem.id"
              @click="selectBond(bondItem.id)"
              :class="[
                'w-full text-left p-3 rounded-md border transition-colors',
                selectedBondId === bondItem.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              ]"
            >
              <div class="font-medium">{{ bondItem.bondName || 'Bono sin nombre' }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ bondItem.currency }} {{ (bondItem.nominalValue || bondItem.faceValue)?.toLocaleString() }} - {{ bondItem.couponRate }}%
              </div>
            </button>
          </div>
        </div>
      </div>

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
            <CashFlowTable v-if="activeTab === 'table'" :cash-flows="cashFlows" :currency="bond.currency" :summary="financialSummary" />
            <CashFlowChart v-else :cash-flows="cashFlows" :currency="bond.currency" />
          </div>
        </div>
        <!-- Resumen financiero básico -->
        <div v-if="financialSummary" class="mt-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow text-base">
          <h4 class="font-semibold mb-2 text-gray-800 dark:text-gray-200">Resumen financiero</h4>
          <ul class="space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              Total Intereses Pagados:
              <span class="font-bold">{{ financialSummary.totalInterest.toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }}</span>
              <span v-if="cashFlows.length > 0"> ({{ cashFlows.length }} × {{ (cashFlows[0].interestPayment).toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }})</span>
            </li>
            <li>
              Total Amortización:
              <span class="font-bold">{{ financialSummary.totalPrincipal.toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }}</span>
              <span v-if="cashFlows.length > 0"> (al final)</span>
            </li>
            <li>
              Total Pagado:
              <span class="font-bold">{{ financialSummary.totalPayment.toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }}</span>
            </li>
            <li>
              Rendimiento:
              <span class="font-bold">{{ (financialSummary.totalPayment - (financialSummary.bondPrice || 0)).toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }}</span>
              <span v-if="financialSummary.bondPrice"> ({{ financialSummary.totalPayment.toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }} - {{ financialSummary.bondPrice.toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }})</span>
            </li>
          </ul>
        </div>
        <!-- Resumen financiero del endpoint -->
        <div v-if="bondApiData" class="mt-4 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow text-base">
          <h4 class="font-semibold mb-2 text-gray-800 dark:text-gray-200">Variables financieras del bono (API)</h4>
          <ul class="space-y-1 text-gray-700 dark:text-gray-300">
            <li v-if="bondApiData.precioTeorico !== undefined">Precio Teórico: <span class="font-bold">{{ bondApiData.precioTeorico.toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }}</span></li>
            <li v-if="bondApiData.convexidad !== undefined">Convexidad: <span class="font-bold">{{ bondApiData.convexidad.toLocaleString(undefined, { maximumFractionDigits: 4 }) }}</span></li>
            <li v-if="bondApiData.duracion !== undefined">Duración: <span class="font-bold">{{ bondApiData.duracion.toLocaleString(undefined, { maximumFractionDigits: 4 }) }}</span></li>
            <li v-if="bondApiData.duracionModificada !== undefined">Duración Modificada: <span class="font-bold">{{ bondApiData.duracionModificada.toLocaleString(undefined, { maximumFractionDigits: 4 }) }}</span></li>
            <li v-if="bondApiData.tcea !== undefined">TCEA: <span class="font-bold">{{ (bondApiData.tcea * 100).toLocaleString(undefined, { maximumFractionDigits: 4 }) }}%</span></li>
            <li v-if="bondApiData.trea !== undefined">TREA: <span class="font-bold">{{ (bondApiData.trea * 100).toLocaleString(undefined, { maximumFractionDigits: 4 }) }}%</span></li>
            <li v-if="bondApiData.precioMaximo !== undefined">Precio Máximo: <span class="font-bold">{{ bondApiData.precioMaximo.toLocaleString(undefined, { style: 'currency', currency: bond.currency }) }}</span></li>
          </ul>
        </div>
      </div>
      <div v-else class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center min-h-[400px]">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <div v-if="isInitialLoad || loading">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Cargando bonos...</p>
          </div>
          <div v-else>
            <h3 class="text-xl font-medium mb-2">No hay datos sobre bonos</h3>
            <p>Introduzca los parámetros de los bonos para generar proyecciones de flujo de caja</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
