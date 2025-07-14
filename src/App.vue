<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Header from '@/components/Header/index.vue'
import { computed, onMounted, reactive } from 'vue'
import { store } from '@/store'
import FooterSecond from '@/components/FooterSecond/index.vue'
import Tabbar from '@/components/Tabbar/index.vue'

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
    <Tabbar/>
  </div>
</template>

<style scoped></style>
