<template>
  <div class="kOLKGf rounded-[6px] overflow-hidden">
    <div
      class="w-[302px] h-[368px] rounded-[6px] border border-solid border-[#666] card relative"
      :class="{ flipped: state.isFlipped }"
    >
      <div
        class="absolute w-full h-full z-10"
        style="backface-visibility: hidden"
        :style="{ 'pointer-events': state.isFlipped ? 'none' : 'auto' }"
      >
        <div
          class="!px-[10px] !py-[15px] flex items-center justify-between rounded-t-[6px]"
          style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
        >
          <div class="flex items-center gap-[5px]">
            <img src="@/assets/img/player.png" class="w-[15px] h-[15px]" />
            <div class="text-[#fff] text-[14px]">Next</div>
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
                  fill="#0AB45A33"
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
              <div class="text-[16px] text-[#0AB45A]">UP</div>
              <div class="text-[12px] text-[#fff]">{{upPayoutCom}}x Payout</div>
            </div>
          </div>
          <div
            class="rounded-[6px] border border-solid !border-[#6DDD25] !p-[16px] flex flex-col gap-[10px]"
          >
            <div class="w-full flex items-center justify-between">
              <div class="text-[14px] text-[#fff]">Prize Pool:</div>
              <div class="text-[14px] text-[#fff]">
                {{
                  appStore.formatUnits(props.item?.totalBearAmount + props.item?.totalBullAmount)
                }}
                MON
              </div>
            </div>
            <VBtn
              class="!rounded-[10px] !h-[40px] !bg-[#0AB45A] !text-[12px] md:!text-[14px] lg:!text-[16px] !leading-[14px] !text-[#fff] !font-[600]"
              variant="flat"
              @click="handleClickBtn(1)"
              :disabled="props.timeCount <= 0"
              v-if="!props.item?.hasUserBet"
            >
              Enter UP
            </VBtn>
            <VBtn
              class="!rounded-[10px] !h-[40px] !bg-[#E72F2F] !text-[12px] md:!text-[14px] lg:!text-[16px] !leading-[14px] !text-[#fff] !font-[600]"
              variant="flat"
              @click="handleClickBtn(2)"
              :disabled="props.timeCount <= 0"
              v-if="!props.item?.hasUserBet"
            >
              Enter DOWN
            </VBtn>
            <VBtn
              class="!rounded-[10px] !h-[40px] !bg-[#0AB45A] !text-[12px] md:!text-[14px] lg:!text-[16px] !leading-[14px] !text-[#fff] !font-[600]"
              variant="flat"
              :disabled="true"
              v-else
            >
              Entered
            </VBtn>
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
                  fill="#E72F2F33"
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
              <div class="text-[12px] text-[#fff]">{{downPayoutCom}}x Payout</div>
              <div class="text-[16px] text-[#E72F2F]">DOWN</div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute w-full h-full z-20"
        style="backface-visibility: hidden; transform: rotateY(180deg)"
        :style="{ 'pointer-events': state.isFlipped ? 'auto' : 'none' }"
      >
        <div class="!p-[10px] flex items-center justify-between rounded-t-[6px] bg-[#666]">
          <div class="flex items-center gap-[5px]">
            <img
              src="@/assets/img/back.png"
              class="w-[12px] h-[12px] cursor-pointer"
              @click="state.isFlipped = !state.isFlipped"
            />
            <div class="text-[#fff] text-[14px]">Set Position</div>
          </div>
          <VBtn
            class="!rounded-[32px] !h-[32px] !bg-[#0AB45A] !p-[5px] !text-[12px] md:!text-[14px] !leading-[14px] !text-[#fff] !font-[600]"
            variant="flat"
            v-show="state.directive == 1"
            @click="state.directive = 2"
          >
            <div class="flex items-center gap-[5px]">
              <img src="@/assets/img/arrow_up.png" mode="scaleToFill" class="w-[12px] h-[12px]" />
              <div>UP</div>
            </div>
          </VBtn>
          <VBtn
            class="!rounded-[32px] !h-[32px] !bg-[#E72F2F] !py-[5px] !text-[12px] md:!text-[14px] !leading-[14px] !text-[#fff] !font-[600]"
            variant="flat"
            v-show="state.directive == 2"
            @click="state.directive = 1"
          >
            <div class="flex items-center gap-[5px]">
              <img
                src="@/assets/img/arrow_up.png"
                mode="scaleToFill"
                class="w-[12px] h-[12px] rotate-180"
              />
              <div>DOWN</div>
            </div>
          </VBtn>
        </div>
        <div class="!p-[16px]">
          <div class="w-full flex items-center justify-between">
            <div class="text-[12px] text-[#fff]">Commit:</div>
            <div class="flex items-center gap-[5px]">
              <img src="@/assets/img/monad_logo.png" class="w-[16px] h-[16px]" />
              <div class="text-[12px] text-[#fff]">MON</div>
            </div>
          </div>
          <div
            class="border border-solid !border-[#666] rounded-[6px] !mt-[15px] !relative !z-[140]"
            style="position: relative; z-index: 140"
          >
            <v-number-input
              control-variant="hidden"
              density="compact"
              variant="solo"
              v-model="state.buyNum"
              :hide-details="true"
              bgColor="transparent"
              :reverse="true"
              :min="0"
              :max="state.balanceOfMon"
              precision="2"
              rounded="6"
              :autofocus="true"
              placeholder="0.0"
            >
            </v-number-input>
          </div>
          <div class="text-[12px] text-[#fff] text-right w-full" v-if="state.isFlipped">
            Balance: {{ state.balanceOfMon }} MON
          </div>
          <div class="!mt-[15px] !relative !z-[150]" style="position: relative; z-index: 150">
            <v-slider
              color="#0AB45A"
              v-model="state.buyNum"
              :hide-details="true"
              track-color="#333741"
              thumb-size="13"
              :readonly="false"
              :max="state.balanceOfMon"
              @mouseenter="disableSwiper"
              @mouseleave="enableSwiper"
              @touchstart="disableSwiper"
              @touchend="enableSwiper"
            ></v-slider>
          </div>
          <div
            class="!mt-[20px] w-full flex flex-col gap-[20px] !relative !z-[200]"
            style="position: relative; z-index: 200"
          >
            <div class="flex items-center gap-[5px]">
              <div
                class="flex-1 cursor-pointer !py-[5px] rounded-[2px] bg-[#FFFFFF1A] flex items-center justify-center text-[#6DDD25] text-[12px] !relative !z-[250]"
                style="position: relative; z-index: 250; pointer-events: auto"
                @click="handleClickPercent(item.value)"
                v-for="item in state.percentList"
                :key="item.value"
              >
                {{ item.title }}
              </div>
            </div>
            <VBtnConnect
              class="rounded-[106px] !relative !z-[300]"
              style="position: relative; z-index: 300; pointer-events: auto"
              v-if="!appStore.tomeState.curWalletAddress || !appStore.tomeState.token"
              @click="$router.push('/login')"
            >
              Connect Wallet
            </VBtnConnect>
            <VBtnConnect
              class="rounded-[106px] !relative !z-[300]"
              style="position: relative; z-index: 300; pointer-events: auto"
              v-else
              @click="handleClickConfirm"
              :loading="state.isProcessing"
              :disabled="
                state.isProcessing ||
                !state.buyNum ||
                state.buyNum <= 0 ||
                props.timeCount == 0 ||
                state.buyNum > state.balanceOfMon ||
                state.balanceOfMon == 0
              "
            >
              Confirm
            </VBtnConnect>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { store } from '@/store'
import { onMounted, reactive, watch, computed } from 'vue'
import Erc20ABi from '@/abi/erc_20.json'
import network from '@/utils/network'
import { ethers } from 'ethers'
import { truncateDecimals } from '@/utils'
import { useToast } from 'vue-toastification'
import NP from 'number-precision'

const props = defineProps({
  item: {
    type: Object,
  },
  swiperInstance: {
    type: Object,
  },
  contract: {
    type: Object,
  },
  timeCount: {
    type: Number,
  },
})

const state = reactive({
  timer: null,
  timeCount: 0,
  isFlipped: false,
  directive: 1, //下注方向 1位买张2为买跌
  buyNum: null,
  precent: 10,
  balanceOfMon: 0,
  tokenContract: null,
  percentList: [
    { title: '10%', value: 0.1 },
    { title: '25%', value: 0.25 },
    { title: '50%', value: 0.5 },
    { title: '75%', value: 0.75 },
    { title: 'MAX', value: 1 },
  ],
  isProcessing: false, // 添加处理状态，用于按钮loading
})

const appStore = store.useAppStore()

const toast = useToast()

onMounted(() => {
  getTokenBalance()
})

function disableSwiper() {
  console.log('disableSwiper', props.swiperInstance)

  if (props.swiperInstance) {
    props.swiperInstance.disable() // 禁用 Swiper
  }
}
function enableSwiper() {
  console.log('enableSwiper')

  if (props.swiperInstance) {
    props.swiperInstance.enable() // 重新启用 Swiper
  }
}

const upPayoutCom = computed(()=>{
    if(!props.item.totalBearAmount || !props.item.totalBullAmount) return 0
    return NP.divide(props.item.totalBearAmount + props.item.totalBullAmount, props.item.totalBullAmount)
})

const downPayoutCom = computed(()=>{
  if(!props.item.totalBearAmount || !props.item.totalBullAmount) return 0
    return NP.divide(props.item.totalBearAmount + props.item.totalBullAmount, props.item.totalBearAmount)
})
// watch(
//   () => [props.item],
//   () => {
//     if (state.timer) {
//       clearInterval(state.timer)
//     }
//     // const now = state.blockInfo?.timestamp
//     const now = Math.floor(new Date().getTime() / 1000)
//     // console.log('started',props.item.lockTimestamp,now);
//     if (props.item.lockTimestamp < now) {
//       state.timeCount = 0
//       return
//     }

//     const diff = props.item.lockTimestamp - now
//     state.timeCount = diff
//     state.timer = setInterval(() => {
//       state.timeCount--
//       if (state.timeCount == 0) {
//         clearInterval(state.timer)
//       }
//     }, 1000)
//   },
// )

function handleClickPercent(percent) {
  state.buyNum = Number(truncateDecimals(state.balanceOfMon * percent))
}

function handleClickBtn(e) {
  state.directive = e
  state.isFlipped = !state.isFlipped
}

function initErc20Contract() {
  state.tokenContract = appStore.initErc20Contract(
    network[import.meta.env.VITE_APP_CHAIN].MON,
    Erc20ABi,
  )
}

async function handleClickConfirm() {
  // 防止重复点击
  if (state.isProcessing || props.timeCount <= 0) {
    return
  }

  try {
    state.isProcessing = true
    console.log('handleClickConfirm')

    if (!props.contract) {
      toast.error('合约未初始化')
      return
    }

    if (!state.buyNum || state.buyNum <= 0) {
      toast.error('请输入有效的转账金额')
      return
    }
    console.log('转账金额:', state.buyNum, 'MON')

    // 调用合约方法并发送原生币
    let res = null
    const valueInWei = appStore.parseUnits(state.buyNum.toString())

    console.log('调用合约方法，发送金额:', {
      buyNum: state.buyNum,
      valueInWei: valueInWei.toString(),
      directive: state.directive,
      assetId: props.item.assetId,
      roundId: props.item.roundId,
    })

    // toast.info('正在调用合约，请在钱包中确认...')

    if (state.directive == 1) {
      // 调用 betBull 方法并发送 MON
      res = await props.contract.betBull(props.item.assetId, props.item.roundId, {
        value: valueInWei,
      })
    } else {
      // 调用 betBear 方法并发送 MON
      res = await props.contract.betBear(props.item.assetId, props.item.roundId, {
        value: valueInWei,
      })
    }

    // console.log('合约调用成功，交易哈希:', res.hash)
    // toast.info('交易已发送，等待确认...')

    // 等待交易确认
    const receipt = await res.wait()
    console.log('交易确认成功:', receipt)

    if (receipt.status === 1) {
      toast.success(`Successful betting!`)
      console.log('✅ 合约调用成功:', {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      })

      // 更新余额
      await getTokenBalance()
      state.buyNum = null
    } else {
      throw new Error('交易失败')
    }
  } catch (error) {
    console.error('操作失败:', error)

    // 处理常见错误类型
    let errorMessage = '操作失败，请重试'

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = '用户取消了交易'
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = '账户余额不足，请检查余额'
    } else if (error.code === 'NETWORK_ERROR') {
      errorMessage = '网络连接错误，请检查网络设置'
    } else if (error.message?.includes('gas')) {
      errorMessage = 'Gas 费用相关错误，请重试'
    } else if (error.message?.includes('user rejected')) {
      errorMessage = '用户拒绝了交易'
    } else if (error.message?.includes('insufficient funds')) {
      errorMessage = '余额不足'
    } else if (error.message) {
      errorMessage = error.message
    }

    toast.error(errorMessage)
  } finally {
    state.isProcessing = false
  }
}

async function getTokenBalance() {
  if (!appStore.mStateSimple.metamaskProvider) return
  const provider = new ethers.BrowserProvider(appStore.mStateSimple.metamaskProvider)
  const balance = await provider.getBalance(appStore.tomeState.curWalletAddress)
  state.balanceOfMon = truncateDecimals(appStore.formatUnits(balance))
  console.log('balanceOfMon', state.balanceOfMon)
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.kOLKGf {
  perspective: 1000px;
}

.flipped {
  transform: rotateY(180deg);
}

:deep(.v-field__input) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
