import api from './index'

export const getVisitorsList = params => api.get('/visitors', { params })
export const generateVisitorCode = data => api.post('/visitors/generate', data)
export const renewVisitorCode = id => api.put(`/visitors/${id}/renew`)
export const deleteVisitorCode = id => api.delete(`/visitors/${id}`) 