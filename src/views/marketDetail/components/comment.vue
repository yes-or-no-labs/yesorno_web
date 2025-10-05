<script setup>
import { api } from '@/apis';
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import personImg from '@/assets/img/person.png'
import dayjs from 'dayjs'
import { formatRelativeTime } from '@/utils';
import { store } from '@/store';

const state = reactive({
  commentVal: '',
  sending: false,
  replyInfo: null,
  sortType:1, //1为最新，2为最受欢迎
  commentList:[],
  eventId:'',
  pageSize: 10,
  pageNum: 1,
  commentTotal:0
})

// dayjs.extend(relativeTime, {
//   thresholds: [
//     { l: 's', r: 44, d: 'Just now' },  // 44秒内显示"Just now"
//     { l: 'm', r: 1 },                  // 45秒-1分钟显示"a minute ago"
//     { l: 'mm', r: 59, d: 'minutes' },  // 2-59分钟显示"X minutes ago"
//     { l: 'h', r: 1 },                  // 60分钟-1小时显示"an hour ago"
//     { l: 'hh', r: 23, d: 'hours' },    // 2-23小时显示"X hours ago"
//     { l: 'd', r: 1 },                  // 24小时-1天显示"a day ago"
//     { l: 'dd', r: 29, d: 'days' },     // 2-29天显示"X days ago"
//     { l: 'M', r: 1 },                  // 30天-1个月显示"a month ago"
//     { l: 'MM', r: 11, d: 'months' },   // 2-11个月显示"X months ago"
//     { l: 'y', r: 1 },                  // 12个月-1年显示"a year ago"
//     { l: 'yy', d: 'years' }            // 1年以上显示"X years ago"
//   ]
// })

const route = useRoute()
const appStore = store.useAppStore()
// const toast = useToast()
const toast = useToast();
const curWalletAddress = computed(() => appStore.tomeState.curWalletAddress)
onMounted(async () => {
  state.eventId = route.query.eventId
  // await getCommentList()
  // getPriceLine()
  // getOrderList()
})



async function getCommentList($state) {
  try {
    const res = await api.getCommentList({
      pageSize: state.pageSize,
      pageNum: state.pageNum,
      eventId: state.eventId
    })
    console.log('getCommentList', res)
    if (res&&res.success) {
      for (const item of res.obj.list) {
        if(!item.commentUserInfo.nickname){
          item.commentUserInfo.nickname = `User_${item.commentUserInfo.userAddress?.slice(-6)}`
        }
        for (const item1 of item?.subComments) {
          if(!item1.toCommentUserInfo.nickname){
            item1.toCommentUserInfo.nickname = `User_${item1.toCommentUserInfo.userAddress?.slice(-6)}`
          }
        }
        item.subCommentsIndex = 3
        item.subCommentsCopy = item.subComments.splice(0, item.subCommentsIndex)
      }
      state.commentList = state.commentList.concat(res.obj.list)
      state.commentTotal = res.obj.total
      if (Array.isArray(res.obj.list) && res.obj?.list.length < state.pageSize) {
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

async function handleClickCreateComment() {
  try {
    state.sending = true
    console.log('handleClickCreateComment',state.replyInfo);
    
    const res = await api.createComment({
      content: state.commentVal,
      eventId: state.eventId,
      parentCommentId:state.replyInfo?state.replyInfo.parentCommentId?state.replyInfo.parentCommentId:state.replyInfo.guid:null,
      toUserAddress:state.replyInfo?state.replyInfo.userAddress:null
    })
    if(res.success){
      toast.success('Comment successfully')
      // console.log('state.replyInfo',state.replyInfo);
      
      if(state.replyInfo){
        if(state.replyInfo.subCommentsCopy){
          state.replyInfo.subCommentsCopy.unshift(res.obj.comment)
        } else if(!state.replyInfo.parentCommentId && !state.replyInfo.subCommentsCopy){
          state.replyInfo.subCommentsCopy = []
          state.replyInfo.subCommentsCopy.unshift(res.obj.comment)
        }else{
          for (const item of state.commentList) {
            console.log('item',item);
            if(item.guid === state.replyInfo.parentCommentId){
              item.subCommentsCopy.unshift(res.obj.comment)
            }
          }
        }
      }else{
        state.commentList.unshift(res.obj.comment)
      }
      state.replyInfo = null
      state.commentVal = ''
    }else{
      toast.error('Comment failed, please try again later.')
    }
  } catch (error) {
    console.error(error)
  }finally{
    state.sending = false
  }
}

function handleClickExpand(item) {
  const arr = item.subComments.splice(0, item.subCommentsIndex)
  item.subCommentsCopy = item.subCommentsCopy.concat(arr)
}
</script>

<template>
  <div class="!mt-[40px] bg-[#1B1B1B] !p-[16px] rounded-[20px]">
    <div class="flex items-center justify-between">
      <div
        class="py-[6px] !px-[16px] border-b-[2px] border-solid border-[#0AB45A] text-[14px] text-[#0AB45A]"
        style="font-family: din"
      >
        Comments({{ state.commentTotal }})
      </div>
      <!-- <v-menu location="bottom" offset="10">
        <template v-slot:activator="{ props }">
          <div
            class="py-[6px] px-[16px] text-[14px] flex items-center gap-[5px] cursor-pointer text-[#0AB45A] font-bold"
            v-bind="props"
          >
            <v-icon icon="mdi-swap-vertical" color="#0AB45A" size="16"></v-icon>
            {{ state.sortType == 1?'New to Old':'Most Liked' }}
          </div>
        </template>
        <v-list style="padding: 0;">
          <v-list-item style="padding: 6px;width: 150px;">
              <div class="text-[#fff] text-[14px] flex items-center justify-between cursor-pointer hover:bg-[#26272B] !p-[10px]" @click="state.sortType = 1">
                New to Old
                <v-icon icon="mdi-check" color="#0AB45A" size="20" v-show="state.sortType == 1"></v-icon>
              </div>
          </v-list-item>
          <v-list-item style="padding: 6px;">
            <div class="text-[#fff] text-[14px] flex items-center justify-between cursor-pointer hover:bg-[#26272B] !p-[10px]" @click="state.sortType = 2">
                Most Liked
                <v-icon icon="mdi-check" color="#0AB45A" size="20" v-show="state.sortType == 2"></v-icon>
              </div>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </div>
    <div class="flex flex-col gap-[16px] !pt-[20px]">
      <div class="overflow-y-auto min-h-[150px] max-h-[350px] w-full commentEl">
        <div class="flex flex-col gap-[16px] w-full">
          <div class="flex gap-[12px]" v-for="item in state.commentList" :key="item.guid">
            <img :src="item.commentUserInfo?.avatarUrl||personImg" class="w-[32px] h-[32px] rounded-full" />
            <div class="flex flex-col gap-[3px] text-[14px] leading-[20px] flex-1">
              <div class="flex items-center justify-between text-[#94969C] flex-1">
                <div class="underline cursor-pointer" @click="$router.push(item.commentUserInfo.userAddress == curWalletAddress?'/profile':`/userProfile?address=${item.commentUserInfo.userAddress}`)">{{item.commentUserInfo?.nickname}}</div>
                <div class="text-[13px]">{{ formatRelativeTime(dayjs(item.created)) }}</div>
              </div>
              <div
                class="w-full text-[#94969C] overflow-hidden whitespace-break-spaces text-ellipsis leading-[18px]"
              >
                {{ item.content }}
              </div>
              <div class="flex items-center gap-[16px]">
                <!-- <div class="flex items-center gap-[4px] cursor-pointer">
                  <v-icon icon="mdi-heart-outline" size="16"></v-icon>
                  <div>0</div>
                </div> -->
                <div class="text-[12px] text-[#CECFD2] underline cursor-pointer" @click="state.replyInfo = item">Reply</div>
              </div>
              <!-- reply -->
              <div class="flex gap-[12px] !mt-[13px]" v-for="reply in item.subCommentsCopy" :key="reply.guid">
                <img :src="reply.commentUserInfo?.avatarUrl||personImg" class="w-[32px] h-[32px] rounded-full" />
                <div class="flex flex-col gap-[3px] text-[14px] leading-[20px] flex-1">
                  <div class="flex items-center justify-between text-[#94969C] flex-1">
                    <div class="underline cursor-pointer" @click="$router.push(reply.commentUserInfo.userAddress == curWalletAddress?'/profile':`/userProfile?address=${reply.commentUserInfo.userAddress}`)">{{ reply.commentUserInfo?.nickname }}</div>
                    <div class="text-[13px]">{{ formatRelativeTime(dayjs(reply.created)) }}</div>
                  </div>
                  <div class="flex gap-[10px]">
                    <div
                      class="text-[#0AB45A] cursor-pointer underline"
                      @click="$router.push(reply.commentUserInfo.userAddress == curWalletAddress?'/profile':`/userProfile?address=${reply.toCommentUserInfo.userAddress}`)"
                    >
                      @{{ reply.toCommentUserInfo.nickname }}
                    </div>
                    <div
                      class="flex-1 text-[#94969C] overflow-hidden whitespace-break-spaces text-ellipsis leading-[18px]"
                    >
                      {{ reply.content }}
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-[16px]">
                    <!-- <div class="flex items-center gap-[4px] cursor-pointer">
                      <v-icon icon="mdi-heart-outline" size="16"></v-icon>
                      <div>0</div>
                    </div> -->
                    <div class="text-[12px] text-[#CECFD2] underline cursor-pointer" @click="state.replyInfo = reply">Reply</div>
                  </div>
                </div>
              </div>
              <div class="text-[12px] text-[#0AB45A] underline cursor-pointer !pl-[44px]" @click="handleClickExpand(item)" v-show="item.subComments.length>0">Expand more</div>
            </div>
          </div>
        </div>
        <infinite-loading @infinite="getCommentList" target="commentEl">
              <template #spinner>
                <div class="text-center !mt-[20px]">Loading...</div>
              </template>
              <template #complete>
                <div class="text-center !mt-[50px]" v-if="state.commentList.length==0">No comments yet</div>
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
      <div class="flex gap-[12px] items-center !mt-[8px] h-[44px]">
        <div class="flex-1">
          <v-text-field
            density="compact"
            variant="outlined"
            label="Add a comment"
            v-model:model-value="state.commentVal"
            :hide-details="true"
            bgColor=""
            hide-spin-buttons
            :min="0"
            :tile="true"
            color="#0AB45A"
            rounded="10"
            :loading="state.sending"
            maxlength="100"
          >
            <template #prepend-inner>
              <div
                class="!px-[10px] text-[#0AB45A] font-bold whitespace-nowrap"
                v-show="state.replyInfo"
              >
                @{{ state.replyInfo?.commentUserInfo?.nickname }}
              </div>
            </template>
            <template #append-inner>
              <div
                class="!px-[10px] cursor-pointer"
                v-show="state.replyInfo"
                @click="state.replyInfo = null"
              >
                <v-icon icon="mdi-close" size="25" color="#0AB45A"></v-icon>
              </div>
            </template>
          </v-text-field>
        </div>
        <v-btn
          density="comfortable"
          icon="mdi-send"
          color="#0AB45A"
          class="!rounded-[10px]"
          :loading="state.sending"
          @click="handleClickCreateComment"
        ></v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// :deep(.v-field__prepend-inner) {
//   padding: 0 !important;
// }

// :deep(.v-field__append-inner) {
//   padding: 0 !important;
// }

// :deep(.v-input--horizontal) {
//   margin: 0 !important;
// }

// :deep(.v-field__input){
//     padding-top: 0;
// }

// :deep(.v-field__field){
//     align-items: center;
// }

// :deep(.v-field-label){
//     top: 'none' !important;
// }

// :deep(.v-text-field__prefix){
//     padding-top: 0;
// }
</style>
