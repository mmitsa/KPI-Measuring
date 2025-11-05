import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Group as TeamIcon,
  EmojiEvents as GoalsIcon,
  Assessment as EvaluationIcon,
  CheckCircle,
  PendingActions,
  TrendingUp,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals } from '@/store/slices/goalsSlice';
import { fetchEvaluations } from '@/store/slices/evaluationsSlice';
import MainLayout from '@/components/layout/MainLayout';

export default function ManagerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { list: goals } = useAppSelector((state) => state.goals);
  const { list: evaluations } = useAppSelector((state) => state.evaluations);

  useEffect(() => {
    // Fetch all goals for manager's approval (could be filtered by managerId on backend)
    dispatch(fetchGoals({}));
    dispatch(fetchEvaluations({}));
  }, [dispatch]);

  // Calculate team statistics
  const teamGoals = goals || [];
  const pendingGoals = teamGoals.filter((g) => g.status === 'Draft').length;
  const approvedGoals = teamGoals.filter((g) => g.status === 'Approved').length;
  const inProgressGoals = teamGoals.filter((g) => g.status === 'InProgress').length;
  const completedGoals = teamGoals.filter((g) => g.status === 'Completed').length;

  const teamEvaluations = evaluations || [];
  const completedEvaluations = teamEvaluations.filter(
    (e) => e.status === 'Finalized' || e.status === 'Approved'
  ).length;
  const avgTeamScore =
    teamEvaluations.length > 0
      ? (
          teamEvaluations
            .filter((e) => e.finalScore !== undefined && e.finalScore !== null)
            .reduce((sum, e) => sum + (e.finalScore || 0), 0) /
          teamEvaluations.filter((e) => e.finalScore !== undefined && e.finalScore !== null).length
        ).toFixed(2)
      : '0.00';

  // Get unique team members from goals
  const teamMembersMap = new Map();
  teamGoals.forEach((goal) => {
    if (goal.employeeId && goal.employeeNameAr) {
      teamMembersMap.set(goal.employeeId, goal.employeeNameAr);
    }
  });
  const teamMemberCount = teamMembersMap.size;

  // Recent activities (pending approvals)
  const recentPendingGoals = teamGoals.filter((g) => g.status === 'Draft').slice(0, 5);

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            لوحة تحكم المدير
          </Typography>
          <Typography variant="body2" color="text.secondary">
            إدارة ومتابعة أداء الفريق
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Team Size */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <TeamIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="primary">
                      {teamMemberCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      أعضاء الفريق
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Approvals */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                    <PendingActions />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="warning.main">
                      {pendingGoals}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      بانتظار الموافقة
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Goals */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                    <GoalsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="success.main">
                      {teamGoals.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      أهداف الفريق
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Average Team Score */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" color="info.main">
                      {avgTeamScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      متوسط أداء الفريق
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  الإجراءات السريعة
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<GoalsIcon />}
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/manager/team-goals')}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    أهداف الفريق
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    startIcon={<EvaluationIcon />}
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/manager/team-evaluations')}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    تقييمات الفريق
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Goals Overview */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  حالة الأهداف
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">معتمدة</Typography>
                      <Typography variant="body2" fontWeight="bold" color="info.main">
                        {approvedGoals}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(approvedGoals / (teamGoals.length || 1)) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                      color="info"
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">قيد التنفيذ</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {inProgressGoals}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(inProgressGoals / (teamGoals.length || 1)) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">مكتملة</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        {completedGoals}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(completedGoals / (teamGoals.length || 1)) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                      color="success"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Approvals List */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  بانتظار الموافقة
                </Typography>
                <Divider sx={{ my: 2 }} />
                {recentPendingGoals.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      لا توجد أهداف بانتظار الموافقة
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <List dense>
                      {recentPendingGoals.map((goal) => (
                        <ListItem key={goal.id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'warning.light' }}>
                              <GoalsIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={goal.title}
                            secondary={goal.employeeNameAr}
                            primaryTypographyProps={{
                              variant: 'body2',
                              noWrap: true,
                            }}
                          />
                          <Chip label="مسودة" size="small" color="default" />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => navigate('/manager/team-goals')}
                      sx={{ mt: 1 }}
                    >
                      عرض الكل
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Evaluations Overview */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    نظرة عامة على التقييمات
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/manager/team-evaluations')}
                  >
                    عرض الكل
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          إجمالي التقييمات
                        </Typography>
                        <Typography variant="h4">{teamEvaluations.length}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          المكتملة
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          {completedEvaluations}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          متوسط الأداء
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {avgTeamScore}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
