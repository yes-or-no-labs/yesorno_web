export class HttpRequest {
  constructor(baseConfig = {}, customConfig = {}) {
    this.baseConfig = {
      baseURL: '',
      header: {},
      method: 'GET',
      timeout: 15000,
      dataType: 'json',
      responseType: 'text',
      sslVerify: true,
      withCredentials: false,
      firstIpv4: false,
      enableHttp2: false,
      enableQuic: false,
      enableCache: false,
      enableHttpDNS: false,
      httpDNSServiceId: '',
      enableChunked: false,
      forceCellularNetwork: false,
      enableCookie: false,
      cloudCache: false,
      defer: false,
      ...baseConfig,
    }
    this.customConfig = {
      showLoading: true,
      ...customConfig,
    }

    this.interceptors = {
      request: async (reqInfo) => reqInfo,
      response: async (response) => response.data,
    }

    this.setReqInterceptor = (cb) => {
      this.interceptors.request = cb
    }

    this.setResInterceptor = (cb) => {
      this.interceptors.response = cb
    }
    this.req = undefined
  }

  async request(reqInfo, reqConfig) {
    reqInfo = { ...this.baseConfig, ...reqInfo }
    reqInfo.url = this.baseConfig.baseURL + reqInfo.url
    if (this.interceptors.request) {
      try {
        reqInfo = (await this.interceptors.request(reqInfo, reqConfig)) || reqInfo
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return new Promise((resolve, reject) => {
      uni.request({
        ...reqInfo,
        success: async (response) => {
          if (this.interceptors.response) {
            try {
              response = (await this.interceptors.response(response)) || response
            } catch (error) {
              return reject(error)
            }
          }
          resolve(response)
        },
        fail: (error) => {
          reject(error)
        },
      })
    })
  }

  get(url, reqInfo = {}, reqConfig) {
    return this.request({ url, method: 'GET', ...reqInfo }, reqConfig)
  }

  post(url, data, reqInfo = {}, reqConfig) {
    return this.request({ url, method: 'POST', data, ...reqInfo }, reqConfig)
  }

  put(url, data, reqInfo = {}, reqConfig) {
    return this.request({ url, method: 'PUT', data, ...reqInfo }, reqConfig)
  }

  delete(url, reqInfo = {}, reqConfig) {
    return this.request({ url, method: 'DELETE', ...reqInfo }, reqConfig)
  }

  async upload(reqInfo, reqConfig) {
    reqInfo.url = this.baseConfig.baseURL + reqInfo.url
    reqInfo.header = { ...this.baseConfig.header, ...reqInfo.header }
    delete reqInfo.header['content-type']
    delete reqInfo.header['Content-Type']
    if (this.interceptors.request) {
      try {
        reqInfo = (await this.interceptors.request(reqInfo, reqConfig)) || reqInfo
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        ...reqInfo,
        success: async (response) => {
          if (this.interceptors.response) {
            try {
              response = (await this.interceptors.response(response)) || response
            } catch (error) {
              return reject(error)
            }
          }
          resolve(response)
        },
        fail: (error) => {
          reject(error)
        },
      })
    })
  }

  validateStatus(statusCode) {
    return statusCode >= 200 && statusCode < 300
  }
}

export const route = (options) => {
  const { url = '/', type = 'navigateTo', delta = 1, success, fail, complete } = options

  const handleCallback = (result, callback) => {
    if (typeof callback === 'function') callback(result)
  }

  const commonCallback = {
    success: (result) => {
      handleCallback(result, success)
    },
    fail: (e) => {
      handleCallback(e, fail)
    },
    complete: (result) => {
      handleCallback(result, complete)
    },
  }

  if (typeof uni === 'undefined') {
    console.warn('uni object is not defined')
    return
  }

  switch (type) {
    case 'navigateTo':
      uni.navigateTo({ url, ...commonCallback })
      break
    case 'redirectTo':
      uni.redirectTo({ url, ...commonCallback })
      break
    case 'reLaunch':
      uni.reLaunch({ url, ...commonCallback })
      break
    case 'switchTab':
      uni.switchTab({ url, ...commonCallback })
      break
    case 'navigateBack':
      const pages = getCurrentPages()
      if (pages.length > 1 && pages.length > delta) {
        uni.navigateBack({ delta, ...commonCallback })
      } else {
        uni.reLaunch({ url: '/', ...commonCallback })
      }
      break
    default:
      console.warn('Invalid navigation type:', type)
  }
}

/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
let timeout
let flag
export function throttle(func, wait = 2000, immediate = true) {
  if (immediate) {
    if (!flag) {
      flag = true
      // 如果是立即执行，则在wait毫秒内开始时执行
      typeof func === 'function' && func()
      timeout = setTimeout(() => {
        flag = false
      }, wait)
    }
  } else if (!flag) {
    flag = true
    // 如果是非立即执行，则在wait毫秒内的结束处执行
    timeout = setTimeout(() => {
      flag = false
      typeof func === 'function' && func()
    }, wait)
  }
}


export const toast = (msg, { ...options } = {}) =>
  uni.showToast({ icon: 'none', title: msg, duration: 2000, ...options })

export const copy = (value, { msg = '' } = {}) => {
  uni.setClipboardData({
    data: String(value),
    showToast: false,
    complete: () => {
      uni.hideToast()
      if (msg) toast(msg)
    },
  })
}

export const sliceNumber = (value,decimals = 2)=>{
  if (!value && value !== 0) return ''
  
  // 将数值转为字符串并按小数点分割
  const parts = value.toString().split('.')
  
  // 截取小数部分
  const decimal = parts[1].slice(0, decimals)
  // 补齐不足的小数位
  const paddedDecimal = decimal.padEnd(decimals, '0')
  
  return parts[0] + '.' + paddedDecimal
}

export const formatAddress = (addrsss) =>{
  return (
    addrsss.slice(0, 4) +
    "***" +
    addrsss.slice(-4)
  );
}

export const setClipboardData = async (options = {}) => {
  const { showToast = false, ...restOptions } = options
  return await uni.setClipboardData({ showToast, ...restOptions })
}

export const openUrl = (url, { openInCurrentTab = false, openInAppBrowser = true } = {}) => {
  const encodeUrl = encodeURI(decodeURIComponent(url))

  // #ifdef APP-PLUS
  if (openInAppBrowser) {
    plus.runtime.openWeb(encodeUrl)
  } else {
    plus.runtime.openURL(encodeUrl)
  }
  // #endif

  // #ifdef H5
  if (openInCurrentTab) {
    window.open(encodeUrl, '_self')
  } else {
    window.open(encodeUrl, '_blank')
  }
  // #endif
}
