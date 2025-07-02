import axios from 'axios'
import { removeEmptyKey } from '../index'
import { store } from '@/store/index'
import { updateUserInfo, logout, updateSignModel } from '@/store/reducers/user-reducer'
import i18n from '@/utils/i18n'
import {constant} from './constant'

export default function createRequest(options) {
  const instance = axios.create(
    Object.assign(
      {
        baseURL: import.meta.env.VITE_APP_BASE_URL,
        withCredentials: false,
        timeout: 15000,
        header: { 'Content-type': 'application/x-www-form-urlencoded' },
      },
      options,
    ),
  )
  // Request interceptor
  instance.interceptors.request.use((config) => {
    if (['get', 'GET'].includes(config.method)) {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params,
      }
      // config.headers['chainId'] = config.params.chainId ? config.params.chainId : user.chainId || 1
      removeEmptyKey(config.data)
    }

    if (['post', 'POST'].includes(config.method)) {
      // 处理参数为undefined情况
      removeEmptyKey(config.data)
      // 序列化参数
      config.data = JSON.stringify(config.data)
    }
     reqInfo['header']['sign'] = sessionStorage.getItem(constant.tokenKey) || ''
    return config
  })

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => Promise.reject(error),
  )

  const getNewToken = ({ token, refreshToken }) =>
    instance({
      url: '/v1/user/refresh',
      method: 'post',
      data: {
        token,
        refreshToken,
      },
    })

  return async function request(config) {
    try {
      // const { user } = store.getState()
      const appStore = store.useAppStore();
      const res = await instance.request(config)
      // Api code 401 and have token
      if (res && res.code && res.code === '401' && appStore.userInfo?.refreshToken) {
        // Get new token
        const newRes = await getNewToken({
          token: user.userInfo[user.walletAddress]?.token,
          refreshToken: user.userInfo[user.walletAddress]?.refreshToken,
        })
        if (newRes.success) {
          // store.dispatch(
          //   updateUserInfo({
          //     token: newRes.obj,
          //     walletAddress: user.walletAddress,
          //   }),
          // )
          // Re request
          return await instance.request(config)
        } else {
          
          return Promise.reject(401)
        }
      } else {
        if (!res.success) {
          // 0022 单独处理
          // if (res.code != '0022' && res.code != '-1') toast.error(i18n.t(res.code))
        }
        return res || {}
      }
    } catch (error) {
      if (error.response) {
       
      }
      return {}
    }
  }
  // return instance
}
