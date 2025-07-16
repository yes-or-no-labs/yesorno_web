<script setup>
import { store } from '@/store'
import { computed, reactive, ref } from 'vue'
import personImg from '@/assets/img/person.png'
import { api } from '@/apis'
import createRequest from '../../utils/request/request'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const appStore = store.useAppStore()

const userInfo = computed(() => appStore.tomeState.userInfo)

const curWalletAddress = computed(() => appStore.tomeState.curWalletAddress)

const state = reactive({
    userName: userInfo.value?.nickname ? userInfo.value?.nickname : `User_${curWalletAddress.value?.slice(-6)}`,
    des: userInfo.value?.description || '',
    btnLoading:false,
    avatarUrl:'',
    uploadLinkObj:null,
    selectedFile:null,
    uploading:false
})

const fileInput = ref(null);

const toast = useToast();

async function handleClickBtn() {
    try {
        state.btnLoading = true
        const res = await api.updateUserInfo({
            avatarUrl:state.avatarUrl,
            description:state.des,
            nickname:state.userName,
            xLink:''
        })
        if(res.success){
            appStore.getUserInfo()
        }
    } catch (error) {
        console.error(error);
    }finally{
        state.btnLoading = false
    }
}



async function uploadImg(file) {
    try {
        const res = await api.upload({
            fileName: generateTimestampWithRandom()+'.'+file.type.split('/')[1],
            uploadType:file.type
        })
        // console.log('uploadImg',res);
        if(res.success){
            state.uploadLinkObj = res.obj
        }
    } catch (error) {
        console.error(error);
        
    }
}

function generateTimestampWithRandom() {
  // 获取当前时间戳（毫秒）
  const timestamp = Date.now();
  
  // 生成4位随机数（1000-9999）
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  // 拼接结果
  return `${timestamp}${randomNum}`;
}

const readFileData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // 读取为ArrayBuffer (纯二进制)
    reader.readAsArrayBuffer(file);
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

const handleFileChange = async (event) => {
  try {
    // console.log('handleFileChange',event.target.files,state.selectedFile);
    if(state.selectedFile.type.split('/')[0]!== 'image'){
      toast.error(`Only image files can be uploaded.`);
      return
    }
    state.uploading = true
    // state.selectedFile.name = generateTimestampWithRandom()+'.'+state.selectedFile.type.split('/')[1]
    await uploadImg(state.selectedFile)
    const file = await readFileData(state.selectedFile)
    const res = await axios.put(state.uploadLinkObj.uploadUrl, file, {
        headers: {
            'Content-Type': state.selectedFile.type,
            'x-amz-acl': 'public-read'  // S3特定头
        },
    })
    console.log('handleFileChange   res',res);
    if(res.status===200){
      const imgObj = await api.getFileinfo({
        fileKey: state.uploadLinkObj?.fileKey
      })
      state.avatarUrl = imgObj.obj.publicUrl
    }
  } catch (error) {
    console.error(error);
  }finally{
    state.uploading = false
  }
};

const triggerFileInput = () => {
  fileInput.value.$el.querySelector('input').click();
};
</script>

<template>
  <div class="!pt-[100px] !px-[10px] 2xl:!px-0" style="height: calc(100vh - 60px);">
    <div class="w-full border border-solid !border-[#FFFFFF80] rounded-[6px] !p-[20px] lg:!p-[32px]">
      <div class="flex items-center gap-[24px]">
        <div class="relative cursor-pointer w-[64px] h-[64px]" @click="triggerFileInput">
            <img :src="state.avatarUrl" class="w-[64px] h-[64px] rounded-full object-cover" v-if="state.avatarUrl" />
            <img :src="userInfo?.avatarUrl" class="w-[64px] h-[64px] rounded-full object-cover" v-else-if="userInfo?.avatarUrl"/>
            <img :src="personImg" class="w-[64px] h-[64px] rounded-full object-cover" v-else />
            <img
                src="@/assets/img/editHeaderImg.png"
                class="w-[20px] h-[20px] rounded-full absolute bottom-0 right-0"
            />
            <div class="hidden">
                <v-file-input
                ref="fileInput"
                accept="image/*"
                class=" hidden"
                @change="handleFileChange"
                v-model="state.selectedFile"
            ></v-file-input>
            </div>
            <div class=" absolute left-0 top-0 bg-[#0000009a] z-10 w-full h-full flex items-center justify-center rounded-[6px]" v-show="state.uploading">
              <v-progress-circular
                color="#0AB45A"
                indeterminate
              ></v-progress-circular>
            </div>
        </div>
        <div class="text-[20px] lg:text-[24px] text-[#fff]">
          {{ userInfo?.nickname ? userInfo?.nickname : `User_${curWalletAddress?.slice(-6)}` }}
        </div>
      </div>
      <div class="!mt-[16px] text-[14px] text-[#94969C]">User Name</div>
      <div class="!mt-[6px]">
        <v-text-field
        density="compact"
        variant="outlined"
        hide-details
        class="w-full h-[40px]"
        bg-color="transparent"
        placeholder=""
        v-model="state.userName"
        clearable
        color="#0AB45A"
        maxlength="15"
        >
        </v-text-field>
      </div>
      <div class="!mt-[16px] text-[14px] text-[#94969C]">Description</div>
      <div class="!mt-[6px] !pb-[30px]">
        <v-textarea
        density="compact"
        variant="outlined"
        hide-details
        class="w-full h-[40px]"
        bg-color="transparent"
        placeholder=""
        v-model="state.des"
        color="#0AB45A"
        counter
        rows="2"
        auto-grow
        maxlength="40"
        >
        </v-textarea>
      </div>
      <div class=" text-[16px] text-[#94969C]">40 characters left</div>
      <div class="!mt-[10px] text-right">
        <VBtnConnect :loading="state.btnLoading" class="rounded-[106px] !px-[20px] !py-[12px] flex-1 lg:w-auto !text-[12px] lg:!text-[14px]" @click="handleClickBtn"> Confirm </VBtnConnect>
      </div>
    </div>
  </div>
</template>
