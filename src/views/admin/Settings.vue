<template>
  <div class="settings">
    <div class="page-header">
      <h2>系统设置</h2>
    </div>
    
    <div class="settings-container">
      <div class="settings-section">
        <h3>基本设置</h3>
        <div class="form-group">
          <label>系统名称</label>
          <input type="text" v-model="settings.systemName">
        </div>
        <div class="form-group">
          <label>Logo</label>
          <div class="upload-box">
            <img v-if="settings.logo" :src="settings.logo" alt="Logo">
            <button class="upload-btn">上传Logo</button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3>访客设置</h3>
        <div class="form-group">
          <label>访客码有效期（小时）</label>
          <input type="number" v-model="settings.visitorCodeExpireHours">
        </div>
        <div class="form-group">
          <label>访客码最大使用次数</label>
          <input type="number" v-model="settings.visitorCodeMaxUseCount">
        </div>
        <div class="form-group">
          <label>短信网关</label>
          <el-radio-group v-model="settings.smsGateway">
            <el-radio label="aliyun">阿里云短信</el-radio>
            <el-radio label="tencent">腾讯云短信</el-radio>
          </el-radio-group>
        </div>
        
        <!-- 阿里云短信配置 -->
        <div v-if="settings.smsGateway === 'aliyun'" class="gateway-config">
          <div class="form-group">
            <label>AccessKey ID</label>
            <el-input v-model="settings.aliyun.accessKeyId" placeholder="请输入AccessKey ID" />
          </div>
          <div class="form-group">
            <label>AccessKey Secret</label>
            <el-input v-model="settings.aliyun.accessKeySecret" type="password" placeholder="请输入AccessKey Secret" />
          </div>
          <div class="form-group">
            <label>短信签名</label>
            <el-input v-model="settings.aliyun.signName" placeholder="请输入短信签名" />
          </div>
          <div class="form-group">
            <label>模板代码</label>
            <el-input v-model="settings.aliyun.templateCode" placeholder="请输入模板代码" />
          </div>
        </div>
        
        <!-- 腾讯云短信配置 -->
        <div v-if="settings.smsGateway === 'tencent'" class="gateway-config">
          <div class="form-group">
            <label>SecretId</label>
            <el-input v-model="settings.tencent.secretId" placeholder="请输入SecretId" />
          </div>
          <div class="form-group">
            <label>SecretKey</label>
            <el-input v-model="settings.tencent.secretKey" type="password" placeholder="请输入SecretKey" />
          </div>
          <div class="form-group">
            <label>应用ID(SDKAppID)</label>
            <el-input v-model="settings.tencent.sdkAppId" placeholder="请输入应用ID" />
          </div>
          <div class="form-group">
            <label>短信签名</label>
            <el-input v-model="settings.tencent.signName" placeholder="请输入短信签名" />
          </div>
          <div class="form-group">
            <label>模板ID</label>
            <el-input v-model="settings.tencent.templateId" placeholder="请输入模板ID" />
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3>安全设置</h3>
        <div class="form-group">
          <label>密码最小长度</label>
          <input type="number" v-model="settings.passwordMinLength">
        </div>
        <div class="form-group">
          <label>登录失败锁定次数</label>
          <input type="number" v-model="settings.loginFailLockCount">
        </div>
      </div>

      <div class="form-actions">
        <button class="save-btn" @click="handleSave">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const settings = reactive({
  systemName: 'XXX公司WiFi认证系统',
  logo: '/wifi-logo.png',
  visitorCodeExpireHours: 24,
  visitorCodeMaxUseCount: 3,
  passwordMinLength: 8,
  loginFailLockCount: 5,
  adEnabled: false,
  adServer: '',
  adDomain: '',
  adAdmin: '',
  adPassword: '',
  radiusEnabled: false,
  radiusServer: '',
  radiusAuthPort: 1812,
  radiusSecret: ''
})

const handleSave = () => {
  // TODO: 实现保存设置逻辑
}
</script>

<style scoped>
.settings-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
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

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group input:focus {
  outline: none;
  border-color: #4e6ef2;
  box-shadow: 0 0 0 2px rgba(78, 110, 242, 0.2);
}

.upload-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-box img {
  width: 120px;
  height: auto;
}

.upload-btn {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.save-btn {
  padding: 8px 24px;
  background: #4e6ef2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  background: #4058d9;
}

.auth-servers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.auth-server-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h4 {
  margin: 0;
  color: #2c3e50;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4e6ef2;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style> 