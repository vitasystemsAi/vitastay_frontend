import { useEffect, useState } from 'react';
import { Grid, Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PaymentsIcon from '@mui/icons-material/Payments';
import HotelIcon from '@mui/icons-material/Hotel';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusChip from '../../components/common/StatusChip';
import api, { extractData, getErrorMessage } from '../../services/api';
import { formatCurrency } from '../../utils/constants';
import { atmosphereOutlinedBtnSx } from '../../styles/atmosphere';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/super-admin/dashboard');
        setData(extractData(res));
      } catch (err) {
        enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [enqueueSnackbar]);

  if (loading) return <LoadingSkeleton variant="dashboard" />;

  const stats = data?.stats || {};
  const recentHostels = data?.recentHostels || [];

  return (
    <Box>
      <PageHeader
        title="Super Admin Dashboard"
        subtitle="Platform control — approve hostels, manage owners, features and holds"
        actionLabel="Register Hostel"
        actionTo="/super-admin/register-hostel"
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Hostels" value={stats.totalHostels || 0} icon={BusinessIcon} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Hostels" value={stats.activeHostels || 0} icon={CheckCircleIcon} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Approval" value={stats.pendingApprovalHostels || 0} icon={HourglassTopIcon} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="On Hold" value={stats.onHoldHostels || 0} icon={PauseCircleIcon} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Owners" value={stats.totalOwners || 0} icon={PeopleIcon} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Users" value={stats.totalUsers || 0} icon={PeopleIcon} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Tenants" value={stats.totalTenants || 0} icon={HotelIcon} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Rent" value={formatCurrency(stats.pendingRent)} icon={PaymentsIcon} color="warning" />
        </Grid>
      </Grid>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => navigate('/super-admin/register-hostel')}>
          Register New Hostel
        </Button>
        <Button variant="outlined" color="warning" onClick={() => navigate('/hostels?status=pending_approval')} sx={atmosphereOutlinedBtnSx}>
          Pending Approvals
        </Button>
        <Button variant="outlined" onClick={() => navigate('/hostels')} sx={atmosphereOutlinedBtnSx}>
          Manage All Hostels
        </Button>
        <Button variant="outlined" onClick={() => navigate('/super-admin/users')} sx={atmosphereOutlinedBtnSx}>
          Users & Password Reset
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recently Registered Hostels
          </Typography>
          {recentHostels.length === 0 ? (
            <Typography color="text.secondary">No hostels yet. Register the first one.</Typography>
          ) : (
            recentHostels.map((hostel) => (
              <Box
                key={hostel.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Box>
                  <Typography fontWeight={600}>{hostel.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hostel.city} · Owner: {hostel.owner?.first_name} {hostel.owner?.last_name} ({hostel.owner?.email})
                  </Typography>
                </Box>
                <StatusChip status={hostel.status} />
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SuperAdminDashboard;
