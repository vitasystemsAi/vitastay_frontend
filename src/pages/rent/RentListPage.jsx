import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, MenuItem, IconButton, Tooltip, Stack } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useAuth from '../../hooks/useAuth';
import api, { extractData, extractPaginated, getErrorMessage } from '../../services/api';
import { DEFAULT_PAGE_SIZE, formatCurrency } from '../../utils/constants';
import { printRentInvoice, viewRentInvoice, downloadRentInvoice } from '../../utils/printRentInvoice';
import { brand } from '../../styles/theme';
import { alpha } from '@mui/material/styles';
import { atmosphereFilterSx, atmosphereSelectMenuProps } from '../../styles/atmosphere';

const RentListPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isTenant, isOwner, isSupervisor } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [busyId, setBusyId] = useState(null);

  const fetchRent = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/rent', {
        params: { page: page + 1, limit: rowsPerPage, status: statusFilter || undefined },
      });
      const { data: list, pagination } = extractPaginated(data);
      setRows(list);
      setTotalCount(pagination.total);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter, enqueueSnackbar]);

  useEffect(() => { fetchRent(); }, [fetchRent]);

  const canCollect = isOwner || isSupervisor;

  const loadInvoice = async (row) => {
    const { data } = await api.get(`/rent/${row.id}`);
    return extractData(data);
  };

  const handleInvoiceAction = async (row, action) => {
    setBusyId(`${row.id}-${action}`);
    try {
      const payment = await loadInvoice(row);
      if (action === 'view') viewRentInvoice(payment);
      else if (action === 'download') {
        downloadRentInvoice(payment);
        enqueueSnackbar('Invoice downloaded', { variant: 'success' });
      } else {
        printRentInvoice(payment);
      }
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    { field: 'month_year', headerName: 'Month' },
    {
      field: 'tenant',
      headerName: 'Tenant',
      renderCell: ({ row }) => row.tenant?.user ? `${row.tenant.user.first_name} ${row.tenant.user.last_name}` : '—',
    },
    { field: 'hostel', headerName: 'Hostel', renderCell: ({ row }) => row.hostel?.name || '—' },
    { field: 'room', headerName: 'Room', renderCell: ({ row }) => row.room?.room_number || '—' },
    { field: 'total_amount', headerName: 'Total', renderCell: ({ value }) => formatCurrency(value) },
    { field: 'paid_amount', headerName: 'Paid', renderCell: ({ value }) => formatCurrency(value) },
    {
      field: 'due_date',
      headerName: 'Due Date',
      renderCell: ({ value }) => value ? dayjs(value).format('DD MMM YYYY') : '—',
    },
    { field: 'status', headerName: 'Status', renderCell: ({ value }) => <StatusChip status={value} /> },
  ];

  return (
    <Box>
      <PageHeader
        title="Rent Payments"
        subtitle={isTenant ? 'View your rent payment history' : 'Manage rent invoices and collections'}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          sx={{ minWidth: 140, ...atmosphereFilterSx }}
          SelectProps={{ MenuProps: atmosphereSelectMenuProps }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="partial">Partial</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
        </TextField>
      </Box>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={setPage}
        onRowsPerPageChange={(v) => { setRowsPerPage(v); setPage(0); }}
        showActions={canCollect || isTenant}
        customActions={(row) => {
          if (isTenant) {
            return (
              <Stack direction="row" spacing={0.25}>
                <Tooltip title="View invoice">
                  <IconButton
                    size="small"
                    disabled={busyId === `${row.id}-view`}
                    onClick={() => handleInvoiceAction(row, 'view')}
                    sx={{ color: brand.teal, '&:hover': { bgcolor: alpha(brand.teal, 0.12) } }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download invoice">
                  <IconButton
                    size="small"
                    disabled={busyId === `${row.id}-download`}
                    onClick={() => handleInvoiceAction(row, 'download')}
                    sx={{ color: 'primary.main', '&:hover': { bgcolor: alpha(brand.navy, 0.1) } }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          }

          const canCollectRow = canCollect && ['pending', 'partial', 'overdue'].includes(row.status);
          return (
            <Stack direction="row" spacing={0.25}>
              {canCollectRow && (
                <Tooltip title={`Collect amount for ${row.month_year}`}>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/rent/collect/${row.id}`)}
                    sx={{ color: brand.teal, '&:hover': { bgcolor: alpha(brand.teal, 0.12) } }}
                  >
                    <PaymentsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Print invoice">
                <IconButton
                  size="small"
                  disabled={busyId === `${row.id}-print`}
                  onClick={() => handleInvoiceAction(row, 'print')}
                  sx={{ color: 'primary.main', '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.1) } }}
                >
                  <PrintIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }}
      />
    </Box>
  );
};

export default RentListPage;
