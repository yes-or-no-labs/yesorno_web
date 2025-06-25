<script setup>
import { reactive } from 'vue'
import { formatAddress } from '@/utils/uni-app.js'

const state = reactive({
  tabList: [
    { title: 'Tasks', value: '1' },
    { title: 'Points History', value: '2' },
  ],
  currentTab: '1',
  dataList: [
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      usdc: '1000',
    },
    {
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      usdc: '800',
    },
    {
      address: '0x7890abcdef1234567890abcdef12345678901234',
      usdc: '600',
    },
    {
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      usdc: '800',
    },
    {
      address: '0x7890abcdef1234567890abcdef12345678901234',
      usdc: '600',
    },
  ],
})

function filterStyle(index) {
  if (index === 0) {
    return 'color:#FFB700'
  } else if (index === 1) {
    return 'color:#A8842A'
  } else if (index === 2) {
    return 'color:#825A33'
  } else {
    return 'color:#fff;width:40px'
  }
}
</script>

<template>
  <div class="w-full bg-[#103582] relative">
    <img
      src="@/assets/img/leaderboard_bg1.png"
      class="w-full h-[448px] absolute top-0 left-0 object-cover"
    />
    <div class="relative !py-[100px] mx-auto w-[600px]">
      <div class="text-[24px] font-[500] leading-[24px] text-[#fff]">Task center</div>
      <div
        class="!mt-[20px] w-full rounded-[16px] bg-[#000] !px-[25px] !py-[15px] flex items-center justify-between"
      >
        <div class="flex flex-col gap-[10px]">
          <div class="text-[#666666] text-[14px] leading-[14px]">My Points</div>
          <div class="text-[#fff] text-[24px] leading-[24px]">0.00</div>
        </div>
        <div class="flex flex-col gap-[10px]">
          <div class="text-[#666666] text-[14px] leading-[14px]">Points Earned Today</div>
          <div class="text-[#9DC425] text-[24px] leading-[24px] text-right">0.00</div>
        </div>
      </div>
      <div
        class="!my-[15px] w-full rounded-[16px] bg-[#509C54] !px-[25px] !py-[15px] text-center text-[#fff] text-[18px] leading-[18px]"
      >
        Sign up and log in with Backpack to claim an extra 200 $USDO
      </div>
      <div class="w-full rounded-[16px] bg-[#000] h-[800px] overflow-hidden">
        <v-tabs v-model="state.currentTab" fixed-tabs align-tabs="center" color="#CCFA15" height="60">
          <v-tab :value="item.value" v-for="item in state.tabList" style="font-size: 16px">{{
            item.title
          }}</v-tab>
        </v-tabs>
        <v-tabs-window v-model="state.currentTab">
          <v-tabs-window-item value="1">
            <div class="!px-[20px] !py-[30px] flex flex-col gap-[50px]">
              <div>
                <div class="text-[#fff] text-[14px] leading-[14px]">Daily Task</div>
                <div
                  class="!mt-[10px] w-full rounded-[10px] border border-solid border-[#464646] bg-[#1B1A1F] !p-[16px] flex justify-between items-center"
                >
                  <div class="flex items-center gap-[20px]">
                    <img src="@/assets/img/task_bg1.png" class="w-[37px] h-[37px]" />
                    <div class="flex flex-col gap-[10px]">
                      <div class="text-[#fff] text-[14px] leading-[14px]">Trade 1 time per day</div>
                      <div class="text-[#666666] text-[14px] leading-[14px]">
                        <span class="text-[#CCFA15] mr-[5px]">50</span>
                        Points
                      </div>
                    </div>
                  </div>
                  <VBtn
                    class="!rounded-full !h-[40px] !bg-[#9DC425] !text-[14px] !leading-[14px] !text-[#000] !w-[85px]"
                    variant="flat"
                  >
                    Claim
                  </VBtn>
                </div>
              </div>
              <div>
                <div class="text-[#fff] text-[14px] leading-[14px]">Social Task</div>
                <div
                  class="!mt-[10px] w-full rounded-[10px] border border-solid border-[#464646] bg-[#1B1A1F] !p-[16px] flex justify-between items-center"
                >
                  <div class="flex items-center gap-[20px]">
                    <img src="@/assets/img/task_bg1.png" class="w-[37px] h-[37px]" />
                    <div class="flex flex-col gap-[10px]">
                      <div class="text-[#fff] text-[14px] leading-[14px]">Trade 1 time per day</div>
                      <div class="text-[#666666] text-[14px] leading-[14px]">
                        <span class="text-[#CCFA15] mr-[5px]">50</span>
                        Points
                      </div>
                    </div>
                  </div>
                  <VBtn
                    class="!rounded-full !h-[40px] !bg-[#9DC425] !text-[14px] !leading-[14px] !text-[#000] !w-[85px]"
                    variant="flat"
                  >
                    Go
                  </VBtn>
                </div>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #463eac 0%, #ea8c3b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-family: darker;
}
</style>
