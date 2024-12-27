import api from './index'

export const getSettings = () => api.get('/settings')
export const updateSettings = data => api.put('/settings', data)
export const uploadLogo = file => {
  const formData = new FormData()
  formData.append('logo', file)
  return api.post('/settings/logo', formData)
} 