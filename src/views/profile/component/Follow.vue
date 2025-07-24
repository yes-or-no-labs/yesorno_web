<script setup>
import { reactive } from 'vue'
import personImg from '@/assets/img/person.png'
import { api } from '@/apis'

const state = reactive({
  currentTab: '1',
  tabList: [
    { title: 'Followers', value: '1',total: 0 },
    { title: 'Following', value: '2', total: 0 },
  ],
  pageSizeForFollowing: 10,
  pageNumForFollowing: 1,
  followingList: [],
  followerList: [],
  pageSizeForFollower: 10,
  pageNumForFollower: 1,
  followerTotal: 0,
  followingTotal: 0,
})

// 查询当前我关注人的列表
async function getFollowingList($state) {
  try {
    const res = await api.getFollowingList({
      pageSize: state.pageSizeForFollowing,
      pageNum: state.pageNumForFollowing,
    })
    console.log('getUserBetRecord', res)
    if (res.success) {
      state.followingList = state.followingList.concat(res.obj.list)
       state.tabList[1].total = res.obj.total
      if (Array.isArray(res.obj.list) && res.obj?.list.length < state.pageSizeForFollowing) {
        $state?.complete()
      } else {
        $state?.loaded()
        state.pageNumForFollowing++
      }
    } else {
      $state?.error()
    }
  } catch (error) {
    console.error(error)
    $state?.error()
  }
}

// 查询我的粉丝列表
async function getFollowersList($state) {
  try {
    const res = await api.getFollowersList({
      pageSize: state.pageSizeForFollower,
      pageNum: state.pageNumForFollower,
    })
    console.log('getUserBetRecord', res)
    if (res.success) {
      state.followerList = state.followerList.concat(res.obj.list)
      state.tabList[0].total = res.obj.total
      if (Array.isArray(res.obj.list) && res.obj?.list.length < state.pageSizeForFollower) {
        $state?.complete()
      } else {
        $state?.loaded()
        state.pageNumForFollower++
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
  <div
    class="w-full lg:w-[386px] min-w-[386px] bg-[#000] border border-solid !border-[#FFFFFF80] rounded-[6px] overflow-hidden"
  >
    <div class="">
      <v-tabs v-model="state.currentTab" fixed-tabs align-tabs="center" color="#0AB45A" height="60">
        <v-tab :value="item.value" v-for="item in state.tabList" style="font-size: 16px">
          <span>{{ item.title }} ({{ item.total }})</span></v-tab
        >
      </v-tabs>
      <v-tabs-window v-model="state.currentTab">
        <v-tabs-window-item value="1">
          <div class="w-full h-[640px] overflow-y-auto !px-[16px] !pb-[16px] followingEl">
            <div
              class="!py-[10px] border-b border-solid border-[#384250] flex items-center gap-[12px] last:!border-0"
              v-for="item in state.followerList"
              :key="item.guid"
            >
              <img :src="personImg" class="w-[32px] h-[32px] rounded-full cursor-pointer" />
              <div class="text-[14px] text-[#94969c] cursor-pointer">123123</div>
            </div>
            <infinite-loading @infinite="getFollowingList" target="followingEl">
              <template #spinner>
                <div class="text-center !mt-[20px]">Loading...</div>
              </template>
              <template #complete>
                <div class="text-center !mt-[50px]" v-if="state.followerList.length==0">No followers yet</div>
                <div class="text-center !mt-[20px]" v-else>No more</div>
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
        <v-tabs-window-item value="2">
          <div class="w-full h-[820px] overflow-y-auto !px-[16px] !pb-[16px] followerEl">
            <div
              class="!py-[10px] border-b border-solid border-[#384250] flex items-center gap-[12px]"
              v-for="item in state.followingList"
              :key="item.guid"
            >
              <img :src="personImg" class="w-[32px] h-[32px] rounded-full cursor-pointer" />
              <div class="text-[14px] text-[#94969c] cursor-pointer">123123</div>
            </div>
            <infinite-loading @infinite="getFollowersList" target="followerEl">
              <template #spinner>
                <div class="text-center !mt-[20px]">Loading...</div>
              </template>
              <template #complete>
                <div class="text-center !mt-[100px]" v-if="state.followingList.length==0">No followering yet</div>
                <div class="text-center !mt-[20px]" v-else>No more</div>
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
  </div>
</template>
