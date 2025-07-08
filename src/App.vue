<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Header from '@/components/Header/index.vue'
import { computed, onMounted } from 'vue'
import { store } from "@/store";
import FooterSecond from '@/components/FooterSecond/index.vue'

const router = useRouter()

// console.log('router', router.currentRoute.value)

const includePaths = ['/market', '/marketDetail','/leaderboard','/task','/profile']

const currenRoutePath = computed(() => {
  // console.log('currenRoutePath', router.currentRoute.value)

  return router.currentRoute.value.fullPath
})

onMounted(() => {
  const appStore = store.useAppStore();
  appStore.addEip6963AnnounceListen();
  appStore.requestEip6963Providers();
  appStore.evmConnectWallet(true);
})
</script>

<template>
  <div class="bg-[#000]">
    <Header v-if="currenRoutePath!=='/login'" />
    <div class="max-w-[1440px] mx-auto">
      <RouterView />
    </div>
    <FooterSecond v-if="currenRoutePath!=='/login'"/>
  </div>
</template>

<style scoped></style>
