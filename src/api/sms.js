import api from './index'

// 测试短信配置
export const testSmsConfig = data => api.post('/sms/test', data)

// 发送访客码短信
export const sendVisitorCode = data => api.post('/sms/send-visitor-code', data) 