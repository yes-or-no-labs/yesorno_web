<script setup>
import { computed, reactive } from 'vue'
import backpackImg from '@/assets/img/backpack.png'
import hahaImg from '@/assets/img/haha.png'
import metamaskImg from '@/assets/img/metamask.png'
import coinbaseImg from '@/assets/img/coinbase.png'
import okxImg from '@/assets/img/okx.png'
import phantomImg from '@/assets/img/phantom.png'
import { store } from '@/store'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification";

const state = reactive({
  walletList: [
    {
      title: 'Backpack',
      icon: backpackImg,
      walletRdns: 'app.backpack',
    },
    {
      title: 'HaHa Wallet',
      icon: hahaImg,
      walletRdns: 'haha.me',
    },
    {
      title: 'MetaMask',
      icon: metamaskImg,
      walletRdns: 'io.metamask',
    },
    {
      title: 'Coinbase Wallet',
      icon: coinbaseImg,
      walletRdns: 'com.coinbase.wallet',
    },
    {
      title: 'OKX Wallet',
      icon: okxImg,
      walletRdns: 'com.okex.wallet',
    },
    {
      title: 'Phantom',
      icon: phantomImg,
      walletRdns: 'app.phantom',
    },
  ],
})

const appStore = store.useAppStore()
const router = useRouter()
const toast = useToast();


async function connectWallet(item) {
  try {
    const res = await appStore.evmConnectWallet(false, item.walletRdns)
    console.log('connectWallet res', res)
    if (res.success) {
      router.push('/')
    }else{
        if(res.code === 40001){
         toast.error(`${item.title} is not installed. Please install ${item.title} or try another wallet.`);
        }
    }
  } catch (error) {
    console.error(error)
  }
}

const rdnsArr = computed(() => {
  const arr = []
  for (let providerObj of appStore.mStateSimple.providers.values()) {
    arr.push(providerObj.info.rdns.toLowerCase())
  }
  return arr
})

function isDetected(walletRdns) {
  return rdnsArr.value.some((item) => item.toLowerCase().includes(walletRdns))
}
</script>

<template>
  <div class="w-full relative !pt-[100px]">
    <div class="flex flex-col items-center gap-[16px] w-[360px] mx-auto !px-[16px]">
      <div class="flex flex-col items-center gap-[24px]">
        <div class="flex items-center gap-[10px]">
          <img src="@/assets/img/logo.png" class="w-[56px] h-[56px]" />
          <div class="text-[32px] fon-[500] text-[#fff] leading-[32px]" style="font-family: din">
            Yesorno
          </div>
        </div>
        <div class="text-[24px] fon-[500] text-[#fff] leading-[24px]" style="font-family: din">
          Sign into Your Account
        </div>
        <div class="text-[16px] fon-[500] text-[#9DC425] leading-[16px]" style="font-family: din">
          Get100 $USD0as aNewUser
        </div>
      </div>
      <div class="flex flex-col items-center gap-[16px]">
        <div
          class="w-[360px] rounded-[4px] border border-solid border-[#333741] !px-[10px] h-[44px] flex items-center justify-between bg-[#131316] hover:bg-[#333741] cursor-pointer"
          v-ripple
          v-for="item in state.walletList"
          :key="item.title"
          @click="connectWallet(item)"
        >
          <div class="flex items-center gap-[10px] cursor-pointer">
            <img :src="item.icon" class="w-[22px] h-[22px] rounded-[4px]" />
            <div class="text-[#fff] text-[14px] leading-[14px]" style="font-family: din">
              {{ item.title }}
            </div>
          </div>
          <div
            class="bg-[#250070] text-[#CCB3FF] !px-[8px] !py-[5px] text-[12px] leading-[12px] rounded-full border border-solid border-[#4800D7]"
            style="font-family: din"
            v-show="isDetected(item.walletRdns)"
          >
            Detected
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
