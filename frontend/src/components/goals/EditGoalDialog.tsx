import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateGoal, Goal } from '@/store/slices/goalsSlice';

interface EditGoalDialogProps {
  open: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export default function EditGoalDialog({ open, onClose, goal }: EditGoalDialogProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.goals);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Operational' as 'Strategic' | 'Operational' | 'Development',
    category: '',
    weight: 0,
    targetValue: '',
    measurementUnit: '',
    startDate: '',
    endDate: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Populate form when goal changes
  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        type: goal.type as 'Strategic' | 'Operational' | 'Development',
        category: goal.category || '',
        weight: goal.weight || 0,
        targetValue: goal.targetValue || '',
        measurementUnit: goal.measurementUnit || '',
        startDate: goal.startDate ? goal.startDate.split('T')[0] : '',
        endDate: goal.endDate ? goal.endDate.split('T')[0] : '',
      });
    }
  }, [goal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'عنوان الهدف مطلوب';
    }

    if (formData.weight <= 0 || formData.weight > 100) {
      errors.weight = 'الوزن يجب أن يكون بين 1 و 100';
    }

    if (!formData.startDate) {
      errors.startDate = 'تاريخ البدء مطلوب';
    }

    if (!formData.endDate) {
      errors.endDate = 'تاريخ الانتهاء مطلوب';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      errors.endDate = 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !goal) {
      return;
    }

    try {
      await dispatch(
        updateGoal({
          id: goal.id,
          data: formData,
        })
      ).unwrap();

      setValidationErrors({});
      onClose();
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const handleClose = () => {
    setValidationErrors({});
    onClose();
  };

  // Don't render if no goal
  if (!goal) {
    return null;
  }

  // Check if goal is editable (only Draft goals can be fully edited)
  const isEditable = goal.status === 'Draft';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          تعديل الهدف
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!isEditable && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              لا يمكن تعديل الأهداف المعتمدة أو قيد التنفيذ. يمكنك فقط تعديل الأهداف في حالة "مسودة".
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="عنوان الهدف"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!validationErrors.title}
                helperText={validationErrors.title}
                disabled={!isEditable}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="الوصف"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </Grid>

            {/* Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!isEditable}>
                <InputLabel>نوع الهدف</InputLabel>
                <Select
                  value={formData.type}
                  label="نوع الهدف"
                  onChange={(e) => handleSelectChange('type', e.target.value)}
                >
                  <MenuItem value="Strategic">استراتيجي</MenuItem>
                  <MenuItem value="Operational">تشغيلي</MenuItem>
                  <MenuItem value="Development">تطويري</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Category */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="الفئة"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </Grid>

            {/* Weight */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="الوزن (%)"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                error={!!validationErrors.weight}
                helperText={validationErrors.weight || 'مجموع أوزان الأهداف يجب أن يساوي 100%'}
                inputProps={{ min: 1, max: 100 }}
                disabled={!isEditable}
              />
            </Grid>

            {/* Measurement Unit */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="وحدة القياس"
                name="measurementUnit"
                value={formData.measurementUnit}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </Grid>

            {/* Target Value */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="القيمة المستهدفة"
                name="targetValue"
                value={formData.targetValue}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </Grid>

            {/* Start Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="تاريخ البدء"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                error={!!validationErrors.startDate}
                helperText={validationErrors.startDate}
                InputLabelProps={{ shrink: true }}
                disabled={!isEditable}
              />
            </Grid>

            {/* End Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="تاريخ الانتهاء"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={!!validationErrors.endDate}
                helperText={validationErrors.endDate}
                InputLabelProps={{ shrink: true }}
                disabled={!isEditable}
              />
            </Grid>
          </Grid>

          {isEditable && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>ملاحظة:</strong> بعد الموافقة على الهدف، لن يمكن تعديله. تأكد من صحة جميع
                البيانات قبل الإرسال للموافقة.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {isEditable ? 'إلغاء' : 'إغلاق'}
        </Button>
        {isEditable && (
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
