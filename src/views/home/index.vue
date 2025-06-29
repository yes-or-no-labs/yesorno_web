<script setup></script>

<template>
  <div>
    <img
        src="@/assets/img/home_bg.png"
        class="absolute top-0 left-[50%] translate-x-[-50%] w-full object-cover max-w-[1920px]"
      />
    <div class="relative !px-[150px] !py-[112px] 2xl:h-[1067px]" >
      <div class="text-[68px] text-[#fff] text-center font-bold" style="font-family: Geist;">The Al-Native Prediction Market <br/>
          for Real-Time ith Discovery</div>
      <div class="!mt-[30px] text-center text-[24px]" style="font-family: Geist;">Where opinions meet incentives. Bet on the future, shaped by you and Al.<br/>Explore what the world believesnat they're too afraid to say.</div>
      <div class="!mt-[50px] flex justify-center">
        <VBtnConnect
          class="rounded-[106px] !text-[24px] !h-[67px] !leading-[24px] !px-[60px]"
          style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);"
        >
          Launch App
        </VBtnConnect>
      </div>
    </div>
    <div class="!mt-[100px] rounded-[6px] border border-solid border-[rgba(255,255,255,.5)] relative !pt-[40px]">
      <div class="text-[36px] text-center text-[#fff]" style="font-family: Geist;">Explore a world of predictions</div>
      <div class="text-[24px] text-center text-[#fff] !mt-[30px]" style="font-family: Geist;">from crypto to politics, sports to pop culture — powered by collective intelligence,<br/> committed to truth, and designed to reward those who dare to predict.</div>
      <img
        src="@/assets/img/home_bg2.png"
        class="w-full object-cover h-[200px] !mt-[40px]"
        draggable="false"
      />
    </div>
    <div class="!mt-[200px]">
      <div class="relative !h-[273px] flex items-center justify-center">
        <div class="text-[34px] text-center text-[#fff] font-bold relative z-10" style="font-family: Geist;">Reasoning Enlighten You</div>
        <img src="@/assets/img/home_bg3.png" draggable="false" class="w-[273px] h-[273px] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      </div>
      <div class="!mt-[20px] flex flex-col gap-[40px]">
        <div class="flex items-center gap-[60px]">
          <div class="flex-1 border border-solid border-[rgba(255,255,255,.5)] h-[200px] flex justify-center items-center rounded-[6px]">
              <div class="!pt-[10px]">
                <img src="@/assets/img/home_bg4.png" draggable="false" class="w-[46px] h-[46px] mx-auto">
                <div class="text-[14px] text-[#fff] !mt-[20px] text-center" style="font-family: Geist;">Stay updated on breaking news, viral trends, and global conversations without ever leaving your <br/> chat.</div>
              </div>
          </div>
          <div class="flex-1 border border-solid border-[rgba(255,255,255,.5)] h-[200px] flex justify-center items-center rounded-[6px]">
            <div class="!pt-[10px]">
              <img src="@/assets/img/home_bg5.png" draggable="false" class="w-[46px] h-[46px] mx-auto">
              <div class="text-[14px] text-[#fff] !mt-[20px] text-center" style="font-family: Geist;">Whether it’s a crypto price surge, a political <br/> shakeup, a game-winning shot, or the next AI <br/> breakthrough — YesorNo lets you instantly <br/> respond with your</div>
            </div>
          </div>
          <div class="flex-1 border border-solid border-[rgba(255,255,255,.5)] h-[200px] flex justify-center items-center rounded-[6px]">
            <div class="!pt-[10px]">
              <img src="@/assets/img/home_bg6.png" draggable="false" class="w-[46px] h-[46px] mx-auto">
              <div class="text-[14px] text-[#fff] !mt-[20px] text-center" style="font-family: Geist;">Prediction, right from where you’re already <br/> talking. No need to open another app or refresh a <br/> feed. Just tap, think, and vote.</div>
            </div>
              
          </div>
        </div>
        <div class="w-full h-[240px] !p-[40px] rounded-[6px] flex items-center justify-between gap-[30px]" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
          <div class="!py-[10px] flex flex-col gap-[10px]">
            <div class="text-[#fff] text-[24px] font-[500]" style="font-family: Geist;">Get rewarded for your foresight. </div>
            <div class="text-[#fff] text-[48px] font-bold" style="font-family: Geist;">Stay ahead of the crowd</div>
            <div class="text-[#fff] text-[24px]" style="font-family: Geist;">Predict in the moment — seamlessly. </div>
          </div>
          <view class="flex gap-[10px]">
            <img
              src="@/assets/img/home_bg7.png"
              draggable="false"
              class="w-[382px] object-cover h-[182px]"
            />
            <div class="relative flex items-center w-[62px] h-[62px] justify-center">
                <img
                src="@/assets/img/home_bg8.png"
                class="w-[62px] h-[62px] object-cover  absolute left-0 top-0"
                draggable="false"
                />
                <div class="text-[30px] font-bold text-[#000] relative z-10" style="font-family: Geist;">GO</div>
            </div>
            
          </view>
        </div>
      </div>
    </div>
    <div class="!mt-[200px]">
      <div class="relative !h-[378px] flex items-center justify-center">
        <div class="text-[34px] text-center text-[#fff] font-bold relative z-10" style="font-family: Geist;">Roodmap</div>
        <img src="@/assets/img/home_bg9.png" draggable="false" class="w-[378px] h-[378px] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      </div>
      <div class="relative z-10 flex !mt-[250px]">
          <div class="flex items-center flex-1">
            <div class="border-b-[4px] border-solid border-[#fff] w-full relative">
              <div class=" absolute left-[25%] top-[50%] translate-y-[-50%]">
                <div class="w-[24px] h-[24px] rounded-full bg-[#fff] !p-[3px] relative">
                  <div class="w-full h-full rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);"></div>
                  <div class=" absolute left-[50%] bottom-[-240px] h-[240px] translate-x-[-50%] border-l border-solid border-[#fff] ">
                    <div class="absolute left-[-4px] top-[20px] flex flex-col gap-[16px] w-[256px]">
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Launch of YesorNo Beta V1</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Release of the Telegram Mini App for seamless, on-the-go predictions</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Launch of the User Points System to incentivize engagement</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Formation of a core community to gather feedback and iterate fast</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Publication of the full tokenomics model</div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div class=" absolute left-0 top-[-70px] gradient-text text-[34px] font-bold whitespace-nowrap" style="font-family: Geist;">2025 Q3</div>
              </div>
              <div class=" absolute left-[70%] top-[50%] translate-y-[-50%]">
                <div class="w-[24px] h-[24px] rounded-full bg-[#fff] !p-[3px] relative">
                  <div class="w-full h-full rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);"></div>
                  <div class=" absolute left-[50%] top-[-220px] h-[220px] translate-x-[-50%] border-l border-solid border-[#fff] ">
                    <div class="absolute left-[-4px] bottom-[20px] flex flex-col gap-[16px] w-[256px]">
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] rounded-full !mt-[7px]" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Launch of Beta V2 with Orderbook System — enabling real-time</div> 
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] rounded-full !mt-[7px]" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">trading of YES/NO positions</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] rounded-full !mt-[7px]" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Integration of community-suggested features</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] rounded-full !mt-[7px]" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Strategic collaborations with media outlets to ensure every hot topic reflects public sentiment</div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div class=" absolute left-0 bottom-[-70px] gradient-text text-[34px] font-bold whitespace-nowrap" style="font-family: Geist;">2025 Q4</div>
              </div>
            </div>
            <div class="border-b-[4px] border-dashed border-[#fff] w-full relative">
              <div class=" absolute left-[25%] top-[50%] translate-y-[-50%]">
                <div class="w-[24px] h-[24px] rounded-full bg-[#fff] !p-[3px] relative">
                  <div class="w-full h-full rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);"></div>
                  <div class=" absolute left-[50%] bottom-[-240px] h-[240px] translate-x-[-50%] border-l border-solid border-[#fff] ">
                    <div class="absolute left-[-4px] top-[20px] flex flex-col gap-[16px] w-[256px]">
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Official Full Release of YesorNo</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Launch of invitation rewards, team competitions, and other social features</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Multi-chain deployment begins</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">On-chain revenue redistribution to early and active users</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Expansion to global communities with tools for content creator monetization</div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div class=" absolute left-0 top-[-70px] gradient-text text-[34px] font-bold whitespace-nowrap" style="font-family: Geist;">2025 Q5</div>
              </div>
              <div class=" absolute left-[70%] top-[50%] translate-y-[-50%]">
                <div class="w-[24px] h-[24px] rounded-full bg-[#fff] !p-[3px] relative">
                  <div class="w-full h-full rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);"></div>
                  <div class=" absolute left-[50%] top-[-170px] h-[170px] translate-x-[-50%] border-l border-solid border-[#fff] ">
                    <div class="absolute left-[-4px] bottom-[20px] flex flex-col gap-[16px] w-[256px]">
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Brand development kicks off — aiming to become the most fun, lightweight social app in Web3</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Native mobile App version launch</div>
                      </div>
                      <div class="flex gap-[8px]">
                        <div class="w-[8px] h-[8px] !p-[1px] !mt-[7px] rounded-full" style="background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);">
                          <div class="w-full h-full rounded-full bg-[#000]"></div>
                        </div>
                        <div div class="text-[14px] text-[#fff] flex-1" style="font-family: Geist;">Token generation event (TGE) goes live — power to the predictors</div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div class=" absolute left-0 bottom-[-70px] gradient-text text-[34px] font-bold whitespace-nowrap" style="font-family: Geist;">2025 Q6</div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div class="!mt-[500px]">
      <div class="flex flex-col gap-[30px]">
        <div class="text-[34px] text-center text-[#fff] font-bold" style="font-family: Geist;">Our Partners</div>
        <div class="text-[16px] text-center text-[#fff] font-bold" style="font-family: Geist;">Al will provide reasoning path for you to make better decisionswith recent news.</div>
      </div>
    </div>
    <div class="!mt-[500px] h-[254px]  relative z-10" style="background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);">
      <img
        src="@/assets/img/home_bg10.png"
        class="w-full object-cover h-[254px] absolute left-0 top-0"
        draggable="false"
      />
      <div class="relative z-10 w-full h-full flex items-center" style="background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);">
          <div class="mx-auto w-full">
        <div class="w-full flex items-center justify-between !pb-[30px] border-b border-solid border-[rbga(255,255,255,.3)]">
          <img src="@/assets/img/logo.png" mode="scaleToFill" draggable="false" class="w-[160px] h-[40px]" />
          <div class="flex items-center gap-[20px]">
            <img src="@/assets/img/icon_x.png" class="w-[22px] h-[20px] cursor-pointer" alt="">
            <img src="@/assets/img/icon_tg.png" class="w-[25px] h-[20px] cursor-pointer" alt="">
            <img src="@/assets/img/icon_discord.png" class="w-[27px] h-[20px] cursor-pointer" alt="">
          </div>
        </div>
        <div class="!pt-[30px] text-[14px] text-[#fff]" style="font-family: Geist;">
          <div class=" text-center">copyright: 2024 Copyright 2024 by YES OR NO. All rights reserved</div>
          <div class=" text-center">Privacy Statement - Terms of Use</div>
        </div>
      </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #6DDD25 0%, #0AB45A 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}
</style>
