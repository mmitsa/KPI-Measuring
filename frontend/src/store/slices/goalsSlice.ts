import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { goalsService } from '@/services/goalsService';

export interface Goal {
  id: string;
  employeeId: string;
  employeeNameAr: string;
  title: string;
  description?: string;
  type: string;
  category?: string;
  weight: number;
  targetValue?: string;
  measurementUnit?: string;
  startDate: string;
  endDate: string;
  status: string;
  progressPercent?: number;
  approvedAt?: string;
  approvedBy?: string;
  approvedByName?: string;
  createdAt: string;
}

interface GoalsState {
  list: Goal[];
  currentGoal: Goal | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

const initialState: GoalsState = {
  list: [],
  currentGoal: null,
  loading: false,
  error: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
};

export const fetchGoals = createAsyncThunk(
  'goals/fetchAll',
  async (params?: any, { rejectWithValue }) => {
    try {
      return await goalsService.getGoals(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || 'فشل جلب الأهداف');
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/create',
  async (goalData: any, { rejectWithValue }) => {
    try {
      return await goalsService.createGoal(goalData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || 'فشل إنشاء الهدف');
    }
  }
);

export const fetchGoalById = createAsyncThunk(
  'goals/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await goalsService.getGoalById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || 'فشل جلب بيانات الهدف');
    }
  }
);

export const updateGoal = createAsyncThunk(
  'goals/update',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      return await goalsService.updateGoal(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || 'فشل تحديث الهدف');
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await goalsService.deleteGoal(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || 'فشل حذف الهدف');
    }
  }
);

export const updateGoalProgress = createAsyncThunk(
  'goals/updateProgress',
  async ({ id, progress }: { id: string; progress: number }, { rejectWithValue }) => {
    try {
      return await goalsService.updateProgress(id, progress);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || 'فشل تحديث التقدم');
    }
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setCurrentGoal: (state, action) => {
      state.currentGoal = action.payload;
    },
    clearCurrentGoal: (state) => {
      state.currentGoal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create goal
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch goal by ID
      .addCase(fetchGoalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoalById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGoal = action.payload;
      })
      .addCase(fetchGoalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update goal
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentGoal?.id === action.payload.id) {
          state.currentGoal = action.payload;
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete goal
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((g) => g.id !== action.payload);
        if (state.currentGoal?.id === action.payload) {
          state.currentGoal = null;
        }
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update progress
      .addCase(updateGoalProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateGoalProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentGoal, clearCurrentGoal } = goalsSlice.actions;
export default goalsSlice.reducer;
