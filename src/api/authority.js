// 权限管理
import request from "@/utils/request";

/**
 * 授权列表
 * @param {*} params 查询数据
 * @returns
 */
 export function getAuthList(params) {
  return request({
    url: "/v1/platform/web/open/auth/list",
    method: "get",
    params
  });
}

/**
 * 新增授权
 * @param {*} params 查询数据
 * @returns
 */
 export function addAuth(data) {
  return request({
    url: "/v1/platform/web/open/auth/add",
    method: "post",
    data
  });
}

/**
 * 编辑授权
 * @param {*} params 查询数据
 * @returns
 */
 export function editAuth(data) {
  return request({
    url: "/v1/platform/web/open/auth/remark",
    method: "post",
    data
  });
}

/**
 * 删除授权
 * @param {*} params 查询数据
 * @returns
 */
 export function deleteAuth(data) {
  return request({
    url: "/v1/platform/web/open/auth/delete",
    method: "post",
    data
  });
}

/**
 * 角色列表
 * @param {*} params 参数
 * @returns
 */
 export function getRoleList(params) {
  return request({
    url: "/v1/platform/web/open/role/list",
    method: "get",
    params
  });
}

/**
 * 给用户分配角色
 * @param {*} params 参数
 * @returns
 */
 export function saveRole(data) {
  return request({
    url: "/v1/platform/web/open/role/user",
    method: "post",
    data
  });
}

/**
 * 获取角色详情
 * @param {*} params 参数
 * @returns
 */
 export function getRoleDetails(params) {
  return request({
    url: "/v1/platform/web/open/role",
    method: "get",
    params
  });
}


/**
 * 新增自定义角色
 * @param {*} data 参数
 * @returns
 */
export function addRole(data) {
  return request({
    url: "/v1/platform/web/open/role",
    method: "post",
    data,
  });
}

/**
 * 编辑自定义角色
 * @param {*} data 参数
 * @returns
 */
 export function editRole(data) {
  return request({
    url: "/v1/platform/web/open/role/update",
    method: "post",
    data,
  });
}

/**
 * 删除自定义角色
 * @param {*} data 参数
 * @returns
 */
 export function deleteRole(data) {
  return request({
    url: "/v1/platform/web/open/role/delete",
    method: "post",
    data,
  });
}