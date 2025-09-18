<template>
  <div class="h-[370px] flex items-center">
    <div class="w-[302px] rounded-[6px] border border-solid border-[#666]">
      <div class="!px-[10px] !py-[15px] flex items-center justify-between bg-[#666] rounded-t-[6px]">
        <div class="flex items-center gap-[5px]">
          <img src="@/assets/img/timer.png" class="w-[15px] h-[15px]" />
          <div class="text-[#fff] text-[14px]">Later</div>
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
                fill="#353547"
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
            <div class="text-[16px] text-[#666171] font-bold">UP</div>
          </div>
        </div>
        <div
          class="rounded-[6px] border border-solid !border-[#6DDD25] !p-[16px] flex flex-col gap-[10px]"
        >
          <div class="w-full flex justify-center">
            <div class="text-[14px] text-[#fff]">Entry starts</div>
          </div>
          <div class="w-full flex justify-center">
            <div class="text-[24px] text-[#fff]">~{{ formatTime }}</div>
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
                fill="#353547"
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
            <div class="text-[16px] text-[#666171] font-bold">DOWN</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
  },
})

const state = reactive({
    timer:null,
    timeCount:0
})

const formatTime = computed(()=>{
  if(state.timeCount == 0) return '00:00'
  const minute = Math.floor(state.timeCount / 60)
  const second = Math.floor(state.timeCount % 60)
  return `${minute<10?'0'+minute:minute}:${second<10?'0'+second:second}`
})

watch(()=>[props.item],()=>{
    if(state.timer){
      clearInterval(state.timer)
    }
    // const now = state.blockInfo?.timestamp
    const now = Math.floor(new Date().getTime() / 1000)
        if(props.item.lockTimestamp < now){
            state.timeCount = 0
            return
        }
        // console.log('props.item.lockTimestamp',props.item.lockTimestamp);
        
        const diff = props.item.lockTimestamp - now
        state.timeCount = diff
        state.timer = setInterval(() => {
            state.timeCount --
            if(state.timeCount == 0){
                clearInterval(state.timer)
            }
        }, 1000);
})
</script>
