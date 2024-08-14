// 产品管理
import request from "@/utils/request";


/**
 * 获取APP地区
 * @param {*} params 查询参数
 * @returns
 */
export function getAppRegionList(params = {}) {
  return request({
    url: "/v1/platform/web/common/regionList",
    method: "get",
    params,
  });
}

/**
 * 获取APP调试列表
 * @param {*} data 查询参数
 * @returns
 */
 export function getAppDebuggerList(data) {
  return request({
    url: "/v1/platform/web/app/appDebugger/list",
    method: "post",
    data,
  });
}

/**
 * 删除APP调试
 * @returns
 */
 export function deleteAppDebugger(id) {
  return request({
    url: `/v1/platform/web/app/appDebugger/delete/${id}`,
    method: "post"
  });
}

/**
 * 添加APP调试
 * @param {*} data 产品参数
 * @returns
 */
 export function createAppDebugger(data) {
  return request({
    url: "/v1/platform/web/app/appDebugger/add",
    method: "post",
    data,
  });
}

/**
 * 编辑产品
 * @param {*} data 产品参数
 * @returns
 */
 export function editAppDebugger(data) {
  return request({
    url: "/v1/platform/web/app/appDebugger/edit",
    method: "post",
    data,
  });
}