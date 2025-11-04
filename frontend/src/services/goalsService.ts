import api from './api';

export interface CreateGoalRequest {
  employeeId: string;
  title: string;
  description?: string;
  type: 'Strategic' | 'Operational' | 'Development';
  category?: string;
  weight: number;
  targetValue?: string;
  measurementUnit?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateProgressRequest {
  progressPercent: number;
  notes?: string;
}

export const goalsService = {
  async getGoals(params?: any) {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  async getGoalById(id: string) {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  async createGoal(data: CreateGoalRequest) {
    const response = await api.post('/goals', data);
    return response.data;
  },

  async updateGoal(id: string, data: Partial<CreateGoalRequest>) {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  },

  async deleteGoal(id: string) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  async updateProgress(id: string, progress: number) {
    const response = await api.put(`/goals/${id}/progress`, {
      progressPercent: progress,
    });
    return response.data;
  },

  async approveGoal(id: string, approved: boolean, notes?: string) {
    const response = await api.post(`/goals/${id}/approve`, {
      approved,
      notes,
    });
    return response.data;
  },

  async validateWeights(employeeId: string, year: number) {
    const response = await api.get(`/goals/validate-weights/${employeeId}/${year}`);
    return response.data;
  },
};
