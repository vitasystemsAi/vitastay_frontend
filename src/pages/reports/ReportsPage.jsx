import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, TextField, MenuItem, Button, Tabs, Tab,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import DoughnutChart from '../../components/charts/DoughnutChart';
import api, { extractData, extractPaginated, getErrorMessage } from '../../services/api';
import { formatCurrency } from '../../utils/constants';
import { useSnackbar } from 'notistack';
import { atmosphereFilterSx, atmosphereSelectMenuProps, atmosphereTabsSx, atmosphereOutlinedBtnSx } from '../../styles/atmosphere';

const ReportsPage = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [hostels, setHostels] = useState([]);
  const [hostelId, setHostelId] = useState('');
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const [occupancy, setOccupancy] = useState(null);
  const [rentCollection, setRentCollection] = useState(null);
  const [pendingRent, setPendingRent] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [financeSummary, setFinanceSummary] = useState(null);

  useEffect(() => {
    api.get('/hostels', { params: { limit: 100 } })
      .then(({ data }) => setHostels(extractPaginated(data).data))
      .catch(() => {});
  }, []);

  const params = { hostelId: hostelId || undefined, startDate, endDate };

  const fetchReports = async (reportTab = tab) => {
    setLoading(true);
    try {
      if (reportTab === 0) {
        const { data } = await api.get('/reports/occupancy', { params: { hostelId: hostelId || undefined } });
        setOccupancy(extractData(data));
      } else if (reportTab === 1) {
        const { data } = await api.get('/reports/rent-collection', { params });
        setRentCollection(extractData(data));
      } else if (reportTab === 2) {
        const { data } = await api.get('/reports/pending-rent', { params: { hostelId: hostelId || undefined } });
        setPendingRent(extractData(data));
      } else if (reportTab === 3) {
        const { data } = await api.get('/reports/expenses', { params });
        setExpenses(extractData(data));
      } else if (reportTab === 4) {
        const { data } = await api.get('/reports/finance-summary', { params });
        setFinanceSummary(extractData(data));
      }
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [tab, hostelId, startDate, endDate]);

  const handleExport = async () => {
    try {
      const response = await api.get('/reports/export/excel', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vitastay-report-${dayjs().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      enqueueSnackbar('Report exported successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };

  const occupancyLabels = (occupancy?.rooms || []).map((r) => r.status?.replace(/_/g, ' '));
  const occupancyValues = (occupancy?.rooms || []).map((r) => parseInt(r.count, 10));

  const expenseByCategory = expenses?.byCategory || expenses?.categories || [];
  const expenseLabels = expenseByCategory.map((e) => e.category?.replace(/_/g, ' '));
  const expenseValues = expenseByCategory.map((e) => parseFloat(e.total || e.amount || 0));

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Analytics and financial reports">
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport} sx={atmosphereOutlinedBtnSx}>
          Export Excel
        </Button>
      </PageHeader>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          select
          size="small"
          label="Hostel"
          value={hostelId}
          onChange={(e) => setHostelId(e.target.value)}
          sx={{ minWidth: 160, ...atmosphereFilterSx }}
          SelectProps={{ MenuProps: atmosphereSelectMenuProps }}
        >
          <MenuItem value="">All Hostels</MenuItem>
          {hostels.map((h) => <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>)}
        </TextField>
        <TextField
          size="small"
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={atmosphereFilterSx}
        />
        <TextField
          size="small"
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={atmosphereFilterSx}
        />
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, ...atmosphereTabsSx }} variant="scrollable">
        <Tab label="Occupancy" />
        <Tab label="Rent Collection" />
        <Tab label="Pending Rent" />
        <Tab label="Expenses" />
        <Tab label="Finance Summary" />
      </Tabs>

      {loading ? (
        <LoadingSkeleton variant="dashboard" />
      ) : (
        <>
          {tab === 0 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total Rooms" value={occupancy?.total || 0} color="primary" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Occupancy Rate" value={`${occupancy?.occupancyRate || 0}%`} color="success" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Card><CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>Room Status</Typography>
                  <DoughnutChart labels={occupancyLabels.length ? occupancyLabels : ['No data']} data={occupancyValues.length ? occupancyValues : [0]} height={280} />
                </CardContent></Card>
              </Grid>
            </Grid>
          )}

          {tab === 1 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total Collected" value={formatCurrency(rentCollection?.total)} color="success" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Payments" value={rentCollection?.payments?.length || 0} color="primary" />
              </Grid>
            </Grid>
          )}

          {tab === 2 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total Pending" value={formatCurrency(pendingRent?.total)} color="warning" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Pending Invoices" value={pendingRent?.payments?.length || 0} color="error" />
              </Grid>
            </Grid>
          )}

          {tab === 3 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total Expenses" value={formatCurrency(expenses?.total)} color="error" />
              </Grid>
              <Grid item xs={12}>
                <Card><CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>Expenses by Category</Typography>
                  <BarChart
                    labels={expenseLabels.length ? expenseLabels : ['No data']}
                    datasets={[{ label: 'Amount (₹)', data: expenseValues.length ? expenseValues : [0], backgroundColor: theme.palette.error.main }]}
                    height={300}
                  />
                </CardContent></Card>
              </Grid>
            </Grid>
          )}

          {tab === 4 && financeSummary && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total Income" value={formatCurrency(financeSummary.income)} color="success" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total Expenses" value={formatCurrency(financeSummary.expenses)} color="error" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Net Balance" value={formatCurrency(financeSummary.balance || (financeSummary.income - financeSummary.expenses))} color="primary" />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default ReportsPage;
