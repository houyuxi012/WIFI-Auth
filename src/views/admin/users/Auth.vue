<template>
  <div class="auth-users">
    <div class="page-header">
      <h2>认证用户</h2>
      <el-button type="success" @click="handleSync">
        <el-icon><RefreshRight /></el-icon>
        同步用户
      </el-button>
    </div>

    <div class="toolbar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="认证类型">
          <el-select v-model="searchForm.authType" placeholder="全部">
            <el-option label="AD域认证" value="ad" />
            <el-option label="RADIUS认证" value="radius" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card class="table-container">
      <!-- ... 表格部分保持不变 ... -->
    </el-card>

    <!-- ... 详情对话框保持不变 ... -->
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, RefreshRight } from '@element-plus/icons-vue'
import { getAuthUsers, syncAuthUsers, toggleAuthUserStatus } from '@/api/users'

const loading = ref(false)
const detailVisible = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const authUsers = ref([])

const searchForm = reactive({
  username: '',
  authType: ''
})

const currentUser = reactive({
  username: '',
  authType: '',
  department: '',
  email: '',
  lastLoginTime: '',
  status: ''
})

const fetchAuthUsers = async () => {
  loading.value = true
  try {
    const { data } = await getAuthUsers({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    })
    authUsers.value = data.list
    total.value = data.total
  } catch (error) {
    ElMessage.error('获取用户列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchAuthUsers()
}

const handleReset = () => {
  searchForm.username = ''
  searchForm.authType = ''
  handleSearch()
}

const handleSync = async () => {
  try {
    await syncAuthUsers()
    ElMessage.success('同步成功')
    fetchAuthUsers()
  } catch (error) {
    ElMessage.error('同步失败：' + error.message)
  }
}

const handleViewDetail = (row) => {
  Object.assign(currentUser, row)
  detailVisible.value = true
}

const handleToggleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 'active' ? '禁用' : '启用'}该用户吗？`
    )
    await toggleAuthUserStatus(row.id, row.status === 'active' ? 'disabled' : 'active')
    ElMessage.success('操作成功')
    fetchAuthUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败：' + error.message)
    }
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchAuthUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchAuthUsers()
}

fetchAuthUsers()
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.toolbar {
  margin-bottom: 24px;
}

.table-container {
  margin-top: 16px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
}

:deep(.el-descriptions) {
  padding: 16px;
}
</style> 