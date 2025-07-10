<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import home_bg4 from '@/assets/img/home_bg4.png'
import home_bg5 from '@/assets/img/home_bg5.png'
import home_bg6 from '@/assets/img/home_bg6.png'
import home_notice1 from '@/assets/img/home_notice_bg1.png'
import lottie from 'lottie-web' // 引入插件
import animationData1 from '@/assets/animate/data1.json'
import animationData2 from '@/assets/animate/data2.json' // 引入
import animationData3 from '@/assets/animate/data3.json'
import { Vue3Marquee } from 'vue3-marquee'

const state = reactive({
  reasoningList: [
    {
      icon: home_bg4,
      json: animationData1,
      title:
        'Predict instantly without leaving the chat. Breaking news, viral trends, or global events — just tap, think, and vote right inside Telegram. No app switching, no feed refreshing.',
    },
    {
      icon: home_bg5,
      json: animationData3,
      title:
        'Where collective intelligence meets real-time insight. Our AI surfaces patterns, curates questions, and helps communities uncover what’s really happening — together.',
    },
    {
      icon: home_bg6,
      json: animationData2,
      title:
        'Every prediction is a chance to win. Turn your foresight into rewards as you bet on crypto, culture, politics, and more — driven by what the world believes, or is afraid to say.',
    },
  ],
  noticeData1:[{imgurl:home_notice1},{imgurl:home_notice1},{imgurl:home_notice1},{imgurl:home_notice1},{imgurl:home_notice1}]
})

onMounted(() => {
  // optAnimation()
})

const optAnimation = (json, index) => {
  // console.log('optAnimation');
  nextTick(() => {
    lottie.destroy('lottieLoading' + index)
    const elem = document.querySelector('.lottieLoading' + index)
    // console.log('elem', elem)

    const params = {
      container: elem,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: json,
      name: 'lottieLoading' + index,
    }
    lottie.loadAnimation(params)
  })
}
</script>

<template>
  <div>
    <!-- <img
      src="@/assets/img/home_bg.png"
      class="absolute lg:top-0 top-[40xp] left-[50%] translate-x-[-50%] w-full object-cover max-w-[1920px]"
    /> -->
    <video
      src="@/assets/mp4/home_main.mp4"
      autoplay
      poster="@/assets/img/home_bg.png"
      muted
      loop
      class="absolute lg:top-0 top-[40xp] left-[50%] translate-x-[-50%] w-full object-cover max-w-[1920px]"
      oncontextmenu="return false;"
    ></video>
    <div
      class="relative 2xl:h-[1067px] xl:h-[836px] lg:h-[654px] md:h-[525px] sm:h-[388px] h-[238px] flex items-center justify-center"
    >
      <div
        class="flex flex-col 2xl:gap-[50px] xl:gap-[40px] lg:gap-[30px] md:gap-[20px] gap-[10px]"
      >
        <div
          class="2xl:text-[68px] xl:text-[48px] lg:text-[38px] md:text-[28px] sm:text-[20px] text-[18px] text-[#fff] text-center font-bold"
          style="font-family: Geist"
        >
          The AI-Native Prediction Market <br />
          for Real-Time With Discovery
        </div>
        <div
          class="text-center 2xl:text-[24px] xl:text-[20px] lg:text-[18px] md:text-[16px] sm:text-[14px] text-[12px]"
          style="font-family: Geist"
        >
          Where opinions meet incentives. Bet on the future, shaped by you and Ai.<br />Explore what
          the world believesnat they're too afraid to say.
        </div>
        <div class="flex justify-center">
          <VBtnConnect
            class="rounded-[106px] 2xl:!text-[24px] xl:!text-[20px] lg:!text-[18px] md:!text-[16px] sm:!text-[14px] !text-[12px] 2xl:!h-[67px] lg:!h-[55px] md:!h-[50px] sm:!h-[45px] h-[40px] 2xl:!px-[60px] lg:!px-[55px] md:!px-[50px] sm:!px-[40px]"
            style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
          >
            Launch App
          </VBtnConnect>
        </div>
      </div>
    </div>
    <div
      class="2xl:!mt-[100px] w-[80%] mx-auto xl:!mt-[80px] lg:!mt-[60px] md:!mt-[40px] !mt-[20px] rounded-[6px] border border-solid border-[rgba(255,255,255,.5)] relative 2xl:!pt-[40px] xl:!pt-[30px] lg:!pt-[20px] !pt-[10px]"
    >
      <div
        class="2xl:text-[36px] xl:text-[30px] lg:text-[25px] sm:text-[20px] text-[18px] text-center text-[#fff]"
        style="font-family: Geist"
      >
        Explore a world of predictions
      </div>
      <div
        class="2xl:text-[24px] xl:text-[18px] lg:text-[15px] sm:text-[14px] text-[12px] text-center text-[#fff] 2xl:!mt-[30px] lg:!mt-[20px] !mt-[10px]"
        style="font-family: Geist"
      >
        From crypto to politics, sports to pop culture — powered by collective intelligence,<br
          class="hidden lg:block"
        />
        committed to truth, and designed to reward those who dare to predict.
      </div>
      <!-- <img
        src="@/assets/img/home_bg2.png"
        class="w-full object-cover 2xl:h-[200px] xl:h-[180px] lg:h-[160px] sm:h-[140px] h-[80px] 2xl:!mt-[40px] xl:!mt-[30px] lg:!mt-[20px] !mt-[10px]"
        draggable="false"
      /> -->
      <video
        src="@/assets/mp4/home_bg.mp4"
        autoplay
        poster="@/assets/img/home_bg2.png"
        muted
        loop
        class="w-full object-cover 2xl:h-[200px] xl:h-[180px] lg:h-[160px] sm:h-[140px] h-[80px] 2xl:!mt-[40px] xl:!mt-[30px] lg:!mt-[20px] !mt-[10px]"
        oncontextmenu="return false;"
      ></video>
    </div>
    <div
      class="2xl:!mt-[200px] xl:!mt-[180px] lg:!mt-[160px] sm:!mt-[140px] !mt-[120px] w-[80%] mx-auto"
    >
      <div
        class="relative 2xl:!h-[273px] xl:h-[230px] lg:h-[200px] sm:h-[170px] h-[140px] flex items-center justify-center"
      >
        <div
          class="2xl:text-[34px] xl:text-[28px] sm:text-[25px] text-[20px] text-center text-[#fff] font-bold relative z-10"
          style="font-family: Geist"
        >
          Unique Value Proposition
        </div>
        <img
          src="@/assets/img/home_bg3.png"
          draggable="false"
          class="2xl:!h-[273px] xl:h-[230px] lg:h-[200px] sm:h-[170px] h-[140px] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
        />
      </div>
      <div class="!mt-[20px] flex flex-col 2xl:gap-[40px] xl:gap-[30px] lg:gap-[20px] gap-[10px]">
        <div
          class="flex flex-col lg:flex-row items-center 2xl:gap-[40px] xl:gap-[30px] lg:gap-[20px] gap-[10px]"
        >
          <div
            class="lg:flex-1 w-full border border-solid border-[rgba(255,255,255,.5)] 2xl:h-[200px] xl:h-[150px] lg:h-[130px] h-[130px] flex justify-center items-center rounded-[6px] !px-[16px]"
            v-for="(item, index) in state.reasoningList"
            :key="index"
          >
            <div class="!pt-[10px]">
              <!-- <img
                :src="item.icon"
                draggable="false"
                class="2xl:w-[46px] xl:w-[40px] lg:w-[35px] md:w-[30px] w-[25px] mx-auto"
              /> -->
              <div
                class="2xl:w-[66px] 2xl:h-[66px] xl:w-[60px] xl:h-[60px] lg:w-[55px] lg:h-[55px] md:w-[50px] md:h-[50px] w-[45px] h-[45px] mx-auto"
                :class="`lottieLoading${index + 1}`"
              >
                {{ optAnimation(item.json, index + 1) }}
              </div>
              <div
                class="xl:text-[14px] text-[12px] text-[#fff] 2xl:!mt-[10px] xl:!mt-[15px] lg:!mt-[10px] text-center"
                style="font-family: Geist"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-full 2xl:h-[240px] xl:h-[200px] lg:h-[180px] sm:h-[150px] h-[120px] 2xl:!p-[40px] xl:!p-[30px] !p-[20px] rounded-[6px] flex items-center justify-between 2xl:gap-[30px] lg:gap-[20px] gap-[10px]"
          style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
        >
          <div class="!py-[10px] flex flex-col sm:gap-[10px]">
            <div
              class="text-[#fff] 2xl:text-[24px] lg:text-[18px] sm:text-[16px] text-[12px] font-[500]"
              style="font-family: Geist"
            >
              Get rewarded for your foresight.
            </div>
            <div
              class="text-[#fff] 2xl:text-[48px] lg:text-[36px] sm:text-[30px] text-[12px] font-bold"
              style="font-family: Geist"
            >
              Stay ahead of the crowd
            </div>
            <div
              class="text-[#fff] 2xl:text-[24px] lg:text-[18px] sm:text-[16px] text-[12px]"
              style="font-family: Geist"
            >
              Predict in the moment — seamlessly.
            </div>
          </div>
          <view class="flex sm:gap-[10px] gap-[2px]">
            <img
              src="@/assets/img/home_bg7.png"
              draggable="false"
              class="2xl:w-[382px] xl:w-[332px] lg:w-[282px] sm:w-[232px] w-[100px] object-cover"
            />
            <div
              class="relative flex items-center 2xl:w-[62px] xl:w-[52px] lg:w-[42px] md:w-[32px] w-[22px] 2xl:h-[62px] xl:h-[52px] lg:h-[42px] md:h-[32px] h-[22px] justify-center"
            >
              <img
                src="@/assets/img/home_bg8.png"
                class="2xl:w-[62px] xl:w-[52px] lg:w-[42px] md:w-[32px] w-[22px] object-cover absolute left-0 top-0"
                draggable="false"
              />
              <div
                class="2xl:text-[30px] xl:text-[25px] lg:text-[20px] md:text-[18px] sm:text-[16px] text-[14px] font-bold text-[#000] relative z-10"
                style="font-family: Geist"
              >
                GO
              </div>
            </div>
          </view>
        </div>
      </div>
    </div>
    <div class="2xl:!mt-[200px] xl:!mt-[180px] lg:!mt-[160px] sm:!mt-[140px] !mt-[120px]">
      <div
        class="relative 2xl:!h-[378px] xl:!h-[328px] lg:!h-[278px] md:!h-[228px] sm:!h-[178px] !h-[128px] flex items-center justify-center"
      >
        <div
          class="2xl:text-[34px] xl:text-[28px] sm:text-[25px] text-[20px] text-center text-[#fff] font-bold relative z-10"
          style="font-family: Geist"
        >
          Roodmap
        </div>
        <img
          src="@/assets/img/home_bg9.png"
          draggable="false"
          class="2xl:!h-[378px] xl:!h-[328px] lg:!h-[278px] md:!h-[228px] sm:!h-[178px] !h-[128px] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
        />
      </div>
      <div class="relative z-10 flex !mt-[250px]">
        <div class="flex items-center flex-1 lg:flex-row lg:gap-0 flex-col gap-[500px]">
          <div class="border-b-[4px] border-solid border-[#fff] w-full relative">
            <div class="absolute lg:left-[25%] left-[5%] top-[50%] translate-y-[-50%]">
              <div class="w-[24px] h-[24px] rounded-full bg-[#fff] !p-[3px] relative">
                <div
                  class="w-full h-full rounded-full"
                  style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                ></div>
                <div
                  class="absolute left-[50%] lg:bottom-[-240px] lg:h-[240px] h-[220px] bottom-[-220px] translate-x-[-50%] border-l border-solid border-[#fff]"
                >
                  <div class="absolute left-[-4px] top-[20px] flex flex-col gap-[16px] w-[256px]">
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Launch of YesorNo Beta V1
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Release of the Telegram Mini App for seamless, on-the-go predictions
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Launch of the User Points System to incentivize engagement
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Formation of a core community to gather feedback and iterate fast
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Publication of the full tokenomics model
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="absolute left-0 lg:top-[-70px] top-[-40px] gradient-text lg:text-[34px] text-[20px] font-bold whitespace-nowrap"
                style="font-family: Geist"
              >
                2025 Q3
              </div>
            </div>
            <div class="absolute lg:left-[70%] left-[50%] top-[50%] translate-y-[-50%]">
              <div class="w-[24px] h-[24px] rounded-full bg-[#fff] !p-[3px] relative">
                <div
                  class="w-full h-full rounded-full"
                  style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                ></div>
                <div
                  class="absolute left-[50%] lg:top-[-220px] lg:h-[220px] top-[-240px] h-[240px] translate-x-[-50%] border-l border-solid border-[#fff]"
                >
                  <div
                    class="absolute left-[-4px] bottom-[20px] flex flex-col gap-[16px] lg:w-[256px] w-[200px]"
                  >
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] rounded-full !mt-[7px]"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Launch of Beta V2 with Orderbook <br class="lg:hidden" />
                        System — enabling real-time
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] rounded-full !mt-[7px]"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        trading of YES/NO positions
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] rounded-full !mt-[7px]"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Integration of<br class="lg:hidden" />
                        community-suggested features
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] rounded-full !mt-[7px]"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Strategic collaborations with media<br class="lg:hidden" />
                        outlets to ensure every hot topic<br class="lg:hidden" />
                        reflects public sentiment
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="absolute left-0 lg:bottom-[-70px] bottom-[-40px] gradient-text lg:text-[34px] text-[20px] font-bold whitespace-nowrap"
                style="font-family: Geist"
              >
                2025 Q4
              </div>
            </div>
          </div>
          <div class="border-b-[4px] border-dashed border-[#fff] w-full relative">
            <div class="absolute lg:left-[25%] left-[5%] top-[50%] translate-y-[-50%]">
              <div class="w-[24px] h-[24px] rounded-full bg-[#fff] !p-[3px] relative">
                <div
                  class="w-full h-full rounded-full"
                  style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                ></div>
                <div
                  class="absolute left-[50%] lg:bottom-[-240px] lg:h-[240px] bottom-[-220px] h-[220px] translate-x-[-50%] border-l border-solid border-[#fff]"
                >
                  <div
                    class="absolute left-[-4px] top-[20px] flex flex-col gap-[16px] lg:w-[256px] w-[200px]"
                  >
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Official Full Release<br class="lg:hidden" />
                        of YesorNo
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Launch of invitation rewards, team competitions, and other social features
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Multi-chain deployment begins
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        On-chain revenue redistribution to early and active users
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Expansion to global communities with tools for content creator monetization
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="absolute left-0 lg:top-[-70px] top-[-40px] gradient-text lg:text-[34px] text-[20px] font-bold whitespace-nowrap"
                style="font-family: Geist"
              >
                2025 Q5
              </div>
            </div>
            <div class="absolute lg:left-[70%] left-[50%] top-[50%] translate-y-[-50%]">
              <div class="w-[24px] h-[24px] rounded-full bg-[#fff] !p-[3px] relative">
                <div
                  class="w-full h-full rounded-full"
                  style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                ></div>
                <div
                  class="absolute left-[50%] lg:top-[-170px] lg:h-[170px] top-[-180px] h-[180px] translate-x-[-50%] border-l border-solid border-[#fff]"
                >
                  <div
                    class="absolute left-[-4px] bottom-[20px] flex flex-col gap-[16px] lg:w-[256px] w-[200px]"
                  >
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Brand development kicks<br class="lg:hidden" />
                        off — aiming to become the<br class="lg:hidden" />
                        most fun, lightweight social<br class="lg:hidden" />
                        app in Web3
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Native mobile App version launch
                      </div>
                    </div>
                    <div class="flex gap-[8px]">
                      <div
                        class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full"
                        style="background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%)"
                      >
                        <div class="w-full h-full rounded-full bg-[#000]"></div>
                      </div>
                      <div
                        div
                        class="lg:text-[14px] text-[12px] text-[#fff] flex-1"
                        style="font-family: Geist"
                      >
                        Token generation event (TGE) goes<br class="lg:hidden" />
                        live — power to the predictors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="absolute left-0 lg:bottom-[-70px] bottom-[-40px] gradient-text lg:text-[34px] text-[20px] font-bold whitespace-nowrap"
                style="font-family: Geist"
              >
                2025 Q6
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="!mt-[500px] !mb-[200px]">
      <div class="flex flex-col gap-[30px]">
        <div class="text-[34px] text-center text-[#fff] font-bold" style="font-family: Geist">
          Our Partners
        </div>
        <div class="text-[16px] text-center text-[#fff] font-bold" style="font-family: Geist">
          Powered by AI. Driven by Truth
        </div>
      </div>

      <div class="!mt-[30px] flex flex-col xl:[60px] lg:gap-[50px] gap-[30px]">
        <Vue3Marquee :pauseOnHover="true" duration="30">
              <img src="@/assets/img/home_notice_bg1.png" class="xl:h-[36px] lg:h-[30px] h-[20px] !mr-[30px]" v-for="item in 10">
      </Vue3Marquee>
      <Vue3Marquee :pauseOnHover="true" direction="reverse" duration="30">
              <img src="@/assets/img/home_notice_bg1.png" class="xl:h-[36px] lg:h-[30px] h-[20px] !mr-[30px]" v-for="item in 10">
      </Vue3Marquee>
      </div>
    </div>
    <!-- <div
      class="!mt-[500px] 2xl:h-[254px] xl:h-[234px] lg:h-[200px] sm:h-[180px] h-[160px] relative z-10"
      style="background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)"
    >
      <img
        src="@/assets/img/home_bg10.png"
        class="w-full object-cover 2xl:h-[254px] xl:h-[234px] lg:h-[200px] sm:h-[180px] h-[160px] absolute left-0 top-0"
        draggable="false"
      />
      <div
        class="relative z-10 w-full h-full flex items-center"
        style="background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)"
      >
        <div class="mx-auto w-[80%]">
          <div
            class="w-full flex items-center justify-between lg:!pb-[30px] !pb-[15px] border-b border-solid border-[rbga(255,255,255,.3)]"
          >
            <img
              src="@/assets/img/logo.png"
              mode="scaleToFill"
              draggable="false"
              class="lg:w-[160px] w-[120px]"
            />
            <div class="flex items-center gap-[20px]">
              <img src="@/assets/img/icon_x.png" class="lg:w-[22px] lg:h-[20px] w-[18px] h-[16px] cursor-pointer" alt="" />
              <img src="@/assets/img/icon_tg.png" class="lg:w-[25px] lg:h-[20px] w-[24px] h-[18px] cursor-pointer" alt="" />
              <img
                src="@/assets/img/icon_discord.png"
                class="lg:w-[27px] lg:h-[20px] w-[23px] h-[16px] cursor-pointer"
                alt=""
              />
            </div>
          </div>
          <div class="lg:!pt-[30px] !pt-[15px] lg:text-[14px] text-[12px] text-[#fff]" style="font-family: Geist">
            <div class="text-center">
              copyright: 2024 Copyright 2024 by YES OR NO. All rights reserved
            </div>
            <div class="text-center">Privacy Statement - Terms of Use</div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #6ddd25 0%, #0ab45a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}
</style>
