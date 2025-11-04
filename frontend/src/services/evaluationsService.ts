import api from './api';

export const evaluationsService = {
  async getEvaluations(params?: any) {
    const response = await api.get('/evaluations', { params });
    return response.data;
  },

  async getEvaluationById(id: string) {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  },

  async createEvaluation(data: {
    employeeId: string;
    period: string;
    evaluationType: 'Annual' | 'Quarterly' | 'MidYear';
  }) {
    const response = await api.post('/evaluations', data);
    return response.data;
  },

  async updateScores(
    id: string,
    data: {
      goalsScore?: number;
      behaviorScore?: number;
      initiativesScore?: number;
      managerNotes?: string;
    }
  ) {
    const response = await api.put(`/evaluations/${id}/scores`, data);
    return response.data;
  },

  async finalizeEvaluation(id: string, managerNotes?: string) {
    const response = await api.post(`/evaluations/${id}/finalize`, { managerNotes });
    return response.data;
  },

  async approveEvaluation(id: string) {
    const response = await api.post(`/evaluations/${id}/approve`);
    return response.data;
  },
};
