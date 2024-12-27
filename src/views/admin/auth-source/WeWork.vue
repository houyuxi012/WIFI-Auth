<template>
  <div class="auth-source-wework">
    <div class="page-header">
      <h2>企业微信配置</h2>
    </div>
    
    <el-card class="config-card">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="企业ID" prop="corpId">
          <el-input v-model="form.corpId" placeholder="请输入企业ID" />
          <div class="form-tip">企业微信后台的企业ID</div>
        </el-form-item>
        
        <el-form-item label="应用ID" prop="agentId">
          <el-input v-model="form.agentId" placeholder="请输入应用ID" />
          <div class="form-tip">企业微信后台创建的自建应用ID</div>
        </el-form-item>
        
        <el-form-item label="应用Secret" prop="secret">
          <el-input 
            v-model="form.secret" 
            type="password" 
            show-password
            placeholder="请输入应用Secret" 
          />
          <div class="form-tip">企业微信后台应用的Secret密钥</div>
        </el-form-item>
        
        <el-form-item label="授权范围">
          <el-checkbox-group v-model="form.scope">
            <el-checkbox label="snsapi_base">静默授权</el-checkbox>
            <el-checkbox label="snsapi_userinfo">完整授权</el-checkbox>
          </el-checkbox-group>
          <div class="form-tip">静默授权仅获取基本信息，完整授权可获取详细信息</div>
        </el-form-item>
        
        <el-form-item label="回调域名" prop="redirectDomain">
          <el-input v-model="form.redirectDomain" placeholder="请输入回调域名" />
          <div class="form-tip">需要在企业微信后台配置的可信域名</div>
        </el-form-item>
        
        <el-form-item label="启用部门同步">
          <el-switch v-model="form.syncDepartment" />
          <div class="form-tip">自动同步企业微信的部门架构</div>
        </el-form-item>
        
        <el-form-item label="同步间隔" v-if="form.syncDepartment">
          <el-input-number 
            v-model="form.syncInterval" 
            :min="1"
            :max="24"
          />
          <span class="unit">小时</span>
          <div class="form-tip">部门和用户数据的自动同步间隔</div>
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
          <el-button 
            type="info" 
            @click="handleSync"
            :loading="syncing"
            v-if="form.syncDepartment"
          >
            立即同步
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getWeWorkConfig, saveWeWorkConfig, testWeWorkConfig } from '@/api/auth-source'

const formRef = ref(null)
const testing = ref(false)
const saving = ref(false)
const syncing = ref(false)

const form = reactive({
  corpId: '',
  agentId: '',
  secret: '',
  scope: ['snsapi_base'],
  redirectDomain: '',
  syncDepartment: false,
  syncInterval: 6
})

const rules = {
  corpId: [
    { required: true, message: '请输入企业ID', trigger: 'blur' }
  ],
  agentId: [
    { required: true, message: '请输入应用ID', trigger: 'blur' }
  ],
  secret: [
    { required: true, message: '请输入应用Secret', trigger: 'blur' }
  ],
  redirectDomain: [
    { required: true, message: '请输入回调域名', trigger: 'blur' }
  ]
}

const handleTest = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  testing.value = true
  try {
    await testWeWorkConfig(form)
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
    await saveWeWorkConfig(form)
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    saving.value = false
  }
}

const handleSync = async () => {
  syncing.value = true
  try {
    // TODO: 调用同步API
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('同步成功')
  } catch (error) {
    ElMessage.error('同步失败：' + error.message)
  } finally {
    syncing.value = false
  }
}

// 获取配置
const fetchConfig = async () => {
  try {
    const { data } = await getWeWorkConfig()
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

.unit {
  margin-left: 8px;
  color: #666;
}
</style> 