<script setup>
import { store } from '@/store'
import { computed, onMounted } from 'vue'
import {formatAddress} from '@/utils/uni-app.js'
import profile_icon1 from '@/assets/img/profile_icon1.png'
import profile_icon2 from '@/assets/img/profile_icon2.png'
import profile_icon3 from '@/assets/img/profile_icon3.png'
import profile_icon4 from '@/assets/img/profile_icon4.png'
import {copyToClipboard} from '@/utils/uni-app'
import { useRouter } from 'vue-router'

const menuList = [
  { title: 'Twitter', link: 'https://twitter.com/YesornoFun' },
  { title: 'Telegram', link: 'https://t.me/yesorno_fun' },
  { title: 'Discord', link: 'https://discord.gg/yesorno' },
]

const porfileList=[{
  title: 'My Profile',
  icon: profile_icon1,
  path:'/profile'
}, {
  title: 'My Portfolio',
  icon: profile_icon2,
  path:''
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
  console.log(appStore.tomeState.curWalletAddress);
})

const curWalletAddress = computed(() => appStore.tomeState.curWalletAddress)


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
</script>

<template>
  <div class="w-full h-[80px] fixed top-0 left-0 z-[999]" style="backdrop-filter: blur(15px);">
    <div
      class="max-w-[1440px] mx-auto flex items-center justify-between !px-[32px] h-full gap-[70px]"
    >
      <div class="flex items-center gap-[25px] h-full">
        <div class="flex items-center gap-[40px] cursor-pointer" @click="$router.push('/')">
          <img src="@/assets/img/logo.png" mode="scaleToFill" class="w-[160px] h-[40px]" />
          <!-- <div class="flex flex-col gap-[5px]">
            <div class="text-[#fff] text-[24px] leading-[24px]">Yesorno.Fun</div>
            <div class="text-[#81F963] text-[15px] leading-[15px]">Beta V1</div>
          </div> -->
        </div>
        <div
          class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Inter-Italic"
          @click="$router.push('/market')"
        >
          Market
        </div>
        <div
          class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Inter-Italic"
          @click="$router.push('/task')"
        >
          Tasks
        </div>
        <div
          class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Inter-Italic"
          @click="$router.push('/leaderboard')"
        >
          Leaderboard
        </div>
        <v-menu transition="scale-transition" :offset="[10, 0]">
          <template v-slot:activator="{ props }">
            <div
              class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
              v-bind="props"
              style="font-family: Inter-Italic"
            >
              Social Media
              <v-icon icon="mdi-menu-down" />
            </div>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in menuList" :key="index" :value="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <div
          class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
          style="font-family: Inter-Italic"
        >
          Discord
        </div>
      </div>
      <div class="flex items-center gap-[45px] h-full">
        <div class="flex items-center gap-[45px] h-full" v-show="appStore.tomeState.curWalletAddress">
          <div class="flex flex-col items-center gap-[5px]">
            <div class="text-[#fff] text-[13px] leading-[13px]" style="font-family: Inter">
              My ponts
            </div>
            <div class="text-[#81F963] text-[20px] leading-[20px]" style="font-family: din">
              0.00
            </div>
          </div>
          <div class="flex flex-col items-center gap-[5px]">
            <div class="text-[#fff] text-[13px] leading-[13px]" style="font-family: Inter">
              My Porttollo
            </div>
            <div class="text-[#81F963] text-[20px] leading-[20px]" style="font-family: din">
              $0.00
            </div>
          </div>
          <div class="flex flex-col items-center gap-[5px]">
            <div class="text-[#fff] text-[13px] leading-[13px]" style="font-family: Inter">
              Balance
            </div>
            <div class="text-[#81F963] text-[20px] leading-[20px]" style="font-family: din">
              $0.00
            </div>
          </div>
        </div>
        <div v-show="appStore.tomeState.curWalletAddress">
          <v-menu transition="scale-transition" :offset="[10, 0]" >
          <template v-slot:activator="{ props }">
            <div
              class="text-[#fff] text-[15px] leading-[15px] cursor-pointer"
              v-bind="props"
              style="font-family: Inter-Italic"
            >
              <img src="@/assets/img/person.png" class="w-[50px] h-[50px] rounded-full cursor-pointer" />
            </div>
          </template>
          <v-list>
             <v-list-item>
                <v-list-item-title>
                  <div class="!pb-[16px] border-b border-solid border-[#333741]  flex gap-[8px] items-center">
                    <img src="@/assets/img/person.png" class="w-[40px] h-[40px] rounded-full cursor-pointer" />
                    <div class="flex flex-col">
                      <div class="text-[#fff] text-[14px]" style="font-family: din;">User_238192</div>
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
  </div>
  <div class="w-full h-[80px]"></div>
</template>
