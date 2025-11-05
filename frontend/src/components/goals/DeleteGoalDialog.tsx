import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteGoal, Goal } from '@/store/slices/goalsSlice';

interface DeleteGoalDialogProps {
  open: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export default function DeleteGoalDialog({ open, onClose, goal }: DeleteGoalDialogProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.goals);

  const handleDelete = async () => {
    if (!goal) return;

    try {
      await dispatch(deleteGoal(goal.id)).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  if (!goal) {
    return null;
  }

  // Check if goal can be deleted (only Draft goals)
  const canDelete = goal.status === 'Draft';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="delete-goal-dialog-title"
    >
      <DialogTitle id="delete-goal-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          <Typography variant="h6" component="span">
            تأكيد حذف الهدف
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!canDelete ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            لا يمكن حذف هذا الهدف. يمكن فقط حذف الأهداف في حالة "مسودة".
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>تحذير:</strong> هذا الإجراء لا يمكن التراجع عنه!
          </Alert>
        )}

        <DialogContentText>
          {canDelete ? (
            <>
              هل أنت متأكد من رغبتك في حذف الهدف التالي؟
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  borderLeft: '4px solid #d32f2f',
                }}
              >
                <Typography variant="subtitle2" color="text.primary" gutterBottom>
                  <strong>العنوان:</strong> {goal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>النوع:</strong>{' '}
                  {goal.type === 'Strategic'
                    ? 'استراتيجي'
                    : goal.type === 'Operational'
                    ? 'تشغيلي'
                    : 'تطويري'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>الوزن:</strong> {goal.weight}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>الحالة:</strong> مسودة
                </Typography>
              </Box>
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                سيتم حذف الهدف نهائياً ولن يمكن استعادته.
              </Typography>
            </>
          ) : (
            <>
              لا يمكن حذف الأهداف التي تم اعتمادها أو التي قيد التنفيذ أو المكتملة. إذا كنت ترغب في
              إلغاء الهدف، يرجى تغيير حالته إلى "ملغي" بدلاً من حذفه.
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#fff3e0',
                  borderRadius: 1,
                  borderLeft: '4px solid #ff9800',
                }}
              >
                <Typography variant="subtitle2" color="text.primary" gutterBottom>
                  <strong>العنوان:</strong> {goal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>الحالة:</strong>{' '}
                  {goal.status === 'Approved'
                    ? 'معتمد'
                    : goal.status === 'InProgress'
                    ? 'قيد التنفيذ'
                    : goal.status === 'Completed'
                    ? 'مكتمل'
                    : 'ملغي'}
                </Typography>
              </Box>
            </>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          {canDelete ? 'إلغاء' : 'إغلاق'}
        </Button>
        {canDelete && (
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            {loading ? 'جاري الحذف...' : 'حذف الهدف'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
