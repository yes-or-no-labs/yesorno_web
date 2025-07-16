<script setup>
import { computed, onMounted, reactive } from 'vue'
import Segmented from '@/components/Segmented/index.vue'
import { api } from '@/apis'
import network from '@/utils/network'
import { store } from '@/store'
import AiComponent from '@/components/Ai/index.vue'

const state = reactive({
  menuList: [
    { label: 'Trending', value: 1 },
    { label: 'New', value: 2 },
    { label: 'Crypto', value: 3 },
    { label: 'Business', value: 4 },
    { label: 'Politics', value: 5 },
    { label: 'Sports', value: 6 },
    { label: 'Culture', value: 7 },
  ],
  searchInputLoading: false,
  progress: 50,
  progressValue: 50,
  pageNum: 1,
  pageSize: 10,
  dataList: [],
  currentTab: 1,
})

onMounted(() => {
  // loadMore()
})

const appStore = store.useAppStore()

const env = computed(() => import.meta.env)

async function loadMore($state) {
  console.log('onScroll', $state)
  try {
    const res = await api.getMarketData({
      pageSize: state.pageSize,
      pageNum: state.pageNum,
      topic: '',
      eventType: '',
    })
    console.log('getMarketData', res)
    if (res.success) {
      for (const item of res.obj.result) {
        if(item.conditionList.length == 1){
          item.progress = calcPercent(item.conditionList[0], 'yes')
        }
      }
      state.dataList = state.dataList.concat(res.obj.result)
      if (Array.isArray(res.obj.result) && res.obj?.result.length < state.pageSize) {
        $state?.complete()
      } else {
        $state?.loaded()
        state.pageNum++
      }
    } else {
      $state?.error()
    }
  } catch (error) {
    console.error(error)
    $state?.error()
  }
}

function calcPercent(item, type) {
  const totalAmount = item.yesAmount + item.noAmount
  if (Number(totalAmount) === 0) return 0
  if (type === 'yes') {
    return ((item.yesAmount / totalAmount) * 100).toFixed(0)
  } else if (type === 'no') {
    return ((item.noAmount / totalAmount) * 100).toFixed(0)
  }
}

function calcTotalPrice(list) {
  let total = 0
  if (Array.isArray(list) && list.length > 0) {
    for (const item of list) {
      total +=
        Number(appStore.formatUnits(item.yesPaid)) + Number(appStore.formatUnits(item.noPaid))
    }
  }
  return total
}
</script>

<template>
  <div
    class="w-full min-h-screen !pb-[100px] max-w-[1300px] mx-auto !px-[10px] lg:!px-[38px] !pt-[20px]"
  >
    <AiComponent />
    <div class="w-full h-auto lg:h-[58px] block lg:flex items-center justify-between !mt-[20px]">
      <!-- <div class="flex items-center gap-[35px]">
        <div
          class="text-[15px] text-[#fff] cursor-pointer"
          style="font-family: Inter"
          v-for="item in state.menuList"
          :key="item.id"
        >
          {{ item.title }}
        </div>
      </div> -->

      <Segmented
        :options="state.menuList"
        @change="(e) => (state.currentTab = e)"
        :value="state.currentTab"
      />
      <div class="w-full !mt-[10px] lg:!mt-0 lg:w-auto flex items-center gap-[16px]">
        <div
          class="flex-1 lg:w-auto flex items-center border border-solid border-[#22242D] !rounded-[40px] overflow-hidden"
        >
          <v-text-field
            :loading="state.searchInputLoading"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="solo"
            hide-details
            single-line
            class="w-[200px] h-[40px]"
            bg-color="transparent"
            placeholder="Search"
          >
          </v-text-field>
          <!-- <VBtn
            class="!rounded-r-[5px] !rounded-l-[0px] !h-[40px] !bg-[#708D11] !text-[14px] !leading-[14px]"
            variant="flat"
          >
            Search
          </VBtn> -->
        </div>
        <!-- <VBtn
          class="!h-[40px] !bg-[#1A1A1A] !text-[14px] !leading-[14px]"
          variant="flat"
          style="color: rgba(255, 255, 255, 0.49)"
        >
          Create New Market
          <template #append>
            <div class="relative w-[36px] h-[36px]">
              <div class="absolute top-[-5px] left-0">
                <img src="@/assets/img/flag.png" class="w-[36px] h-[36px]" />
              </div>
            </div>
          </template>
        </VBtn> -->
        <VBtnConnect
          class="rounded-[106px] !px-[20px] !py-[12px] flex-1 lg:w-auto !text-[12px] lg:!text-[14px]"
        >
          Create New Market
        </VBtnConnect>
      </div>
    </div>

    <div class="relative">
      <div
        class="w-full flex flex-col lg:grid lg:grid-cols-3 gap-[16px] !pt-[20px] overflow-y-auto"
      >
        <div
          class="rounded-[20px] border border-solid !border-[#FFFFFF80] !p-[15px] cursor-pointer boxItem"
          v-for="item in state.dataList"
          :key="item.guid"
          @click="$router.push(`/marketDetail?eventId=${item.eventId}`)"
        >
          <div class="flex justify-between items-center">
            <div
              class="!py-[5px] !px-[8px] border-[0.5px] border-solid !border-[#fff] rounded-[4px] text-[#fff] text-[12px] leading-[12px]"
            >
              Trending
            </div>
            <!-- <div>
            <v-btn icon="mdi-dots-horizontal" variant="text"></v-btn>
          </div> -->
          </div>
          <div class="flex justify-between items-center !mt-[15px]">
            <div class="flex items-center gap-[20px]">
              <img :src="item.imgUrl" class="w-[58px] h-[58px] rounded-[8px]" />
              <div class="flex flex-col gap-[5px]">
                <div
                  class="text-[#fff] text-[16px] font-bold leading-[20px]"
                  style="font-family: 'Inter'"
                >
                  {{ item.topic }}
                </div>
                <div class="text-[#787878] text-[14px] leading-[14px]" style="font-family: 'Inter'">
                  Trending
                </div>
              </div>
            </div>
            <div class="relative" v-if="item.conditionList.length == 1">
              <v-progress-circular
                :model-value="item.progress"
                :size="70"
                :width="5"
                bg-color="#fff"
                color="#6DDD25"
              >
                <div
                  class="text-[#6DDD25] text-[16px] font-bold absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                >
                  {{ item.progress }}%
                </div>
              </v-progress-circular>
            </div>
          </div>
          <div
            class="!mt-[25px] !mb-[20px] flex items-center gap-[10px]"
            v-if="item.conditionList.length == 1"
          >
            <div
              class="flex-1 rounded-l-[10px] !py-[12px] !pl-[23px] flex flex-col gap-[5px] cursor-pointer"
              style="background: rgba(255, 255, 255, 0.05)"
              v-ripple
              @click.stop="() => console.log('Yes clicked')"
            >
              <div
                class="text-[#6DDD25] text-[20px] leading-[20px] select-none"
                style="font-family: Inter"
              >
                Yes
              </div>
              <div
                class="text-[#787878] text-[14px] leading-[14px] select-none"
                style="font-family: Inter"
              >
                {{ calcPercent(item.conditionList[0], 'yes') }} ¢
              </div>
            </div>
            <div
              class="flex-1 rounded-r-[10px] !py-[12px] !pl-[23px] flex flex-col gap-[5px] cursor-pointer"
              style="background: rgba(255, 255, 255, 0.05)"
              v-ripple
              @click.stop="() => console.log('No clicked')"
            >
              <div
                class="text-[#E72F2F] text-[20px] leading-[20px] select-none"
                style="font-family: Inter"
              >
                No
              </div>
              <div
                class="text-[#787878] text-[14px] leading-[14px] select-none"
                style="font-family: Inter"
              >
                {{ calcPercent(item.conditionList[0], 'no') }} ¢
              </div>
            </div>
          </div>
          <div class="h-[98px] w-full overflow-y-auto !mt-[12px] flex flex-col gap-[12px]" v-else>
            <div
              class="w-full flex items-center gap-[8px]"
              v-for="item1 in item.conditionList"
              :key="item1.conditionId"
            >
              <div class="flex-1 relative rounded-[8px] overflow-hidden">
                <div class="flex-1 flex items-center gap-[12px] !px-[4px]">
                  <div class="text-[14px] text-[#F5F5F6] flex-1 truncate w-[40px]">
                    {{ item1.conditionDesc }}
                  </div>
                  <div class="text-[14px] text-[#F5F5F6]">{{ calcPercent(item1, 'yes') }}%</div>
                </div>
                <div
                  class="h-full absolute left-0 top-0 bg-[#ffffff33]"
                  :style="`width: ${calcPercent(item1, 'yes')}%;`"
                ></div>
              </div>
              <div class="flex-[0.8] flex items-center gap-[5px]">
                <div
                  class="h-[24px] rounded-[8px] text-[14px] bg-[#1A1A1E] text-[#6DDD25] flex-1 flex justify-center items-center hover:bg-[rgb(109,221,37,.5)]"
                  v-ripple
                >
                  Yes
                </div>
                <div
                  class="h-[24px] rounded-[8px] text-[14px] bg-[#1A1A1E] text-[#E72F2F] flex-1 flex justify-center items-center hover:bg-[rgb(231,47,47,.5)]"
                  v-ripple
                >
                  No
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-[16px] text-[#787878]">
              RTG:{{ $formatAmount(calcTotalPrice(item.conditionList)) }}
              {{ network[env.VITE_APP_CHAIN].Denomination }}
            </div>
            <!-- <v-icon icon="mdi-star-outline" size="20" class="cursor-pointer" /> -->
            <img src="@/assets/img/star.png" class="w-[20px] h-[20px] cursor-pointer" />
          </div>
        </div>
      </div>
      <div
        class="w-full flex flex-col lg:grid lg:grid-cols-3 gap-[16px] !pt-[20px] overflow-y-auto absolute lg:top-[150px] left-[50%] top-0 translate-x-[-50%] max-w-[1300px]"
        v-show="state.dataList == 0"
      >
        <v-skeleton-loader
          class="mx-auto w-full !rounded-[20px] border border-solid border-[#fff]"
          type="card-avatar, actions"
          v-for="item in 6"
          height="263"
          max-height="273"
        >
        </v-skeleton-loader>
      </div>
    </div>

    <infinite-loading @infinite="loadMore">
      <template #spinner>
        <div class="text-center !mt-[20px]">Loading...</div>
      </template>
      <template #complete>
        <div class="text-center !mt-[20px]">No more</div>
      </template>
    </infinite-loading>
  </div>
</template>

<style scoped>
.semi-circle-progress {
  clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%);
  margin-bottom: -50px; /* 调整位置 */
}

.boxItem:hover {
  /* box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05), 0px 6px 12px rgba(0, 0, 0, 0.05);
  background-color: rgba(27, 27, 27, .8); */
  translate: 0px -1px;
  box-shadow: 0px 0px 6px 4px #69db2740;
}
</style>
