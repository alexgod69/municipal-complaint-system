import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mcms_token')
      localStorage.removeItem('mcms_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

export const complaintAPI = {
  submit: (data) => api.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => api.get('/complaints', { params }),
  getMine: () => api.get('/complaints/mine'),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
  assign: (id, data) => api.put(`/complaints/${id}/assign`, data),
  addRemark: (id, data) => api.post(`/complaints/${id}/remarks`, data),
}

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
}

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

export const analyticsAPI = {
  getStats: () => api.get('/analytics/stats'),
}

export default api
