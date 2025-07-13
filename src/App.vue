<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Header from '@/components/Header/index.vue'
import { computed, onMounted, reactive } from 'vue'
import { store } from '@/store'
import FooterSecond from '@/components/FooterSecond/index.vue'

const router = useRouter()

// console.log('router', router.currentRoute.value)

const includePaths = ['/market', '/marketDetail', '/leaderboard', '/task', '/profile']

const currenRoutePath = computed(() => {
  // console.log('currenRoutePath', router.currentRoute.value)

  return router.currentRoute.value.fullPath
})

const state = reactive({
  curTabIndex:0,
})

onMounted(() => {
  const appStore = store.useAppStore()
  appStore.addEip6963AnnounceListen()
  appStore.requestEip6963Providers()
  appStore.evmConnectWallet(true)
})
</script>

<template>
  <div class="bg-[#000]">
    <Header v-if="currenRoutePath !== '/login'" />
    <div class="max-w-[1440px] mx-auto">
      <RouterView />
    </div>
    <FooterSecond v-if="currenRoutePath !== '/login'" />
    <!-- <div class="fixed bottom-0 left-0 lg:hidden flex items-center justify-between !px-[20px] border-t border-solid border-[#FFFFFF80]">
      <div class="flex flex-col gap-[5px] items-center">
        <img src="" class="w-[18px] h-[18px]" alt="">
        <div class="text-[#A7A7A7] text-[14px]">Home</div>
      </div>
    </div> -->
  </div>
</template>

<style scoped></style>
