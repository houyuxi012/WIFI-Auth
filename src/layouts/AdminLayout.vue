<template>
  <div class="admin-layout">
    <el-aside class="sidebar" width="240px">
      <div class="logo">
        <img src="/wifi-logo.png" alt="Logo">
      </div>
      <el-menu
        :default-active="route.path"
        class="menu"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><Monitor /></el-icon>
          <span>控制台</span>
        </el-menu-item>
        <el-menu-item index="/admin/monitor">
          <el-icon><DataLine /></el-icon>
          <span>系统监控</span>
        </el-menu-item>
        <el-sub-menu index="/admin/users">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/admin/users/system">
            <el-icon><UserFilled /></el-icon>
            <span>系统用户</span>
          </el-menu-item>
          <el-menu-item index="/admin/users/auth">
            <el-icon><Avatar /></el-icon>
            <span>认证用户</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/admin/visitors">
          <el-icon><Tickets /></el-icon>
          <span>访客管理</span>
        </el-menu-item>
        <el-sub-menu index="/admin/auth-source">
          <template #title>
            <el-icon><Connection /></el-icon>
            <span>认证身份源</span>
          </template>
          <el-menu-item index="/admin/auth-source/list">
            <el-icon><List /></el-icon>
            <span>身份源管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/auth-source/ad">
            <el-icon><Monitor /></el-icon>
            <span>Windows AD</span>
          </el-menu-item>
          <el-menu-item index="/admin/auth-source/radius">
            <el-icon><Share /></el-icon>
            <span>RADIUS</span>
          </el-menu-item>
          <el-menu-item index="/admin/auth-source/oauth">
            <el-icon><Key /></el-icon>
            <span>OAuth2.0</span>
          </el-menu-item>
          <el-menu-item index="/admin/auth-source/cas">
            <el-icon><Lock /></el-icon>
            <span>CAS</span>
          </el-menu-item>
          <el-menu-item index="/admin/auth-source/wework">
            <el-icon><Platform /></el-icon>
            <span>企业微信</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/admin/logs">
          <el-icon><Document /></el-icon>
          <span>认证日志</span>
        </el-menu-item>
        <el-sub-menu index="/admin/settings">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/admin/settings/basic">
            <el-icon><Tools /></el-icon>
            <span>基本设置</span>
          </el-menu-item>
          <el-menu-item index="/admin/settings/sms">
            <el-icon><Message /></el-icon>
            <span>短信网关</span>
          </el-menu-item>
          <el-menu-item index="/admin/settings/syslog">
            <el-icon><Document /></el-icon>
            <span>日志外发</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    
    <el-container class="main-content">
      <el-header class="header" height="64px">
        <div class="breadcrumb">
          <el-breadcrumb>
            <el-breadcrumb-item>后台管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPath }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="user-info">
          <span>管理员</span>
          <el-button type="danger" plain size="small" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            退出
          </el-button>
        </div>
      </el-header>
      
      <el-main class="content">
        <router-view></router-view>
      </el-main>
      
      <el-footer class="footer" height="50px">
        <div class="footer-content">
          © 2024 Houyuxi Inc
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Monitor,
  DataLine,
  User,
  UserFilled,
  Avatar,
  Tickets,
  Connection,
  Setting,
  SwitchButton,
  Document,
  Tools,
  Message,
  List,
  Share,
  Key,
  Lock,
  Platform
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const currentPath = computed(() => {
  const pathMap = {
    dashboard: '控制台',
    users: '用户管理',
    visitors: '访客管理',
    settings: '系统设置'
  }
  return pathMap[route.name] || ''
})

const handleLogout = () => {
  // TODO: 实现登出逻辑
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.logo img {
  width: 120px;
  height: auto;
}

.menu {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #f5f7fa;
}

.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logout-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  border-color: #4e6ef2;
  color: #4e6ef2;
}

.footer {
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  color: #666;
  font-size: 14px;
}

.content {
  flex: 1;
  padding: 24px;
  min-height: calc(100vh - 114px); /* 114px = header height + footer height */
}
</style> 