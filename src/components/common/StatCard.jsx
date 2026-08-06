import { Box, Card, CardContent, Typography, Avatar, alpha, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary', size = 'default' }) => {
  const theme = useTheme();
  const isPositive = trend === 'up';
  const compact = size === 'small';

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 40px rgba(0,0,0,0.5)'
            : '0 12px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ p: compact ? 1.75 : 2.5, '&:last-child': { pb: compact ? 1.75 : 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: compact ? '0.75rem' : undefined }}>
              {title}
            </Typography>
            <Typography
              variant={compact ? 'h6' : 'h4'}
              fontWeight={700}
              sx={{ mb: 0.25, fontSize: compact ? '1.25rem' : undefined, lineHeight: 1.2 }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: compact ? '0.68rem' : undefined }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{ color: isPositive ? 'success.main' : 'error.main', fontWeight: 500 }}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          {Icon && (
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.12),
                color: `${color}.main`,
                width: compact ? 36 : 48,
                height: compact ? 36 : 48,
              }}
            >
              <Icon sx={{ fontSize: compact ? 18 : 24 }} />
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
