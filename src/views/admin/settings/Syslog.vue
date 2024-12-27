<template>
  <div class="syslog-settings">
    <div class="page-header">
      <h2>Syslog 配置</h2>
    </div>

    <el-card class="settings-card">
      <el-form 
        ref="formRef"
        :model="settings"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="启用Syslog">
          <el-switch v-model="settings.enabled" />
        </el-form-item>

        <template v-if="settings.enabled">
          <el-form-item label="服务器地址" prop="server">
            <el-input 
              v-model="settings.server"
              placeholder="请输入Syslog服务器地址"
            />
          </el-form-item>

          <el-form-item label="端口" prop="port">
            <el-input-number 
              v-model="settings.port"
              :min="1"
              :max="65535"
              placeholder="514"
            />
          </el-form-item>

          <el-form-item label="协议">
            <el-radio-group v-model="settings.protocol">
              <el-radio label="udp">UDP</el-radio>
              <el-radio label="tcp">TCP</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="设施">
            <el-select v-model="settings.facility">
              <el-option label="Auth" value="auth" />
              <el-option label="Authpriv" value="authpriv" />
              <el-option label="Local0" value="local0" />
              <el-option label="Local1" value="local1" />
              <el-option label="Local2" value="local2" />
              <el-option label="Local3" value="local3" />
              <el-option label="Local4" value="local4" />
              <el-option label="Local5" value="local5" />
              <el-option label="Local6" value="local6" />
              <el-option label="Local7" value="local7" />
            </el-select>
          </el-form-item>

          <el-form-item label="日志级别">
            <el-select v-model="settings.severity">
              <el-option label="Emergency" value="emerg" />
              <el-option label="Alert" value="alert" />
              <el-option label="Critical" value="crit" />
              <el-option label="Error" value="err" />
              <el-option label="Warning" value="warning" />
              <el-option label="Notice" value="notice" />
              <el-option label="Info" value="info" />
              <el-option label="Debug" value="debug" />
            </el-select>
          </el-form-item>

          <el-form-item label="日志类型">
            <el-checkbox-group v-model="settings.logTypes">
              <el-checkbox label="auth">认证日志</el-checkbox>
              <el-checkbox label="system">系统日志</el-checkbox>
              <el-checkbox label="operation">操作日志</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleTest" 
            :loading="testing"
            :disabled="!settings.enabled"
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

const formRef = ref(null)
const testing = ref(false)
const saving = ref(false)

const settings = reactive({
  enabled: false,
  server: '',
  port: 514,
  protocol: 'udp',
  facility: 'local0',
  severity: 'info',
  logTypes: ['auth', 'system', 'operation']
})

const rules = {
  server: [
    { required: true, message: '请输入服务器地址', trigger: 'blur' },
    { pattern: /^[\w.-]+$/, message: '请输入正确的服务器地址', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口号范围为1-65535', trigger: 'blur' }
  ]
}

const handleTest = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  testing.value = true
  try {
    // TODO: 调用测试连接API
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    // TODO: 调用保存配置API
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.settings-card {
  margin-top: 24px;
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