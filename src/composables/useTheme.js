import { ref, computed, watchEffect } from 'vue'

// 主题类型定义
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
}

// 主题存储key
const THEME_STORAGE_KEY = 'user-theme-preference'

// 创建主题管理 composable
export function useTheme() {
  // 从localStorage获取保存的主题，如果没有则默认为暗色主题
  const getStoredTheme = () => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored || THEMES.DARK
  }

  // 响应式主题状态
  const currentTheme = ref(getStoredTheme())

  // 计算属性：是否为暗色主题
  const isDark = computed(() => currentTheme.value === THEMES.DARK)

  // 计算属性：是否为亮色主题
  const isLight = computed(() => currentTheme.value === THEMES.LIGHT)

  // 切换主题函数
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    setTheme(currentTheme.value)
  }

  // 设置主题函数
  const setTheme = (theme) => {
    currentTheme.value = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyTheme(theme)
  }

  // 应用主题到DOM - 简化版本，只需要切换根元素的class
  const applyTheme = (theme) => {
    const html = document.documentElement
    
    if (theme === THEMES.DARK) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 初始化主题
  const initTheme = () => {
    applyTheme(currentTheme.value)
  }

  // 监听主题变化并应用
  watchEffect(() => {
    applyTheme(currentTheme.value)
  })

  return {
    currentTheme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
    initTheme,
    THEMES
  }
}
