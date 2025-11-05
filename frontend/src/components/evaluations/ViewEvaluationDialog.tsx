import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Assessment,
  Star,
  TrendingUp,
  EmojiEvents,
  Psychology,
  Lightbulb,
  School,
  CalendarToday,
  CheckCircle,
} from '@mui/icons-material';
import { Evaluation } from '@/store/slices/evaluationsSlice';

interface ViewEvaluationDialogProps {
  open: boolean;
  onClose: () => void;
  evaluation: Evaluation | null;
}

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
      return '#4CAF50'; // Green
    case 'ExceedsExpectations':
      return '#8BC34A'; // Light Green
    case 'MeetsExpectations':
      return '#FFC107'; // Amber
    case 'NeedsImprovement':
      return '#FF9800'; // Orange
    case 'Unsatisfactory':
      return '#F44336'; // Red
    default:
      return '#9E9E9E'; // Grey
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

export default function ViewEvaluationDialog({
  open,
  onClose,
  evaluation,
}: ViewEvaluationDialogProps) {
  if (!evaluation) {
    return null;
  }

  const hasScores = evaluation.goalsScore !== undefined && evaluation.goalsScore !== null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment color="primary" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            تفاصيل التقييم
          </Typography>
          <Chip label={getStatusLabel(evaluation.status)} color={getStatusColor(evaluation.status)} />
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Header Info */}
        <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  الفترة
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {evaluation.period}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  نوع التقييم
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {getTypeLabel(evaluation.evaluationType)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      تاريخ الإنشاء
                    </Typography>
                    <Typography variant="body2">
                      {new Date(evaluation.createdAt).toLocaleDateString('ar-SA')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {evaluation.evaluatedAt && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle fontSize="small" color="success" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        تاريخ الاكتمال
                      </Typography>
                      <Typography variant="body2">
                        {new Date(evaluation.evaluatedAt).toLocaleDateString('ar-SA')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {hasScores ? (
          <>
            {/* Final Score Card */}
            {evaluation.finalScore !== undefined && evaluation.finalScore !== null && (
              <Card sx={{ mb: 3, bgcolor: getRatingColor(evaluation.finalRating), color: 'white' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <Star sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h3" fontWeight="bold">
                      {evaluation.finalScore.toFixed(2)}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {getRatingLabel(evaluation.finalRating)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                      النتيجة النهائية
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Score Breakdown */}
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              تفصيل الدرجات
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Goals Score */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <EmojiEvents color="primary" />
                      <Typography variant="subtitle2">درجة الأهداف</Typography>
                    </Box>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {evaluation.goalsScore?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      الوزن: 60%
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(evaluation.goalsScore || 0) * 20}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Behavior Score */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Psychology color="secondary" />
                      <Typography variant="subtitle2">درجة السلوك</Typography>
                    </Box>
                    <Typography variant="h4" color="secondary" gutterBottom>
                      {evaluation.behaviorScore?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      الوزن: 30%
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(evaluation.behaviorScore || 0) * 20}
                        sx={{ height: 6, borderRadius: 3 }}
                        color="secondary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Initiatives Score */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Lightbulb sx={{ color: '#FF9800' }} />
                      <Typography variant="subtitle2">درجة المبادرات</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ color: '#FF9800' }} gutterBottom>
                      {evaluation.initiativesScore?.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      الوزن: 10%
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(evaluation.initiativesScore || 0) * 20}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          '& .MuiLinearProgress-bar': { bgcolor: '#FF9800' },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Training Impact */}
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <School color="info" />
                  <Typography variant="subtitle2">أثر التدريب</Typography>
                </Box>
                <Typography variant="h5" color="info.main">
                  {evaluation.trainingImpact > 0 ? '+' : ''}
                  {evaluation.trainingImpact.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {evaluation.trainingImpact >= 0.15
                    ? 'ممتاز: معدل التدريب ≥ 85%'
                    : evaluation.trainingImpact <= -0.2
                    ? 'ضعيف: معدل التدريب < 60%'
                    : 'جيد: معدل التدريب بين 60-85%'}
                </Typography>
              </CardContent>
            </Card>

            {/* Performance Formula */}
            <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  معادلة حساب الأداء:
                </Typography>
                <Box
                  sx={{
                    bgcolor: 'white',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    overflow: 'auto',
                  }}
                >
                  <Typography variant="body2" component="div">
                    النتيجة النهائية = (الأهداف × 0.6) + (السلوك × 0.3) + (المبادرات × 0.1) + أثر
                    التدريب
                  </Typography>
                  {evaluation.finalScore && (
                    <Typography variant="body2" component="div" sx={{ mt: 1, color: 'primary.main' }}>
                      {evaluation.finalScore.toFixed(2)} = ({evaluation.goalsScore?.toFixed(2)} × 0.6) +
                      ({evaluation.behaviorScore?.toFixed(2)} × 0.3) + (
                      {evaluation.initiativesScore?.toFixed(2)} × 0.1) +{' '}
                      {evaluation.trainingImpact.toFixed(2)}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Divider sx={{ my: 3 }} />

            {/* Notes Section */}
            {(evaluation.managerNotes || evaluation.employeeNotes) && (
              <>
                <Typography variant="h6" gutterBottom>
                  الملاحظات
                </Typography>

                {evaluation.managerNotes && (
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        ملاحظات المدير:
                      </Typography>
                      <Typography variant="body2">{evaluation.managerNotes}</Typography>
                    </CardContent>
                  </Card>
                )}

                {evaluation.employeeNotes && (
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="secondary" gutterBottom>
                        ملاحظات الموظف:
                      </Typography>
                      <Typography variant="body2">{evaluation.employeeNotes}</Typography>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            التقييم لا يزال قيد الإعداد. لم يتم إدخال الدرجات بعد.
          </Alert>
        )}

        {/* Rating Scale Reference */}
        <Card sx={{ mt: 3, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              مقياس التقييم:
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4CAF50' }}
                  />
                  <Typography variant="caption">متميز (4-5)</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#8BC34A' }}
                  />
                  <Typography variant="caption">يفوق التوقعات (3.5-4)</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FFC107' }}
                  />
                  <Typography variant="caption">يلبي التوقعات (2.5-3.5)</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF9800' }}
                  />
                  <Typography variant="caption">يحتاج تحسين (2-2.5)</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#F44336' }}
                  />
                  <Typography variant="caption">غير مرضي (&lt;2)</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
}
