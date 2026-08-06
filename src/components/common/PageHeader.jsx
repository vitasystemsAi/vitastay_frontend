import { Box, Typography, Breadcrumbs, Link, Button, alpha } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actionLabel,
  actionIcon: ActionIcon = AddIcon,
  onAction,
  actionTo,
  children,
}) => (
  <Box sx={{ mb: 3 }}>
    {breadcrumbs.length > 0 && (
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: alpha('#fff', 0.5) }} />}
        sx={{ mb: 1, color: alpha('#fff', 0.7) }}
      >
        {breadcrumbs.map((crumb, index) =>
          crumb.path ? (
            <Link key={index} component={RouterLink} to={crumb.path} underline="hover" color="inherit">
              {crumb.label}
            </Link>
          ) : (
            <Typography key={index} sx={{ color: '#fff' }} fontSize="0.875rem">
              {crumb.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    )}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom={!!subtitle} sx={{ color: '#fff' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.72) }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {children}
        {(actionLabel && (onAction || actionTo)) && (
          actionTo ? (
            <Button variant="contained" startIcon={<ActionIcon />} component={RouterLink} to={actionTo}>
              {actionLabel}
            </Button>
          ) : (
            <Button variant="contained" startIcon={<ActionIcon />} onClick={onAction}>
              {actionLabel}
            </Button>
          )
        )}
      </Box>
    </Box>
  </Box>
);

export default PageHeader;
