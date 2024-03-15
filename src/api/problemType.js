import request from "@/utils/request";

/**
 * 添加反馈问题类型
 */
 export function addProblemType(data) {
  return request({
    url: "/v1/platform/web/open/oem/feedback/problemType/add",
    method: "post",
    data,
  });
}

/**
 * 编辑反馈问题类型
 */
 export function editProblemType(data) {
  return request({
    url: "/v1/platform/web/open/oem/feedback/problemType/edit",
    method: "post",
    data,
  });
}

/**
 * 获取反馈问题类型列表
 */
 export function getProblemTypeList(data) {
  return request({
    url: "/v1/platform/web/open/oem/feedback/problemType/list",
    method: "post",
    data,
  });
}

/**
 * 获取反馈问题类型详情
 */
 export function getProblemTypeDetail(id) {
  return request({
    url: "/v1/platform/web/open/oem/feedback/problemType/detail/" + id,
    method: "get",
  });
}

/**
 * 删除反馈问题类型
 */
 export function deleteProblemType(id) {
  return request({
    url: "/v1/platform/web/open/oem/feedback/problemType/del/" + id,
    method: "post",
  });
}