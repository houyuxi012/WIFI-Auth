<template>
  <div class="visitors">
    <div class="page-header">
      <h2>访客管理</h2>
      <el-button type="primary" @click="showGenerateDialog">
        <el-icon><Plus /></el-icon>
        生成访客码
      </el-button>
    </div>
    
    <el-card class="table-container">
      <el-table
        v-loading="loading"
        :data="visitors"
        style="width: 100%"
      >
        <el-table-column prop="code" label="访客码" width="180" />
        <el-table-column prop="phone" label="手机号码" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '有效' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="生成时间" width="180" />
        <el-table-column prop="expireTime" label="过期时间" width="180" />
        <el-table-column label="使用次数" width="120">
          <template #default="{ row }">
            {{ row.useCount }}/{{ row.maxUseCount }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              plain 
              size="small" 
              @click="handleRenew(row)"
              :disabled="row.status === '已过期'"
            >
              续期
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

    <!-- 生成访客码对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="生成访客码"
      width="500px"
    >
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="手机号码" prop="phone">
          <el-input 
            v-model="form.phone" 
            placeholder="请输入访客手机号码"
          />
        </el-form-item>
        <el-form-item label="有效期">
          <el-select v-model="form.expireHours">
            <el-option label="1小时" :value="1" />
            <el-option label="4小时" :value="4" />
            <el-option label="8小时" :value="8" />
            <el-option label="24小时" :value="24" />
          </el-select>
        </el-form-item>
        <el-form-item label="使用次数">
          <el-select v-model="form.maxUseCount">
            <el-option label="1次" :value="1" />
            <el-option label="3次" :value="3" />
            <el-option label="5次" :value="5" />
            <el-option label="不限制" :value="-1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleGenerate" :loading="generating">
            生成并发送
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
import { generateVisitorCode, renewVisitorCode, deleteVisitorCode } from '@/api/visitors'

const loading = ref(false)
const dialogVisible = ref(false)
const generating = ref(false)
const formRef = ref(null)

const form = reactive({
  phone: '',
  expireHours: 4,
  maxUseCount: 3
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号码' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
  ]
}

const showGenerateDialog = () => {
  dialogVisible.value = true
  form.phone = ''
  form.expireHours = 4
  form.maxUseCount = 3
}

const handleGenerate = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  generating.value = true
  try {
    await generateVisitorCode({
      phone: form.phone,
      expireHours: form.expireHours,
      maxUseCount: form.maxUseCount
    })
    ElMessage.success('访客码已生成并发送')
    dialogVisible.value = false
    fetchVisitors()
  } catch (error) {
    ElMessage.error('生成失败：' + error.message)
  } finally {
    generating.value = false
  }
}

const handleRenew = async (row) => {
  try {
    await ElMessageBox.confirm('确定要为该访客码续期吗？')
    await renewVisitorCode(row.id)
    ElMessage.success('续期成功')
    fetchVisitors()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('续期失败：' + error.message)
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该访客码吗？')
    await deleteVisitorCode(row.id)
    ElMessage.success('删除成功')
    fetchVisitors()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

const fetchVisitors = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取访客列表
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    ElMessage.error('获取访客列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.add-btn {
  padding: 8px 16px;
  background: #4e6ef2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f8fafc;
  font-weight: 500;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.有效 {
  background: #e3f2fd;
  color: #1976d2;
}

.status.已过期 {
  background: #fbe9e7;
  color: #d32f2f;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  margin-right: 8px;
  cursor: pointer;
}

.action-btn.delete {
  color: #dc3545;
  border-color: #dc3545;
}
</style> 