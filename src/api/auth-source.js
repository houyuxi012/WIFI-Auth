import api from './index'

export const getAuthSources = () => api.get('/auth-source')
export const addAuthSource = data => api.post('/auth-source', data)
export const updateAuthSource = (id, data) => api.put(`/auth-source/${id}`, data)
export const deleteAuthSource = id => api.delete(`/auth-source/${id}`)
export const testAuthSource = id => api.post(`/auth-source/${id}/test`)

// 各认证类型的配置
export const getADConfig = () => api.get('/auth-source/ad/config')
export const saveADConfig = data => api.put('/auth-source/ad/config', data)
export const testADConfig = () => api.post('/auth-source/ad/test')

export const getRadiusConfig = () => api.get('/auth-source/radius/config')
export const saveRadiusConfig = data => api.put('/auth-source/radius/config', data)
export const testRadiusConfig = () => api.post('/auth-source/radius/test')

export const getOAuthConfig = () => api.get('/auth-source/oauth/config')
export const saveOAuthConfig = data => api.put('/auth-source/oauth/config', data)
export const testOAuthConfig = () => api.post('/auth-source/oauth/test')

export const getCASConfig = () => api.get('/auth-source/cas/config')
export const saveCASConfig = data => api.put('/auth-source/cas/config', data)
export const testCASConfig = () => api.post('/auth-source/cas/test')

export const getWeWorkConfig = () => api.get('/auth-source/wework/config')
export const saveWeWorkConfig = data => api.put('/auth-source/wework/config', data)
export const testWeWorkConfig = () => api.post('/auth-source/wework/test')

// 上传证书
export const uploadADCert = file => {
  const formData = new FormData()
  formData.append('cert', file)
  return api.post('/auth-source/ad/upload-cert', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 验证证书
export const verifyADCert = () => api.post('/auth-source/ad/verify-cert')

// 删除证书
export const deleteADCert = () => api.delete('/auth-source/ad/cert') 