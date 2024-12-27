import api from './index'

export const getSystemStatus = () => api.get('/monitor/status') 