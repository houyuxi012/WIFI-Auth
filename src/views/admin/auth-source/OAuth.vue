<template>
  <div class="auth-source-oauth">
    <div class="page-header">
      <h2>OAuth2.0 配置</h2>
    </div>
    
    <el-card class="config-card">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="认证服务器" prop="authServer">
          <el-input v-model="form.authServer" placeholder="请输入认证服务器地址" />
          <div class="form-tip">例如: https://auth.example.com</div>
        </el-form-item>
        
        <el-form-item label="Client ID" prop="clientId">
          <el-input v-model="form.clientId" placeholder="请输入Client ID" />
        </el-form-item>
        
        <el-form-item label="Client Secret" prop="clientSecret">
          <el-input 
            v-model="form.clientSecret" 
            type="password" 
            show-password
            placeholder="请输入Client Secret" 
          />
        </el-form-item>
        
        <el-form-item label="授权端点" prop="authEndpoint">
          <el-input v-model="form.authEndpoint" placeholder="请输入授权端点" />
          <div class="form-tip">例如: /oauth/authorize</div>
        </el-form-item>
        
        <el-form-item label="Token端点" prop="tokenEndpoint">
          <el-input v-model="form.tokenEndpoint" placeholder="请输入Token端点" />
          <div class="form-tip">例如: /oauth/token</div>
        </el-form-item>
        
        <el-form-item label="用户信息端点" prop="userInfoEndpoint">
          <el-input v-model="form.userInfoEndpoint" placeholder="请输入用户信息端点" />
          <div class="form-tip">例如: /oauth/userinfo</div>
        </el-form-item>
        
        <el-form-item label="回调地址" prop="redirectUri">
          <el-input v-model="form.redirectUri" placeholder="请输入回调地址" />
          <div class="form-tip">认证成功后的回调地址</div>
        </el-form-item>
        
        <el-form-item label="Scope" prop="scope">
          <el-input v-model="form.scope" placeholder="请输入授权范围" />
          <div class="form-tip">多个scope用空格分隔，例如: openid profile email</div>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleTest" 
            :loading="testing"
          >
            测试连接
          </el-button>
          <el-button 
            type="success" 
            @click="handleSave" 
            :loading="saving"
          >
            保存配置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getOAuthConfig, saveOAuthConfig, testOAuthConfig } from '@/api/auth-source'

const formRef = ref(null)
const testing = ref(false)
const saving = ref(false)

const form = reactive({
  authServer: '',
  clientId: '',
  clientSecret: '',
  authEndpoint: '',
  tokenEndpoint: '',
  userInfoEndpoint: '',
  redirectUri: '',
  scope: ''
})

const rules = {
  authServer: [
    { required: true, message: '请输入认证服务器地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  clientId: [
    { required: true, message: '请输入Client ID', trigger: 'blur' }
  ],
  clientSecret: [
    { required: true, message: '请输入Client Secret', trigger: 'blur' }
  ],
  authEndpoint: [
    { required: true, message: '请输入授权端点', trigger: 'blur' }
  ],
  tokenEndpoint: [
    { required: true, message: '请输入Token端点', trigger: 'blur' }
  ],
  userInfoEndpoint: [
    { required: true, message: '请输入用户信息端点', trigger: 'blur' }
  ],
  redirectUri: [
    { required: true, message: '请输入回调地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  scope: [
    { required: true, message: '请输入授权范围', trigger: 'blur' }
  ]
}

const handleTest = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  testing.value = true
  try {
    await testOAuthConfig(form)
    ElMessage.success('连接测试成功')
  } catch (error) {
    ElMessage.error('连接测试失败：' + error.message)
  } finally {
    testing.value = false
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  saving.value = true
  try {
    await saveOAuthConfig(form)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    saving.value = false
  }
}

// 获取配置
const fetchConfig = async () => {
  try {
    const { data } = await getOAuthConfig()
    Object.assign(form, data)
  } catch (error) {
    ElMessage.error('获取配置失败：' + error.message)
  }
}

fetchConfig()
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.config-card {
  margin-top: 16px;
}

:deep(.el-form-item) {
  max-width: 500px;
}

.form-tip {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style> 