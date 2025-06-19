
import * as uniapp from './uni-app'
import {store} from '../store/index'
import {api} from '@/apis'
import {constant} from './constant'
import {t} from './lang/index'
import { blackList } from "@/utils/blackList";
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

export const createRequest = (baseOptions, customOptions = {}) => {
    const http = new uniapp.HttpRequest(baseOptions, customOptions)
    http.setReqInterceptor(async (reqInfo) => {
      if (['get', 'GET'].includes(reqInfo.method)) {
        reqInfo.data = { ...reqInfo.data, _t: new Date().getTime() }
      }
      reqInfo.data = tools.removeObjNilVal(reqInfo.data || {})
      reqInfo['header']['sign'] = sessionStorage.getItem(constant.tokenKey) || ''
      reqInfo['header']['message'] = sessionStorage.getItem(constant.signMessage) || ''
      // reqInfo['header']['language'] = i18n.global.locale.value
      // reqInfo['header']['Accept-Language'] = i18n.global.locale.value
      return reqInfo
    })
  
    http.setResInterceptor(async (res) => {
      return res.data
    })
  
  
    http.req = async (reqInfo, reqConfig) => {
      const shouldShowLoading =
        reqConfig?.showLoading !== undefined ? reqConfig.showLoading : http.customConfig.showLoading
      if (shouldShowLoading) {
        showLoading()
      }
      const appStore = store.useAppStore();
      const flag = blackList.some(
        (item) => item.toLowerCase() == appStore.tomeState.curWalletAddress.toLowerCase()
      );
      if (flag) {
        uniapp.toast(t("thirdIssue.title62"));
        return;
      }
      try {
        
        if (reqInfo.method.toUpperCase() === 'UPLOAD') {
          let res = await http.upload(reqInfo, reqConfig)
          try {
            res = JSON.parse(res)
          } catch (error) {
            console.error(error)
          }
          return Promise.resolve(res)
        } else {
          const res = await http.request(reqInfo, reqConfig)
          // res = JSON.parse(res)
          // console.log('res?.code',res);

          if (res?.code === 401) {
            // console.log('res?.code',res?.code);
            // tokenExpire()
            // let initData = analysisInitData(appStore.tomeState.initData)
            // let initData = appStore.tomeState.userInfo
            // console.log('initData',initData);
            
            // if(WebApp.initData){
            //   initData = analysisInitData(WebApp.initData);
            // }else{
            //   initData = JSON.parse(window.localStorage.getItem("InitDataUser"))
            // }
            // console.log('WebApp',WebApp,'initData',initData);
            
            // let initData = window.localStorage.getItem("InitDataUser");
            // let initData = {
            //   first_name: "suki",
            //   id: 6251035412,
            //   last_name: "T",
            //   username: "ABCABCw"
            // }
            // localStorage.setItem("InitDataUser", JSON.stringify(initData));

            // const loginRes = await api.login({
            //   // account: initData.account,
            //   // username: initData.realName,
            //   // nickname: initData.nickName,
            //   account: initData.id,
            //   username: initData.username,
            //   nickname: initData.first_name,
            //   // inviteCode: "",
            // })
            // const { token } = loginRes.data;
            // appStore.onUpdateToken(token)
            // await appStore.onGetUserInfo()
            const appStore = store.useAppStore();
            await appStore.getSign()
            return await http.request(reqInfo, reqConfig)
            throw 'errp'
          }
          if (res?.code !== 0 && res?.code !== 1012) {
            uniapp.toast(t(res?.code))
          }
          return Promise.resolve(res)
        }
      } catch (error) {
        console.log('error111111',error)
        // const packRes = {}
        // if (res instanceof Error) {
        //   console.error('Frontend code error detected:', { res, config: reqInfo, reqConfig })
        //   packRes['success'] = false
        //   packRes['msg'] = 'Program running error'
        // } else {
        //   console.error('Backend service error detected:', { res, config: reqInfo, reqConfig })
        //   packRes['success'] = false
        //   packRes['msg'] = 'Internal server error'
        //   // if (res?.data?.code === '401') {
        //   //   tokenExpire()
        //   // }
        // }
        // uniapp.toast(packRes.msg)
        return Promise.reject(error)
      } finally {
        if (shouldShowLoading) {
          hideLoading()
        }
      }
    }
  
    return http
  }

  let loadingCount = 0
  const showLoading = () => {
    if (loadingCount === 0) {
      uni.showLoading({ title: '', mask: true })
    }
    loadingCount++
  }
  const hideLoading = () => {
    loadingCount--
    if (loadingCount === 0) {
      uni.hideLoading()
    }
  }