<template>
    <div class="iframe-wrapper">
        <iframe 
            ref="iframeRef"
            :src="`${baseUrl}?lang=${langMap[i18n.global.locale.value]}&token=${assessToken}`" 
            frameborder="0" 
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms" 
            scrolling="yes"
            class="iframe-content"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
    </div>
</template>

<script setup>
import { store } from '@/store';
import { ref, onMounted, nextTick, onUnmounted, computed } from 'vue';
import { constant } from '@/utils/constant.js';
import { api } from '@/apis';
import { i18n } from '@/utils/i18n';

const appStore = store.useAppStore()
const iframeRef = ref(null)

const langMap = {
    en_US: 'en-us',
    zh_CN: 'zh-cn',
  }

// 定时器相关状态
const countdownTime = ref(0)
const countdownTimer = ref(null)

const baseUrl = import.meta.env.VITE_APP_AI_URL

const assessToken= computed(() => {
  if(appStore.tomeState?.token){
    return appStore.tomeState?.token.split(' ')[1]
  }else{
    return ''
  }
})

// 刷新Token方法
const refreshToken = async () => {
  if(!appStore.tomeState.refreshToken) return
  try {
    const res = await api.refreshToken({
      refreshToken: appStore.tomeState.refreshToken,
    })
    if (res.success) {
      appStore.onUpdateToken('bearer ' + res.obj.accessToken)
      appStore.onUpdateRefreshToken(res.obj.refreshToken)
      console.log('Token刷新成功')
      // Token刷新后重新启动定时器
      initTokenTimer()
    } else {
      console.error('Token刷新失败')
    }
  } catch (error) {
    console.error('Token刷新错误:', error)
  }
}

// 初始化Token定时器
const initTokenTimer = () => {
  // 清除之前的定时器
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
  
  // 获取本地缓存中的updateTokenTime
  const updateTokenTime = localStorage.getItem(constant.updateTokenTime)
  
  if (!updateTokenTime) {
    console.warn('未找到updateTokenTime，无法启动定时器')
    return
  }
  
  const updateTime = parseInt(updateTokenTime)
  const currentTime = new Date().getTime()
  
  // 计算12小时前的时间
  const twelveHoursAgo = updateTime + (12 * 60 * 60 * 1000)
  
  // 比较时间
  if (twelveHoursAgo <= currentTime) {
    // 如果12小时前的时间小于等于当前时间，立即调用refreshToken
    console.log('需要立即刷新Token')
    refreshToken()
  } else {
    // 如果大于当前时间，开始倒计时
    const remainingTime = twelveHoursAgo - currentTime
    countdownTime.value = Math.floor(remainingTime / 1000) // 转换为秒
    
    console.log(`开始倒计时，剩余时间: ${countdownTime.value}秒`)
    
    // 启动倒计时定时器
    countdownTimer.value = setInterval(() => {
      countdownTime.value--
      
      if (countdownTime.value <= 0) {
        // 倒计时结束，调用refreshToken
        clearInterval(countdownTimer.value)
        console.log('倒计时结束，刷新Token')
        refreshToken()
      }
    }, 1000)
  }
}

onMounted(async () => {
  await nextTick()

  console.log('onMounted');
  
  
  // 初始化Token定时器
  initTokenTimer()
  
  if (iframeRef.value) {
    // 监听 iframe 加载完成
    iframeRef.value.onload = () => {
      // 尝试向 iframe 发送消息，让其隐藏自身滚动条
      try {
        iframeRef.value.contentWindow.postMessage({
          type: 'HIDE_SCROLLBAR',
          css: `
            html, body {
              overflow-x: hidden !important;
            }
            body::-webkit-scrollbar {
              display: none !important;
            }
            body {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
          `
        }, '*')
      } catch (e) {
        console.log('跨域限制，无法直接控制 iframe 内部样式')
      }
    }
    
    // 确保 iframe 可以接收鼠标事件
    iframeRef.value.style.pointerEvents = 'auto'
  }
})

// 组件销毁时清除定时器
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
})
</script>

<style scoped>
.iframe-wrapper {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden; /* 隐藏溢出的滚动条 */
}

.iframe-content {
    /* 核心技巧：iframe 比容器宽高各多18px，滚动条被推到可视区域外 */
    width: calc(100% + 18px);
    height: calc(100% + 18px);
    
    /* 基本样式 */
    border: none;
    margin: 0;
    padding: 0;
    display: block;
    
    /* 允许滚动但将滚动条隐藏在可视区域外 */
    position: relative;
    left: 0;
    top: 0;
    
    /* 移动端优化 */
    -webkit-overflow-scrolling: touch;
    
    /* 确保iframe内容可交互 */
    pointer-events: auto;
}

/* 备用方案：如果遮罩方法不工作，使用标准的滚动条隐藏 */
.iframe-content {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
}

.iframe-content::-webkit-scrollbar {
    display: none; /* Webkit browsers */
}

/* 移动设备优化 */
@media (max-width: 768px) {
    .iframe-wrapper {
        height: 100vh;
        width: 100vw;
        -webkit-overflow-scrolling: touch;
    }
    
    .iframe-content {
        width: calc(100% + 20px);
        height: calc(100% + 20px);
    }
}

/* 平板设备优化 */
@media (min-width: 769px) and (max-width: 1024px) {
    .iframe-content {
        width: calc(100% + 16px);
        height: calc(100% + 16px);
    }
}

/* 确保在不同DPI下的兼容性 */
@media (-webkit-min-device-pixel-ratio: 2) {
    .iframe-content {
        width: calc(100% + 15px);
        height: calc(100% + 15px);
    }
}
</style>