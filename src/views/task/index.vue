<script setup>
import { computed, reactive } from 'vue'
import { store } from '@/store'
import personImg from '@/assets/img/person.png'
import { api } from '@/apis'
import { copyToClipboard, formatAddress } from '@/utils/uni-app'
import dayjs from 'dayjs'
import { useWindowResize } from '@/hooks/useWindowResize'

const appStore = store.useAppStore()

const userInfo = computed(() => appStore.tomeState.userInfo)

const curWalletAddress = computed(() => appStore.tomeState.curWalletAddress)

const state = reactive({
  userName: userInfo.value?.nickname
    ? userInfo.value?.nickname
    : `User_${curWalletAddress.value?.slice(-6)}`,
  taskList: [],
  pageSize: 10,
  pageNum: 1,
  inviteList: [],
  inviteTotal: 0,
})

const { width } = useWindowResize()

async function getData($state) {
  try {
    const res = await api.getPointTaskList({
      pageSize: state.pageSize,
      pageNum: state.pageNum,
    })
    if (res.success) {
      for (const item of res.obj.result) {
        item.isOpen = false
      }
      state.taskList = state.taskList.concat(res.obj.result)
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

async function getInviteList($state) {
  try {
    const res = await api.getInviteList({
      pageSize: state.pageSize,
      pageNum: state.pageNum,
    })

    if (res.success) {
      state.inviteList = state.inviteList.concat(res.obj.users)
      state.inviteTotal = res.obj.total
      if (Array.isArray(res.obj.users) && res.obj?.users.length < state.pageSize) {
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

function handleClickCopy() {
  // console.log('handleClickCopy',location.origin);
  const url = location.origin + `/login?inviteCode=${userInfo.value.myInviteCode}`
  copyToClipboard(url)
}

function openLink(item) {
  if (item.action_type === 'ai_prediction') {
    const url = location.origin + `/ai_predictions`
    window.open(url, '_blank')
    setTimeout(() => {
      item.isOpen = true
    }, 1000)
  }else if(item.action_type === 'external_link'){
    window.open(item.link_url, '_blank')
    setTimeout(() => {
      item.isOpen = true
    }, 1000)
  }
}

async function claimTask(item) {
  try {
    state.btnLoading = true
    const res = await api.claimPointTask({
      taskId: item.task_id, // Replace with the actual task ID you want to claim
    })
    if (res.success) {
      item.is_completed = true
    } else {
      toast.error(res.msg || 'Failed to claim task')
    }
  } catch (error) {
    console.error(error)
  } finally {
    state.btnLoading = false
  }
}
</script>

<template>
  <div class="w-[80%] mx-auto !py-[40px]">
    <div class="flex justify-center flex-col items-center gap-[5px]">
      <img
        :src="userInfo?.avatarUrl"
        class="w-[60px] h-[60px] lg:w-[120px] lg:h-[120px] rounded-[10px] object-cover"
        v-if="userInfo?.avatarUrl"
      />
      <img
        :src="personImg"
        class="w-[60px] h-[60px] lg:w-[120px] lg:h-[120px] rounded-[10px] object-cover"
        v-else
      />
      <div class="text-[#fff] text-[16px] lg:text-[18px]">{{ state.userName }}</div>
    </div>
    <div class="!mt-[40px] flex items-center gap-[20px] flex-col lg:flex-row">
      <div
        class="w-full !p-[16px] border border-solid !border-[#FFFFFF80] rounded-[4px] h-[225px] flex flex-col justify-between"
      >
        <div class="text-[#fff] text-[16px]">Invite Code</div>
        <div class="flex justify-center">
          <div class="border border-solid !border-[#FFFFFF80] rounded-full text-[24px] !px-[16px]">
            {{ userInfo.myInviteCode }}
          </div>
        </div>
        <VBtn
          class="!rounded-full !h-[32px] !bg-[#0AB45A] !text-[12px] md:!text-[14px] !leading-[14px] !text-[#fff] !font-[600]"
          variant="flat"
          @click="handleClickCopy"
        >
          Copy Link
        </VBtn>
      </div>
      <div
        class="w-full !p-[16px] border border-solid !border-[#FFFFFF80] rounded-[4px] h-[225px] flex flex-col justify-between"
      >
        <div class="text-[#fff] text-[16px]">Points</div>
        <div class="flex items-center justify-center">
          <div
            class="border border-solid !border-[#FFFFFF80] rounded-full text-[24px] !px-[16px] flex items-center gap-[10px]"
          >
            <img src="@/assets/img/point.png" class="w-[16px] h-[16px]" />
            {{ userInfo.point }}
          </div>
        </div>
        <div class="w-full h-[32px]"></div>
      </div>
      <div
        class="w-full !p-[16px] border border-solid !border-[#FFFFFF80] rounded-[4px] h-[225px] overflow-hidden"
      >
        <div class="text-[#fff] text-[16px]">Quests</div>
        <div class="h-[200px] overflow-y-auto taskEl">
          <div class="flex flex-col">
            <div
              class="w-full border-b border-solid !py-[10px] flex justify-between items-center last:!border-0"
              style="border-color: rgba(255, 255, 255, 0.5) !important"
              v-for="item in state.taskList"
            >
              <div class="flex items-center gap-[10px]">
                <img :src="item.image_url" class="w-[24px] h-[24px]" />
                <!-- <img :src="task_icon1" class="w-[37px] h-[37px]" /> -->
                <!-- <task_icon1/> -->
                <!-- <div v-html="task_icon1"></div> -->
                <div class="flex">
                  <div class="text-[#fff] text-[12px] leading-[12px]">
                    {{ item.title }}
                  </div>
                  <div class="text-[#666666] text-[12px] leading-[12px] !ml-[5px]">
                    <span class="text-[#0AB45A] mr-[5px]">{{ item.reward_points }}</span>
                    Points
                  </div>
                </div>
              </div>
              <div v-if="item.action_type !== 'none'">
                <div v-if="!item.is_completed">
                  <VBtn
                    class="!rounded-full !h-[24px] !bg-[#0AB45A] !text-[12px] md:!text-[14px] !leading-[14px] !text-[#fff] !w-[52px] !font-[600]"
                    variant="flat"
                    @click="openLink(item)"
                    v-show="!item.isOpen"
                  >
                    Go
                  </VBtn>
                  <VBtn
                    class="!rounded-full !h-[24px] !bg-[#0AB45A] !text-[12px] md:!text-[14px] !leading-[14px] !text-[#fff] !w-[52px] !font-[600]"
                    variant="flat"
                    @click="claimTask(item)"
                    v-show="item.isOpen"
                    :loading="state.btnLoading"
                  >
                    Claim
                  </VBtn>
                </div>

                <VBtn
                  class="!rounded-full !h-[34px] !bg-transparent !text-[12px] md:!text-[14px] !leading-[14px] !text-[#0AB45A] !font-[600] border border-solid"
                  style="border-color: rgba(255, 255, 255, 0.5) !important"
                  variant="flat"
                  v-else
                >
                  Completed
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
      </div>
    </div>
    <div class="!mt-[40px] flex flex-col gap-[20px]">
      <div class="w-full flex items-center justify-between">
        <div class="text-[#fff] text-[16px] font-bold">Referrals</div>
        <div
          class="!px-[16px] !py-[2px] border border-solid !border-[#0AB45A] rounded-full flex items-center gap-[5px]"
        >
          <img src="@/assets/img/invite_icon.png" class="w-[16px] h-[16px]" />
          <div class="text-[#fff] text-[16px]">{{ state.inviteTotal }}</div>
        </div>
      </div>
      <div
        class="h-[225px] overflow-x-auto positionEl border border-solid !border-[#FFFFFF80] !p-[16px]"
        style="scrollbar-width: auto"
      >
        <!-- table header -->
        <div class="flex items-center w-full bg-[#000]">
          <div class="w-[50%] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap">
            Email/Wallet
          </div>
          <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap">
            Date Joined
          </div>
          <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap">
            Type
          </div>
          <div class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap">
            Points Earned
          </div>
        </div>
        <!-- table body -->
        <div class="flex flex-col w-full">
          <div class="flex items-center" v-for="item in state.inviteList" :key="item.guid">
            <div
              class="w-[50%] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px]"
            >
              {{ width < 630 ? formatAddress(item.userAddress) : item.userAddress }}
            </div>
            <div
              class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px]"
            >
              {{ dayjs(item.created).format('MMM D, YYYY') }}
            </div>
            <div
              class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px]"
            >
              Invite
            </div>
            <div
              class="w-[180px] min-w-[180px] text-[14px] text-[#CECFD2] whitespace-nowrap border-b border-solid border-[#87878733] !py-[10px]"
            >
              <!-- {{ dayjs(Number(item.eventInfo.endTime) * 1000).format('MMM D, YYYY') }} -->
              {{ item.point }}
            </div>
          </div>
        </div>
        <infinite-loading @infinite="getInviteList" target="positionEl">
          <template #spinner>
            <div class="text-center !mt-[20px]">Loading...</div>
          </template>
          <template #complete>
            <div class="text-center !mt-[20px]">No more</div>
          </template>
          <template #error="{ retry }">
            <div class="text-center !mt-[100px]">
              <div class="text-center">Oops something went wrong!</div>
              <v-btn
                class="!mt-[20px] border border-solid !border-[#0AB45A] !text-[#0AB45A]"
                @click="retry"
                >Retry</v-btn
              >
            </div>
          </template>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>
