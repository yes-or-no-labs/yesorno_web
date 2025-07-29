<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import exchange from './components/exchange.vue'
import handicap from './components/handicap.vue'
import chart from './components/chart.vue'
import comment from './components/comment.vue'
import { useRoute } from 'vue-router'
import { api } from '@/apis'
import dayjs from 'dayjs'
import { store } from '@/store'
import network from '@/utils/network'
import { time } from 'echarts'
import { useToast } from 'vue-toastification'
import { debounce } from '@/utils/debounce'

const state = reactive({
  timeLine: [
    { title: '1H', id: 1,interval:'hourly' },
    { title: '1D', id: 2,interval:'daily' },
    { title: '1M', id: 3,interval:'weekly' },
  ],
  selectTimeLine: 0,
  eventId: '',
  dataObj: {},
  curSelectEvent: null, //当前选择的事件
  selectPanel: '',
  chartData:[],
  handicapData:{},
  dayChange: 0,
  curRules:'',
  isShowDialog:false
})

const route = useRoute()
const appStore = store.useAppStore()
const toast = useToast()

const env = computed(() => import.meta.env)

onMounted(async () => {
  state.eventId = route.query.eventId
  await getMarketInfo()
  // getPriceLine()
  // getOrderList()
})

watch(()=>state.selectTimeLine,()=>{
  getPriceLine()
})

watch(()=>state.selectPanel,newVal=>{
  state.curSelectEvent = state.dataObj.conditionList.find(item=>item.guid === newVal)
  getPriceLine()
  getOrderList()
})

async function getMarketInfo() {
  try {
    const res = await api.getMarketInfo({
      eventId: state.eventId,
    })
    if (res.success) {
      if (!state.curSelectEvent) {
        state.curSelectEvent = res.obj?.conditionList[0]
      }
      for (const item of res.obj?.conditionList) {
        item.outcome = '0'
        if (item.guid === state.curSelectEvent.guid) {
          state.curSelectEvent = item
          state.selectPanel = item.guid
        }
      }
      if (res.obj.conditionList.length > 1 && !state.curSelectEvent) {
        state.selectPanel = res.obj.conditionList[0].guid
      }
      state.dataObj = res.obj
    }
  } catch (error) {
    console.error(error)
  }
}

function selectOutcome(e) {
  state.curSelectEvent.outcome = e
}

function calcTotalPrice(list) {
  let total = 0
  if (Array.isArray(list) && list.length > 0) {
    for (const item of list) {
      total +=
        Number(appStore.formatUnits(item.yesPaid)) + Number(appStore.formatUnits(item.noPaid))
    }
  }
  return total
}

function calcPercent(item, type) {
  const totalAmount = item.yesAmount + item.noAmount
  if (Number(totalAmount) === 0) return 0
  if (type === 'yes') {
    return ((item.yesAmount / totalAmount) * 100).toFixed(1)
  } else if (type === 'no') {
    return ((item.noAmount / totalAmount) * 100).toFixed(1)
  }
}

function handleClickPanel(item, outcome) {
  console.log('handleClickPanel', item)
  if (outcome) {
    item.outcome = outcome
    state.selectPanel = item.guid
  }
  state.curSelectEvent = item
  getPriceLine()
  getOrderList()
}

function handleClickRule(item) {
  // console.log('handleClickRule',item)
  // state.curRules = item.desc
  state.isShowDialog = true
  // debounce(() => toast.info('coming soon'))
}


async function getPriceLine() {
  try {
    // console.log('getPriceLine',state.curSelectEvent.conditionId);
    
    const res = await api.getPriceLine({
      eventId:state.eventId,
      conditionId:state.curSelectEvent.conditionId,
      interval: state.timeLine[state.selectTimeLine].interval
    })
    console.log('getPriceLine',res);
    if(res.success){
      state.chartData = res.obj.line
    }
  } catch (error) {
    console.error(error);
  }
}

async function getPriceLineForDay() {
  try {
    // console.log('getPriceLine',state.curSelectEvent.conditionId);
    
    const res = await api.getPriceLine({
      eventId:state.eventId,
      conditionId:state.curSelectEvent.conditionId,
      interval: 'daily'
    })
    console.log('getPriceLine',res);
    if(res.success){
      // state.chartData = res.obj.line
      state.dayChange = res.obj.line[res.obj.line.length - 1].yesPercent - res.obj.line[res.obj.line.length - 2].yesPercent

    }
  } catch (error) {
    console.error(error);
  }
}

async function getOrderList() {
  try {
    const res = await api.getOrderList({
      eventId:state.eventId,
      conditionId:state.curSelectEvent.conditionId,
    })
    console.log('getOrderList',res);
    if(res.success){
      state.handicapData = res.obj
    }
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <div class="w-full !pb-[80px] min-h-screen !px-[10px] lg:!px-[16px] 2xl:!px-0">
    <!-- <div>
      <img src="@/assets/img/market_bg1.png" class="w-full !h-[127px] object-cover" />
    </div> -->
    <div class="!mt-[16px]">
      <div class="flex flex-col lg:flex-row gap-[10px] lg:gap-[16px]">
        <div
          class="flex-1 lg:flex-[0.7] rounded-[10px] lg:rounded-[25px] bg-[#1B1B1B] !p-[10px] md:!px-[20px] md:!py-[30px] lg:!px-[30px] lg:!py-[36px]"
        >
          <div class="flex items-center gap-[10px] lg:gap-[24px] flex-1">
            <img
              :src="state.dataObj?.imgUrl"
              class="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[80px] lg:h-[80px] rounded-[10px] object-cover"
            />
            <div class="flex flex-col gap-[5px] lg:gap-[10px] justify-center lg:h-[80px] flex-1">
              <div class="text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px] text-[#fff]">
                {{ state.dataObj?.topic }}
              </div>
              <div class="flex" v-if="state.dataObj?.conditionList?.length == 1">
                <div class="text-[#787878] text-[12px] md:text-[14px] lg:text-[16px] inline-block">
                  Trending
                </div>
              </div>
              <div class="items-center gap-[20px] sm:flex" v-else>
                <div class="flex sm:flex-col gap-[4px] lg:gap-[8px]">
                  <div class="text-[#787878] text-[12px] lg:text-[14px]">Total Volume</div>
                  <div
                    class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[20px]"
                  >
                    {{ $formatAmount(calcTotalPrice(state.dataObj.conditionList)) }}
                  </div>
                </div>
                <div class="flex sm:flex-col gap-[4px] lg:gap-[8px]">
                  <div class="text-[#787878] text-[12px] lg:text-[14px]">Est. End Date</div>
                  <div
                    class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[20px]"
                  >
                    {{ dayjs(Number(state.dataObj.endTime) * 1000).format('MMM D, YYYY') }}
                  </div>
                </div>
                <div class="flex sm:flex-col gap-[4px] lg:gap-[8px]">
                  <div class="text-[#787878] text-[12px] lg:text-[14px]">Settlement Token</div>
                  <div
                    class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-[20px]"
                  >
                    {{ network[env.VITE_APP_CHAIN].Denomination }}({{
                      network[env.VITE_APP_CHAIN].label
                    }})
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="!mt-[30px] grid grid-cols-3 lg:flex items-center gap-[20px]"
            v-if="state.dataObj?.conditionList?.length == 1"
          >
            <div class="flex flex-col gap-[4px]">
              <div class="text-[#787878] text-[12px] lg:text-[14px]">Outcome</div>
              <div class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]">Yes</div>
            </div>
            <div class="flex flex-col gap-[4px]">
              <div class="text-[#787878] text-[12px] lg:text-[14px] whitespace-nowrap">
                % Chance
              </div>
              <div class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]">
                {{ calcPercent(state.curSelectEvent, 'yes') }} %
              </div>
            </div>
            <div class="flex flex-col gap-[4px]">
              <div class="text-[#787878] text-[12px] lg:text-[14px]">Last Price</div>
              <div class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]">{{ calcPercent(state.curSelectEvent, 'yes') }} ¢</div>
            </div>
            <div class="flex flex-col gap-[4px]">
              <div class="text-[#787878] text-[12px] lg:text-[14px]">24h Change</div>
              <div class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]">{{state.dayChange}}%</div>
            </div>
            <div class="flex flex-col gap-[4px]">
              <div class="text-[#787878] text-[12px] lg:text-[14px]">Total Volume</div>
              <div class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]">
                {{ $formatAmount(calcTotalPrice(state.dataObj.conditionList)) }}
              </div>
            </div>
            <div class="flex flex-col gap-[4px]">
              <div class="text-[#787878] text-[12px] lg:text-[14px]">Est. End Date</div>
              <div class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]">
                {{ dayjs(Number(state.dataObj.endTime) * 1000).format('MMM D, YYYY') }}
              </div>
            </div>
            <div class="flex-col gap-[4px] hidden lg:flex">
              <div class="text-[#787878] text-[12px] lg:text-[14px]">Settlement Token</div>
              <div class="text-[#A2D00C] text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]">
                {{ network[env.VITE_APP_CHAIN].Denomination }}({{
                  network[env.VITE_APP_CHAIN].label
                }})
              </div>
            </div>
          </div>
          <div class="w-full lg:w-[65%] !px-[16px] !mt-[16px] flex items-center" v-else>
            <div class="flex-1 text-[14px] text-[#85888E]">Outcome</div>
            <div
              class="flex-1 text-[14px] text-[#85888E] flex gap-[20px] lg:gap-[60px] items-center"
            >
              <div>% Chance</div>
              <div>Volume</div>
            </div>
          </div>
          <div
            class="!mt-[28px] lg:!pt-[23px]"
            v-if="state.dataObj?.conditionList?.length == 1"
          >
            <div class="flex items-center gap-[16px]">
              <img src="@/assets/img/conChart.png" class="w-[24px] h-[24px]" />
              <div class="flex items-center gap-[4px]">
                <div
                  class="flex text-[14px] !py-[4px] !px-[10px] h-[32px] leading-[20px] rounded-[8px] items-center text-[#CECFD2] cursor-pointer"
                  :style="
                    state.selectTimeLine == index
                      ? `font-family: inter-bold;color:#CCFA15;border:1px solid rgb(51, 55, 65);background:rgb(19, 19, 22);`
                      : `font-family: inter-bold;`
                  "
                  v-for="(item,index) in state.timeLine"
                  :key="item.id"
                  @click="state.selectTimeLine = index"
                >
                  {{ item.title }}
                </div>
              </div>
            </div>
            <div class="flex flex-col lg:flex-row items-center gap-[16px]">
              <chart :chartData="state.chartData" />
              <handicap :handicapData="state.handicapData" />
            </div>
          </div>
          <div class="border border-solid border-[#384250] rounded-[20px] overflow-hidden" v-else>
            <v-expansion-panels variant="accordion" v-model="state.selectPanel">
              <v-expansion-panel
                v-for="item in state.dataObj.conditionList"
                :key="item.guid"
                :value="item.guid"
              >
                <template #title>
                  <div class="w-[90%] items-center hidden sm:flex">
                    <div class="flex-1 flex items-center gap-[8px]">
                      <div class="text-[16px] w-[140px] truncate">{{ item.conditionDesc }}</div>
                      <div
                        class="cursor-pointer text-[#A2CA04] !px-[6px] !py-[2px] text-[14px] relative"
                      >
                        Rules
                        <div
                          class="absolute top-0 left-0 z-10 rounded-[4px] border border-solid border-[#333741] bg-[#131316] !px-[6px] !py-[2px] text-[14px]"
                          @click.stop="handleClickRule(item)"
                        >
                          Rules
                        </div>
                      </div>
                    </div>
                    <div class="flex-1 flex items-center">
                      <div class="text-[16px] text-[#CECFD2] flex-1 !pl-[20px]">
                        {{ calcPercent(item, 'yes') }}%
                      </div>
                      <div class="text-[16px] text-[#94969C] flex-1">
                        ${{ $formatAmount(calcTotalPrice([item])) }}
                      </div>
                    </div>
                    <div class="flex-1 flex items-center gap-[8px]">
                      <div
                        class="flex-1 relative cursor-pointer h-[36px] rounded-[12px] flex items-center gap-[5px] text-[#fff] justify-center"
                      >
                        <div class="text-[14px]">Yes</div>
                        <div class="text-[14px]">{{ calcPercent(item, 'yes') }}</div>
                        <div
                          class="w-full cursor-pointer border border-solid !border-[#0AB45A] h-[36px] rounded-[12px] flex items-center gap-[5px] text-[#fff] justify-center absolute top-0 left-0 z-10"
                          :style="item.outcome == 0 ? 'background:#0AB45A' : ''"
                          @click.stop="handleClickPanel(item, '0')"
                        >
                          <div class="text-[14px]">Yes</div>
                          <div class="text-[14px]">{{ calcPercent(item, 'yes') }}</div>
                        </div>
                      </div>
                      <div
                        class="flex-1 relative cursor-pointer h-[36px] rounded-[12px] flex items-center gap-[5px] text-[#fff] justify-center"
                      >
                        <div class="text-[14px]">No</div>
                        <div class="text-[14px]">{{ calcPercent(item, 'no') }}</div>
                        <div
                          class="w-full cursor-pointer border border-solid !border-[#E72F2F] h-[36px] rounded-[12px] flex items-center gap-[5px] text-[#fff] justify-center absolute top-0 left-0 z-10"
                          :style="item.outcome == 1 ? 'background:#E72F2F' : ''"
                          @click.stop="handleClickPanel(item, '1')"
                        >
                          <div class="text-[14px]">No</div>
                          <div class="text-[14px]">{{ calcPercent(item, 'no') }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-[90%] flex flex-col gap-[10px] sm:hidden">
                    <div class="w-full flex items-center">
                      <div class="flex-1 flex items-center">
                        <div class="text-[16px] w-[100px] truncate">{{ item.conditionDesc }}</div>
                        <div
                          class="cursor-pointer text-[#A2CA04] !px-[6px] !py-[2px] text-[14px] relative"
                        >
                          Rules
                          <div
                            class="absolute top-0 left-0 z-10 rounded-[4px] border border-solid border-[#333741] bg-[#131316] !px-[6px] !py-[2px] text-[14px]"
                            @click.stop="handleClickRule(item)"
                          >
                            Rules
                          </div>
                        </div>
                      </div>
                      <div class="flex-1 flex items-center">
                        <div class="text-[16px] text-[#CECFD2] flex-1 !pl-[20px]">
                          {{ calcPercent(item, 'yes') }}%
                        </div>
                        <div class="text-[16px] text-[#94969C] flex-1">
                          ${{ $formatAmount(calcTotalPrice([item])) }}
                        </div>
                      </div>
                    </div>
                    <div class="flex-1 flex items-center gap-[8px]">
                      <div
                        class="flex-1 relative cursor-pointer h-[36px] rounded-[12px] flex items-center gap-[5px] text-[#fff] justify-center"
                      >
                        <div class="text-[14px]">Yes</div>
                        <div class="text-[14px]">{{ calcPercent(item, 'yes') }}</div>
                        <div
                          class="w-full cursor-pointer border border-solid !border-[#0AB45A] h-[36px] rounded-[12px] flex items-center gap-[5px] text-[#fff] justify-center absolute top-0 left-0 z-10"
                          :style="item.outcome == 0 ? 'background:#0AB45A' : ''"
                          @click.stop="handleClickPanel(item, '0')"
                        >
                          <div class="text-[14px]">Yes</div>
                          <div class="text-[14px]">{{ calcPercent(item, 'yes') }}</div>
                        </div>
                      </div>
                      <div
                        class="flex-1 relative cursor-pointer h-[36px] rounded-[12px] flex items-center gap-[5px] text-[#fff] justify-center"
                      >
                        <div class="text-[14px]">No</div>
                        <div class="text-[14px]">{{ calcPercent(item, 'no') }}</div>
                        <div
                          class="w-full cursor-pointer border border-solid !border-[#E72F2F] h-[36px] rounded-[12px] flex items-center gap-[5px] text-[#fff] justify-center absolute top-0 left-0 z-10"
                          :style="item.outcome == 1 ? 'background:#E72F2F' : ''"
                          @click.stop="handleClickPanel(item, '1')"
                        >
                          <div class="text-[14px]">No</div>
                          <div class="text-[14px]">{{ calcPercent(item, 'no') }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template #text>
                  <div>
                    <div class="flex items-center gap-[16px]">
                      <img src="@/assets/img/conChart.png" class="w-[24px] h-[24px]" />
                      <div class="flex items-center gap-[4px]">
                        <div
                          class="flex text-[14px] !py-[4px] !px-[10px] h-[32px] leading-[20px] rounded-[8px] items-center text-[#CECFD2] cursor-pointer"
                          :style="
                            state.selectTimeLine == index
                              ? `font-family: inter-bold;color:#CCFA15;border:1px solid rgb(51, 55, 65);background:rgb(19, 19, 22);`
                              : `font-family: inter-bold;`
                          "
                          v-for="(item,index) in state.timeLine"
                          :key="item.id"
                          @click="state.selectTimeLine = index"
                        >
                          {{ item.title }}
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-col lg:flex-row items-center gap-[16px]">
                      <chart :chartData="state.chartData" />
                      <handicap :handicapData="state.handicapData" />
                    </div>
                  </div>
                </template>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
        <div
          class="flex-1 lg:flex-[0.3] rounded-[25px] bg-[#1B1B1B] !p-[16px] overflow-hidden"
          style="border: 1px solid rgba(135, 135, 135, 0.2)"
        >
          <exchange
            :curSelectEvent="state.curSelectEvent"
            @success="getMarketInfo"
            @selectOutcome="selectOutcome"
          />
        </div>
      </div>
      <comment />
    </div>
    <v-dialog max-width="500" v-model="state.isShowDialog">
      <div class="!p-[16px] rounded-[20px] bg-[#131316]">
        <div class="w-full flex items-center justify-between">
          <div class="text-[#fff] text-[20px]">Rules</div>
          <v-icon
            color="#fff"
            icon="mdi-close"
            size="16"
            class=" cursor-pointer"
            @click="state.isShowDialog = false"
          ></v-icon>
        </div>
        <div class="!mt-[12px] rounded-[12px] border border-solid border-[#87878733] bg-[#1A1A1E] !p-[16px] max-h-[470px] overflow-y-auto text-[16px]">
          <!-- {{ state.curRules }} -->
            {{ state.dataObj?.description }}
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
