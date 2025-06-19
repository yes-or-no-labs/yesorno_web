<script setup></script>

<template>
  <div>
    <div class="relative !px-[150px] !py-[112px]">
      <img
        src="@/assets/img/home_bg.png"
        class="absolute top-[23px] left-[20%] w-[605px] h-[605px] object-cover"
      />
      <img src="@/assets/img/symbol1.png" class="w-[70px]" />
      <!-- <img src="@/assets/img/symbol2.png" class="w-[98px]" /> -->
      <div
        class="w-full text-center text-[80px] gradient-text relative leading-[90px] !mt-[50px] wow animate__bounce"
      >
        The Al-Native Prediction Market for
        <div class="text-center">Real-Time ith Discovery</div>
      </div>
      <div
        class="text-[#fff] text-[32px] !mt-[25px] relative text-center !mb-[50px] leading-[35px] wow animate__bounceInDown"
        style="font-family: darker"
      >
        Where opinions meet incentives. Bet on the future, shaped by you and Al.<br />
        Explore what the world believesnat they're too afraid to say.
      </div>
      <div class="flex justify-end">
        <img src="@/assets/img/symbol2.png" class="w-[70px]" />
      </div>
      <div class="!mt-[100px] flex justify-center">
        <VBtnConnect
          class="rounded-[106px] !bg-[#1365B2] !text-[24px] !h-[67px] !leading-[24px] !px-[30px]"
        >
          Launch App
        </VBtnConnect>
      </div>
    </div>
    <div class="!mt-[227px] flex items-center gap-[50px] !px-[60px]">
      <img src="@/assets/img/home_bg1.png" class="w-[680px] h-[775px] animate__zoomInLeft wow" />
      <div class="h-full flex flex-col justify-center gap-[95px] animate__zoomInRight wow">
        <div class="text-[58px] text-[#fff] leading-[70px]" style="font-family: aksarabaligalang">
          YesorNo — <br />
          Powered by AI. Driven by<br />
          Truth.
        </div>
        <div class="text-[16px] leading-[32px]" style="font-family: abhayaLibre">
          Explore a world of predictions — from crypto to politics, sports to pop culture — powered
          by collective intelligence, committed to truth, and designed to reward those who dare to
          predict.
        </div>
      </div>
    </div>
    <div class="!mt-[37px] overflow-hidden relative !pt-[100px]">
      <div
        class="h-[589px] w-[589px] rounded-[57px] -rotate-45 absolute top-[-180px] left-[-450px]"
        style="background: rgba(148, 148, 148, 0.31)"
      ></div>
      <div
        class="text-[#fff] text-[64px] text-center animate__fadeIn wow"
        style="font-family: aksarabaligalang"
      >
        Reasoning Enlighten You
      </div>
      <div class="!mt-[48px] text-[16px] text-[#fff] text-center animate__fadeInUp wow">
        Stay updated on breaking news, viral trends, and global conversations without ever leaving
        your chat.<br />
        Whether it’s a crypto price surge, a political shakeup, a game-winning shot, or the next AI
        breakthrough — YesorNo lets you instantly respond with your<br />
        prediction, right from where you’re already talking. No need to open another app or refresh
        a feed. Just tap, think, and vote. <br />Get rewarded for your foresight. Stay ahead of the
        crowd. Predict in the moment — seamlessly.
      </div>
      <img
        src="@/assets/img/home_bg2.png"
        class="w-[775px] h-[775px] mx-auto animate__flipInY wow"
      />
      <div
        class="h-[371px] w-[352px] rounded-[57px] absolute bottom-[-100px] right-[-100px]"
        style="background: rgba(148, 148, 148, 0.31)"
      ></div>
    </div>
    <div class="!my-[150px]">
      <div
        class="text-[#fff] text-[64px] leading-[64px] text-center"
        style="font-family: aksarabaligalang"
      >
        Our Partners
      </div>
      <div
        class="text-[#fff] text-[16px] leading-[32px] text-center"
        style="font-family: aksarabaligalang"
      >
        Al will provide reasoning path for you to make better decisionswith recent news.
      </div>
      <div class="!mt-[200px] flex items-center justify-center gap-[15px]">
        <div
          class="w-[302px] h-[263px]"
          style="background: rgba(255, 255, 255, 0.32)"
          v-for="item in 4"
        ></div>
      </div>
    </div>
    <div class="!mt-[150px]">
      <div
        class="text-[#fff] text-[64px] leading-[64px] text-center"
        style="font-family: aksarabaligalang"
      >
        Roodmap
      </div>
      <div class="!mt-[170px]">
        <div class="flex items-center gap-[30px] !pl-[188px]">
          <div class="">
            <div class="text-[30px] text-[#45AFB6] font-bold" style="font-family: bebas">
              GATEWAY 01
            </div>
            <div class="text-[20px] leading-[40px]" style="font-family: abhayaLibre">
              Gateway 01 · 2025 Q3
            </div>
            <div class="text-[14px] leading-[28px]" style="font-family: abhayaLibre">
              Launch of YesorNo Beta V1 <br />Release of the Telegram Mini App for seamless,
              on-the-go predictions <br />Launch of the User Points System to incentivize engagement
              <br />Formation of a core community to gather feedback and iterate fast
              <br />Publication of the full tokenomics model
            </div>
          </div>
          <div class="">
            <div class="text-[30px] text-[#DB7223] font-bold" style="font-family: bebas">
              GATEWAY 02
            </div>
            <div class="text-[20px] leading-[40px]" style="font-family: abhayaLibre">
              Gateway 02 · 2025 Q4
            </div>
            <div class="text-[14px] leading-[28px]" style="font-family: abhayaLibre">
              Launch of Beta V2 with Orderbook System — enabling real-time <br />
              trading of YES/NO positions <br />Integration of community-suggested features<br />
              Strategic collaborations with media outlets to ensure every hot topic<br />
              reflects public sentiment
            </div>
          </div>
        </div>
        <div class="relative">
          <img src="@/assets/img/home_bg3.png" class="w-full" />
          <div class="absolute right-0 top-[30px]">
            <div class="text-[30px] text-[#9DC425] font-bold" style="font-family: bebas">
              GATEWAY 03
            </div>
            <div class="text-[20px] leading-[40px]" style="font-family: abhayaLibre">
              Gateway 03 · 2026 Q1
            </div>
            <div class="text-[14px] leading-[28px]" style="font-family: abhayaLibre">
              Official Full Release of YesorNo <br />Launch of invitation rewards, team
              competitions, and <br />
              other social features <br />
              Multi-chain deployment begins <br />On-chain revenue redistribution to early and
              active users<br />
              Expansion to global communities with tools for content <br />
              creator monetization
            </div>
          </div>
          <div class="absolute left-[300px] top-[300px]">
            <div class="text-[30px] text-[#2B5164] font-bold text-right" style="font-family: bebas">
              GATEWAY 04
            </div>
            <div class="text-[20px] leading-[40px] text-right" style="font-family: abhayaLibre">
              Gateway 04 · 2026 Q2
            </div>
            <div class="text-[14px] leading-[28px] text-right" style="font-family: abhayaLibre">
              Brand development kicks off — aiming to become the<br />
              most fun, lightweight social app in Web3 <br />Native mobile App version launch
              <br />Token generation event (TGE) goes live — power to the<br />
              predictors
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #1b2dd1 0%, #ff850c 92%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  font-family: darker;
}
</style>
