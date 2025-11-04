import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Box, Typography } from '@mui/material';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = user?.roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h5" gutterBottom>
          غير مصرح لك بالوصول
        </Typography>
        <Typography color="text.secondary">
          ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
