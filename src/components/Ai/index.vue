<script setup>
import { onMounted, onUnmounted, reactive, watch } from 'vue'
import Segmented from '../Segmented/index.vue'
import { color } from 'echarts'
import icon_bullish from '@/assets/img/ai_icon4.png'
import icon_bearish from '@/assets/img/ai_icon6.png'
import icon_neutral from '@/assets/img/ai_icon7.png'
import { constant } from '@/utils/constant'
import dayjs from 'dayjs'

const state = reactive({
  currentTab: 1,
  menuList: [
    { label: '10M', value: 1 },
    { label: '30M', value: 2 },
    { label: '4H', value: 3 },
    { label: '1D', value: 4 },
  ],
  dataObj: {},
  riskLevelMap: new Map([
    ['low', 'Low risk'],
    ['medium', 'Medium risk'],
    ['high', 'High risk'],
  ]),
  timer: null,
  recordList: localStorage.getItem(constant.predictionRecordKey)
    ? JSON.parse(localStorage.getItem(constant.predictionRecordKey))
    : [],
    
})

const props = defineProps({
  currentPrice: {
    type: Number,
    default: 0,
  },
  symbol: {
    default: '',
    type: String,
  },
})

onMounted(() => {
  // console.log('Symbol changed:', props.symbol);
})

onUnmounted(() => {
  if (state.timer) {
    clearInterval(state.timer)
  }
})

watch(
  () => props.symbol,
  (newVal) => {
    console.log('Symbol changed:', newVal)
    if (state.timer) {
      clearInterval(state.timer)
    } else {
      getData()
    }
    state.timer = setInterval(() => {
      getData()
    }, 5000)
  },
  { immediate: true },
)

// const TEST_URL =
//   `https://iavertwlopfihqyampsa.supabase.co/functions/v1/unified-confidence-api/analysis?crypto=${props.symbol}`

async function getData() {
  try {
    console.log('Testing health endpoint...')
    const response = await fetch(
      `https://iavertwlopfihqyampsa.supabase.co/functions/v1/unified-confidence-api/analysis?crypto=${props.symbol.match(/^(.+?)USDT$/i)[1]}`,
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
    symbol: props.symbol.match(/^(.+?)USDT$/i)[1],
    time: new Date().getTime(),
    confidence: state.dataObj?.current?.confidence_score,
    direction: state.dataObj?.summary?.trend?.direction,
  })
  localStorage.setItem(constant.predictionRecordKey, JSON.stringify(state.recordList))
}
</script>

<template>
  <div class="w-full h-auto">
    <!--    <div class="flex justify-between items-center w-full">-->
    <!--      <div class="flex items-center gap-[10px] flex-1 h-[48px]">-->
    <!--        <div-->
    <!--          class="bg-[#6DDD2526] w-[48px] h-[48px] rounded-[4px] flex items-center justify-center"-->
    <!--        >-->
    <!--          <img src="@/assets/img/bot.png" class="w-[24px] h-[24px]" />-->
    <!--        </div>-->
    <!--        <div class="flex flex-col">-->
    <!--          <div class="text-[#6DDD25] text-[16px] font-[600]">AI Enhanced Prediction-BTC</div>-->
    <!--          <div class="text-[14px] text-[#666]">Predict cryptocurrency prices!</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <Segmented-->
    <!--        :options="state.menuList"-->
    <!--        @change="(e) => (state.currentTab = e)"-->
    <!--        :value="state.currentTab"-->
    <!--      />-->
    <!--    </div>-->
    <!-- <div class="flex items-center gap-[20px]">
      <div
        class="flex-1 border border-solid !border-[#FFFFFF80] rounded-[4px] !px-[10px] !py-[20px] flex flex-col gap-[10px]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px]">
            <div
              class="bg-[#0AB45A26] flex items-center justify-center rounded-[4px] w-[48px] h-[48px]"
            >
              <img src="@/assets/img/ai_icon1.png" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px] font-[600]">Contract Price</div>
              <div class="text-[#666] text-[14px]">Contract</div>
            </div>
          </div>
          <div
            class="!px-[8px] !p-[4px] rounded-full bg-[#666] text-[#fff] text-[14px] leading-[14px]"
          >
            OKX
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-[#fff] text-[24px] font-[600]">$119,804.30</div>
          <div class="text-[#666] text-[14px]">Update: 11:09:03</div>
        </div>
      </div>
      <div
        class="flex-1 border border-solid !border-[#FFFFFF80] rounded-[4px] !px-[10px] !py-[20px] flex flex-col gap-[10px]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px]">
            <div
              class="bg-[#0AB45A26] flex items-center justify-center rounded-[4px] w-[48px] h-[48px]"
            >
              <img src="@/assets/img/ai_icon2.png" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px] font-[600]">Contract Price</div>
              <div class="text-[#666] text-[14px]">Contract</div>
            </div>
          </div>
          <div
            class="!px-[8px] !p-[4px] rounded-full bg-[#666] text-[#fff] text-[14px] leading-[14px]"
          >
            OKX
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-[#fff] text-[24px] font-[600]">$119,804.30</div>
          <div class="text-[#666] text-[14px]">Update: 11:09:03</div>
        </div>
      </div>
      <div
        class="flex-1 border border-solid !border-[#FFFFFF80] rounded-[4px] !px-[10px] !py-[20px] flex flex-col gap-[10px]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px]">
            <div
              class="bg-[#0AB45A26] flex items-center justify-center rounded-[4px] w-[48px] h-[48px]"
            >
              <img src="@/assets/img/ai_icon3.png" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px] font-[600]">Contract Price</div>
              <div class="text-[#666] text-[14px]">Contract</div>
            </div>
          </div>
          <div
            class="!px-[8px] !p-[4px] rounded-full bg-[#666] text-[#fff] text-[14px] leading-[14px]"
          >
            OKX
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-[#fff] text-[24px] font-[600]">$119,804.30</div>
          <div class="text-[#666] text-[14px]">Update: 11:09:03</div>
        </div>
      </div>
    </div> -->
    <div class="flex flex-col lg:flex-row items-center justify-center gap-[10px] w-full">
      <div
        class="flex-1 w-full lg:flex-[0.7] bg-[#000] border-0 lg:!border border-solid !border-[#FFFFFF80] rounded-[4px] !p-[10px] flex flex-col lg:flex-row gap-[10px]"
      >
        <div
          class="lg:!border-0 border border-solid !border-[#FFFFFF80] rounded-[4px] !py-[16px] lg:!py-0"
        >
          <div
            class="w-[160px] h-[160px] rounded-full border-[2px] border-solid border-[#0AB45A] mx-auto"
          >
            <div class="w-full h-full rounded-full border-[4px] border-solid border-[#000]">
              <div
                class="w-full h-full rounded-full"
                style="border: 2px solid rgba(10, 180, 90, 0.5)"
              >
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
          <div class="!mt-[5px] flex flex-col gap-[5px] items-center">
            <div class="text-[14px] text-[#666]">Current Price</div>
            <div class="text-[24px] text-[#fff]">${{ props.currentPrice }}</div>
            <div class="text-[14px] text-[#fff]">
              Target price:{{
                state.dataObj?.current?.target_prices[
                  `${state.dataObj?.summary?.trend?.direction}_target`
                ]
              }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-[10px] justify-between flex-1">
          <div class="h-[180px] overflow-y-auto">
            <div class="flex flex-col lg:grid grid-cols-2 gap-x-[5px] gap-y-[10px]">
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
          </div>

          <div class="flex flex-col gap-[20px] lg:gap-0 lg:flex-row items-center justify-between">
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
            <VBtnConnect @click="handleClickSave" class="!w-full lg:!w-auto">
              Save prediction
            </VBtnConnect>
          </div>
        </div>
      </div>
      <div class="!px-[10px] lg:!px-0 w-full lg:w-auto lg:flex-[0.3] !pb-[200px] lg:!pb-0">
        <div
          class="flex-1 w-full lg:w-auto lg:flex-[0.3] bg-[#000] border border-solid !border-[#FFFFFF80] rounded-[4px] !p-[10px] h-[275px]"
        >
          <div class="flex items-center gap-[5px]">
            <img src="@/assets/img/ai_icon5.png" class="w-[16px] h-[16px]" />
            <div class="text-[14px] text-[#6DDD25] font-[600]">Prediction record</div>
          </div>
          <div class="w-full flex items-center !mt-[10px]">
            <div class="flex-1 text-[12px] text-[#666]">Type</div>
            <div class="flex-1 text-[12px] text-[#666] text-center">Time</div>
            <div class="flex-1 text-[12px] flex items-center">
              <div class="flex-1 text-[12px] text-[#666] text-right">Confidence</div>
              <!-- <div class="flex-1 text-[12px] text-[#666] text-right">Result</div> -->
            </div>
          </div>
          <div class="h-[200px] overflow-y-auto">
            <div
              class="!py-[15px] !px-[5px] flex items-center border-b border-solid !border-[#FFFFFF80] last:!border-0"
              v-for="(item, index) in state.recordList"
              :key="index"
            >
              <div class="flex-1 text-[12px] flex items-center justify-between !pr-[5px]">
                <div class="text-[12px] text-[#fff]">{{ item.symbol }}</div>
                <div
                  class="!px-[10px] !py-[5px] border border-solid text-[12px] flex items-center rounded-full gap-[5px] capitalize"
                  :style="`border-color:${filterDirectionColor(item.direction)} !important;color:${filterDirectionColor(item.direction)}`"
                >
                  <img
                    :src="filterDirectionImg(item.direction)"
                    class="w-[14px] h-[14px]"
                    :style="
                      state.dataObj?.summary?.trend?.direction == 'neutral' ? 'height:6px' : ''
                    "
                  />
                  {{ item.direction }}
                </div>
              </div>
              <div class="flex-1 text-[12px] text-[#fff] text-center">
                {{ dayjs(Number(item.time)).format('MMM D, YYYY') }}
              </div>
              <div class="flex-1 text-[12px] flex items-center">
                <div class="flex-1 text-[12px] text-[#fff] text-right">{{ item.confidence }}%</div>
                <!-- <div class="flex-1 text-[12px] text-[##0AB45A] text-right">Correct</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
