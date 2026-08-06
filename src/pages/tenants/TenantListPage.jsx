import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import SearchBar from '../../components/common/SearchBar';
import api, { extractPaginated, getErrorMessage } from '../../services/api';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';
import { atmosphereFilterSx, atmosphereSelectMenuProps } from '../../styles/atmosphere';

const TenantListPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [hostelFilter, setHostelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get('/hostels', { params: { limit: 100 } })
      .then(({ data }) => setHostels(extractPaginated(data).data))
      .catch(() => {});
  }, []);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tenants', {
        params: {
          page: page + 1, limit: rowsPerPage, search: search || undefined,
          hostelId: hostelFilter || undefined, status: statusFilter || undefined,
        },
      });
      const { data: list, pagination } = extractPaginated(data);
      setRows(list);
      setTotalCount(pagination.total);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, hostelFilter, statusFilter, enqueueSnackbar]);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/tenants/${deleteTarget.id}`);
      enqueueSnackbar('Tenant deleted successfully', { variant: 'success' });
      setDeleteTarget(null);
      fetchTenants();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      renderCell: ({ row }) => `${row.user?.first_name || ''} ${row.user?.last_name || ''}`.trim() || '—',
    },
    { field: 'email', headerName: 'Email', renderCell: ({ row }) => row.user?.email || '—' },
    { field: 'phone', headerName: 'Phone', renderCell: ({ row }) => row.user?.phone || '—' },
    { field: 'hostel', headerName: 'Hostel', renderCell: ({ row }) => row.hostel?.name || '—' },
    { field: 'room', headerName: 'Room', renderCell: ({ row }) => row.room?.room_number || '—' },
    { field: 'status', headerName: 'Status', renderCell: ({ value }) => <StatusChip status={value} /> },
  ];

  return (
    <Box>
      <PageHeader title="Tenants" subtitle="Manage tenant registrations and assignments" actionLabel="Add Tenant" actionTo="/tenants/new" />

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <SearchBar placeholder="Search tenants..." onSearch={(v) => { setSearch(v); setPage(0); }} sx={{ flex: 1, minWidth: 200 }} />
        <TextField
          select
          size="small"
          label="Hostel"
          value={hostelFilter}
          onChange={(e) => { setHostelFilter(e.target.value); setPage(0); }}
          sx={{ minWidth: 160, ...atmosphereFilterSx }}
          SelectProps={{ MenuProps: atmosphereSelectMenuProps }}
        >
          <MenuItem value="">All Hostels</MenuItem>
          {hostels.map((h) => <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>)}
        </TextField>
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
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="moved_out">Moved Out</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
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
        onEdit={(row) => navigate(`/tenants/${row.id}/edit`)}
        onDelete={(row) => setDeleteTarget(row)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Tenant"
        message={`Delete tenant ${deleteTarget?.user?.first_name}?`}
        confirmLabel="Delete"
        severity="error"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default TenantListPage;
