import createRequest from "@/utils/request/request"

export const baseHttp = createRequest({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: false,
    // header: {
    //   'content-type': '"application/json;charset=utf-8"',
    // },
  })
export const formDataHttp = createRequest({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: false,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },

  })

  export const formDataHttpForPerformance = createRequest({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: false,
    timeout: 120000,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },

  })

export const api = {
  login: (data) => baseHttp({url:"/v1/login/login",method: 'POST', data}),
  logout: () => baseHttp({url:"/v1/login/logout",method: 'POST'}),
  refreshToken: () => baseHttp({url:"/v1/login/refresh_token",method: 'POST'}),
  getUserInfo: () => baseHttp({url:"/v1/users/info",method: 'GET',}),
  getMarketData: (params) => baseHttp({url:"/v1/guess/list",method: 'GET',params}),
  getMarketInfo: (params) => baseHttp({url:"/v1/guess/detail",method: 'GET',params}),
  getPriceByAmount: (params) => baseHttp({url:"/v1/price_line/get_price_by_amount",method: 'GET',params}),
  getAmountByCost: (params) => baseHttp({url:"/v1/price_line/get_amount_by_cost",method: 'GET',params}),
  getUserBetRecord: (params) => baseHttp({url:"/v1/user_bet_record/list",method: 'GET',params}),
}