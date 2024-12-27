<template>
  <div class="auth-source-ad">
    <div class="page-header">
      <h2>Windows AD 配置</h2>
    </div>
    
    <el-card class="config-card">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="域控服务器" prop="host">
          <el-input v-model="form.host" placeholder="请输入域控服务器地址" />
          <div class="form-tip">例如: 192.168.1.100 或 dc.company.com</div>
        </el-form-item>

        <el-form-item label="备用域控" prop="backupHost">
          <el-input v-model="form.backupHost" placeholder="请输入备用域控服务器地址" />
          <div class="form-tip">可选，用于主域控故障时的故障转移</div>
        </el-form-item>
        
        <el-form-item label="域名" prop="domain">
          <el-input v-model="form.domain" placeholder="请输入域名" />
          <div class="form-tip">例如: company.local</div>
        </el-form-item>

        <el-form-item label="Base DN" prop="baseDN">
          <el-input v-model="form.baseDN" placeholder="请输入基准DN" />
          <div class="form-tip">例如: DC=company,DC=local</div>
        </el-form-item>
        
        <el-form-item label="管理员账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入管理员账号" />
          <div class="form-tip">例如: administrator@company.local</div>
        </el-form-item>
        
        <el-form-item label="管理员密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            show-password
            placeholder="请输入管理员密码" 
          />
        </el-form-item>

        <el-form-item label="SSL/TLS">
          <el-switch v-model="form.useSSL" />
          <div class="form-tip">启用SSL/TLS加密连接</div>
        </el-form-item>

        <el-form-item label="证书验证">
          <el-switch v-model="form.validateCert" />
          <div class="form-tip">验证SSL证书的有效性</div>
        </el-form-item>
        
        <el-form-item label="证书文件" v-if="form.validateCert">
          <el-upload
            class="cert-uploader"
            action="/api/auth-source/ad/upload-cert"
            :show-file-list="false"
            :before-upload="beforeCertUpload"
            accept=".cer,.crt,.pem"
          >
            <el-button type="primary">上传证书</el-button>
          </el-upload>
          <div class="form-tip">上传域控服务器的SSL证书文件</div>
        </el-form-item>
        
        <el-form-item label="密码加密">
          <el-select v-model="form.passwordEncryption">
            <el-option label="不加密" value="none" />
            <el-option label="简单加密" value="simple" />
            <el-option label="NTLM" value="ntlm" />
            <el-option label="Kerberos" value="kerberos" />
          </el-select>
          <div class="form-tip">选择密码传输的加密方式</div>
        </el-form-item>
        
        <el-form-item label="连接超时" prop="timeout">
          <el-input-number 
            v-model="form.timeout" 
            :min="1"
            :max="60"
          />
          <span class="unit">秒</span>
          <div class="form-tip">连接超时时间，建议5-15秒</div>
        </el-form-item>
        
        <el-form-item label="重试次数" prop="retries">
          <el-input-number 
            v-model="form.retries" 
            :min="0"
            :max="5"
          />
          <div class="form-tip">连接失败时的重试次数</div>
        </el-form-item>

        <el-form-item label="端口" prop="port">
          <el-input-number 
            v-model="form.port" 
            :min="1"
            :max="65535"
            :placeholder="form.useSSL ? '636' : '389'"
          />
          <div class="form-tip">默认端口: 普通389, SSL/TLS 636</div>
        </el-form-item>

        <el-form-item label="用户过滤器" prop="userFilter">
          <el-input 
            v-model="form.userFilter" 
            placeholder="请输入用户过滤器"
            type="textarea"
            :rows="2"
          />
          <div class="form-tip">例如: (&(objectClass=user)(memberOf=CN=WiFiUsers,CN=Users,DC=company,DC=local))</div>
        </el-form-item>

        <el-form-item label="属性映射">
          <el-form-item label="用户名" prop="attrMap.username">
            <el-input v-model="form.attrMap.username" placeholder="sAMAccountName" />
          </el-form-item>
          <el-form-item label="显示名" prop="attrMap.displayName">
            <el-input v-model="form.attrMap.displayName" placeholder="displayName" />
          </el-form-item>
          <el-form-item label="邮箱" prop="attrMap.email">
            <el-input v-model="form.attrMap.email" placeholder="mail" />
          </el-form-item>
          <div class="form-tip">AD属性与系统用户属性的映射关系</div>
        </el-form-item>
        
        <el-divider>同步设置</el-divider>
        
        <el-form-item label="启用同步">
          <el-switch v-model="form.enableSync" />
          <div class="form-tip">自动同步AD域中的用户和组织架构</div>
        </el-form-item>
        
        <template v-if="form.enableSync">
          <el-form-item label="同步周期" prop="syncInterval">
            <el-select v-model="form.syncInterval">
              <el-option label="每小时" value="1h" />
              <el-option label="每6小时" value="6h" />
              <el-option label="每12小时" value="12h" />
              <el-option label="每天" value="1d" />
              <el-option label="每周" value="1w" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="同步时间" prop="syncTime">
            <el-time-picker
              v-model="form.syncTime"
              format="HH:mm"
              placeholder="选择时间"
              :disabled="form.syncInterval === '1h'"
            />
            <div class="form-tip">
              {{ getSyncTimeTip(form.syncInterval) }}
            </div>
          </el-form-item>
          
          <el-form-item label="同步范围">
            <el-checkbox-group v-model="form.syncScope">
              <el-checkbox label="users">用户数据</el-checkbox>
              <el-checkbox label="groups">组织架构</el-checkbox>
              <el-checkbox label="policies">安全策略</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
        
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
import { getADConfig, saveADConfig, testADConfig } from '@/api/auth-source'

const formRef = ref(null)
const testing = ref(false)
const saving = ref(false)

const form = reactive({
  host: '',
  backupHost: '',
  domain: '',
  baseDN: '',
  username: '',
  password: '',
  useSSL: false,
  validateCert: false,
  port: 389,
  passwordEncryption: 'simple',
  timeout: 5,
  retries: 3,
  userFilter: '(&(objectClass=user)(objectCategory=person))',
  attrMap: {
    username: 'sAMAccountName',
    displayName: 'displayName',
    email: 'mail'
  },
  enableSync: true,
  syncInterval: '1d',
  syncTime: new Date(2000, 0, 1, 3, 0), // 默认凌晨3点
  syncScope: ['users', 'groups']
})

const rules = {
  host: [
    { required: true, message: '请输入域控服务器地址', trigger: 'blur' }
  ],
  domain: [
    { required: true, message: '请输入域名', trigger: 'blur' }
  ],
  baseDN: [
    { required: true, message: '请输入基准DN', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入管理员密码', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口范围为1-65535', trigger: 'blur' }
  ],
  timeout: [
    { required: true, message: '请输入超时时间', trigger: 'blur' },
    { type: 'number', min: 1, max: 60, message: '超时范围为1-60秒', trigger: 'blur' }
  ],
  retries: [
    { required: true, message: '请输入重试次数', trigger: 'blur' },
    { type: 'number', min: 0, max: 5, message: '重试次数范围为0-5次', trigger: 'blur' }
  ],
  syncInterval: [
    { required: true, message: '请选择同步周期', trigger: 'change' }
  ],
  syncTime: [
    { required: true, message: '请选择同步时间', trigger: 'change' }
  ]
}

const handleTest = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  testing.value = true
  try {
    await testADConfig(form)
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
    await saveADConfig(form)
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
    const { data } = await getADConfig()
    Object.assign(form, data)
  } catch (error) {
    ElMessage.error('获取配置失败：' + error.message)
  }
}

// 证书上传前的验证
const beforeCertUpload = (file) => {
  const isValidType = /\.(cer|crt|pem)$/.test(file.name)
  if (!isValidType) {
    ElMessage.error('只能上传.cer、.crt或.pem格式的证书文件')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('证书文件大小不能超过2MB')
    return false
  }
  return true
}

const getSyncTimeTip = (interval) => {
  switch (interval) {
    case '1h':
      return '每小时自动同步一次'
    case '6h':
      return '每天在指定时间开始，每隔6小时同步一次'
    case '12h':
      return '每天在指定时间开始，每隔12小时同步一次'
    case '1d':
      return '每天在指定时间同步一次'
    case '1w':
      return '每周在指定时间同步一次'
    default:
      return ''
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