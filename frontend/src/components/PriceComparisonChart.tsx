import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PriceData } from '../services/priceService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceComparisonChartProps {
  prices: PriceData[];
  provider: string;
}

export const PriceComparisonChart: React.FC<PriceComparisonChartProps> = ({ prices, provider }) => {
  const providerPrices = prices.filter(p => p.provider_name === provider);

  const data = {
    labels: providerPrices.map(p => p.model_name),
    datasets: [
      {
        label: 'Input Price',
        data: providerPrices.map(p => p.input_price_per_1k_tokens),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Output Price',
        data: providerPrices.map(p => p.output_price_per_1k_tokens),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
        text: `${provider} Model Prices`,
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

  return <Bar data={data} options={options} />;
}; 