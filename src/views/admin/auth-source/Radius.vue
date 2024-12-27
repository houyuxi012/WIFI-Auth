<template>
  <div class="auth-source-radius">
    <div class="page-header">
      <h2>RADIUS 配置</h2>
    </div>
    
    <el-card class="config-card">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="服务器地址" prop="host">
          <el-input v-model="form.host" placeholder="请输入RADIUS服务器地址" />
        </el-form-item>
        <el-form-item label="认证端口" prop="authPort">
          <el-input-number 
            v-model="form.authPort" 
            :min="1" 
            :max="65535"
            placeholder="默认1812"
          />
        </el-form-item>
        <el-form-item label="共享密钥" prop="secret">
          <el-input 
            v-model="form.secret" 
            type="password" 
            show-password
            placeholder="请输入共享密钥" 
          />
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
import { getRadiusConfig, saveRadiusConfig, testRadiusConfig } from '@/api/auth-source'

const formRef = ref(null)
const testing = ref(false)
const saving = ref(false)

const form = reactive({
  host: '',
  authPort: 1812,
  secret: ''
})

const rules = {
  host: [
    { required: true, message: '请输入服务器地址', trigger: 'blur' }
  ],
  authPort: [
    { required: true, message: '请输入认证端口', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口范围为1-65535', trigger: 'blur' }
  ],
  secret: [
    { required: true, message: '请输入共享密钥', trigger: 'blur' }
  ]
}

const handleTest = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  testing.value = true
  try {
    await testRadiusConfig(form)
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
    await saveRadiusConfig(form)
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
    const { data } = await getRadiusConfig()
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
</style> 