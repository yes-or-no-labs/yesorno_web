import * as constant from './constant'
import * as utilBase from './util_base'

// Validate and convert a hexadecimal chain ID to a decimal number
const convertHexToDecimalSafely = (hex) => {
  const isHex = /^0x[0-9a-f]+$/i.test(hex) || /^[0-9a-f]+$/i.test(hex)
  if (!isHex) {
    throw new Error(`Invalid hex string: ${hex}`)
  }
  return parseInt(hex, 16)
}
const validateChainParams = (chainParams) => {
  // Check if chainId is a valid hexadecimal string
  if (typeof chainParams.chainId !== 'string' || !/^0x[0-9a-fA-F]+$/.test(chainParams.chainId)) {
    console.error('Invalid chainId: must be a hexadecimal string')
    return false
  }

  // Check if chainName is a non-empty string
  if (typeof chainParams.chainName !== 'string' || chainParams.chainName.trim() === '') {
    console.error('Invalid chainName: must be a non-empty string')
    return false
  }

  // Check nativeCurrency object
  const { nativeCurrency } = chainParams
  if (
    !nativeCurrency ||
    typeof nativeCurrency.name !== 'string' ||
    nativeCurrency.name.trim() === '' ||
    typeof nativeCurrency.symbol !== 'string' ||
    nativeCurrency.symbol.trim() === '' ||
    typeof nativeCurrency.decimals !== 'number'
  ) {
    console.error('Invalid nativeCurrency: must include valid name, symbol, and decimals')
    return false
  }

  // Check if rpcUrls is a string array
  if (!Array.isArray(chainParams.rpcUrls) || chainParams.rpcUrls.some((url) => typeof url !== 'string')) {
    console.error('Invalid rpcUrls: must be an array of strings')
    return false
  }

  // Check if blockExplorerUrls is a string array
  if (
    !Array.isArray(chainParams.blockExplorerUrls) ||
    chainParams.blockExplorerUrls.some((url) => typeof url !== 'string')
  ) {
    console.error('Invalid blockExplorerUrls: must be an array of strings')
    return false
  }

  return true
}
// Chain id to hex
export const chainIdToHex = (networkId) => `0x${Number(networkId).toString(16)}`
// Request account
export const onEthRequestAccounts = async (provider) => {
  const result = {
    success: false,
    message: '',
    data: null,
    error: null,
    fun: onEthRequestAccounts.name,
  }
  try {
    const addressArray = await provider.request({
      method: 'eth_requestAccounts',
    })
    result['data'] = addressArray
    result['success'] = true
  } catch (error) {
    console.error(error)
    result['message'] = error.message
    result['error'] = error
  }
  return utilBase.cleanObject(result)
}
// Get account from metamask
export const onEthAccounts = async (provider) => {
  const result = {
    success: false,
    message: '',
    data: null,
    error: null,
    fun: onEthAccounts.name,
  }
  try {
    const addressArray = await provider.request({
      method: 'eth_accounts',
    })
    result['data'] = addressArray
    result['message'] = 'Success'
    result['success'] = true
  } catch (error) {
    console.error(error)
    result['message'] = error.message
    result['error'] = error
  }
  return utilBase.cleanObject(result)
}
// Add wallet listener
export const onAddWalletListener = async (provider, fun) => {
  const result = {
    success: false,
    message: '',
    data: null,
  }
  if (typeof fun === 'function') {
    provider.on('accountsChanged', fun)
    result['success'] = true
  } else {
    result['message'] = 'The callback must be a function'
  }
  return utilBase.cleanObject(result)
}
// Get Current chain id
export const onGetChainId = async (provider, isHex = false) => {
  const result = {
    success: false,
    message: '',
    data: null,
    error: null,
    fun: onGetChainId.name,
  }
  try {
    const chainIdHex = await provider.request({ method: 'eth_chainId' })
    result['success'] = true
    if (isHex) {
      result['data'] = chainIdHex
    } else {
      result['data'] = convertHexToDecimalSafely(chainIdHex)
    }
  } catch (error) {
    console.warn(error)
    result['error'] = error
  }
  return utilBase.cleanObject(result)
}
// Remove wallet listener
export const onRemoveWalletListener = async (provider, fun) => {
  const result = {
    success: false,
    message: '',
    data: null,
  }
  if (typeof fun === 'function') {
    provider.removeListener('accountsChanged', fun)
    result['success'] = true
  } else {
    result['message'] = 'The callback must be a function'
  }
  return result
}
// Add chain change listener
export const onAddChainChangedListener = async (provider, fun) => {
  const result = {
    success: false,
    message: '',
    data: null,
  }
  if (typeof fun === 'function') {
    provider.on('chainChanged', fun)
    result['success'] = true
  } else {
    result['message'] = 'The callback must be a function'
  }
  return utilBase.cleanObject(result)
}
// Remove chain change listener
export const onRemoveChainChangedListener = async (provider, fun) => {
  const result = {
    success: false,
    message: '',
    data: null,
  }
  if (typeof fun === 'function') {
    provider.removeListener('chainChanged', fun)
    result['success'] = true
  } else {
    result['message'] = 'The callback must be a function'
  }
  return result
}
// Request switch to target chain
export const onSwitchToTargetNetwork = async (provider, chainIdNum) => {
  const result = {
    success: false,
    message: '',
    data: null,
    error: null,
  }

  const networkIdHex = chainIdToHex(chainIdNum)
  console.log('networkIdHex>>>>>>>>>>>>>>>>>',networkIdHex);

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: networkIdHex }],
    })
    result.success = true
    return result
  } catch (switchError) {
    console.error(`++++++[${new Date().toISOString()}] 切换网络错误，尝试添加网络`, switchError)
    console.log('网络信息》》》》》》》》》》》》》》》》》》》》》》',constant.networks[chainIdNum]);
    if ((switchError.code === 4902||switchError.code === -32603) && constant.networks[chainIdNum]) {
      try {
        const onAddNetworkRet = await onAddNetworks(provider, chainIdNum)
        if (!onAddNetworkRet.success) {
          return onAddNetworkRet
        }
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkIdHex }],
        })
        result.success = true
        return Promise.resolve(result)
      } catch (addError) {
        console.error(`++++++[${new Date().toISOString()}] 添加网络错误`, addError)
        result['error'] = addError
        result.message = addError.message
        return Promise.resolve(result)
      }
    } else {
      console.error(`++++++[${new Date().toISOString()}] 切换网络错误`, switchError)
      result['error'] = switchError
      result.message = switchError.message
      return Promise.resolve(result)
    }
  }
}
// Request add chain
export const onAddNetworks = async (provider, networkId) => {
  const result = {
    success: false,
    message: '',
    data: null,
    error: null,
    fun: onAddNetworks.name,
  }
  try {
    const networkInfo = constant.networks[networkId]
    const networkIdHex = chainIdToHex(networkId)
    const networkData = {
      chainId: networkIdHex,
      chainName: networkInfo.name,
      nativeCurrency: networkInfo.nativeCurrency,
      rpcUrls: [networkInfo.rpcUrls.default.http[0]],
      blockExplorerUrls: [networkInfo.blockExplorers.default.url],
    }
    if (!validateChainParams(networkData)) {
      throw new Error('Chain configuration object is invalid')
    }
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [networkData],
    })
    result.success = true
    return Promise.resolve(result)
  } catch (error) {
    console.error(error)
    result.error = error
    result.message = error.message
    return Promise.resolve(result)
  }
}
// Request dis connect
export const onDisConnect = async (provider) => {
  const result = {
    success: false,
    message: '',
    data: null,
    error: null,
  }
  try {
    const res = await provider.request({
      method: 'wallet_revokePermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    })
    result['data'] = res
    result['success'] = true
  } catch (error) {
    console.error(error)
    result['message'] = error.message
    result['error'] = error
  }
  return utilBase.cleanObject(result)
}
// Connect metamask
export const onConnectMetaMask = async (provider, chainIdNum, recovery = false) => {
  const result = {
    success: false,
    message: '',
    data: null,
    error: null,
  }

  if (recovery) {
    const onEthAccountsRet = await onEthAccounts()
    if (!onEthAccountsRet?.success) {
      return onEthAccountsRet
    }
    result.success = true
    result.message = 'Success'
    result.data = {
      accounts: onEthAccountsRet.data,
    }
    return result
  } else {
    const onEthRequestAccountsRet = await onEthRequestAccounts(provider)
    if (!onEthRequestAccountsRet?.success) {
      return onEthRequestAccountsRet
    }
    const onGetChainIdRet = await onGetChainId(provider)
    if (!onGetChainIdRet?.success) {
      return onGetChainIdRet
    }
    console.log('onGetChainIdRet.data',onGetChainIdRet.data,chainIdNum);
    
    if (onGetChainIdRet.data !== Number(chainIdNum)) {
      const onSwitchToTargetNetworkRet = await onSwitchToTargetNetwork(provider, chainIdNum)
      if (!onSwitchToTargetNetworkRet.success) {
        return onSwitchToTargetNetworkRet
      }
    }
    result.success = true
    result.message = 'Success'
    result.data = {
      accounts: onEthRequestAccountsRet.data,
    }
    return result
  }
}
