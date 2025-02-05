import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PriceHistory } from '../services/priceService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  history: PriceHistory[];
  modelName: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ history, modelName }) => {
  const data = {
    labels: history.map(h => new Date(h.effective_date).toLocaleDateString()),
    datasets: [
      {
        label: 'Input Price',
        data: history.map(h => h.input_price_per_1k_tokens),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Output Price',
        data: history.map(h => h.output_price_per_1k_tokens),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Price History for ${modelName}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Price per 1k tokens ($)',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}; 