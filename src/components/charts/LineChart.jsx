import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { useTheme, Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ labels, datasets, title, height = 300 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const data = useMemo(() => ({
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      tension: 0.4,
      fill: ds.fill ?? true,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  }), [labels, datasets]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: theme.palette.text.primary, usePointStyle: true, padding: 16 },
      },
      title: title ? { display: true, text: title, color: theme.palette.text.primary } : { display: false },
      tooltip: {
        backgroundColor: isDark ? 'rgba(28,28,30,0.9)' : 'rgba(255,255,255,0.95)',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: theme.palette.text.secondary },
      },
      y: {
        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: theme.palette.text.secondary },
        beginAtZero: true,
      },
    },
  }), [theme, isDark, title]);

  return (
    <Box sx={{ height, width: '100%' }}>
      <Line data={data} options={options} />
    </Box>
  );
};

export default LineChart;
