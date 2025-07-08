
// const appStore = store.useAppStore();
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