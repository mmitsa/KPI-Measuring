import { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import {
  EmojiEvents as GoalsIcon,
  Assessment as EvaluationIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals } from '@/store/slices/goalsSlice';
import { fetchEvaluations } from '@/store/slices/evaluationsSlice';
import MainLayout from '@/components/layout/MainLayout';

export default function EmployeeDashboard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { list: goals, loading: goalsLoading } = useAppSelector((state) => state.goals);
  const { list: evaluations, loading: evalsLoading } = useAppSelector(
    (state) => state.evaluations
  );

  useEffect(() => {
    if (user?.employee?.id) {
      dispatch(fetchGoals({ employeeId: user.employee.id }));
      dispatch(fetchEvaluations({ employeeId: user.employee.id }));
    }
  }, [dispatch, user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'inprogress':
        return 'primary';
      case 'approved':
        return 'info';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <MainLayout>
      <Box>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('dashboard.welcome', { name: user?.fullNameAr })}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.employee?.departmentNameAr} - {user?.employee?.positionNameAr}
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GoalsIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {goals.length}
                    </Typography>
                    <Typography variant="body2">{t('dashboard.totalGoals')}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GoalsIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {goals.filter((g) => g.status === 'Completed').length}
                    </Typography>
                    <Typography variant="body2">
                      {t('dashboard.completedGoals')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                bgcolor: 'secondary.main',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EvaluationIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {evaluations.length}
                    </Typography>
                    <Typography variant="body2">{t('dashboard.myEvaluations')}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Goals Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                {t('dashboard.myGoals')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 2 }}
              >
                {t('goals.create')}
              </Button>
            </Box>

            {goalsLoading ? (
              <LinearProgress />
            ) : goals.length === 0 ? (
              <Alert severity="info">لا توجد أهداف حالياً. ابدأ بإنشاء هدف جديد!</Alert>
            ) : (
              <Grid container spacing={2}>
                {goals.slice(0, 5).map((goal) => (
                  <Grid item xs={12} key={goal.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {goal.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {goal.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip
                                label={goal.type}
                                size="small"
                                color={getStatusColor(goal.status)}
                              />
                              <Chip
                                label={`الوزن: ${goal.weight}%`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          <Chip
                            label={t(`goals.statuses.${goal.status.toLowerCase()}`)}
                            color={getStatusColor(goal.status)}
                          />
                        </Box>

                        {goal.progressPercent !== null && goal.progressPercent !== undefined && (
                          <Box sx={{ mt: 2 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">التقدم</Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {goal.progressPercent}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={goal.progressPercent}
                              sx={{ height: 8, borderRadius: 1 }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Evaluations Section */}
        <Card>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {t('dashboard.myEvaluations')}
            </Typography>

            {evalsLoading ? (
              <LinearProgress />
            ) : evaluations.length === 0 ? (
              <Alert severity="info">لا توجد تقييمات حالياً</Alert>
            ) : (
              <Grid container spacing={2}>
                {evaluations.slice(0, 3).map((evaluation) => (
                  <Grid item xs={12} md={4} key={evaluation.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {evaluation.period}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {evaluation.evaluationType}
                        </Typography>
                        {evaluation.finalScore && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                              {evaluation.finalScore.toFixed(2)}
                            </Typography>
                            <Chip
                              label={evaluation.finalRating || 'قيد التقييم'}
                              color="primary"
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}
