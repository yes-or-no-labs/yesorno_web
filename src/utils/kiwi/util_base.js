import { ethers } from 'ethers'
import * as lodash from 'lodash'

export const isValidUrl = (urlString) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ) // validate fragment locator
  return !!urlPattern.test(urlString)
}

export const formatAddress = (str = '', prefixLength = 6, suffixLength = 4) => {
  const regex = new RegExp(`(.{${prefixLength}}).*(.{${suffixLength}})`)
  return str.replace(regex, '$1...$2')
}

export const sleep = (timeout) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })

export const formatUnits = (number,decimal = 18) =>{
    return ethers.formatUnits(number, decimal)
  }

/**
 * 移除对象中的空值
 * @param {Object} obj - 对象
 * @param {{ removeEmpty?: boolean, removeNil?: boolean, mutate?: boolean }} [options={}] - 配置项
 * @returns {Object} 处理后的对象
 */
// @ts-ignore
export const cleanObject = (obj, options = {}) => {
  const { removeEmpty = false, removeNil = true, mutate = false } = options

  const shouldRemove = (value) => {
    if (removeNil && lodash.isNil(value)) return true
    if (removeEmpty && value === '') return true
    return false
  }

  const cleaner = (object) => {
    return lodash.transform(object, (result, value, key) => {
      if (shouldRemove(value)) {
        return
      }

      if (lodash.isObjectLike(value)) {
        value = cleaner(value)
      }

      if (lodash.isObjectLike(value) && lodash.isEmpty(value)) {
        return
      }

      result[key] = value
    })
  }

  return mutate ? cleaner(obj) : cleaner(lodash.cloneDeep(obj))
}

export const evmGetAmountInSmallestUnit = (amount, decimals) => {
  if (decimals === 0) {
    return BigInt(Math.floor(Number(amount)))
  }
  const minUnit = 1 / Math.pow(10, decimals)

  if (amount < minUnit) {
    return 0n
  }
  return ethers.parseUnits(String(amount), decimals)
}

// handle upload input decimals
export const isPrecisionExceed = (num, n) => {
  var parts = num.toString().split('.')
  var integerPart = parts[0]
  var decimalPart = parts[1] || ''
  return decimalPart.length > n
}
