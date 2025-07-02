// import axios from "axios";
import createRequest from './request'

export const request = createRequest({
  timeout: 30000,
})

export const uniswapRequest = createRequest({
  baseURL: process.env.NEXT_PUBLIC_APP_UNISWAP_API,
  timeout: 600000,
})

export const fetcher = (...args) => {
  return request(...args).then((res) => res)
}

export const uniswapFetcher = (...args) => {
  return uniswapRequest(...args).then((res) => res)
}
