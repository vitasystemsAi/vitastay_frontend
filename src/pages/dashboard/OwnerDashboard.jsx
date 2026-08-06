import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BuildIcon from '@mui/icons-material/Build';
import BadgeIcon from '@mui/icons-material/Badge';
import HotelIcon from '@mui/icons-material/Hotel';
import { useTheme } from '@mui/material/styles';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import DoughnutChart from '../../components/charts/DoughnutChart';
import api, { extractData, getErrorMessage } from '../../services/api';
import { formatCurrency } from '../../utils/constants';
import { useSnackbar } from 'notistack';

const OwnerDashboard = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await api.get('/dashboard/owner');
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
  const charts = data?.charts || {};

  const incomeLabels = (charts.monthlyIncome || []).map((item) => item.month_year);
  const incomeValues = (charts.monthlyIncome || []).map((item) => parseFloat(item.total || 0));

  const expenseLabels = (charts.expenses || []).map((item) =>
    item.category?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
  const expenseValues = (charts.expenses || []).map((item) => parseFloat(item.total || 0));

  const occupancy = charts.occupancyRate?.[0] || { occupied: 0, vacant: 0 };

  return (
    <Box>
      <PageHeader
        title="Owner Dashboard"
        subtitle="Overview of your hostel portfolio and financial performance"
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Hostels" value={stats.totalHostels || 0} icon={BusinessIcon} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Occupied Rooms" value={stats.occupiedRooms || 0} icon={MeetingRoomIcon} color="success" subtitle={`${stats.occupancyRate || 0}% occupancy`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Monthly Income" value={formatCurrency(stats.monthlyIncome)} icon={PaymentsIcon} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Rent" value={formatCurrency(stats.pendingRent)} icon={PaymentsIcon} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Vacant Rooms" value={stats.vacantRooms || 0} icon={HotelIcon} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Open Complaints" value={stats.complaints || 0} icon={ReportProblemIcon} color="error" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Maintenance Tasks" value={stats.maintenance || 0} icon={BuildIcon} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Visitors Today" value={stats.visitorsToday || 0} icon={BadgeIcon} color="secondary" />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Monthly Rent Collection
              </Typography>
              <LineChart
                labels={incomeLabels.length ? incomeLabels : ['No data']}
                datasets={[{
                  label: 'Income (₹)',
                  data: incomeValues.length ? incomeValues : [0],
                  borderColor: theme.palette.primary.main,
                  backgroundColor: `${theme.palette.primary.main}33`,
                }]}
                height={320}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Room Occupancy
              </Typography>
              <DoughnutChart
                labels={['Occupied', 'Vacant']}
                data={[occupancy.occupied || 0, occupancy.vacant || 0]}
                height={320}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Expenses by Category (Last 6 Months)
              </Typography>
              <BarChart
                labels={expenseLabels.length ? expenseLabels : ['No data']}
                datasets={[{
                  label: 'Amount (₹)',
                  data: expenseValues.length ? expenseValues : [0],
                  backgroundColor: theme.palette.secondary.main,
                }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerDashboard;
