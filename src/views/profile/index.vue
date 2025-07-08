<script setup>
import { reactive } from 'vue'
import personImg from '@/assets/img/person.png'

const state = reactive({
  tabList: [
    { title: 'Followers (O)', value: '1' },
    { title: 'Following (0)', value: '2' },
  ],
  tableTabList: [
    { title: 'Positions', value: '1' },
    { title: 'Orders', value: '2' },
    { title: 'Trades', value: '3' },
    { title: 'Resolution', value: '4' },
    { title: 'Balance Log', value: '5' },
  ],
  currentTab: '1',
  currentTableTab:'1',
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
  followersList:[],
  followingList:[]
})
</script>

<template>
  <div class="w-full relative min-h-screen">
    <!-- <img
      src="@/assets/img/leaderboard_bg1.png"
      class="w-full h-[448px] absolute top-0 left-0 object-cover"
    /> -->
    <div class="!pt-[40px] flex gap-[20px] relative w-[90%] mx-auto">
      <div class="flex flex-col gap-[16px]" style="width: calc(100% - 386px);">
        <view class="text-[#fff] font-bold text-[16px]">My Portfolio</view>
        <div class="flex gap-[30px]">
          <div
            class="flex-1 rounded-[14px] !pb-[30px] overflow-hidden relative !p-[16px]"
            style="
              background: linear-gradient(90deg, rgba(109, 221, 37, 0.1) 0%, rgba(10, 180, 90, 0.1) 100%);
            "
          >
            <div class="flex items-center gap-[12px]">
              <!-- <div
                class="bg-[#254684] w-[70px] h-[50px] rounded-tl-[14px] rounded-br-[14px] flex items-center justify-center"
              >
                <img src="@/assets/img/base.png" class="w-[33px] h-[33px]" />
              </div> -->
              <img src="@/assets/img/base.png" class="w-[33px] h-[33px]" />
              <div class="text-[#fff] text-[20px] leading-[20px] font-bold">Base</div>
            </div>
            <div class="!mt-[40px] flex justify-center">
              <div class="flex items-center">
                <div class="flex flex-col gap-[10px] items-center !pr-[40px]">
                  <div class="text-[#7A7A7A] text-[18px] leading-[18px]">PortfoIio</div>
                  <div class="text-[#fff] text-[16px] leading-[16px]">$0.00</div>
                </div>
                <div
                  class="flex flex-col gap-[10px] items-center !px-[40px] border-x border-solid border-[#FFFFFF1A]"
                >
                  <div class="text-[#7A7A7A] text-[18px] leading-[18px]">Profit</div>
                  <div class="text-[#fff] text-[16px] leading-[16px]">$0.00</div>
                </div>
                <div class="flex flex-col gap-[10px] items-center !pl-[40px]">
                  <div class="text-[#7A7A7A] text-[18px] leading-[18px]" style="font-family: din">
                    Volume
                  </div>
                  <div class="text-[#fff] text-[16px] leading-[16px]" style="font-family: din">
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
            class="flex-1 rounded-[14px] !pb-[30px] overflow-hidden relative !p-[16px]"
            style="
              background: linear-gradient(90deg, rgba(109, 221, 37, 0.1) 0%, rgba(10, 180, 90, 0.1) 100%);
            "
          >
            <div class="flex items-center gap-[12px]">
              <!-- <div
                class="bg-[#452480] w-[70px] h-[50px] rounded-tl-[14px] rounded-br-[14px] flex items-center justify-center"
              >
                <img src="@/assets/img/monad.png" class="w-[33px] h-[33px]" />
              </div> -->
              <img src="@/assets/img/monad.png" class="w-[33px] h-[33px]" />
              <div class="text-[#fff] text-[20px] leading-[20px] font-bold">
                Monad Testnet
              </div>
            </div>
            <div class="!mt-[40px] flex justify-center">
              <div class="flex items-center">
                <div class="flex flex-col gap-[10px] items-center !pr-[40px]">
                  <div class="text-[#7A7A7A] text-[18px] leading-[18px]">
                    PortfoIio
                  </div>
                  <div class="text-[#fff] text-[16px] leading-[16px]">
                    $0.00
                  </div>
                </div>
                <div
                  class="flex flex-col gap-[10px] items-center !px-[40px] border-x border-solid border-[#FFFFFF1A]"
                >
                  <div class="text-[#7A7A7A] text-[18px] leading-[18px]">
                    Profit
                  </div>
                  <div class="text-[#fff] text-[16px] leading-[16px]">
                    $0.00
                  </div>
                </div>
                <div class="flex flex-col gap-[10px] items-center !pl-[40px]">
                  <div class="text-[#7A7A7A] text-[18px] leading-[18px]">
                    Volume
                  </div>
                  <div class="text-[#fff] text-[16px] leading-[16px]">
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
        <div class=" border border-solid !border-[#FFFFFF80] rounded-[6px]">
          <v-tabs
            v-model="state.currentTableTab"
            align-tabs="left"
            color="#0AB45A"
            height="60"
          >
            <v-tab :value="item.value" v-for="item in state.tableTabList" style="font-size: 16px">
              <span style="font-family: din">{{ item.title }}</span></v-tab
            >
          </v-tabs>
           <v-tabs-window v-model="state.currentTableTab">
            <v-tabs-window-item value="1">
              <div class="h-[640px] overflow-x-auto" style="scrollbar-width: auto;">
                <!-- table header -->
                <div class="flex items-center w-full sticky top-0 left-0 bg-[#000]">
                    <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]">Outcome</div>
                    <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]">Shares</div>
                    <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]">Close Date</div>
                    <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]">Est Avg Price</div>
                    <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]">Current Value</div>
                    <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]">Unrealized P&L</div>
                    <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]">Trading Token</div>
                </div>
                <!-- table body -->
                <div class="flex flex-col w-full" v-for="item in 10">
                  <div class="!px-[8px] !pt-[8px] !pb-[2px] text-[14px] text-[#CECFD2]  underline">
                    <span class="cursor-pointer">Israel x Hamas ceasefire by July 15?</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-[180px] min-w-[180px] text-[14px] text-[#6DDD25] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]">Yes</div>
                   <div class="w-[180px] min-w-[180px] text-[14px] text-[#6DDD25] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]">1.2</div>
                   <div class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]">1.2</div>
                   <div class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]">1.2</div>
                   <div class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]">1.2</div>
                   <div class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]">1.2</div>
                   <div class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]">USDO</div>
                  </div>
                   
                </div>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </div>

      <div
        class="w-[386px] min-w-[386px] h-[880px] !mt-[40px] bg-[#000] border border-solid !border-[#FFFFFF80] rounded-[6px] overflow-hidden"
      >
        <div class="">
          <v-tabs
            v-model="state.currentTab"
            fixed-tabs
            align-tabs="center"
            color="#0AB45A"
            height="60"
          >
            <v-tab :value="item.value" v-for="item in state.tabList" style="font-size: 16px">
              <span>{{ item.title }}</span></v-tab
            >
          </v-tabs>
          <v-tabs-window v-model="state.currentTab">
            <v-tabs-window-item value="1">
              <div class="w-full h-[640px] overflow-y-auto !px-[16px] !pb-[16px]">
                <div class="!py-[10px] border-b border-solid border-[#384250] flex items-center gap-[12px]" v-for="item in 10" :key="item">
                    <img :src="personImg" class="w-[32px] h-[32px] rounded-full cursor-pointer" />
                    <div class="text-[14px] text-[#94969c] cursor-pointer">123123</div>
                </div>
              </div>
            </v-tabs-window-item>
            <v-tabs-window-item value="2">
              <div class="w-full h-[640px] overflow-y-auto !px-[16px] !pb-[16px]">
                <div class="!py-[10px] border-b border-solid border-[#384250] flex items-center gap-[12px]" v-for="item in 10" :key="item">
                    <img :src="personImg" class="w-[32px] h-[32px] rounded-full cursor-pointer" />
                    <div class="text-[14px] text-[#94969c] cursor-pointer">123123</div>
                </div>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </div>
    </div>
  </div>
</template>
