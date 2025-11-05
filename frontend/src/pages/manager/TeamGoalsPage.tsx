import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Cancel,
  Search,
  MoreVert,
  Flag,
  Person,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals, Goal } from '@/store/slices/goalsSlice';
import ViewGoalDialog from '@/components/goals/ViewGoalDialog';
import GoalApprovalDialog from '@/components/manager/GoalApprovalDialog';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'default';
    case 'Approved':
      return 'info';
    case 'InProgress':
      return 'primary';
    case 'Completed':
      return 'success';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'مسودة';
    case 'Approved':
      return 'معتمد';
    case 'InProgress':
      return 'قيد التنفيذ';
    case 'Completed':
      return 'مكتمل';
    case 'Cancelled':
      return 'ملغي';
    default:
      return status;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'Strategic':
      return 'استراتيجي';
    case 'Operational':
      return 'تشغيلي';
    case 'Development':
      return 'تطويري';
    default:
      return type;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Strategic':
      return '#9C27B0';
    case 'Operational':
      return '#2196F3';
    case 'Development':
      return '#FF9800';
    default:
      return '#757575';
  }
};

export default function TeamGoalsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { list: goals, loading, error } = useAppSelector((state) => state.goals);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuGoal, setMenuGoal] = useState<Goal | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  useEffect(() => {
    // Fetch all team goals (in real app, filter by managerId on backend)
    dispatch(fetchGoals({}));
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, goal: Goal) => {
    setAnchorEl(event.currentTarget);
    setMenuGoal(goal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuGoal(null);
  };

  const handleView = (goal: Goal) => {
    setSelectedGoal(goal);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleApprove = (goal: Goal) => {
    setSelectedGoal(goal);
    setApprovalDialogOpen(true);
    handleMenuClose();
  };

  // Get unique employees
  const uniqueEmployees = Array.from(
    new Map(goals.map((g) => [g.employeeId, g.employeeNameAr])).entries()
  );

  // Filter goals
  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goal.description && goal.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      goal.employeeNameAr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || goal.status === statusFilter;
    const matchesType = !typeFilter || goal.type === typeFilter;
    const matchesEmployee = !employeeFilter || goal.employeeId === employeeFilter;

    return matchesSearch && matchesStatus && matchesType && matchesEmployee;
  });

  // Calculate statistics
  const totalGoals = filteredGoals.length;
  const pendingGoals = filteredGoals.filter((g) => g.status === 'Draft').length;
  const approvedGoals = filteredGoals.filter((g) => g.status === 'Approved').length;
  const inProgressGoals = filteredGoals.filter((g) => g.status === 'InProgress').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          أهداف الفريق
        </Typography>
        <Typography variant="body2" color="text.secondary">
          متابعة والموافقة على أهداف أعضاء الفريق
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                إجمالي الأهداف
              </Typography>
              <Typography variant="h4" color="primary">
                {totalGoals}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                بانتظار الموافقة
              </Typography>
              <Typography variant="h4" color="warning.main">
                {pendingGoals}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                معتمدة
              </Typography>
              <Typography variant="h4" color="info.main">
                {approvedGoals}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                قيد التنفيذ
              </Typography>
              <Typography variant="h4" color="success.main">
                {inProgressGoals}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="البحث في الأهداف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>الموظف</InputLabel>
                <Select
                  value={employeeFilter}
                  label="الموظف"
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                >
                  <MenuItem value="">الكل</MenuItem>
                  {uniqueEmployees.map(([id, name]) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>الحالة</InputLabel>
                <Select
                  value={statusFilter}
                  label="الحالة"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">الكل</MenuItem>
                  <MenuItem value="Draft">مسودة</MenuItem>
                  <MenuItem value="Approved">معتمد</MenuItem>
                  <MenuItem value="InProgress">قيد التنفيذ</MenuItem>
                  <MenuItem value="Completed">مكتمل</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>النوع</InputLabel>
                <Select
                  value={typeFilter}
                  label="النوع"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="">الكل</MenuItem>
                  <MenuItem value="Strategic">استراتيجي</MenuItem>
                  <MenuItem value="Operational">تشغيلي</MenuItem>
                  <MenuItem value="Development">تطويري</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ height: '56px' }}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setTypeFilter('');
                  setEmployeeFilter('');
                }}
              >
                إعادة تعيين
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Flag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm || statusFilter || typeFilter || employeeFilter
                  ? 'لا توجد أهداف تطابق معايير البحث'
                  : 'لا توجد أهداف للفريق بعد'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredGoals.map((goal) => (
            <Grid item xs={12} key={goal.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Employee Avatar */}
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                      <Person />
                    </Avatar>

                    {/* Goal Content */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">{goal.title}</Typography>
                        <Chip
                          label={getStatusLabel(goal.status)}
                          color={getStatusColor(goal.status)}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        الموظف: <strong>{goal.employeeNameAr}</strong>
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={getTypeLabel(goal.type)}
                          size="small"
                          sx={{
                            backgroundColor: getTypeColor(goal.type),
                            color: 'white',
                          }}
                        />
                        <Chip label={`الوزن: ${goal.weight}%`} size="small" variant="outlined" />
                        {goal.category && (
                          <Chip label={goal.category} size="small" variant="outlined" />
                        )}
                      </Box>

                      {goal.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {goal.description}
                        </Typography>
                      )}

                      <Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            نسبة الإنجاز
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" color="primary">
                            {goal.progressPercent || 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={goal.progressPercent || 0}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          البدء: {new Date(goal.startDate).toLocaleDateString('ar-SA')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          الانتهاء: {new Date(goal.endDate).toLocaleDateString('ar-SA')}
                        </Typography>

                        {/* Action Buttons for Draft Goals */}
                        {goal.status === 'Draft' && (
                          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(goal)}
                            >
                              مراجعة والموافقة
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Menu */}
                    <Box>
                      <IconButton onClick={(e) => handleMenuOpen(e, goal)}>
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            if (menuGoal) handleView(menuGoal);
          }}
        >
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          عرض التفاصيل
        </MenuItem>
        {menuGoal?.status === 'Draft' && (
          <MenuItem
            onClick={() => {
              if (menuGoal) handleApprove(menuGoal);
            }}
          >
            <CheckCircle sx={{ mr: 1 }} fontSize="small" color="success" />
            مراجعة والموافقة
          </MenuItem>
        )}
      </Menu>

      {/* Dialogs */}
      <ViewGoalDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />

      <GoalApprovalDialog
        open={approvalDialogOpen}
        onClose={() => {
          setApprovalDialogOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />
    </Container>
  );
}
