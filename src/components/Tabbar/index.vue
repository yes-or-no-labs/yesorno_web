<script setup>
import tab1Img from '@/assets/img/tab1.png'
import tab2Img from '@/assets/img/tab2.png'
import tab3Img from '@/assets/img/tab3.png'
import tab4Img from '@/assets/img/tab4.png'
import tab5Img from '@/assets/img/tab5.png'
import tab1_select from '@/assets/img/tab1_select.png'
import tab2_select from '@/assets/img/tab2_select.png'
import tab3_select from '@/assets/img/tab3_select.png'
import tab4_select from '@/assets/img/tab4_select.png'
import tab5_select from '@/assets/img/tab5_select.png'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import WebApp from '@twa-dev/sdk'

const tabList = [
  {
    icon: tab1Img,
    selectIcon: tab1_select,
    name: 'Home',
    path: '/',
  },
  // {
  //   icon: tab2Img,
  //   selectIcon: tab2_select,
  //   name: 'Market',
  //   path: '/market',
  // },
  {
    icon: tab2Img,
    selectIcon: tab2_select,
    name: 'AI',
    path: '/ai_predictions',
  },
  {
    icon: tab3Img,
    selectIcon: tab3_select,
    name: 'Tasks',
    path: '/task',
  },
  {
    icon: tab4Img,
    selectIcon: tab4_select,
    name: 'Ranking',
    path: '/leaderboard',
  },
  // {
  //   icon: tab5Img,
  //   selectIcon: tab5_select,
  //   name: 'User',
  //   path: '/profile',
  // },
  {
    icon: tab5Img,
    selectIcon: tab5_select,
    name: 'User',
    path: '/setting',
  },
]

const router = useRouter()

const currenRoutePath = computed(() => {
  // console.log('currenRoutePath', router.currentRoute.value)

  return router.currentRoute.value.fullPath
})

function handleClickTap(item) {
  WebApp?.ready()
  WebApp?.HapticFeedback?.impactOccurred('light') // 轻微震动
  router.push(item.path)
}
</script>

<template>
  <div
    class="fixed bottom-0 left-0 lg:hidden flex items-center justify-between border-t border-solid border-[#FFFFFF80] w-full bg-[#000] z-10"
  >
    <div
      class="flex flex-col items-center flex-1 !py-[10px]"
      v-for="(item, index) in tabList"
      :key="index"
      v-ripple
      @click="handleClickTap(item)"
    >
      <img
        :src="currenRoutePath === item.path ? item.selectIcon : item.icon"
        class="w-[18px] h-[18px]"
        alt=""
      />
      <div
        class="text-[#A7A7A7] text-[14px]"
        :style="currenRoutePath === item.path ? 'color:#6DDD25' : ''"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
  <div class="w-full h-[60px] block lg:hidden"></div>
</template>
