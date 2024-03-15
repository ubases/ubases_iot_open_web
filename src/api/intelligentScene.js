import request from "@/utils/request";

/**
 * 场景模板列表
 * @param {*} data 参数
 * @returns
 */
 export function getSceneList(data) {
  return request({
    url: "/v1/platform/web/open/sceneTemplate/list",
    method: "post",
    data,
  });
}

/**
 * 场景模板设置状态
 * @param {*} data 参数
 * @returns
 */
 export function setSceneStatus(data) {
  return request({
    url: "/v1/platform/web/open/sceneTemplate/setStatus",
    method: "post",
    data,
  });
}

/**
 * 查询适应APP列表
 * @param {*} data 参数
 * @returns
 */
 export function getFitAppList() {
  return request({
    url: "/v1/platform/web/open/sceneTemplate/appList",
    method: "get",
  });
}

/**
 * 场景模板详情
 * @returns id
 */
 export function getSceneDetail(id) {
  return request({
    url: "/v1/platform/web/open/sceneTemplate/detail/"+id,
    method: "get",
  });
}

/**
 * 场景模板新增
 * @param {*} data 参数
 * @returns
 */
 export function addScene(data) {
  return request({
    url: "/v1/platform/web/open/sceneTemplate/add",
    method: "post",
    data,
  });
}

/**
 * 场景模板编辑
 * @param {*} data 参数
 * @returns
 */
 export function editScene(data) {
  return request({
    url: "/v1/platform/web/open/sceneTemplate/edit",
    method: "post",
    data,
  });
}

/**
 * 场景模板删除
 * @param {*} id 参数
 * @returns
 */
 export function deleteScene(id) {
  return request({
    url: "/v1/platform/web/open/sceneTemplate/delete/"+id,
    method: "post",
  });
}