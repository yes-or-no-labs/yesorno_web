<template>
  <div
    class="w-[302px] rounded-[6px] border border-solid border-[#666] opacity-70 hover:!opacity-100"
  >
    <div class="!px-[10px] !py-[15px] flex items-center justify-between">
      <div class="flex items-center gap-[5px]">
        <img src="@/assets/img/player.png" class="w-[15px] h-[15px]" />
        <div class="text-[#fff] text-[14px]">Expired</div>
      </div>
      <div class="text-[#fff] text-[14px]">#{{ props.item?.roundId }}</div>
    </div>
    <div class="!p-[16px]">
      <div class="relative flex justify-center items-center w-[240px] h-[65px] mx-auto">
        <svg
          height="65px"
          width="240px"
          viewBox="0 0 240 65"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-0 left-0"
        >
          <g filter="url(#filter0_i)">
            <path
              d="M10.0001 49.2757L10.0003 64H234L234 49.2753C234 42.5136 229.749 36.4819 223.381 34.2077L138.48 3.8859C127.823 0.0796983 116.177 0.0796931 105.519 3.8859L20.6188 34.2076C14.2508 36.4819 10.0001 42.5138 10.0001 49.2757Z"
              :fill="lockPriceCom < endPriceCom ? '#0AB45A' : '#353547'"
            ></path>
          </g>
          <defs>
            <filter
              id="filter0_i"
              x="10.0001"
              y="1.03125"
              width="224"
              height="62.9688"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
              ></feColorMatrix>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
            </filter>
          </defs>
        </svg>
        <div class="relative z-10 flex flex-col items-center justify-center w-full">
          <div
            class="text-[16px] font-bold"
            :style="`color:${lockPriceCom < endPriceCom ? '#fff' : '#0AB45A'}`"
          >
            UP
          </div>
          <div class="text-[12px] text-[#fff] font-bold">{{upPayoutCom}}x Payout</div>
        </div>
      </div>
      <div class="rounded-[6px] border border-solid !border-[#6DDD25] !p-[16px]">
        <div class="text-[#fff] text-[12px]">LAST PRICE</div>
        <div class="flex-1 flex items-center justify-between !mt-[5px]">
          <div class="text-[24px] text-[#fff]">${{ $formatAmount(endPriceCom) }}</div>
          <div
            class="!px-[10px] h-[26px] flex items-center gap-[10px] rounded-[2px]"
            :class="endPriceCom - lockPriceCom < 0 ? 'bg-[#0AB45A]' : 'bg-[#E72F2F]'"
          >
            <img
              src="@/assets/img/arrow_up.png"
              class="w-[10px] h-[10px]"
              :class="endPriceCom - lockPriceCom < 0 ? 'rotate-180' : ''"
            />
            <div class="text-[#fff] text-[12px]">
              ${{ $formatAmount(endPriceCom - lockPriceCom) }}
            </div>
          </div>
        </div>
        <div class="!mt-[10px] w-full flex items-center justify-between">
          <div class="text-[12px] text-[#fff]">Locked Price:</div>
          <div class="text-[12px] text-[#fff]">${{ $formatAmount(lockPriceCom) }}</div>
        </div>
        <div class="!mt-[10px] w-full flex items-center justify-between">
          <div class="text-[12px] text-[#fff]">Prize Pool:</div>
          <div class="text-[12px] text-[#fff]">
            {{
              appStore.formatUnits(props.item?.totalBearAmount + props.item?.totalBullAmount)
            }}
            MON
          </div>
        </div>
        <div class="!mt-[10px] flex items-center flex-col !px-[10px]" v-if="props.item?.hasUserBet">
          <VBtnConnect
            class="rounded-[106px] w-full"
            style="position: relative; z-index: 300; pointer-events: auto"
            v-if="!appStore.tomeState.curWalletAddress || !appStore.tomeState.token"
            @click="$router.push('/login')"
          >
            Connect Wallet
          </VBtnConnect>
          <VBtnConnect
            class="rounded-[106px] w-full"
            style="position: relative; z-index: 300; pointer-events: auto"
            v-else
            @click="handleClickClaim"
            :loading="state.isProcessing"
            :disabled="state.isProcessing"
          >
            Claim
          </VBtnConnect>
        </div>
      </div>
      <div class="relative flex justify-center items-center w-[240px] h-[65px] mx-auto">
        <svg
          height="65px"
          width="240px"
          viewBox="0 0 240 65"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute top-0 left-0"
        >
          <g filter="url(#filter0_i)">
            <path
              d="M10.0001 15.7243L10.0003 1H234L234 15.7247C234 22.4864 229.749 28.5181 223.381 30.7923L138.48 61.1141C127.823 64.9203 116.177 64.9203 105.519 61.1141L20.6188 30.7924C14.2508 28.5181 10.0001 22.4862 10.0001 15.7243Z"
              :fill="lockPriceCom < endPriceCom ? '#353547' : '#E72F2F'"
            ></path>
          </g>
          <defs>
            <filter
              id="filter0_i"
              x="10.0001"
              y="1"
              width="224"
              height="62.9688"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset></feOffset>
              <feGaussianBlur stdDeviation="1"></feGaussianBlur>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
              ></feColorMatrix>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
            </filter>
          </defs>
        </svg>
        <div class="relative z-10 flex flex-col items-center justify-center w-full">
          <div class="text-[12px] text-[#fff] font-bold">{{downPayoutCom}}x Payout</div>
          <div
            class="text-[16px] font-bold"
            :style="`color:${lockPriceCom < endPriceCom ? '#E72F2F' : '#fff'}`"
          >
            DOWN
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { store } from '@/store'
import NP from 'number-precision'

const props = defineProps({
  item: {
    type: Object,
  },
  contract: {
    type: Object,
  },
})

const state = reactive({
  isProcessing: false,
})

const appStore = store.useAppStore()

const upPayoutCom = computed(()=>{
    if(!props.item.totalBearAmount || !props.item.totalBullAmount) return 0
    return NP.divide(props.item.totalBearAmount + props.item.totalBullAmount, props.item.totalBullAmount)
})

const downPayoutCom = computed(()=>{
    if(!props.item.totalBearAmount || !props.item.totalBullAmount) return 0
    return NP.divide(props.item.totalBearAmount + props.item.totalBullAmount, props.item.totalBearAmount)
})

const lockPriceCom = computed(() => {
  if (!props.item?.lockPrice) return 0
  return props.item?.lockPrice / Math.pow(10, props.item?.decimals)
})

const endPriceCom = computed(() => {
  if (!props.item?.endPrice) return 0
  return props.item?.endPrice / Math.pow(10, props.item?.decimals)
})

async function handleClickClaim() {
  try {
    state.isProcessing = true
    console.log('handleClickClaim')
    if (!props.contract) {
      await props.initControlContract()
    }
    const res = await props.contract.claim(props.item.assetId, [props.item.roundId])
    console.log('handleClickClaim', res)
    toast.success('Claim Success')
  } catch (error) {
    console.error('handleClickClaim', error)
  } finally {
    state.isProcessing = false
  }
}
</script>
