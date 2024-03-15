import request from "@/utils/request";

/**
 * 注册
 * @param data
 * 
 */
 export function register(data) {
  return request({
    url: "/v1/platform/web/open/register",
    method: "post",
    data,
  });
}

/**
 * 登录
 * @param data
 * @returns {*token*}
 */
export function login(data) {
  return request({
    url: "/v1/platform/web/open/login",
    method: "post",
    data,
  });
}

/**
 * 用户信息
 * @param
 * @returns {*用户信息*}
 */
export function getInfo() {
  return request({
    url: "/v1/platform/web/open/user/profile",
    method: "get",
  });
}

/**
 * @param
 * @returns {*用户权限*}
 */
export function getUserRouters() {
  return request({
    url: "/v1/platform/web/open/user/getRouters",
    method: "get",
  });
}

/**
 * 刷新token
 * @param data
 * @returns {*token*}
 */
 export function updateToken(data) {
  return request({
    url: "/v1/platform/web/open/refreshToken",
    method: "post",
    data,
  });
}

/**
 * 退出登录
 * @param data
 * @returns {}
 */
 export function logout() {
  return request({
    url: "/v1/platform/web/open/logout",
    method: "get",
  });
}

/**
 * 获取验证码--不验证用户名
 * @param data
 * @returns {*验证码*}
 */
 export function getVerificationCode(params) {
  return request({
    url: "/v1/platform/web/open/getVerificationCode",
    method: "get",
    params,
  });
}

/**
 * 获取验证码--验证用户名
 * @param data
 * @returns {*验证码*}
 */
 export function getVerificationCodeForExists(params) {
  return request({
    url: "/v1/platform/web/open/getVerificationCodeForExists",
    method: "get",
    params,
  });
}

/**
 * 切换租户空间
 * @param data
 * 
 */
 export function chooseCompany(data) {
  return request({
    url: "/v1/platform/web/open/chooseCompany",
    method: "post",
    data,
  });
}