// const appStore = store.useAppStore();
import dayjs from 'dayjs'

const isNil = (value) => value === null || value === undefined
const isObjectLike = (value) => value && typeof value === 'object' && !Array.isArray(value)
export const tools = {
  removeObjNilVal: (obj) => {
    const removeNil = (currentObj) => {
      const result = Array.isArray(currentObj) ? [] : {}
      for (const [key, value] of Object.entries(currentObj)) {
        if (!isNil(value)) {
          if (isObjectLike(value)) {
            result[key] = removeNil(value)
          } else {
            result[key] = value
          }
        }
      }
      return result
    }

    return removeNil(obj)
  },
  executeOnceAtATime: (func) => {
    let isExecuting = false
    return function () {
      if (isExecuting) {
        return function () {}
      }
      isExecuting = true
      const context = this
      const args = arguments
      return func.apply(context, args).finally(() => {
        isExecuting = false
      })
    }
  },
  formatNumber: (value, decimalPlaces = 2, options = { useScientificNotation: false }) => {
    // const regex = /^-?\d*\.?\d*(e[+-]?\d+)?$/i
    // if (typeof value !== 'string' || !regex.test(value)) {
    //   return new Decimal(0).toFixed(decimalPlaces)
    // }
    let decimalValue
    try {
      decimalValue = new Decimal(value)
    } catch (error) {
      return new Decimal(0).toFixed(decimalPlaces)
    }
    if (decimalValue.isNaN()) {
      return new Decimal(0).toFixed(decimalPlaces)
    }
    if (!options.useScientificNotation && decimalValue.toExponential().indexOf('e') !== -1) {
      return decimalValue.toFixed(decimalPlaces)
    }
    return decimalValue.toDecimalPlaces(decimalPlaces).toString()
  },
}

export function removeEmptyKey(obj = {}) {
  // 处理参数为undefined情况
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      delete obj[key]
    }
  }
  return obj
}

export function formatRelativeTime(date) {
  const now = dayjs()
  const target = dayjs(date)
  const diffSeconds = now.diff(target, 'second')
  const diffMinutes = now.diff(target, 'minute')
  const diffHours = now.diff(target, 'hour')
  const diffDays = now.diff(target, 'day')
  const diffMonths = now.diff(target, 'month')
  const diffYears = now.diff(target, 'year')

  if (diffSeconds < 10) return 'Just now'
  if (diffSeconds < 60) return `${diffSeconds}s ago`
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffMonths === 1) return '1 month ago'
  if (diffMonths < 12) return `${diffMonths} months ago`
  if (diffYears === 1) return '1 year ago'
  return `${diffYears} years ago`
}

export const truncateDecimals = (value, decimals = 2) => {
  if (!value && value !== 0) return ''
  if(Number(value) === 0) return '0.00'
  // 将数值转为字符串并按小数点分割
  const parts = value.toString().split('.')
  if (parts.length === 1) return numeral(value).format('0,0')
  // 截取小数部分
  const decimal = parts[1].slice(0, decimals)
  // 补齐不足的小数位
  const paddedDecimal = decimal.padEnd(decimals, '0')
  
  return parts[0] + '.' + paddedDecimal
}
