import api from './index'

export const getAuthConfig = () => api.get('/auth-server/config')
export const saveAuthConfig = data => api.post('/auth-server/config', data)
export const testConnection = data => api.post('/auth-server/test', data) 