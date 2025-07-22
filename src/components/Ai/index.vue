<script setup>
import { onMounted, reactive } from 'vue'
import Segmented from '../Segmented/index.vue'

const state = reactive({
  currentTab: 1,
  menuList: [
    { label: '10M', value: 1 },
    { label: '30M', value: 2 },
    { label: '4H', value: 3 },
    { label: '1D', value: 4 },
  ],
})

onMounted(() => {
  // testEndpoint()
  // connectWebSocket()
})

let ws = null
let messageCount = 0
let connectionAttempts = 0
let reconnectAttempts = 0
let maxReconnectAttempts = 5
let reconnectDelay = 1000
let isManualDisconnect = false

const WS_URL = 'wss://iavertwlopfihqyampsa.supabase.co/functions/v1/websocket-proxy'
const TEST_URL = 'https://iavertwlopfihqyampsa.supabase.co/functions/v1/websocket-proxy/test'

async function testEndpoint() {
  try {
    console.log('Testing health endpoint...')
    const response = await fetch(TEST_URL)
    const data = await response.json()
    console.log(`Health test response: ${JSON.stringify(data, null, 2)}`)
  } catch (error) {
    console.log(`Health test error: ${error.message}`)
  }
}

function connectWebSocket(isReconnect = false) {
  if (ws && ws.readyState === WebSocket.CONNECTING) {
    console.log('Connection already in progress...')
    return
  }

  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log('Already connected')
    return
  }

  try {
    connectionAttempts++

    if (!isReconnect) {
      reconnectAttempts = 0
      isManualDisconnect = false
    }

    console.log(`Attempting to connect to: ${WS_URL} (attempt ${isReconnect ? reconnectAttempts + 1 : 1})`)

    ws = new WebSocket(WS_URL)

    ws.onopen = function (event) {
      console.log('✅ WebSocket connection opened successfully!')
      reconnectAttempts = 0
      reconnectDelay = 1000 // Reset delay
    }

    ws.onmessage = function (event) {
      messageCount++

      try {
        const message = JSON.parse(event.data)

        // Handle different message types with better formatting
        switch (message.type) {
          case 'data':
            console.log(
              `📈 Price Data - ${message.symbol}: $${message.data.price} (${message.data.priceChangePercent.toFixed(2)}%)`,
            )
            break
          case 'connected':
            console.log(`🟢 Connected: ${message.message || 'Connection established'}`)
            break
          case 'disconnected':
            console.log(`🔴 Disconnected: ${message.message || 'Connection closed'}`)
            break
          case 'error':
            console.log(`❌ Error: ${message.message}`)
            break
          case 'ping':
            console.log('🏓 Received ping from server')
            // Automatically respond to ping
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }))
            }
            break
          case 'pong':
            console.log('🏓 Received pong from server')
            break
          default:
            console.log(`📨 Message: ${JSON.stringify(message, null, 2)}`)
        }
      } catch (error) {
        console.log(`📨 Raw message: ${event.data}`)
      }
    }

    ws.onclose = function (event) {
      console.log(
        `🔴 WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason || 'No reason provided'}`,
      )

      // Attempt reconnection if not manually disconnected
      if (!isManualDisconnect && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++
        const delay = Math.min(reconnectDelay * Math.pow(2, reconnectAttempts - 1), 30000)
        console.log(
          `🔄 Attempting to reconnect in ${delay}ms (${reconnectAttempts}/${maxReconnectAttempts})`,
        )

        setTimeout(() => {
          if (!isManualDisconnect) {
            connectWebSocket(true)
          }
        }, delay)
      } else if (reconnectAttempts >= maxReconnectAttempts) {
        console.log('❌ Max reconnection attempts reached')
      }

      ws = null
    }

    ws.onerror = function (error) {
      console.log(`❌ WebSocket error: ${error}`)
    }
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`)
  }
}

function disconnectWebSocket() {
  isManualDisconnect = true
  reconnectAttempts = maxReconnectAttempts // Prevent reconnection

  if (ws) {
    console.log('Manually disconnecting WebSocket...')
    ws.close(1000, 'Manual disconnect')
  }
}

function subscribe() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const symbol = document.getElementById('symbolInput').value.trim().toUpperCase()
    if (symbol) {
      const message = {
        type: 'subscribe',
        symbol: symbol,
        timestamp: Date.now(),
      }
      ws.send(JSON.stringify(message))
      console.log(`📤 Sent subscribe message: ${JSON.stringify(message)}`)
    } else {
      console.log('❌ Please enter a valid symbol')
    }
  } else {
    console.log('❌ WebSocket not connected')
  }
}

function unsubscribe() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const message = {
      type: 'unsubscribe',
      timestamp: Date.now(),
    }
    ws.send(JSON.stringify(message))
    console.log(`📤 Sent unsubscribe message: ${JSON.stringify(message)}`)
  } else {
    console.log('❌ WebSocket not connected')
  }
}

function sendPing() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const message = {
      type: 'ping',
      timestamp: Date.now(),
    }
    ws.send(JSON.stringify(message))
    console.log(`📤 Sent ping message: ${JSON.stringify(message)}`)
  } else {
    console.log('❌ WebSocket not connected')
  }
}
</script>

<template>
  <div class="w-full h-auto">
<!--    <div class="flex justify-between items-center w-full">-->
<!--      <div class="flex items-center gap-[10px] flex-1 h-[48px]">-->
<!--        <div-->
<!--          class="bg-[#6DDD2526] w-[48px] h-[48px] rounded-[4px] flex items-center justify-center"-->
<!--        >-->
<!--          <img src="@/assets/img/bot.png" class="w-[24px] h-[24px]" />-->
<!--        </div>-->
<!--        <div class="flex flex-col">-->
<!--          <div class="text-[#6DDD25] text-[16px] font-[600]">AI Enhanced Prediction-BTC</div>-->
<!--          <div class="text-[14px] text-[#666]">Predict cryptocurrency prices!</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <Segmented-->
<!--        :options="state.menuList"-->
<!--        @change="(e) => (state.currentTab = e)"-->
<!--        :value="state.currentTab"-->
<!--      />-->
<!--    </div>-->
    <!-- <div class="flex items-center gap-[20px]">
      <div
        class="flex-1 border border-solid !border-[#FFFFFF80] rounded-[4px] !px-[10px] !py-[20px] flex flex-col gap-[10px]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px]">
            <div
              class="bg-[#0AB45A26] flex items-center justify-center rounded-[4px] w-[48px] h-[48px]"
            >
              <img src="@/assets/img/ai_icon1.png" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px] font-[600]">Contract Price</div>
              <div class="text-[#666] text-[14px]">Contract</div>
            </div>
          </div>
          <div
            class="!px-[8px] !p-[4px] rounded-full bg-[#666] text-[#fff] text-[14px] leading-[14px]"
          >
            OKX
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-[#fff] text-[24px] font-[600]">$119,804.30</div>
          <div class="text-[#666] text-[14px]">Update: 11:09:03</div>
        </div>
      </div>
      <div
        class="flex-1 border border-solid !border-[#FFFFFF80] rounded-[4px] !px-[10px] !py-[20px] flex flex-col gap-[10px]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px]">
            <div
              class="bg-[#0AB45A26] flex items-center justify-center rounded-[4px] w-[48px] h-[48px]"
            >
              <img src="@/assets/img/ai_icon2.png" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px] font-[600]">Contract Price</div>
              <div class="text-[#666] text-[14px]">Contract</div>
            </div>
          </div>
          <div
            class="!px-[8px] !p-[4px] rounded-full bg-[#666] text-[#fff] text-[14px] leading-[14px]"
          >
            OKX
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-[#fff] text-[24px] font-[600]">$119,804.30</div>
          <div class="text-[#666] text-[14px]">Update: 11:09:03</div>
        </div>
      </div>
      <div
        class="flex-1 border border-solid !border-[#FFFFFF80] rounded-[4px] !px-[10px] !py-[20px] flex flex-col gap-[10px]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-[5px]">
            <div
              class="bg-[#0AB45A26] flex items-center justify-center rounded-[4px] w-[48px] h-[48px]"
            >
              <img src="@/assets/img/ai_icon3.png" class="w-[24px] h-[24px]" />
            </div>
            <div class="flex flex-col">
              <div class="text-[#fff] text-[14px] font-[600]">Contract Price</div>
              <div class="text-[#666] text-[14px]">Contract</div>
            </div>
          </div>
          <div
            class="!px-[8px] !p-[4px] rounded-full bg-[#666] text-[#fff] text-[14px] leading-[14px]"
          >
            OKX
          </div>
        </div>
        <div class="flex flex-col">
          <div class="text-[#fff] text-[24px] font-[600]">$119,804.30</div>
          <div class="text-[#666] text-[14px]">Update: 11:09:03</div>
        </div>
      </div>
    </div> -->
    <div class="flex items-center gap-[20px]">
      <div
        class="flex-[0.7] bg-[#000] border border-solid !border-[#FFFFFF80] rounded-[4px] !p-[10px] flex gap-[10px]"
      >
        <div>
          <div class="w-[160px] h-[160px] rounded-full border-[2px] border-solid border-[#0AB45A]">
            <div class="w-full h-full rounded-full border-[4px] border-solid border-[#000]">
              <div
                class="w-full h-full rounded-full"
                style="border: 2px solid rgba(10, 180, 90, 0.5)"
              >
                <div
                  class="w-full h-full rounded-full bg-[#535353] !p-[2px] flex items-center justify-center relative overflow-hidden"
                >
                  <div class="flex flex-col items-center relative z-10">
                    <div class="text-[36px] font-[600] text-[#12121A] leading-[35px]">100%</div>
                    <div class="text-[14px] text-[#666]">Confidence</div>
                  </div>
                  <div class="wave wave1 bg-[#0ab4598a]" style="filter: blur(1px); top: 10%"></div>
                  <div class="wave wave2 bg-[#0AB45A]" style="filter: blur(2px); top: 20%"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="!mt-[5px] flex flex-col gap-[5px] items-center">
            <div class="text-[14px] text-[#666]">Current Price</div>
            <div class="text-[24px] text-[#fff]">$123123</div>
            <div class="text-[14px] text-[#fff]">Target price:123123</div>
          </div>
        </div>
        <div class="flex flex-col gap-[10px] flex-1">
          <div class="grid grid-cols-2 gap-x-[5px] gap-y-[15px]">
            <div
              class="!px-[10px] h-[52px] rounded-[6px] border border-solid !border-[#FFFFFF80] flex items-center justify-between"
              v-for="item in 6"
            >
              <div class="text-[12px] text-[#fff]">RSI14 Overbought (65.9)</div>
              <div class="!px-[10px] !py-[5px] text-[#fff] text-[14px] bg-[#666] rounded-full">
                22%
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-[10px]">
              <div
                class="!px-[10px] !py-[5px] border border-solid !border-[#0AB45A] text-[#0AB45A] text-[12px] flex items-center rounded-full gap-[5px]"
              >
                <img src="@/assets/img/ai_icon4.png" class="w-[14px] h-[14px]" />
                Bullish
              </div>
              <div class="text-[#fff] text-[14px]">
                Risk level: <span class="text-[#E72F2F]">High risk</span>
              </div>
            </div>
            <VBtnConnect> Save prediction </VBtnConnect>
          </div>
        </div>
      </div>
      <div
        class="flex-[0.3] bg-[#000] border border-solid !border-[#FFFFFF80] rounded-[4px] !p-[10px] h-[275px]"
      >
        <div class="flex items-center gap-[5px]">
          <img src="@/assets/img/ai_icon5.png" class="w-[16px] h-[16px]" />
          <div class="text-[14px] text-[#6DDD25] font-[600]">Prediction record</div>
        </div>
        <div class="w-full flex items-center !mt-[10px]">
          <div class="flex-1 text-[12px] text-[#666]">Type</div>
          <div class="flex-1 text-[12px] text-[#666]">Time</div>
          <div class="flex-1 text-[12px] flex items-center">
            <div class="flex-1 text-[12px] text-[#666]">Confidence</div>
            <div class="flex-1 text-[12px] text-[#666] text-right">Result</div>
          </div>
        </div>
        <div class="h-[200px] overflow-y-auto">
          <div
            class="!py-[15px] !px-[5px] flex items-center border-b border-solid !border-[#FFFFFF80]"
            v-for="item in 10"
          >
            <div class="flex-1 text-[12px] flex items-center justify-between !pr-[5px]">
              <div class="text-[12px] text-[#fff]">BTC</div>
              <div
                class="!px-[10px] !py-[5px] border border-solid !border-[#0AB45A] text-[#0AB45A] text-[12px] flex items-center rounded-full gap-[5px]"
              >
                <img src="@/assets/img/ai_icon4.png" class="w-[14px] h-[14px]" />
                Bullish
              </div>
            </div>
            <div class="flex-1 text-[12px] text-[#fff] flex items-center">2025/7/14 14:48:39</div>
            <div class="flex-1 text-[12px] flex items-center">
              <div class="flex-1 text-[12px] text-[#fff] text-center">60%</div>
              <div class="flex-1 text-[12px] text-[##0AB45A] text-right">Correct</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  top: 50%;
  left: -50%;
  transform-origin: 50% 50%;
  animation: wave 5s cubic-bezier(0.4, 0.2, 0.2, 1) infinite;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.wave1 {
  border-radius: 45%;
  animation-duration: 5s;
}

.wave2 {
  border-radius: 40%;
  animation-duration: 7s;
}
</style>
