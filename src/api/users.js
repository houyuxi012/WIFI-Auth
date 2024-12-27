import api from './index'

// 系统用户相关
export const getSystemUsers = () => api.get('/users/system')
export const addSystemUser = data => api.post('/users/system', data)
export const updateSystemUser = (id, data) => api.put(`/users/system/${id}`, data)
export const deleteSystemUser = id => api.delete(`/users/system/${id}`)

// 认证用户相关
export const getAuthUsers = params => api.get('/users/auth', { params })
export const syncAuthUsers = () => api.post('/users/auth/sync')
export const toggleAuthUserStatus = (id, status) => api.put(`/users/auth/${id}/status`, { status }) 