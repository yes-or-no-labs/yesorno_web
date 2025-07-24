<script setup>
import { reactive } from 'vue'
import { formatAddress } from '@/utils/uni-app.js'
import { api } from '@/apis'

const state = reactive({
  tabList: [
    { title: 'Tasks', value: '1' },
    { title: 'Points History', value: '2',disabled:true },
  ],
  currentTab: '1',
  dataList: [
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      usdc: '1000',
    },
    {
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      usdc: '800',
    },
    {
      address: '0x7890abcdef1234567890abcdef12345678901234',
      usdc: '600',
    },
    {
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      usdc: '800',
    },
    {
      address: '0x7890abcdef1234567890abcdef12345678901234',
      usdc: '600',
    },
  ],
  taskList:[],
  pageSize:10,
  pageNum:1
})

async function getData($state) {
  try {
    const res = await api.getTaskList({
      pageSize: state.pageSize,
      pageNum: state.pageNum,
    })
    if(res.success){
      state.taskList = state.taskList.concat(res.obj.list)
      if (Array.isArray(res.obj.list) && res.obj?.list.length < state.pageSize) {
        $state?.complete()
      } else {
        $state?.loaded()
        state.pageNum++
      }
    } else {
      $state?.error()
    }
  } catch (error) {
    console.error(error);
    $state?.error()
  }
}

async function claimTask(id) {
  try {
    const res = await api.claimTask({
      taskId: id, // Replace with the actual task ID you want to claim
    })
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="w-full relative">
    <div class="relative !py-[20px] md:!py-[50px] lg:!py-[100px] mx-auto md:w-[600px] !px-[16px] md:!px-0">
      <!-- <div class="text-[24px] font-[500] leading-[24px] text-[#fff]">Task center</div> -->
      <div
        class="w-full rounded-[6px] bg-[#000] !p-[10px] md:!p-[16px] lg:!p-[20px] border border-solid  flex items-center justify-between"
        style="border-color: rgba(255, 255, 255, 0.5) !important"
      >
        <div class="flex flex-col gap-[10px] lg:gap-[16px]">
          <div class="text-[#fff] text-[12px] lg:text-[14px] font-[500]">My Points</div>
          <div class="text-[#fff] text-[18px] lg:text-[22px] xl:text-[30px] 2xl:text-[36px] leading-[18px] lg:leading-[22px] xl:leading-[30px] 2xl:leading-[36px] font-[600]">0.00</div>
        </div>
        <div class="flex flex-col gap-[10px] lg:gap-[16px]">
          <div class="text-[#fff] text-[12px] lg:text-[14px] font-[500]">Points Earned Today</div>
          <div class="text-[#0AB45A] text-[18px] lg:text-[22px] xl:text-[30px] 2xl:text-[36px] leading-[18px] lg:leading-[22px] xl:leading-[30px] 2xl:leading-[36px] font-[600] text-right">0.00</div>
        </div>
      </div>
      <!-- <div
        class="!my-[15px] w-full rounded-[16px] bg-[#509C54] !px-[25px] !py-[15px] text-center text-[#fff] text-[18px] leading-[18px]"
      >
        Sign up and log in with Backpack to claim an extra 200 $USDO
      </div> -->
      <div class="w-full rounded-[16px] bg-[#000] min-h-[800px] !mt-[20px]">
        <v-tabs
          v-model="state.currentTab"
          fixed-tabs
          align-tabs="center"
          color="#0AB45A"
          height="60"
        >
          <v-tab
            :value="item.value"
            v-for="item in state.tabList"
            style="font-size: 16px; font-weight: bold"
            :disabled="item.disabled"
            >{{ item.title }}</v-tab
          >
        </v-tabs>
        <v-tabs-window v-model="state.currentTab">
          <v-tabs-window-item value="1">
            <div class="!py-[30px] flex flex-col gap-[50px] h-[500px] overflow-y-auto taskEl">
              <!-- <div>
                <div class="text-[#fff] text-[14px] leading-[14px]">Daily Task</div>
                <div
                  class="!mt-[16px] w-full rounded-[10px] border border-solid !p-[16px] flex justify-between items-center"
                  style="border-color: rgba(255, 255, 255, 0.5) !important"
                >
                  <div class="flex items-center gap-[20px]">
                    <img src="@/assets/img/task_bg1.png" class="w-[37px] h-[37px]" />
                    <div class="flex flex-col gap-[10px]">
                      <div class="text-[#fff] text-[14px] leading-[14px]">Trade 1 time per day</div>
                      <div class="text-[#666666] text-[14px] leading-[14px]">
                        <span class="text-[#0AB45A] mr-[5px]">50</span>
                        Points
                      </div>
                    </div>
                  </div>
                  <VBtn
                    class="!rounded-full !h-[40px] !bg-[#0AB45A] !text-[12px] md:!text-[14px] lg:!text-[16px] !leading-[14px] !text-[#fff] !w-[85px] !font-[600]"
                    variant="flat"
                  >
                    Claim
                  </VBtn>
                </div>
              </div> -->
              <div>
                <!-- <div class="text-[#fff] text-[14px] leading-[14px]">Social Task</div> -->
                <div class="flex flex-col gap-[16px] !mt-[16px] ">
                  <div
                    class="w-full rounded-[10px] border border-solid !p-[16px] flex justify-between items-center"
                    style="border-color: rgba(255, 255, 255, 0.5) !important"
                    v-for="item in state.taskList"
                  >
                    <div class="flex items-center gap-[20px]">
                      <img src="@/assets/img/task_bg1.png" class="w-[37px] h-[37px]" />
                      <div class="flex flex-col gap-[10px]">
                        <div class="text-[#fff] text-[14px] leading-[14px]">
                          {{ item.title }}
                        </div>
                        <div class="text-[#666666] text-[14px] leading-[14px]">
                          <span class="text-[#0AB45A] mr-[5px]">{{ item.reward_points }}</span>
                          Points
                        </div>
                      </div>
                    </div>
                    <VBtn
                      class="!rounded-full !h-[40px] !bg-[#0AB45A] !text-[12px] md:!text-[14px] lg:!text-[16px] !leading-[14px] !text-[#fff] !w-[85px] !font-[600]"
                      variant="flat"
                    >
                      Go
                    </VBtn>
                  </div>
                </div>
              </div>
              <infinite-loading @infinite="getData" target="taskEl">
                  <template #spinner>
                    <div class="text-center !mt-[20px]">Loading...</div>
                  </template>
                  <template #complete>
                    <div class="text-center !mt-[20px]">No more</div>
                  </template>
                </infinite-loading>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #463eac 0%, #ea8c3b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-family: darker;
}
</style>
