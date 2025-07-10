<script setup>
import { store } from '@/store'
import { computed, onMounted } from 'vue'
import {formatAddress} from '@/utils/uni-app.js'
import profile_icon1 from '@/assets/img/profile_icon1.png'
import profile_icon2 from '@/assets/img/profile_icon2.png'
import profile_icon3 from '@/assets/img/profile_icon3.png'
import profile_icon4 from '@/assets/img/profile_icon4.png'
import personImg from '@/assets/img/person.png'
import {copyToClipboard} from '@/utils/uni-app'
import { useRouter } from 'vue-router'

const menuList = [
  { title: 'White paper', link: 'https://yesorno-labs.gitbook.io/yesornolabs/' },
  { title: 'Medium', link: 'https://medium.com/@yesorno_labs' },
  { title: 'Audit report', link: '' },
]

const porfileList=[{
  title: 'My Profile',
  icon: profile_icon1,
  path:'/profile'
}, {
  title: 'Terms of Use',
  icon: profile_icon3,
  path:''
}, {
  title: 'Log Out',
  icon: profile_icon4,
}]

const appStore = store.useAppStore()

const router = useRouter()


onMounted(()=>{
  // console.log('userInfo',appStore.tomeState);
})

const curWalletAddress = computed(() => appStore.tomeState.curWalletAddress)

const userInfo = computed(() => appStore.tomeState.userInfo)


function handleClickCopy() {
  copyToClipboard(curWalletAddress.value)
}

async function handleClickItem(index){
  // console.log('handleClickItem',appStore.onDisConnectClick);
  
  if(index == 3){
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
  window.open(url)
}

</script>

<template>
  <div class="w-full h-[60px] sticky lg:h-[80px] top-0 left-0 z-[999]" style="backdrop-filter: blur(15px);background: #02361880;">
    <div
      class="hidden lg:flex max-w-[1440px] mx-auto items-center justify-between !px-[32px] h-full gap-[70px]"
    >
      <div class="flex items-center lg:gap-[40px] gap-[25px] h-full">
        <div class="flex items-center lg:gap-[20px] gap-[40px] cursor-pointer" @click="$router.push('/')">
          <img src="@/assets/img/logo.png" mode="scaleToFill" class="w-[120px] h-[30px] lg:w-[160px] lg:h-[40px]" />
          <!-- <div class="flex flex-col gap-[5px]">
            <div class="text-[#fff] text-[24px] leading-[24px]">Yesorno.Fun</div>
            <div class="text-[#81F963] text-[15px] leading-[15px]">Beta V1</div>
          </div> -->
        </div>
         <div
          class="text-[#fff] lg:text-[14px] text-[16px] font-[600] cursor-pointer"
          style="font-family: Geist"
          @click="$router.push('/')"
          :class="currenRoutePath=== '/'?'!text-[#6DDD25]':''"
        >
          Home
        </div>
        <div
          class="text-[#fff] lg:text-[14px] text-[16px] font-[600] cursor-pointer"
          style="font-family: Geist"
          @click="$router.push('/market')"
          :class="currenRoutePath=== '/market'?'!text-[#6DDD25]':''"
        >
          Market
        </div>
        <div
          class="text-[#fff] lg:text-[14px] text-[16px] font-[600] cursor-pointer"
          style="font-family: Geist"
          @click="$router.push('/task')"
          :class="currenRoutePath=== '/task'?'!text-[#6DDD25]':''"
        >
          Tasks
        </div>
        <div
          class="text-[#fff] lg:text-[14px] text-[16px] font-[600] cursor-pointer"
          style="font-family: Geist"
          @click="$router.push('/leaderboard')"
          :class="currenRoutePath=== '/leaderboard'?'!text-[#6DDD25]':''"
        >
          Ranking
        </div>
        <v-menu transition="scale-transition" :offset="[10, 0]">
          <template v-slot:activator="{ props }">
            <div
              class="text-[#fff] lg:text-[14px] text-[16px] font-[600] cursor-pointer whitespace-nowrap flex items-center"
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
        </v-menu>

        <!-- <div
          class="text-[#fff] lg:text-[14px] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Geist"
        >
          Discord
        </div> -->
      </div>
      <div class="flex items-center gap-[45px] h-full">
        <div class="flex items-center gap-[45px] h-full flex-1" v-show="appStore.tomeState.curWalletAddress">
          <div class="flex flex-col items-center gap-[5px]">
            <div class="text-[#fff] lg:text-[12px] text-[13px] leading-[13px] whitespace-nowrap" style="font-family: Inter">
              My ponts
            </div>
            <div class="text-[#81F963] lg:text-[16px] text-[20px] leading-[20px]" style="font-family: din">
              0.00
            </div>
          </div>
          <div class="flex flex-col items-center gap-[5px]">
            <div class="text-[#fff] lg:text-[12px] text-[13px] leading-[13px] whitespace-nowrap" style="font-family: Inter">
              My Porttollo
            </div>
            <div class="text-[#81F963] lg:text-[16px] text-[20px] leading-[20px]" style="font-family: din">
              $0.00
            </div>
          </div>
          <div class="flex flex-col items-center gap-[5px]">
            <div class="text-[#fff] lg:text-[12px] text-[13px] leading-[13px] whitespace-nowrap" style="font-family: Inter">
              Balance
            </div>
            <div class="text-[#81F963] lg:text-[16px] text-[20px] leading-[20px]" style="font-family: din">
              $0.00
            </div>
          </div>
        </div>
        <div class="flex-1" v-show="appStore.tomeState.curWalletAddress">
          <v-menu transition="scale-transition" :offset="[10, 0]" >
          <template v-slot:activator="{ props }">
            <div
              class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
              v-bind="props"
              style="font-family: Geist"
            >
              <img :src="userInfo?.avatarUrl||personImg" class="w-[50px] h-[50px] rounded-full cursor-pointer" />
            </div>
          </template>
          <v-list>
             <v-list-item>
                <v-list-item-title>
                  <div class="!pb-[16px] border-b border-solid border-[#333741]  flex gap-[8px] items-center">
                    <img :src="userInfo?.avatarUrl||personImg" class="w-[40px] h-[40px] rounded-full cursor-pointer" />
                    <div class="flex flex-col">
                      <div class="text-[#fff] text-[14px]" style="font-family: din;">{{ userInfo?.nickname?userInfo?.nickname:`User_${curWalletAddress?.slice(-6)}` }}</div>
                      <div class="flex items-center gap-[5px]">
                        <div class="text-[#fff] text-[14px]" style="font-family: din;">{{ formatAddress(curWalletAddress) }}</div>
                        <img src="@/assets/img/copy.png" class="w-[16px] h-[16px] cursor-pointer" @click="handleClickCopy"/>
                      </div>
                    </div>
                  </div>
                </v-list-item-title>
              </v-list-item>
            <v-list-item v-for="(item, index) in porfileList" :key="index" :value="index" @click="handleClickItem(index)">
                <div class="flex items-center gap-[10px]">
                  <img :src="item.icon" class="w-[20px] h-[20px]" />
                  <div class="text-[#fff] text-[14px] leading-[14px]" style="font-family: din;">
                    {{ item.title }}
                  </div>
                </div>
            </v-list-item>
          </v-list>
        </v-menu>
        </div>
        

        <VBtnConnect class="rounded-[106px]" v-show="!appStore.tomeState.curWalletAddress" @click="$router.push('/login')">
          Connect Wallet
        </VBtnConnect>
      </div>
    </div>
    <div class="flex items-center !px-[32px] h-full justify-between lg:hidden">
      <div class="flex items-center gap-[40px] cursor-pointer" @click="$router.push('/')">
          <img src="@/assets/img/logo.png" mode="scaleToFill" class="w-[120px] h-[30px]" />
        </div>
      <VBtnConnect class="rounded-[106px] !h-[34px] !px-[10px] !py-[6px]" v-show="!appStore.tomeState.curWalletAddress" @click="$router.push('/login')">
          Connect Wallet
      </VBtnConnect>
    </div>
  </div>
</template>
