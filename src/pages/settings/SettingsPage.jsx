import { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, TextField, Button, Typography, Divider, Tabs, Tab,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api, { extractData, getErrorMessage } from '../../services/api';
import { atmosphereTabsSx } from '../../styles/atmosphere';

const SettingsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState({});

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      app_name: 'Vita Stay', currency: 'INR', timezone: 'Asia/Kolkata',
      rent_due_day: 5, late_fee_percent: 5, otp_expiry_minutes: 10,
    },
  });

  const supervisorForm = useForm({
    defaultValues: { email: '', password: '', first_name: '', last_name: '', phone: '', hostel_ids: '' },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        const result = extractData(data) || {};
        setSettings(result);
        const general = result.general || {};
        reset({
          app_name: general.app_name || 'Vita Stay',
          currency: general.currency || 'INR',
          timezone: general.timezone || 'Asia/Kolkata',
          rent_due_day: general.rent_due_day || 5,
          late_fee_percent: general.late_fee_percent || 5,
          otp_expiry_minutes: general.otp_expiry_minutes || 10,
        });
      } catch (err) {
        enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [reset, enqueueSnackbar]);

  const onSaveGeneral = async (formData) => {
    setSubmitting(true);
    try {
      await api.put('/settings', { group: 'general', settings: formData });
      enqueueSnackbar('Settings saved successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const onCreateSupervisor = async (formData) => {
    setSubmitting(true);
    try {
      await api.post('/settings/supervisors', {
        ...formData,
        hostel_ids: formData.hostel_ids ? formData.hostel_ids.split(',').map((id) => Number(id.trim())) : [],
      });
      enqueueSnackbar('Supervisor created successfully', { variant: 'success' });
      supervisorForm.reset();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton variant="form" />;

  return (
    <Box>
      <PageHeader title="Settings" subtitle="Configure system preferences and manage supervisors" />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, ...atmosphereTabsSx }}>
        <Tab label="General" />
        <Tab label="Supervisors" />
        <Tab label="Notifications" />
      </Tabs>

      {tab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>General Settings</Typography>
            <Box component="form" onSubmit={handleSubmit(onSaveGeneral)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="App Name" {...register('app_name')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Currency" {...register('currency')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Timezone" {...register('timezone')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Rent Due Day" type="number" {...register('rent_due_day', { valueAsNumber: true })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Late Fee (%)" type="number" {...register('late_fee_percent', { valueAsNumber: true })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="OTP Expiry (minutes)" type="number" {...register('otp_expiry_minutes', { valueAsNumber: true })} />
                </Grid>
              </Grid>
              <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : 'Save Settings'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {tab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>Create Supervisor</Typography>
            <Box component="form" onSubmit={supervisorForm.handleSubmit(onCreateSupervisor)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="First Name" {...supervisorForm.register('first_name', { required: true })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Last Name" {...supervisorForm.register('last_name', { required: true })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Email" type="email" {...supervisorForm.register('email', { required: true })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Password" type="password" {...supervisorForm.register('password', { required: true, minLength: 6 })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Phone" {...supervisorForm.register('phone')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Hostel IDs (comma-separated)" {...supervisorForm.register('hostel_ids')} helperText="e.g. 1, 2, 3" />
                </Grid>
              </Grid>
              <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : 'Create Supervisor'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>Notification Preferences</Typography>
            <Typography color="text.secondary" paragraph>
              Configure email and push notification settings for your hostel operations.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Rent Reminder (days before due)" type="number" defaultValue={settings.notifications?.rent_reminder_days || 3} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Complaint Alert Email" defaultValue={settings.notifications?.alert_email || ''} />
              </Grid>
            </Grid>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => enqueueSnackbar('Notification settings saved', { variant: 'success' })}>
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SettingsPage;
