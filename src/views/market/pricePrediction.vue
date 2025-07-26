<script setup>
import AiComponent from '@/components/Ai/index.vue'
import tvChart from '@/components/Charting/TVChartView.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'

import 'swiper/css/free-mode'
import { reactive, ref, onMounted } from 'vue'

const state = reactive({
  curTabIndex:0,
  tabList:[{title:'TradingView chart'},{title:'AI Prediction'}],
  currentPrice: 0,
})

onMounted(() => {
})

const swiperInstance = ref(null)

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

function getCurrentPrice(e) {
  // console.log('getCurrentPrice', e);
  state.currentPrice = e.price;
}

</script>

<template>
  <div class="flex flex-col gap-[24px] w-full" style="min-height: calc(100vh - 80px)">
    <div class="flex-1">
      <div class="w-[1200px] mx-auto flex items-end justify-between !py-[40px]">
        <div class="flex items-center gap-[10px]">
          <div
            class="w-[48px] h-[48px] rounded-[4px] bg-[#FFFFFF1A] flex items-center justify-center"
          >
            <img src="@/assets/img/bsc.png" class="w-[28px] h-[28px]" />
          </div>
          <div class="flex-col gap-[10px]">
            <div class="text-[#fff] text-[16px] font-[600]">BNBUSD</div>
            <div class="text-[#6DDD25] text-[24px] font-[600]">$756.4866</div>
          </div>
        </div>

        <div
          class="w-[168px] rounded-full bg-[#FFFFFF1A] h-[42px] flex items-center justify-between relative !px-[20px]"
        >
          <img src="@/assets/img/arrow_left.png" class="w-[18px] h-[18px] cursor-pointer" alt="" @click="swiperInstance.slidePrev()" />
          <img
            src="@/assets/img/price_icon.png"
            class="w-[42px] h-[50px] absolute bottom-[10px] left-[50%] translate-x-[-50%]"
            alt=""
          />
          <img
            src="@/assets/img/arrow_right.png"
            class="w-[18px] h-[18px] cursor-pointer"
            alt=""
            @click="swiperInstance.slideNext()"
          />
        </div>
        <div class="flex items-center gap-[16px]">
          <div
            class="h-[42px] rounded-full !pl-[20px] !pr-[40px] flex items-center gap-[10px] relative"
            style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
          >
            <div class="text-[#fff] text-[16px] font-[600]">Closing</div>
            <div class="text-[#fff] text-[24px] font-[600]">54m</div>
            <img
              src="@/assets/img/clock.png"
              class="w-[45px] h-[47px] absolute bottom-0 right-0 translate-x-[30%] select-none"
              draggable="false"
            />
          </div>
          <div
            class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
            style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
            v-ripple
          >
            <img
              src="@/assets/img/price_icon1.png"
              class="w-[20px] h-[20px]"
              draggable="false"
              alt=""
            />
          </div>
          <div
            class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
            style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
            v-ripple
          >
            <img
              src="@/assets/img/price_icon2.png"
              class="w-[22px] h-[18px]"
              draggable="false"
              alt=""
            />
          </div>
          <div
            class="w-[42px] h-[42px] rounded-full flex items-center justify-center cursor-pointer select-none"
            style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
            v-ripple
          >
            <img
              src="@/assets/img/price_icon3.png"
              class="w-[20px] h-[20px]"
              draggable="false"
              alt=""
            />
          </div>
        </div>
      </div>
        <swiper
          :slidesPerView="4.5"
          :spaceBetween="16"
          :freeMode="true"
          :modules="[FreeMode]"
          class="w-full"
          @swiper="onSwiper"
        >
          <swiper-slide v-for="item in 7">
            <div class="w-[302px] rounded-[6px] border border-solid border-[#666]">
              <div class="!px-[10px] !py-[15px] flex items-center justify-between">
                <div class="flex items-center gap-[5px]">
                  <img src="@/assets/img/player.png" class="w-[15px] h-[15px]" />
                  <div class="text-[#fff] text-[14px]">LIVE</div>
                </div>
                <div class="text-[#fff] text-[14px]">#396418</div>
              </div>
              <v-progress-linear model-value="20" color="#6DDD25"></v-progress-linear>
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
                    <div class="text-[16px] text-[#0AB45A]">UP</div>
                    <div class="text-[12px] text-[#fff]">2.61x Payout</div>
                  </div>
                </div>
                <div class="rounded-[6px] border border-solid !border-[#6DDD25] !p-[16px]">
                  <div class="text-[#fff] text-[12px]">LAST PRICE</div>
                  <div class="flex-1 flex items-center justify-between !mt-[5px]">
                    <div class="text-[24px] text-[#fff]">$758.2202</div>
                    <div
                      class="!px-[10px] h-[26px] flex items-center gap-[10px] rounded-[2px]"
                      style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                    >
                      <img src="@/assets/img/arrow_up.png" class="w-[10px] h-[10px]" />
                      <div class="text-[#fff] text-[12px]">$-1.9798</div>
                    </div>
                  </div>
                  <div class="!mt-[10px] w-full flex items-center justify-between">
                    <div class="text-[12px] text-[#fff]">Locked Price:</div>
                    <div class="text-[12px] text-[#fff]">$760.2000</div>
                  </div>
                  <div class="!mt-[10px] w-full flex items-center justify-between">
                    <div class="text-[12px] text-[#fff]">Prize Pool:</div>
                    <div class="text-[12px] text-[#fff]">4.6348 BNB</div>
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
                    <div class="text-[12px] text-[#fff]">2.61x Payout</div>
                    <div class="text-[16px] text-[#E72F2F]">DOWN</div>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
    </div>

    <div class="flex-1 bg-[#011B0C] flex flex-col">
      <div class="w-full h-[42px] bg-[#011B0C] flex items-center justify-center relative cursor-row-resize">
        <div class="w-[96px] h-[6px] rounded-[3px]" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);"></div>
        <div class=" absolute top-0 left-0 translate-y-[-100%] bg-[#191919] h-[42px] flex items-center rounded-t-[6px] z-20">
          <div class="!px-[20px] h-full flex items-center text-[16px] text-[#666] rounded-t-[6px] cursor-pointer" :style="state.curTabIndex == index?'background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);color:#fff':''" v-for="(item,index) in state.tabList" :key="index" @click="state.curTabIndex = index">
            {{item.title}}
          </div>
        </div>
      </div>
      <div class="flex-1 flex" v-show="state.curTabIndex == 0">
        <tvChart @currentPrice="getCurrentPrice" />
      </div>
      
      <div class="w-[1200px] mx-auto" v-show="state.curTabIndex == 1">
        <AiComponent :currentPrice="state.currentPrice" />
      </div>
    </div>
  </div>
</template>
