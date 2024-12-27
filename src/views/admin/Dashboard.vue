<template>
  <div class="dashboard">
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="stats-card">
            <template #header>
              <div class="card-header">
                <span>在线用户</span>
                <el-tag type="success">实时</el-tag>
              </div>
            </template>
            <div class="card-content">
              <div class="number">{{ stats.onlineUsers }}</div>
              <div class="label">当前在线</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stats-card">
            <template #header>
              <div class="card-header">
                <span>认证用户</span>
              </div>
            </template>
            <div class="card-content">
              <div class="number">{{ stats.totalUsers }}</div>
              <div class="label">总用户数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stats-card">
            <template #header>
              <div class="card-header">
                <span>认证次数</span>
                <el-tag type="info">今日</el-tag>
              </div>
            </template>
            <div class="card-content">
              <div class="number">{{ stats.todayAuths }}</div>
              <div class="label">认证总数</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="charts-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>认证趋势</span>
                <el-radio-group v-model="authChartPeriod" size="small">
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="chart-content">
              <div ref="authChartRef" class="chart"></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>认证类型分布</span>
              </div>
            </template>
            <div class="chart-content">
              <div ref="typeChartRef" class="chart"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const stats = ref({
  onlineUsers: 0,
  totalUsers: 0,
  todayAuths: 0
})

const authChartRef = ref(null)
const typeChartRef = ref(null)
const authChartPeriod = ref('week')

let authChart = null
let typeChart = null

// 定时刷新
let refreshTimer = null

const fetchStats = async () => {
  // TODO: 调用获取统计数据API
  stats.value = {
    onlineUsers: 128,
    totalUsers: 1024,
    todayAuths: 892
  }
}

const initAuthChart = () => {
  if (!authChartRef.value) return
  
  authChart = echarts.init(authChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top: 40,
      right: 20,
      bottom: 20,
      left: 50
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '认证次数',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: '#4e6ef2'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(78,110,242,0.3)' },
              { offset: 1, color: 'rgba(78,110,242,0.1)' }
            ]
          }
        }
      }
    ]
  }
  authChart.setOption(option)
}

const initTypeChart = () => {
  if (!typeChartRef.value) return
  
  typeChart = echarts.init(typeChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        name: '认证类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 735, name: 'AD域认证' },
          { value: 580, name: 'RADIUS认证' }
        ]
      }
    ]
  }
  typeChart.setOption(option)
}

// 监听图表周期变化
watch(authChartPeriod, () => {
  // TODO: 根据周期重新获取数据
  initAuthChart()
})

// 监听窗口大小变化，重绘图表
const handleResize = () => {
  authChart?.resize()
  typeChart?.resize()
}

onMounted(() => {
  fetchStats()
  initAuthChart()
  initTypeChart()
  window.addEventListener('resize', handleResize)
  // 每30秒刷新一次数据
  refreshTimer = setInterval(fetchStats, 30000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  authChart?.dispose()
  typeChart?.dispose()
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped>
.stats-cards {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 20px 0;
}

.number {
  font-size: 36px;
  font-weight: bold;
  color: #4e6ef2;
  line-height: 1;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  color: #666;
}

.chart-card {
  margin-bottom: 24px;
}

.chart {
  height: 300px;
}

:deep(.el-card__header) {
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
}

:deep(.el-card__body) {
  font-size: 24px;
  padding: 0;
}
</style> 