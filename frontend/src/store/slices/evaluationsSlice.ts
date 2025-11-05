import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { evaluationsService } from '@/services/evaluationsService';

export interface Evaluation {
  id: string;
  employeeId: string;
  employeeNameAr: string;
  period: string;
  evaluationType: string;
  goalsScore?: number;
  behaviorScore?: number;
  initiativesScore?: number;
  trainingImpact: number;
  finalScore?: number;
  finalRating?: string;
  status: string;
  managerNotes?: string;
  employeeNotes?: string;
  evaluatedAt?: string;
  createdAt: string;
}

interface EvaluationsState {
  list: Evaluation[];
  currentEvaluation: Evaluation | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

const initialState: EvaluationsState = {
  list: [],
  currentEvaluation: null,
  loading: false,
  error: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
};

export const fetchEvaluations = createAsyncThunk(
  'evaluations/fetchAll',
  async (params?: any, { rejectWithValue }) => {
    try {
      return await evaluationsService.getEvaluations(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || 'فشل جلب التقييمات');
    }
  }
);

export const fetchEvaluationById = createAsyncThunk(
  'evaluations/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await evaluationsService.getEvaluationById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || 'فشل جلب بيانات التقييم');
    }
  }
);

const evaluationsSlice = createSlice({
  name: 'evaluations',
  initialState,
  reducers: {
    setCurrentEvaluation: (state, action) => {
      state.currentEvaluation = action.payload;
    },
    clearCurrentEvaluation: (state) => {
      state.currentEvaluation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch evaluations
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.items;
        state.totalCount = action.payload.totalCount;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch evaluation by ID
      .addCase(fetchEvaluationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvaluation = action.payload;
      })
      .addCase(fetchEvaluationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentEvaluation, clearCurrentEvaluation } = evaluationsSlice.actions;
export default evaluationsSlice.reducer;
