<template>
  <div class="users">
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-radio-group v-model="userType" size="large">
          <el-radio-button label="system">系统用户</el-radio-button>
          <el-radio-button label="auth">认证用户</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 系统用户管理 -->
    <template v-if="userType === 'system'">
      <div class="toolbar">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
      </div>

      <el-card class="table-container">
        <el-table
          v-loading="loading"
          :data="systemUsers"
          style="width: 100%"
        >
          <el-table-column prop="username" label="用户名" width="180" />
          <el-table-column prop="role" label="角色" width="120">
            <template #default="{ row }">
              <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
                {{ row.role === 'admin' ? '管理员' : '操作员' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="lastLoginTime" label="最后登录" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                {{ row.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
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
                type="danger" 
                plain 
                size="small" 
                @click="handleDelete(row)"
                :disabled="row.role === 'admin'"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- 认证用户管理 -->
    <template v-else>
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
            <el-button type="success" @click="handleSync">
              <el-icon><RefreshRight /></el-icon>
              同步用户
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-card class="table-container">
        <el-table
          v-loading="loading"
          :data="authUsers"
          style="width: 100%"
        >
          <el-table-column prop="username" label="用户名" width="180" />
          <el-table-column prop="authType" label="认证类型" width="120">
            <template #default="{ row }">
              <el-tag :type="row.authType === 'ad' ? 'primary' : 'warning'">
                {{ row.authType === 'ad' ? 'AD域' : 'RADIUS' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="department" label="部门" width="180" />
          <el-table-column prop="lastLoginTime" label="最后登录" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                {{ row.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                plain 
                size="small" 
                @click="handleViewDetail(row)"
              >
                详情
              </el-button>
              <el-button 
                :type="row.status === 'active' ? 'danger' : 'success'"
                plain 
                size="small" 
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 'active' ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </template>

    <!-- 系统用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      width="500px"
    >
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username" 
            :disabled="dialogType === 'edit'"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item 
          label="密码" 
          prop="password"
          v-if="dialogType === 'add'"
        >
          <el-input 
            v-model="form.password" 
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role">
            <el-option label="管理员" value="admin" />
            <el-option label="操作员" value="operator" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="'active'"
            :inactive-value="'disabled'"
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

    <!-- 认证用户详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="用户详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户名">
          {{ currentUser.username }}
        </el-descriptions-item>
        <el-descriptions-item label="认证类型">
          {{ currentUser.authType === 'ad' ? 'AD域' : 'RADIUS' }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ currentUser.department }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ currentUser.email }}
        </el-descriptions-item>
        <el-descriptions-item label="最后登录时间">
          {{ currentUser.lastLoginTime }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ currentUser.status === 'active' ? '正常' : '禁用' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, RefreshRight } from '@element-plus/icons-vue'

const userType = ref('system')
const loading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogType = ref('add')
const submitting = ref(false)
const formRef = ref(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 系统用户表单
const form = reactive({
  username: '',
  password: '',
  role: 'operator',
  status: 'active'
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 认证用户搜索表单
const searchForm = reactive({
  username: '',
  authType: ''
})

// 当前选中的用户（用于详情展示）
const currentUser = reactive({
  username: '',
  authType: '',
  department: '',
  email: '',
  lastLoginTime: '',
  status: ''
})

// 处理系统用户相关操作
const showAddDialog = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  form.username = ''
  form.password = ''
  form.role = 'operator'
  form.status = 'active'
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  form.username = row.username
  form.role = row.role
  form.status = row.status
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？')
    // TODO: 调用删除API
    ElMessage.success('删除成功')
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
    // TODO: 调用保存API
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('保存成功')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    submitting.value = false
  }
}

// 处理认证用户相关操作
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
    // TODO: 调用同步API
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    // TODO: 调用状态切换API
    ElMessage.success('操作成功')
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

// 获取认证用户列表
const fetchAuthUsers = async () => {
  loading.value = true
  try {
    // TODO: 调用获取用户列表API
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    ElMessage.error('获取用户列表失败：' + error.message)
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
</style> 