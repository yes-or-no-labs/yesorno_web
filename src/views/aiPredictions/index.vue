<script setup>
import { api } from '@/apis'
import network from '@/utils/network'
import { computed, onMounted, onUnmounted, reactive, watch } from 'vue'
import Segmented from '@/components/Segmented/index.vue'
import AiComponent from '@/components/Ai/index.vue'
import icon_bullish from '@/assets/img/ai_icon4.png'
import icon_bearish from '@/assets/img/ai_icon6.png'
import icon_neutral from '@/assets/img/ai_icon7.png'
import { constant } from '@/utils/constant'
import dayjs from 'dayjs'
import { useToast } from "vue-toastification";

const state = reactive({
  menuList: [],
  selectSymbolIndex: 0,
  intervalList: [
    { label: '10M', value: 600 },
    { label: '30M', value: 1800 },
    { label: '4H', value: 14400 },
    { label: '1D', value: 86400 },
  ],
  currentTab: 600,
  dataObj: null,
  riskLevelMap: new Map([
    ['low', 'Low risk'],
    ['medium', 'Medium risk'],
    ['high', 'High risk'],
  ]),
  recordList: localStorage.getItem(constant.predictionRecordKey)
    ? JSON.parse(localStorage.getItem(constant.predictionRecordKey))
    : [],
  spotSocket: null,
  klineData: null,
})

onMounted(async () => {
  createSocket()
  await getAssetEvents()
  getData()
  getEndPrice()
})

onUnmounted(() => {
  closeBinanceSocket()
})

watch(
  () => state.recordList,
  () => {
    getEndPrice()
  },
)

const calcRigthNum = computed(()=>{
    const arr = state.recordList.filter(item=>item.isRight)
    return arr.length
})

const calcActiveNum = computed(()=>{
    const arr = state.recordList.filter(item=>item.diff>0)
    return arr.length
})

async function getHistoryPrice(item) {
  console.log('getHistoryPrice', item)

  const response = await fetch(
    `https://api1.binance.com/api/v3/klines?symbol=${state.menuList[state.selectSymbolIndex]?.symbol.toUpperCase()}&interval=1m&startTime=${item.time}&endTime=${item.time + item?.interval * 1000}`,
  )

  //streamFetchHistory("0x3C70DDCd072A684e82B52CC776E3C96722f05b35");
  // const result = await apiCandleHistory("0xd203eAB4E8c741473f7456A9f32Ce310d521fa41", from, 1000);
  // const candles = parseCandlesFromTicks(result.data, Resolutions[resolution]);
  const res = await response.json()
  console.log('getHistoryPrice', res)
  item.endPrice = parseFloat(res[res.length - 1][4])
  if(item.direction == 'bullish' && Number(item.targetPrice)<=Number(item.endPrice)){
        item.isRight = true
    }else if(item.direction == 'bearish' && Number(item.targetPrice)>=Number(item.endPrice)){
        item.isRight = true
    }else{
        item.isRight = false
    }
  localStorage.setItem(constant.predictionRecordKey, JSON.stringify(state.recordList))
}

function getEndPrice() {
  for (const item of state.recordList) {
    console.log('getEndPrice', item)
    if (item.endPrice) return
    const now = new Date().getTime()
    const time = item.time + item?.interval * 1000
    item.diff = time - now
    if (item.diff > 0) {
      item.timer = setInterval(() => {
        item.diff--
        if (item.diff == 0) {
          getHistoryPrice(item)
          clearInterval(item.timer)
        }
      }, 1000)
      return
    }
    if (item.diff < 0) {
      getHistoryPrice(item)
    }
  }
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

function handleClickMenu(index) {
  state.selectSymbolIndex = index
}

async function getData() {
  try {
    console.log('Testing health endpoint...')
    const response = await fetch(
      `https://iavertwlopfihqyampsa.supabase.co/functions/v1/unified-confidence-api/analysis?crypto=${state.menuList[state.selectSymbolIndex]?.symbol.match(/^(.+?)USDT$/i)[1]}`,
    )
    const res = await response.json()
    // console.log(`Health test response: ${JSON.stringify(res, null, 2)}`)
    // console.log('getData', res)
    if (res.success) {
      state.dataObj = res.data
    }
  } catch (error) {
    console.log(`Health test error: ${error.message}`)
  }
}

function filterRiskColor() {
  const riskLevel = state.dataObj?.current?.risk_assessment?.risk_level
  if (riskLevel === 'low') {
    return '#0AB45A'
  } else if (riskLevel === 'medium') {
    return '#FFA500' // Orange for medium risk
  } else if (riskLevel === 'high') {
    return '#E72F2F' // Red for high risk
  }
}

function filterDirectionImg(dire) {
  let direction
  if (!dire) {
    direction = state.dataObj?.summary?.trend?.direction
  } else {
    direction = dire
  }
  if (direction === 'bullish') {
    return icon_bullish
  } else if (direction === 'bearish') {
    return icon_bearish // Orange for medium risk
  } else if (direction === 'neutral') {
    return icon_neutral // Red for high risk
  }
}

function filterDirectionColor(dire) {
  let direction
  if (!dire) {
    direction = state.dataObj?.summary?.trend?.direction
  } else {
    direction = dire
  }
  if (direction === 'bullish') {
    return '#0AB45A'
  } else if (direction === 'bearish') {
    return '#E72F2F' // Orange for medium risk
  } else if (direction === 'neutral') {
    return '#F6E316' // Red for high risk
  }
}

function handleClickSave() {
  state.recordList.push({
    symbol: state.menuList[state.selectSymbolIndex]?.symbol.match(/^(.+?)USDT$/i)[1],
    time: new Date().getTime(),
    confidence: state.dataObj?.current?.confidence_score,
    direction: state.dataObj?.summary?.trend?.direction,
    currentPrice: state.klineData?.c,
    targetPrice:
      state.dataObj?.current?.target_prices[`${state.dataObj?.summary?.trend?.direction}_target`],
    endPrice: '',
    interval: state.currentTab,
    timer: null,
    isRight:false
  })
  
  localStorage.setItem(constant.predictionRecordKey, JSON.stringify(state.recordList))
  const toast = useToast();
  toast.success('Save Success!');
}

function filterStatus(item){
    if(item.direction == 'bullish' && Number(item.targetPrice)<=Number(item.endPrice)){
        return true
    }else if(item.direction == 'bearish' && Number(item.targetPrice)>=Number(item.endPrice)){
        return true
    }else{
        return false
    }
}

function calcPercent(item){
    console.log('calcPercent',item);
    if(item.currentPrice<Number(item.endPrice)){
        return '+' + ((Number(item.endPrice) - item.currentPrice) / item.currentPrice).toFixed(2) * 100
    }else if(item.currentPrice>Number(item.endPrice)){
        return '-' + ((item.currentPrice - item.targetPrice) / item.currentPrice).toFixed(2) * 100
    }
}

function createSocket() {
  state.spotSocket = new WebSocket('wss://stream.binance.com:443/ws')
// state.spotSocket = new WebSocket('wss://stream.binance.com/stream')

  state.spotSocket.onopen = () => {
    // console.log('onopen')
    state.spotSocket.send(
      JSON.stringify({
        method: 'SUBSCRIBE',
        params: [`${state.menuList[state.selectSymbolIndex]?.symbol.toLocaleLowerCase()}@kline_1m`],
        id: 2,
      }),
    )
  }
  state.spotSocket.onmessage = (res) => {
    const data = JSON.parse(res.data)
    // console.log('data?>>>>>>>>',data);

    if (data.e == 'kline') {
      state.klineData = data.k
      //    emit('currentPrice', {
      // 	price: Number(state.klineData.c),
      // 	time: state.klineData.t,
      //   })
    }
  }
}

function closeBinanceSocket() {
  state.spotSocket.onopen = () => {
    state.spotSocket.send(
      JSON.stringify({
        method: 'UNSUBSCRIBE',
        params: [`${state.menuList[state.selectSymbolIndex]?.symbol.toLocaleLowerCase()}@kline_1m`],
        id: 2,
      }),
    )
  }

  state.spotSocket.close()
}
</script>

<template>
  <div class="w-[1200px] mx-auto !py-[30px] flex flex-col gap-[20px]">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-[10px]">
        <div
          class="w-[48px] h-[48px] rounded-[4px] bg-[#6DDD2526] flex items-center justify-center"
        >
          <img src="@/assets/img/bot.png" mode="scaleToFill" class="w-[24px] h-[24px]" />
        </div>
        <div class="flex-col gap-[10px]">
          <v-menu transition="scale-transition" :offset="[10, 0]">
            <template v-slot:activator="{ props }">
              <div
                class="text-[#fff] lg:text-[14px] text-[16px] font-[600] cursor-pointer whitespace-nowrap flex items-center"
                v-bind="props"
              >
                <div class="text-[#6DDD25] text-[16px]">
                  {{ state.menuList[state.selectSymbolIndex]?.symbol }}
                </div>
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
          <div class="text-[#666] text-[14px] font-[600]">
            Price prediction analysis based on deep learning
          </div>
        </div>
      </div>
      <Segmented
        :options="state.intervalList"
        @change="(e) => (state.currentTab = e)"
        :value="state.currentTab"
      />
    </div>
    <div class="w-full flex items-center gap-[20px]">
      <div
        class="flex-1 !px-[10px] !py-[20px] border border-solid !border-[#FFFFFF80] rounded-[4px]"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-[10px]">
            <div
              class="w-[48px] h-[48px] rounded-[4px] bg-[#6DDD2526] flex items-center justify-center"
            >
              <img src="@/assets/img/ai_icon1.png" mode="scaleToFill" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px]">Contract Price</div>
              <div class="text-[#666] text-[14px]">Contract</div>
            </div>
          </div>
          <div class="!px-[10px] !py-[2px] text-[#fff] text-[14px] bg-[#666] rounded-full">
            Binance
          </div>
        </div>
        <div class="!mt-[30px] flex flex-col">
          <div class="text-[#fff] text-[24px]">${{ $formatAmount(state.klineData?.c) }}</div>
          <div class="text-[#666] text-[14px]">
            Update: {{ dayjs(state.klineData?.t).format('HH:mm') }}
          </div>
        </div>
      </div>
      <div
        class="flex-1 !px-[10px] !py-[20px] border border-solid !border-[#FFFFFF80] rounded-[4px]"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-[10px]">
            <div
              class="w-[48px] h-[48px] rounded-[4px] bg-[#6DDD2526] flex items-center justify-center"
            >
              <img src="@/assets/img/ai_icon2.png" mode="scaleToFill" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px]">Spot Price</div>
              <div class="text-[#666] text-[14px]">Spot</div>
            </div>
          </div>
          <div class="!px-[10px] !py-[2px] text-[#fff] text-[14px] bg-[#666] rounded-full">
            Binance
          </div>
        </div>
        <div class="!mt-[30px] flex flex-col">
          <div class="text-[#fff] text-[24px]">${{ $formatAmount(state.klineData?.c) }}</div>
          <div class="text-[#666] text-[14px]">
            Update: {{ dayjs(state.klineData?.t).format('HH:mm') }}
          </div>
        </div>
      </div>
      <div
        class="flex-1 !px-[10px] !py-[20px] border border-solid !border-[#FFFFFF80] rounded-[4px]"
      >
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-[10px]">
            <div
              class="w-[48px] h-[48px] rounded-[4px] bg-[#6DDD2526] flex items-center justify-center"
            >
              <img src="@/assets/img/ai_icon3.png" mode="scaleToFill" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px]">Index Price</div>
              <div class="text-[#666] text-[14px]">Index</div>
            </div>
          </div>
          <div class="!px-[10px] !py-[2px] text-[#fff] text-[14px] bg-[#666] rounded-full">
            Binance
          </div>
        </div>
        <div class="!mt-[30px] flex flex-col">
          <div class="text-[#fff] text-[24px]">${{ $formatAmount(state.klineData?.c) }}</div>
          <div class="text-[#666] text-[14px]">
            Update: {{ dayjs(state.klineData?.t).format('HH:mm') }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 !p-[20px] border border-solid !border-[#FFFFFF80] rounded-[4px]">
      <div class="flex items-center gap-[10px]">
        <div
          class="!px-[10px] !py-[5px] border border-solid text-[12px] flex items-center rounded-full gap-[5px] capitalize"
          :style="`border-color:${filterDirectionColor()} !important;color:${filterDirectionColor()}`"
        >
          <img
            :src="filterDirectionImg()"
            class="w-[14px] h-[14px]"
            :style="state.dataObj?.summary?.trend?.direction == 'neutral' ? 'height:6px' : ''"
          />
          {{ state.dataObj?.summary?.trend?.direction }}
        </div>
        <div class="text-[#fff] text-[14px]">
          Risk level:
          <span :style="`color:${filterRiskColor()}`">{{
            state.riskLevelMap.get(state.dataObj?.current?.risk_assessment?.risk_level)
          }}</span>
        </div>
      </div>

      <div
        class="w-[160px] h-[160px] rounded-full border-[2px] border-solid border-[#0AB45A] mx-auto !my-[40px]"
      >
        <div class="w-full h-full rounded-full border-[4px] border-solid border-[#000]">
          <div class="w-full h-full rounded-full" style="border: 2px solid rgba(10, 180, 90, 0.5)">
            <div
              class="w-full h-full rounded-full bg-[#535353] !p-[2px] flex items-center justify-center relative overflow-hidden"
            >
              <div class="flex flex-col items-center relative z-10">
                <div class="text-[36px] font-[600] text-[#12121A] leading-[35px]">
                  {{ state.dataObj?.current?.confidence_score }}%
                </div>
                <div class="text-[14px] text-[#666]">Confidence</div>
              </div>
              <div
                class="wave wave1 bg-[#0ab4598a]"
                :style="`filter: blur(1px); top: ${90 - state.dataObj?.current?.confidence_score}%`"
              ></div>
              <div
                class="wave wave2 bg-[#0AB45A]"
                :style="`filter: blur(2px); top: ${100 - state.dataObj?.current?.confidence_score}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex items-center justify-between">
        <div class="flex-1 flex justify-center flex-col items-center">
          <div class="text-[14px] text-[#666]">Current Price</div>
          <div class="text-[24px] text-[#fff]">${{ $formatAmount(state.klineData?.c) }}</div>
        </div>
        <div class="flex-1 flex justify-center flex-col items-center">
          <div class="text-[14px] text-[#666]">Target price</div>
          <div class="text-[24px] text-[#fff]">
            {{
              state.dataObj?.current?.target_prices[
                `${state.dataObj?.summary?.trend?.direction}_target`
              ]
            }}
          </div>
        </div>
      </div>
      <VBtnConnect :disabled="!state.dataObj" @click="handleClickSave" class="!w-full !mt-[30px]">
        Save prediction
      </VBtnConnect>
    </div>
    <div class="flex-1 !p-[20px] border border-solid !border-[#FFFFFF80] rounded-[4px]">
      <div class="text-[#fff] text-[16px] font-bold">Technical Signals</div>
      <div class="max-h-[330px] overflow-y-auto">
        <div class="flex flex-col lg:grid grid-cols-2 gap-x-[px] gap-y-[10px] !mt-[20px]">
          <div
            class="!px-[10px] h-[52px] rounded-[6px] border border-solid !border-[#FFFFFF80] flex items-center justify-between"
            v-for="item in state.dataObj?.current?.chinese_technical_signals"
          >
            <div class="text-[12px] text-[#fff]">{{ item.name }}</div>
            <div class="!px-[10px] !py-[5px] text-[#fff] text-[14px] bg-[#666] rounded-full">
              {{ item.strength }}%
            </div>
          </div>
        </div>
        <div class="w-full text-center text-[#666] text-[14px]" v-show="!state.dataObj">
          No technical signals available
        </div>
      </div>
    </div>
    <div class="flex-1 !p-[20px] border border-solid !border-[#FFFFFF80] rounded-[4px]">
      <div class="flex items-center gap-[10px]">
        <div
          class="w-[48px] h-[48px] rounded-[4px] bg-[#6DDD2526] flex items-center justify-center"
        >
          <img src="@/assets/img/ai_icon8.png" mode="scaleToFill" class="w-[24px] h-[24px]" />
        </div>
        <div class="flex flex-col">
          <div class="text-[#6DDD25] text-[16px]">Prediction Tracker</div>
          <div class="text-[#666] text-[14px]">AI Prediction Accuracy & Real-time Tracking</div>
        </div>
      </div>
      <div class="!mt-[20px] w-full bg-[#E72F2F1A] !p-[20px]">
        <div class="flex items-center gap-[10px]">
          <img src="@/assets/img/ai_icon9.png" mode="scaleToFill" class="w-[12px] h-[12px]" />
          <div class="text-[#fff] text-[16px]">Overall Performance</div>
        </div>
        <div class="w-full h-[4px] bg-[#000] !mt-[20px]"></div>
        <div class="w-full flex items-center !mt-[10px]">
          <div class="flex-1 flex items-center justify-center flex-col">
            <div class="text-[#fff] text-[24px] font-bold">{{state.recordList.length}}</div>
            <div class="text-[#666] text-[14px]">Total Predictions</div>
          </div>
          <div class="flex-1 flex items-center justify-center flex-col">
            <div class="text-[#fff] text-[24px] font-bold">{{calcRigthNum}}</div>
            <div class="text-[#666] text-[14px]">Correct</div>
          </div>
          <div class="flex-1 flex items-center justify-center flex-col">
            <div class="text-[#fff] text-[24px] font-bold">{{calcActiveNum}}</div>
            <div class="text-[#666] text-[14px]">Active</div>
          </div>
        </div>
      </div>
      <div class="text-[#fff] text-[16px] font-bold !mt-[20px]">Prediction Records</div>
      <div class="max-h-[330px] overflow-y-auto">
        <div
          class="!py-[15px] !px-[5px] flex items-center justify-between border-b border-solid !border-[#FFFFFF80] last:!border-0"
          v-for="(item, index) in state.recordList"
          :key="index"
        >
          <div class="flex flex-col gap-[5px]">
            <div class="flex-1 text-[12px] flex items-center gap-[10px] !pr-[5px]">
              <div class="text-[16px] text-[#fff]">{{ item.symbol }}</div>
              <div
                class="!px-[10px] !py-[5px] border border-solid text-[12px] flex items-center rounded-full gap-[5px] capitalize"
                :style="`border-color:${filterDirectionColor(item.direction)} !important;color:${filterDirectionColor(item.direction)}`"
              >
                <img
                  :src="filterDirectionImg(item.direction)"
                  class="w-[14px] h-[14px]"
                  :style="state.dataObj?.summary?.trend?.direction == 'neutral' ? 'height:6px' : ''"
                />
                {{ item.direction }}
              </div>
              <div
                class="!px-[10px] !py-[2px] border border-solid !border-[#666] text-[12px] rounded-full"
                v-if="item.diff > 0"
              >
                Pending verification
              </div>
              <div
                class="!px-[10px] !py-[2px] border border-solid !border-[#6DDD25] text-[#6DDD25] text-[12px] rounded-full"
                v-else-if="item.diff <= 0 && filterStatus(item)"
              >
                Correct
              </div>
              <div
                class="!px-[10px] !py-[2px] border border-solid !border-[#E72F2F] text-[#E72F2F] text-[12px] rounded-full"
                v-else
              >
                Incorrect
              </div>
            </div>
            <div class="flex-1 text-[12px] text-[#fff]">
              {{ dayjs(Number(item.time)).format('YYYY-MM-DD HH:mm:ss') }} · Confidence:{{
                item.confidence
              }}%
            </div>
          </div>
          <div class="text-[12px] flex flex-col justify-end">
            <div class="text-[#666] text-[12px]" v-if="item.diff > 0">
              {{ Math.floor(item.diff / 60000) }} minutes to expire
            </div>
            <div class="text-[12px]" :style="item.currentPrice<item.endPrice?'color:#E72F2F':'color:#6DDD25'" v-else>
                {{calcPercent(item)}}
            </div>
          </div>
        </div>
        <div
          class="w-full text-center text-[#666] text-[14px]"
          v-show="state.recordList.length == 0"
        >
          No prediction records available
        </div>
      </div>
    </div>

    <!-- <AiComponent/> -->
  </div>
</template>

<style scoped>
.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  top: 50%;
  left: -50%;
  transform-origin: 50% 50%;
  animation: wave 5s cubic-bezier(0.4, 0.2, 0.2, 1) infinite;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.wave1 {
  border-radius: 45%;
  animation-duration: 5s;
}

.wave2 {
  border-radius: 40%;
  animation-duration: 7s;
}
</style>
