<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import settingSvg from '@/assets/img/setting.svg'
import { useRoute } from 'vue-router'
import GuessMarketAbi from '@/abi/GuessMarket.json'
import network from '@/utils/network'
import Erc20ABi from '@/abi/erc_20.json'
import { store } from '@/store'
import { api } from '@/apis'
import { debounce } from '@/utils/debounce'
import { useToast } from 'vue-toastification'

const state = reactive({
  tabList: [
    { title: 'BUY', value: '1' },
    { title: 'SELL', value: '2',disabled:true },
  ],
  buyOrder: {
    outcome: '0', //0-yes，1-no
    orderType: '1', //1 Market,2 limit
    buyType: '1', //1 amount,2shares
    limitPrice: 0,
    slider: 0,
    amount: 0,
    checkSlip: false, //是否使用滑点
    slippage: 0,
    loading: false,
    totalPrice: 0, // 总共需要支付的价格
    curAvgPrice: 0, // 当前每份价格
  },
  eventId: '',
  tokenContract: null,
  marketContract: null,
  usdoAllowancebalance: 0,
  balanceOfUsdo: 0,
})

const props = defineProps({
  curSelectEvent:{
    type:Object,
  }
})

const toast = useToast();

const conditionId = computed(()=>props.curSelectEvent?.conditionId)
const outcome = computed(()=>props.curSelectEvent?.outcome)

const route = useRoute()

const env = computed(()=> import.meta.env)

const btnForBuyDisabled = computed(() => {
  return (
    !Number(state.balanceOfUsdo) ||
    !Number(state.buyOrder.amount) ||
    Number(state.buyOrder.totalPrice) > Number(state.balanceOfUsdo)
  )
})

onMounted(async () => {
  state.eventId = route.query.eventId
  // state.conditionId = route.query.conditionId
  console.log('onMounted', state.eventId)
  initErc20Contract()
  await initControlContract()
  getTokenBalance()
})

const appStore = store.useAppStore()

watch(()=>state.buyOrder.slider,(newVal)=>{
  // console.log('buyOrder',newVal);
  if(state.buyOrder.buyType == '1'){
    state.buyOrder.totalPrice = newVal
  }else if(state.buyOrder.buyType == '2'){
    state.buyOrder.totalPrice = newVal
    debounce(()=>getAmountByCost())
  }
  
})

watch(
  ()=>[state.buyOrder.amount,outcome.value,state.buyOrder.buyType],
  () => {
    if(state.buyOrder.buyType == '1') return
    // if(Number(newVal) === 0) {
    //   state.buyOrder.curAvgPrice = 0
    //   return
    // }
    debounce(()=>getPriceByAmount())
  },
)

watch(
  ()=>[state.buyOrder.totalPrice,outcome.value,state.buyOrder.buyType],
  () => {
    state.buyOrder.slider = state.buyOrder.totalPrice
    if(state.buyOrder.buyType == '2') return
    // if(Number(newVal) === 0) {
    //   state.buyOrder.curAvgPrice = 0
    //   return
    // }
    debounce(()=>getAmountByCost())
  },
)

const emit = defineEmits(["success","selectOutcome"]);

function calcPercent(type) {
  const totalAmount = props.curSelectEvent?.yesAmount + props.curSelectEvent?.noAmount
  if(Number(totalAmount) === 0) return 0
  if(type === 'yes'){
    return ( props.curSelectEvent?.yesAmount/totalAmount * 100).toFixed(1)
  }else if(type === 'no'){
    return (props.curSelectEvent?.noAmount/totalAmount * 100).toFixed(1)
  }
}

function initErc20Contract() {
  state.tokenContract = appStore.initErc20Contract(
    network[import.meta.env.VITE_APP_CHAIN][network[import.meta.env.VITE_APP_CHAIN].Denomination],
    Erc20ABi,
  )
}

async function initControlContract() {
  // console.log("controlContract", Control.abi);
  // await kiwi.util_base.sleep(1000);
  state.marketContract = await appStore.initErc20ContractSign(
    network[import.meta.env.VITE_APP_CHAIN].marketContract,
    GuessMarketAbi.abi,
  )
}

async function getTokenBalance() {
  if (!state.tokenContract) return
  const balance = await state.tokenContract.balanceOf(appStore.tomeState.curWalletAddress)
  state.balanceOfUsdo = appStore.formatUnits(balance)
  console.log('balanceOfUsdo', state.balanceOfUsdo)
}

async function allowanceForUsdo() {
  const allowance = await state.tokenContract.allowance(
    appStore.tomeState.curWalletAddress,
    network[import.meta.env.VITE_APP_CHAIN].marketContract,
  )
  state.usdoAllowancebalance = appStore.formatUnits(allowance)
  console.log('allowance11111', state.usdoAllowancebalance)
}

async function approveUsdo(value) {
  const tokenContractForUsdo = await appStore.initErc20ContractSign(
    network[import.meta.env.VITE_APP_CHAIN][network[import.meta.env.VITE_APP_CHAIN].Denomination],
    Erc20ABi,
  )
  console.log('tokenContractForUsdo', tokenContractForUsdo)

  const approvalTx = await tokenContractForUsdo.approve(
    network[import.meta.env.VITE_APP_CHAIN].marketContract,
    appStore.parseUnits(Math.ceil(value)), // 授权最大额度，也可以只授权所需数量
  )
  await approvalTx.wait()
  await allowanceForUsdo()
}

// 通过份数算出价格
async function getEstimatedPrice() {
  try {
    // console.log('getEstimatedPrice',state.eventId,state.conditionId,state.amount,outcome.value);
    const res = await state.marketContract.getEstimatedPrice(
      state.eventId,
      conditionId.value,
      state.buyOrder.amount,
      outcome.value,
    )
    // console.log('getEstimatedPrice', appStore.formatUnits(res[0]),appStore.formatUnits(res[1]))
    state.buyOrder.curAvgPrice = Number(appStore.formatUnits(res[0]))
    state.buyOrder.totalPrice = Number(appStore.formatUnits(res[1]))
  } catch (error) {
    console.error(error)
  }
}

async function getPriceByAmount() {
  try {
    const res = await api.getPriceByAmount({
      amount:state.buyOrder.amount,
      eventId:state.eventId,
      conditionId:conditionId.value,
      option:outcome.value
   })
   if(res.success){
    state.buyOrder.curAvgPrice = Number(appStore.formatUnits(res.obj.price))
    state.buyOrder.totalPrice = Number(appStore.formatUnits(res.obj.cost))
   }
  } catch (error) {
    console.error(error);
  }
}

async function getAmountByCost() {
  try {
    const res = await api.getAmountByCost({
      cost:appStore.parseUnits(state.buyOrder.totalPrice),
      eventId:state.eventId,
      conditionId:conditionId.value,
      option:outcome.value
   })
   if(res.success){
    state.buyOrder.curAvgPrice = Number(appStore.formatUnits(res.obj.price))
    state.buyOrder.amount = Number(res.obj?.amount)
   }
  } catch (error) {
    console.error(error);
  }
}

function handleClickMax() {
  state.buyOrder.slider = Number(state.balanceOfUsdo)
  if(state.buyOrder.buyType == '1'){
    state.buyOrder.totalPrice = Number(state.balanceOfUsdo)
  }else if(state.buyOrder.buyType == '2'){
    state.buyOrder.totalPrice = Number(state.balanceOfUsdo)
    getAmountByCost()
  }
}

async function handleClickBuy() {
  try {
    state.buyOrder.loading = true
    await allowanceForUsdo()
    if (Number(state.usdoAllowancebalance) < Number(state.buyOrder.amount)) {
      await approveUsdo(state.buyOrder.amount)
    }
    console.log(
      'eventId:' + state.eventId,
      'conditionId:' + conditionId.value,
      'outcome:' + outcome.value,
      'amount:' + state.buyOrder.amount,
    )

    const res = await state.marketContract.bet(
      state.eventId,
      conditionId.value,
      outcome.value,
      state.buyOrder.amount,
    )
    console.log('handleClickBuy', res)
    await res.wait()
    setTimeout(() => {
      emit("success");
    }, 2000);
  } catch (error) {
    console.error(error)
  } finally {
    state.buyOrder.loading = false
  }
}
</script>

<template>
  <div>
    <v-tabs v-model="state.currentTab" fixed-tabs align-tabs="center" color="#0AB45A" height="60">
      <v-tab :value="item.value" v-for="item in state.tabList" style="font-size: 20px" :disabled="item.disabled">{{
        item.title
      }}</v-tab>
    </v-tabs>
    <v-tabs-window v-model="state.currentTab">
      <v-tabs-window-item value="1">
        <div class="flex flex-col gap-[30px] !mt-[20px]">
          <div>
            <div class="text-[#0AB45A] text-[16px] leading-[16px] font-bold">Outcome</div>
            <div class="!mt-[16px] flex items-center h-[38px]">
              <div
                class="flex-1 h-full flex items-center justify-center rounded-l-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  outcome == '0'
                    ? 'background-color:#0AB45A;border-top:1px solid #0AB45A;border-left:1px solid #0AB45A;border-bottom:1px solid #0AB45A;'
                    : 'border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="emit('selectOutcome','0')"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="outcome == '0' ? 'color:#fff' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Yes {{ calcPercent('yes') }}</div>
                  <!-- <div class="text-[16px] leading-[16px] font-bold text-center">SOL</div> -->
                </div>
              </div>
              <div
                class="flex-1 h-full flex items-center justify-center rounded-r-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  outcome == '1'
                    ? 'background-color:#E72F2F;border-top:1px solid #E72F2F;border-right:1px solid #E72F2F;border-bottom:1px solid #E72F2F;'
                    : 'border-top:1px solid #DBDBDB;border-right:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="emit('selectOutcome','1')"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="outcome == '1' ? 'color:#fff' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">No {{ calcPercent('no') }}</div>
                  <!-- <div class="text-[16px] leading-[16px] font-bold text-center">SOL</div> -->
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="text-[#0AB45A] text-[16px] leading-[16px] font-bold">Order Type</div>
            <div class="!mt-[16px] flex items-center h-[38px]">
              <div
                class="flex-1 h-full flex items-center justify-center rounded-l-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  state.buyOrder.orderType == '1'
                    ? 'background-color:#0AB45A;border-top:1px solid #0AB45A;border-right:1px solid #0AB45A;border-bottom:1px solid #0AB45A;'
                    : 'border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="state.buyOrder.orderType = '1'"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="state.buyOrder.orderType == '1' ? 'color:#fff' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Market</div>
                </div>
              </div>
              <div
                class="flex-1 h-full flex items-center justify-center rounded-r-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  state.buyOrder.orderType == '2'
                    ? 'background-color:#0AB45A;border-top:1px solid #0AB45A;border-right:1px solid #0AB45A;border-bottom:1px solid #0AB45A;'
                    : 'border-top:1px solid #DBDBDB;border-right:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="debounce(()=>{toast.info('coming soon')})"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="state.buyOrder.orderType == '2' ? 'color:#fff' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Limit</div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="state.buyOrder.orderType == '2'">
            <div class="text-[#0AB45A] text-[16px] leading-[16px] font-bold">Limit Price</div>
            <div
              class="!mt-[16px] border border-solid border-[#DBDBDB] rounded-[10px] overflow-hidden flex items-center"
            >
              <v-number-input
                control-variant="split"
                density="compact"
                variant="plain"
                v-model:model-value="state.buyOrder.limitPrice"
                :hide-details="true"
                base-color="#1b1b1b"
                bgColor="#1b1b1b"
                style="height: 38px"
                height="60"
                :min="0"
              >
              </v-number-input>
            </div>
          </div>
          <div>
            <div class="text-[#0AB45A] text-[16px] leading-[16px] font-bold">Buy In</div>
            <div class="!mt-[16px] flex items-center h-[38px]">
              <div
                class="flex-1 h-full flex items-center justify-center rounded-l-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  state.buyOrder.buyType == '1'
                    ? 'background-color:#0AB45A;border-top:1px solid #0AB45A;border-right:1px solid #0AB45A;border-bottom:1px solid #0AB45A;'
                    : 'border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="state.buyOrder.buyType = '1'"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="state.buyOrder.buyType == '1' ? 'color:#fff' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Amount</div>
                </div>
              </div>
              <div
                class="flex-1 h-full flex items-center justify-center rounded-r-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  state.buyOrder.buyType == '2'
                    ? 'background-color:#0AB45A;border-top:1px solid #0AB45A;border-right:1px solid #0AB45A;border-bottom:1px solid #0AB45A;'
                    : 'border-top:1px solid #DBDBDB;border-right:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="state.buyOrder.buyType = '2'"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="state.buyOrder.buyType == '2' ? 'color:#fff' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Shares</div>
                </div>
              </div>
            </div>
            <!-- slider -->
            <div class="!mt-[10px] relative !px-[10px]">
              <div
                class="absolute pointer-none left-[10px] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="state.buyOrder.slider > 0 ? 'background-color:#0AB45A' : ''"
              ></div>
              <div
                class="absolute pointer-none left-[25%] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="Math.floor(state.buyOrder.slider / Number(state.balanceOfUsdo) *100 )>= 25 ? 'background-color:#0AB45A' : ''"
              ></div>
              <div
                class="absolute pointer-none left-[50%] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="Math.floor(state.buyOrder.slider / Number(state.balanceOfUsdo) *100) >= 50 ? 'background-color:#0AB45A' : ''"
              ></div>
              <div
                class="absolute pointer-none left-[75%] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="Math.floor(state.buyOrder.slider / Number(state.balanceOfUsdo) *100) >= 75 ? 'background-color:#0AB45A' : ''"
              ></div>
              <div
                class="absolute pointer-none left-[100%] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="Math.floor(state.buyOrder.slider / Number(state.balanceOfUsdo) *100) == 100 ? 'background-color:#0AB45A' : ''"
              ></div>
              <v-slider
                color="#0AB45A"
                v-model="state.buyOrder.slider"
                :hide-details="true"
                track-color="#333741"
                thumb-size="13"
                :readonly="false"
                :max="Number(state.balanceOfUsdo)"
              ></v-slider>
            </div>
            <div
              class="w-full flex items-center justify-end gap-[5px] text-[16px] leading-[16px] text-[#cecfd2]"
            >
              <div>{{ $formatAmount(state.balanceOfUsdo) }} {{ network[env.VITE_APP_CHAIN].Denomination }}</div>
              <div
                class="text-[#0AB45A] underline text-[14px] leading-[14px] cursor-pointer font-bold"
                @click="handleClickMax"
              >
                Max
              </div>
            </div>
            <div
              class="!mt-[16px] border border-solid border-[#DBDBDB] rounded-[10px] overflow-hidden"
              v-show="state.buyOrder.buyType == 1"
            >
              <v-number-input
                control-variant="split"
                density="compact"
                variant="plain"
                v-model:model-value="state.buyOrder.totalPrice"
                :hide-details="true"
                base-color="#1b1b1b"
                bgColor="#1b1b1b"
                style="height: 38px"
                height="60"
                :min="0"
                :precision="2"
              >
              </v-number-input>
            </div>
            <div
              class="!mt-[16px] border border-solid border-[#DBDBDB] rounded-[10px] overflow-hidden"
              v-show="state.buyOrder.buyType == 2"
            >
              <v-number-input
                control-variant="split"
                density="compact"
                variant="plain"
                v-model:model-value="state.buyOrder.amount"
                :hide-details="true"
                base-color="#1b1b1b"
                bgColor="#1b1b1b"
                style="height: 38px"
                height="60"
                :min="0"
                :precision="2"
              >
              </v-number-input>
            </div>
          </div>
          <div class="flex flex-col text-[14px]">
            <div class="flex items-center justify-between">
              <v-tooltip
                text="The average price estimate based on the current market, the actual execution price may differ"
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Est Avg Price
                  </div>
                </template>
              </v-tooltip>
              <div class="text-[#cecfd2]">{{ $formatAmount(state.buyOrder.curAvgPrice) }}</div>
            </div>
            <div class="flex items-center justify-between">
              <v-tooltip
                text="Estimated number of shares based on current market. Actual quantity may vary upon execution."
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Shares
                  </div>
                </template>
              </v-tooltip>
              <div class="text-[#cecfd2]">{{ $formatAmount(state.buyOrder.amount) }}</div>
            </div>
            <div class="flex items-center justify-between">
              <v-tooltip
                text="Projected profit if the final outcome is correct. Calculated with each share resolving at $1, based on estimated purchase price."
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Potential Profit
                  </div>
                </template>
              </v-tooltip>
              <div class="text-[#cecfd2]">--</div>
            </div>
            <div class="flex items-center justify-between">
              <v-tooltip
                text="The Est. Fee is for reference only, and is subject to the final execution result. Fee rates may be different for Maker or Taker trades."
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Est. Fee
                  </div>
                </template>
              </v-tooltip>
              <div class="text-[#cecfd2]">--</div>
            </div>
          </div>
          <div>
            <v-btn
              variant="text"
              class="!rounded-full !h-[44px] !w-full !bg-[#0AB45A]"
              :loading="state.buyOrder.loading"
              :disabled="btnForBuyDisabled"
              @click="handleClickBuy"
            >
              <div class="text-[#fff] text-[18px]">Confirm Buy <span v-show="state.buyOrder.totalPrice>0">${{ $formatAmount(state.buyOrder.totalPrice) }}</span></div>
            </v-btn>
          </div>
          <!-- <div class="flex items-center gap-[5px]">
            <v-checkbox
              :model-value="state.buyOrder.checkSlip"
              color="#0AB45A"
              :hide-details="true"
            ></v-checkbox>
            <v-tooltip
              text="Your transaction will revert if prices change unfavorably due to other orders. This does not account for slippage caused by your own order."
              location="top"
              max-width="400"
            >
              <template v-slot:activator="{ props }">
                <div
                  v-bind="props"
                  class="text-[#cecfd2] border-b border-dotted border-[#333741] text-[14px]"
                >
                  Slippage Tolerance
                </div>
              </template>
            </v-tooltip>
            <div class="text-[#cecfd2] text-[14px]">2.0%</div>
            <v-menu location="bottom" :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <div v-bind="props" class="cursor-pointer">
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="setting"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"
                    ></path>
                  </svg>
                </div>
              </template>
              <v-card min-width="300" class="!rounded-[10px]">
                <v-list>
                  <v-list-item>
                    <div class="flex flex-col gap-[5px]">
                      <div>
                        <span
                          class="text-[#cecfd2] border-b border-dotted border-[#333741] text-[14px] inline-block"
                        >
                          Slippage Tolerance
                        </span>
                      </div>

                      <div class="flex items-center gap-[5px]">
                        <div class="flex-[0.6]">
                          <v-btn-group variant="outlined" divided class="!rounded-[10px]">
                            <v-btn @click="state.buyOrder.slippage = 1">1%</v-btn>
                            <v-btn @click="state.buyOrder.slippage = 2">2%</v-btn>
                            <v-btn @click="state.buyOrder.slippage = 5">5%</v-btn>
                          </v-btn-group>
                        </div>
                        <div
                          class="flex-[0.4] flex items-center border border-solid border-[rgba(255,255,255,.12)] h-[48px] rounded-[10px] !px-[10px]"
                        >
                          <v-text-field
                            density="compact"
                            variant="plain"
                            type="number"
                            v-model:model-value="state.buyOrder.slippage"
                            :hide-details="true"
                            bgColor=""
                            hide-spin-buttons
                            :reverse="true"
                            :min="0"
                            prefix="%"
                            :tile="true"
                            single-line
                            width="100"
                          >
                          </v-text-field>
                        </div>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div> -->
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="2">
        <div class="flex flex-col gap-[30px] !mt-[20px]">
          <div>
            <div class="text-[#0AB45A] text-[16px] leading-[16px] font-bold">Outcome</div>
            <div class="!mt-[16px] flex items-center h-[38px]">
              <div
                class="flex-1 h-full flex items-center justify-center rounded-l-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  outcome == '0'
                    ? 'background-color:#0AB45A'
                    : 'border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="selectOutcome('0')"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="outcome == '0' ? 'color:#000' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Yes 0.442948294</div>
                  <!-- <div class="text-[16px] leading-[16px] font-bold text-center">SOL</div> -->
                </div>
              </div>
              <div
                class="flex-1 h-full flex items-center justify-center rounded-r-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  outcome == '1'
                    ? 'background-color:#0AB45A'
                    : 'border-top:1px solid #DBDBDB;border-right:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="selectOutcome('1')"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="outcome == '1' ? 'color:#000' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">No 0.442948294</div>
                  <!-- <div class="text-[16px] leading-[16px] font-bold text-center">SOL</div> -->
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="text-[#0AB45A] text-[16px] leading-[16px] font-bold">Order Type</div>
            <div class="!mt-[16px] flex items-center h-[38px]">
              <div
                class="flex-1 h-full flex items-center justify-center rounded-l-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  state.buyOrder.orderType == '1'
                    ? 'background-color:#0AB45A'
                    : 'border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="state.buyOrder.orderType = '1'"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="state.buyOrder.orderType == '1' ? 'color:#000' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Market</div>
                </div>
              </div>
              <div
                class="flex-1 h-full flex items-center justify-center rounded-r-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  state.buyOrder.orderType == '2'
                    ? 'background-color:#0AB45A'
                    : 'border-top:1px solid #DBDBDB;border-right:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="state.buyOrder.orderType = '2'"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="state.buyOrder.orderType == '2' ? 'color:#000' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Limit</div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="state.buyOrder.orderType == '2'">
            <div class="text-[#0AB45A] text-[16px] leading-[16px] font-bold">Limit Price</div>
            <div
              class="!mt-[16px] border border-solid border-[#DBDBDB] rounded-[10px] overflow-hidden"
            >
              <v-number-input
                control-variant="split"
                density="compact"
                variant="plain"
                v-model:model-value="state.buyOrder.limitPrice"
                :hide-details="true"
                base-color="#1b1b1b"
                bgColor="#1b1b1b"
                style="height: 38px"
                height="60"
                :min="0"
              >
              </v-number-input>
            </div>
          </div>
          <div>
            <div class="text-[#0AB45A] text-[16px] leading-[16px] font-bold">Buy In</div>
            <div class="!mt-[16px] flex items-center h-[38px]">
              <div
                class="flex-1 h-full flex items-center justify-center rounded-l-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  state.buyOrder.buyType == '1'
                    ? 'background-color:#0AB45A'
                    : 'border-top:1px solid #DBDBDB;border-left:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="state.buyOrder.buyType = '1'"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="state.buyOrder.buyType == '1' ? 'color:#000' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Amount</div>
                </div>
              </div>
              <div
                class="flex-1 h-full flex items-center justify-center rounded-r-[10px] cursor-pointer select-none"
                v-ripple
                :style="
                  state.buyOrder.buyType == '2'
                    ? 'background-color:#0AB45A'
                    : 'border-top:1px solid #DBDBDB;border-right:1px solid #DBDBDB;border-bottom:1px solid #DBDBDB;'
                "
                @click="state.buyOrder.buyType = '2'"
              >
                <div
                  class="flex flex-col gap-[10px]"
                  :style="state.buyOrder.buyType == '2' ? 'color:#000' : 'color:#9D9D9D'"
                >
                  <div class="text-[16px] leading-[16px]">Shares</div>
                </div>
              </div>
            </div>
            <!-- slider -->
            <div class="!mt-[10px] relative">
              <div
                class="absolute pointer-none left-0 top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="state.buyOrder.slider > 0 ? 'background-color:#0AB45A' : ''"
              ></div>
              <div
                class="absolute pointer-none left-[25%] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="state.buyOrder.slider >= 25 ? 'background-color:#0AB45A' : ''"
              ></div>
              <div
                class="absolute pointer-none left-[50%] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="state.buyOrder.slider >= 50 ? 'background-color:#0AB45A' : ''"
              ></div>
              <div
                class="absolute pointer-none left-[75%] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="state.buyOrder.slider >= 75 ? 'background-color:#0AB45A' : ''"
              ></div>
              <div
                class="absolute pointer-none left-[100%] top-[50%] translate-y-[-50%] w-[2px] h-[10px] bg-[#333741]"
                :style="state.buyOrder.slider == 100 ? 'background-color:#0AB45A' : ''"
              ></div>
              <v-slider
                color="#0AB45A"
                v-model="state.buyOrder.slider"
                :hide-details="true"
                track-color="#333741"
                thumb-size="13"
                :readonly="false"
              ></v-slider>
            </div>
            <div
              class="w-full flex items-center justify-end gap-[5px] text-[16px] leading-[16px] text-[#cecfd2]"
            >
              <div>1000 {{ network[env.VITE_APP_CHAIN].Denomination }}</div>
              <div
                class="text-[#0AB45A] underline text-[14px] leading-[14px] cursor-pointer font-bold"
              >
                Max
              </div>
            </div>
            <div
              class="!mt-[16px] border border-solid border-[#DBDBDB] rounded-[10px] overflow-hidden"
            >
              <v-number-input
                control-variant="split"
                density="compact"
                variant="plain"
                v-model:model-value="state.buyOrder.amount"
                :hide-details="true"
                base-color="#1b1b1b"
                bgColor="#1b1b1b"
                style="height: 38px"
                height="60"
                :min="0"
              >
              </v-number-input>
            </div>
          </div>
          <div class="flex flex-col text-[14px]">
            <div class="flex items-center justify-between">
              <v-tooltip
                text="The average price estimate based on the current market, the actual execution price may differ"
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Est Avg Price
                  </div>
                </template>
              </v-tooltip>
              <div class="text-[#cecfd2]">{{ state.curAvgPrice }} {{ network[env.VITE_APP_CHAIN].Denomination }}</div>
            </div>
            <div class="flex items-center justify-between">
              <v-tooltip
                text="Estimated number of shares based on current market. Actual quantity may vary upon execution."
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Shares
                  </div>
                </template>
              </v-tooltip>
              <div class="text-[#cecfd2]">0.00</div>
            </div>
            <div class="flex items-center justify-between">
              <v-tooltip
                text="Projected profit if the final outcome is correct. Calculated with each share resolving at $1, based on estimated purchase price."
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Potential Profit
                  </div>
                </template>
              </v-tooltip>
              <div class="text-[#cecfd2]">--</div>
            </div>
            <div class="flex items-center justify-between">
              <v-tooltip
                text="The Est. Fee is for reference only, and is subject to the final execution result. Fee rates may be different for Maker or Taker trades."
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Est. Fee
                  </div>
                </template>
              </v-tooltip>
              <div class="text-[#cecfd2]">--</div>
            </div>
          </div>
          <div>
            <v-btn
              variant="text"
              class="!rounded-full !h-[44px] !w-full !bg-[#0AB45A]"
              :disabled="false"
            >
              <div class="text-[#fff] text-[18px]">Confirm Sell</div>
            </v-btn>
          </div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-field__prepend-inner) {
  padding: 0 !important;
}

:deep(.v-field__append-inner) {
  padding: 0 !important;
}

:deep(.v-input--horizontal) {
  margin: 0 !important;
}

:deep(.v-field__input) {
  padding-top: 0;
}

:deep(.v-field__field) {
  align-items: center;
}

:deep(.v-text-field__prefix) {
  padding-top: 0;
}
</style>
