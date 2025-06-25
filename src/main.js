import './assets/main.css'
import WOW from 'wow.js'
import 'animate.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import vuetifyConfig from './plugins/vuetify'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from './App.vue'
import router from './router'

const app = createApp(App)

new WOW({
  boxClass: 'wow', // 类名，在用户滚动时显示隐藏的框。
  animateClass: 'animate__animated', // 触发CSS动画的类名称（animate.css库默认为“ animated”）
  offset: 0, // 定义浏览器视口底部与隐藏框顶部之间的距离。当用户滚动并到达此距离时，隐藏的框会显示出来。
  mobile: true, // 在移动设备上打开/关闭WOW.js。
  live: true, // 在页面上同时检查新的WOW元素。
}).init()

const vuetify = createVuetify({
  components,
  directives,
})

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(vuetifyConfig)
app.use(Toast, {
  timeout: 3000,          // 默认 3s 后消失
  position: 'top-center',  // 位置：top-right | top-center | top-left | bottom-right | ...
  closeOnClick: true,     // 点击关闭
  pauseOnHover: true,     // 悬停暂停
  draggable: true,        // 可拖动
  draggablePercent: 0.6,  // 拖动多少百分比才关闭
  closeButton: false,
});

app.mount('#app')
