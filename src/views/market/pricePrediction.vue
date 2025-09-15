<script setup>
import AiComponent from '@/components/Ai/index.vue'
import tvChart from '@/components/Charting/TVChartView.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import { useWindowResize } from '@/hooks/useWindowResize'
import Segmented from '@/components/Segmented/index.vue'
import NP from 'number-precision'

import 'swiper/css/free-mode'
import { reactive, ref, onMounted, computed, watch, onUnmounted } from 'vue'
import pricePrediction_icon1 from '@/assets/img/pricePrediction_icon1.png'
import pricePrediction_icon2 from '@/assets/img/pricePrediction_icon2.png'
import pricePrediction_icon3 from '@/assets/img/pricePrediction_icon3.png'
import pricePrediction_icon4 from '@/assets/img/pricePrediction_icon4.png'
import pricePrediction_select1 from '@/assets/img/pricePrediction_select1.png'
import pricePrediction_select2 from '@/assets/img/pricePrediction_select2.png'
import pricePrediction_select3 from '@/assets/img/pricePrediction_select3.png'
import pricePrediction_select4 from '@/assets/img/pricePrediction_select4.png'
import { useRouter } from 'vue-router'
import PriceMarketAbi from '@/abi/PriceMarket.json'
import { store } from '@/store'
import network from '@/utils/network'
import { api } from '@/apis'
import item_later from './component/item_later.vue'
import item_locked from './component/item_locked.vue'
import item_started from './component/item_started.vue'
import item_timeout from './component/item_timeout.vue'
import item_ended from './component/item_ended.vue'
import { ethers } from 'ethers'
import { useToast } from 'vue-toastification'

const state = reactive({
  curTabIndex: 0,
  tabList: [
    { title: 'TradingView chart' },
    // { title: 'AI Prediction' }
  ],
  currentPrice: 0,
  menuList: [],
  selectSymbolIndex: 0,
  tabbarList: [
    { icon: pricePrediction_icon1, selectIcon: pricePrediction_select1, value: 1 },
    { icon: pricePrediction_icon2, selectIcon: pricePrediction_select2, value: 2 },
    // { icon: pricePrediction_icon3, selectIcon: pricePrediction_select3, value: 3 },
    { icon: pricePrediction_icon4, selectIcon: pricePrediction_select4, value: 4 },
  ],
  currentTab: 1,
  // tabList: [
  //   { title: 'Event Prediction', value: '1', path: '/market' },
  //   { title: 'Price Prediction', value: '2', path: '/market_pricePrediction' },
  // ],
  currentFirstTab: '1',
  priceMarketContract: null,
  roundsList: [],
  blockInfo: null,
  timer: null,
  timeCount: 0,
  roundsTimer: null,
  showDrawer: false,
  tabList1: [
    { title: 'Rounds', value: '1' },
    { title: 'PNL', value: '2' },
  ],
  typeOfHistory: '',
  betHistoryList:[],
  isProcessing:false
})

const segmentedRef = ref(null)
const appStore = store.useAppStore()

const toast = useToast()

onMounted(async () => {
  getAssetEvents()
  getRounds()
  getBlockInfo()
  await initControlContract()
})

state.roundsTimer = setInterval(() => {
  getRounds()
}, 2000)

onUnmounted(() => {
  if (state.roundsTimer) {
    clearInterval(state.roundsTimer)
  }
})

watch(()=>state.showDrawer,()=>{
  if(state.showDrawer){
    getPredictionHistory()
  }
})

watch(()=>state.typeOfHistory,()=>{
  getPredictionHistory()
})

const swiperInstance = ref(null)

const router = useRouter()

const itemLockedRef = ref(null)

const currenRoutePath = computed(() => {
  // console.log('currenRoutePath', router.currentRoute.value)

  return router.currentRoute.value.fullPath
})

const formatTime = computed(() => {
  if (state.timeCount == 0) return '00:00'
  const minute = Math.floor(state.timeCount / 60)
  const second = Math.floor(state.timeCount % 60)
  return `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
})

// watch(
//   () => state.currentFirstTab,
//   (newVal) => {
//     const index = state.tabList.findIndex((item) => item.value == newVal)
//     if (currenRoutePath.value !== state.tabList[index].path) {
//       router.push(state.tabList[index].path)
//     }
//   },
// )

watch(
  () => [state.roundsList],
  () => {
    if (state.timer) {
      clearInterval(state.timer)
    }
    // const now = state.blockInfo?.timestamp
    const now = Math.floor(new Date().getTime() / 1000)
    for (const item of state.roundsList) {
      if (item.status == 'started') {
        // console.log('started', item.lockTimestamp, now)
        if (item.lockTimestamp < now) {
          state.timeCount = 0
          return
        }

        const diff = item.lockTimestamp - now
        state.timeCount = diff
        state.timer = setInterval(() => {
          state.timeCount--
          if (state.timeCount == 0) {
            clearInterval(state.timer)
          }
        }, 1000)
      }
    }
  },
)

const onSwiper = (swiper) => {
  swiperInstance.value = swiper
  // swiperInstance.value.disable()
}

function getCurrentPrice(e) {
  // console.log('getCurrentPrice', e);
  state.currentPrice = e.price
}

async function getPredictionHistory() {
  const res = await api.getPredictionHistory({
    chainId: import.meta.env.VITE_APP_CHAIN,
    userAddress: appStore.tomeState.curWalletAddress,
    claimed:state.typeOfHistory
  })
  console.log('getPredictionHistory', res)
  if(res.success){
    state.betHistoryList = res.obj.result
  }
}

async function handleClickClaim(item) {
  try {
    item.isProcessing = true
    const res = await state.priceMarketContract.claim(item.assetId, [item.roundId])
    console.log('handleClickClaim', res)
    await res.wait()
    toast.success('Claim Success')
    getPredictionHistory()
  } catch (error) {
    console.error('handleClickClaim', error)
  } finally {
    item.isProcessing = false
  }
}

async function initControlContract() {
  state.priceMarketContract = await appStore.initErc20ContractSign(
    network[import.meta.env.VITE_APP_CHAIN].priceMarketContract,
    PriceMarketAbi.abi,
  )
  console.log('initControlContract', network[import.meta.env.VITE_APP_CHAIN].priceMarketContract)
}

// async function getActiveAssets() {
//   const activeAssetIds = await state.priceMarketContract.getActiveAssets();
//   for (const item of activeAssetIds) {
//     console.log('getActiveAssets',Number(item));
//     getAsset(Number(item))
//   }
// }

// async function getAsset(id) {
//   const assetInfo = await state.priceMarketContract.getAsset(id);
//   console.log('getAsset',assetInfo);
//   if(assetInfo[2]){
//     const arr = assetInfo[0].split('/')
//     state.menuList.push({
//       id,
//       symbol:arr[0]+arr[1]+'T',
//       minPrice:appStore.formatUnits(assetInfo[3]),
//       currentEpoch:Number(assetInfo[6])
//     })
//     console.log('state.menuList',state.menuList);
//     // getRounds()
//   }
// }

async function getBlockInfo() {
  const res = await appStore.getBlockInfo()
  console.log('getBlockInfo', res)
  state.blockInfo = res
}

async function getAssetEvents() {
  try {
    const res = await api.getAssetEvents({
      chainId: import.meta.env.VITE_APP_CHAIN,
      contractAddress: network[import.meta.env.VITE_APP_CHAIN].priceMarketContract,
    })
    console.log('getAssetEvents', res)
    if (res.success) {
      for (const item of res.obj.result) {
        if (item.symbol) {
          const arr = item.symbol.split('/')
          item.symbol = arr[0] + arr[1] + 'T'
          state.menuList.push(item)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function getRounds() {
  const res = await api.getRounds({
    chainId: import.meta.env.VITE_APP_CHAIN,
    contractAddress: network[import.meta.env.VITE_APP_CHAIN].priceMarketContract,
    pageSize: 5,
  })
  // console.log('getRounds', res)
  for (const item of res.obj.result) {
    if (item.status == 'started') {
      res.obj.result.push({
        roundId: item.roundId + 1,
        lockTimestamp: item.lockTimestamp,
        status: 'later',
      })
      res.obj.result.push({
        roundId: item.roundId + 2,
        lockTimestamp: item.lockTimestamp + 300,
        status: 'later',
      })
    }
  }

  state.roundsList = res.obj.result.sort((a, b) => a.roundId - b.roundId)
  // const round = await state.priceMarketContract.rounds(state.menuList[state.selectSymbolIndex].id,state.menuList[state.selectSymbolIndex].currentEpoch);
  // console.log('getRounds',round);
  // state.roundsList.push({
  //   epoch:Number(round[0]), // 轮次编号
  //   startTimestamp:Number(round[1]), // 开始时间戳
  //   lockTimestamp:Number(round[2]), // 锁定时间戳
  //   closeTimestamp:Number(round[3]), // 结束时间戳
  //   lockPrice:Number(round[4]), // 锁定价格
  //   closePrice:Number(round[5]),  // 结算价格
  //   lockOracleId:Number(round[6]),  // 锁定时预言机轮次ID
  //   closeOracleId:Number(round[7]), // 结算时预言机轮次ID
  //   totalAmount:Number(round[8]), //总投注金额
  //   bullAmount:Number(round[9]),  // 看涨总金额
  //   bearAmount:Number(round[10]), // 看跌总金额
  //   rewardBaseCalAmount:Number(round[11]),  //奖励基础计算金额
  //   rewardAmount:Number(round[12]), // 总奖励金额
  //   oracleCalled:round[13], // 是否已调用预言机
  // })
}

const { width } = useWindowResize()

function filterPerview() {
  console.log('filterPerview', width)
}

function handleClickChange(e) {
  console.log('handleClickChange',e);
  state.currentTab = e

  // (e) => (state.currentTab = e)
}

function handleClickMenu(index) {
  state.selectSymbolIndex = index
  getRounds()
}
</script>

<template>
  <v-layout>
    <div
      class="flex flex-col gap-[24px] w-full !pb-[80px] sm:!pb-0"
      style="min-height: calc(100vh - 80px)"
    >
      <!-- <div class="block lg:hidden">
      <v-tabs
        v-model="state.currentFirstTab"
        fixed-tabs
        align-tabs="center"
        color="#0AB45A"
        height="60"
      >
        <v-tab :value="item.value" v-for="item in state.tabList" style="font-size: 16px">
          <span>{{ item.title }}</span></v-tab
        >
      </v-tabs>
    </div> -->

      <div class="flex-1 sm:hidden" v-if="state.currentTab == 1">
        <div
          class="w-full !px-[16px] lg:px-0 lg:w-[1200px] mx-auto flex flex-col sm:flex-row items-center gap-[20px] lg:gap-0 justify-between !py-[40px]"
        >
          <div class="flex items-center gap-[10px]">
            <div
              class="w-[48px] h-[48px] rounded-[4px] bg-[#FFFFFF1A] flex items-center justify-center"
            >
              <img src="@/assets/img/bsc.png" class="w-[28px] h-[28px]" />
            </div>
            <div class="flex-col gap-[10px]">
              <v-menu transition="scale-transition" :offset="[10, 0]">
                <template v-slot:activator="{ props }">
                  <div
                    class="text-[#fff] lg:text-[14px] text-[16px] font-[600] cursor-pointer whitespace-nowrap flex items-center"
                    v-bind="props"
                  >
                    <div>{{ state.menuList[state.selectSymbolIndex]?.symbol }}</div>
                    <v-icon icon="mdi-menu-down" />
                  </div>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in state.menuList"
                    :key="index"
                    :value="index"
                    @click="handleClickMenu(index)"
                  >
                    <v-list-item-title>{{ item.symbol }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <div class="text-[#6DDD25] text-[24px] font-[600]">
                ${{ $formatAmount(state.currentPrice) }}
              </div>
            </div>
          </div>

          <div
            class="hidden w-[168px] rounded-full bg-[#FFFFFF1A] h-[42px] lg:flex items-center justify-between relative !px-[20px]"
          >
            <img
              src="@/assets/img/arrow_left.png"
              class="w-[18px] h-[18px] cursor-pointer"
              alt=""
              @click="swiperInstance.slidePrev()"
            />
            <img
              src="@/assets/img/price_icon.png"
              class="w-[42px] h-[50px] absolute bottom-[10px] left-[50%] translate-x-[-50%]"
              alt=""
            />
            <img
              src="@/assets/img/arrow_right.png"
              class="w-[18px] h-[18px] cursor-pointer"
              alt=""
              @click="swiperInstance.slideNext()"
            />
          </div>
          <div class="flex items-center gap-[16px]">
            <div
              class="h-[42px] rounded-full !pl-[20px] !pr-[40px] flex items-center gap-[10px] relative"
              style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
            >
              <div class="text-[#fff] text-[16px] font-[600]">Closing</div>
              <div class="text-[#fff] text-[24px] font-[600]">{{ formatTime }}</div>
              <img
                src="@/assets/img/clock.png"
                class="w-[45px] h-[47px] absolute bottom-0 right-0 translate-x-[30%] select-none"
                draggable="false"
              />
            </div>
            <div
              class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
              style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
              v-ripple
            >
              <img
                src="@/assets/img/price_icon1.png"
                class="w-[20px] h-[20px]"
                draggable="false"
                alt=""
              />
            </div>
            <div
              class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
              style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
              v-ripple
            >
              <img
                src="@/assets/img/price_icon2.png"
                class="w-[22px] h-[18px]"
                draggable="false"
                alt=""
              />
            </div>
            <div
              class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
              style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
              @click="state.showDrawer = true"
            >
              <img
                src="@/assets/img/price_icon3.png"
                class="w-[20px] h-[20px]"
                draggable="false"
                alt=""
              />
            </div>
          </div>
        </div>
        <swiper
          :slidesPerView="width / 302"
          :spaceBetween="16"
          :freeMode="true"
          :modules="[FreeMode]"
          class="w-full"
          @swiper="onSwiper"
        >
          <swiper-slide v-for="item in state.roundsList" :key="item.roundId">
            <item_started
              :item="item"
              :timeCount="state.timeCount"
              v-if="item.status == 'started'"
            ></item_started>
            <item_timeout :item="item" v-if="item.status == 'timeout'"></item_timeout>
            <item_locked
              :item="item"
              :blockInfo="state.blockInfo"
              :timeCount="state.timeCount"
              ref="itemLockedRef"
              v-if="item.status == 'locked'"
            ></item_locked>
            <item_later :item="item" v-if="item.status == 'later'"></item_later>
            <item_ended :item="item" v-if="item.status == 'ended'"></item_ended>
          </swiper-slide>
        </swiper>
      </div>
      <div class="sm:hidden flex" v-show="state.currentTab == 2" style="height: calc(100vh - 172px)">
        <tvChart
          @currentPrice="getCurrentPrice"
          :symbol="state.menuList[state.selectSymbolIndex]?.symbol"
        />
      </div>
      <div class="sm:hidden block" v-show="state.currentTab == 4">
        <div
          class="w-full !px-[10px] !py-[16px]"
          style="
            background: linear-gradient(
              90deg,
              rgba(109, 221, 37, 0.1) 0%,
              rgba(10, 180, 90, 0.1) 100%
            );
          "
        >
          <div class="w-full flex justify-between items-center">
            <div class="text-[#fff] text-[16px] font-[600]">History</div>
            <!-- <div class="text-[16px] font-[600] text-[#6DDD25] flex items-center gap-[5px] cursor-pointer" @click="state.showDrawer = false">
              <div>Close</div>
              <img
                src="@/assets/img/arrow_right.png"
                class="w-[12px] h-[12px] cursor-pointer"
                alt=""
              />
            </div> -->
            
          </div>
          <div class="w-full h-[16px]"></div>
          <v-tabs
              v-model="state.currentFirstTab"
              fixed-tabs
              align-tabs="center"
              color="#0AB45A"
              height="60"
            >
              <v-tab :value="item.value" v-for="item in state.tabList1" style="font-size: 16px">
                <span>{{ item.title }}</span></v-tab
              >
            </v-tabs>
            <div class="!mt-[16px]" v-show="state.currentFirstTab == '1'">
              <v-radio-group inline v-model="state.typeOfHistory" hideDetails color="#6DDD25">
                <v-radio label="All" value=""></v-radio>
                <v-radio label="Collected" :value="true"></v-radio>
                <v-radio label="Uncollected" :value="false"></v-radio>
              </v-radio-group>
            </div>
        </div>
        <v-tabs-window v-model="state.currentFirstTab">
              <v-tabs-window-item value="1">
                <div class="w-full !px-[10px] !py-[16px]" >
                  <div class="w-full flex items-center justify-between ">
                  <div class="text-[#fff] text-[16px] font-[600]">Your History</div>
                  <div class="flex items-center gap-[5px]">
                    <div class="text-[#6DDD25] text-[16px] font-[600]">WIN</div>
                    <img src="@/assets/img/price_icon4.png" class="w-[24px] h-[24px] cursor-pointer" alt="" />
                  </div>
                </div>
                <div class="w-full flex flex-col gap-[16px] !mt-[30px] overflow-y-auto" style="height: calc(100vh - 400px);">
                  <div class="w-full !p-[16px] rounded-[6px] border border-solid border-[#666]" v-for="item in state.betHistoryList" :key="item.roundId">
                    <VBtnConnect
                      class="rounded-[106px] !h-[42px] !w-full !font-bold"
                      v-if="!item.claimed&&item.isWinner"
                      :loading="item.isProcessing"
                      :disabled="item.isProcessing"
                      @click="handleClickClaim(item)"
                    >
                      Collect Winnings
                    </VBtnConnect>
                    <div class="w-full !py-[30px] flex flex-col gap-[16px] border-b border-solid border-[#666]">
                      <div class="flex items-center justify-between w-full">
                        <div class="text-[#fff] text-[16px] font-[600]">Your direction:</div>
                        <div class="text-[#fff] !px-[5px] py-[6px] flex justify-center items-center bg-[#0AB45A] gap-[5px]" :class="item.position=='bull'?'bg-[#0AB45A]':'bg-[#E72F2F]'">
                          <img src="@/assets/img/arrow_up.png" mode="scaleToFill" class="w-[10px] h-[10px]" :class="item.position=='bull'?'':'rotate-180'" />
                          <div class="text-[#fff] text-[12px] font-[600]">{{item.position=='bull'?'UP':'DOWN'}}</div>
                        </div>
                      </div>
                      <div class="flex items-center justify-between w-full">
                        <div class="text-[#fff] text-[16px] font-[600]">Your position:</div>
                        <div class="text-[#fff] text-[16px] font-[600]">{{ appStore.formatUnits(item.amount) }} MON</div>
                      </div>
                      <div class="flex items-center justify-between w-full" v-if="item.isWinner">
                        <div class="text-[#fff] text-[16px] font-[600]">Your winnings:</div>
                        <div class="text-[#0AB45A] text-[16px] font-[600]"><span v-show="Number(appStore.formatUnits(item.claimableAmount)) > Number(appStore.formatUnits(item.amount))">+</span>{{ NP.minus(Number(appStore.formatUnits(item.claimableAmount)),Number(appStore.formatUnits(item.amount))) }} MON</div>
                      </div>
                      <div class="flex items-center justify-between w-full" v-else>
                        <div class="text-[#fff] text-[16px] font-[600]">Your loss:</div>
                        <div class="text-[#E72F2F] text-[16px] font-[600]">-{{ appStore.formatUnits(item.amount) }} MON</div>
                      </div>
                    </div>
                    <div class="!pt-[16px] w-full flex justify-between items-center">
                      <div class="text-[#fff] text-[16px] font-[600]">Amount to collect:</div>
                      <div class="text-[#fff] text-[16px] font-[600]">{{ item.isWinner?Number(appStore.formatUnits(item.claimableAmount)):0 }} MON</div>
                    </div>
                  </div>
                  <div class="w-full h-full flex items-center justify-center text-[18px] text-[#94969c] font-bold" v-show="state.betHistoryList.length == 0">No data yet</div>
                </div>
                </div>
                
              </v-tabs-window-item>
              <v-tabs-window-item value="2">
                <div class="!px-[10px] !py-[16px] border-b border-solid border-[#666]">
                  <div class="text-[#fff] text-[16px] font-bold">Your History</div>
                  <div class="!mt-[30px] flex items-center gap-[30px]">
                    <v-progress-circular
                      :model-value="50"
                      :size="126"
                      :width="10"
                      bg-color="#fff"
                      color="#6DDD25"
                    >
                      <div
                        class="text-[#6DDD25] text-[16px] font-bold absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col gap-[5px] items-center"
                      >
                        <div class="text-[#fff] text-[16px]">Won</div>
                        <div class="text-[#6DDD25] text-[16px] font-bold">0/0</div>
                        <div class="text-[#A7A7A7] text-[16px]">50%</div>
                      </div>
                    </v-progress-circular>
                    <div class="flex flex-col gap-[5px]">
                      <div class="text-[#fff] text-[16px] font-bold">Net results</div>
                      <div class="text-[#E72F2F] text-[16px] font-bold">0 BNB</div>
                      <div class="text-[#A7A7A7] text-[16px]">~$0.00</div>
                    </div>
                  </div>
                  <div class="!mt-[16px] flex flex-col">
                    <div class="text-[#fff] text-[16px] font-bold">Average return /round</div>
                    <div class="text-[#fff] text-[16px] font-bold">0 BNB</div>
                    <div class="text-[#A7A7A7] text-[16px]">~$0.00</div>
                  </div>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
      </div>
      <!-- <div class="sm:hidden flex" v-if="state.currentTab == 3" style="height: calc(100vh - 172px)">
      <AiComponent
        :currentPrice="state.currentPrice"
        :symbol="state.menuList[state.selectSymbolIndex]?.symbol"
      />
    </div> -->
      <div class="sm:flex-1 sm:block hidden">
        <div
          class="w-full !px-[16px] lg:px-0 lg:w-[1200px] mx-auto flex flex-col sm:flex-row items-center gap-[20px] lg:gap-0 justify-between !py-[40px]"
        >
          <div class="flex items-center gap-[10px]">
            <div
              class="w-[48px] h-[48px] rounded-[4px] bg-[#FFFFFF1A] flex items-center justify-center"
            >
              <img src="@/assets/img/bsc.png" class="w-[28px] h-[28px]" />
            </div>
            <div class="flex-col gap-[10px] min-w-[120px]">
              <v-menu transition="scale-transition" :offset="[10, 0]">
                <template v-slot:activator="{ props }">
                  <div
                    class="text-[#fff] lg:text-[14px] text-[16px] font-[600] cursor-pointer whitespace-nowrap flex items-center"
                    v-bind="props"
                  >
                    <div>{{ state.menuList[state.selectSymbolIndex]?.symbol }}</div>
                    <v-icon icon="mdi-menu-down" />
                  </div>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in state.menuList"
                    :key="index"
                    :value="index"
                    @click="state.selectSymbolIndex = index"
                  >
                    <v-list-item-title>{{ item.symbol }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <div class="text-[#6DDD25] text-[24px] font-[600]">
                <!-- ${{ $formatAmount(state.currentPrice) }} -->
                 {{ $formatAmount(itemLockedRef?itemLockedRef[0]?.currentPriceCom:0) }}
              </div>
            </div>
          </div>
          <div
            class="hidden w-[168px] rounded-full bg-[#FFFFFF1A] h-[42px] lg:flex items-center justify-between relative !px-[20px]"
          >
            <img
              src="@/assets/img/arrow_left.png"
              class="w-[18px] h-[18px] cursor-pointer"
              alt=""
              @click="swiperInstance.slidePrev()"
            />
            <img
              src="@/assets/img/price_icon.png"
              class="w-[42px] h-[50px] absolute bottom-[10px] left-[50%] translate-x-[-50%]"
              alt=""
            />
            <img
              src="@/assets/img/arrow_right.png"
              class="w-[18px] h-[18px] cursor-pointer"
              alt=""
              @click="swiperInstance.slideNext()"
            />
          </div>
          <div class="flex items-center gap-[16px]">
            <div
              class="h-[42px] rounded-full !pl-[20px] !pr-[40px] flex items-center gap-[10px] relative"
              style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
            >
              <div class="text-[#fff] text-[16px] font-[600]">Closing</div>
              <div class="text-[#fff] text-[24px] font-[600]">{{ formatTime }}</div>
              <img
                src="@/assets/img/clock.png"
                class="w-[45px] h-[47px] absolute bottom-0 right-0 translate-x-[30%] select-none"
                draggable="false"
              />
            </div>
            <div
              class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
              style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
              v-ripple
            >
              <img
                src="@/assets/img/price_icon1.png"
                class="w-[20px] h-[20px]"
                draggable="false"
                alt=""
              />
            </div>
            <div
              class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
              style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
              v-ripple
            >
              <img
                src="@/assets/img/price_icon2.png"
                class="w-[22px] h-[18px]"
                draggable="false"
                alt=""
              />
            </div>
            <div
              class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
              style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
              v-ripple
              @click="state.showDrawer = true"
            >
              <img
                src="@/assets/img/price_icon3.png"
                class="w-[20px] h-[20px]"
                draggable="false"
                alt=""
              />
            </div>
          </div>
        </div>
        <swiper
          :slidesPerView="width > 1440 ? 1440 / 318 : width / 318"
          :spaceBetween="16"
          :freeMode="true"
          :modules="[FreeMode]"
          class="w-full"
          @swiper="onSwiper"
        >
          <swiper-slide v-for="item in state.roundsList" :key="item.roundId">
            <item_timeout
              :item="item"
              v-if="item.status == 'timeout'"
              :contract="state.priceMarketContract"
            ></item_timeout>
            <item_started
              :swiperInstance="swiperInstance"
              :contract="state.priceMarketContract"
              :item="item"
              v-if="item.status == 'started'"
            ></item_started>
            <item_locked
              :item="item"
              :blockInfo="state.blockInfo"
              v-if="item.status == 'locked'"
            ></item_locked>
            <item_later :item="item" v-if="item.status == 'later'"></item_later>
            <item_ended
              :item="item"
              :contract="state.priceMarketContract"
              v-if="item.status == 'ended'"
            ></item_ended>
          </swiper-slide>
        </swiper>
      </div>
      <div class="sm:flex-1 hidden bg-[#011B0C] sm:flex flex-col">
        <div
          class="w-full h-[42px] bg-[#011B0C] flex items-center justify-center relative cursor-row-resize"
        >
          <div
            class="w-[96px] h-[6px] rounded-[3px]"
            style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
          ></div>
          <div
            class="absolute top-0 left-0 translate-y-[-100%] bg-[#191919] h-[42px] flex items-center rounded-t-[6px] z-20"
          >
            <div
              class="!px-[20px] h-full flex items-center text-[16px] text-[#666] rounded-t-[6px] cursor-pointer"
              :style="
                state.curTabIndex == index
                  ? 'background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);color:#fff'
                  : ''
              "
              v-for="(item, index) in state.tabList"
              :key="index"
              @click="state.curTabIndex = index"
            >
              {{ item.title }}
            </div>
          </div>
        </div>
        <div class="flex-1 flex" v-show="state.curTabIndex == 0">
          <tvChart
            @currentPrice="getCurrentPrice"
            :symbol="state.menuList[state.selectSymbolIndex]?.symbol"
          />
        </div>

        <!-- <div class="w-[1200px] mx-auto" v-show="state.curTabIndex == 1">
        <AiComponent
          :currentPrice="state.currentPrice"
          :symbol="state.menuList[state.selectSymbolIndex]?.symbol"
        />
      </div> -->
      </div>
      <div
        class="w-full fixed left-0 bottom-[60px] h-[52px] flex items-center justify-between sm:hidden bg-[#191919] rounded-t-[10px] !px-[30px] z-10"
      >
        <img
          src="@/assets/img/arrow_left.png"
          class="w-[18px] h-[18px] cursor-pointer"
          alt=""
          @click="segmentedRef.handleClickPre"
        />
        <Segmented
          :options="state.tabbarList"
          @change="handleClickChange"
          :value="state.currentTab"
          ref="segmentedRef"
        />
        <img
          src="@/assets/img/arrow_right.png"
          class="w-[18px] h-[18px] cursor-pointer"
          alt=""
          @click="segmentedRef.handleClickNext"
        />
      </div>
      <v-navigation-drawer
        v-model="state.showDrawer"
        temporary
        location="right"
        :width="384"
        color="#032210"
      >
        <div
          class="w-full !px-[10px] !py-[16px]"
          style="
            background: linear-gradient(
              90deg,
              rgba(109, 221, 37, 0.1) 0%,
              rgba(10, 180, 90, 0.1) 100%
            );
          "
        >
          <div class="w-full flex justify-between items-center">
            <div class="text-[#fff] text-[16px] font-[600]">History</div>
            <div class="text-[16px] font-[600] text-[#6DDD25] flex items-center gap-[5px] cursor-pointer" @click="state.showDrawer = false">
              <div>Close</div>
              <img
                src="@/assets/img/arrow_right.png"
                class="w-[12px] h-[12px] cursor-pointer"
                alt=""
              />
            </div>
            
          </div>
          <div class="w-full h-[16px]"></div>
          <v-tabs
              v-model="state.currentFirstTab"
              fixed-tabs
              align-tabs="center"
              color="#0AB45A"
              height="60"
            >
              <v-tab :value="item.value" v-for="item in state.tabList1" style="font-size: 16px">
                <span>{{ item.title }}</span></v-tab
              >
            </v-tabs>
            <div class="!mt-[16px]" v-show="state.currentFirstTab == '1'">
              <v-radio-group inline v-model="state.typeOfHistory" hideDetails color="#6DDD25">
                <v-radio label="All" value=""></v-radio>
                <v-radio label="Collected" :value="true"></v-radio>
                <v-radio label="Uncollected" :value="false"></v-radio>
              </v-radio-group>
            </div>
        </div>
        <v-tabs-window v-model="state.currentFirstTab">
              <v-tabs-window-item value="1">
                <div class="w-full !px-[10px] !py-[16px]" >
                  <div class="w-full flex items-center justify-between ">
                  <div class="text-[#fff] text-[16px] font-[600]">Your History</div>
                  <div class="flex items-center gap-[5px]">
                    <div class="text-[#6DDD25] text-[16px] font-[600]">WIN</div>
                    <img src="@/assets/img/price_icon4.png" class="w-[24px] h-[24px] cursor-pointer" alt="" />
                  </div>
                </div>
                <div class="w-full flex flex-col gap-[16px] !mt-[30px] overflow-y-auto" style="height: calc(100vh - 275px);">
                  <div class="w-full !p-[16px] rounded-[6px] border border-solid border-[#666]" v-for="item in state.betHistoryList" :key="item.roundId">
                    <VBtnConnect
                      class="rounded-[106px] !h-[42px] !w-full !font-bold"
                      v-if="!item.claimed&&item.isWinner"
                      :loading="item.isProcessing"
                      :disabled="item.isProcessing"
                      @click="handleClickClaim(item)"
                    >
                      Collect Winnings
                    </VBtnConnect>
                    <div class="w-full !py-[30px] flex flex-col gap-[16px] border-b border-solid border-[#666]">
                      <div class="flex items-center justify-between w-full">
                        <div class="text-[#fff] text-[16px] font-[600]">Your direction:</div>
                        <div class="text-[#fff] !px-[5px] py-[6px] flex justify-center items-center bg-[#0AB45A] gap-[5px]" :class="item.position=='bull'?'bg-[#0AB45A]':'bg-[#E72F2F]'">
                          <img src="@/assets/img/arrow_up.png" mode="scaleToFill" class="w-[10px] h-[10px]" :class="item.position=='bull'?'':'rotate-180'" />
                          <div class="text-[#fff] text-[12px] font-[600]">{{item.position=='bull'?'UP':'DOWN'}}</div>
                        </div>
                      </div>
                      <div class="flex items-center justify-between w-full">
                        <div class="text-[#fff] text-[16px] font-[600]">Your position:</div>
                        <div class="text-[#fff] text-[16px] font-[600]">{{ appStore.formatUnits(item.amount) }} MON</div>
                      </div>
                      <div class="flex items-center justify-between w-full" v-if="item.isWinner">
                        <div class="text-[#fff] text-[16px] font-[600]">Your winnings:</div>
                        <div class="text-[#0AB45A] text-[16px] font-[600]"><span v-show="Number(appStore.formatUnits(item.claimableAmount)) > Number(appStore.formatUnits(item.amount))">+</span>{{ NP.minus(Number(appStore.formatUnits(item.claimableAmount)),Number(appStore.formatUnits(item.amount))) }} MON</div>
                      </div>
                      <div class="flex items-center justify-between w-full" v-else>
                        <div class="text-[#fff] text-[16px] font-[600]">Your loss:</div>
                        <div class="text-[#E72F2F] text-[16px] font-[600]">-{{ appStore.formatUnits(item.amount) }} MON</div>
                      </div>
                    </div>
                    <div class="!pt-[16px] w-full flex justify-between items-center">
                      <div class="text-[#fff] text-[16px] font-[600]">Amount to collect:</div>
                      <div class="text-[#fff] text-[16px] font-[600]">{{ item.isWinner?Number(appStore.formatUnits(item.claimableAmount)):0 }} MON</div>
                    </div>
                  </div>
                  <div class="w-full h-full flex items-center justify-center text-[18px] text-[#94969c] font-bold" v-show="state.betHistoryList.length == 0">No data yet</div>
                </div>
                </div>
                
              </v-tabs-window-item>
              <v-tabs-window-item value="2">
                <div class="!px-[10px] !py-[16px] border-b border-solid border-[#666]">
                  <div class="text-[#fff] text-[16px] font-bold">Your History</div>
                  <div class="!mt-[30px] flex items-center gap-[30px]">
                    <v-progress-circular
                      :model-value="50"
                      :size="126"
                      :width="10"
                      bg-color="#fff"
                      color="#6DDD25"
                    >
                      <div
                        class="text-[#6DDD25] text-[16px] font-bold absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col gap-[5px] items-center"
                      >
                        <div class="text-[#fff] text-[16px]">Won</div>
                        <div class="text-[#6DDD25] text-[16px] font-bold">0/0</div>
                        <div class="text-[#A7A7A7] text-[16px]">50%</div>
                      </div>
                    </v-progress-circular>
                    <div class="flex flex-col gap-[5px]">
                      <div class="text-[#fff] text-[16px] font-bold">Net results</div>
                      <div class="text-[#E72F2F] text-[16px] font-bold">0 BNB</div>
                      <div class="text-[#A7A7A7] text-[16px]">~$0.00</div>
                    </div>
                  </div>
                  <div class="!mt-[16px] flex flex-col">
                    <div class="text-[#fff] text-[16px] font-bold">Average return /round</div>
                    <div class="text-[#fff] text-[16px] font-bold">0 BNB</div>
                    <div class="text-[#A7A7A7] text-[16px]">~$0.00</div>
                  </div>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
      </v-navigation-drawer>
    </div>
  </v-layout>
</template>

<style scoped>
:deep(.swiper-wrapper) {
  display: flex;
  align-items: center;
}
:deep(.v-selection-control-group--inline){
  gap: 10px;
}
</style>
