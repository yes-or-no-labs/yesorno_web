import { createI18n } from 'vue-i18n'
import zh_CN from './zh_CN.js'
import en_US from './en_US.js'
import ja_JP from './ja_JP.js'
import ko_KR from './ko_KR.js'
import ms_MY from './ms_MY.js'
import th_TH from './th_TH.js'
import vi_VN from './vi_VN.js'
import zh_TW from './zh_TW.js'
// import { constant } from '../../store/index.js'


export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: uni.getStorageSync('pRdZnEhGWWbvmkMaAhMa') || 'en_US',
    messages: {
      zh_CN,
      en_US,
      ja_JP,
      ko_KR,
      ms_MY,
      th_TH,
      vi_VN,
      zh_TW
    },
  })


  export const t = i18n.global.t

  export const onChangeLocale = (i18nKey) => {
    i18n.global.locale.value = i18nKey
    uni.setStorageSync('pRdZnEhGWWbvmkMaAhMa', i18nKey)
  }