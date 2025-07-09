<script setup>
import { reactive } from 'vue'

const state = reactive({
  commentVal: '',
  sending: false,
  replyInfo: null,
  sortType:1 //1为最新，2为最受欢迎
})
</script>

<template>
  <div class="!mt-[40px] bg-[#000] !p-[16px] rounded-[20px]">
    <div class="flex items-center justify-between">
      <div
        class="py-[6px] !px-[16px] border-b-[2px] border-solid border-[#0AB45A] text-[14px] text-[#0AB45A]"
        style="font-family: din"
      >
        Comments(1)
      </div>
      <v-menu location="bottom" offset="10">
        <template v-slot:activator="{ props }">
          <div
            class="py-[6px] px-[16px] text-[14px] flex items-center gap-[5px] cursor-pointer text-[#0AB45A] font-bold"
            v-bind="props"
          >
            <img src="@/assets/img/switch.png" class="w-[16px] h-[16px]" />
            
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
      </v-menu>
    </div>
    <div class="flex flex-col gap-[16px] !pt-[12px]">
      <div class="flex overflow-y-auto max-h-[550px] w-full">
        <div class="flex flex-col gap-[16px] w-full">
          <div class="flex gap-[12px]">
            <img src="@/assets/img/person.png" class="w-[32px] h-[32px] rounded-full" />
            <div class="flex flex-col gap-[3px] text-[14px] leading-[20px] flex-1">
              <div class="flex items-center justify-between text-[#94969C] flex-1">
                <div class="underline">e</div>
                <div class="text-[13px]">2timeday</div>
              </div>
              <div
                class="w-full text-[#94969C] overflow-hidden whitespace-break-spaces text-ellipsis leading-[18px]"
              >
                ggg
              </div>
              <div class="flex items-center gap-[16px]">
                <div class="flex items-center gap-[4px] cursor-pointer">
                  <v-icon icon="mdi-heart-outline" size="16"></v-icon>
                  <div>0</div>
                </div>
                <div class="text-[12px] text-[#CECFD2] underline cursor-pointer">Reply</div>
              </div>
              <!-- reply -->
              <div class="flex gap-[12px] !mt-[13px]">
                <img src="@/assets/img/person.png" class="w-[32px] h-[32px] rounded-full" />
                <div class="flex flex-col gap-[3px] text-[14px] leading-[20px] flex-1">
                  <div class="flex items-center justify-between text-[#94969C] flex-1">
                    <div class="underline">e</div>
                    <div class="text-[13px]">2timeday</div>
                  </div>
                  <div
                    class="w-full text-[#94969C] overflow-hidden whitespace-break-spaces text-ellipsis leading-[18px]"
                  >
                    ggg
                  </div>
                  <div class="flex items-center gap-[16px]">
                    <div class="flex items-center gap-[4px] cursor-pointer">
                      <v-icon icon="mdi-heart-outline" size="16"></v-icon>
                      <div>0</div>
                    </div>
                    <div class="text-[12px] text-[#CECFD2] underline cursor-pointer">Reply</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            color="rgba(255,255,255,.5)"
            rounded="10"
            :loading="state.sending"
          >
            <template #prepend-inner>
              <div
                class="!px-[10px] text-[#0AB45A] font-bold"
                style="font-family: din"
                v-show="state.replyInfo"
              >
                @{{ state.replyInfo?.name }}
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
