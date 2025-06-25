<script setup>
import { reactive } from 'vue'

const state = reactive({
  tabList: [
    { title: 'Followers (O)', value: '1' },
    { title: 'Following (0)', value: '2' },
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
</script>

<template>
  <div class="w-full bg-[#103582] relative min-h-screen">
    <img
      src="@/assets/img/leaderboard_bg1.png"
      class="w-full h-[448px] absolute top-0 left-0 object-cover"
    />
    <div class="!pt-[40px] flex gap-[20px] relative w-[90%] mx-auto">
      <div class="flex-[0.7] flex flex-col gap-[20px]">
        <div class="!py-[30px] rounded-[20px] bg-[#000]">
          <div class="text-[#fff] text-[24px] leading-[24px] !px-[40px]" style="font-family: din">
            My Profile
          </div>
          <div class="!mt-[20px] flex items-center justify-between !px-[40px]">
            <div class="flex items-center gap-[10px]">
              <img src="@/assets/img/profile.png" class="w-[68px] h-[68px] rounded-full" />
              <div class="text-[20px] leading-[20px] text-[#666]" style="font-family: din">asd</div>
            </div>
            <VBtn
              class="!rounded-full !h-[50px] !bg-[#CCFA15] !text-[20px] !leading-[20px] !text-[#000]"
              variant="flat"
            >
              ConnectXAccount
            </VBtn>
          </div>
          <div class="w-full h-[48px] bg-[#0F1012] !mt-[40px]"></div>
          <div class="!mt-[30px] flex justify-end !px-[40px]">
            <VBtn
              class="!rounded-full !h-[30px] !bg-[#000] !text-[14px] !leading-[14px] !text-[#fff]"
              variant="flat"
              style="border: 1px solid #fff"
            >
              Edit ProfiIe
            </VBtn>
          </div>
        </div>
        <div class="flex gap-[30px]">
          <div
            class="flex-1 rounded-[14px] bg-[#3c5b96] !pt-[2px] !pl-[2px] !pb-[40px] overflow-hidden relative"
          >
            <div class="flex items-center gap-[12px]">
              <div
                class="bg-[#254684] w-[70px] h-[50px] rounded-tl-[14px] rounded-br-[14px] flex items-center justify-center"
              >
                <img src="@/assets/img/base.png" class="w-[33px] h-[33px]" />
              </div>
              <div class="text-[#fff] text-[20px] leading-[20px]" style="font-family: din">
                Base
              </div>
            </div>
            <div class="!mt-[40px] flex justify-center">
              <div class="flex items-center">
                <div class="flex flex-col gap-[10px] items-center !pr-[40px]">
                  <div class="text-[#BABBBD] text-[18px] leading-[18px]" style="font-family: din">
                    PortfoIio
                  </div>
                  <div class="text-[#BABBBD] text-[16px] leading-[16px]" style="font-family: din">
                    $0.00
                  </div>
                </div>
                <div
                  class="flex flex-col gap-[10px] items-center !px-[40px] border-x border-solid border-[#FFFFFF1A]"
                >
                  <div class="text-[#BABBBD] text-[18px] leading-[18px]" style="font-family: din">
                    Profit
                  </div>
                  <div class="text-[#BABBBD] text-[16px] leading-[16px]" style="font-family: din">
                    $0.00
                  </div>
                </div>
                <div class="flex flex-col gap-[10px] items-center !pl-[40px]">
                  <div class="text-[#BABBBD] text-[18px] leading-[18px]" style="font-family: din">
                    Volume
                  </div>
                  <div class="text-[#BABBBD] text-[16px] leading-[16px]" style="font-family: din">
                    $0.00
                  </div>
                </div>
              </div>
            </div>
            <img
              src="@/assets/img/base_bg.png"
              class="w-[82px] h-[82px] absolute top-[-10px] right-[-10px] object-cover rotate-z-[10deg]"
            />
          </div>
          <div
            class="flex-1 rounded-[14px] bg-[#5d3c96] !pt-[2px] !pl-[2px] !pb-[40px] overflow-hidden relative"
          >
            <div class="flex items-center gap-[12px]">
              <div
                class="bg-[#452480] w-[70px] h-[50px] rounded-tl-[14px] rounded-br-[14px] flex items-center justify-center"
              >
                <img src="@/assets/img/monad.png" class="w-[33px] h-[33px]" />
              </div>
              <div class="text-[#fff] text-[20px] leading-[20px]" style="font-family: din">
                Monad Testnet
              </div>
            </div>
            <div class="!mt-[40px] flex justify-center">
              <div class="flex items-center">
                <div class="flex flex-col gap-[10px] items-center !pr-[40px]">
                  <div class="text-[#BABBBD] text-[18px] leading-[18px]" style="font-family: din">
                    PortfoIio
                  </div>
                  <div class="text-[#BABBBD] text-[16px] leading-[16px]" style="font-family: din">
                    $0.00
                  </div>
                </div>
                <div
                  class="flex flex-col gap-[10px] items-center !px-[40px] border-x border-solid border-[#FFFFFF1A]"
                >
                  <div class="text-[#BABBBD] text-[18px] leading-[18px]" style="font-family: din">
                    Profit
                  </div>
                  <div class="text-[#BABBBD] text-[16px] leading-[16px]" style="font-family: din">
                    $0.00
                  </div>
                </div>
                <div class="flex flex-col gap-[10px] items-center !pl-[40px]">
                  <div class="text-[#BABBBD] text-[18px] leading-[18px]" style="font-family: din">
                    Volume
                  </div>
                  <div class="text-[#BABBBD] text-[16px] leading-[16px]" style="font-family: din">
                    $0.00
                  </div>
                </div>
              </div>
            </div>
            <img
              src="@/assets/img/monad_bg.png"
              class="w-[82px] h-[82px] absolute top-[-10px] right-[-10px] object-cover rotate-z-[10deg]"
            />
          </div>
        </div>
      </div>

      <div class="flex-[0.3] h-[700px] bg-[#000] rounded-[20px] overflow-hidden">
        <div class="bg-[#FFFFFF0F]">
          <v-tabs
            v-model="state.currentTab"
            fixed-tabs
            align-tabs="center"
            color="#CCFA15"
            height="60"
          >
            <v-tab :value="item.value" v-for="item in state.tabList" style="font-size: 16px">
              <span style="font-family: din">{{ item.title }}</span></v-tab
            >
          </v-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
