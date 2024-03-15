import request from "@/utils/request";

/**
 * 获取产品规则设置列表
 * @param {*} data 查询参数
 * @returns
 */
export function getRuleSetList(params) {
  return request({
    url: "/v1/platform/web/open/product/ruleSetting/listByProductId",
    method: "get",
    params,
  });
}

/**
 * 获取产品规则设置详情
 * @param {*} id 固件ID
 * @returns
 */
 export function getRuleSetDetail(id) {
  return request({
    url: "/v1/platform/web/open/product/ruleSetting/detail/" + id,
    method: "get",
  });
}

/**
 * 添加产品规则设置
 * @param {*} params 查询参数
 * @returns
 */
 export function addRuleSet(data) {
  return request({
    url: "/v1/platform/web/open/product/ruleSetting/add",
    method: "post",
    data,
  });
}

/**
 * 编辑产品规则设置
 * @param {*} data 参数
 * @returns
 */
 export function editRuleSet(data) {
  return request({
    url: "/v1/platform/web/open/product/ruleSetting/edit",
    method: "post",
    data,
  });
}

/**
 * 删除产品规则设置
 * @param {*} id 参数
 * @returns
 */
 export function deleteRuleSet(id) {
  return request({
    url: "/v1/platform/web/open/product/ruleSetting/delete/"+id,
    method: "post",
  });
}

/**
 * 修改产品规则状态
 * @param {*} data 参数
 * @returns
 */
export function editRuleSetStatus(data) {
  return request({
    url: "/v1/platform/web/open/product/ruleSetting/setStatus",
    method: "post",
    data,
  });
}