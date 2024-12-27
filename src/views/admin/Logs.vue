<template>
  <div class="logs">
    <div class="page-header">
      <h2>认证日志</h2>
      <div class="header-actions">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="认证类型">
            <el-select v-model="searchForm.authType" placeholder="全部">
              <el-option label="AD域认证" value="ad" />
              <el-option label="RADIUS认证" value="radius" />
              <el-option label="访客认证" value="visitor" />
            </el-select>
          </el-form-item>
          <el-form-item label="认证状态">
            <el-select v-model="searchForm.status" placeholder="全部">
              <el-option label="成功" value="success" />
              <el-option label="失败" value="failed" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结��时间"
              :shortcuts="dateShortcuts"
            />
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
    </div>

    <el-card class="logs-table">
      <el-table
        v-loading="loading"
        :data="logsList"
        style="width: 100%"
      >
        <el-table-column prop="timestamp" label="时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="authType" label="认证类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getAuthTypeTag(row.authType)">
              {{ getAuthTypeLabel(row.authType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column prop="message" label="详细信息" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const loading = ref(false)
const logsList = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const searchForm = reactive({
  authType: '',
  status: '',
  timeRange: ''
})

const dateShortcuts = [
  {
    text: '最近一小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: '今天',
    value: () => {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      return [start, end]
    }
  },
  {
    text: '最近3天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
      return [start, end]
    }
  },
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]

const formatTime = (timestamp) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const getAuthTypeLabel = (type) => {
  const types = {
    ad: 'AD域认证',
    radius: 'RADIUS认证',
    visitor: '访客认证'
  }
  return types[type] || type
}

const getAuthTypeTag = (type) => {
  const types = {
    ad: 'primary',
    radius: 'warning',
    visitor: 'info'
  }
  return types[type] || ''
}

const fetchLogs = async () => {
  loading.value = true
  try {
    // TODO: 调用后端API获取日志列表
    // 这里使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    const mockData = Array(pageSize.value).fill(0).map((_, index) => ({
      id: currentPage.value * pageSize.value + index,
      timestamp: new Date().getTime() - Math.random() * 7 * 24 * 3600 * 1000,
      username: `user${Math.floor(Math.random() * 1000)}`,
      authType: ['ad', 'radius', 'visitor'][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.2 ? 'success' : 'failed',
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      message: '认证请求处理完成'
    }))
    logsList.value = mockData
    total.value = 256
  } catch (error) {
    ElMessage.error('获取日志失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchLogs()
}

const handleReset = () => {
  searchForm.authType = ''
  searchForm.status = ''
  searchForm.timeRange = ''
  handleSearch()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  fetchLogs()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchLogs()
}

onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.logs {
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.header-actions {
  margin-top: 16px;
}

.logs-table {
  margin-top: 24px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 16px;
}

:deep(.el-date-editor) {
  width: 360px;
}
</style> 