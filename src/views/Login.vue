<template>
  <div class="login-container">
    <div class="logo-wrapper">
      <img src="/wifi-logo.png" alt="WiFi Logo" class="logo">
    </div>

    <div class="title-wrapper">
      <div class="page-title">
        <h1 class="main-title">XXX公司WiFi认证系统</h1>
        <p class="sub-title">本系统仅供公司内部人员及访客使用</p>
      </div>
    </div>

    <div class="login-card">
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'employee' }"
          @click="activeTab = 'employee'"
        >
          员工通道
        </button>
        <button 
          class="tab-btn"
          :class="{ active: activeTab === 'visitor' }"
          @click="activeTab = 'visitor'"
        >
          访客通道
        </button>
      </div>

      <div class="tab-content">
        <!-- 员工登录 -->
        <div v-if="activeTab === 'employee'" class="employee-login">
          <form @submit.prevent="handleEmployeeLogin" class="login-form">
            <div class="form-group">
              <label>账户</label>
              <input 
                type="text" 
                v-model="employeeForm.username"
                placeholder="请输入账户"
                required
              >
            </div>
            
            <div class="form-group">
              <label>密码</label>
              <input 
                type="password" 
                v-model="employeeForm.password"
                placeholder="请输入密码"
                required
              >
            </div>
            
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="employeeLoading"
            >
              {{ employeeLoading ? '登录中...' : '登录' }}
            </button>
          </form>
        </div>
        
        <!-- 访客登录 -->
        <div v-else class="visitor-login">
          <form @submit.prevent="handleVisitorLogin" class="login-form">
            <div class="form-group">
              <label>访客码</label>
              <input 
                type="text" 
                v-model="visitorForm.code"
                placeholder="请输入访客码"
                required
              >
            </div>
            
            <div class="form-group">
              <label>手机��</label>
              <input 
                type="tel"
                v-model="visitorForm.phone"
                placeholder="请输入手机号"
                pattern="^1[3-9]\d{9}$"
                required
              >
              <div class="form-tip">用于接收WiFi连接信息</div>
            </div>
            
            <div class="form-group agreement">
              <label class="checkbox">
                <input 
                  type="checkbox" 
                  v-model="visitorForm.agreement"
                  required
                >
                <span class="checkbox-text">
                  我已阅读并同意
                  <a href="#" @click.prevent="showAgreement">《访客网络使用协议》</a>
                </span>
              </label>
            </div>
            
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="visitorLoading"
            >
              {{ visitorLoading ? '认证中...' : '认证' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <div class="help-line">
        帮助热线：内线8888
        <span class="divider">|</span>
        <router-link to="/admin/login" class="admin-link">后台管理</router-link>
      </div>
    </div>

    <!-- 协议对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
    >
      <div class="agreement-content" v-html="dialogContent"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="acceptAgreement">
            同意
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'

const router = useRouter()
const activeTab = ref('employee')
const employeeLoading = ref(false)
const visitorLoading = ref(false)

const employeeForm = reactive({
  username: '',
  password: '',
})

const visitorForm = reactive({
  code: '',
  phone: '',
  agreement: false
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogContent = ref('')

const handleEmployeeLogin = async () => {
  employeeLoading.value = true
  try {
    const { token } = await login({
      username: employeeForm.username,
      password: employeeForm.password,
    })
    localStorage.setItem('token', token)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    employeeLoading.value = false
  }
}

const handleVisitorLogin = async () => {
  if (!visitorForm.agreement) {
    ElMessage.warning('请先同意访客网络使用协议')
    return
  }
  
  visitorLoading.value = true
  try {
    await login({
      type: 'visitor',
      code: visitorForm.code,
      phone: visitorForm.phone
    })
    ElMessage.success('认证成功，WiFi连接信息已发送至您的手机')
    router.push('/visitor/dashboard')
  } catch (error) {
    ElMessage.error(error.message || '认证失败')
  } finally {
    visitorLoading.value = false
  }
}

const showAgreement = () => {
  dialogTitle.value = '访客网络使用协议'
  dialogContent.value = `
    <h3>一、使用规范</h3>
    <p>1. 访客网络仅供公司访客临时使用</p>
    <p>2. 严禁进行任何违法违规活动</p>
    <p>3. 禁止下载或传播违法违规内容</p>
    
    <h3>二、安全责任</h3>
    <p>1. 访客需对个人账号负责</p>
    <p>2. 遵守网络安全相关法律法规</p>
    <p>3. 发现异常及时向管理员报告</p>
    
    <h3>三、免责声明</h3>
    <p>1. 公司不对访客的上网行为负责</p>
    <p>2. 访客应自行承担上网风险</p>
  `
  dialogVisible.value = true
}

const acceptAgreement = () => {
  visitorForm.agreement = true
  dialogVisible.value = false
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.logo-wrapper {
  width: 100%;
  padding: 20px;
}

.logo {
  height: 40px;
  margin-left: 20px;
  width: 133px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.title-wrapper {
  width: 100%;
  text-align: center;
  padding: 40px 0;
}

.page-title {
  max-width: 600px;
  margin: 0 auto;
}

.main-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  margin-bottom: 12px;
}

.sub-title {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.login-card {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 16px;
  border: none;
  background: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #2c3e50;
  background: #f8fafc;
}

.tab-btn.active {
  color: #4e6ef2;
  border-bottom: 2px solid #4e6ef2;
}

.tab-content {
  padding: 24px;
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
  font-weight: 500;
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4e6ef2;
  box-shadow: 0 0 0 2px rgba(78, 110, 242, 0.2);
}

.password-input {
  position: relative;
  display: flex;
}

.password-input input {
  flex: 1;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  color: #666;
}

.checkbox-text a {
  color: #4e6ef2;
  text-decoration: none;
}

.submit-btn {
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: #4e6ef2;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #4058d9;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.error {
  font-size: 12px;
  color: #e74c3c;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  background: #f8fafc;
}

.btn-primary {
  background: #4e6ef2;
  border-color: #4e6ef2;
  color: #fff;
}

.btn-primary:hover {
  background: #4058d9;
}

.help-line {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 20px 0 40px;
}

.divider {
  margin: 0 12px;
  color: #ddd;
}

.admin-link {
  color: #4e6ef2;
  text-decoration: none;
  transition: color 0.3s ease;
}

.admin-link:hover {
  color: #4058d9;
}

@media (max-width: 520px) {
  .title-wrapper {
    padding: 20px 0;
  }

  .main-title {
    font-size: 24px;
  }

  .sub-title {
    font-size: 14px;
  }

  .login-card {
    margin: 0 20px 40px;
  }
}

.visitor-login {
  padding: 20px 0;
}

.form-tip {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.agreement {
  margin: 20px 0;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  color: #666;
}

.checkbox-text a {
  color: #4e6ef2;
  text-decoration: none;
}

.footer {
  margin-top: auto;
  padding: 20px;
  text-align: center;
}

.help-line {
  color: #666;
  font-size: 14px;
}

.divider {
  margin: 0 12px;
  color: #ddd;
}

.admin-link {
  color: #4e6ef2;
  text-decoration: none;
}

.agreement-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 0 20px;
}

.agreement-content h3 {
  margin: 20px 0 10px;
  color: #333;
}

.agreement-content p {
  margin: 8px 0;
  color: #666;
  line-height: 1.6;
}
</style> 