import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, Grid, TextField, Button, MenuItem, CircularProgress, Card, CardContent, FormControlLabel, Checkbox,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api, { extractData, extractPaginated, getErrorMessage } from '../../services/api';

const RoomFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [hostels, setHostels] = useState([]);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      hostel_id: '', room_number: '', floor: 1, room_type: 'single',
      sharing_type: 1, is_ac: false, rent: 0, status: 'vacant', description: '',
    },
  });

  useEffect(() => {
    api.get('/hostels', { params: { limit: 100 } })
      .then(({ data }) => setHostels(extractPaginated(data).data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        const room = extractData(data);
        reset({
          hostel_id: room.hostel_id || '',
          room_number: room.room_number || '',
          floor: room.floor || 1,
          room_type: room.room_type || 'single',
          sharing_type: room.sharing_type || 1,
          is_ac: room.is_ac || false,
          rent: room.rent || 0,
          status: room.status || 'vacant',
          description: room.description || '',
        });
      } catch (err) {
        enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
        navigate('/rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, isEdit, reset, navigate, enqueueSnackbar]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const payload = { ...formData, hostel_id: Number(formData.hostel_id) };
      if (isEdit) {
        await api.put(`/rooms/${id}`, payload);
        enqueueSnackbar('Room updated successfully', { variant: 'success' });
      } else {
        await api.post('/rooms', payload);
        enqueueSnackbar('Room created successfully', { variant: 'success' });
      }
      navigate('/rooms');
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
        title={isEdit ? 'Edit Room' : 'Add Room'}
        breadcrumbs={[{ label: 'Rooms', path: '/rooms' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="hostel_id"
                  control={control}
                  rules={{ required: 'Hostel is required' }}
                  render={({ field }) => (
                    <TextField select fullWidth label="Hostel" {...field} error={!!errors.hostel_id} helperText={errors.hostel_id?.message}>
                      <MenuItem value="">Select Hostel</MenuItem>
                      {hostels.map((h) => <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>)}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Room Number" {...register('room_number', { required: 'Room number is required' })} error={!!errors.room_number} helperText={errors.room_number?.message} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Floor" type="number" {...register('floor', { valueAsNumber: true, required: true })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="room_type"
                  control={control}
                  render={({ field }) => (
                    <TextField select fullWidth label="Room Type" {...field}>
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="double">Double</MenuItem>
                      <MenuItem value="triple">Triple</MenuItem>
                      <MenuItem value="dormitory">Dormitory</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Sharing Type" type="number" {...register('sharing_type', { valueAsNumber: true })} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="Monthly Rent (₹)" type="number" {...register('rent', { valueAsNumber: true, required: 'Rent is required' })} error={!!errors.rent} helperText={errors.rent?.message} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField select fullWidth label="Status" {...field}>
                      <MenuItem value="vacant">Vacant</MenuItem>
                      <MenuItem value="occupied">Occupied</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="reserved">Reserved</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Controller
                  name="is_ac"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Air Conditioned" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" multiline rows={2} {...register('description')} />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate('/rooms')}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : isEdit ? 'Update Room' : 'Create Room'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RoomFormPage;
