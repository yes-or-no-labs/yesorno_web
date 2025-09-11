<script setup>
import AiComponent from '@/components/Ai/index.vue'
import tvChart from '@/components/Charting/TVChartView.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import { useWindowResize } from '@/hooks/useWindowResize'
import Segmented from '@/components/Segmented/index.vue'

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

const state = reactive({
  curTabIndex: 0,
  tabList: [{ title: 'TradingView chart' }, 
  // { title: 'AI Prediction' }
],
  currentPrice: 0,
  menuList: [],
  selectSymbolIndex: 0,
  tabbarList: [
    { icon: pricePrediction_icon1, selectIcon: pricePrediction_select1, value: 1 },
    { icon: pricePrediction_icon2, selectIcon: pricePrediction_select2, value: 2 },
    { icon: pricePrediction_icon3, selectIcon: pricePrediction_select3, value: 3 },
    { icon: pricePrediction_icon4, selectIcon: pricePrediction_select4, value: 4 },
  ],
  currentTab: 1,
  // tabList: [
  //   { title: 'Event Prediction', value: '1', path: '/market' },
  //   { title: 'Price Prediction', value: '2', path: '/market_pricePrediction' },
  // ],
  currentFirstTab: '2',
  priceMarketContract: null,
  roundsList: [],
  blockInfo: null,
  timer: null,
  timeCount: 0,
  roundsTimer: null,
})

const segmentedRef = ref(null)
const appStore = store.useAppStore()

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

const swiperInstance = ref(null)

const router = useRouter()

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
  console.log('getRounds', res)
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
  // console.log('handleClickChange',e);
  state.currentTab = e

  // (e) => (state.currentTab = e)
}

function handleClickMenu(index) {
  state.selectSymbolIndex = index
  getRounds()
}
</script>

<template>
  <div
    class="flex flex-col gap-[24px] w-full !pb-[80px] sm:!pb-0"
    style="height: calc(100vh - 80px)"
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
            v-ripple
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
          <item_started :item="item" v-if="item.status == 'started'"></item_started>
          <item_timeout :item="item" v-if="item.status == 'timeout'"></item_timeout>
          <item_locked
            :item="item"
            :blockInfo="state.blockInfo"
            v-if="item.status == 'locked'"
          ></item_locked>
          <item_later :item="item" v-if="item.status == 'later'"></item_later>
          <item_ended :item="item" v-if="item.status == 'ended'"></item_ended>
        </swiper-slide>
      </swiper>
    </div>
    <div class="sm:hidden flex" v-if="state.currentTab == 2" style="height: calc(100vh - 172px)">
      <tvChart
        @currentPrice="getCurrentPrice"
        :symbol="state.menuList[state.selectSymbolIndex]?.symbol"
      />
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
            v-ripple
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
          <item_timeout :item="item" v-if="item.status == 'timeout'"></item_timeout>
          <item_started :swiperInstance="swiperInstance" :contract="state.priceMarketContract" :item="item" v-if="item.status == 'started'"></item_started>
          <item_locked
            :item="item"
            :blockInfo="state.blockInfo"
            v-if="item.status == 'locked'"
          ></item_locked>
          <item_later :item="item" v-if="item.status == 'later'"></item_later>
          <item_ended :item="item" v-if="item.status == 'ended'"></item_ended>
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
      class="w-full fixed left-0 bottom-[60px] h-[52px] flex items-center justify-between sm:hidden bg-[#191919] rounded-t-[10px] !px-[30px]"
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
  </div>
</template>
