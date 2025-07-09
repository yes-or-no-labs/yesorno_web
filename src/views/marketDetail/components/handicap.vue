<script setup>
import network from '@/utils/network'
import { computed } from 'vue';

const env = computed(()=> import.meta.env)

</script>


<template>
  <div class="flex-[0.3] !py-[8px] rounded-[8px] border border-solid border-[#333741]">
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
        class="max-h-[189px] h-[189px] flex items-end flex-wrap overflow-y-auto !px-[8px]"
        style="scrollbar-width: none"
      >
        <div class="flex items-center w-full px-[8px]" v-for="item in 10" :key="item">
          <div class="flex-1 flex items-center gap-[4px]">
            <div class="text-[12px] leading-[26px] text-[#FDA29B]" style="font-family: inter-bold">
              40¢
            </div>
          </div>
          <div class="flex-1 text-[12px] leading-[26px] text-[#CECFD2] text-center">2,985.00</div>
          <div class="flex-1 text-[12px] leading-[26px] text-[#94969C] text-right">2,985.00</div>
        </div>
      </div>
      <div
        class="flex items-center justify-center h-[26px] border-y border-solid border-[#333741] bg-[#1F242F] w-full text-[12px] leading-[18px] text-[#CECFD2]"
        style="font-family: inter-bold"
      >
        Spread: 1.00 ¢
      </div>
      <div
        class="max-h-[189px] h-[189px] flex flex-wrap overflow-y-auto !px-[8px]"
        style="scrollbar-width: none"
      >
        <div class="flex items-center w-full px-[8px]" v-for="item in 10" :key="item">
          <div class="flex-1 flex items-center gap-[4px]">
            <div class="text-[12px] leading-[26px] text-[#3CCB7F]" style="font-family: inter-bold">
              40¢
            </div>
          </div>
          <div class="flex-1 text-[12px] leading-[26px] text-[#CECFD2] text-center">2,985.00</div>
          <div class="flex-1 text-[12px] leading-[26px] text-[#94969C] text-right">2,985.00</div>
        </div>
      </div>
    </div>
  </div>
</template>
