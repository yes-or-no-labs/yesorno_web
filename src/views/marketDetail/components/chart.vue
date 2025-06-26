<script setup>
import * as echarts from 'echarts'
import { onMounted, reactive, ref } from 'vue';
const state = reactive({
  timeLine: [
    { title: '1D', id: 1 },
    { title: '1W', id: 2 },
    { title: '1M', id: 3 },
    { title: 'ALL', id: 4 },
  ],
  selectTimeLine: 1,
  chartOption: {
    xAxis: {
      type: 'category',
      boundaryGap: ['5%', '5%'],
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      // axisLine:{
      //   symbolOffset: [10, 10],
      // }
      offset: 2,
      axisTick: {
        alignWithLabel: true, // 刻度线与标签对齐
        inside: false, // 刻度线在轴线内侧
        length: 5, // 刻度线长度
      },
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
          color: '#1B1B1B',
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,.1)', // 设置分割线颜色
        },
      },
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
            colorStops: [
              {
                offset: 0,
                color: 'rgba(162, 206, 18, 0.36)', // 渐变起始颜色
              },
              {
                offset: 1,
                color: 'rgba(43, 56, 1, 0)', // 渐变结束颜色
              },
            ],
          },
        },
        lineStyle: {
          color: '#9DC425',
        },
        itemStyle: {
          borderType: 'solid',
        },
      },
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
        opacity: 0.2, // 透明度
      },
    },
  },
})
const chartRef = ref(null)

onMounted(() => {
  // optAnimation();
  // console.log('chartRef',chartRef.value);
  const myChart = echarts.init(chartRef.value)
  myChart.setOption(state.chartOption)
})
</script>

<template>
  <div class="flex-[0.7] h-[462px]" ref="chartRef"></div>
</template>
