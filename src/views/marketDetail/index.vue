<script setup>
import { onMounted, reactive, ref } from 'vue'


import Footer from '@/components/Footer/index.vue'
import exchange from './components/exchange.vue'
import handicap from './components/handicap.vue'
import chart from './components/chart.vue'
import comment from './components/comment.vue'

const state = reactive({
  timeLine: [
    { title: '1D', id: 1 },
    { title: '1W', id: 2 },
    { title: '1M', id: 3 },
    { title: 'ALL', id: 4 },
  ],
  selectTimeLine: 1,
})


</script>

<template>
  <div class="w-full !pb-[40px]">
    <!-- <div>
      <img src="@/assets/img/market_bg1.png" class="w-full !h-[127px] object-cover" />
    </div> -->
    <div class="!mt-[16px]">
      <div class="flex gap-[13px]">
        <div class="flex-[0.7] rounded-[25px] bg-[#1B1B1B] !px-[30px] !py-[36px]">
          <div class="flex items-center gap-[24px] flex-1">
            <img
              src="https://pub-e95d6af5130d4cb8a791802809e31727.r2.dev/0x18f63f20eead237c83ff75bb7bd2028006fef79d/0xa7e5f55d2381a2cc7c4e709d01603d0c79706746a54d7452006285d9a692eba3"
              class="w-[134px] h-[134px] rounded-[10px]"
            />
            <div class="flex flex-col justify-between !pt-[15px] h-[134px] flex-1">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-[66px]">
                  <div
                    class="text-[14px] text-[#787878] leading-[14px]"
                    style="font-family: inter-bold"
                  >
                    0.597625 SOL trades
                  </div>
                  <div
                    class="text-[14px] text-[#787878] leading-[14px]"
                    style="font-family: inter-bold"
                  >
                    Expires: Sun, 15 Jun 2025 17:00
                  </div>
                </div>
                <img src="@/assets/img/star.png" class="w-[24px] h-[24px] cursor-pointer" />
              </div>

              <div class="text-[24px] text-[#fff] leading-[24px]" style="font-family: inter-bold">
                Will $LUNA break 0.02 in price in a week?
              </div>
              <div class="flex">
                <div
                  class="!py-[5px] !px-[20px] border border-solid !border-[#2B7B84] rounded-[4px] text-[#2B7B84] text-[12px] leading-[12px] inline-block"
                  style="font-family: inter-bold"
                >
                  Trending
                </div>
              </div>
            </div>
          </div>
          <div class="!mt-[30px] flex items-center gap-[30px]">
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                trades
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50%
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                trades
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50%
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                trades
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50%
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                trades
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50%
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                trades
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50%
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                trades
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50%
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                trades
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50%
              </div>
            </div>
          </div>
          <div class="!mt-[28px] !pt-[23px] " style="border-top: 1px solid rgba(255, 255, 255, 0.1)">
            <div class="flex items-center gap-[16px]">
              <img src="@/assets/img/conChart.png" class="w-[24px] h-[24px]" />
              <div class="flex items-center gap-[4px]">
                <div
                  class="flex text-[14px] !py-[4px] !px-[10px] h-[32px] leading-[20px] rounded-[8px] items-center text-[#CECFD2] cursor-pointer"
                  :style="
                    state.selectTimeLine == item.id
                      ? `font-family: inter-bold;color:#CCFA15;border:1px solid rgb(51, 55, 65);background:rgb(19, 19, 22);`
                      : `font-family: inter-bold;`
                  "
                  v-for="item in state.timeLine"
                  :key="item.id"
                  @click="state.selectTimeLine = item.id"
                >
                  {{ item.title }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-[16px]">
              <chart/>
              <handicap/>
            </div>
          </div>
        </div>
        <div
          class="flex-[0.3] rounded-[25px] bg-[#1B1B1B] !p-[16px] overflow-hidden"
          style="border: 1px solid rgba(135, 135, 135, 0.2)"
        >
          <exchange/>
        </div>
      </div>
      <comment/>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
