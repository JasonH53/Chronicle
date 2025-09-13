import axios from 'axios';
import { Document } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const documentApi = {
  uploadDocument: async (file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocuments: async (): Promise<Document[]> => {
    const response = await api.get('/documents/');
    return response.data;
  },

  getDocument: async (id: number): Promise<Document> => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  processDocument: async (id: number): Promise<any> => {
    const response = await api.post(`/documents/${id}/process`);
    return response.data;
  },

  completeReview: async (id: number): Promise<any> => {
    const response = await api.post(`/documents/${id}/complete-review`);
    return response.data;
  },
};

export const analysisApi = {
  getFinancialAnalysis: async (documentIds?: number[]): Promise<any> => {
    const params = documentIds ? `?document_ids=${documentIds.join(',')}` : '';
    const response = await api.get(`/analysis/financial-summary${params}`);
    return response.data;
  },

  getAIInsights: async (documentIds?: number[]): Promise<any> => {
    const params = documentIds ? `?document_ids=${documentIds.join(',')}` : '';
    const response = await api.get(`/analysis/insights${params}`);
    return response.data;
  },
};

export default api;
