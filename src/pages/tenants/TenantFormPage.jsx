import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Box, Grid, TextField, Button, MenuItem, CircularProgress, Card, CardContent,
  Divider, Typography, FormControlLabel, Checkbox, Stack, IconButton, Avatar,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api, { extractData, extractPaginated, getErrorMessage } from '../../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const ID_TYPES = [
  { value: 'aadhar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
  { value: 'voter_id', label: 'Voter ID' },
];

const needsExpiry = (type) => type === 'passport' || type === 'driving_license';

const Section = ({ title, subtitle, children }) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{subtitle}</Typography>
    )}
    {children}
    <Divider sx={{ mt: 3, mb: 3 }} />
  </Box>
);

const FileField = ({ label, file, onChange, accept = 'image/*,.pdf', required, error }) => (
  <Box>
    <Button variant="outlined" component="label" fullWidth sx={{ justifyContent: 'flex-start', py: 1.5 }}>
      {file ? file.name : label}
      <input hidden type="file" accept={accept} onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </Button>
    {(error || required) && (
      <FormHelperText error={Boolean(error)}>
        {error || (required && !file ? 'Required' : ' ')}
      </FormHelperText>
    )}
  </Box>
);

const defaultIdentity = () => ({
  id_type: 'aadhar',
  id_number: '',
  expiry_date: '',
  front: null,
  back: null,
});

const TenantFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [existingDocs, setExistingDocs] = useState([]);

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      phone: '',
      alternate_phone: '',
      date_of_birth: '',
      gender: '',
      blood_group: '',
      nationality: 'Indian',
      marital_status: '',
      permanent_address: '',
      current_address: '',
      same_as_permanent: true,
      is_student: false,
      emergency_contact_name: '',
      emergency_contact_relation: '',
      emergency_contact_phone: '',
      emergency_contact_alternate: '',
      emergency_contact_address: '',
      guardian_name: '',
      guardian_phone: '',
      guardian_email: '',
      guardian_occupation: '',
      guardian_address: '',
      college: '',
      hostel_id: '',
      room_id: '',
      bed_id: '',
      move_in_date: new Date().toISOString().split('T')[0],
      monthly_rent: 0,
      deposit_amount: 0,
      status: 'active',
      identities: [defaultIdentity()],
    },
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: 'identities' });
  const hostelId = watch('hostel_id');
  const sameAsPermanent = watch('same_as_permanent');
  const isStudent = watch('is_student');
  const permanentAddress = watch('permanent_address');
  const identities = watch('identities');

  useEffect(() => {
    api.get('/hostels', { params: { limit: 100 } })
      .then(({ data }) => setHostels(extractPaginated(data).data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!hostelId) { setRooms([]); return; }
    api.get('/rooms', { params: { hostelId, limit: 100, status: isEdit ? undefined : 'vacant' } })
      .then(({ data }) => setRooms(extractPaginated(data).data))
      .catch(() => setRooms([]));
  }, [hostelId, isEdit]);

  useEffect(() => {
    if (sameAsPermanent) setValue('current_address', permanentAddress || '');
  }, [sameAsPermanent, permanentAddress, setValue]);

  useEffect(() => {
    if (!isEdit) return;
    const fetchTenant = async () => {
      try {
        const { data } = await api.get(`/tenants/${id}`);
        const tenant = extractData(data);
        const docs = tenant.documents || [];
        setExistingDocs(docs);
        setPhotoPreview(tenant.photo || '');

        const mappedIds = docs.length
          ? docs.map((d) => ({
            id_type: d.document_type,
            id_number: d.id_number || '',
            expiry_date: d.expiry_date || '',
            front: null,
            back: null,
          }))
          : [defaultIdentity()];

        reset({
          full_name: tenant.full_name || `${tenant.user?.first_name || ''} ${tenant.user?.last_name || ''}`.trim(),
          email: tenant.user?.email || '',
          phone: tenant.user?.phone || '',
          alternate_phone: tenant.alternate_phone || '',
          date_of_birth: tenant.date_of_birth || '',
          gender: tenant.gender || '',
          blood_group: tenant.blood_group || '',
          nationality: tenant.nationality || 'Indian',
          marital_status: tenant.marital_status || '',
          permanent_address: tenant.permanent_address || tenant.address || '',
          current_address: tenant.current_address || '',
          same_as_permanent: tenant.same_as_permanent !== false,
          is_student: Boolean(tenant.is_student || tenant.college),
          emergency_contact_name: tenant.emergency_contact_name || '',
          emergency_contact_relation: tenant.emergency_contact_relation || '',
          emergency_contact_phone: tenant.emergency_contact_phone || '',
          emergency_contact_alternate: tenant.emergency_contact_alternate || '',
          emergency_contact_address: tenant.emergency_contact_address || '',
          guardian_name: tenant.guardian_name || '',
          guardian_phone: tenant.guardian_phone || '',
          guardian_email: tenant.guardian_email || '',
          guardian_occupation: tenant.guardian_occupation || '',
          guardian_address: tenant.guardian_address || '',
          college: tenant.college || '',
          hostel_id: tenant.hostel_id || '',
          room_id: tenant.room_id || '',
          bed_id: tenant.bed_id || '',
          move_in_date: tenant.move_in_date || '',
          monthly_rent: Number(tenant.monthly_rent) || 0,
          deposit_amount: Number(tenant.deposit_amount) || 0,
          status: tenant.status || 'active',
          identities: mappedIds,
          password: '',
        });
      } catch (err) {
        enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
        navigate('/tenants');
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id, isEdit, reset, navigate, enqueueSnackbar]);

  const onPhotoChange = (file) => {
    setPhotoFile(file);
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const setIdentityFile = (index, side, file) => {
    const current = identities[index] || defaultIdentity();
    update(index, { ...current, [side]: file });
  };

  const onSubmit = async (formData) => {
    if (!isEdit && !photoFile) {
      enqueueSnackbar('Profile photo is required', { variant: 'error' });
      return;
    }
    if (!formData.identities?.length || !formData.identities[0]?.id_number) {
      enqueueSnackbar('At least one identity proof is required', { variant: 'error' });
      return;
    }
    if (!isEdit) {
      const missingFront = formData.identities.some((row) => !row.front);
      if (missingFront) {
        enqueueSnackbar('Front image is required for each ID', { variant: 'error' });
        return;
      }
    }
    if (formData.is_student && !formData.guardian_name) {
      enqueueSnackbar('Parent/Guardian details are mandatory for students', { variant: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      const {
        identities: idRows,
        password,
        same_as_permanent,
        is_student,
        ...rest
      } = formData;

      Object.entries(rest).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        payload.append(key, value);
      });
      payload.append('same_as_permanent', same_as_permanent ? 'true' : 'false');
      payload.append('is_student', is_student ? 'true' : 'false');
      if (!isEdit && password) payload.append('password', password);

      const identitiesPayload = idRows.map(({ id_type, id_number, expiry_date }) => ({
        id_type,
        document_type: id_type,
        id_number,
        expiry_date: needsExpiry(id_type) ? expiry_date || null : null,
      }));
      payload.append('identities', JSON.stringify(identitiesPayload));

      if (photoFile) payload.append('photo', photoFile);
      idRows.forEach((row, index) => {
        if (row.front) payload.append(`id_${index}_front`, row.front);
        if (row.back) payload.append(`id_${index}_back`, row.back);
      });

      if (isEdit) {
        await api.put(`/tenants/${id}`, payload);
        enqueueSnackbar('Tenant updated successfully', { variant: 'success' });
      } else {
        await api.post('/tenants', payload);
        enqueueSnackbar('Tenant created successfully', { variant: 'success' });
      }
      navigate('/tenants');
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
        title={isEdit ? 'Edit Tenant' : 'Add Tenant'}
        breadcrumbs={[{ label: 'Tenants', path: '/tenants' }, { label: isEdit ? 'Edit' : 'New' }]}
        subtitle="Complete personal, contact, ID, emergency and guardian details"
      />

      <Card>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Section title="1. Personal Information" subtitle="Mandatory details as per government ID">
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Stack alignItems="center" spacing={1}>
                    <Avatar
                      src={photoPreview}
                      sx={{ width: 96, height: 96, bgcolor: 'primary.main' }}
                    >
                      <PhotoCameraIcon />
                    </Avatar>
                    <Button variant="outlined" size="small" component="label">
                      Profile Photo {!isEdit && '*'}
                      <input hidden type="file" accept="image/*" onChange={(e) => onPhotoChange(e.target.files?.[0] || null)} />
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name (as per ID)"
                        {...register('full_name', { required: 'Required' })}
                        error={!!errors.full_name}
                        helperText={errors.full_name?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        {...register('date_of_birth', { required: 'Required' })}
                        error={!!errors.date_of_birth}
                        helperText={errors.date_of_birth?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="gender"
                        control={control}
                        rules={{ required: 'Required' }}
                        render={({ field }) => (
                          <TextField select fullWidth label="Gender" {...field} error={!!errors.gender} helperText={errors.gender?.message}>
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="blood_group"
                        control={control}
                        render={({ field }) => (
                          <TextField select fullWidth label="Blood Group (recommended)" {...field}>
                            <MenuItem value="">Select</MenuItem>
                            {BLOOD_GROUPS.map((bg) => <MenuItem key={bg} value={bg}>{bg}</MenuItem>)}
                          </TextField>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nationality"
                        {...register('nationality', { required: 'Required' })}
                        error={!!errors.nationality}
                        helperText={errors.nationality?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="marital_status"
                        control={control}
                        render={({ field }) => (
                          <TextField select fullWidth label="Marital Status (optional)" {...field}>
                            <MenuItem value="">Select</MenuItem>
                            <MenuItem value="single">Single</MenuItem>
                            <MenuItem value="married">Married</MenuItem>
                            <MenuItem value="divorced">Divorced</MenuItem>
                            <MenuItem value="widowed">Widowed</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Section>

            <Section title="2. Contact Details" subtitle="Primary contact and address information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    {...register('phone', { required: 'Required' })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Alternate Mobile Number" {...register('alternate_phone')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    disabled={isEdit}
                    {...register('email', { required: 'Required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                {!isEdit && (
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Login Password"
                      type="password"
                      {...register('password', { minLength: { value: 6, message: 'Min 6 characters' } })}
                      helperText="Default: Tenant@123 if left blank"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Permanent Address"
                    {...register('permanent_address', { required: 'Required' })}
                    error={!!errors.permanent_address}
                    helperText={errors.permanent_address?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="same_as_permanent"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} />}
                        label="Current address same as permanent"
                      />
                    )}
                  />
                </Grid>
                {!sameAsPermanent && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Current Address"
                      {...register('current_address', { required: !sameAsPermanent ? 'Required' : false })}
                      error={!!errors.current_address}
                      helperText={errors.current_address?.message}
                    />
                  </Grid>
                )}
              </Grid>
            </Section>

            <Section title="3. Identity Proof" subtitle="Collect one or more government-issued IDs (Aadhaar, PAN, Passport, DL, Voter ID)">
              {existingDocs.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Existing documents on file: {existingDocs.map((d) => d.title).join(', ')}
                </Typography>
              )}
              {fields.map((field, index) => (
                <Card key={field.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography fontWeight={600}>ID #{index + 1}</Typography>
                    {fields.length > 1 && (
                      <IconButton color="error" onClick={() => remove(index)} size="small">
                        <DeleteOutlineIcon />
                      </IconButton>
                    )}
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name={`identities.${index}.id_type`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: f }) => (
                          <TextField select fullWidth label="ID Type" {...f}>
                            {ID_TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                          </TextField>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="ID Number"
                        {...register(`identities.${index}.id_number`, { required: 'Required' })}
                        error={!!errors.identities?.[index]?.id_number}
                        helperText={errors.identities?.[index]?.id_number?.message}
                      />
                    </Grid>
                    {needsExpiry(identities?.[index]?.id_type) && (
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          {...register(`identities.${index}.expiry_date`, { required: 'Required for this ID' })}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <FileField
                        label={identities?.[index]?.front?.name || 'Front Image *'}
                        file={identities?.[index]?.front}
                        onChange={(file) => setIdentityFile(index, 'front', file)}
                        required={!isEdit}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FileField
                        label={identities?.[index]?.back?.name || 'Back Image (if applicable)'}
                        file={identities?.[index]?.back}
                        onChange={(file) => setIdentityFile(index, 'back', file)}
                      />
                    </Grid>
                  </Grid>
                </Card>
              ))}
              {fields.length < 5 && (
                <Button startIcon={<AddIcon />} onClick={() => append(defaultIdentity())} sx={{ mb: 1 }}>
                  Add another ID
                </Button>
              )}
            </Section>

            <Section title="4. Emergency Contact" subtitle="Mandatory emergency contact person">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Contact Person Name"
                    {...register('emergency_contact_name', { required: 'Required' })}
                    error={!!errors.emergency_contact_name}
                    helperText={errors.emergency_contact_name?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Relationship"
                    {...register('emergency_contact_relation', { required: 'Required' })}
                    error={!!errors.emergency_contact_relation}
                    helperText={errors.emergency_contact_relation?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    {...register('emergency_contact_phone', { required: 'Required' })}
                    error={!!errors.emergency_contact_phone}
                    helperText={errors.emergency_contact_phone?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Alternate Number" {...register('emergency_contact_alternate')} />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Address"
                    {...register('emergency_contact_address', { required: 'Required' })}
                    error={!!errors.emergency_contact_address}
                    helperText={errors.emergency_contact_address?.message}
                  />
                </Grid>
              </Grid>
            </Section>

            <Section title="5. Parent / Guardian Details" subtitle="Mandatory for students">
              <Controller
                name="is_student"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} />}
                    label="Tenant is a student (guardian details required)"
                    sx={{ mb: 1 }}
                  />
                )}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Father / Mother / Guardian Name"
                    {...register('guardian_name', { required: isStudent ? 'Required for students' : false })}
                    error={!!errors.guardian_name}
                    helperText={errors.guardian_name?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    {...register('guardian_phone', { required: isStudent ? 'Required for students' : false })}
                    error={!!errors.guardian_phone}
                    helperText={errors.guardian_phone?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Email" type="email" {...register('guardian_email')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Occupation" {...register('guardian_occupation')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="College / Institution" {...register('college')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Guardian Address"
                    {...register('guardian_address', { required: isStudent ? 'Required for students' : false })}
                    error={!!errors.guardian_address}
                    helperText={errors.guardian_address?.message}
                  />
                </Grid>
              </Grid>
            </Section>

            <Section title="6. Accommodation" subtitle="Hostel allocation and rent">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                  <Controller
                    name="room_id"
                    control={control}
                    render={({ field }) => (
                      <TextField select fullWidth label="Room" {...field}>
                        <MenuItem value="">Select Room</MenuItem>
                        {rooms.map((r) => <MenuItem key={r.id} value={r.id}>{r.room_number} (Floor {r.floor})</MenuItem>)}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Move-in Date" type="date" InputLabelProps={{ shrink: true }} {...register('move_in_date')} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Monthly Rent (₹)" type="number" {...register('monthly_rent', { valueAsNumber: true })} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth label="Security Deposit (₹)" type="number" {...register('deposit_amount', { valueAsNumber: true })} />
                </Grid>
                {isEdit && (
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <TextField select fullWidth label="Status" {...field}>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="moved_out">Moved Out</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            </Section>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/tenants')}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : isEdit ? 'Update Tenant' : 'Create Tenant'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TenantFormPage;
