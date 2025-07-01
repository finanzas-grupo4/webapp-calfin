<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ bond.bondName }}</h3>
        <span v-if="bondPrice" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          Precio: {{ formatCurrency(bondPrice, bond.currency) }}
        </span>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatCurrency(bond.nominalValue, bond.currency) }} • {{ bond.termInMonths / 12 }} años
      </p>
    </div>
    <div class="px-6 py-4">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p class="text-gray-500 dark:text-gray-400">Tasa de Interés</p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ bond.interestRate }}% ({{ bond.isEffectiveRate ? 'Efectiva' : 'Nominal' }})
          </p>
        </div>
        <div>
          <p class="text-gray-500 dark:text-gray-400">Frecuencia de Pago</p>
          <p class="font-medium text-gray-900 dark:text-white">{{ getPaymentFrequencyText(bond.paymentFrequency) }}</p>
        </div>
        <div>
          <p class="text-gray-500 dark:text-gray-400">Capitalización</p>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ bond.isEffectiveRate ? 'N/A' : getCompoundingText(bond.compoundingFrequency) }}
          </p>
        </div>
        <div>
          <p class="text-gray-500 dark:text-gray-400">Fecha de Emisión</p>
          <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(bond.issueDate) }}</p>
        </div>
        <div>
          <p class="text-gray-500 dark:text-gray-400">Periodo de Gracia</p>
          <p class="font-medium text-gray-900 dark:text-white">{{ getGracePeriodText() }}</p>
        </div>
        <div>
          <p class="text-gray-500 dark:text-gray-400">Tasa de Descuento</p>
          <p class="font-medium text-gray-900 dark:text-white">{{ bond.discountRate ? `${bond.discountRate}%` : 'N/A' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '../lib/utils.js';

const props = defineProps({
  bond: {
    type: Object,
    required: true
  },
  bondPrice: {
    type: Number,
    default: null
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const getPaymentFrequencyText = (freq) => {
  switch (freq) {
    case 'MENSUAL':
      return 'Mensual';
    case 'quarterly':
      return 'Trimestral';
    case 'semi-annual':
      return 'Semestral';
    case 'annual':
      return 'Anual';
    default:
      return freq;
  }
};

const getCompoundingText = (freq) => {
  if (!freq) return 'N/A';
  switch (freq) {
    case 'MENSUAL':
      return 'Mensual';
    case 'quarterly':
      return 'Trimestral';
    case 'semi-annual':
      return 'Semestral';
    case 'annual':
      return 'Anual';
    case 'continuous':
      return 'Continua';
    default:
      return freq;
  }
};

const getGracePeriodText = () => {
  if (!props.bond.hasGracePeriod) return 'Ninguno';
  return `${props.bond.gracePeriodLength} periodos (${props.bond.gracePeriodType === 'total' ? 'Total' : 'Parcial'})`;
};
</script>