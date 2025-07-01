<script setup>
import { reactive } from 'vue'
import {formatAddress} from '@/utils/uni-app.js'

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
    }]
})

function filterStyle(index) {
    if( index === 0) {
        return 'color:#FFB700'
    } else if (index === 1) {
        return 'color:#A8842A'
    } else if (index === 2) {
        return 'color:#825A33'
    } else {
        return 'color:#fff;width:40px'
    }
}
</script>


<template>
  <div class="w-full bg-[#103582] relative !pb-[100px]">
    <img src="@/assets/img/leaderboard_bg1.png" class="w-full h-[448px] absolute top-0 left-0 object-cover" />
    <div class=" relative !py-[100px] !px-[50px]">
        <div class="gradient-text font-[900] text-[55px]" style="font-family: Inter;">Yesorno Trading Leaderboard</div>
        <div class="!mt-[30px] !pl-[40px] font-[800] text-[22px] leading-[30px]" style="font-family: Inter-Italic;">Exclusive ranking for Yesorno traders. Trade, earn points,<br/>and win unique rewards.</div>
    </div>
    <div class="relative !px-[50px] !mt-[100px]">
        <div class="flex items-center justify-between !pb-[10px]" style="border-bottom: 1px solid rgba(255, 255, 255, .5);">
            <div class="flex items-center relative">
                <div class="text-[40px] font-[800] text-[#FFB702] leading-[40px]" style="font-family: Inter;">Trade now to earn points</div>
                <img src="@/assets/img/leaderboard_bg2.png" class="w-[137px] h-[123px] absolute bottom-[-60%] right-[-30%]" />
            </div>
            <div class="flex items-center gap-[10px]">
                <img src="@/assets/img/refresh.png" class="w-[20px] h-[20px] cursor-pointer" />
                <div class="text-[15px] font-[600] text-[#fff] leading-[15px]" style="font-family: Inter;">Last update at 12:15 AM</div>
            </div>
        </div>
        <div class="!pt-[40px]">
            <v-tabs
            v-model="state.currentTab"
            bg-color=""
            color="#CCFA15"
            >
                <v-tab :value="item.value" v-for="item in state.tabList" style="font-size: 20px">{{ item.title }}</v-tab>
            </v-tabs>
            <v-tabs-window v-model="state.currentTab">
                <v-tabs-window-item value="1">
                    <div class="w-full !py-[30px] bg-[#1B1B1B] rounded-[20px] !mt-[20px] h-[800px] overflow-y-auto">
                        <div class="flex items-center !px-[20px] !pb-[20px]">
                            <div class="flex-1 text-left text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">Ranking</div>
                            <div class="flex-1 text-center text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">Address</div>
                            <div class="flex-1 text-right text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">USDC</div>
                        </div>
                        <div class="flex items-center !p-[20px] even:bg-[#222121]" v-for="(item, index) in state.dataList" :key="index">
                            <div class="flex-1 flex items-center gap-[10px] text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">
                                <img src="@/assets/img/no1.png" class="w-[42px] h-[37px]" v-show="index+1 == 1" />
                                <img src="@/assets/img/no2.png" class="w-[42px] h-[37px]" v-show="index+1 == 2" />
                                <img src="@/assets/img/no3.png" class="w-[42px] h-[37px]" v-show="index+1 == 3" />
                                <div class="text-[#fff] text-[22px] leading-[22px] text-center" :style="filterStyle(index)" >{{ index+1 }}</div>
                            </div>
                            <div class="flex-1 text-center text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">{{ formatAddress(item.address) }}</div>
                            <div class="flex-1 text-right text-[#A7EB96] text-[24px] font-[600] leading-[24px]">{{ item.usdc }}</div>
                        </div>
                    </div>
                </v-tabs-window-item>
                <v-tabs-window-item value="2">
                    <div class="w-full !py-[30px] bg-[#1B1B1B] rounded-[20px] !mt-[20px] h-[800px] overflow-y-auto">
                        <div class="flex items-center !px-[20px] !pb-[20px]">
                            <div class="flex-1 text-left text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">Ranking</div>
                            <div class="flex-1 text-center text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">Address</div>
                            <div class="flex-1 text-right text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">USDC</div>
                        </div>
                        <div class="flex items-center !p-[20px] even:bg-[#222121]" v-for="(item, index) in state.dataList" :key="index">
                            <div class="flex-1 flex items-center gap-[10px] text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">
                                <img src="@/assets/img/no1.png" class="w-[42px] h-[37px]" v-show="index+1 == 1" />
                                <img src="@/assets/img/no2.png" class="w-[42px] h-[37px]" v-show="index+1 == 2" />
                                <img src="@/assets/img/no3.png" class="w-[42px] h-[37px]" v-show="index+1 == 3" />
                                <div class="text-[#fff] text-[22px] leading-[22px] text-center" :style="filterStyle(index)" >{{ index+1 }}</div>
                            </div>
                            <div class="flex-1 text-center text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">{{ formatAddress(item.address) }}</div>
                            <div class="flex-1 text-right text-[#A7EB96] text-[24px] font-[600] leading-[24px]">{{ item.usdc }}</div>
                        </div>
                    </div>
                </v-tabs-window-item>
                <v-tabs-window-item value="3">
                    <div class="w-full !py-[30px] bg-[#1B1B1B] rounded-[20px] !mt-[20px] h-[800px] overflow-y-auto">
                        <div class="flex items-center !px-[20px] !pb-[20px]">
                            <div class="flex-1 text-left text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">Ranking</div>
                            <div class="flex-1 text-center text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">Address</div>
                            <div class="flex-1 text-right text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">USDC</div>
                        </div>
                        <div class="flex items-center !p-[20px] even:bg-[#222121]" v-for="(item, index) in state.dataList" :key="index">
                            <div class="flex-1 flex items-center gap-[10px] text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">
                                <img src="@/assets/img/no1.png" class="w-[42px] h-[37px]" v-show="index+1 == 1" />
                                <img src="@/assets/img/no2.png" class="w-[42px] h-[37px]" v-show="index+1 == 2" />
                                <img src="@/assets/img/no3.png" class="w-[42px] h-[37px]" v-show="index+1 == 3" />
                                <div class="text-[#fff] text-[22px] leading-[22px] text-center" :style="filterStyle(index)" >{{ index+1 }}</div>
                            </div>
                            <div class="flex-1 text-center text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">{{ formatAddress(item.address) }}</div>
                            <div class="flex-1 text-right text-[#A7EB96] text-[24px] font-[600] leading-[24px]">{{ item.usdc }}</div>
                        </div>
                    </div>
                </v-tabs-window-item>
                <v-tabs-window-item value="4">
                    <div class="w-full !py-[30px] bg-[#1B1B1B] rounded-[20px] !mt-[20px] h-[800px] overflow-y-auto">
                        <div class="flex items-center !px-[20px] !pb-[20px]">
                            <div class="flex-1 text-left text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">Ranking</div>
                            <div class="flex-1 text-center text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">Address</div>
                            <div class="flex-1 text-right text-[#A7EB96] text-[24px] font-[600] leading-[24px]">USDC</div>
                        </div>
                        <div class="flex items-center !p-[20px] even:bg-[#222121]" v-for="(item, index) in state.dataList" :key="index">
                            <div class="flex-1 flex items-center gap-[10px] text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">
                                <img src="@/assets/img/no1.png" class="w-[42px] h-[37px]" v-show="index+1 == 1" />
                                <img src="@/assets/img/no2.png" class="w-[42px] h-[37px]" v-show="index+1 == 2" />
                                <img src="@/assets/img/no3.png" class="w-[42px] h-[37px]" v-show="index+1 == 3" />
                                <div class="text-[#fff] text-[22px] leading-[22px] text-center" :style="filterStyle(index)" >{{ index+1 }}</div>
                            </div>
                            <div class="flex-1 text-center text-[#9F9F9F] text-[24px] font-[600] leading-[24px]">{{ formatAddress(item.address) }}</div>
                            <div class="flex-1 text-right text-[#A7EB96] text-[24px] font-[600] leading-[24px]">{{ item.usdc }}</div>
                        </div>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>
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