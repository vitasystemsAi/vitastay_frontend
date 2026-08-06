export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  OWNER: 'owner',
  SUPERVISOR: 'supervisor',
  TENANT: 'tenant',
  STAFF: 'staff',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  owner: 'Owner',
  supervisor: 'Supervisor',
  tenant: 'Tenant',
  staff: 'Staff',
};

export const HOSTEL_FEATURES = [
  { key: 'rooms', label: 'Rooms & Beds' },
  { key: 'tenants', label: 'Tenants' },
  { key: 'rent', label: 'Rent Collection' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'visitors', label: 'Visitors' },
  { key: 'complaints', label: 'Complaints' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'notices', label: 'Notices' },
  { key: 'staff', label: 'Staff' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'inventory', label: 'Inventory' },
  { key: 'reports', label: 'Reports' },
];

export const DEFAULT_HOSTEL_FEATURES = HOSTEL_FEATURES.reduce((acc, f) => {
  acc[f.key] = true;
  return acc;
}, {});

export const AMENITY_OPTIONS = [
  'WiFi',
  'AC',
  'Laundry',
  'Gym',
  'CCTV',
  'Power Backup',
  'Mess / Food',
  'Parking',
  'Hot Water',
  'Housekeeping',
  'Study Room',
  'RO Water',
];

export const ROOM_STATUS = {
  VACANT: 'vacant',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  RESERVED: 'reserved',
};

export const ROOM_STATUS_LABELS = {
  vacant: 'Vacant',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
};

export const RENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  OVERDUE: 'overdue',
};

export const RENT_STATUS_LABELS = {
  pending: 'Pending',
  paid: 'Paid',
  partial: 'Partial',
  overdue: 'Overdue',
};

export const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  CLOSED: 'closed',
};

export const COMPLAINT_STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Completed',
  rejected: 'Rejected',
  closed: 'Closed',
};

export const MAINTENANCE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const MAINTENANCE_STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const VISITOR_STATUS = {
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
  PENDING: 'pending',
};

export const VISITOR_STATUS_LABELS = {
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  pending: 'Pending',
};

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const COMPLAINT_CATEGORIES = [
  { value: 'room', label: 'Room' },
  { value: 'electric', label: 'Electric' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'food', label: 'Food' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' },
];

export const EXPENSE_CATEGORIES = [
  'utilities',
  'maintenance',
  'salaries',
  'supplies',
  'food',
  'cleaning',
  'security',
  'other',
];

export const PAYMENT_MODES = ['cash', 'upi', 'bank_transfer', 'card', 'cheque'];

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'vitastay_access_token',
  REFRESH_TOKEN: 'vitastay_refresh_token',
  USER: 'vitastay_user',
  REMEMBER_ME: 'vitastay_remember_me',
  THEME: 'vitastay_theme',
};

export const ROUTE_ACCESS = {
  super_admin: [
    '/dashboard', '/hostels', '/super-admin', '/users', '/settings', '/profile', '/notifications',
  ],
  owner: [
    '/dashboard', '/hostels', '/rooms', '/tenants', '/rent', '/revenue', '/expenses',
    '/visitors', '/complaints', '/maintenance', '/notices', '/staff',
    '/attendance', '/inventory', '/reports', '/settings', '/profile', '/notifications',
  ],
  supervisor: [
    '/dashboard', '/hostels', '/rooms', '/tenants', '/rent', '/revenue', '/expenses',
    '/visitors', '/complaints', '/maintenance', '/notices', '/staff',
    '/attendance', '/inventory', '/reports', '/profile', '/notifications',
  ],
  tenant: [
    '/dashboard', '/rent', '/complaints', '/visitors', '/notices',
    '/profile', '/notifications',
  ],
  staff: [
    '/dashboard', '/complaints', '/maintenance', '/notices', '/profile', '/notifications',
  ],
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'Dashboard', roles: ['super_admin', 'owner', 'supervisor', 'tenant', 'staff'] },
  { label: 'Hostels', path: '/hostels', icon: 'Business', roles: ['super_admin', 'owner', 'supervisor'] },
  { label: 'Register Hostel', path: '/super-admin/register-hostel', icon: 'Business', roles: ['super_admin'] },
  { label: 'Users', path: '/super-admin/users', icon: 'People', roles: ['super_admin'] },
  { label: 'Rooms', path: '/rooms', icon: 'MeetingRoom', roles: ['owner', 'supervisor'] },
  { label: 'Tenants', path: '/tenants', icon: 'People', roles: ['owner', 'supervisor'] },
  { label: 'Rent', path: '/rent', icon: 'Payments', roles: ['owner', 'supervisor', 'tenant'] },
  { label: 'Revenue', path: '/revenue', icon: 'TrendingUp', roles: ['owner', 'supervisor'] },
  { label: 'Expenses', path: '/expenses', icon: 'Receipt', roles: ['owner', 'supervisor'] },
  { label: 'Visitors', path: '/visitors', icon: 'Badge', roles: ['owner', 'supervisor', 'tenant'] },
  { label: 'Complaints', path: '/complaints', icon: 'ReportProblem', roles: ['owner', 'supervisor', 'tenant', 'staff'] },
  { label: 'Maintenance', path: '/maintenance', icon: 'Build', roles: ['owner', 'supervisor', 'staff'] },
  { label: 'Notices', path: '/notices', icon: 'Campaign', roles: ['owner', 'supervisor', 'tenant', 'staff'] },
  { label: 'Staff', path: '/staff', icon: 'Groups', roles: ['owner', 'supervisor'] },
  { label: 'Attendance', path: '/attendance', icon: 'EventAvailable', roles: ['owner', 'supervisor'] },
  { label: 'Inventory', path: '/inventory', icon: 'Inventory', roles: ['owner', 'supervisor'] },
  { label: 'Reports', path: '/reports', icon: 'Assessment', roles: ['owner', 'supervisor'] },
  { label: 'Settings', path: '/settings', icon: 'Settings', roles: ['owner'] },
];

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return `${first}${last}`.toUpperCase() || '?';
};

/** Resolve uploaded media paths (e.g. /uploads/avatars/x.jpg) to a browser URL */
export const getMediaUrl = (path) => {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  const apiBase = import.meta.env.VITE_API_URL || '/api';
  if (apiBase.startsWith('http')) {
    try {
      const origin = new URL(apiBase).origin;
      return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
    } catch {
      // fall through
    }
  }
  return path.startsWith('/') ? path : `/${path}`;
};

export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return '/dashboard/super-admin';
    case ROLES.OWNER:
      return '/dashboard/owner';
    case ROLES.SUPERVISOR:
      return '/dashboard/supervisor';
    case ROLES.TENANT:
      return '/dashboard/tenant';
    default:
      return '/dashboard';
  }
};

export const canAccessRoute = (role, path) => {
  const allowed = ROUTE_ACCESS[role] || [];
  const basePath = `/${path.split('/').filter(Boolean)[0] || ''}`;
  return allowed.some((route) => path.startsWith(route) || basePath === route);
};
