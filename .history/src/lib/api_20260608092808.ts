import axios from 'axios';

// Using relative paths to talk to our local Express proxy
// This avoids CORS issues because the browser talks to the same origin
const api = axios.create({
  baseURL: 'https://campus-connect-backend-g7ul.onrender.com',
  baseURL: 'https://campus-connect-backend-g7ul.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT / Token securely into outbound requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_connect_token');

  console.log('🚀 REQUEST:', {
    url: config.url,
    tokenExists: !!token,
    tokenPreview: token?.slice(0, 20),
    headersBefore: config.headers,
  });

  if (token) {
    config.headers = config.headers ?? null;
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('📤 HEADERS AFTER:', config.headers);

  return config;
});

export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getMe: () => api.get('/users/profile'),
  updateMe: (data: any) => api.put('/users/profile', data),
};

export const dataApi = {
  getRequests: () => api.get('/requests'),
  getMyRequests: () => api.get('/requests/me'),
  getStudents: () => api.get('/students'),
  getCategories: () => api.get('/categories'),
  getVendors: () => api.get('/vendors'),
  sync: (data?: any) => data ? api.post('/sync', data) : api.get('/sync'),
  editRequest: (id: string, data: any) => api.put(`/requests/${id}`, data),
  deleteRequest: (id: string) => api.delete(`/requests/${id}`),
  createRequest: (data: any) => api.post('/requests', data),
  createProposal: (data: any) => api.post('/offers', data),
  getOffers: () => api.get('/offers/me'),
};

export const updatesApi = {
  pushUpdate: (data: any) => api.post('/updates', data),
};

export default api;
