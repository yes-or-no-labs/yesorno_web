<script setup>
import { onMounted, reactive, computed } from 'vue'
import personImg from '@/assets/img/person.png'
import network from '@/utils/network'
import { api } from '@/apis'
import { store } from '@/store'
import { useWindowResize } from '@/hooks/useWindowResize'
import dayjs from 'dayjs'
import Follow from './component/Follow.vue'

const env = computed(() => import.meta.env)

const state = reactive({
  tabList: [
    { title: 'Followers (O)', value: '1' },
    { title: 'Following (0)', value: '2' },
  ],
  tabList1: [
    { title: 'My Portfolio', value: '1' },
    { title: 'Community', value: '2' },
  ],
  tableTabList: [
    { title: 'Positions', value: '1' },
    { title: 'Orders', value: '2' },
    { title: 'Trades', value: '3' },
    { title: 'Resolution', value: '4' },
    { title: 'Balance Log', value: '5' },
  ],
  currentTab: '1',
  currentTab1: '1',
  currentTableTab: '1',
  positionList: [],
  followersList: [],
  followingList: [],
  pageSize: 10,
  pageNum: 1,
})

onMounted(() => {
  // getUserBetRecord()
})

const { width } = useWindowResize()

const appStore = store.useAppStore()

const userInfo = computed(() => appStore.tomeState.userInfo)
const curWalletAddress = computed(() => appStore.tomeState.curWalletAddress)
async function getUserBetRecord($state) {
  try {
    const res = await api.getUserBetRecord({
      pageSize: state.pageSize,
      pageNum: state.pageNum,
      address: curWalletAddress.value
    })
    console.log('getUserBetRecord', res)
    if (res.success) {
      state.positionList = state.positionList.concat(res.obj.result)
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
</script>

<template>
  <div class="w-full relative min-h-screen">
    <!-- <img
      src="@/assets/img/leaderboard_bg1.png"
      class="w-full h-[448px] absolute top-0 left-0 object-cover"
    /> -->
    <div class="!pt-[40px] flex gap-[20px] relative w-[90%] mx-auto">
      <div
        class="flex flex-col gap-[16px]"
        :style="width > 1024 ? 'width: calc(100% - 386px)' : 'width:100%'"
      >
        <div class="flex flex-col gap-[16px] lg:hidden">
          <div class="text-[#fff] font-bold text-[16px]">Userinfo</div>
          <div
            class="w-full border border-solid !border-[#FFFFFF80] rounded-[6px] !py-[20px] h-[140px]"
          >
            <div
              class="!px-[10px] !pb-[10px] border-b border-solid !border-[#FFFFFF4D] flex items-center justify-between"
            >
              <div class="flex items-center gap-[10px]">
                <img :src="personImg" class="w-[32px] h-[32px] rounded-full" />
                <div class="text-[14px] text-[#fff]">
                  {{
                    userInfo?.nickname ? userInfo?.nickname : `User_${curWalletAddress?.slice(-6)}`
                  }}
                </div>
              </div>
            </div>
            <div class="!mt-[20px] flex justify-end !px-[10px]">
              <v-btn
                class="!text-[12px] !rounded-full font-[600] text-[#fff] !bg-transparent border border-solid !border-[#FFFFFF80]"
                >Edit Profile</v-btn
              >
            </div>
          </div>
        </div>
        <div class="text-[#fff] font-bold text-[16px]">My Portfolio</div>
        <div class="flex flex-col lg:flex-row gap-[10px] lg:gap-[15px] xl:gap-[30px]">
          <div
            class="flex-1 h-[140px] rounded-[6px] !pb-[10px] lg:!pb-[15px] xl:!pb-[20px] overflow-hidden relative !p-[16px] border border-solid !border-[#FFFFFF80]"
            style="
              background: linear-gradient(
                90deg,
                rgba(109, 221, 37, 0.1) 0%,
                rgba(10, 180, 90, 0.1) 100%
              );
            "
          >
            <div class="flex items-center gap-[12px]">
              <!-- <div
                class="bg-[#254684] w-[70px] h-[50px] rounded-tl-[14px] rounded-br-[14px] flex items-center justify-center"
              >
                <img src="@/assets/img/base.png" class="w-[33px] h-[33px]" />
              </div> -->
              <img src="@/assets/img/base.png" class="w-[18px] md:w-[20px] lg:w-[25px]" />
              <div class="text-[#fff] text-[14px] lg:text-[16px] xl:text-[20px] font-[600]">
                Base
              </div>
            </div>
            <div class="md:!mt-[20px] lg:!mt-[30px] xl:!mt-[20px] flex justify-center">
              <div class="flex items-center">
                <div class="flex flex-col gap-[5px] xl:gap-[10px] items-center !pr-[40px]">
                  <div class="text-[#7A7A7A] text-[14px] xl:text-[16px]">PortfoIio</div>
                  <div class="text-[#fff] text-[16px]">$0.00</div>
                </div>
                <div
                  class="flex flex-col gap-[5px] xl:gap-[10px] items-center !px-[40px] border-x border-solid border-[#FFFFFF1A]"
                >
                  <div class="text-[#7A7A7A] text-[14px] xl:text-[16px]">Profit</div>
                  <div class="text-[#fff] text-[16px]">$0.00</div>
                </div>
                <div class="flex flex-col gap-[5px] xl:gap-[10px] items-center !pl-[40px]">
                  <div class="text-[#7A7A7A] text-[14px] xl:text-[16px]">Volume</div>
                  <div class="text-[#fff] text-[16px]">$0.00</div>
                </div>
              </div>
            </div>
            <img
              src="@/assets/img/base_bg.png"
              class="w-[82px] h-[82px] absolute top-[-10px] right-[-10px] object-cover rotate-z-[10deg]"
            />
          </div>

          <div
            class="flex-1 !h-[140px] rounded-[6px] !pb-[10px] lg:!pb-[15px] xl:!pb-[20px] overflow-hidden relative !p-[16px] border border-solid !border-[#FFFFFF80]"
            style="
              background: linear-gradient(
                90deg,
                rgba(109, 221, 37, 0.1) 0%,
                rgba(10, 180, 90, 0.1) 100%
              );
            "
          >
            <div class="flex items-center gap-[12px]">
              <!-- <div
                class="bg-[#452480] w-[70px] h-[50px] rounded-tl-[14px] rounded-br-[14px] flex items-center justify-center"
              >
                <img src="@/assets/img/monad.png" class="w-[33px] h-[33px]" />
              </div> -->
              <img src="@/assets/img/monad.png" class="w-[18px] md:w-[20px] lg:w-[25px]" />
              <div class="text-[#fff] text-[14px] lg:text-[16px] xl:text-[20px] font-[600]">
                Monad Testnet
              </div>
            </div>
            <div class="md:!mt-[20px] lg:!mt-[30px] xl:!mt-[20px] flex justify-center">
              <div class="flex items-center">
                <div class="flex flex-col gap-[5px] xl:gap-[10px] items-center !pr-[40px]">
                  <div class="text-[#7A7A7A] text-[14px] xl:text-[16px]">PortfoIio</div>
                  <div class="text-[#fff] text-[16px]">$0.00</div>
                </div>
                <div
                  class="flex flex-col gap-[5px] xl:gap-[10px] items-center !px-[40px] border-x border-solid border-[#FFFFFF1A]"
                >
                  <div class="text-[#7A7A7A] text-[14px] xl:text-[16px]">Profit</div>
                  <div class="text-[#fff] text-[16px]">$0.00</div>
                </div>
                <div class="flex flex-col gap-[5px] xl:gap-[10px] items-center !pl-[40px]">
                  <div class="text-[#7A7A7A] text-[14px] xl:text-[16px]">Volume</div>
                  <div class="text-[#fff] text-[16px]">$0.00</div>
                </div>
              </div>
            </div>
            <img
              src="@/assets/img/monad_bg.png"
              class="w-[82px] h-[82px] absolute top-[-10px] right-[-10px] object-cover rotate-z-[10deg]"
            />
          </div>
        </div>
        <div class="border border-solid !border-[#FFFFFF80] rounded-[6px] hidden lg:block">
          <v-tabs v-model="state.currentTableTab" align-tabs="left" color="#0AB45A" height="60">
            <v-tab :value="item.value" v-for="item in state.tableTabList" style="font-size: 16px">
              <span>{{ item.title }}</span></v-tab
            >
          </v-tabs>
          <v-tabs-window v-model="state.currentTableTab">
            <v-tabs-window-item value="1">
              <div class="h-[640px] overflow-x-auto positionEl" style="scrollbar-width: auto">
                <!-- table header -->
                <div class="flex items-center w-full bg-[#000]">
                  <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Outcome
                  </div>
                  <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Shares
                  </div>
                  <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Close Date
                  </div>
                  <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Est Avg Price
                  </div>
                  <!-- <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Current Value
                  </div> -->
                  <!-- <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Unrealized P&L
                  </div> -->
                  <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Trading Token
                  </div>
                </div>
                <!-- table body -->
                <div
                  class="flex flex-col w-full"
                  v-for="item in state.positionList"
                  :key="item.guid"
                >
                  <div
                    class="!px-[8px] !pt-[8px] !pb-[2px] text-[14px] text-[#CECFD2] underline"
                    @click="$router.push(`/marketDetail?eventId=${item.eventId}`)"
                  >
                    <span class="cursor-pointer">{{ item.eventInfo.topic }}</span>
                  </div>
                  <div class="flex items-center">
                    <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#6DDD25] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                      :style="item.optionType == 0 ? '' : 'color:#E72F2F'"
                    >
                      {{ item.optionType == 0 ? 'Yes' : 'No' }}
                    </div>
                    <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#6DDD25] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                      :style="item.optionType == 0 ? '' : 'color:#E72F2F'"
                    >
                      {{ item.amount }}
                    </div>
                    <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                    >
                      {{ dayjs(Number(item.eventInfo.endTime) * 1000).format('MMM D, YYYY') }}
                    </div>
                    <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                    >
                      {{ Number(appStore.formatUnits(item.paidAmt)) / item.amount }}
                    </div>
                    <!-- <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                    >
                      1.2
                    </div>
                    <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                    >
                      1.2
                    </div> -->
                    <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                    >
                      {{ network[env.VITE_APP_CHAIN].Denomination }}
                    </div>
                  </div>
                </div>
                <infinite-loading @infinite="getUserBetRecord" target="positionEl">
                  <template #spinner>
                    <div class="text-center !mt-[20px]">Loading...</div>
                  </template>
                  <template #complete>
                    <div class="text-center !mt-[20px]">No more</div>
                  </template>
                  <template #error="{ retry }">
                    <div class="text-center !mt-[100px]">
                        <div class="text-center">Oops something went wrong!</div>
                        <v-btn class="!mt-[20px] border border-solid !border-[#0AB45A] !text-[#0AB45A]" @click="retry">Retry</v-btn>
                    </div>
                  </template>
                </infinite-loading>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
        <div class="block lg:hidden">
          <v-tabs v-model="state.currentTab1" align-tabs="left" color="#0AB45A" height="60">
            <v-tab :value="item.value" v-for="item in state.tabList1" style="font-size: 16px">
              <span>{{ item.title }}</span></v-tab
            >
          </v-tabs>
          <v-tabs-window v-model="state.currentTab1">
            <v-tabs-window-item value="1">
              <div class="border border-solid !border-[#FFFFFF80] rounded-[6px] !mt-[10px]">
                <v-tabs
                  v-model="state.currentTableTab"
                  align-tabs="left"
                  color="#0AB45A"
                  height="60"
                >
                  <v-tab
                    :value="item.value"
                    v-for="item in state.tableTabList"
                    style="font-size: 16px"
                  >
                    <span>{{ item.title }}</span></v-tab
                  >
                </v-tabs>
                <v-tabs-window v-model="state.currentTableTab">
                  <v-tabs-window-item value="1">
                    <div class="h-[440px] overflow-x-auto positionEl" style="scrollbar-width: auto">
                      <!-- table header -->
                      <div class="flex items-center w-full bg-[#000]">
                        <div
                          class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                        >
                          Outcome
                        </div>
                        <div
                          class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                        >
                          Shares
                        </div>
                        <div
                          class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                        >
                          Close Date
                        </div>
                        <div
                          class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                        >
                          Est Avg Price
                        </div>
                        <!-- <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Current Value
                  </div> -->
                        <!-- <div
                    class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                  >
                    Unrealized P&L
                  </div> -->
                        <div
                          class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-y border-solid border-[#FFFFFF80] !py-[10px] !px-[16px]"
                        >
                          Trading Token
                        </div>
                      </div>
                      <!-- table body -->
                      <div
                        class="flex flex-col w-full"
                        v-for="item in state.positionList"
                        :key="item.guid"
                      >
                        <div
                          class="!px-[8px] !pt-[8px] !pb-[2px] text-[14px] text-[#CECFD2] underline"
                          @click="$router.push(`/marketDetail?eventId=${item.eventId}`)"
                        >
                          <span class="cursor-pointer">{{ item.eventInfo.topic }}</span>
                        </div>
                        <div class="flex items-center">
                          <div
                            class="w-[180px] min-w-[180px] text-[14px] text-[#6DDD25] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                            :style="item.optionType == 0 ? '' : 'color:#E72F2F'"
                          >
                            {{ item.optionType == 0 ? 'Yes' : 'No' }}
                          </div>
                          <div
                            class="w-[180px] min-w-[180px] text-[14px] text-[#6DDD25] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                            :style="item.optionType == 0 ? '' : 'color:#E72F2F'"
                          >
                            {{ item.amount }}
                          </div>
                          <div
                            class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                          >
                            {{ dayjs(Number(item.eventInfo.endTime) * 1000).format('MMM D, YYYY') }}
                          </div>
                          <div
                            class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                          >
                            {{ Number(appStore.formatUnits(item.paidAmt)) / item.amount }}
                          </div>
                          <!-- <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                    >
                      1.2
                    </div>
                    <div
                      class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                    >
                      1.2
                    </div> -->
                          <div
                            class="w-[180px] min-w-[180px] text-[14px] text-[#94969C] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px] !px-[16px]"
                          >
                            {{ network[env.VITE_APP_CHAIN].Denomination }}
                          </div>
                        </div>
                      </div>
                      <infinite-loading @infinite="getUserBetRecord" target="positionEl">
                        <template #spinner>
                          <div class="text-center !mt-[20px]">Loading...</div>
                        </template>
                        <template #complete>
                          <div class="text-center !mt-[20px]">No more</div>
                        </template>
                        <template #error="{ retry }">
                          <div class="text-center !mt-[100px]">
                              <div class="text-center">Oops something went wrong!</div>
                              <v-btn class="!mt-[20px] border border-solid !border-[#0AB45A] !text-[#0AB45A]" @click="retry">Retry</v-btn>
                          </div>
                        </template>
                      </infinite-loading>
                    </div>
                  </v-tabs-window-item>
                </v-tabs-window>
              </div>
            </v-tabs-window-item>
            <v-tabs-window-item value="2">
              <Follow :userWalletAddress="curWalletAddress" />
              <!-- <div
                class="w-full !mt-[10px] bg-[#000] border border-solid !border-[#FFFFFF80] rounded-[6px] overflow-hidden"
              >
                <div class="">
                  <v-tabs
                    v-model="state.currentTab"
                    fixed-tabs
                    align-tabs="center"
                    color="#0AB45A"
                    height="50"
                  >
                    <v-tab
                      :value="item.value"
                      v-for="item in state.tabList"
                      style="font-size: 14px"
                    >
                      <span>{{ item.title }}</span></v-tab
                    >
                  </v-tabs>
                  <v-tabs-window v-model="state.currentTab">
                    <v-tabs-window-item value="1">
                      <div class="w-full h-[440px] overflow-y-auto !px-[16px] !pb-[16px]">
                        <div
                          class="!py-[10px] border-b border-solid border-[#384250] flex items-center gap-[12px]"
                          v-for="item in 10"
                          :key="item"
                        >
                          <img
                            :src="personImg"
                            class="w-[32px] h-[32px] rounded-full cursor-pointer"
                          />
                          <div class="text-[14px] text-[#94969c] cursor-pointer">123123</div>
                        </div>
                      </div>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="2">
                      <div class="w-full h-[440px] overflow-y-auto !px-[16px] !pb-[16px]">
                        <div
                          class="!py-[10px] border-b border-solid border-[#384250] flex items-center gap-[12px]"
                          v-for="item in 10"
                          :key="item"
                        >
                          <img
                            :src="personImg"
                            class="w-[32px] h-[32px] rounded-full cursor-pointer"
                          />
                          <div class="text-[14px] text-[#94969c] cursor-pointer">123123</div>
                        </div>
                      </div>
                    </v-tabs-window-item>
                  </v-tabs-window>
                </div>
              </div> -->
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </div>
      <div class="flex flex-col gap-[16px]">
        <div class="lg:flex flex-col gap-[16px] hidden">
          <div class="text-[#fff] font-bold text-[16px]">Userinfo</div>
          <div
            class="w-full border border-solid !border-[#FFFFFF80] rounded-[6px] !py-[20px] h-[140px]"
          >
            <div
              class="!px-[10px] !pb-[10px] border-b border-solid !border-[#FFFFFF4D] flex items-center justify-between"
            >
              <div class="flex items-center gap-[10px]">
                <img :src="userInfo?.avatarUrl||personImg" class="w-[32px] h-[32px] rounded-full" />
                <div class="text-[14px] text-[#fff]">
                  {{
                    userInfo?.nickname ? userInfo?.nickname : `User_${curWalletAddress?.slice(-6)}`
                  }}
                </div>
              </div>
            </div>
            <div class="!mt-[20px] flex justify-end !px-[10px]">
              <v-btn
                class="!text-[12px] !rounded-full font-[600] text-[#fff] !bg-transparent border border-solid !border-[#FFFFFF80]"
                @click="$router.push('/setting')"
                >Edit Profile</v-btn
              >
            </div>
          </div>
        </div>
        <div class="hidden lg:block">
         <Follow :userWalletAddress="curWalletAddress" />
        </div>
      </div>
    </div>
  </div>
</template>
