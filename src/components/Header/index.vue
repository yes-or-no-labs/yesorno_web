<script setup>
const menuList = [
  { title: 'Twitter', link: 'https://twitter.com/YesornoFun' },
  { title: 'Telegram', link: 'https://t.me/yesorno_fun' },
  { title: 'Discord', link: 'https://discord.gg/yesorno' },
]
</script>

<template>
  <div class="w-full h-[80px] bg-[#002548] fixed top-0 left-0 z-[999]">
    <div
      class="max-w-[1440px] mx-auto flex items-center justify-between px-[58px] h-full gap-[70px]"
    >
      <div class="flex items-center gap-[25px] h-full">
        <div class="flex items-center gap-[40px] cursor-pointer" @click="$router.push('/')">
          <img src="@/assets/img/logo.png" mode="scaleToFill" class="w-[90px] h-[90px]" />
          <div class="flex flex-col gap-[5px]">
            <div class="text-[#fff] text-[24px] leading-[24px]">Yesorno.Fun</div>
            <div class="text-[#81F963] text-[15px] leading-[15px]">Beta V1</div>
          </div>
        </div>
        <div
          class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Inter-Italic"
          @click="$router.push('/market')"
        >
          Market
        </div>
        <div
          class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Inter-Italic"
        >
          Tasks
        </div>
        <div
          class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Inter-Italic"
        >
          Leaderboard
        </div>
        <v-menu transition="scale-transition" :offset="[10, 0]">
          <template v-slot:activator="{ props }">
            <div
              class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
              v-bind="props"
              style="font-family: Inter-Italic"
            >
              Social Media
              <v-icon icon="mdi-menu-down" />
            </div>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in menuList" :key="index" :value="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <div
          class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Inter-Italic"
        >
          Discord
        </div>
      </div>
      <div class="flex items-center gap-[45px] h-full">
        <div class="flex flex-col items-center gap-[5px]">
          <div class="text-[#fff] text-[13px] leading-[13px]" style="font-family: Inter">
            My ponts
          </div>
          <div class="text-[#81F963] text-[20px] leading-[20px]" style="font-family: din">0.00</div>
        </div>
        <div class="flex flex-col items-center gap-[5px]">
          <div class="text-[#fff] text-[13px] leading-[13px]" style="font-family: Inter">
            My Porttollo
          </div>
          <div class="text-[#81F963] text-[20px] leading-[20px]" style="font-family: din">
            $0.00
          </div>
        </div>
        <div class="flex flex-col items-center gap-[5px]">
          <div class="text-[#fff] text-[13px] leading-[13px]" style="font-family: Inter">
            Balance
          </div>
          <div class="text-[#81F963] text-[20px] leading-[20px]" style="font-family: din">
            $0.00
          </div>
        </div>
        <VBtnConnect class="rounded-[106px]"> Connect Wallet </VBtnConnect>
      </div>
    </div>
  </div>
  <div class="w-full h-[80px]"></div>
</template>
