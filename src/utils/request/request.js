import axios from 'axios'
import { removeEmptyKey } from '../index'
import { store } from '@/store/index'
import {constant} from '../constant'
import { useToast } from "vue-toastification";
import { api } from '@/apis';

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
    // console.log('request',config);
    
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
      // config.data = JSON.stringify(config.data)
    }
    // console.log('request',localStorage.getItem(constant.tokenKey));
    
     config.headers['Authorization'] = localStorage.getItem(constant.tokenKey) || ''
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
      const toast = useToast();

      
      // Api code 401 and have token
      if (res && res.code && res.code === '401') {
        // Get new token
        const newRes = await api.refreshToken({
          refreshToken:appStore.tomeState.refreshToken
        })
        if (newRes.success) {
          appStore.onUpdateToken('bearer '+res.obj.accessToken)
          appStore.onUpdateRefreshToken('bearer '+res.obj.refreshToken)
          // Re request
          return await instance.request(config)
        } else {
          return Promise.reject(401)
        }
        // toast.error('')
        // appStore.onDisConnectClick()
        // return res || {}
      } else if(res && res.code && res.code == '0945'){
        appStore.onDisConnectClick()
        return res || {}
      } else {
        return res || {}
      }
    } catch (error) {
      console.log('request error',error);
    }
  }
  // return instance
}
