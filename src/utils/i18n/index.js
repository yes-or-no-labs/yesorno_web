import { createI18n } from 'vue-i18n'
import zh_CN from './zh_CN.js'
import en_US from './en_US.js'
import { constant } from '../constant.js'


export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: localStorage.getItem(constant.localeKey) || 'en_US',
    messages: {
      zh_CN,
      en_US,
    },
  })


  export const t = i18n.global.t

  export const onChangeLocale = (i18nKey) => {
    i18n.global.locale.value = i18nKey
    localStorage.setItem(constant.localeKey, i18nKey)
  }