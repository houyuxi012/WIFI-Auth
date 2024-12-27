<template>
  <div class="auth-server">
    <div class="page-header">
      <h2>认证服务器配置</h2>
    </div>
    
    <div class="server-container">
      <div class="server-type-select">
        <label class="radio-card" :class="{ active: serverType === 'ad' }">
          <input 
            type="radio" 
            v-model="serverType" 
            value="ad"
            name="serverType"
          >
          <div class="card-content">
            <i class="icon-windows"></i>
            <span>AD域认证</span>
          </div>
        </label>
        
        <label class="radio-card" :class="{ active: serverType === 'radius' }">
          <input 
            type="radio" 
            v-model="serverType" 
            value="radius"
            name="serverType"
          >
          <div class="card-content">
            <i class="icon-radius"></i>
            <span>RADIUS认证</span>
          </div>
        </label>
      </div>

      <div class="server-config" v-if="serverType === 'ad'">
        <h3>AD域配置</h3>
        <div class="form-group">
          <label>服务器地址</label>
          <input 
            type="text" 
            v-model="config.adServer" 
            placeholder="例：ldap://dc.company.local"
          >
        </div>
        <div class="form-group">
          <label>域名</label>
          <input 
            type="text" 
            v-model="config.adDomain" 
            placeholder="例：COMPANY.LOCAL"
          >
        </div>
        <div class="form-group">
          <label>搜索基准 DN</label>
          <input 
            type="text" 
            v-model="config.adBaseDN" 
            placeholder="例：DC=company,DC=local"
          >
        </div>
        <div class="form-group">
          <label>用户搜索 OU</label>
          <input 
            type="text" 
            v-model="config.adUserOU" 
            placeholder="例：OU=Users,DC=company,DC=local"
          >
        </div>
        <div class="form-group">
          <label>管理员账号</label>
          <input 
            type="text" 
            v-model="config.adAdmin" 
            placeholder="例：administrator@company.local"
          >
        </div>
        <div class="form-group">
          <label>管理员密码</label>
          <input 
            type="password" 
            v-model="config.adPassword" 
            placeholder="域管理员密码"
          >
        </div>
      </div>

      <div class="server-config" v-if="serverType === 'radius'">
        <h3>RADIUS配置</h3>
        <div class="form-group">
          <label>服务器地址</label>
          <input 
            type="text" 
            v-model="config.radiusServer" 
            placeholder="例：192.168.1.100"
          >
        </div>
        <div class="form-group">
          <label>认证端口</label>
          <input 
            type="number" 
            v-model="config.radiusAuthPort" 
            placeholder="默认：1812"
          >
        </div>
        <div class="form-group">
          <label>共享密钥</label>
          <input 
            type="password" 
            v-model="config.radiusSecret" 
            placeholder="RADIUS共享密钥"
          >
        </div>
      </div>

      <div class="form-actions">
        <button class="test-btn" @click="handleTest">测试连接</button>
        <button class="save-btn" @click="handleSave">保存配置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getAuthConfig, saveAuthConfig, testConnection } from '../../api/authServer'
import { ElMessage } from 'element-plus'

const serverType = ref('ad')
const config = reactive({
  adServer: '',
  adDomain: '',
  adBaseDN: '',
  adUserOU: '',
  adAdmin: '',
  adPassword: '',
  radiusServer: '',
  radiusAuthPort: 1812,
  radiusSecret: ''
})

onMounted(async () => {
  try {
    const data = await getAuthConfig()
    Object.assign(config, data)
    serverType.value = data.adEnabled ? 'ad' : 'radius'
  } catch (error) {
    ElMessage.error('获取配置失败：' + error.message)
  }
})

const handleTest = async () => {
  try {
    await testConnection({
      type: serverType.value,
      config: {
        ...(serverType.value === 'ad' ? {
          server: config.adServer,
          domain: config.adDomain,
          baseDN: config.adBaseDN,
          userOU: config.adUserOU,
          admin: config.adAdmin,
          password: config.adPassword
        } : {
          server: config.radiusServer,
          port: config.radiusAuthPort,
          secret: config.radiusSecret
        })
      }
    })
    ElMessage.success('连接测试成功')
  } catch (error) {
    ElMessage.error('连接测试失败：' + error.message)
  }
}

const handleSave = async () => {
  try {
    await saveAuthConfig({
      type: serverType.value,
      config: serverType.value === 'ad' ? {
        server: config.adServer,
        domain: config.adDomain,
        baseDN: config.adBaseDN,
        userOU: config.adUserOU,
        admin: config.adAdmin,
        password: config.adPassword
      } : {
        server: config.radiusServer,
        port: config.radiusAuthPort,
        secret: config.radiusSecret
      }
    })
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  }
}
</script>

<style scoped>
.server-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
}

.server-type-select {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.radio-card {
  flex: 1;
  position: relative;
  cursor: pointer;
}

.radio-card input {
  position: absolute;
  opacity: 0;
}

.card-content {
  padding: 24px;
  border: 2px solid #eee;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.radio-card.active .card-content {
  border-color: #4e6ef2;
  background: #f0f4ff;
}

.card-content i {
  font-size: 32px;
  color: #666;
}

.radio-card.active .card-content i {
  color: #4e6ef2;
}

.server-config {
  margin-top: 24px;
}

.server-config h3 {
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  max-width: 400px;
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

.form-actions {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 16px;
}

.test-btn,
.save-btn {
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-btn {
  background: #fff;
  border: 1px solid #4e6ef2;
  color: #4e6ef2;
}

.test-btn:hover {
  background: #f0f4ff;
}

.save-btn {
  background: #4e6ef2;
  border: none;
  color: #fff;
}

.save-btn:hover {
  background: #4058d9;
}
</style> 