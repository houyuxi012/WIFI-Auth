import api from './index'

export const login = data => api.post('/auth/login', data)
export const adminLogin = data => api.post('/auth/admin/login', data)
export const logout = () => api.post('/auth/logout') 