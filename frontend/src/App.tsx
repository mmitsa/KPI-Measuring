import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import createAppTheme from '@/theme';
import PrivateRoute from '@/components/auth/PrivateRoute';
import RoleGuard from '@/components/auth/RoleGuard';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import EmployeeDashboard from '@/pages/employee/EmployeeDashboard';

function App() {
  const { language } = useAppSelector((state) => state.ui);
  const theme = createAppTheme(language === 'ar' ? 'rtl' : 'ltr');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Employee Routes */}
        <Route
          path="/employee/*"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Employee', 'Manager', 'HR', 'Admin']}>
                <EmployeeDashboard />
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/*"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Manager', 'HR', 'Admin']}>
                <div>Manager Dashboard (Coming Soon)</div>
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* HR Routes */}
        <Route
          path="/hr/*"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['HR', 'Admin']}>
                <div>HR Dashboard (Coming Soon)</div>
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Admin']}>
                <div>Admin Dashboard (Coming Soon)</div>
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* Executive Routes */}
        <Route
          path="/executive/*"
          element={
            <PrivateRoute>
              <RoleGuard allowedRoles={['Executive', 'Admin']}>
                <div>Executive Dashboard (Coming Soon)</div>
              </RoleGuard>
            </PrivateRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
