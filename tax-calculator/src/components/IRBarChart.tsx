import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const formatarBRL = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(valor);

function IRCombinedChart({ resultados }: { resultados: any[] }) {
  const vendas = resultados.filter(r => r.operacao.tipo === 'venda');
  const irValues = vendas.map(v => v.ir);

  const irAcumulado: number[] = [];
  irValues.reduce((acc, val, idx) => {
    irAcumulado[idx] = acc + val;
    return acc + val;
  }, 0);

  const data = {
    labels: vendas.map(v => v.operacao.data),
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
          align: 'end' as const, // <- aqui a correção
          color: '#4d83f0',
          font: { size: 11, weight: 'bold' as const },
          formatter: (value: number) => formatarBRL(value),
        },
      },
      {
        type: 'line' as const,
        label: 'IR Acumulado',
        data: irAcumulado,
        borderColor: '#ff6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.3,
        yAxisID: 'y',
        datalabels: { display: false },
      },
    ],
  };

  const options = {
    responsive: true,
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
          label: function (context: any) {
            return `${context.dataset.label}: ${formatarBRL(context.parsed.y)}`;
          },
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
          callback: function (tickValue: string | number) {
            const valueNum = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return formatarBRL(valueNum);
          },
          color: '#555',
          font: { size: 12 },
        },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: {
        ticks: { color: '#555', font: { size: 12 } },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  };

  return (
    <div className="card p-3 shadow-sm" style={{ backgroundColor: '#fff' }}>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}

export default IRCombinedChart;
