import { useCallback, useEffect, useState } from 'react';
import {
  Box, Grid, TextField, MenuItem, Typography, Button, alpha, Card, CardContent,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api, { extractData, extractPaginated, getErrorMessage } from '../../services/api';
import { DEFAULT_PAGE_SIZE, formatCurrency } from '../../utils/constants';
import { atmosphereFilterSx, atmosphereSelectMenuProps } from '../../styles/atmosphere';

const filterSx = {
  width: '100%',
  ...atmosphereFilterSx,
  '& .MuiOutlinedInput-root': {
    ...atmosphereFilterSx['& .MuiOutlinedInput-root'],
    height: 40,
  },
};

const formatPaymentMethod = (method) => {
  if (!method) return '—';
  return method.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const RevenuePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenditure: 0,
    netRevenue: 0,
  });
  const [hostels, setHostels] = useState([]);
  const [hostelId, setHostelId] = useState('');
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    api.get('/hostels', { params: { limit: 100 } })
      .then(({ data }) => setHostels(extractPaginated(data).data))
      .catch(() => {});
  }, []);

  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/revenue', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          hostelId: hostelId || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      const payload = extractData(data) || {};
      setRows(payload.items || []);
      setSummary(payload.summary || {
        totalIncome: 0,
        totalExpenditure: 0,
        netRevenue: 0,
      });
      setTotalCount(payload.pagination?.total || 0);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, hostelId, startDate, endDate, enqueueSnackbar]);

  useEffect(() => { fetchRevenue(); }, [fetchRevenue]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await api.get('/revenue', {
        params: {
          page: 1,
          limit: 1000,
          hostelId: hostelId || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      const payload = extractData(data) || {};
      const items = payload.items || [];
      const s = payload.summary || summary;

      const escapeCsv = (val) => {
        const str = String(val ?? '');
        if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
        return str;
      };

      const lines = [
        ['Revenue Export'],
        ['From', startDate || ''],
        ['To', endDate || ''],
        ['Hostel', hostelId ? (hostels.find((h) => String(h.id) === String(hostelId))?.name || hostelId) : 'All Hostels'],
        ['Total Income', s.totalIncome ?? 0],
        ['Total Expenditure', s.totalExpenditure ?? 0],
        ['Net Revenue', s.netRevenue ?? 0],
        [],
        ['Tenant', 'Date Paid', 'Payment Made', 'Amount Paid', 'For Month', 'Hostel', 'Room', 'Status'],
        ...items.map((row) => [
          row.tenant?.user
            ? `${row.tenant.user.first_name} ${row.tenant.user.last_name}`
            : '',
          row.paid_date ? dayjs(row.paid_date).format('DD MMM YYYY') : '',
          formatPaymentMethod(row.payment_method),
          row.paid_amount ?? 0,
          row.month_year || '',
          row.hostel?.name || '',
          row.room?.room_number || '',
          row.status || '',
        ]),
      ];

      const csv = lines.map((line) => (Array.isArray(line) ? line.map(escapeCsv).join(',') : '')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue-tenants-log-${startDate || 'from'}_to_${endDate || 'to'}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      enqueueSnackbar('Revenue data exported', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const tenantLogColumns = [
    {
      field: 'tenant',
      headerName: 'Tenant',
      renderCell: ({ row }) => (
        row.tenant?.user
          ? `${row.tenant.user.first_name} ${row.tenant.user.last_name}`
          : '—'
      ),
    },
    {
      field: 'paid_date',
      headerName: 'Date Paid',
      renderCell: ({ value }) => (value ? dayjs(value).format('DD MMM YYYY') : '—'),
    },
    {
      field: 'payment_method',
      headerName: 'Payment Made',
      renderCell: ({ value }) => formatPaymentMethod(value),
    },
    {
      field: 'paid_amount',
      headerName: 'Amount Paid',
      renderCell: ({ value }) => (
        <Typography fontWeight={700} color="success.main">
          {formatCurrency(value)}
        </Typography>
      ),
    },
    { field: 'month_year', headerName: 'For Month' },
    {
      field: 'hostel',
      headerName: 'Hostel',
      renderCell: ({ row }) => row.hostel?.name || '—',
    },
  ];

  if (loading && rows.length === 0) return <LoadingSkeleton variant="dashboard" />;

  const netPositive = (summary.netRevenue || 0) >= 0;

  return (
    <Box>
      <PageHeader
        title="Revenue"
        subtitle="Track income, expenditure, and net revenue across your hostels"
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap', maxWidth: 280 }}>
        <TextField
          select
          size="small"
          label="Hostel"
          value={hostelId}
          onChange={(e) => { setHostelId(e.target.value); setPage(0); }}
          sx={filterSx}
          SelectProps={{ MenuProps: atmosphereSelectMenuProps }}
        >
          <MenuItem value="">All Hostels</MenuItem>
          {hostels.map((h) => (
            <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={1.5} sx={{ mb: 3 }} alignItems="stretch">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            size="small"
            title="Total Income"
            value={formatCurrency(summary.totalIncome ?? summary.totalRevenue)}
            icon={TrendingUpIcon}
            color="success"
            subtitle="Rent collected"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            size="small"
            title="Total Expenditure"
            value={formatCurrency(summary.totalExpenditure)}
            icon={TrendingDownIcon}
            color="error"
            subtitle="Expenses on date"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            size="small"
            title="Net Revenue"
            value={formatCurrency(summary.netRevenue)}
            icon={AccountBalanceWalletIcon}
            color={netPositive ? 'primary' : 'warning'}
            subtitle="Income − Expenditure"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent
              sx={{
                p: 1.75,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 1,
                '&:last-child': { pb: 1.75 },
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Date Range
              </Typography>
              <TextField
                size="small"
                type="date"
                label="From"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { height: 36 } }}
              />
              <TextField
                size="small"
                type="date"
                label="To"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { height: 36 } }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          mb: 1.5,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#fff' }}>
            Tenants Log
          </Typography>
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
            Payment date, payment method, and amount paid by each tenant
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : 'Export / Download'}
        </Button>
      </Box>

      <DataTable
        columns={tenantLogColumns}
        rows={rows}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={setPage}
        onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(0); }}
        showActions={false}
        emptyMessage="No tenant payments in the selected date range."
      />
    </Box>
  );
};

export default RevenuePage;
