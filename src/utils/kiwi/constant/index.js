// https://github.com/wevm/viem/blob/main/src/chains/index.ts
import { polygon, bsc, avalanche, fantom, coreDao,bscTestnet, monadTestnet  } from 'viem/chains'
// import BSC from './56'

export const networks = {
  // [BSC.id]: Object.assign(
  //   {
  //     label: 'BNB Smart Chain',
  //   },
  //   BSC,
  // ),

  // [bsc.id]: bsc,
  // [bscTestnet.id]:bscTestnet,
  // [polygon.id]: polygon,
  // [avalanche.id]: avalanche,
  // [fantom.id]: fantom,
  // [coreDao.id]: coreDao,
  [monadTestnet.id]: monadTestnet,
}

export const DEVICE_TYPES = {
  UNKNOWN: 'unknown',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
}
