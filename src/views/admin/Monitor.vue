<template>
  <div class="monitor">
    <el-card class="page-header">
      <h2>系统监控</h2>
      <div class="header-actions">
        <span class="refresh-time">上次刷新: {{ lastRefreshTime }}</span>
        <el-button 
          :loading="loading"
          @click="refreshData"
          type="primary"
          plain
        >
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </el-card>

    <div class="monitor-grid">
      <!-- CPU使用率 -->
      <el-card class="monitor-card">
        <template #header>
          <h3>CPU使用率</h3>
        </template>
        <div class="gauge-chart">
          <el-progress 
            type="dashboard" 
            :percentage="systemStatus.cpu.usage" 
            :color="getCpuColor"
          />
        </div>
        <div class="detail-list">
          <div class="detail-item">
            <span class="label">核心数</span>
            <span class="value">{{ systemStatus.cpu.cores }}核</span>
          </div>
          <div class="detail-item">
            <span class="label">平均负载</span>
            <span class="value">{{ systemStatus.cpu.loadAvg }}</span>
          </div>
        </div>
      </el-card>

      <!-- 内存使用情况 -->
      <el-card class="monitor-card">
        <template #header>
          <h3>内存使用情况</h3>
        </template>
        <div class="gauge-chart">
          <el-progress 
            type="dashboard" 
            :percentage="systemStatus.memory.usagePercent" 
            :color="getMemoryColor"
          />
        </div>
        <div class="detail-list">
          <div class="detail-item">
            <span class="label">总内存</span>
            <span class="value">{{ formatBytes(systemStatus.memory.total) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">已使用</span>
            <span class="value">{{ formatBytes(systemStatus.memory.used) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">可用</span>
            <span class="value">{{ formatBytes(systemStatus.memory.free) }}</span>
          </div>
        </div>
      </el-card>

      <!-- 网络状态 -->
      <el-card class="monitor-card">
        <template #header>
          <h3>网络状态</h3>
        </template>
        <div class="network-stats">
          <div class="stat-row">
            <div class="stat-item">
              <i class="icon-upload"></i>
              <div class="stat-info">
                <span class="label">上传速率</span>
                <span class="value">{{ formatSpeed(systemStatus.network.upload) }}</span>
              </div>
            </div>
            <div class="stat-item">
              <i class="icon-download"></i>
              <div class="stat-info">
                <span class="label">下载速率</span>
                <span class="value">{{ formatSpeed(systemStatus.network.download) }}</span>
              </div>
            </div>
          </div>
          <div class="connections-info">
            <span class="label">当前连接数</span>
            <span class="value">{{ systemStatus.network.connections }}</span>
          </div>
        </div>
      </el-card>

      <!-- 系统信息 -->
      <el-card class="monitor-card">
        <template #header>
          <h3>系统信息</h3>
        </template>
        <div class="detail-list">
          <div class="detail-item">
            <span class="label">操作系统</span>
            <span class="value">{{ systemStatus.system.os }}</span>
          </div>
          <div class="detail-item">
            <span class="label">运行时间</span>
            <span class="value">{{ formatUptime(systemStatus.system.uptime) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">系统时间</span>
            <span class="value">{{ systemStatus.system.time }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElCard, ElButton } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const loading = ref(false)
const lastRefreshTime = ref('-')
const refreshInterval = ref(null)

const systemStatus = ref({
  cpu: {
    usage: 0,
    cores: 0,
    loadAvg: '0.00'
  },
  memory: {
    total: 0,
    used: 0,
    free: 0,
    usagePercent: 0
  },
  network: {
    upload: 0,
    download: 0,
    connections: 0
  },
  system: {
    os: '',
    uptime: 0,
    time: ''
  }
})

const getCpuColor = (percentage) => {
  if (percentage < 60) return '#67C23A'
  if (percentage < 80) return '#E6A23C'
  return '#F56C6C'
}

const getMemoryColor = (percentage) => {
  if (percentage < 70) return '#67C23A'
  if (percentage < 90) return '#E6A23C'
  return '#F56C6C'
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatSpeed = (bytesPerSecond) => {
  return formatBytes(bytesPerSecond) + '/s'
}

const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}天 ${hours}小时 ${minutes}分钟`
}

const fetchSystemStatus = async () => {
  if (loading.value) return
  
  loading.value = true
  try {
    // TODO: 替换为实际的API调用
    // const response = await api.get('/monitor/status')
    // systemStatus.value = response.data
    
    // 模拟数据
    systemStatus.value = {
      cpu: {
        usage: Math.floor(Math.random() * 100),
        cores: 8,
        loadAvg: (Math.random() * 4).toFixed(2)
      },
      memory: {
        total: 16 * 1024 * 1024 * 1024,
        used: Math.floor(Math.random() * 12 * 1024 * 1024 * 1024),
        free: 4 * 1024 * 1024 * 1024,
        usagePercent: Math.floor(Math.random() * 100)
      },
      network: {
        upload: Math.floor(Math.random() * 10 * 1024 * 1024),
        download: Math.floor(Math.random() * 50 * 1024 * 1024),
        connections: Math.floor(Math.random() * 1000)
      },
      system: {
        os: 'Linux CentOS 7.9',
        uptime: Math.floor(Math.random() * 30 * 24 * 60 * 60),
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
    }
    
    lastRefreshTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  } catch (error) {
    ElMessage.error('获取系统状态失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchSystemStatus()
}

onMounted(() => {
  fetchSystemStatus()
  // 每30秒自动刷新一次
  refreshInterval.value = setInterval(fetchSystemStatus, 30000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
.monitor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.monitor-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.monitor-card h3 {
  margin: 0 0 20px;
  color: #2c3e50;
  font-size: 16px;
}

.gauge-chart {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.detail-list {
  margin-top: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-item .label {
  color: #666;
}

.detail-item .value {
  color: #2c3e50;
  font-weight: 500;
}

.network-stats {
  padding: 20px 0;
}

.stat-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-item i {
  font-size: 24px;
  color: #4e6ef2;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.connections-info {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.refresh-time {
  color: #666;
  font-size: 14px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  border-color: #4e6ef2;
  color: #4e6ef2;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-refresh {
  font-size: 16px;
}

.icon-refresh.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 