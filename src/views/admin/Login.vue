<template>
  <div class="admin-login">
    <div class="login-box">
      <div class="login-header">
        <img src="/wifi-logo.png" alt="Logo" class="logo">
        <h2>后台管理系统</h2>
      </div>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input 
            type="text" 
            v-model="form.username"
            placeholder="请输入用户名"
            @input="clearError"
            required
          >
          <span class="error-text" v-if="errors.username">{{ errors.username }}</span>
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input 
            type="password" 
            v-model="form.password"
            placeholder="请输入密码"
            @input="clearError"
            required
          >
          <span class="error-text" v-if="errors.password">{{ errors.password }}</span>
        </div>
        
        <div class="error-message" v-if="errors.general">
          {{ errors.general }}
        </div>
        
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const errors = reactive({
  username: '',
  password: '',
  general: ''
})

const form = reactive({
  username: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  errors.username = ''
  errors.password = ''
  errors.general = ''

  if (!form.username) {
    errors.username = '请输入用户名'
    isValid = false
  }

  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度不能小于6位'
    isValid = false
  }

  return isValid
}

const clearError = () => {
  errors.general = ''
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  await handleLogin()
}

const handleLogin = async () => {
  loading.value = true
  try {
    // 模拟登录请求
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (form.username === 'admin' && form.password === '123456') {
          resolve({
            token: 'dummy-token',
            user: {
              username: 'admin',
              role: 'administrator'
            }
          })
        } else {
          reject(new Error('用户名或密码错误'))
        }
      }, 1000)
    })
    
    // 保存登录信息
    localStorage.setItem('admin-token', 'dummy-token')
    localStorage.setItem('admin-user', JSON.stringify({
      username: 'admin',
      role: 'administrator'
    }))
    
    router.push('/admin/dashboard')
  } catch (error) {
    errors.general = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 120px;
  height: auto;
  margin-bottom: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #2c3e50;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #4e6ef2;
  box-shadow: 0 0 0 2px rgba(78, 110, 242, 0.2);
}

.login-btn {
  padding: 12px;
  background: #4e6ef2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: #4058d9;
}

.login-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.error-text {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.error-message {
  text-align: center;
  color: #dc3545;
  margin-bottom: 16px;
  padding: 8px;
  background: #fbe9e7;
  border-radius: 4px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group input.error {
  border-color: #dc3545;
}

.form-group input.error:focus {
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}
</style> 