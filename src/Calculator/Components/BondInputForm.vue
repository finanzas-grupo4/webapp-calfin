<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <h2 class="text-xl font-semibold mb-4">Parámetros del Bono</h2>

    <div class="space-y-4">
      <div>
        <label for="bondName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Bono</label>
        <input
            id="bondName"
            v-model="formData.bondName"
            type="text"
            class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Bono Corporativo XYZ"
            required
        />
        <p v-if="errors.bondName" class="mt-1 text-sm text-red-600">{{ errors.bondName }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="nominalValue" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor Nominal</label>
          <input
              id="nominalValue"
              v-model.number="formData.nominalValue"
              type="number"
              step="0.01"
              class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
          />
          <p v-if="errors.nominalValue" class="mt-1 text-sm text-red-600">{{ errors.nominalValue }}</p>
        </div>

        <div>
          <label for="currency" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Moneda</label>
          <select
              id="currency"
              v-model="formData.currency"
              class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="CNY">CNY</option>
          </select>
          <p v-if="errors.currency" class="mt-1 text-sm text-red-600">{{ errors.currency }}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="term" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Plazo</label>
          <input
              id="term"
              v-model.number="formData.term"
              type="number"
              class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
          />
          <p v-if="errors.term" class="mt-1 text-sm text-red-600">{{ errors.term }}</p>
        </div>

        <div>
          <label for="termUnit" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unidad de Plazo</label>
          <select
              id="termUnit"
              v-model="formData.termUnit"
              class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
          >
            <option value="years">Años</option>
            <option value="months">Meses</option>
          </select>
          <p v-if="errors.termUnit" class="mt-1 text-sm text-red-600">{{ errors.termUnit }}</p>
        </div>
      </div>

      <!-- Interest Rate Settings -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Configuración de Tasa de Interés</h3>
          <button
              type="button"
              @click="toggleSection('interestSettings')"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <span v-if="openSections.interestSettings">▼</span>
            <span v-else>▶</span>
          </button>
        </div>

        <div v-if="openSections.interestSettings" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="interestRate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tasa de Interés (%)</label>
              <input
                  id="interestRate"
                  v-model.number="formData.interestRate"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
              />
              <p v-if="errors.interestRate" class="mt-1 text-sm text-red-600">{{ errors.interestRate }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Tasa</label>
              <div class="flex items-center space-x-2 mt-2">
                <input
                    id="isEffectiveRate"
                    v-model="formData.isEffectiveRate"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    @change="handleEffectiveRateChange"
                />
                <label for="isEffectiveRate" class="text-sm text-gray-700 dark:text-gray-300">
                  {{ formData.isEffectiveRate ? 'Efectiva' : 'Nominal' }}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label for="paymentFrequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Frecuencia de Pago</label>
            <select
                id="paymentFrequency"
                v-model="formData.paymentFrequency"
                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="semi-annual">Semestral</option>
              <option value="annual">Anual</option>
            </select>
            <p v-if="errors.paymentFrequency" class="mt-1 text-sm text-red-600">{{ errors.paymentFrequency }}</p>
          </div>

          <div v-if="!formData.isEffectiveRate">
            <label for="compoundingFrequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Frecuencia de Capitalización</label>
            <select
                id="compoundingFrequency"
                v-model="formData.compoundingFrequency"
                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="semi-annual">Semestral</option>
              <option value="annual">Anual</option>
              <option value="continuous">Continuo</option>
            </select>
            <p v-if="errors.compoundingFrequency" class="mt-1 text-sm text-red-600">{{ errors.compoundingFrequency }}</p>
          </div>
        </div>
      </div>

      <!-- Dates & Grace Period -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Fechas y Periodo de Gracia</h3>
          <button
              type="button"
              @click="toggleSection('datesGrace')"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <span v-if="openSections.datesGrace">▼</span>
            <span v-else>▶</span>
          </button>
        </div>

        <div v-if="openSections.datesGrace" class="space-y-4">
          <div>
            <label for="issueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Emisión</label>
            <input
                id="issueDate"
                v-model="formData.issueDate"
                type="date"
                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
            />
            <p v-if="errors.issueDate" class="mt-1 text-sm text-red-600">{{ errors.issueDate }}</p>
          </div>

          <div>
            <div class="flex items-center space-x-2">
              <input
                  id="hasGracePeriod"
                  v-model="formData.hasGracePeriod"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  @change="handleGracePeriodChange"
              />
              <label for="hasGracePeriod" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Periodo de Gracia
              </label>
            </div>
          </div>

          <div v-if="formData.hasGracePeriod" class="space-y-4">
            <div>
              <label for="gracePeriodType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Periodo de Gracia</label>
              <select
                  id="gracePeriodType"
                  v-model="formData.gracePeriodType"
                  class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
              >
                <option value="total">Total (Principal e Interés)</option>
                <option value="partial">Parcial (Solo Principal)</option>
              </select>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ formData.gracePeriodType === 'total' ? 'Sin pagos durante el periodo de gracia' : 'Solo pagos de intereses durante el periodo de gracia' }}
              </p>
              <p v-if="errors.gracePeriodType" class="mt-1 text-sm text-red-600">{{ errors.gracePeriodType }}</p>
            </div>

            <div>
              <label for="gracePeriodLength" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Duración del Periodo de Gracia (Periodos)</label>
              <input
                  id="gracePeriodLength"
                  v-model.number="formData.gracePeriodLength"
                  type="number"
                  class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
              />
              <p v-if="errors.gracePeriodLength" class="mt-1 text-sm text-red-600">{{ errors.gracePeriodLength }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Valuation -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Valoración</h3>
          <button
              type="button"
              @click="toggleSection('valuation')"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <span v-if="openSections.valuation">▼</span>
            <span v-else>▶</span>
          </button>
        </div>

        <div v-if="openSections.valuation">
          <div>
            <label for="discountRate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tasa de Descuento (%)</label>
            <input
                id="discountRate"
                v-model.number="formData.discountRate"
                type="number"
                step="0.01"
                class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Utilizado para calcular el valor presente del bono</p>
            <p v-if="errors.discountRate" class="mt-1 text-sm text-red-600">{{ errors.discountRate }}</p>
          </div>
        </div>
      </div>
    </div>

    <button
        type="submit"
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      Calcular Flujo de Caja
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';

const emit = defineEmits(['submit']);

const openSections = reactive({
  interestSettings: true,
  datesGrace: true,
  valuation: true
});

const formData = reactive({
  bondName: '',
  nominalValue: 1000,
  currency: 'USD',
  term: 5,
  termUnit: 'years',
  interestRate: 5,
  isEffectiveRate: true,
  paymentFrequency: 'semi-annual',
  compoundingFrequency: 'semi-annual',
  issueDate: new Date().toISOString().split('T')[0],
  hasGracePeriod: false,
  gracePeriodType: 'none',
  gracePeriodLength: 0,
  discountRate: 5
});

const errors = reactive({});

const toggleSection = (section) => {
  openSections[section] = !openSections[section];
};

const handleEffectiveRateChange = () => {
  if (formData.isEffectiveRate) {
    formData.compoundingFrequency = undefined;
  } else {
    formData.compoundingFrequency = 'semi-annual';
  }
};

const handleGracePeriodChange = () => {
  if (!formData.hasGracePeriod) {
    formData.gracePeriodType = 'none';
    formData.gracePeriodLength = 0;
  } else {
    formData.gracePeriodType = 'partial';
  }
};

const validateForm = () => {
  const newErrors = {};

  if (!formData.bondName) newErrors.bondName = 'Bond name is required';
  if (!formData.nominalValue || formData.nominalValue <= 0) newErrors.nominalValue = 'Nominal value must be positive';
  if (!formData.currency) newErrors.currency = 'Currency is required';
  if (!formData.term || formData.term <= 0) newErrors.term = 'Term must be positive';
  if (!formData.interestRate || formData.interestRate <= 0) newErrors.interestRate = 'Interest rate must be positive';
  if (formData.hasGracePeriod && (!formData.gracePeriodLength || formData.gracePeriodLength < 0)) {
    newErrors.gracePeriodLength = 'Grace period length must be a positive number';
  }
  if (formData.discountRate !== undefined && formData.discountRate < 0) {
    newErrors.discountRate = 'Discount rate must be positive';
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

const submitForm = () => {
  if (!validateForm()) return;

  const bondData = {
    ...formData,
    issueDate: new Date(formData.issueDate),
    // Convert to months for consistency in calculations
    termInMonths: formData.termUnit === 'years' ? formData.term * 12 : formData.term,
  };

  emit('submit', bondData);
};
</script>
