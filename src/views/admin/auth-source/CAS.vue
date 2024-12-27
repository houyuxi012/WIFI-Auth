<template>
  <div class="auth-source-cas">
    <div class="page-header">
      <h2>CAS 配置</h2>
    </div>
    
    <el-card class="config-card">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="服务器地址" prop="serverUrl">
          <el-input v-model="form.serverUrl" placeholder="请输入CAS服务器地址" />
          <div class="form-tip">例如: https://cas.example.com</div>
        </el-form-item>
        
        <el-form-item label="登录路径" prop="loginUrl">
          <el-input v-model="form.loginUrl" placeholder="请输入登录路径" />
          <div class="form-tip">例如: /cas/login</div>
        </el-form-item>
        
        <el-form-item label="登出路径" prop="logoutUrl">
          <el-input v-model="form.logoutUrl" placeholder="请输入登出路径" />
          <div class="form-tip">例如: /cas/logout</div>
        </el-form-item>
        
        <el-form-item label="服务标识" prop="service">
          <el-input v-model="form.service" placeholder="请输入服务标识" />
          <div class="form-tip">当前系统在CAS中注册的服务URL</div>
        </el-form-item>
        
        <el-form-item label="协议版本">
          <el-radio-group v-model="form.version">
            <el-radio label="2.0">CAS 2.0</el-radio>
            <el-radio label="3.0">CAS 3.0</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="启用SAML">
          <el-switch v-model="form.enableSaml" />
          <div class="form-tip">启用SAML协议支持</div>
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
import { getCASConfig, saveCASConfig, testCASConfig } from '@/api/auth-source'

const formRef = ref(null)
const testing = ref(false)
const saving = ref(false)

const form = reactive({
  serverUrl: '',
  loginUrl: '',
  logoutUrl: '',
  service: '',
  version: '3.0',
  enableSaml: false
})

const rules = {
  serverUrl: [
    { required: true, message: '请输入服务器地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ],
  loginUrl: [
    { required: true, message: '请输入登录路径', trigger: 'blur' }
  ],
  logoutUrl: [
    { required: true, message: '请输入登出路径', trigger: 'blur' }
  ],
  service: [
    { required: true, message: '请输入服务标识', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ]
}

const handleTest = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  testing.value = true
  try {
    await testCASConfig(form)
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
    await saveCASConfig(form)
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
    const { data } = await getCASConfig()
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