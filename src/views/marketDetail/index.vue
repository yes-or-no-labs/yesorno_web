<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
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
    { title: '1D', id: 1 },
    { title: '1W', id: 2 },
    { title: '1M', id: 3 },
    { title: 'ALL', id: 4 },
  ],
  selectTimeLine: 1,
  eventId: '',
  dataObj: {},
  curSelectEvent: null, //当前选择的事件
  selectPanel: '',
})

const route = useRoute()
const appStore = store.useAppStore()
const toast = useToast()

const env = computed(() => import.meta.env)

onMounted(async () => {
  state.eventId = route.query.eventId
  getMarketInfo()
})

async function getMarketInfo() {
  try {
    const res = await api.getMarketInfo({
      eventId: state.eventId,
    })
    console.log('getMarketInfo', res)
    if (res.success) {
      if(!state.curSelectEvent){
        state.curSelectEvent = res.obj?.conditionList[0]
      }
      for (const item of res.obj?.conditionList) {
          item.outcome = '0'
          if(item.guid === state.curSelectEvent.guid){
            state.curSelectEvent = item
            state.selectPanel = item.guid
          }
        }
      if (res.obj.conditionList.length > 1&&!state.curSelectEvent) {
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

function handleClickPanel(item,outcome) {
  console.log('handleClickPanel', state.selectPanel)
  if(outcome){
    item.outcome = outcome
    state.selectPanel = item.guid
  }
  state.curSelectEvent = item

}

function handleClickRule() {
  console.log('handleClickRule')

  debounce(() => toast.info('coming soon'))
}
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
              class="w-[80px] h-[80px] rounded-[10px]"
            />
            <div class="flex flex-col gap-[10px] justify-center h-[80px] flex-1">
              <div class="text-[24px] text-[#fff]" style="font-family: inter-bold">
                {{ state.dataObj?.topic }}
              </div>
              <div class="flex" v-if="state.dataObj?.conditionList?.length == 1">
                <div class="text-[#787878] text-[16px] inline-block">Trending</div>
              </div>
              <div class="flex items-center gap-[20px]" v-else>
                <div class="flex flex-col gap-[8px]">
                  <div
                    class="text-[#787878] text-[14px] leading-[14px]"
                    style="font-family: inter-bold"
                  >
                    Total Volume
                  </div>
                  <div
                    class="text-[#A2D00C] text-[20px] leading-[20px]"
                    style="font-family: inter-bold"
                  >
                    {{ $formatAmount(calcTotalPrice(state.dataObj.conditionList)) }}
                  </div>
                </div>
                <div class="flex flex-col gap-[8px]">
                  <div
                    class="text-[#787878] text-[14px] leading-[14px]"
                    style="font-family: inter-bold"
                  >
                    Est. End Date
                  </div>
                  <div
                    class="text-[#A2D00C] text-[20px] leading-[20px]"
                    style="font-family: inter-bold"
                  >
                    {{ dayjs(Number(state.dataObj.endTime) * 1000).format('MMM D, YYYY') }}
                  </div>
                </div>
                <div class="flex flex-col gap-[8px]">
                  <div
                    class="text-[#787878] text-[14px] leading-[14px]"
                    style="font-family: inter-bold"
                  >
                    Settlement Token
                  </div>
                  <div
                    class="text-[#A2D00C] text-[20px] leading-[20px]"
                    style="font-family: inter-bold"
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
            class="!mt-[30px] flex items-center gap-[20px]"
            v-if="state.dataObj?.conditionList?.length == 1"
          >
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                Outcome
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                Yes
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                % Chance
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                {{ calcPercent(state.curSelectEvent, 'yes') }} %
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                Last Price
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50 ¢
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                24h Change
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
                Total Volume
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                {{ $formatAmount(calcTotalPrice(state.dataObj.conditionList)) }}
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                Est. End Date
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                {{ dayjs(Number(state.dataObj.endTime) * 1000).format('MMM D, YYYY') }}
              </div>
            </div>
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                Settlement Token
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                {{ network[env.VITE_APP_CHAIN].Denomination }}({{
                  network[env.VITE_APP_CHAIN].label
                }})
              </div>
            </div>
          </div>
          <div class="w-[65%] !px-[16px] !mt-[16px] flex items-center" v-else>
            <div class="flex-1 text-[14px] text-[#85888E]">Outcome</div>
            <div class="flex-1 text-[14px] text-[#85888E] flex gap-[40px] items-center">
              <div>% Chance</div>
              <div>Volume</div>
            </div>
          </div>
          <div
            class="!mt-[28px] !pt-[23px]"
            style="border-top: 1px solid rgba(255, 255, 255, 0.1)"
            v-if="state.dataObj?.conditionList?.length == 1"
          >
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
              <chart />
              <handicap />
            </div>
          </div>
          <div class="border border-solid border-[#384250] rounded-[20px] overflow-hidden" v-else>
            <v-expansion-panels variant="accordion" v-model="state.selectPanel">
              <v-expansion-panel
                v-for="item in state.dataObj.conditionList"
                :key="item.guid"
                :value="item.guid"
                @click="handleClickPanel(item)"
              >
                <template #title>
                  <div class="w-[90%] flex items-center">
                    <div class="flex-1 flex items-center gap-[8px]">
                      <div class="text-[16px] w-[140px] truncate">{{ item.conditionDesc }}</div>
                      <div
                        class="cursor-pointer text-[#A2CA04] !px-[6px] !py-[2px] text-[14px] relative"
                      >
                        Rules
                        <div
                          class="absolute top-0 left-0 z-10 rounded-[4px] border border-solid border-[#333741] bg-[#131316] !px-[6px] !py-[2px] text-[14px]"
                          @click.stop="handleClickRule"
                        >
                          Rules
                        </div>
                      </div>
                    </div>
                    <div class="flex-1 flex items-center gap-[40px]">
                      <div class="text-[16px] text-[#CECFD2]">{{ calcPercent(item, 'yes') }}%</div>
                      <div class="text-[16px] text-[#94969C]">
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
                          :style="item.outcome==0?'background:#0AB45A':''"
                          @click.stop="handleClickPanel(item,'0')"
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
                          :style="item.outcome==1?'background:#E72F2F':''"
                          @click.stop="handleClickPanel(item,'1')"
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
                      <chart />
                      <handicap />
                    </div>
                  </div>
                </template>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
        <div
          class="flex-[0.3] rounded-[25px] bg-[#1B1B1B] !p-[16px] overflow-hidden"
          style="border: 1px solid rgba(135, 135, 135, 0.2)"
        >
          <exchange :curSelectEvent="state.curSelectEvent" @success="getMarketInfo" @selectOutcome="selectOutcome" />
        </div>
      </div>
      <comment />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
