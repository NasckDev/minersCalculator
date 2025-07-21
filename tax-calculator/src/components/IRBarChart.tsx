import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'react-chartjs-2';

// Registra todos os módulos necessários de uma única vez
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Função para formatar valores em Real (BRL)
const formatarBRL = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(valor);

interface Resultado {
  operacao: { tipo: string; data: string };
  ir: number;
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#555',
        font: { size: 12, weight: 'bold' as const },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: any) =>
          `${context.dataset.label}: ${formatarBRL(context.parsed.y)}`,
      },
      backgroundColor: '#fff',
      titleColor: '#333',
      bodyColor: '#333',
      borderColor: '#ddd',
      borderWidth: 1,
    },
    datalabels: { clamp: true, clip: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (tickValue: string | number) => {
          const value =
            typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
          return formatarBRL(value);
        },
        color: '#555',
        font: { size: 12 },
      },
      grid: { color: 'rgba(0,0,0,0.05)' },
    },
    x: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 6,
        maxRotation: 0,
        minRotation: 0,
        color: '#555',
        font: { size: 11 },
      },
      grid: { color: 'rgba(0,0,0,0.05)' },
    },
  },
};

const IRCombinedChart: React.FC<{ resultados: Resultado[] }> = ({ resultados }) => {
  const vendas = resultados.filter(r => r.operacao.tipo === 'venda');

  if (vendas.length === 0) {
    return (
      <div
        className="card p-3 shadow-sm chart-container"
        style={{ backgroundColor: '#fff', minHeight: '350px' }}
      >
        <p className="text-center text-muted mt-5">Sem dados de vendas para exibir.</p>
      </div>
    );
  }

  try {
    const labels = vendas.map(v => v.operacao.data);
    const irValues = vendas.map(v => v.ir);

    // Calcula IR acumulado
    const irAcumulado: number[] = [];
    irValues.reduce((acc, val, idx) => {
      irAcumulado[idx] = acc + val;
      return acc + val;
    }, 0);

    const data = {
      labels,
      datasets: [
        {
          type: 'bar' as const,
          label: 'IR por Venda',
          data: irValues,
          backgroundColor: 'rgba(77, 131, 240, 0.3)',
          borderColor: '#4d83f0',
          borderWidth: 2,
          borderRadius: 6,
          datalabels: {
            anchor: 'end' as const,
            align: 'end' as const,
            color: '#4d83f0',
            font: { size: 10, weight: 'bold' as const },
            formatter: (value: number) => (value > 0 ? formatarBRL(value) : ''),
          },
        },
        {
          type: 'line' as const,
          label: 'IR Acumulado',
          data: irAcumulado,
          borderColor: '#fa5378',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.3,
          yAxisID: 'y',
          datalabels: { display: false },
        },
      ],
    };

    return (
      <div
        className="card p-3 shadow-sm chart-container"
        style={{ backgroundColor: '#fff', minHeight: '350px' }}
      >
        <Chart type="bar" data={data} options={defaultOptions} />
      </div>
    );
  } catch (error) {
    console.error('Erro ao renderizar gráfico:', error);
    return (
      <div
        className="card p-3 shadow-sm chart-container"
        style={{ backgroundColor: '#fff', minHeight: '350px' }}
      >
        <p className="text-center text-danger mt-5">Erro ao carregar gráfico.</p>
      </div>
    );
  }
};

export default IRCombinedChart;
