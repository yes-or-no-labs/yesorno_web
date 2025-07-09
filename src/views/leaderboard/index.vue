<script setup>
import { reactive } from 'vue'
import {formatAddress} from '@/utils/uni-app.js'
import Segmented from '@/components/Segmented/index.vue'
import { useWindowResize } from '@/hooks/useWindowResize';

const state = reactive({
    tabList:[{title:'Today', value:'1'}, {title:'Last Week', value:'2'}, {title:'Last 2 Weeks', value:'3'}, {title:'Last Month', value:'4'}],
    currentTab: '1',
    dataList:[{
        address: '0x1234567890abcdef1234567890abcdef12345678',
        usdc: '1000',
    }, {
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        usdc: '800',
    }, {
        address: '0x7890abcdef1234567890abcdef12345678901234',
        usdc: '600',
    }, {
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        usdc: '800',
    }, {
        address: '0x7890abcdef1234567890abcdef12345678901234',
        usdc: '600',
    }],
    menuList: [
    { label: 'Today', value: '1' },
    { label: 'Last Week', value: '2'},
    { label: 'Last 2 Weeks', value:'3' },
    { label: 'Last Month', value: '4' },
  ],
})

const { width } = useWindowResize();

function filterStyle(index) {
    if( index === 0) {
        return 'background: linear-gradient(90deg, rgba(216, 12, 12, 0.5) 0%, rgba(216, 12, 12, 0) 30%, rgba(216, 12, 12, 0) 100%);'
    } else if (index === 1) {
        return 'background: linear-gradient(90deg, rgba(255, 153, 0, 0.5) 0%, rgba(227, 137, 2, 0) 30%, rgba(227, 137, 2, 0) 100%);'
    } else if (index === 2) {
        return 'background: linear-gradient(90deg, rgba(224, 239, 24, 0.3) 0%, rgba(224, 239, 24, 0) 30%, rgba(224, 239, 24, 0) 100%);'
    } else {
        return ''
    }
}

function tabChange(val) {
    console.log('tabChange',val);
    
}
</script>


<template>
  <div class="w-full relative !pb-[100px] sm:min-h-screen">
    <!-- <img src="@/assets/img/leaderboard_bg1.png" class="w-full h-[448px] absolute top-0 left-0 object-cover" /> -->
    <div class="relative 2xl:!px-[50px] xl:!px-[40px] lg:!px-[30px] sm:!px-[20px] !px-[10px]  sm:!mt-[100px]">
        <!-- <div class="flex items-center justify-between !pb-[10px]" style="border-bottom: 1px solid rgba(255, 255, 255, .5);">
            <div class="flex items-center relative">
                <div class="text-[40px] font-[800] text-[#FFB702] leading-[40px]" style="font-family: Inter;">Trade now to earn points</div>
                <img src="@/assets/img/leaderboard_bg2.png" class="w-[137px] h-[123px] absolute bottom-[-60%] right-[-30%]" />
            </div>
            <div class="flex items-center gap-[10px]">
                <img src="@/assets/img/refresh.png" class="w-[20px] h-[20px] cursor-pointer" />
                <div class="text-[15px] font-[600] text-[#fff] leading-[15px]" style="font-family: Inter;">Last update at 12:15 AM</div>
            </div>
        </div> -->
        <div class="!pt-[40px]">
            <!-- <v-tabs
            v-model="state.currentTab"
            bg-color=""
            color="#CCFA15"
            >
                <v-tab :value="item.value" v-for="item in state.tabList" style="font-size: 20px">{{ item.title }}</v-tab>
            </v-tabs> -->
            <Segmented :options="state.menuList" @change="e=>state.currentTab = e" :value="state.currentTab" />
            <v-window v-model="state.currentTab">
                <v-window-item value="1">
                    <div class="w-full !pb-[30px] border border-solid !border-[rgba(255,255,255,.5)] rounded-[20px] !mt-[20px] sm:h-[800px] h-[500px] overflow-y-auto">
                        <div class="flex items-center !px-[40px] !py-[20px]">
                            <div class="lg:flex-[0.3] sm:flex-[0.5] flex-1 text-left text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">Rank</div>
                            <div class="flex-1 sm:!text-left text-center text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">Address</div>
                            <div class="flex-1 text-right text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">USDC</div>
                        </div>
                        <div class="flex items-center !py-[20px] !px-[40px]" :style="filterStyle(index)" v-for="(item, index) in state.dataList" :key="index">
                            <div class="lg:flex-[0.3] sm:flex-[0.5] flex-1 flex items-center lg:gap-[30px] gap-[10px] text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">
                                <div class="text-[#fff] text-[16px] leading-[22px] text-center w-[20px]" style="letter-spacing: 2px;">{{ index+1 }}</div>
                                <img src="@/assets/img/no1.png" class="w-[18px] h-[18px]" v-show="index+1 == 1" />
                                <img src="@/assets/img/no2.png" class="w-[18px] h-[18px]" v-show="index+1 == 2" />
                                <img src="@/assets/img/no3.png" class="w-[18px] h-[18px]" v-show="index+1 == 3" />
                            </div>
                            <div class="flex-1 sm:!text-left text-center text-[#fff] text-[14px] font-[600] leading-[14px]">{{ width<630?formatAddress(item.address):item.address }}</div>
                            <div class="flex-1 text-right text-[#fff] text-[14px] font-[600] leading-[14px]">{{ item.usdc }}</div>
                        </div>
                    </div>
                </v-window-item>
                <v-window-item value="2">
                    <div class="w-full !pb-[30px] border border-solid !border-[rgba(255,255,255,.5)] rounded-[20px] !mt-[20px] sm:h-[800px] h-[500px] overflow-y-auto">
                        <div class="flex items-center !px-[40px] !py-[20px]">
                            <div class="lg:flex-[0.3] sm:flex-[0.5] flex-1 text-left text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">Rank</div>
                            <div class="flex-1 sm:!text-left text-center text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">Address</div>
                            <div class="flex-1 text-right text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">USDC</div>
                        </div>
                        <div class="flex items-center !py-[20px] !px-[40px]" :style="filterStyle(index)" v-for="(item, index) in state.dataList" :key="index">
                            <div class="lg:flex-[0.3] sm:flex-[0.5] flex-1 flex items-center lg:gap-[30px] gap-[10px] text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">
                                <div class="text-[#fff] text-[16px] leading-[22px] text-center w-[20px]" style="letter-spacing: 2px;">{{ index+1 }}</div>
                                <img src="@/assets/img/no1.png" class="w-[18px] h-[18px]" v-show="index+1 == 1" />
                                <img src="@/assets/img/no2.png" class="w-[18px] h-[18px]" v-show="index+1 == 2" />
                                <img src="@/assets/img/no3.png" class="w-[18px] h-[18px]" v-show="index+1 == 3" />
                            </div>
                            <div class="flex-1 sm:!text-left text-center text-[#fff] text-[14px] font-[600] leading-[14px]">{{ width<630?formatAddress(item.address):item.address }}</div>
                            <div class="flex-1 text-right text-[#fff] text-[14px] font-[600] leading-[14px]">{{ item.usdc }}</div>
                        </div>
                    </div>
                </v-window-item>
                <v-window-item value="3">
                    <div class="w-full !pb-[30px] border border-solid !border-[rgba(255,255,255,.5)] rounded-[20px] !mt-[20px] sm:h-[800px] h-[500px] overflow-y-auto">
                        <div class="flex items-center !px-[40px] !py-[20px]">
                            <div class="lg:flex-[0.3] sm:flex-[0.5] flex-1 text-left text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">Rank</div>
                            <div class="flex-1 sm:!text-left text-center text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">Address</div>
                            <div class="flex-1 text-right text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">USDC</div>
                        </div>
                        <div class="flex items-center !py-[20px] !px-[40px]" :style="filterStyle(index)" v-for="(item, index) in state.dataList" :key="index">
                            <div class="lg:flex-[0.3] sm:flex-[0.5] flex-1 flex items-center lg:gap-[30px] gap-[10px] text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">
                                <div class="text-[#fff] text-[16px] leading-[22px] text-center w-[20px]" style="letter-spacing: 2px;">{{ index+1 }}</div>
                                <img src="@/assets/img/no1.png" class="w-[18px] h-[18px]" v-show="index+1 == 1" />
                                <img src="@/assets/img/no2.png" class="w-[18px] h-[18px]" v-show="index+1 == 2" />
                                <img src="@/assets/img/no3.png" class="w-[18px] h-[18px]" v-show="index+1 == 3" />
                            </div>
                            <div class="flex-1 sm:!text-left text-center text-[#fff] text-[14px] font-[600] leading-[14px]">{{ width<630?formatAddress(item.address):item.address }}</div>
                            <div class="flex-1 text-right text-[#fff] text-[14px] font-[600] leading-[14px]">{{ item.usdc }}</div>
                        </div>
                    </div>
                </v-window-item>
                <v-window-item value="4">
                    <div class="w-full !pb-[30px] border border-solid !border-[rgba(255,255,255,.5)] rounded-[20px] !mt-[20px] sm:h-[800px] h-[500px] overflow-y-auto">
                        <div class="flex items-center !px-[40px] !py-[20px]">
                            <div class="lg:flex-[0.3] sm:flex-[0.5] flex-1 text-left text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">Rank</div>
                            <div class="flex-1 sm:!text-left text-center text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">Address</div>
                            <div class="flex-1 text-right text-[#7A7A7A] text-[16px] font-[600] leading-[16px]">USDC</div>
                        </div>
                        <div class="flex items-center !py-[20px] !px-[40px]" :style="filterStyle(index)" v-for="(item, index) in state.dataList" :key="index">
                            <div class="lg:flex-[0.3] sm:flex-[0.5] flex-1 flex items-center lg:gap-[30px] gap-[10px] text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">
                                <div class="text-[#fff] text-[16px] leading-[22px] text-center w-[20px]" style="letter-spacing: 2px;">{{ index+1 }}</div>
                                <img src="@/assets/img/no1.png" class="w-[18px] h-[18px]" v-show="index+1 == 1" />
                                <img src="@/assets/img/no2.png" class="w-[18px] h-[18px]" v-show="index+1 == 2" />
                                <img src="@/assets/img/no3.png" class="w-[18px] h-[18px]" v-show="index+1 == 3" />
                            </div>
                            <div class="flex-1 sm:!text-left text-center text-[#fff] text-[14px] font-[600] leading-[14px]">{{ width<630?formatAddress(item.address):item.address }}</div>
                            <div class="flex-1 text-right text-[#fff] text-[14px] font-[600] leading-[14px]">{{ item.usdc }}</div>
                        </div>
                    </div>
                </v-window-item>
            </v-window>
        </div>
    </div>
  </div>
</template>


<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #463EAC 0%, #EA8C3B 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-family: darker;
}
</style>