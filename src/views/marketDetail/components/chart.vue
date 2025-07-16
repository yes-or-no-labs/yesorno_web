<script setup>
import { useWindowResize } from '@/hooks/useWindowResize';
import { debounce } from '@/utils/debounce';
import dayjs from 'dayjs';
import * as echarts from 'echarts'
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
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
      max: 100,
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
      formatter: function(params) {
        const date = dayjs(props.chartData[params[0].dataIndex].timestamp).format('MMM DD YY hh:mm:ss A')
        let html = `${date}<br/>`;
        params.forEach(item => {
          html += `<div style="width:100%;display:flex;justify-content: space-between;">
            <span style="color:#0ab45a">●</span>${item.value}%</div>`;
        });
        return html;
      }
    },
    series: [
      {
        // data: [820, 932, 901, 934, 1290, 1330, 1320],
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
        image: 'https://godyon.s3.ap-southeast-1.amazonaws.com/uploads/image/png/17526590842732960.png', // 替换为你的Logo URL
        width: 250, // 图片宽度
        height: 70, // 图片高度
        opacity: 0.2, // 透明度
      },
    },
  },
})
const chartRef = ref(null)

const props = defineProps({
  chartData:{
    type:Array,
    defalut:()=>[]
  }
})

const { width } = useWindowResize()

onMounted(() => {
  // optAnimation();
  nextTick(()=>{
    // initChart()
  })
})

watch(()=>props.chartData,()=>{
  const date = props.chartData.map(item=> dayjs(item.timestamp).format('HH:mm'))
  state.chartOption.xAxis.data = date
  const value = props.chartData.map(item=> Number(item.yesPercent)*100)
  // console.log('date',date);
  // console.log('value',value);
  state.chartOption.series[0].data = value
  initChart()
})

watch(()=>width.value,()=>{
  debounce(()=>{
    const myChart = echarts.init(chartRef.value)
    myChart.resize();
  })
})

function initChart() {
  const myChart = echarts.init(chartRef.value)
  myChart.setOption(state.chartOption)
}

defineExpose({initChart})
</script>

<template>
  <div class="w-full lg:flex-[0.7] h-[462px]" ref="chartRef"></div>
</template>
