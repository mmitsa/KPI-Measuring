import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Alert,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Visibility,
  Search,
  MoreVert,
  Assessment,
  Star,
  TrendingUp,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEvaluations, Evaluation } from '@/store/slices/evaluationsSlice';
import ViewEvaluationDialog from '@/components/evaluations/ViewEvaluationDialog';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'default';
    case 'InProgress':
      return 'primary';
    case 'Finalized':
      return 'info';
    case 'Approved':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'مسودة';
    case 'InProgress':
      return 'قيد التنفيذ';
    case 'Finalized':
      return 'مكتمل';
    case 'Approved':
      return 'معتمد';
    default:
      return status;
  }
};

const getRatingColor = (rating?: string) => {
  switch (rating) {
    case 'Outstanding':
      return 'success';
    case 'ExceedsExpectations':
      return 'info';
    case 'MeetsExpectations':
      return 'warning';
    case 'NeedsImprovement':
      return 'error';
    case 'Unsatisfactory':
      return 'error';
    default:
      return 'default';
  }
};

const getRatingLabel = (rating?: string) => {
  switch (rating) {
    case 'Outstanding':
      return 'متميز';
    case 'ExceedsExpectations':
      return 'يفوق التوقعات';
    case 'MeetsExpectations':
      return 'يلبي التوقعات';
    case 'NeedsImprovement':
      return 'يحتاج تحسين';
    case 'Unsatisfactory':
      return 'غير مرضي';
    default:
      return 'غير محدد';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'Annual':
      return 'سنوي';
    case 'Quarterly':
      return 'ربع سنوي';
    case 'MidYear':
      return 'نصف سنوي';
    default:
      return type;
  }
};

export default function TeamEvaluationsPage() {
  const dispatch = useAppDispatch();
  const { list: evaluations, loading, error } = useAppSelector((state) => state.evaluations);

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuEvaluation, setMenuEvaluation] = useState<Evaluation | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  useEffect(() => {
    // Fetch all team evaluations (in real app, filter by managerId on backend)
    dispatch(fetchEvaluations({}));
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, evaluation: Evaluation) => {
    setAnchorEl(event.currentTarget);
    setMenuEvaluation(evaluation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEvaluation(null);
  };

  const handleView = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  // Get unique employees
  const uniqueEmployees = Array.from(
    new Map(evaluations.map((e) => [e.employeeId, e.employeeNameAr])).entries()
  );

  // Filter evaluations
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.employeeNameAr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || evaluation.status === statusFilter;
    const matchesType = !typeFilter || evaluation.evaluationType === typeFilter;
    const matchesEmployee = !employeeFilter || evaluation.employeeId === employeeFilter;

    return matchesSearch && matchesStatus && matchesType && matchesEmployee;
  });

  // Calculate statistics
  const totalEvaluations = filteredEvaluations.length;
  const completedEvaluations = filteredEvaluations.filter(
    (e) => e.status === 'Finalized' || e.status === 'Approved'
  ).length;
  const inProgressEvaluations = filteredEvaluations.filter(
    (e) => e.status === 'InProgress'
  ).length;
  const avgScore =
    filteredEvaluations.length > 0
      ? (
          filteredEvaluations
            .filter((e) => e.finalScore !== undefined && e.finalScore !== null)
            .reduce((sum, e) => sum + (e.finalScore || 0), 0) /
          filteredEvaluations.filter((e) => e.finalScore !== undefined && e.finalScore !== null)
            .length
        ).toFixed(2)
      : '0.00';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          تقييمات الفريق
        </Typography>
        <Typography variant="body2" color="text.secondary">
          متابعة وعرض تقييمات أداء أعضاء الفريق
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                إجمالي التقييمات
              </Typography>
              <Typography variant="h4" color="primary">
                {totalEvaluations}
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
                {inProgressEvaluations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                المكتملة
              </Typography>
              <Typography variant="h4" color="success.main">
                {completedEvaluations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                متوسط الدرجات
              </Typography>
              <Typography variant="h4" color="warning.main">
                {avgScore}
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
                placeholder="البحث في الفترة أو الموظف..."
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
                  <MenuItem value="InProgress">قيد التنفيذ</MenuItem>
                  <MenuItem value="Finalized">مكتمل</MenuItem>
                  <MenuItem value="Approved">معتمد</MenuItem>
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
                  <MenuItem value="Annual">سنوي</MenuItem>
                  <MenuItem value="Quarterly">ربع سنوي</MenuItem>
                  <MenuItem value="MidYear">نصف سنوي</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>الترتيب</InputLabel>
                <Select defaultValue="recent" label="الترتيب">
                  <MenuItem value="recent">الأحدث أولاً</MenuItem>
                  <MenuItem value="score">الأعلى تقييماً</MenuItem>
                  <MenuItem value="employee">حسب الموظف</MenuItem>
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

      {/* Evaluations List */}
      {filteredEvaluations.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm || statusFilter || typeFilter || employeeFilter
                  ? 'لا توجد تقييمات تطابق معايير البحث'
                  : 'لا توجد تقييمات للفريق بعد'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredEvaluations.map((evaluation) => (
            <Grid item xs={12} key={evaluation.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Employee Avatar */}
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                      <Person />
                    </Avatar>

                    {/* Evaluation Content */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">{evaluation.period}</Typography>
                        <Chip
                          label={getStatusLabel(evaluation.status)}
                          color={getStatusColor(evaluation.status)}
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        الموظف: <strong>{evaluation.employeeNameAr}</strong>
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={getTypeLabel(evaluation.evaluationType)}
                          size="small"
                          variant="outlined"
                        />
                        {evaluation.finalScore !== undefined &&
                          evaluation.finalScore !== null && (
                            <Chip
                              icon={<Star />}
                              label={`${evaluation.finalScore.toFixed(2)} - ${getRatingLabel(
                                evaluation.finalRating
                              )}`}
                              size="small"
                              color={getRatingColor(evaluation.finalRating)}
                            />
                          )}
                      </Box>

                      {/* Score Breakdown */}
                      {evaluation.goalsScore !== undefined &&
                        evaluation.goalsScore !== null && (
                          <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={4}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  الأهداف (60%)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="h6" color="primary">
                                    {evaluation.goalsScore.toFixed(2)}
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={(evaluation.goalsScore / 5) * 100}
                                    sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  السلوك (30%)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="h6" color="secondary">
                                    {evaluation.behaviorScore?.toFixed(2) || '0.00'}
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={((evaluation.behaviorScore || 0) / 5) * 100}
                                    sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                                    color="secondary"
                                  />
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  المبادرات (10%)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="h6" sx={{ color: '#FF9800' }}>
                                    {evaluation.initiativesScore?.toFixed(2) || '0.00'}
                                  </Typography>
                                  <LinearProgress
                                    variant="determinate"
                                    value={((evaluation.initiativesScore || 0) / 5) * 100}
                                    sx={{
                                      flexGrow: 1,
                                      height: 6,
                                      borderRadius: 3,
                                      '& .MuiLinearProgress-bar': { bgcolor: '#FF9800' },
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        )}

                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(evaluation.createdAt).toLocaleDateString('ar-SA')}
                          </Typography>
                        </Box>
                        {evaluation.evaluatedAt && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingUp fontSize="small" color="success" />
                            <Typography variant="caption" color="success.main">
                              اكتمل في{' '}
                              {new Date(evaluation.evaluatedAt).toLocaleDateString('ar-SA')}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Menu */}
                    <Box>
                      <IconButton onClick={(e) => handleMenuOpen(e, evaluation)}>
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
            if (menuEvaluation) handleView(menuEvaluation);
          }}
        >
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          عرض التفاصيل
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <ViewEvaluationDialog
        open={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedEvaluation(null);
        }}
        evaluation={selectedEvaluation}
      />
    </Container>
  );
}
