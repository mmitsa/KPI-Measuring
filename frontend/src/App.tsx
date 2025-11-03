import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'

// Pages
import Login from '@pages/auth/Login'
import EmployeeDashboard from '@pages/employee/Dashboard'
import ManagerDashboard from '@pages/manager/Dashboard'
import HRDashboard from '@pages/hr/Dashboard'
import AdminDashboard from '@pages/admin/Dashboard'
import ExecutiveDashboard from '@pages/executive/Dashboard'

// Components
import PrivateRoute from '@components/common/PrivateRoute'
import NotFound from '@pages/NotFound'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<Login />} />

        {/* Private Routes */}
        <Route
          path="/employee/*"
          element={
            <PrivateRoute roles={['Employee']}>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager/*"
          element={
            <PrivateRoute roles={['Manager']}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr/*"
          element={
            <PrivateRoute roles={['HR']}>
              <HRDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <PrivateRoute roles={['Admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/executive/*"
          element={
            <PrivateRoute roles={['Executive']}>
              <ExecutiveDashboard />
            </PrivateRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  )
}

export default App
