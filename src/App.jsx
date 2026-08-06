import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import useTheme from './hooks/useTheme';
import useAuth from './hooks/useAuth';
import { canAccessRoute, getDashboardPath } from './utils/constants';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const OwnerDashboard = lazy(() => import('./pages/dashboard/OwnerDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/dashboard/SuperAdminDashboard'));
const SupervisorDashboard = lazy(() => import('./pages/dashboard/SupervisorDashboard'));
const TenantDashboard = lazy(() => import('./pages/dashboard/TenantDashboard'));
const HostelListPage = lazy(() => import('./pages/hostels/HostelListPage'));
const HostelFormPage = lazy(() => import('./pages/hostels/HostelFormPage'));
const RegisterHostelPage = lazy(() => import('./pages/super-admin/RegisterHostelPage'));
const SuperAdminUsersPage = lazy(() => import('./pages/super-admin/UsersPage'));
const RoomListPage = lazy(() => import('./pages/rooms/RoomListPage'));
const RoomFormPage = lazy(() => import('./pages/rooms/RoomFormPage'));
const TenantListPage = lazy(() => import('./pages/tenants/TenantListPage'));
const TenantFormPage = lazy(() => import('./pages/tenants/TenantFormPage'));
const RentListPage = lazy(() => import('./pages/rent/RentListPage'));
const CollectRentPage = lazy(() => import('./pages/rent/CollectRentPage'));
const RevenuePage = lazy(() => import('./pages/revenue/RevenuePage'));
const ExpenseListPage = lazy(() => import('./pages/expenses/ExpenseListPage'));
const VisitorListPage = lazy(() => import('./pages/visitors/VisitorListPage'));
const ComplaintListPage = lazy(() => import('./pages/complaints/ComplaintListPage'));
const MaintenanceListPage = lazy(() => import('./pages/maintenance/MaintenanceListPage'));
const NoticeListPage = lazy(() => import('./pages/notices/NoticeListPage'));
const StaffListPage = lazy(() => import('./pages/staff/StaffListPage'));
const AttendancePage = lazy(() => import('./pages/attendance/AttendancePage'));
const InventoryListPage = lazy(() => import('./pages/inventory/InventoryListPage'));
const ReportsPage = lazy(() => import('./pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'));

const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <CircularProgress />
  </Box>
);

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  if (!canAccessRoute(user?.role, location.pathname)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={getDashboardPath(user?.role)} replace />;
};

const App = () => {
  const { ThemeProviderWrapper } = useTheme();

  return (
    <ThemeProviderWrapper>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
            <Route path="reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/dashboard/super-admin" element={<ProtectedRoute roles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/owner" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/supervisor" element={<ProtectedRoute roles={['owner', 'supervisor']}><SupervisorDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/tenant" element={<ProtectedRoute roles={['tenant']}><TenantDashboard /></ProtectedRoute>} />

            <Route path="/hostels" element={<ProtectedRoute roles={['super_admin', 'owner', 'supervisor']}><HostelListPage /></ProtectedRoute>} />
            <Route path="/hostels/new" element={<ProtectedRoute roles={['owner']}><HostelFormPage /></ProtectedRoute>} />
            <Route path="/hostels/:id/edit" element={<ProtectedRoute roles={['super_admin', 'owner', 'supervisor']}><HostelFormPage /></ProtectedRoute>} />

            <Route path="/super-admin/register-hostel" element={<ProtectedRoute roles={['super_admin']}><RegisterHostelPage /></ProtectedRoute>} />
            <Route path="/super-admin/users" element={<ProtectedRoute roles={['super_admin']}><SuperAdminUsersPage /></ProtectedRoute>} />

            <Route path="/rooms" element={<ProtectedRoute roles={['owner', 'supervisor']}><RoomListPage /></ProtectedRoute>} />
            <Route path="/rooms/new" element={<ProtectedRoute roles={['owner', 'supervisor']}><RoomFormPage /></ProtectedRoute>} />
            <Route path="/rooms/:id/edit" element={<ProtectedRoute roles={['owner', 'supervisor']}><RoomFormPage /></ProtectedRoute>} />

            <Route path="/tenants" element={<ProtectedRoute roles={['owner', 'supervisor']}><TenantListPage /></ProtectedRoute>} />
            <Route path="/tenants/new" element={<ProtectedRoute roles={['owner', 'supervisor']}><TenantFormPage /></ProtectedRoute>} />
            <Route path="/tenants/:id/edit" element={<ProtectedRoute roles={['owner', 'supervisor']}><TenantFormPage /></ProtectedRoute>} />

            <Route path="/rent" element={<ProtectedRoute roles={['owner', 'supervisor', 'tenant']}><RentListPage /></ProtectedRoute>} />
            <Route path="/rent/collect/:id?" element={<ProtectedRoute roles={['owner', 'supervisor']}><CollectRentPage /></ProtectedRoute>} />
            <Route path="/revenue" element={<ProtectedRoute roles={['owner', 'supervisor']}><RevenuePage /></ProtectedRoute>} />

            <Route path="/expenses" element={<ProtectedRoute roles={['owner', 'supervisor']}><ExpenseListPage /></ProtectedRoute>} />
            <Route path="/visitors" element={<ProtectedRoute roles={['owner', 'supervisor', 'tenant']}><VisitorListPage /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute roles={['owner', 'supervisor', 'tenant', 'staff']}><ComplaintListPage /></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute roles={['owner', 'supervisor', 'staff']}><MaintenanceListPage /></ProtectedRoute>} />
            <Route path="/notices" element={<ProtectedRoute roles={['owner', 'supervisor', 'tenant', 'staff']}><NoticeListPage /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute roles={['owner', 'supervisor']}><StaffListPage /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute roles={['owner', 'supervisor']}><AttendancePage /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute roles={['owner', 'supervisor']}><InventoryListPage /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute roles={['owner', 'supervisor']}><ReportsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute roles={['owner']}><SettingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </ThemeProviderWrapper>
  );
};

export default App;
