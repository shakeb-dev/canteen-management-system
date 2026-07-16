import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../components/layout/MainLayout';

// Auth
const Login = lazy(() => import('../features/auth/Login'));
const Unauthorized = lazy(() => import('../components/auth/Unauthorized'));
const AuthLayout = lazy(() => import('../components/layout/AuthLayout'));

// Admin
const AdminDashboard = lazy(() => import('../features/admin/dashboard/AdminDashboard'));
const CanteensList = lazy(() => import('../features/admin/canteens/CanteensList'));
const EmployeesList = lazy(() => import('../features/admin/employees/EmployeesList'));
const CountersList = lazy(() => import('../features/admin/counters/CountersList'));
const MenuList = lazy(() => import('../features/admin/menu/MenuList'));
const Reports = lazy(() => import('../features/admin/reports/Reports'));

// Counter Manager
const CounterDashboard = lazy(() => import('../features/counter/dashboard/CounterDashboard'));
const CounterOrderList = lazy(() => import('../features/counter/orders/CounterOrderList'));
const CounterReports = lazy(() => import('../features/counter/reports/CounterReports'));

// Manager / Supervisor Shared
const ManagerOrderList = lazy(() => import('../features/manager/orders/ManagerOrderList'));

// Employee
const EmployeeDashboard = lazy(() => import('../features/employee/dashboard/EmployeeDashboard'));
const EmployeeCanteens = lazy(() => import('../features/employee/canteens/EmployeeCanteens'));
const EmployeeMenu = lazy(() => import('../features/employee/menu/EmployeeMenu'));
const Cart = lazy(() => import('../features/employee/cart/Cart'));
const EmployeeOrders = lazy(() => import('../features/employee/orders/EmployeeOrders'));
const OrderHistory = lazy(() => import('../features/employee/reports/OrderHistory'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg shadow-primary/20" />
      <p className="text-[12px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Initializing System...</p>
    </div>
  </div>
);

const ProtectedRoute = ({
  allowedRoles,
  children
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  const { user, role, _hasHydrated } = useAuthStore();

  // Wait for hydration to avoid premature redirects
  if (!_hasHydrated) return <PageLoader />;

  console.log('[ProtectedRoute] Debug:', { 
    isAuthenticated: !!user, 
    userRole: role, 
    allowedRoles, 
    path: window.location.pathname 
  });

  if (!user) {
    console.log('[ProtectedRoute] No user found, redirecting to /login');
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role || '')) {
    console.warn(`[ProtectedRoute] Access denied! Role "${role}" not in ${JSON.stringify(allowedRoles)}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export function Router() {
  const { role, user, _hasHydrated } = useAuthStore();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    
    console.log('[AppRouter] Determining default route for:', role);
    
    switch (role) {
      case 'super_admin':
      case 'canteen_supervisor':
        return '/admin/dashboard';
      case 'counter_manager':
        return '/manager/dashboard';
      case 'employee':
        return '/employee/dashboard';
      default:
        console.error('[AppRouter] Unknown role:', role);
        return '/login';
    }
  };

  if (!_hasHydrated) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            user ? <Navigate to={getDefaultRoute()} replace /> : <Login />
          } />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Protected Application Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['super_admin', 'canteen_supervisor', 'counter_manager', 'employee']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

          {/* Admin & Supervisor Shared Paths */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin', 'canteen_supervisor']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-employees" element={
            <ProtectedRoute allowedRoles={['super_admin', 'canteen_supervisor']}>
              <EmployeesList />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-canteen" element={
            <ProtectedRoute allowedRoles={['super_admin', 'canteen_supervisor']}>
              <CanteensList />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-counters" element={
            <ProtectedRoute allowedRoles={['super_admin', 'canteen_supervisor']}>
              <CountersList />
            </ProtectedRoute>
          } />
          <Route path="/admin/food-inventory" element={
            <ProtectedRoute allowedRoles={['super_admin', 'canteen_supervisor']}>
              <MenuList />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics-reports" element={
            <ProtectedRoute allowedRoles={['super_admin', 'canteen_supervisor']}>
              <Reports />
            </ProtectedRoute>
          } />

          {/* Manager / Supervisor Shared Overlap */}
          <Route path="/manager/live-orders" element={
            <ProtectedRoute allowedRoles={['canteen_supervisor', 'counter_manager']}>
              {role === 'canteen_supervisor' ? <ManagerOrderList /> : <CounterOrderList />}
            </ProtectedRoute>
          } />

          {/* Counter Manager Specific */}
          <Route path="/manager/dashboard" element={
            <ProtectedRoute allowedRoles={['counter_manager']}>
              <CounterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manager/reports" element={
            <ProtectedRoute allowedRoles={['counter_manager']}>
              <CounterReports />
            </ProtectedRoute>
          } />

          {/* Employee Paths */}
          <Route path="/employee/dashboard" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee/counters" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeCanteens />
            </ProtectedRoute>
          } />
          <Route path="/employee/menu" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeMenu />
            </ProtectedRoute>
          } />
          <Route path="/employee/cart" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/employee/orders" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeOrders />
            </ProtectedRoute>
          } />
          <Route path="/employee/history" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <OrderHistory />
            </ProtectedRoute>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default Router;




