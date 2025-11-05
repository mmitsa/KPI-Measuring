import React, { useState } from 'react';
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
import { createGoal } from '@/store/slices/goalsSlice';

interface CreateGoalDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
}

export default function CreateGoalDialog({ open, onClose, employeeId }: CreateGoalDialogProps) {
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
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
      .toISOString()
      .split('T')[0],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
    if (!validate()) {
      return;
    }

    try {
      await dispatch(
        createGoal({
          employeeId,
          ...formData,
        })
      ).unwrap();

      // Reset form and close dialog
      setFormData({
        title: '',
        description: '',
        type: 'Operational',
        category: '',
        weight: 0,
        targetValue: '',
        measurementUnit: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
          .toISOString()
          .split('T')[0],
      });
      setValidationErrors({});
      onClose();
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'Operational',
      category: '',
      weight: 0,
      targetValue: '',
      measurementUnit: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
        .toISOString()
        .split('T')[0],
    });
    setValidationErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          إنشاء هدف جديد
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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
                placeholder="مثال: تحسين كفاءة الأنظمة بنسبة 20%"
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
                placeholder="وصف تفصيلي للهدف والنتائج المتوقعة"
              />
            </Grid>

            {/* Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
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
                placeholder="مثال: تقنية المعلومات"
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
                placeholder="مثال: نسبة مئوية، عدد، وقت"
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
                placeholder="مثال: 95%، 10 مشاريع، 6 أشهر"
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
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>ملاحظة:</strong> تأكد من أن الهدف يتبع معايير SMART:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul">
              <li><strong>Specific</strong> - محدد وواضح</li>
              <li><strong>Measurable</strong> - قابل للقياس</li>
              <li><strong>Achievable</strong> - قابل للتحقيق</li>
              <li><strong>Relevant</strong> - ذو صلة بالعمل</li>
              <li><strong>Time-bound</strong> - محدد بإطار زمني</li>
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          إلغاء
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'جاري الإنشاء...' : 'إنشاء الهدف'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
