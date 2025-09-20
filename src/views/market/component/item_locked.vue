<template>
    <div class="w-[302px] rounded-[6px] border border-solid !border-[#0AB45A]">
            <div class="!px-[10px] !py-[15px] flex items-center justify-between">
              <div class="flex items-center gap-[5px]">
                <img src="@/assets/img/player.png" class="w-[15px] h-[15px]" />
                <div class="text-[#fff] text-[14px]">LIVE</div>
              </div>
              <div class="text-[#fff] text-[14px]">#{{ props.item?.roundId }}</div>
            </div>
            <v-progress-linear v-model="state.timeCount" color="#6DDD25" :max="300"></v-progress-linear>
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
                      :fill="lockPriceCom < currentPriceCom ? '#0AB45A' : '#353547'"
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
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      ></feComposite>
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                      ></feColorMatrix>
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                    </filter>
                  </defs>
                </svg>
                <div class="relative z-10 flex flex-col items-center justify-center w-full">
                  <div class="text-[16px] font-bold" :style="`color:${lockPriceCom < currentPriceCom ? '#fff' : '#0AB45A'}`">UP</div>
                  <div class="text-[12px] text-[#fff] font-bold">{{upPayoutCom}}x Payout</div>
                </div>
              </div>
              <div class="rounded-[6px] border border-solid !border-[#6DDD25] !p-[16px]" v-if="props.timeCount > 0">
                <div class="text-[#fff] text-[12px]">LAST PRICE</div>
                
                <div class="flex-1 flex items-center justify-between !mt-[5px]">
                  <v-tooltip text="Last price from Chainlink Oracle" location="top">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props" class="text-[24px] leading-[24px] text-[#fff] border-dotted border-b !border-[#fff]" v-number-roll="{ value: currentPriceCom, prefix: '$' }"></div>
                  </template>
                </v-tooltip>
                  
                  <div
                    class="!px-[10px] h-[26px] flex items-center gap-[10px] rounded-[2px]"
                    :class="currentPriceCom - lockPriceCom < 0 ? 'bg-[#E72F2F]' : 'bg-[#0AB45A]'"
                  >
                    <img src="@/assets/img/arrow_up.png" class="w-[10px] h-[10px]" :class="currentPriceCom - lockPriceCom < 0 ? 'rotate-180' : ''" />
                    <div class="text-[#fff] text-[12px]">${{ $formatAmount(currentPriceCom - lockPriceCom) }}</div>
                  </div>
                </div>
                
                <div class="!mt-[10px] w-full flex items-center justify-between">
                  <div class="text-[12px] text-[#fff]">Locked Price:</div>
                  <div class="text-[12px] text-[#fff]">${{ $formatAmount(lockPriceCom) }}</div>
                </div>
                <div class="!mt-[10px] w-full flex items-center justify-between">
                  <div class="text-[12px] text-[#fff]">Prize Pool:</div>
                  <div class="text-[12px] text-[#fff]">{{ $formatAmount(appStore.formatUnits(props.item?.totalBearAmount + props.item?.totalBullAmount)) }} MON</div>
                </div>
              </div>
              <div class="rounded-[6px] border border-solid !border-[#6DDD25] !p-[16px] h-[150px] flex items-center justify-center flex-col" v-else>
                <div class="flex flex-col gap-[50px] relative">
                  <Loading/>
                  <div class="w-full h-[50px]"></div>
                  <div class="text-[#fff] text-[16px]">Calculating</div>
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
                      :fill="lockPriceCom < currentPriceCom ? '#353547' : '#E72F2F'"
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
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      ></feComposite>
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
                  <div class="text-[16px] font-bold" :style="`color:${lockPriceCom < currentPriceCom ? '#E72F2F' : '#fff'}`">DOWN</div>
                </div>
              </div>
            </div>
          </div>
</template>

<script setup>
import { store } from '@/store';
import { computed, onMounted, onUnmounted, reactive, watch, ref } from 'vue';
import { ethers } from 'ethers';
import chainlinkAbi from '@/abi/chainlink_price_feed.json';
import NP from 'number-precision'
import Loading from '@/components/Loading/index.vue'
import { truncateDecimals } from '@/utils';

const props = defineProps({
    item:{
        type:Object,
    },
    blockInfo:{
        type:Object,
    },
    timeCount:{
      type:Number,
    }
})

const state = reactive({
    timeCount:0,
    timer:null,
    btcPrice: 0,
    isLoadingPrice: false,
    lastPriceUpdate: null
})

const appStore = store.useAppStore()


// ChainLink预言机配置
const CHAINLINK_BTC_ORACLE_ADDRESS = '0xF46B02AF0b4Dc3fFd8B49a616fa399E77b58637F'

const upPayoutCom = computed(()=>{
    if(!props.item.totalBearAmount || !props.item.totalBullAmount) return 0
    return truncateDecimals(NP.divide(props.item.totalBearAmount + props.item.totalBullAmount, props.item.totalBullAmount))
})

const downPayoutCom = computed(()=>{
  if(!props.item.totalBearAmount || !props.item.totalBullAmount) return 0
    return truncateDecimals(NP.divide(props.item.totalBearAmount + props.item.totalBullAmount, props.item.totalBearAmount))
})


/**
 * 获取ChainLink预言机BTC实时价格
 * @returns {Promise<number>} BTC价格
 */
const getChainlinkBTCPrice = async () => {
    try {
        state.isLoadingPrice = true
        
        // 获取provider
        // const provider = appStore.mStateSimple?.ethersBrowserProvider
        const provider = new ethers.BrowserProvider(appStore.mStateSimple.metamaskProvider)
        if (!provider) {
            // 如果没有连接钱包，使用默认的JSON RPC provider
            const rpcUrl = import.meta.env.VITE_APP_RPC_URL || 'https://rpc.ankr.com/eth'
            const fallbackProvider = new ethers.JsonRpcProvider(rpcUrl)
            
            // 创建合约实例
            const priceFeedContract = new ethers.Contract(
                CHAINLINK_BTC_ORACLE_ADDRESS,
                chainlinkAbi,
                fallbackProvider
            )
            
            // 获取最新价格数据
            const roundData = await priceFeedContract.latestRoundData()
            const decimals = await priceFeedContract.decimals()
            
            // 转换价格（ChainLink返回的价格需要除以10^decimals）
            const price = Number(roundData.answer) / Math.pow(10, Number(decimals))
            
            state.btcPrice = price
            state.lastPriceUpdate = new Date()
            
            // console.log('ChainLink BTC Price:', price, 'USD')
            // console.log('Round Data:', {
            //     roundId: roundData.roundId.toString(),
            //     answer: roundData.answer.toString(),
            //     startedAt: new Date(Number(roundData.startedAt) * 1000),
            //     updatedAt: new Date(Number(roundData.updatedAt) * 1000),
            //     answeredInRound: roundData.answeredInRound.toString()
            // })
            
            return price
        } else {
            // 使用用户连接的钱包provider
            const priceFeedContract = new ethers.Contract(
                CHAINLINK_BTC_ORACLE_ADDRESS,
                chainlinkAbi,
                provider
            )

            // console.log('priceFeedContract',priceFeedContract);
            
            
            const roundData = await priceFeedContract.latestRoundData()
            const decimals = await priceFeedContract.decimals()
            
            const price = Number(roundData.answer) / Math.pow(10, Number(decimals))
            
            state.btcPrice = price
            state.lastPriceUpdate = new Date()
            
            // console.log('ChainLink BTC Price:', price, 'USD')
            return price
        }
        
    } catch (error) {
        console.error('获取ChainLink BTC价格失败:', error)
        
        // 如果是网络错误或合约调用失败，可以提供一个备用方案
        if (error.code === 'NETWORK_ERROR' || error.code === 'CALL_EXCEPTION') {
            console.warn('ChainLink调用失败，可能需要检查网络连接或合约地址')
        }
        
        throw error
    } finally {
        state.isLoadingPrice = false
    }
}

/**
 * 定期更新BTC价格（每30秒更新一次）
 */
const startPriceUpdates = () => {
    // 立即获取一次价格
    getChainlinkBTCPrice().catch(console.error)
    
    // 设置定时器每30秒更新一次
    const updateInterval = setInterval(() => {
        getChainlinkBTCPrice().catch(console.error)
    }, 5000) 
    
    // 组件卸载时清理定时器
    onUnmounted(() => {
        clearInterval(updateInterval)
    })
    
    return updateInterval
}


// 组件挂载时启动价格更新
onMounted(() => {
    startPriceUpdates()
})

watch(()=>props.item,()=>{
    // const now = props.blockInfo?.timestamp
    const now = Math.floor(new Date().getTime() / 1000)
    if(props.item.endTimestamp < now){
        state.timeCount = 300
        return
    }
    const diff = props.item.endTimestamp - now
    // console.log('diff',diff);
    
    state.timeCount = 300 - diff
    // state.timer = setInterval(() => {
    //     state.timeCount ++
    //     if(state.timeCount == 300){
    //         clearInterval(state.timer)
    //     }
    // }, 1000);
})

const lockPriceCom = computed(()=>{
    if(!props.item?.lockPrice) return 0
    return props.item?.lockPrice / Math.pow(10,props.item?.decimals)
})

const currentPriceCom = computed(()=>{
    if(!state.btcPrice) {
      return lockPriceCom.value
    }else{
      return state.btcPrice
    }
})

defineExpose({currentPriceCom})


const endPriceCom = computed(()=>{
    if(!props.item?.endPrice) return 0
    return props.item?.endPrice / Math.pow(10,props.item?.decimals)
})
</script>