import request from "@/utils/request";

// 数据管理

/**
 * APP用户管理
 * @param {*} params 参数
 * @returns
 */
export function getUserList(params) {
  return request({
    url: "/v1/platform/web/open/appUser/userList",
    method: "get",
    params,
  });
}

/**
 * APP用户绑定设备
 * @param {*} params 参数
 * @returns
 */
export function getUserDeviceList(params) {
  return request({
    url: "/v1/platform/web/open/appUser/deviceList",
    method: "get",
    params,
  });
}

/**
 * 数据概览-累计
 * @param {*} params 参数
 * @returns
 */
 export function getOverviewAccumulate(params) {
  return request({
    url: "/v1/platform/web/data/open/overview/accumulate",
    method: "get",
    params,
  });
}

/**
 * 数据概览-今日
 * @param {*} params 参数
 * @returns
 */
 export function getOverviewToday(params) {
  return request({
    url: "/v1/platform/web/data/open/overview/today",
    method: "get",
    params,
  });
}

/**
 * 用户分析
 * @param {*} params 参数
 * @returns
 */
 export function getAppuser(params) {
  return request({
    url: "/v1/platform/web/data/open/overview/appUser",
    method: "get",
    params,
  });
}

/**
 * 激活数据
 * @param {*} params 参数
 * @returns
 */
 export function getDeviceActive(params) {
  return request({
    url: "/v1/platform/web/data/open/overview/deviceActive",
    method: "get",
    params,
  });
}

/**
 * 故障数据
 * @param {*} params 参数
 * @returns
 */
 export function getDeviceFault(params) {
  return request({
    url: "/v1/platform/web/data/open/overview/deviceFault",
    method: "get",
    params,
  });
}