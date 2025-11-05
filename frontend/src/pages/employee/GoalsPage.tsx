import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
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
  Tooltip,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Search,
  FilterList,
  Flag,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals } from '@/store/slices/goalsSlice';
import { Goal } from '@/store/slices/goalsSlice';
import CreateGoalDialog from '@/components/goals/CreateGoalDialog';
import EditGoalDialog from '@/components/goals/EditGoalDialog';
import ViewGoalDialog from '@/components/goals/ViewGoalDialog';
import DeleteGoalDialog from '@/components/goals/DeleteGoalDialog';

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

export default function GoalsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { list: goals, loading, error } = useAppSelector((state) => state.goals);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuGoal, setMenuGoal] = useState<Goal | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    if (user?.employee?.id) {
      dispatch(fetchGoals({ employeeId: user.employee.id }));
    }
  }, [dispatch, user]);

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

  const handleEdit = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = (goal: Goal) => {
    setSelectedGoal(goal);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  // Filter goals
  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goal.description && goal.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || goal.status === statusFilter;
    const matchesType = !typeFilter || goal.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const totalGoals = filteredGoals.length;
  const completedGoals = filteredGoals.filter((g) => g.status === 'Completed').length;
  const inProgressGoals = filteredGoals.filter((g) => g.status === 'InProgress').length;
  const avgProgress =
    filteredGoals.length > 0
      ? Math.round(
          filteredGoals.reduce((sum, g) => sum + (g.progressPercent || 0), 0) / filteredGoals.length
        )
      : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            أهدافي
          </Typography>
          <Typography variant="body2" color="text.secondary">
            إدارة وتتبع الأهداف الشخصية والمهنية
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          size="large"
        >
          إنشاء هدف جديد
        </Button>
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
                الأهداف المكتملة
              </Typography>
              <Typography variant="h4" color="success.main">
                {completedGoals}
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
              <Typography variant="h4" color="info.main">
                {inProgressGoals}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                متوسط الإنجاز
              </Typography>
              <Typography variant="h4" color="warning.main">
                {avgProgress}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} sm={6} md={3}>
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
                  <MenuItem value="Cancelled">ملغي</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
                {searchTerm || statusFilter || typeFilter
                  ? 'لا توجد أهداف تطابق معايير البحث'
                  : 'لا توجد أهداف بعد'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {!searchTerm && !statusFilter && !typeFilter
                  ? 'ابدأ بإنشاء هدف جديد لتتبع إنجازاتك'
                  : 'جرب تعديل معايير البحث أو الفلاتر'}
              </Typography>
              {!searchTerm && !statusFilter && !typeFilter && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  إنشاء هدف جديد
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredGoals.map((goal) => (
            <Grid item xs={12} key={goal.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">{goal.title}</Typography>
                        <Chip
                          label={getStatusLabel(goal.status)}
                          color={getStatusColor(goal.status)}
                          size="small"
                        />
                      </Box>
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
                      <Box sx={{ mb: 1 }}>
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
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          البدء: {new Date(goal.startDate).toLocaleDateString('ar-SA')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          الانتهاء: {new Date(goal.endDate).toLocaleDateString('ar-SA')}
                        </Typography>
                      </Box>
                    </Box>
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
        <MenuItem
          onClick={() => {
            if (menuGoal) handleEdit(menuGoal);
          }}
        >
          <Edit sx={{ mr: 1 }} fontSize="small" />
          تعديل
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuGoal) handleDelete(menuGoal);
          }}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} fontSize="small" />
          حذف
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      {user?.employee?.id && (
        <CreateGoalDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          employeeId={user.employee.id}
        />
      )}

      <EditGoalDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />

      <ViewGoalDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />

      <DeleteGoalDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />
    </Container>
  );
}
