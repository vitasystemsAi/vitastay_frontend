import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Avatar, Typography, Badge, Menu, MenuItem, Divider, Tooltip,
  useMediaQuery, useTheme, alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BadgeIcon from '@mui/icons-material/Badge';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BuildIcon from '@mui/icons-material/Build';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupsIcon from '@mui/icons-material/Groups';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import useAuth from '../hooks/useAuth';
import useThemeHook from '../hooks/useTheme';
import SearchBar from '../components/common/SearchBar';
import { NAV_ITEMS, getInitials, getDashboardPath, getMediaUrl } from '../utils/constants';
import { setSidebarOpen, setNotifications, toggleSidebarCollapsed } from '../redux/slices/uiSlice';
import api, { extractData } from '../services/api';
import { brand } from '../styles/theme';
import {
  atmosphereRootSx,
  atmosphereGridSx,
  atmosphereOrbPrimarySx,
  atmosphereOrbSecondarySx,
} from '../styles/atmosphere';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 72;

const ICON_MAP = {
  Dashboard: DashboardIcon,
  Business: BusinessIcon,
  MeetingRoom: MeetingRoomIcon,
  People: PeopleIcon,
  Payments: PaymentsIcon,
  Receipt: ReceiptIcon,
  Badge: BadgeIcon,
  ReportProblem: ReportProblemIcon,
  Build: BuildIcon,
  Campaign: CampaignIcon,
  Groups: GroupsIcon,
  EventAvailable: EventAvailableIcon,
  Inventory: InventoryIcon,
  Assessment: AssessmentIcon,
  TrendingUp: TrendingUpIcon,
  Settings: SettingsIcon,
};

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeHook();
  const { sidebarOpen, sidebarCollapsed, unreadCount } = useSelector((state) => state.ui);
  const [anchorEl, setAnchorEl] = useState(null);

  const drawerWidth = sidebarCollapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;

  useEffect(() => {
    dispatch(setSidebarOpen(!isMobile));
  }, [isMobile, dispatch]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/settings/notifications', { params: { limit: 5 } });
        const notifications = extractData(data) || data.data || [];
        dispatch(setNotifications(Array.isArray(notifications) ? notifications : []));
      } catch {
        // Silently fail
      }
    };
    if (user) fetchNotifications();
  }, [user, dispatch]);

  const navItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) dispatch(setSidebarOpen(false));
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#fff' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: sidebarCollapsed ? 1 : 1.5,
          py: sidebarCollapsed ? 1.5 : 2,
          minHeight: sidebarCollapsed ? 64 : 80,
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Box
          component="img"
          src="/images/logo.png"
          alt="Vita Stay"
          sx={{
            width: sidebarCollapsed ? 36 : '100%',
            maxWidth: sidebarCollapsed ? 36 : '100%',
            maxHeight: sidebarCollapsed ? 36 : 64,
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            borderRadius: 1.5,
          }}
        />
      </Box>
      <Divider sx={{ borderColor: alpha('#fff', 0.12) }} />
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] || DashboardIcon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Tooltip key={item.path} title={sidebarCollapsed ? item.label : ''} placement="right">
              <ListItemButton
                onClick={() => handleNavClick(item.path === '/dashboard' ? getDashboardPath(user?.role) : item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  minHeight: 44,
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  px: sidebarCollapsed ? 1 : 2,
                  color: alpha('#fff', 0.85),
                  '&:hover': { bgcolor: alpha('#fff', 0.08) },
                  '&.Mui-selected': {
                    bgcolor: alpha(brand.teal, 0.22),
                    color: '#fff',
                    '&:hover': { bgcolor: alpha(brand.teal, 0.3) },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: sidebarCollapsed ? 0 : 40,
                    justifyContent: 'center',
                    color: isActive ? brand.tealLight : alpha('#fff', 0.75),
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', ...atmosphereRootSx }}>
      <Box sx={atmosphereGridSx} />
      <Box sx={atmosphereOrbPrimarySx} />
      <Box sx={atmosphereOrbSecondarySx} />

      <AppBar
        position="fixed"
        color="inherit"
        sx={{
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], { duration: theme.transitions.duration.standard }),
          bgcolor: alpha(brand.navyDark, 0.82),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(brand.teal, 0.2)}`,
          color: '#fff',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {isMobile && (
            <IconButton edge="start" onClick={() => dispatch(setSidebarOpen(!sidebarOpen))} sx={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ width: '100%', maxWidth: 480, display: { xs: 'none', sm: 'block' } }}>
            <SearchBar placeholder="Search tenants, rooms, hostels..." globalSearch />
          </Box>
          <Box sx={{ flex: 1 }} />
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton onClick={toggleTheme} sx={{ color: '#fff' }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton onClick={() => navigate('/notifications')} sx={{ color: '#fff' }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar
              src={getMediaUrl(user?.avatar) || undefined}
              sx={{ width: 36, height: 36, bgcolor: brand.teal, fontSize: '0.875rem' }}
            >
              {getInitials(user?.first_name, user?.last_name)}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{ sx: { minWidth: 200, borderRadius: 2, mt: 1 } }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary" textTransform="capitalize">
                {user?.role}
              </Typography>
            </Box>
            <Divider />
            <MenuItem component={RouterLink} to="/profile" onClick={() => setAnchorEl(null)}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); logout(); }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width'),
            overflowX: 'hidden',
            bgcolor: alpha(brand.navyDark, 0.88),
            backdropFilter: 'blur(24px)',
            borderRight: `1px solid ${alpha(brand.teal, 0.2)}`,
            color: '#fff',
            backgroundImage: 'none',
          },
        }}
      >
        {drawerContent}
        {!isMobile && (
          <Box sx={{ p: 1, borderTop: `1px solid ${alpha('#fff', 0.12)}` }}>
            <IconButton
              onClick={() => dispatch(toggleSidebarCollapsed())}
              sx={{ width: '100%', borderRadius: 2, color: alpha('#fff', 0.8) }}
            >
              <ChevronLeftIcon sx={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </IconButton>
          </Box>
        )}
      </Drawer>

      <Box
        component="main"
        sx={{
          position: 'relative',
          zIndex: 1,
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: 8,
          width: { md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          transition: theme.transitions.create(['width', 'margin']),
          bgcolor: 'transparent',
          minHeight: '100vh',
        }}
        className="page-container"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
