<script setup>
import { store } from '@/store';
import network from '@/utils/network'
import { computed, reactive, watch } from 'vue';

const props = defineProps({
  handicapData:{}
})

const state = reactive({
  yesOrders:[],
  noOrders:[],
  spread:0,
  totalAmountForYes:0,
  totalAmountForNo:0
})

const appStore = store.useAppStore()
watch(()=>props.handicapData,()=>{
  console.log('props.handicapData',props.handicapData);
  const arr1 = [...props.handicapData.yesOrders]
  const arr2 = [...props.handicapData.noOrders]
  for (const item of arr1) {
    item.paidAmt = appStore.formatUnits(item.paidAmt)
    item.price = Number(item.paidAmt) / Number(item.amount)
    state.totalAmountForYes += Number(item.amount)
  }
  arr1.sort((a,b)=>b.price - a.price)
  // console.log('sort',arr1.sort((a,b)=>b.price - a.price));
  
  for (const item of arr2) {
    item.paidAmt = appStore.formatUnits(item.paidAmt)
    item.price = Number(item.paidAmt) / Number(item.amount)
    state.totalAmountForNo += Number(item.amount)
  }
  arr2.sort((a,b)=>b.price - a.price)
  state.yesOrders = arr1
  state.noOrders = arr2
  if(arr1.length>0&&arr2.length>0){
    state.spread = arr1[0].price - arr2[arr2.length-1].price
  }
})
const env = computed(()=> import.meta.env)

</script>


<template>
  <div class="w-full lg:flex-[0.3] !py-[8px] rounded-[8px] border border-solid border-[#333741]">
    <div class="flex items-center justify-between !px-[8px]">
      <div class="text-[12px] leading-[18px] font-[500] text-[#CECFD2] !pb-[4px]">Order book</div>
      <svg
        class="depchart_rotate__VzH13"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 20 20"
        fill="none"
        style="display: flex; align-items: center; cursor: pointer; transform: rotate(720deg)"
      >
        <path
          d="M9.99984 17.0834C13.9119 17.0834 17.0832 13.9121 17.0832 10C17.0832 7.64543 15.9343 5.55915 14.1665 4.27121M10.8332 18.6667L9.1665 17L10.8332 15.3334M9.99984 2.91671C6.08782 2.91671 2.9165 6.08802 2.9165 10C2.9165 12.3547 4.06539 14.4409 5.83317 15.7289M9.1665 4.66671L10.8332 3.00004L9.1665 1.33337"
          stroke="#FAFAFA"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </div>
    <div class="flex items-center !px-[8px]">
      <div class="flex-1 text-[12px] leading-[18px] text-[#85888E]">Price ({{ network[env.VITE_APP_CHAIN].Denomination }})</div>
      <div class="flex-1 text-[12px] leading-[18px] text-[#85888E] text-center">Shares</div>
      <div class="flex-1 text-[12px] leading-[18px] text-[#85888E] text-right">Total ({{ network[env.VITE_APP_CHAIN].Denomination }})</div>
    </div>
    <div class="max-h-[404px] h-[404px] flex flex-col">
      <div
        class="max-h-[189px] h-[189px] flex flex-col justify-end overflow-y-auto "
        style="scrollbar-width: none"
      >
        <div class="flex items-center w-full !px-[8px] h-[26px] relative" v-for="(item,index) in state.yesOrders" :key="index">
          <div class="flex-1 flex items-center gap-[4px] relative z-10">
            <div class="text-[12px] leading-[26px] text-[#FDA29B]">
              {{ $formatAmount(item.price) }} ¢
            </div>
          </div>
          <div class="flex-1 text-[12px] leading-[26px] text-[#CECFD2] text-center relative z-10">{{ $formatAmount(item.amount) }}</div>
          <div class="flex-1 text-[12px] leading-[26px] text-[#94969C] text-right relative z-10">{{ $formatAmount(item.paidAmt) }}</div>
          <div class="absolute left-0 top-0 bg-[#4A1A18] h-full" :style="`width:${(item.amount/state.totalAmountForYes).toFixed(4)*100}%`"></div>
        </div>
        <div class="w-full h-full flex items-center justify-center text-[14px] text-[#FDA29B]" v-show="state.yesOrders.length == 0">No orders yet</div>
      </div>
      <div
        class="flex items-center justify-center h-[26px] border-y border-solid border-[#333741] bg-[#1F242F] w-full text-[12px] leading-[18px] text-[#CECFD2]"
        style="font-family: inter-bold"
      >
          <v-tooltip
                text="Gap between the highest bid and the lowest ask price."
                location="top"
                max-width="400"
              >
                <template v-slot:activator="{ props }">
                  <div
                    v-bind="props"
                    class="text-[#96949c] border-b border-dotted border-[#333741]"
                  >
                    Spread:
                  </div>
                </template>
              </v-tooltip>
         {{ $formatAmount(state.spread) }} ¢
      </div>
      <div
        class="max-h-[189px] h-[189px] overflow-y-auto"
        style="scrollbar-width: none"
      >
        <div class="flex items-center w-full h-[26px] !px-[8px] relative" v-for="(item,index) in state.noOrders" :key="index">
          <div class="flex-1 flex items-center gap-[4px]">
            <div class="text-[12px] leading-[26px] text-[#3CCB7F] relative z-10">
              {{ $formatAmount(item.price) }} ¢
            </div>
          </div>
          <div class="flex-1 text-[12px] leading-[26px] text-[#CECFD2] text-center relative z-10">{{ $formatAmount(item.amount) }}</div>
          <div class="flex-1 text-[12px] leading-[26px] text-[#94969C] text-right relative z-10">{{ $formatAmount(item.paidAmt) }}</div>
          <div class="absolute left-0 top-0 bg-[#093B27] h-full" :style="`width:${(item.amount/state.totalAmountForNo).toFixed(4)*100}%`"></div>
        </div>
        <div class="w-full h-full flex items-center justify-center text-[14px] text-[#3CCB7F]" v-show="state.noOrders.length == 0">No orders yet</div>
      </div>
    </div>
  </div>
</template>
