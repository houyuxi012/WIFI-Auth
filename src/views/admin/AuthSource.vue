<template>
  <div class="auth-source">
    <div class="page-header">
      <h2>认证身份源</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        新增身份源
      </el-button>
    </div>

    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="sources"
        style="width: 100%"
      >
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTagType(row.type)">
              {{ getTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="host" label="服务器地址" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              plain 
              size="small" 
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button 
              type="success" 
              plain 
              size="small" 
              @click="handleTest(row)"
              :loading="row.testing"
            >
              测试连接
            </el-button>
            <el-button 
              type="danger" 
              plain 
              size="small" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增身份源' : '编辑身份源'"
      width="600px"
    >
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入身份源名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择认证类型">
            <el-option label="Windows AD" value="ad" />
            <el-option label="RADIUS" value="radius" />
            <el-option label="OAuth2.0" value="oauth" />
            <el-option label="CAS" value="cas" />
            <el-option label="企业微信" value="wework" />
          </el-select>
        </el-form-item>
        
        <!-- AD域配置 -->
        <template v-if="form.type === 'ad'">
          <el-form-item label="域控地址" prop="host">
            <el-input v-model="form.host" placeholder="请输入域控服务器地址" />
          </el-form-item>
          <el-form-item label="域名" prop="domain">
            <el-input v-model="form.domain" placeholder="请输入域名" />
          </el-form-item>
          <el-form-item label="管理员账号" prop="username">
            <el-input v-model="form.username" placeholder="请输入管理员账号" />
          </el-form-item>
          <el-form-item label="管理员密码" prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              show-password
              placeholder="请输入管理员密码" 
            />
          </el-form-item>
        </template>
        
        <!-- RADIUS配置 -->
        <template v-if="form.type === 'radius'">
          <el-form-item label="服务器地址" prop="host">
            <el-input v-model="form.host" placeholder="请输入RADIUS服务器地址" />
          </el-form-item>
          <el-form-item label="认证端口" prop="authPort">
            <el-input-number v-model="form.authPort" :min="1" :max="65535" />
          </el-form-item>
          <el-form-item label="共享密钥" prop="secret">
            <el-input 
              v-model="form.secret" 
              type="password" 
              show-password
              placeholder="请输入共享密钥" 
            />
          </el-form-item>
        </template>
        
        <!-- OAuth2.0配置 -->
        <template v-if="form.type === 'oauth'">
          <el-form-item label="认证地址" prop="authUrl">
            <el-input v-model="form.authUrl" placeholder="请输入认证地址" />
          </el-form-item>
          <el-form-item label="Token地址" prop="tokenUrl">
            <el-input v-model="form.tokenUrl" placeholder="请输入Token地址" />
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
        </template>
        
        <!-- CAS配置 -->
        <template v-if="form.type === 'cas'">
          <el-form-item label="服务器地址" prop="serverUrl">
            <el-input v-model="form.serverUrl" placeholder="请输入CAS服务器地址" />
          </el-form-item>
        </template>
        
        <!-- 企业微信配置 -->
        <template v-if="form.type === 'wework'">
          <el-form-item label="企业ID" prop="corpId">
            <el-input v-model="form.corpId" placeholder="请输入企业ID" />
          </el-form-item>
          <el-form-item label="应用ID" prop="agentId">
            <el-input v-model="form.agentId" placeholder="请输入应用ID" />
          </el-form-item>
          <el-form-item label="Secret" prop="secret">
            <el-input 
              v-model="form.secret" 
              type="password" 
              show-password
              placeholder="请输入应用Secret" 
            />
          </el-form-item>
        </template>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="2"
            placeholder="请输入描述信息" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getAuthSources, addAuthSource, updateAuthSource, deleteAuthSource, testAuthSource } from '@/api/auth-source'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const submitting = ref(false)
const testing = ref(false)

const sources = ref([])

const form = reactive({
  name: '',
  type: '',
  description: '',
  // AD域
  host: '',
  domain: '',
  username: '',
  password: '',
  // RADIUS
  authPort: 1812,
  secret: '',
  // OAuth2.0
  authUrl: '',
  tokenUrl: '',
  clientId: '',
  clientSecret: '',
  // CAS
  serverUrl: '',
  // 企业微信
  corpId: '',
  agentId: '',
})

const rules = {
  name: [
    { required: true, message: '请输入身份源名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择认证类型', trigger: 'change' }
  ]
}

const getTypeName = (type) => {
  const typeMap = {
    ad: 'Windows AD',
    radius: 'RADIUS',
    oauth: 'OAuth2.0',
    cas: 'CAS',
    wework: '企业微信'
  }
  return typeMap[type] || type
}

const getTagType = (type) => {
  const typeMap = {
    ad: 'primary',
    radius: 'warning',
    oauth: 'success',
    cas: 'info',
    wework: 'danger'
  }
  return typeMap[type] || 'info'
}

const fetchSources = async () => {
  loading.value = true
  try {
    const { data } = await getAuthSources()
    sources.value = data
  } catch (error) {
    ElMessage.error('获取身份源列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  form.authPort = 1812
}

const showAddDialog = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  resetForm()
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(form, row)
}

const handleTest = async (row) => {
  row.testing = true
  try {
    await testAuthSource(row.id)
    ElMessage.success('连接测试成功')
  } catch (error) {
    ElMessage.error('连接测试失败：' + error.message)
  } finally {
    row.testing = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该身份源吗？')
    await deleteAuthSource(row.id)
    ElMessage.success('删除成功')
    fetchSources()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  submitting.value = true
  try {
    if (dialogType.value === 'add') {
      await addAuthSource(form)
    } else {
      await updateAuthSource(form.id, form)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    fetchSources()
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    submitting.value = false
  }
}

fetchSources()
</script> 