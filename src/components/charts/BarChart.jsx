import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend,
} from 'chart.js';
import { useTheme, Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ labels, datasets, title, height = 300, horizontal = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const data = useMemo(() => ({
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      borderRadius: 8,
      borderSkipped: false,
    })),
  }), [labels, datasets]);

  const options = useMemo(() => ({
    indexAxis: horizontal ? 'y' : 'x',
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
        grid: { display: !horizontal, color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: theme.palette.text.secondary },
      },
      y: {
        grid: { display: horizontal, color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: theme.palette.text.secondary },
        beginAtZero: true,
      },
    },
  }), [theme, isDark, title, horizontal]);

  return (
    <Box sx={{ height, width: '100%' }}>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default BarChart;
