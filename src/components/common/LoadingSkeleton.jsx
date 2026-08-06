import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

const LoadingSkeleton = ({ variant = 'card', rows = 5, columns = 4 }) => {
  if (variant === 'table') {
    return (
      <Box>
        <Skeleton variant="rounded" height={48} sx={{ mb: 1, borderRadius: 2 }} />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 0.5, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  if (variant === 'form') {
    return (
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'dashboard') {
    return (
      <Box>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rounded" height={100} sx={{ mt: 2, borderRadius: 2 }} />
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
