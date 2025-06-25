<script setup>
import { onMounted, reactive, ref } from 'vue';
import lottie from "lottie-web"; // 引入插件
import animationData from "@/assets/animate/data.json"; // 引入
import * as echarts from 'echarts';
import Footer from '@/components/Footer/index.vue'


const state = reactive({
    timeLine:[
        { title: '1D', id: 1 },
        { title: '1W', id: 2 },
        { title: '1M', id: 3 },
        { title: 'ALL', id: 4 },
    ],
    selectTimeLine: 1,
    chartOption: {
        xAxis: {
          type: 'category',
          boundaryGap: ['5%','5%'],
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          // axisLine:{
          //   symbolOffset: [10, 10],
          // }
          offset: 2,
          axisTick: {
            alignWithLabel: true, // 刻度线与标签对齐
            inside: false,        // 刻度线在轴线内侧
            length: 5           // 刻度线长度
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            // 方法1：缩小标签字体
            // fontSize: 12,
            // 方法2：调整标签边距
            margin: 0,
          },
          // show:false,
          axisLine: {
            lineStyle: {
              color: '#1B1B1B'
            }
          },
          splitLine:{
            show: true,
            lineStyle:{
              color: 'rgba(255,255,255,.1)', // 设置分割线颜色
            }
          }
        },
        tooltip: {
          show: true,
          trigger: 'axis',
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(162, 206, 18, 0.36)' // 渐变起始颜色
                }, {
                  offset: 1,
                  color: 'rgba(43, 56, 1, 0)' // 渐变结束颜色
                }]
              }
            },
            lineStyle:{
              color: '#9DC425',
            },
            itemStyle:{
              borderType: 'solid',
            }
          }
        ],
        grid: {
          // x:50,
          // y: 25,
          // x2: 30,
          // y2: 35,
          left: 0,
          right: 0,
          top: 20,
          bottom: 20,
          // containLabel: true // 确保坐标轴标签也在内
        },
        // backgroundColor: {
        //   image: '@/assets/img/logo.png',
        //   repeat: 'repeat', // 平铺
        //   opacity: 0.1
        // }
        graphic: {
          type: 'image',
          id: 'logo',
          left: 'center',
          top: 'center',
          z: -1, // 确保在图表下方
          style: {
            image: 'https://app.olab.xyz/_next/static/media/olabWaterMark.ec835577.png', // 替换为你的Logo URL
            width: 250, // 图片宽度
            height: 70, // 图片高度
            opacity: 0.2 // 透明度
          }
        }
      }
})

const chartRef = ref(null);

onMounted(()=> {
    optAnimation();
    // console.log('chartRef',chartRef.value);
    const myChart = echarts.init(chartRef.value);
    myChart.setOption(state.chartOption)
});

const optAnimation = () => {
    lottie.destroy('lottieLoading');
    const elem = document.querySelector(".lottieLoading");
    console.log('elem',elem);
    
    const params = {
      container: elem,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData,
      name:'lottieLoading'
    };
    lottie.loadAnimation(params);
  }
</script>

<template>
  <div class="w-full !pb-[40px]">
    <div>
      <img src="@/assets/img/market_bg1.png" class="w-full !h-[127px] object-cover" />
    </div>
    <div class="!px-[40px] !mt-[16px]">
      <div class="flex gap-[13px]">
        <div class="flex-[0.7] rounded-[25px] bg-[#1B1B1B] !px-[30px] !py-[36px]">
          <div class="flex items-center gap-[24px] flex-1">
            <img
              src="https://pub-e95d6af5130d4cb8a791802809e31727.r2.dev/0x18f63f20eead237c83ff75bb7bd2028006fef79d/0xa7e5f55d2381a2cc7c4e709d01603d0c79706746a54d7452006285d9a692eba3"
              class="w-[134px] h-[134px] rounded-[10px]"
            />
            <div class="flex flex-col justify-between !pt-[15px] h-[134px] flex-1">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-[66px]">
                  <div
                    class="text-[14px] text-[#787878] leading-[14px]"
                    style="font-family: inter-bold"
                  >
                    0.597625 SOL trades
                  </div>
                  <div
                    class="text-[14px] text-[#787878] leading-[14px]"
                    style="font-family: inter-bold"
                  >
                    Expires: Sun, 15 Jun 2025 17:00
                  </div>
                </div>
                <img src="@/assets/img/star.png" class="w-[24px] h-[24px] cursor-pointer" />
              </div>

              <div class="text-[24px] text-[#fff] leading-[24px]" style="font-family: inter-bold">
                Will $LUNA break 0.02 in price in a week?
              </div>
              <div class="flex">
                <div
                  class="!py-[5px] !px-[20px] border border-solid !border-[#2B7B84] rounded-[4px] text-[#2B7B84] text-[12px] leading-[12px] inline-block"
                  style="font-family: inter-bold"
                >
                  Trending
                </div>
              </div>
            </div>
          </div>
          <div class="!mt-[30px] flex items-center gap-[30px]">
            <div class="flex flex-col gap-[8px]">
              <div
                class="text-[#787878] text-[14px] leading-[14px]"
                style="font-family: inter-bold"
              >
                trades
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
                trades
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
                trades
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
                trades
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
                trades
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
                trades
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
                trades
              </div>
              <div
                class="text-[#A2D00C] text-[20px] leading-[20px]"
                style="font-family: inter-bold"
              >
                50%
              </div>
            </div>
          </div>
          <div class="!mt-[28px] !pt-[23px]" style="border-top: 1px solid rgba(255,255,255,0.1);">
            <div class="flex items-center gap-[16px]">
                <img src="@/assets/img/conChart.png" class="w-[24px] h-[24px]" />
                <div class="flex items-center gap-[4px]">
                    <div class="flex text-[14px] !py-[4px] !px-[10px] h-[32px] leading-[20px] rounded-[8px] items-center text-[#CECFD2] cursor-pointer" :style="state.selectTimeLine == item.id? `font-family: inter-bold;color:#CCFA15;border:1px solid rgb(51, 55, 65);background:rgb(19, 19, 22);`:`font-family: inter-bold;`" v-for="item in  state.timeLine" :key="item.id" @click="state.selectTimeLine = item.id">{{ item.title }}</div>
                </div>
            </div>
            <div class="flex items-center gap-[16px]">
                <div class="flex-[0.7] h-[462px]" ref="chartRef">
                </div>
                <div class="flex-[0.3] !py-[8px] rounded-[8px] border border-solid border-[#333741] ">
                    <div class="flex items-center justify-between !px-[8px]">
                        <div class="text-[12px] leading-[18px] font-[500] text-[#CECFD2] !pb-[4px]">Order book</div>
                        <svg class="depchart_rotate__VzH13" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" fill="none" style="display: flex; align-items: center; cursor: pointer; transform: rotate(720deg);"><path d="M9.99984 17.0834C13.9119 17.0834 17.0832 13.9121 17.0832 10C17.0832 7.64543 15.9343 5.55915 14.1665 4.27121M10.8332 18.6667L9.1665 17L10.8332 15.3334M9.99984 2.91671C6.08782 2.91671 2.9165 6.08802 2.9165 10C2.9165 12.3547 4.06539 14.4409 5.83317 15.7289M9.1665 4.66671L10.8332 3.00004L9.1665 1.33337" stroke="#FAFAFA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                    <div class="flex items-center !px-[8px]">
                        <div class="flex-1 text-[12px] leading-[18px] text-[#85888E]">
                            Price (USDO)
                        </div>
                        <div class="flex-1 text-[12px] leading-[18px] text-[#85888E] text-center">
                            Shares
                        </div>
                        <div class="flex-1 text-[12px] leading-[18px] text-[#85888E] text-right">
                            Total (USDO)
                        </div>
                    </div>
                    <div class="max-h-[404px] h-[404px] flex flex-col">
                        <div class="max-h-[189px] h-[189px] flex items-end flex-wrap overflow-y-auto  !px-[8px]" style="scrollbar-width: none;">
                            <div class="flex items-center w-full px-[8px]" v-for="item in 10" :key="item">
                                <div class="flex-1 flex items-center gap-[4px]">
                                    <div class="text-[12px] leading-[26px] text-[#FDA29B]" style="font-family: inter-bold">40¢</div>
                                </div>
                                <div class="flex-1 text-[12px] leading-[26px] text-[#CECFD2] text-center">
                                    2,985.00 
                                </div>
                                <div class="flex-1 text-[12px] leading-[26px] text-[#94969C] text-right">
                                    2,985.00 
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-center h-[26px] border-y border-solid border-[#333741] bg-[#1F242F] w-full text-[12px] leading-[18px] text-[#CECFD2]" style="font-family: inter-bold">
                            Spread: 1.00 ¢
                        </div>
                        <div class="max-h-[189px] h-[189px] flex flex-wrap overflow-y-auto  !px-[8px]" style="scrollbar-width: none;">
                            <div class="flex items-center w-full px-[8px]" v-for="item in 10" :key="item">
                                <div class="flex-1 flex items-center gap-[4px]">
                                    <div class="text-[12px] leading-[26px] text-[#3CCB7F]" style="font-family: inter-bold">40¢</div>
                                </div>
                                <div class="flex-1 text-[12px] leading-[26px] text-[#CECFD2] text-center">
                                    2,985.00 
                                </div>
                                <div class="flex-1 text-[12px] leading-[26px] text-[#94969C] text-right">
                                    2,985.00 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <div class="flex-[0.3] rounded-[25px] bg-[#1B1B1B] h-[100px] !P-[16px] lottieLoading" style="border: 1px solid rgba(135, 135, 135, 0.20);">
        </div>
      </div>
      <Footer/>
    </div>
  </div>
</template>
