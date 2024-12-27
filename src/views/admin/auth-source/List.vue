<template>
  <div class="auth-source-list">
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
      width="500px"
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
        
        <el-form-item label="描述" prop="description">
          <el-input 
            type="textarea" 
            v-model="form.description" 
            placeholder="请输入描述信息"
          />
        </el-form-item>
        
        <el-form-item label="同步设置">
          <el-switch
            v-model="form.enableSync"
            active-text="启用自动同步"
          />
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
        </template>
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

const sources = ref([])

const form = reactive({
  name: '',
  type: '',
  description: '',
  enableSync: true,
  syncInterval: '1d',
  syncTime: new Date(2000, 0, 1, 3, 0), // 默认凌晨3点
})

const rules = {
  name: [
    { required: true, message: '请输入身份源名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择认证类型', trigger: 'change' }
  ],
  syncInterval: [
    { required: true, message: '请选择同步周期', trigger: 'change' }
  ],
  syncTime: [
    { required: true, message: '请选择同步时间', trigger: 'change' }
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

fetchSources()
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.table-container {
  margin-top: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 