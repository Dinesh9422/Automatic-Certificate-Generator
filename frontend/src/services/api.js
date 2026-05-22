import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const res = await axios.post('http://localhost:8000/api/auth/token/refresh/', { refresh })
        const { access } = res.data
        localStorage.setItem('access_token', access)
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`
        original.headers['Authorization'] = `Bearer ${access}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/api/auth/login/', data),
  logout: (data) => api.post('/api/auth/logout/', data),
  profile: () => api.get('/api/auth/profile/'),
  changePassword: (data) => api.post('/api/auth/change-password/', data),
}

// ── Certificates ─────────────────────────────────────
export const certificateAPI = {
  list: (params) => api.get('/api/certificates/', { params }),
  create: (data) => api.post('/api/certificates/', data),
  detail: (id) => api.get(`/api/certificates/${id}/`),
  update: (id, data) => api.put(`/api/certificates/${id}/`, data),
  delete: (id) => api.delete(`/api/certificates/${id}/`),
  generate: (data) => api.post('/api/certificates/generate/', data, { responseType: 'blob' }),
  bulkGenerate: (data) => api.post('/api/certificates/bulk-generate/', data, { responseType: 'blob' }),
  regenerate: (id) => api.post(`/api/certificates/${id}/regenerate/`, {}, { responseType: 'blob' }),
  verify: (code) => api.get(`/api/certificates/verify/${code}/`),
  stats: () => api.get('/api/certificates/stats/'),
  templates: () => api.get('/api/certificates/templates/'),
}

// ── OCR ──────────────────────────────────────────────
export const ocrAPI = {
  extract: (formData) => api.post('/api/ocr/extract/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  history: () => api.get('/api/ocr/history/'),
}

// ── ATS Analyzer ─────────────────────────────────────
export const atsAPI = {
  analyze: (formData) => api.post('/api/ats/analyze/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  history: () => api.get('/api/ats/history/'),
  jobRoles: () => api.get('/api/ats/job-roles/'),
}

// ── Bulk Print ───────────────────────────────────────
export const bulkAPI = {
  getDepartments: () => api.get('/api/certificates/departments/'),
  bulkPrint: (data) => api.post('/api/certificates/bulk-print/', data, { responseType: 'blob' }),
  importExcel: (formData) => api.post('/api/certificates/import-excel/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// ── Dashboard Stats ───────────────────────────────────
export const dashboardAPI = {
  stats: () => api.get('/api/dashboard/stats/'),
  recentActivity: () => api.get('/api/dashboard/activity/'),
  monthlyData: () => api.get('/api/dashboard/monthly/'),
}

// ── QR Verification ───────────────────────────────────
export const qrAPI = {
  generate: (certId) => api.get(`/api/qr/generate/${certId}/`),
  verify: (code) => api.get(`/api/qr/verify/${code}/`),
}

export default api
