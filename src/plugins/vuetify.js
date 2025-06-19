import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  aliases: {
    VBtnConnect: VBtn,
  },
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
  theme: {
    defaultTheme: 'dark',
  },
  defaults: {
    global: {
      //   ripple: false,
    },
    VBtn: {
      class: 'text-none',
      //   elevation: 4,
      //   prependIcon: '$vuetify',
      style: {
        fontFamily: 'Inter',
      },
    },
    VBtnConnect: {
      color: '#40942C',
      variant: 'flat',
      height: '40px',
      //   class: 'rounded-lg',
      class: 'text-none',
      style: {
        'border-radius': '106px',
      },
    },
  },
})
