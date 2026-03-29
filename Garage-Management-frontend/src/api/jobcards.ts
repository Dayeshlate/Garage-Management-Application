import { apiClient } from './config';

export type JobStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface JobCardDTO {
  id: number;
  jobStatus: JobStatus;
  vehicle_id: number;
  inventary_id: number[];
}

export type CreateJobCardDto = Omit<JobCardDTO, 'id'>;

export const jobCardsApi = {
  getAll: (): Promise<JobCardDTO[]> => apiClient.get('/job-cards'),
  getById: (id: number): Promise<JobCardDTO> => apiClient.get(`/job-cards/${id}`),
  create: (data: CreateJobCardDto): Promise<JobCardDTO> => apiClient.post('/job-cards', data),
  update: (id: number, data: Partial<JobCardDTO>): Promise<JobCardDTO> => apiClient.put(`/job-cards/${id}`, data),
  delete: (id: number): Promise<void> => apiClient.delete(`/job-cards/${id}`),
};
