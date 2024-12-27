<template>
  <div class="basic-settings">
    <div class="page-header">
      <h2>基本设置</h2>
    </div>

    <el-card class="settings-card">
      <el-form 
        ref="formRef"
        :model="settings"
        label-width="120px"
      >
        <!-- 系统设置 -->
        <div class="settings-section">
          <h3>系统信息</h3>
          <el-form-item label="系统名称">
            <el-input 
              v-model="settings.systemName"
              placeholder="请输入系统名称"
            />
          </el-form-item>
          <el-form-item label="系统Logo">
            <el-upload
              class="logo-uploader"
              action="/api/settings/upload-logo"
              :show-file-list="false"
              :on-success="handleLogoSuccess"
              :before-upload="beforeLogoUpload"
            >
              <img v-if="settings.logo" :src="settings.logo" class="logo" />
              <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="form-tip">建议尺寸: 200x60px，支持 PNG、JPG 格式</div>
          </el-form-item>
        </div>

        <!-- 访客设置 -->
        <div class="settings-section">
          <h3>访客设置</h3>
          <el-form-item label="访客码有效期">
            <el-input-number 
              v-model="settings.visitorCodeExpireHours"
              :min="1"
              :max="72"
            />
            <span class="unit">小时</span>
          </el-form-item>
          <el-form-item label="最大使用次数">
            <el-input-number 
              v-model="settings.visitorCodeMaxUseCount"
              :min="1"
              :max="10"
            />
            <span class="unit">次</span>
          </el-form-item>
        </div>

        <!-- 安全设置 -->
        <div class="settings-section">
          <h3>安全设置</h3>
          <el-form-item label="密码最小长度">
            <el-input-number 
              v-model="settings.passwordMinLength"
              :min="6"
              :max="20"
            />
            <span class="unit">位</span>
          </el-form-item>
          <el-form-item label="登录失败锁定">
            <el-input-number 
              v-model="settings.loginFailLockCount"
              :min="3"
              :max="10"
            />
            <span class="unit">次</span>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSave"
            :loading="saving"
          >
            保存设置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const formRef = ref(null)
const saving = ref(false)

const settings = reactive({
  systemName: 'XXX公司WiFi认证系统',
  logo: '/wifi-logo.png',
  visitorCodeExpireHours: 24,
  visitorCodeMaxUseCount: 3,
  passwordMinLength: 8,
  loginFailLockCount: 5
})

const handleLogoSuccess = (res) => {
  settings.logo = res.url
  ElMessage.success('Logo上传成功')
}

const beforeLogoUpload = (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('Logo只能是JPG或PNG格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超过2MB!')
    return false
  }
  return true
}

const handleSave = async () => {
  if (!formRef.value) return
  
  saving.value = true
  try {
    // TODO: 调���保存设置API
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.settings-card {
  margin-top: 24px;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section h3 {
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.logo-uploader {
  width: 200px;
  height: 60px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.logo-uploader:hover {
  border-color: #409EFF;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.logo {
  width: 200px;
  height: 60px;
  display: block;
  object-fit: contain;
}

.unit {
  margin-left: 8px;
  color: #666;
}

.form-tip {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

:deep(.el-input-number) {
  width: 120px;
}
</style> 