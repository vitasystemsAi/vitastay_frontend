import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, Grid, TextField, Button, MenuItem, CircularProgress, Card, CardContent, Alert,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import useAuth from '../../hooks/useAuth';
import api, { extractData, getErrorMessage } from '../../services/api';

const HostelFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '', code: '', description: '', address: '', city: '', state: '',
      pincode: '', country: 'India', total_floors: 1, capacity: 0,
      electricity_charge: 0, security_deposit: 0, notice_period_months: 1,
      contact_phone: '', contact_email: '', status: 'pending_approval',
    },
  });

  const currentStatus = watch('status');

  useEffect(() => {
    if (!isEdit) return;
    const fetchHostel = async () => {
      try {
        const { data } = await api.get(`/hostels/${id}`);
        const hostel = extractData(data);
        reset({
          name: hostel.name || '',
          code: hostel.code || '',
          description: hostel.description || '',
          address: hostel.address || '',
          city: hostel.city || '',
          state: hostel.state || '',
          pincode: hostel.pincode || '',
          country: hostel.country || 'India',
          total_floors: hostel.total_floors || 1,
          capacity: hostel.capacity || 0,
          security_deposit: hostel.security_deposit || 0,
          notice_period_months: hostel.notice_period_months || 1,
          contact_phone: hostel.contact_phone || '',
          contact_email: hostel.contact_email || '',
          status: hostel.status || 'pending_approval',
        });
      } catch (err) {
        enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
        navigate('/hostels');
      } finally {
        setLoading(false);
      }
    };
    fetchHostel();
  }, [id, isEdit, reset, navigate, enqueueSnackbar]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/hostels/${id}`, formData);
        enqueueSnackbar('Hostel updated successfully', { variant: 'success' });
      } else {
        const { data } = await api.post('/hostels', formData);
        const message = data?.message || (isSuperAdmin
          ? 'Hostel created successfully'
          : 'Branch submitted for Super Admin approval');
        enqueueSnackbar(message, { variant: 'success' });
      }
      navigate('/hostels');
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton variant="form" />;

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Edit Branch' : isSuperAdmin ? 'Add Hostel' : 'Add Branch'}
        breadcrumbs={[
          { label: 'Hostels', path: '/hostels' },
          { label: isEdit ? 'Edit' : isSuperAdmin ? 'New' : 'New Branch' },
        ]}
        subtitle={!isEdit && !isSuperAdmin ? 'New branches require Super Admin approval before going live' : undefined}
      />

      {!isEdit && !isSuperAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          After you create this branch, its status will be <strong>Pending Approval</strong> until a Super Admin reviews and activates it.
        </Alert>
      )}

      {isEdit && currentStatus === 'pending_approval' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          This branch is waiting for Super Admin approval.
        </Alert>
      )}

      {isEdit && currentStatus === 'rejected' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          This branch registration was rejected by Super Admin.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Hostel Name" {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Code" {...register('code')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" multiline rows={2} {...register('description')} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" {...register('address', { required: 'Address is required' })} error={!!errors.address} helperText={errors.address?.message} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="City" {...register('city', { required: 'City is required' })} error={!!errors.city} helperText={errors.city?.message} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="State" {...register('state', { required: 'State is required' })} error={!!errors.state} helperText={errors.state?.message} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Pincode" {...register('pincode', { required: 'Pincode is required' })} error={!!errors.pincode} helperText={errors.pincode?.message} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Country" {...register('country')} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Total Floors" type="number" {...register('total_floors', { valueAsNumber: true })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Capacity" type="number" {...register('capacity', { valueAsNumber: true })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Security Deposit (₹)" type="number" {...register('security_deposit', { valueAsNumber: true })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Notice Period (months)"
                  type="number"
                  inputProps={{ min: 0, max: 24 }}
                  {...register('notice_period_months', { valueAsNumber: true, min: { value: 0, message: 'Invalid' } })}
                  helperText="Tenant notice period before vacating"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Contact Phone" {...register('contact_phone')} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Contact Email" type="email" {...register('contact_email')} />
              </Grid>
              {isSuperAdmin && (
                <Grid item xs={12} md={4}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <TextField select fullWidth label="Status" {...field}>
                        <MenuItem value="pending_approval">Pending Approval</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="maintenance">Maintenance</MenuItem>
                        <MenuItem value="on_hold">On Hold</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
              )}
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate('/hostels')}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting
                  ? <CircularProgress size={24} />
                  : isEdit
                    ? (isSuperAdmin ? 'Update Hostel' : 'Update Branch')
                    : isSuperAdmin
                      ? 'Create Hostel'
                      : 'Submit Branch for Approval'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HostelFormPage;
