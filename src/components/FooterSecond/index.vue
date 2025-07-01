<script setup></script>

<template>
  <div
    class="2xl:h-[254px] xl:h-[234px] lg:h-[200px] sm:h-[180px] h-[160px] relative z-10"
    style="background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)"
  >
    <img
      src="@/assets/img/home_bg10.png"
      class="w-full object-cover 2xl:h-[254px] xl:h-[234px] lg:h-[200px] sm:h-[180px] h-[160px] absolute left-0 top-0"
      draggable="false"
    />
    <div
      class="relative z-10 w-full h-full flex items-center"
      style="background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)"
    >
      <div class="mx-auto w-[80%]">
        <div
          class="w-full flex items-center justify-between lg:!pb-[30px] !pb-[15px] border-b border-solid border-[rbga(255,255,255,.3)]"
        >
          <img
            src="@/assets/img/logo.png"
            mode="scaleToFill"
            draggable="false"
            class="lg:w-[160px] w-[120px]"
          />
          <div class="flex items-center gap-[20px]">
            <img
              src="@/assets/img/icon_x.png"
              class="lg:w-[22px] lg:h-[20px] w-[18px] h-[16px] cursor-pointer"
              alt=""
            />
            <img
              src="@/assets/img/icon_tg.png"
              class="lg:w-[25px] lg:h-[20px] w-[24px] h-[18px] cursor-pointer"
              alt=""
            />
            <img
              src="@/assets/img/icon_discord.png"
              class="lg:w-[27px] lg:h-[20px] w-[23px] h-[16px] cursor-pointer"
              alt=""
            />
          </div>
        </div>
        <div
          class="lg:!pt-[30px] !pt-[15px] lg:text-[14px] text-[12px] text-[#fff]"
          style="font-family: Geist"
        >
          <div class="text-center">
            copyright: 2024 Copyright 2024 by YES OR NO. All rights reserved
          </div>
          <div class="text-center">Privacy Statement - Terms of Use</div>
        </div>
      </div>
    </div>
  </div>
</template>
