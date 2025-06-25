<script setup></script>

<template>
  <div
    class="w-full !mt-[20px] h-[180px] bg-[#1B1B1B] rounded-[25px] !py-[35px] flex flex-col justify-center items-center gap-[27px]"
  >
    <div class="flex items-center gap-[72px]">
      <div
        class="w-[62px] h-[62px] rounded-full bg-[#767676] flex justify-center items-center cursor-pointer"
        v-ripple
      >
        <img src="@/assets/img/icon1.png" class="w-full h-full" />
      </div>
      <div
        class="w-[62px] h-[62px] rounded-full bg-[#767676] flex justify-center items-center cursor-pointer"
        v-ripple
      >
        <img src="@/assets/img/icon2.png" class="w-full h-full" />
      </div>
    </div>
    <div class="text-[14px] text-[#837575]">© 2025 Yesorno. All rights reserved.</div>
  </div>
</template>
