import request from "@/utils/request";

/**
 * 添加App闪屏推送
 */
 export function addFlashscreen(data) {
  return request({
    url: "/v1/platform/web/open/marketing/flashscreen/add",
    method: "post",
    data,
  });
}

/**
 * 编辑App闪屏推送
 */
 export function editFlashscreen(data) {
  return request({
    url: "/v1/platform/web/open/marketing/flashscreen/edit",
    method: "post",
    data,
  });
}

/**
 * 设置App闪屏推送
 */
 export function setFlashscreen(data) {
  return request({
    url: "/v1/platform/web/open/marketing/flashscreen/set",
    method: "post",
    data,
  });
}

/**
 * 获取App闪屏推送详情
 * @returns
 */
 export function getFlashscreenDetail(params) {
  return request({
    url: "/v1/platform/web/open/marketing/flashscreen/detail",
    method: "get",
    params
  });
}

/**
 * 获取App闪屏推送列表
 */
 export function getFlashscreenList(data) {
  return request({
    url: "/v1/platform/web/open/marketing/flashscreen/list",
    method: "post",
    data,
  });
}
