import { constant } from "@/utils/constant"
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

  export const refreshHttp = createRequest({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: false,
    header: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': localStorage.getItem(constant.refreshTokenKey) || '',
    },
  })

export const api = {
  login: (data) => baseHttp({url:"/v1/login/login",method: 'POST', data}),
  logout: () => baseHttp({url:"/v1/login/logout",method: 'POST'}),
  refreshToken: (data) => refreshHttp({url:"/v1/login/refresh_token",method: 'POST',data}),
  getUserInfo: (params) => baseHttp({url:"/v1/users/info",method: 'GET',params}),
  updateUserInfo: (data) => baseHttp({url:"/v1/users/update",method: 'POST',data}),
  getMarketData: (params) => baseHttp({url:"/v1/guess/list",method: 'GET',params}),
  getMarketInfo: (params) => baseHttp({url:"/v1/guess/detail",method: 'GET',params}),
  getPriceByAmount: (params) => baseHttp({url:"/v1/price_line/get_price_by_amount",method: 'GET',params}),
  getAmountByCost: (params) => baseHttp({url:"/v1/price_line/get_amount_by_cost",method: 'GET',params}),
  getUserBetRecord: (params) => baseHttp({url:"/v1/user_bet_record/list",method: 'GET',params}),
  getPriceLine: (params) => baseHttp({url:"/v1/price_line/list",method: 'GET',params}),
  getOrderList: (params) => baseHttp({url:"/v1/order/list",method: 'GET',params}),
  upload: (data) => baseHttp({url:"/v1/upload/token",method: 'POST',data}),
  getFileinfo: (data) => baseHttp({url:"/v1/upload/file-info",method: 'POST',data}),
  getTaskList: (params) => baseHttp({url:"/v1/tasks/list",method: 'GET',params}),
  claimTask: (data) => baseHttp({url:"/v1/user/task-records/create",method: 'POST',data}),
  getUserTaskList: (params) => baseHttp({url:"/v1/user/task-records/list",method: 'GET',params}),
  follow: (data) => baseHttp({url:"/v1/user/followers/follow",method: 'POST',data}),
  unfollow: (data) => baseHttp({url:"/v1/user/followers/unfollow",method: 'POST',data}),
  getFollowingList: (params) => baseHttp({url:"/v1/user/followers/following",method: 'GET',params}),//我关注的人
  getFollowersList: (params) => baseHttp({url:"/v1/user/followers/followers",method: 'GET',params}),//我的粉丝
  checkFollow: (params) => baseHttp({url:"/v1/user/followers/check_is_follow",method: 'GET',params}),
  createComment: (data) => baseHttp({url:"/v1/event-comments/create",method: 'POST',data}),
  getCommentList: (params) => baseHttp({url:"/v1/event-comments/by-event",method: 'GET',params}),
  getUserinfobyAddress: (params) => baseHttp({url:"/v1/users/infobyaddress",method: 'GET',params}),
  getPointRecord: (params) => baseHttp({url:"/v1/user/point-records/list",method: 'GET',params}),
  getPointRank: (params) => baseHttp({url:"/v1/users/pointRank",method: 'GET',params}),
  getAssetEvents: (params) => baseHttp({url:"/v1/price_prediction/asset_events",method: 'GET',params}),
  getRounds: (params) => baseHttp({url:"/v1/price_prediction/rounds",method: 'GET',params}),
  getPointTaskList: (params) => baseHttp({url:"/v1/ai/points/tasks",method: 'GET',params}),
  getInviteList: (params) => baseHttp({url:"/v1/users/invite/users",method: 'GET',params}),
  claimPointTask: (data) => baseHttp({url:"/v1/ai/points/tasks/claim",method: 'POST',data}),
  createPredictions: (data) => baseHttp({url:"/v1/ai/predictions/create",method: 'POST',data}),
  checkin: (data) => baseHttp({url:"/v1/ai/predictions/checkin",method: 'POST',data}),
  getPointsInfo: (params) => baseHttp({url:"/v1/ai/points/info",method: 'GET',params}),
  getPointsLeaderboard: (params) => baseHttp({url:"/v1/ai/points/leaderboard",method: 'GET',params}),
  getAccessStatsRecord: (data) => baseHttp({url:"/v1/ai/access-stats/record",method: 'POST',data}),
  completeTask: (data) => baseHttp({url:`/v1/ai/points/tasks/complete`,method: 'POST',data}),
}

