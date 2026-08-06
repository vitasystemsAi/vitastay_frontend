import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme, Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ labels, data: chartData, title, height = 280, colors }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
    theme.palette.info?.main || '#5AC8FA',
  ];

  const data = useMemo(() => ({
    labels,
    datasets: [{
      data: chartData,
      backgroundColor: colors || defaultColors.slice(0, chartData.length),
      borderWidth: 0,
      hoverOffset: 8,
    }],
  }), [labels, chartData, colors, defaultColors]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
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
  }), [theme, isDark, title]);

  return (
    <Box sx={{ height, width: '100%' }}>
      <Doughnut data={data} options={options} />
    </Box>
  );
};

export default DoughnutChart;
