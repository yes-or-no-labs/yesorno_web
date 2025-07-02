import { createRequest } from "@/utils/request/request"

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
  getSign: (data) => formDataHttp.req({url:"/user/getSign",method: 'POST', data}),
  
}