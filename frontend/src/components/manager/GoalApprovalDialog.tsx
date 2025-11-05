import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
  Chip,
  Grid,
  Divider,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Flag,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGoals, Goal } from '@/store/slices/goalsSlice';
import { goalsService } from '@/services/goalsService';

interface GoalApprovalDialogProps {
  open: boolean;
  onClose: () => void;
  goal: Goal | null;
}

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

export default function GoalApprovalDialog({ open, onClose, goal }: GoalApprovalDialogProps) {
  const dispatch = useAppDispatch();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async (approved: boolean) => {
    if (!goal) return;

    setLoading(true);
    setError('');

    try {
      await goalsService.approveGoal(goal.id, approved, notes);

      // Refresh goals list
      dispatch(fetchGoals({}));

      // Reset and close
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.Message || `فشل ${approved ? 'الموافقة' : 'الرفض'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNotes('');
    setError('');
    onClose();
  };

  if (!goal) {
    return null;
  }

  // Check if goal can be approved (only Draft goals)
  const canApprove = goal.status === 'Draft';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Flag color="primary" />
          <Typography variant="h6" component="div">
            مراجعة والموافقة على الهدف
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!canApprove && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            لا يمكن الموافقة على هذا الهدف. يمكن فقط الموافقة على الأهداف في حالة "مسودة".
          </Alert>
        )}

        {/* Goal Details */}
        <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {goal.title}
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
              {goal.category && <Chip label={goal.category} size="small" variant="outlined" />}
              <Chip label={`الوزن: ${goal.weight}%`} size="small" variant="outlined" />
            </Box>

            {goal.description && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>الوصف:</strong>
                </Typography>
                <Typography variant="body2">{goal.description}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  الموظف
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {goal.employeeNameAr}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  الوزن
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {goal.weight}%
                </Typography>
              </Grid>
              {goal.targetValue && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    القيمة المستهدفة
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {goal.targetValue}
                    {goal.measurementUnit && ` ${goal.measurementUnit}`}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      الفترة
                    </Typography>
                    <Typography variant="body2">
                      {new Date(goal.startDate).toLocaleDateString('ar-SA')} -{' '}
                      {new Date(goal.endDate).toLocaleDateString('ar-SA')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* SMART Validation Checklist */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              تحقق من معايير SMART:
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Specific (محدد):</strong> هل الهدف واضح ومحدد بشكل دقيق؟
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Measurable (قابل للقياس):</strong> هل يمكن قياس تقدم الهدف؟
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Achievable (قابل للتحقيق):</strong> هل الهدف واقعي وقابل للإنجاز؟
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Relevant (ذو صلة):</strong> هل الهدف متوافق مع أهداف القسم والمنظمة؟
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                  <Typography variant="body2">
                    <strong>Time-bound (محدد بإطار زمني):</strong> هل الهدف له تاريخ بداية
                    ونهاية واضح؟
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notes Field */}
        {canApprove && (
          <TextField
            fullWidth
            multiline
            rows={4}
            label="ملاحظات (اختياري)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أضف أي ملاحظات أو توصيات للموظف..."
            helperText="ستظهر هذه الملاحظات للموظف بعد الموافقة أو الرفض"
          />
        )}

        {/* Warning about rejection */}
        {canApprove && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>ملاحظة:</strong> عند الموافقة على الهدف، سيتم تحويل حالته إلى "معتمد" ويمكن
              للموظف البدء في العمل عليه. عند الرفض، يجب على الموظف تعديل الهدف وإعادة إرساله.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          إلغاء
        </Button>
        {canApprove && (
          <>
            <Button
              onClick={() => handleApprove(false)}
              color="error"
              variant="outlined"
              startIcon={<Cancel />}
              disabled={loading}
            >
              {loading ? 'جاري المعالجة...' : 'رفض الهدف'}
            </Button>
            <Button
              onClick={() => handleApprove(true)}
              color="success"
              variant="contained"
              startIcon={<CheckCircle />}
              disabled={loading}
            >
              {loading ? 'جاري المعالجة...' : 'الموافقة على الهدف'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
