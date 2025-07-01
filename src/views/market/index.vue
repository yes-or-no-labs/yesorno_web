<script setup>
import { reactive } from 'vue'
import Footer from '@/components/Footer/index.vue'

const state = reactive({
  menuList: [
    { title: 'Trending', id: 1 },
    { title: 'New', id: 2 },
    { title: 'Crypto', id: 3 },
    { title: 'Business', id: 4 },
    { title: 'Politics', id: 5 },
    { title: 'Sports', id: 6 },
    { title: 'Culture', id: 7 },
  ],
  searchInputLoading: false,
  progress: 50 / 2,
  progressValue: 50,
})
</script>

<template>
  <div class="w-full min-h-screen !pb-[100px]">
    <div class="w-full h-[58px] flex items-center justify-between !px-[35px]">
      <div class="flex items-center gap-[35px]">
        <div
          class="text-[15px] text-[#fff] cursor-pointer"
          style="font-family: Inter"
          v-for="item in state.menuList"
          :key="item.id"
        >
          {{ item.title }}
        </div>
      </div>
      <div class="flex items-center gap-[8px]">
        <div class="flex items-center bg-[#708D11] !rounded-[5px] overflow-hidden">
          <v-text-field
            :loading="state.searchInputLoading"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="solo"
            hide-details
            single-line
            class="w-[150px] h-[40px]"
            bg-color="rgba(255, 255, 255, 0.16)"
          >
          </v-text-field>
          <VBtn
            class="!rounded-r-[5px] !rounded-l-[0px] !h-[40px] !bg-[#708D11] !text-[14px] !leading-[14px]"
            variant="flat"
          >
            Search
          </VBtn>
        </div>
        <VBtn
          class="!h-[40px] !bg-[#1A1A1A] !text-[14px] !leading-[14px]"
          variant="flat"
          style="color: rgba(255, 255, 255, 0.49)"
        >
          Create New Market
          <template #append>
            <div class="relative w-[36px] h-[36px]">
              <div class="absolute top-[-5px] left-0">
                <img src="@/assets/img/flag.png" class="w-[36px] h-[36px]" />
              </div>
            </div>
          </template>
        </VBtn>
      </div>
    </div>
    <div>
      <img src="@/assets/img/market_bg1.png" class="w-full h-[448px] object-cover" />
    </div>
    <div class="w-full grid grid-cols-3 gap-[20px] !mt-[20px] !px-[38px]">
      <div
        class="h-[270px] rounded-[20px] bg-[#1B1B1B] !px-[25px] !py-[15px] cursor-pointer boxItem"
        v-for="item in 10"
        :key="item"
        @click="$router.push('/marketDetail')"
      >
        <div class="flex justify-between items-center">
          <div
            class="!py-[5px] !px-[8px] border border-solid border-[#2B7B84] rounded-[4px] text-[#2B7B84] text-[12px] leading-[12px]"
          >
            Trending
          </div>
          <div>
            <v-btn icon="mdi-dots-horizontal" variant="text"></v-btn>
          </div>
        </div>
        <div class="flex justify-between items-center !mt-[15px]">
          <div class="flex items-center gap-[20px]">
            <img
              src="https://pub-e95d6af5130d4cb8a791802809e31727.r2.dev/0x18f63f20eead237c83ff75bb7bd2028006fef79d/0xa7e5f55d2381a2cc7c4e709d01603d0c79706746a54d7452006285d9a692eba3"
              class="w-[58px] h-[58px] rounded-[8px]"
            />
            <div class="flex flex-col gap-[5px]">
              <div
                class="text-[#fff] text-[16px] font-bold leading-[20px]"
                style="font-family: 'Inter'"
              >
                GTA VI released before June 2026?
              </div>
              <div class="text-[#787878] text-[14px] leading-[14px]" style="font-family: 'Inter'">
                Trending
              </div>
            </div>
          </div>
          <div class="relative">
            <v-progress-circular
              :model-value="state.progress"
              :rotate="-90"
              :size="100"
              :width="10"
              color="#A2D00C"
              class="semi-circle-progress"
            >
              <div
                class="text-[#fff] text-[20px] font-bold absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-90%]"
              >
                {{ state.progressValue }}%
              </div>
            </v-progress-circular>
          </div>
        </div>
        <div class="!mt-[25px] flex items-center gap-[10px]">
          <div
            class="flex-1 rounded-l-[10px] !py-[12px] !pl-[23px] flex flex-col gap-[5px] cursor-pointer"
            style="background: rgba(255, 255, 255, 0.05)"
            v-ripple
            @click.stop="()=> console.log('Yes clicked')"
          >
            <div class="text-[#A2D00C] text-[20px] leading-[20px]" style="font-family: Inter">
              Yes
            </div>
            <div class="text-[#787878] text-[14px] leading-[14px]" style="font-family: Inter">
              8492.00
            </div>
          </div>
          <div
            class="flex-1 rounded-r-[10px] !py-[12px] !pl-[23px] flex flex-col gap-[5px] cursor-pointer"
            style="background: rgba(255, 255, 255, 0.05)"
            v-ripple
             @click.stop="()=> console.log('No clicked')"
          >
            <div class="text-[#5D2FE7] text-[20px] leading-[20px]" style="font-family: Inter">
              No
            </div>
            <div class="text-[#787878] text-[14px] leading-[14px]" style="font-family: Inter">
              8492.00
            </div>
          </div>
        </div>
        <div class="!px-[20px] !mt-[10px] flex items-center justify-between">
          <div class="text-[16px] text-[#787878]">RTG:85127848.00</div>
          <!-- <v-icon icon="mdi-star-outline" size="20" class="cursor-pointer" /> -->
          <img src="@/assets/img/star.png" class="w-[20px] h-[20px] cursor-pointer">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.semi-circle-progress {
  clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%);
  margin-bottom: -50px; /* 调整位置 */
}

.boxItem:hover {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(0, 0, 0, 0.05);
  background-color: rgba(27, 27, 27, .8);
  translate: 0px -1px;
}
</style>
