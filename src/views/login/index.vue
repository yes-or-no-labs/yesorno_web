<script setup>
import { computed, onMounted, reactive } from 'vue'
import backpackImg from '@/assets/img/backpack.png'
import hahaImg from '@/assets/img/haha.png'
import metamaskImg from '@/assets/img/metamask.png'
import tokenpocketImg from '@/assets/img/tokenpocket.png'

import coinbaseImg from '@/assets/img/coinbase.png'
import okxImg from '@/assets/img/okx.png'
import phantomImg from '@/assets/img/phantom.png'
import { store } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from "vue-toastification";
import { ethers } from 'ethers'
import { api } from '@/apis'

const state = reactive({
  walletList: [
    // {
    //   title: 'Backpack',
    //   icon: backpackImg,
    //   walletRdns: 'app.backpack',
    // },
    // {
    //   title: 'HaHa Wallet',
    //   icon: hahaImg,
    //   walletRdns: 'haha.me',
    // },
    {
      title: 'MetaMask',
      icon: metamaskImg,
      walletRdns: 'io.metamask',
    },
    {
      title: 'TokenPocket',
      icon: tokenpocketImg,
      walletRdns: 'https://www.tokenpocket.pro/en/download/app',
    },
    // {
    //   title: 'Coinbase Wallet',
    //   icon: coinbaseImg,
    //   walletRdns: 'com.coinbase.wallet',
    // },
    {
      title: 'OKX Wallet',
      icon: okxImg,
      walletRdns: 'com.okex.wallet',
    },
    // {
    //   title: 'Phantom',
    //   icon: phantomImg,
    //   walletRdns: 'app.phantom',
    // },
  ],
  checkTerms:false,
  curRdns:'',
  inviteCode:''
})

const appStore = store.useAppStore()
const router = useRouter()
const toast = useToast();
const route = useRoute()

onMounted(()=>{
  console.log('route',route);
  state.inviteCode = route.query.inviteCode
})


async function connectWallet(item) {
  try {
    if(!state.checkTerms) return toast.error(`Please check the Terms of Use to proceed.`);
    state.curRdns = item.walletRdns
    const res = await appStore.evmConnectWallet(false, item.walletRdns)
    // console.log('connectWallet res', res)
    if (res.success) {
      await getSignatrue()
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

function generateSecure14DigitRandom() {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    let result = '';
    array.forEach(value => {
        result += value.toString().padStart(10, '0').slice(-10);
    });
    return result.slice(0, 14);
}


async function getSignatrue() {
          // await appStore.mStateSimple.ethersBrowserProvider.ready();
    try {
      const provider = new ethers.BrowserProvider(
        appStore.mStateSimple.metamaskProvider
      );

      const nonce = generateSecure14DigitRandom()
      const timestamp = Math.floor(new Date().getTime() / 1000);
    
      const signer = await provider.getSigner();
      const signMessage = {nonce,timestamp}
      
      const signatrue = await signer.signMessage(JSON.stringify(signMessage));
      // console.log("signatrue", signatrue);
      const res = await api.login({
        nonce,
        timestamp,
        sign:signatrue,
        invite_code:'',
        sources:'web',
        sign_in_wallet_plugin:state.curRdns
      })
      // console.log('login',res);
      if(res.success){
        appStore.onUpdateToken('bearer '+res.obj.accessToken)
        appStore.onUpdateRefreshToken(res.obj.refreshToken)
        await appStore.getUserInfo(state.inviteCode)
        await appStore.getPointsInfo()
        router.push('/')
      }else{
        toast.error(res.msg || 'Login failed, please try again.')
      }
    } catch (error) {
      console.error(error);
    }
    
  }
</script>

<template>
  <div class="w-full relative sm:!pt-[100px] !pt-[50px] min-h-screen">
    <div class="flex flex-col items-center gap-[16px] w-[360px] mx-auto !px-[16px]">
      <div class="flex flex-col items-center sm:gap-[24px] gap-[18px]">
        <div class="flex items-center gap-[10px]">
          <img src="@/assets/img/logo.png" class="w-[160px] h-[40px] sm:w-[240px] sm:h-[60px]" />
          <!-- <div class="text-[32px] fon-[500] text-[#fff] leading-[32px]" style="font-family: din">
            Yesorno
          </div> -->
        </div>
        <div class="sm:text-[24px] text-[18px] fon-[600] text-[#fff] sm:leading-[24px] leading-[18px]" style="font-family: din">
          Sign into Your Account
        </div>
        <div class="sm:text-[16px] text-[14px] fon-[600] text-[#9DC425] leading-[16px]" style="font-family: din">
          Get100 $USD0as aNewUser
        </div>
      </div>
      <div class="flex flex-col items-center gap-[16px] w-full !px-[20px]">
        <div
          class="sm:w-[360px] w-full rounded-[4px] border border-solid border-[#333741] !px-[10px] h-[44px] flex items-center justify-between bg-[#131316] hover:bg-[#333741] cursor-pointer"
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
      <div>
        <v-checkbox v-model="state.checkTerms" color="#3182ce" :hide-details="true">
            <template v-slot:label>
                <div class="text-[16px] text-[#fff]" style="font-family: din;">
                    I agree to the <span class="cursor-pointer underline" style="font-family: din;">Terms of Use.</span>
                </div>
            </template>
            </v-checkbox>
      </div>
      <div class="cursor-pointer underline text-[16px] text-[#94969C] text-center" @click="$router.back()">Back</div>
    </div>
  </div>
</template>


<style scoped>
</style>