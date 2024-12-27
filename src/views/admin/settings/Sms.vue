<template>
  <div class="sms-settings">
    <div class="page-header">
      <h2>短信网关配置</h2>
    </div>

    <el-card class="settings-card">
      <el-form 
        ref="formRef"
        :model="settings"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="短信网关">
          <el-radio-group v-model="settings.gateway">
            <el-radio label="tencent">腾讯云短信</el-radio>
            <el-radio label="aliyun">阿里云短信</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 腾讯云短信配置 -->
        <template v-if="settings.gateway === 'tencent'">
          <el-form-item label="SecretId" prop="tencent.secretId">
            <el-input 
              v-model="settings.tencent.secretId"
              placeholder="请输入SecretId"
            />
          </el-form-item>
          <el-form-item label="SecretKey" prop="tencent.secretKey">
            <el-input 
              v-model="settings.tencent.secretKey"
              type="password"
              placeholder="请输入SecretKey"
              show-password
            />
          </el-form-item>
          <el-form-item label="SDKAppID" prop="tencent.sdkAppId">
            <el-input 
              v-model="settings.tencent.sdkAppId"
              placeholder="请输入应用ID(SDKAppID)"
            />
            <div class="form-tip">
              在腾讯云短信控制台获取SDKAppID
            </div>
          </el-form-item>
          <el-form-item label="短信签名" prop="tencent.signName">
            <el-input 
              v-model="settings.tencent.signName"
              placeholder="请输入已审核通过的短信签名"
            />
          </el-form-item>
          <el-form-item label="模板ID" prop="tencent.templateId">
            <el-input 
              v-model="settings.tencent.templateId"
              placeholder="请输入模板ID"
            />
            <div class="form-tip">
              模板示例：您的访客验证码为{1}，有效期{2}小时，请勿泄露给他人。
            </div>
          </el-form-item>
        </template>

        <!-- 阿里云短信配置 -->
        <template v-else>
          <el-form-item label="AccessKey ID" prop="aliyun.accessKeyId">
            <el-input 
              v-model="settings.aliyun.accessKeyId"
              placeholder="请输入AccessKey ID"
            />
            <div class="form-tip">
              请前往 <a href="https://ram.console.aliyun.com/users" target="_blank">RAM控制台</a> 获取
            </div>
          </el-form-item>
          <el-form-item label="AccessKey Secret" prop="aliyun.accessKeySecret">
            <el-input 
              v-model="settings.aliyun.accessKeySecret"
              type="password"
              placeholder="请输入AccessKey Secret"
              show-password
            />
            <div class="form-tip">
              如果忘记密钥，请重新创建AccessKey
            </div>
          </el-form-item>
          <el-form-item label="短信签名" prop="aliyun.signName">
            <el-input 
              v-model="settings.aliyun.signName"
              placeholder="请输入短信签名"
            />
            <div class="form-tip">
              必须是已审核通过的短信签名，例如：阿里云
            </div>
          </el-form-item>
          <el-form-item label="模板代码" prop="aliyun.templateCode">
            <el-input 
              v-model="settings.aliyun.templateCode"
              placeholder="请输入模板代码"
            />
            <div class="form-tip">
              必须是已审核通过的模板ID，例如：SMS_15305****
            </div>
          </el-form-item>
          <el-form-item label="模板内容">
            <el-input 
              type="textarea"
              v-model="settings.aliyun.templateContent"
              :rows="3"
              disabled
              placeholder="您的访客验证码为${code}，有效期${expire}小时。如非本人操作，请忽略本短信。"
            />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleTest" 
            :loading="testing"
          >
            测试配置
          </el-button>
          <el-button 
            type="success" 
            @click="handleSave" 
            :loading="saving"
          >
            保存配置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { testSmsConfig } from '@/api/sms'

const formRef = ref(null)
const testing = ref(false)
const saving = ref(false)

const settings = reactive({
  gateway: 'tencent',
  tencent: {
    secretId: '',
    secretKey: '',
    sdkAppId: '',
    signName: '',
    templateId: ''
  },
  aliyun: {
    accessKeyId: '',
    accessKeySecret: '',
    signName: '',
    templateCode: ''
  }
})

const rules = {
  'tencent.secretId': [{ required: true, message: '请输入SecretId' }],
  'tencent.secretKey': [{ required: true, message: '请输入SecretKey' }],
  'tencent.sdkAppId': [{ required: true, message: '请输入SDKAppID' }],
  'tencent.signName': [{ required: true, message: '请输入短信签名' }],
  'tencent.templateId': [{ required: true, message: '请输入模板ID' }],
  'aliyun.accessKeyId': [{ required: true, message: '请输入AccessKey ID' }],
  'aliyun.accessKeySecret': [{ required: true, message: '请输入AccessKey Secret' }],
  'aliyun.signName': [{ required: true, message: '请输入短信签名' }],
  'aliyun.templateCode': [{ required: true, message: '请输入模板代码' }]
}

const handleTest = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  testing.value = true
  try {
    await testSmsConfig({
      gateway: settings.gateway,
      config: settings[settings.gateway]
    })
    ElMessage.success('测试发送成功')
  } catch (error) {
    ElMessage.error('测试失败：' + error.message)
  } finally {
    testing.value = false
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  saving.value = true
  try {
    // TODO: 调用保存配置API
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

.form-tip {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

:deep(.el-form-item) {
  max-width: 500px;
}
</style>