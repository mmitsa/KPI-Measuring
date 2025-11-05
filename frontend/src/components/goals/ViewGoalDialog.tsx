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
  LinearProgress,
} from '@mui/material';
import {
  CalendarToday,
  Category,
  TrendingUp,
  Flag,
  Description,
  CheckCircle,
} from '@mui/icons-material';
import { Goal } from '@/store/slices/goalsSlice';

interface ViewGoalDialogProps {
  open: boolean;
  onClose: () => void;
  goal: Goal | null;
}

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
      return '#9C27B0'; // Purple
    case 'Operational':
      return '#2196F3'; // Blue
    case 'Development':
      return '#FF9800'; // Orange
    default:
      return '#757575'; // Grey
  }
};

export default function ViewGoalDialog({ open, onClose, goal }: ViewGoalDialogProps) {
  if (!goal) {
    return null;
  }

  const progress = goal.progressPercent || 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Flag color="primary" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            تفاصيل الهدف
          </Typography>
          <Chip label={getStatusLabel(goal.status)} color={getStatusColor(goal.status)} size="small" />
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {goal.title}
          </Typography>
          <Chip
            label={getTypeLabel(goal.type)}
            size="small"
            sx={{
              backgroundColor: getTypeColor(goal.type),
              color: 'white',
            }}
          />
          {goal.category && (
            <Chip label={goal.category} size="small" sx={{ ml: 1 }} variant="outlined" />
          )}
        </Box>

        {/* Description */}
        {goal.description && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Description fontSize="small" color="action" />
              <Typography variant="subtitle2" color="text.secondary">
                الوصف
              </Typography>
            </Box>
            <Typography variant="body2">{goal.description}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp fontSize="small" color="primary" />
              <Typography variant="subtitle2">نسبة الإنجاز</Typography>
            </Box>
            <Typography variant="h6" color="primary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Details Grid */}
        <Grid container spacing={2}>
          {/* Weight */}
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                الوزن
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {goal.weight}%
              </Typography>
            </Box>
          </Grid>

          {/* Target Value */}
          {goal.targetValue && (
            <Grid item xs={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  القيمة المستهدفة
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {goal.targetValue}
                  {goal.measurementUnit && ` ${goal.measurementUnit}`}
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Start Date */}
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  تاريخ البدء
                </Typography>
                <Typography variant="body2">
                  {new Date(goal.startDate).toLocaleDateString('ar-SA')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* End Date */}
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  تاريخ الانتهاء
                </Typography>
                <Typography variant="body2">
                  {new Date(goal.endDate).toLocaleDateString('ar-SA')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Created Date */}
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                تاريخ الإنشاء
              </Typography>
              <Typography variant="body2">
                {new Date(goal.createdAt).toLocaleDateString('ar-SA')}
              </Typography>
            </Box>
          </Grid>

          {/* Approved Info */}
          {goal.approvedAt && (
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle fontSize="small" color="success" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    تمت الموافقة بواسطة
                  </Typography>
                  <Typography variant="body2">{goal.approvedByName || 'غير محدد'}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(goal.approvedAt).toLocaleDateString('ar-SA')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* SMART Guidelines */}
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            معايير SMART
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                ✓ <strong>Specific</strong> - محدد وواضح
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                ✓ <strong>Measurable</strong> - قابل للقياس
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                ✓ <strong>Achievable</strong> - قابل للتحقيق
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                ✓ <strong>Relevant</strong> - ذو صلة
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                ✓ <strong>Time-bound</strong> - محدد بإطار زمني
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
}
