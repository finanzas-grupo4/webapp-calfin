<template>
  <div class="w-full">
    <h3 class="text-lg font-medium mb-4">Visualización del Flujo de Caja</h3>
    <div class="h-[400px]">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { formatCurrency } from '../lib/utils.js';

Chart.register(...registerables);

const props = defineProps({
  cashFlows: {
    type: Array,
    required: true
  },
  currency: {
    type: String,
    required: true
  }
});

console.log('CashFlowChart props:', props.cashFlows, props.currency);

const chartRef = ref(null);
let chartInstance = null;

const createChart = () => {
  if (!chartRef.value || !props.cashFlows || props.cashFlows.length === 0) {
    console.log('No se puede crear el gráfico - datos faltantes:', {
      hasChartRef: !!chartRef.value,
      cashFlowsLength: props.cashFlows?.length || 0
    });
    return;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  console.log('Creando gráfico con', props.cashFlows.length, 'períodos');

  const periods = props.cashFlows.map(flow => `Periodo ${flow.period}`);
  const interestPayments = props.cashFlows.map(flow => flow.interestPayment);
  const principalPayments = props.cashFlows.map(flow => flow.principalPayment);
  const balances = props.cashFlows.map(flow => flow.beginningBalance);

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: periods,
      datasets: [
        {
          label: 'Pago de Interés',
          data: interestPayments,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Pago de Principal',
          data: principalPayments,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Saldo Restante',
          data: balances,
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Periodo de Pago',
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: `Monto de Pago (${props.currency})`,
          },
          ticks: {
            callback: (value) => formatCurrency(Number(value), props.currency, true),
          },
        },
        y1: {
          position: 'right',
          title: {
            display: true,
            text: `Saldo (${props.currency})`,
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: (value) => formatCurrency(Number(value), props.currency, true),
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += formatCurrency(context.parsed.y, props.currency);
              return label;
            },
          },
        },
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Proyección del Flujo de Caja del Bono',
        },
      },
    },
  });

  console.log('Gráfico creado exitosamente');
};

onMounted(() => {
  console.log('CashFlowChart mounted, creando gráfico...');
  createChart();
});

watch(() => props.cashFlows, (newCashFlows) => {
  console.log('CashFlows cambiaron, recreando gráfico con', newCashFlows?.length || 0, 'elementos');
  createChart();
}, { deep: true });
</script>