/**
 * Vue自定义指令集合
 */

import { truncateDecimals } from './filters'

/**
 * 数字滚动动画指令
 * 
 * 使用方式:
 * v-number-roll="{ value: 100.5678, duration: 2000, decimals: 4 }"
 * v-number-roll="{ value: dynamicValue }"
 * 
 * 参数:
 * - value: 目标数值 (必需)
 * - duration: 动画持续时间(毫秒), 默认2000
 * - decimals: 小数位数, 默认4
 * - startValue: 起始值, 默认0
 */
const vNumberRoll = {
  mounted(el, binding) {
    // 初始化元素属性
    el._numberRoll = {
      currentValue: 0,
      animationId: null,
      lastTargetValue: null
    }
    
    // 执行动画
    updateNumberRoll(el, binding)
  },
  
  updated(el, binding) {
    // 只有当value改变时才重新执行动画
    const { value } = binding.value || {}
    if (value !== el._numberRoll.lastTargetValue) {
      updateNumberRoll(el, binding)
    }
  },
  
  unmounted(el) {
    // 清理动画
    if (el._numberRoll && el._numberRoll.animationId) {
      cancelAnimationFrame(el._numberRoll.animationId)
    }
  }
}

/**
 * 更新数字滚动动画
 * @param {HTMLElement} el - 目标元素
 * @param {Object} binding - Vue指令绑定对象
 */
function updateNumberRoll(el, binding) {
  const options = binding.value || {}
  const {
    value: targetValue = 0,
    duration = 1000,
    decimals = 2,
    startValue = 0,
    suffix = '',
    prefix = ''
  } = options
  
  // 清除之前的动画
  if (el._numberRoll.animationId) {
    cancelAnimationFrame(el._numberRoll.animationId)
  }
  
  // 记录目标值
  el._numberRoll.lastTargetValue = targetValue
  
  // 如果目标值为0或者没有变化，直接设置
  if (targetValue === 0 || targetValue === el._numberRoll.currentValue) {
    el._numberRoll.currentValue = targetValue
    el.textContent = prefix + formatNumber(targetValue, decimals) + suffix
    return
  }
  
  const startTime = performance.now()
  const startVal = startValue
  const valueRange = targetValue - startVal
  
  const animate = (currentTime) => {
    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    
    // 使用easeOutCubic缓动函数
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    
    const currentValue = startVal + valueRange * easeOutCubic
    el._numberRoll.currentValue = currentValue
    
    // 更新元素显示内容
    el.textContent = prefix + formatNumber(currentValue, decimals) + suffix
    
    if (progress < 1) {
      el._numberRoll.animationId = requestAnimationFrame(animate)
    } else {
      el._numberRoll.animationId = null
    }
  }
  
  el._numberRoll.animationId = requestAnimationFrame(animate)
}

/**
 * 格式化数字
 * @param {number} num - 要格式化的数字
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的数字字符串
 */
function formatNumber(num, decimals) {
  return truncateDecimals(num, decimals)
}

/**
 * 文字打字机效果指令
 * 
 * 使用方式:
 * v-typewriter="{ text: 'Hello World', speed: 100 }"
 * 
 * 参数:
 * - text: 要显示的文本 (必需)
 * - speed: 打字速度(毫秒), 默认100
 * - cursor: 是否显示光标, 默认false
 */
const vTypewriter = {
  mounted(el, binding) {
    el._typewriter = {
      timerId: null,
      currentIndex: 0
    }
    
    updateTypewriter(el, binding)
  },
  
  updated(el, binding) {
    const { text } = binding.value || {}
    if (text !== el._typewriter.lastText) {
      updateTypewriter(el, binding)
    }
  },
  
  unmounted(el) {
    if (el._typewriter && el._typewriter.timerId) {
      clearTimeout(el._typewriter.timerId)
    }
  }
}

/**
 * 更新打字机效果
 * @param {HTMLElement} el - 目标元素
 * @param {Object} binding - Vue指令绑定对象
 */
function updateTypewriter(el, binding) {
  const options = binding.value || {}
  const {
    text = '',
    speed = 100,
    cursor = false
  } = options
  
  // 清除之前的定时器
  if (el._typewriter.timerId) {
    clearTimeout(el._typewriter.timerId)
  }
  
  // 重置状态
  el._typewriter.currentIndex = 0
  el._typewriter.lastText = text
  el.textContent = ''
  
  const typeNextChar = () => {
    if (el._typewriter.currentIndex < text.length) {
      el.textContent = text.substring(0, el._typewriter.currentIndex + 1)
      if (cursor && el._typewriter.currentIndex === text.length - 1) {
        el.textContent += '|'
      }
      el._typewriter.currentIndex++
      el._typewriter.timerId = setTimeout(typeNextChar, speed)
    }
  }
  
  typeNextChar()
}

// 导出所有指令
export const directives = {
  'number-roll': vNumberRoll,
  'typewriter': vTypewriter
}

// 默认导出（用于单独导入某个指令）
export default {
  vNumberRoll,
  vTypewriter
}
