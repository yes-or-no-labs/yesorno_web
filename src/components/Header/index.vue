<script setup>
import { store } from '@/store'
import { computed, onMounted, reactive, watch } from 'vue'
import { formatAddress } from '@/utils/uni-app.js'
import profile_icon1 from '@/assets/img/profile_icon1.png'
import profile_icon2 from '@/assets/img/profile_icon2.png'
import profile_icon3 from '@/assets/img/profile_icon3.png'
import profile_icon4 from '@/assets/img/profile_icon4.png'
import settingImg from '@/assets/img/setting.png'

import personImg from '@/assets/img/person.png'
import { copyToClipboard } from '@/utils/uni-app'
import { useRouter } from 'vue-router'
import network from '@/utils/network'
import Erc20ABi from '@/abi/erc_20.json'

const menuList = [
  { title: 'White paper', link: 'https://yesorno-labs.gitbook.io/yesornolabs/' },
  { title: 'Medium', link: 'https://medium.com/@yesorno_labs' },
  { title: 'Audit report', link: '/report' },
]

const marketList = [
  { title: 'Price Prediction', path: '/market_pricePrediction' },
  { title: 'Event Prediction', path: '/market' },
]

const porfileList = [
  //   {
  //   title: 'My Profile',
  //   icon: profile_icon1,
  //   path:'/profile'
  // },
  {
    title: 'Setting',
    icon: settingImg,
    path: '/setting',
  },
  // {
  //   title: 'Terms of Use',
  //   icon: profile_icon3,
  //   path:''
  // },
  {
    title: 'Log Out',
    icon: profile_icon4,
  },
]

const state = reactive({
  tokenContract: null,
  balanceOfUsdo: 0,
})

const appStore = store.useAppStore()
const themeStore = store.useThemeStore()

const router = useRouter()

const curWalletAddress = computed(() => appStore.tomeState.curWalletAddress)

const userInfo = computed(() => appStore.tomeState.userInfo)

const pointsInfo = computed(() => appStore.tomeState.pointsInfo)

const balanceOfMon = computed(() => appStore.tomeState.balanceOfMain)

watch(
  () => appStore.mStateSimple.metamaskProvider,
  () => {
    initErc20Contract()
    // getTokenBalance()
    appStore.getTokenBalance()
  },
)

function handleClickCopy() {
  copyToClipboard(curWalletAddress.value)
}

async function handleClickItem(index) {
  console.log('handleClickItem', index)

  if (index == 1) {
    await appStore.onDisConnectClick()
    return
  }
  router.push(porfileList[index].path)
}

const currenRoutePath = computed(() => {
  // console.log('currenRoutePath', router.currentRoute.value)

  return router.currentRoute.value.fullPath
})

function handleClickMenu(url) {
  if (url === '/report') {
    router.push('/report')
  } else {
    window.open(url)
  }
}

function initErc20Contract() {
  state.tokenContract = appStore.initErc20Contract(
    network[import.meta.env.VITE_APP_CHAIN][network[import.meta.env.VITE_APP_CHAIN].Denomination],
    Erc20ABi,
  )
}

async function getTokenBalance() {
  if (!state.tokenContract) return
  const balance = await state.tokenContract.balanceOf(appStore.tomeState.curWalletAddress)
  state.balanceOfUsdo = appStore.formatUnits(balance)
  // console.log('balanceOfUsdo', state.balanceOfUsdo)
}
</script>

<template>
  <div
    class="w-full h-[60px] sticky lg:h-[80px] top-0 left-0 z-[999] transition-all duration-300 backdrop-blur-[15px] bg-[var(--color-header-bg)]"
  >
    <div
      class="hidden lg:flex max-w-[1440px] mx-auto items-center justify-between !px-[32px] h-full gap-[70px]"
    >
      <div class="flex items-center lg:gap-[40px] gap-[25px] h-full text-[16px] font-[600] ">
        <div
          class="flex items-center lg:gap-[20px] gap-[40px] cursor-pointer w-[120px] h-[30px] lg:w-[160px] lg:h-[40px]"
          @click="$router.push('/')"
        >
          <img
            src="@/assets/img/logo.png"
            mode="scaleToFill"
            class="w-[120px] h-[30px] lg:w-[160px] lg:h-[40px]"
          />
          <!-- <div class="flex flex-col gap-[5px]">
            <div class="text-[#fff] text-[24px] leading-[24px]">Yesorno.Fun</div>
            <div class="text-[#81F963] text-[15px] leading-[15px]">Beta V1</div>
          </div> -->
        </div>
        <div
          class="cursor-pointer transition-colors duration-300 text-text-primary"
          :class="{ 'text-primary': currenRoutePath === '/' }"
          style="font-family: Geist"
          @click="$router.push('/')"
        >
          Home
        </div>
        <div
          class="cursor-pointer"
          style="font-family: Geist"
          @click="$router.push('/market')"
          :class="currenRoutePath=== '/market'?'text-primary':''"
        >
        Market
        </div>
        <!-- <v-menu transition="scale-transition" :offset="[10, 0]">
          <template v-slot:activator="{ props }">
            <div
              class="text-[#fff] cursor-pointer whitespace-nowrap flex items-center"
              v-bind="props"
            >
            <div>Market</div>
              <v-icon icon="mdi-menu-down" />
            </div>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in marketList" :key="index" :value="index" @click="$router.push(item.path)">
              <v-list-item-title>
                <div :class="currenRoutePath=== item.path?'text-primary':'text-[#fff]'">{{ item.title }}</div>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->
        <div
          class="cursor-pointer whitespace-nowrap"
          style="font-family: Geist"
          @click="$router.push('/market_pricePrediction')"
          :class="currenRoutePath === '/market_pricePrediction' ? 'text-primary' : ''"
        >
          Price Prediction
        </div>
        <div
          class="cursor-pointer whitespace-nowrap"
          style="font-family: Geist"
          @click="$router.push('/ai_predictions')"
          :class="currenRoutePath === '/ai_predictions' ? 'text-primary' : ''"
        >
          AI Predictions
        </div>
        <div
          class="cursor-pointer"
          style="font-family: Geist"
          @click="$router.push('/task')"
          :class="currenRoutePath === '/task' ? 'text-primary' : ''"
        >
          Tasks
        </div>
        <div
          class="cursor-pointer"
          style="font-family: Geist"
          @click="$router.push('/leaderboard')"
          :class="currenRoutePath === '/leaderboard' ? 'text-primary' : ''"
        >
          Ranking
        </div>
        <!-- <v-menu transition="scale-transition" :offset="[10, 0]">
          <template v-slot:activator="{ props }">
            <div
              class="text-[#fff] cursor-pointer whitespace-nowrap flex items-center"
              v-bind="props"
            >
            <div>Docs</div>
              <v-icon icon="mdi-menu-down" />
            </div>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in menuList" :key="index" :value="index" @click="handleClickMenu(item.link)">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu> -->

        <!-- <div
          class="text-[#fff] lg:text-[14px] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Geist"
        >
          Discord
        </div> -->
      </div>
      <div class="flex items-center gap-[45px] h-full">
        <!-- 主题切换按钮 -->
        <div class="flex items-center">
          <button
            @click="themeStore.toggleTheme"
            class="flex items-center justify-center w-[40px] h-[40px] rounded-full border-2 border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            :title="themeStore.isDark ? '切换到亮色主题' : '切换到暗色主题'"
          >
            <!-- 太阳图标 (亮色主题) -->
            <svg
              v-if="!themeStore.isDark"
              class="w-5 h-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>
            <!-- 月亮图标 (暗色主题) -->
            <svg
              v-else
              class="w-5 h-5 text-blue-200"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
              />
            </svg>
          </button>
        </div>
        <div
          class="flex items-center gap-[45px] h-full flex-1"
          v-show="appStore.tomeState.curWalletAddress && appStore.tomeState.token"
        >
          <div class="flex flex-col items-center gap-[5px]">
            <div
              class="lg:text-[12px] text-[13px] leading-[13px] whitespace-nowrap"
              style="font-family: Inter"
            >
              My Points
            </div>
            <div class="text-primary lg:text-[16px] text-[20px] leading-[20px]">
              {{ $formatAmount(pointsInfo?.available_points || 0) }}
            </div>
          </div>
          <div class="flex flex-col items-center gap-[5px]">
            <div
              class="lg:text-[12px] text-[13px] leading-[13px] whitespace-nowrap"
              style="font-family: Inter"
            >
              Balance(MON)
            </div>
            <div class="text-primary lg:text-[16px] text-[20px] leading-[20px]">
              {{ $formatAmount(balanceOfMon) }}
            </div>
          </div>
          <!-- <div class="flex flex-col items-center gap-[5px]">
            <div class="text-[#fff] lg:text-[12px] text-[13px] leading-[13px] whitespace-nowrap" style="font-family: Inter">
              My Portfolio
            </div>
            <div class="text-[#81F963] lg:text-[16px] text-[20px] leading-[20px]">
              $0.00
            </div>
          </div>
          <div class="flex flex-col items-center gap-[5px]">
            <div class="text-[#fff] lg:text-[12px] text-[13px] leading-[13px] whitespace-nowrap" style="font-family: Inter">
              Balance
            </div>
            <div class="text-[#81F963] lg:text-[16px] text-[20px] leading-[20px]">
              ${{ $formatAmount(state.balanceOfUsdo) }}
            </div>
          </div> -->
        </div>
        <div
          class="w-[50px] h-[50px]"
          v-show="appStore.tomeState.curWalletAddress && appStore.tomeState.token"
        >
          <v-menu transition="scale-transition" :offset="[10, 0]">
            <template v-slot:activator="{ props }">
              <div
                class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
                v-bind="props"
                style="font-family: Geist"
              >
                <img
                  :src="userInfo?.avatarUrl || personImg"
                  class="w-[50px] h-[50px] rounded-full cursor-pointer"
                />
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <div
                    class="!pb-[16px] border-b border-solid border-[#333741] flex gap-[8px] items-center"
                  >
                    <img
                      :src="userInfo?.avatarUrl || personImg"
                      class="w-[40px] h-[40px] rounded-full cursor-pointer"
                    />
                    <div class="flex flex-col">
                      <div class="text-[#fff] text-[14px]">
                        {{
                          userInfo?.nickname
                            ? userInfo?.nickname
                            : `User_${curWalletAddress?.slice(-6)}`
                        }}
                      </div>
                      <div class="flex items-center gap-[5px]">
                        <div class="text-[#fff] text-[14px]">
                          {{ formatAddress(curWalletAddress) }}
                        </div>
                        <img
                          src="@/assets/img/copy.png"
                          class="w-[16px] h-[16px] cursor-pointer"
                          @click="handleClickCopy"
                        />
                      </div>
                    </div>
                  </div>
                </v-list-item-title>
              </v-list-item>
              <v-list-item
                v-for="(item, index) in porfileList"
                :key="index"
                :value="index"
                @click="handleClickItem(index)"
              >
                <div class="flex items-center gap-[10px]">
                  <img :src="item.icon" class="w-[20px] h-[20px]" />
                  <div class="text-[#fff] text-[14px] leading-[14px]">
                    {{ item.title }}
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <VBtnConnect
          class="rounded-[106px]"
          v-show="!appStore.tomeState.curWalletAddress || !appStore.tomeState.token"
          @click="$router.push('/login')"
        >
          Connect Wallet
        </VBtnConnect>
      </div>
    </div>
    <div class="flex items-center !px-[32px] h-full justify-between lg:hidden">
      <div class="flex items-center gap-[40px] cursor-pointer" @click="$router.push('/')">
        <img src="@/assets/img/logo.png" mode="scaleToFill" class="w-[120px] h-[30px]" />
      </div>
      <div class="flex items-center gap-[20px]">
        <!-- 移动端主题切换按钮 -->
        <button
          @click="themeStore.toggleTheme"
          class="flex items-center justify-center w-[34px] h-[34px] rounded-full border-2 border-white/20 bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          :title="themeStore.isDark ? '切换到亮色主题' : '切换到暗色主题'"
        >
          <!-- 太阳图标 (亮色主题) -->
          <svg
            v-if="!themeStore.isDark"
            class="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clip-rule="evenodd"
            />
          </svg>
          <!-- 月亮图标 (暗色主题) -->
          <svg
            v-else
            class="w-4 h-4 text-blue-200"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            />
          </svg>
        </button>
        <VBtnConnect
          class="rounded-[106px] !h-[34px] !px-[10px] !py-[6px]"
          v-show="!appStore.tomeState.curWalletAddress"
          @click="$router.push('/login')"
        >
          Connect Wallet
        </VBtnConnect>
      </div>
    </div>
  </div>
</template>
