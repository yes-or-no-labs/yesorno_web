<template>
  <div class="pdf-container">
    <!-- 控制栏 -->
    <div class="pdf-controls">
      <button @click="prevPage" :disabled="currentPage <= 1">上一页</button>
      <span>第 {{ currentPage }} 页 / 共 {{ pageCount }} 页</span>
      <button @click="nextPage" :disabled="currentPage >= pageCount">下一页</button>
      <input 
        type="range" 
        :min="1" 
        :max="100" 
        @input="updateZoom"
        v-model.number="zoomLevel"
      >
      <span>{{ zoomLevel }}</span>
    </div>
    <!-- PDF 查看器 -->
    <vue-pdf-embed
      :source="pdfSource"
      :page="currentPage"
      @rendered="handlePdfRendered"
      @error="handlePdfError"
      ref="pdfRef"
      class="pdf-viewer"
        :style="scale"
    />

    
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'
import auditReport from '@/assets/audit-report.pdf'

// const props = defineProps({
//   pdfUrl: {
//     type: String,
//     required: true
//   }
// })

const state = reactive({
    scale:1
})

// 响应式数据
const pdfSource = ref(auditReport)
const currentPage = ref(1)
const pageCount = ref(0)
const zoomLevel = ref(100)
const pdfRef = ref(null)

const scale = computed(() => `transform:scale(${state.scale})`);

// 方法
const nextPage = () => {
  if (currentPage.value < pageCount.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const updateZoom = () => {
    state.scale = zoomLevel.value / 100
}

const handlePdfRendered = () => {
  // PDF 渲染完成后的回调
  console.log('PDF 渲染完成')
}

const handlePdfError = (error) => {
  console.error('PDF 加载错误:', error)
}

// 初始化
onMounted(async () => {
  try {
    // 如果你需要获取总页数，可以使用 pdf-lib
    const { PDFDocument } = await import('pdf-lib')
    const arrayBuffer = await fetch(pdfSource.value).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    pageCount.value = pdfDoc.getPageCount()
  } catch (error) {
    console.error('获取PDF信息失败:', error)
  }
})
</script>

<style scoped>
.pdf-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

.pdf-viewer {
  /* flex-grow: 1; */
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.pdf-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input[type="range"] {
  width: 150px;
}
</style>