import api from './index'

export const getLogs = params => api.get('/logs', { params })
export const exportLogs = params => api.get('/logs/export', { 
  params,
  responseType: 'blob'
}) 