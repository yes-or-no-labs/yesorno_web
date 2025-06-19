<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Header from '@/components/Header/index.vue'
import { computed } from 'vue'

const router = useRouter()

// console.log('router', router.currentRoute.value)

const currenRoutePath = computed(() => {
  console.log('currenRoutePath', router.currentRoute.value)

  return router.currentRoute.value.fullPath
})
</script>

<template>
  <div :class="currenRoutePath == '/market' ? 'bg-[#103582]' : 'bg-[#000]'">
    <Header />
    <div class="max-w-[1440px] mx-auto">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
