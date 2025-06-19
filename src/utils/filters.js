import numeral from 'numeral'

// 创建截断小数的函数
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
  
  return numeral(parts[0]).format('0,0') + '.' + paddedDecimal
}

// Vue全局方法
export const setupGlobalFilters = (app) => {
  // 金额格式化
  app.config.globalProperties.$formatAmount = (value, decimals = 2) => {
    return truncateDecimals(value, decimals)
  }
}