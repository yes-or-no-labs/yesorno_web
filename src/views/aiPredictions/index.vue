<template>
    <div class="iframe-wrapper">
        <iframe 
            ref="iframeRef"
            :src="`https://ai-dev.yesornolabs.xyz?token=${appStore.tomeState.token}`" 
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
import { ref, onMounted, nextTick } from 'vue';

const appStore = store.useAppStore()
const iframeRef = ref(null)

onMounted(async () => {
  await nextTick()
  
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