import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Componente separado para o gráfico de IR
function IRBarChart({ resultados }: { resultados: any[] }) {
  // Filtra apenas operações de venda
  const vendas = resultados.filter(r => r.operacao.tipo === 'venda');

  const data = {
    labels: vendas.map(v => v.operacao.data),
    datasets: [
      {
        label: 'IR Devido (R$)',
        data: vendas.map(v => v.ir.toFixed(2)),
        backgroundColor: vendas.map(v => (v.ir > 0 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(75, 192, 192, 0.6)')),
        borderColor: vendas.map(v => (v.ir > 0 ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Imposto de Renda Devido por Venda' },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `IR: R$ ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'IR (R$)' },
      },
      x: {
        title: { display: true, text: 'Data da Operação' },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default IRBarChart;
