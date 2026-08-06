import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BuildIcon from '@mui/icons-material/Build';
import BadgeIcon from '@mui/icons-material/Badge';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import DoughnutChart from '../../components/charts/DoughnutChart';
import api, { extractData, extractPaginated, getErrorMessage } from '../../services/api';
import { useSnackbar } from 'notistack';
import { atmosphereFilterSx, atmosphereSelectMenuProps } from '../../styles/atmosphere';

const SupervisorDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [hostels, setHostels] = useState([]);
  const [hostelId, setHostelId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const { data: res } = await api.get('/hostels', { params: { limit: 100 } });
        const { data: list } = extractPaginated(res);
        setHostels(list);
        if (list.length > 0) setHostelId(String(list[0].id));
      } catch (err) {
        enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
      }
    };
    fetchHostels();
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (!hostelId) {
      setLoading(false);
      return;
    }
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const { data: res } = await api.get('/dashboard/supervisor', { params: { hostelId } });
        setData(extractData(res));
      } catch (err) {
        enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [hostelId, enqueueSnackbar]);

  const stats = data?.stats || {};
  const rooms = data?.rooms || [];
  const roomLabels = rooms.map((r) => r.status?.replace(/_/g, ' '));
  const roomCounts = rooms.map((r) => parseInt(r.count, 10));

  return (
    <Box>
      <PageHeader
        title="Supervisor Dashboard"
        subtitle="Daily operations overview for your assigned hostel"
      >
        {hostels.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 200, ...atmosphereFilterSx }}>
            <InputLabel sx={{ color: 'inherit' }}>Hostel</InputLabel>
            <Select
              value={hostelId}
              label="Hostel"
              onChange={(e) => setHostelId(e.target.value)}
              MenuProps={atmosphereSelectMenuProps}
            >
              {hostels.map((h) => (
                <MenuItem key={h.id} value={String(h.id)}>{h.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </PageHeader>

      {loading ? (
        <LoadingSkeleton variant="dashboard" />
      ) : !hostelId ? (
        <Card><CardContent><Typography color="text.secondary">No hostel assigned yet.</Typography></CardContent></Card>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard title="Check-ins Today" value={stats.checkIns || 0} icon={LoginIcon} color="success" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard title="Check-outs Today" value={stats.checkOuts || 0} icon={LogoutIcon} color="warning" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard title="Pending Rent" value={stats.pendingRent || 0} icon={PaymentsIcon} color="error" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard title="Open Complaints" value={stats.complaints || 0} icon={ReportProblemIcon} color="error" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard title="Maintenance" value={stats.maintenance || 0} icon={BuildIcon} color="warning" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard title="Visitors Today" value={stats.visitors || 0} icon={BadgeIcon} color="info" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StatCard title="Staff Present" value={stats.attendance || 0} icon={EventAvailableIcon} color="success" />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Room Status Distribution
                  </Typography>
                  <DoughnutChart
                    labels={roomLabels.length ? roomLabels : ['No data']}
                    data={roomCounts.length ? roomCounts : [0]}
                    height={300}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default SupervisorDashboard;
