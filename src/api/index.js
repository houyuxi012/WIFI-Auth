import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken
    }
    config.headers['X-Request-Id'] = Math.random().toString(36).substring(7)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    const signature = response.headers['x-signature']
    if (signature) {
      // TODO: 验证响应数据的签名
    }
    return response.data
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin-token')
      window.location.href = '/admin/login'
    } else if (error.response?.status === 403) {
      ElMessage.error('没有操作权限')
    } else if (error.response?.status === 429) {
      ElMessage.error('请求过于频繁，请稍后再试')
    }
    return Promise.reject(error)
  }
)

// 添加请求重试机制
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config
    if (!config || !config.retry) return Promise.reject(error)
    
    config.retryCount = config.retryCount || 0
    if (config.retryCount >= config.retry) {
      return Promise.reject(error)
    }
    
    config.retryCount += 1
    const delay = config.retryDelay || 1000
    await new Promise(resolve => setTimeout(resolve, delay))
    return api(config)
  }
)

export default api 