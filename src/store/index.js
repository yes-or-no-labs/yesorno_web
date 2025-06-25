import { computed, reactive } from 'vue'
// import { api } from '@/apis'
import * as utilEthereum from '@/utils/kiwi/util_ethereum'
import * as util_base from '@/utils/kiwi/util_base'
import { ethers } from 'ethers'
import { constant } from '@/utils/constant.js'
import * as uniapp from '@/utils/uni-app'
import { blackList } from '../utils/blackList'
import { defineStore } from 'pinia'

export const store = {
  useAppStore: defineStore('appStore', () => {
    const tomeState = reactive({
      token: localStorage.getItem(constant.tokenKey),
      username: localStorage.getItem(constant.usernameKey),
      userInfo: localStorage.getItem(constant.userInfoKey) || null,

      appConfig: localStorage.getItem(constant.appConfigKey) || {},
      walletAccountList: [],
      curWalletAddress: localStorage.getItem(constant.curWalletAddress) || '',
      hasProvider: false,
      isLoading: false,
      signMessage: localStorage.getItem(constant.signMessage) || '',
    })
    const tomeStateC = {
      isLogin: computed(() => !!tomeState.token),
    }
    const mStateSimple = reactive({
      // eip6963 providers
      providers: new Map(),
      // 浏览器提供的小狐狸 provider
      metamaskProvider: null,
      // 用户上次登录的钱包类型
      lastWalletRdns:localStorage.getItem(constant.lastWalletRdnsKey) || '',
      /**
       * Ethers 的 provider
       * @type {ethers.BrowserProvider}
       */
      ethersBrowserProvider: null,
      signer: null,
    })
    const actions = {
      onUpdateToken(val) {
        tomeState.token = val
        localStorage.setItem(constant.tokenKey, val)
        // localStorage.setItem(constant.tokenKey, val)
      },
      onUpdateSignMessage(val) {
        tomeState.signMessage = val
        localStorage.setItem(constant.signMessage, val)
        // localStorage.setItem(constant.tokenKey, val)
      },
      onUpdateUsername(val) {
        tomeState.username = val
        localStorage.setItem(constant.usernameKey, val)
      },
      onUpdateUserInfo(val) {
        tomeState.userInfo = val
        localStorage.setItem(constant.userInfoKey, JSON.stringify(val))
        // localStorage.setItem(constant.userInfoKey, val)
      },
      onUpdateCurPagePath(val) {
        tomeState.curPagePath = val
        localStorage.setItem(constant.tabBarPagePathKey, val)
      },
      onUpdateCurWalletAddress(val) {
        tomeState.curWalletAddress = val
        localStorage.setItem(constant.curWalletAddress, val)
      },
      onUpdateLastWalletRdns(val) {
        tomeState.lastWalletRdns = val
        localStorage.setItem(constant.lastWalletRdnsKey, val)
      },
      onUpdateWalletAccountList(val) {
        tomeState.walletAccountList = val
        // localStorage.setItem(constant.tabBarPagePathKey, val)
      },
      getCurrentRoute() {
        const pages = getCurrentPages()
        // 获取当前页面实例
        const currentPage = pages[pages.length - 1]
        return currentPage && currentPage?.route
      },
      // async getWebConfig() {
      //   const res = await api.webConfigApi()
      //   if (res?.code === 200) {
      //     tomeState.webConfig = res.data
      //   }
      // },
      onLoginOut() {
        tomeState.token = ''
        tomeState.username = ''
        tomeState.userInfo = {}
        localStorage.removeItem(constant.tokenKey)
        localStorage.removeItem(constant.usernameKey)
        localStorage.removeItem(constant.userInfoKey)
        localStorage.removeItem(constant.curWalletAddress)
        localStorage.removeItem(constant.lastWalletRdnsKey)
      },
      // 链接钱包
      async evmConnectWallet(recovery = false, walletRdns = 'io.metamask') {
        const ret = {
          success: false,
          /**
           * 1 初始状态
           * 40001 未安装指定钱包
           */
          code: 1,
        }

        let metamaskProvider = null

        console.log('evmConnectWallet',walletRdns);
        

        if(!recovery){
          metamaskProvider = this.getMetamaskProvider(walletRdns)
        }else if(recovery&&mStateSimple.lastWalletRdns){
          metamaskProvider = this.getMetamaskProvider(mStateSimple.lastWalletRdns)
        }
        if (!metamaskProvider) {
          ret.code === 40001
          return ret
        }

        const chainId = import.meta.env.VITE_APP_CHAIN
        console.log('chainId?>>>>>>>>', chainId)
        const onConnectMetaMaskRet = await utilEthereum.onConnectMetaMask(
          metamaskProvider,
          chainId,
          recovery,
        )
        console.log(`++++++[${new Date().toISOString()}] 链接钱包结果: `, onConnectMetaMaskRet)
        if (!onConnectMetaMaskRet.success) {
          return onConnectMetaMaskRet
        }
        tomeState.walletAccountList = onConnectMetaMaskRet.data.accounts

        this.onUpdateCurWalletAddress(tomeState.walletAccountList[0])
        this.onUpdateLastWalletRdns(walletRdns)
        mStateSimple.metamaskProvider = metamaskProvider
        console.log('metamaskProvider>>>>>>>', metamaskProvider)
        tomeState.hasProvider = true
        console.log('getSign', tomeState.token, tomeState.signMessage, tomeState.userInfo)
        const provider = new ethers.BrowserProvider(metamaskProvider)
        // 等待 provider 初始化完成
        // await provider.ready
        //
        // await util_base.sleep(1000)
        // await provider._waitUntilReady() // 确保 provider 已经准备就绪
        // comStoreSimple.ethersBrowserProvider = new ethers.BrowserProvider(comStoreSimple.metamaskProvider)
        // await provider.ready;
        mStateSimple.ethersBrowserProvider = provider
        // console.log('mStateSimple.ethersBrowserProvider',mStateSimple.ethersBrowserProvider);
        // comStoreShallow.ethersBrowserProvider = provider
        // mStateSimple.signer = await provider.getSigner();
        // const signatrue = await mStateSimple.signer.signMessage("asdasdsadasd");
        // console.log('signatrue',signatrue);
        // 添加链改变监听
        this.setupMetaMaskListeners(metamaskProvider)
        // 添加账号改变监听
        ret.success = true
        ret.code = 0

        return ret
      },
      getMetamaskProvider(walletRdns) {
        // walletRdns = 'io.metamask'
        /**
         * rdns
         * io.metamask
         * com.okex.wallet
         */
        for (let providerObj of mStateSimple.providers.values()) {
          if (providerObj.info.rdns.toLowerCase().includes(walletRdns)) {
            console.log(
              `++++++[${new Date().toISOString()}] 从 eip 6963 集合中找到了 metamask 提供者，当前 rdns： ${walletRdns}`,
              providerObj.provider
            )
            return providerObj.provider
          }
        }
        // @ts-ignore
        // if (window?.ethereum?.isTronLink === true) {
        //   return null
        // }
        // if (window?.ethereum?.isMetaMask) {
        //   return window.ethereum
        // }
        return null
      },
      async getSign() {
        try {
          const res = await api.getSign({ address: tomeState.curWalletAddress })
          console.log('getSign', res)
          if (res.code == 0) {
            this.onUpdateToken(res.result)
            await this.getSignatrue()
          } else {
            tomeState.isLoading = false
          }
        } catch (error) {
          tomeState.isLoading = false
        }
      },
      async getSignatrue() {
        // await appStore.mStateSimple.ethersBrowserProvider.ready();
        try {
          const provider = new ethers.BrowserProvider(mStateSimple.metamaskProvider)

          const signer = await provider.getSigner()

          const signatrue = await signer.signMessage(tomeState.token)
          console.log('signatrue', signatrue)
          this.onUpdateSignMessage(signatrue)
          await this.getUserInfo()
          tomeState.isLoading = false
        } catch (error) {
          tomeState.isLoading = false
        }
      },
      async getUserInfo() {
        const res = await api.getUser()
        // console.log('getUserInfo',res);
        if (res.code == 0) {
          this.onUpdateUserInfo(res.result)
          const path = this.getCurrentRoute()
          // console.log('getUserInfo',path);
          if (res.result.topAddress && path !== 'pages/home/index') {
            // uniapp.route({
            //   url: `/pages/home/index`,
            //   type: 'redirectTo',
            // })
          }
        }
      },

      chainIdToHex(networkId) {
        return `0x${Number(networkId).toString(16)}`
      },
      async getConfig() {
        const res = await api.getConfig()
        // console.log('getUserInfo',res);
        if (res.code == 0) {
          tomeState.webConfig = res.result
        }
      },
      // eip6963
      onAnnounceProvider(event) {
        const announcedProvider = {
          ...event.detail,
          accounts: [],
        }
        mStateSimple.providers.set(announcedProvider.info.uuid, announcedProvider)
        console.log(
          `++++++[${new Date().toISOString()}] 设置 eip6963 provider，当前 rdns： ${announcedProvider.info.rdns}`,
        )
      },
      initErc20Contract(tokenAddress, abi) {
        const provider = new ethers.BrowserProvider(mStateSimple.metamaskProvider)
        // 创建代币合约实例
        return new ethers.Contract(tokenAddress, abi, provider)
      },
      async initErc20ContractSign(tokenAddress, abi) {
        const provider = new ethers.BrowserProvider(mStateSimple.metamaskProvider)
        const signer = await provider.getSigner()
        // console.log('initErc20ContractSign',provider.getSigner());
        // 创建代币合约实例
        return new ethers.Contract(tokenAddress, abi, signer)
      },
      formatUnits(value, decimal = 18) {
        if (!value) return '0'
        // 处理科学计数法
        if (typeof value === 'number') {
          value = BigInt(value).toString()
        }
        return ethers.formatUnits(value, decimal)
      },
      parseUnits(value, decimal = 18) {
        if (!value) return '0'

        // 处理科学计数法
        if (typeof value === 'number') {
          value = BigInt(value).toString()
        }
        return ethers.parseUnits(value, decimal)
      },
      // 添加监听
      addEip6963AnnounceListen() {
        window.addEventListener('eip6963:announceProvider', this.onAnnounceProvider)
      },
      // 移除监听，一般
      removeEip6963AnnounceListen() {
        window.removeEventListener('eip6963:announceProvider', this.onAnnounceProvider)
      },
      // 触发获取 eip6963 providers
      requestEip6963Providers() {
        window.dispatchEvent(new Event('eip6963:requestProvider'))
      },
      // 链改变处理
      handleChainChanged(chainId) {
        if (chainId != import.meta.env.VITE_APP_CHAIN) {
          this.onDisConnectClick()
        }
      },
      // 账号改变处理
      handleAccountsChanged(accounts) {
        console.log('handleAccountsChanged', accounts)
        tomeState.walletAccountList = []
        tomeState.curWalletAddress = ''
        tomeState.signMessage = ''
        tomeState.tokenKey = ''
        tomeState.userInfo = null
        sessionStorage.removeItem(constant.signMessage)
        sessionStorage.removeItem(constant.tokenKey)
        sessionStorage.removeItem(constant.userInfoKey)
        location.reload()
      },
      // 链接成功设置监听
      setupMetaMaskListeners(provider) {
        if (provider) {
          utilEthereum.onAddChainChangedListener(provider, this.handleChainChanged)
          utilEthereum.onAddWalletListener(provider, this.handleAccountsChanged)
          console.log(`++++++[${new Date().toISOString()}] 添加监听 evm 的链和账号改变监听`)
        }
      },
      // 移除设置的监听
      removeMetaMaskListeners(provider) {
        if (provider) {
          utilEthereum.onRemoveChainChangedListener(provider, this.handleChainChanged)
          utilEthereum.onRemoveWalletListener(provider, this.handleAccountsChanged)
          console.log(`++++++[${new Date().toISOString()}] 移除监听 evm 的链和账号改变监听`)
        }
      },
      // 断开钱包链接
      async onDisConnectClick() {
          console.log('onDisConnectClick',mStateSimple.metamaskProvider);
        try {
          if (mStateSimple.metamaskProvider) {
            this.removeMetaMaskListeners(mStateSimple.metamaskProvider)
            await utilEthereum.onDisConnect(mStateSimple.metamaskProvider)
            mStateSimple.metamaskProvider = null
            mStateSimple.ethersBrowserProvider = null
            mStateSimple.lastWalletRdns = ''
            tomeState.walletAccountList = []
            tomeState.curWalletAddress = ''
            this.onLoginOut()
            console.log(`++++++[${new Date().toISOString()}] 断开链接成功`)
          }
        } catch (error) {
          console.error(`++++++[${new Date().toISOString()}] 断开链接错误`, error)
        }
      },
    }

    return {
      tomeState,
      tomeStateC,
      mStateSimple,
      ...actions,
    }
  }),
}
