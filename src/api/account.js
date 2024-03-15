import request from "@/utils/request";

/**
 * 获取基本信息
 * @param
 * @returns {*基本用户信息*}
 */
export function getBaseInfo() {
  return request({
    url: "/v1/platform/web/open/baseinfo",
    method: "get",
  });
}

/**
 * 更新基本信息
 */
export function updateBaseInfo(data) {
  return request({
    url: "/v1/platform/web/open/baseinfo",
    method: "post",
    data,
  });
}

/**
 * 修改重置密码
 */
export function updateUserPwd(data) {
  return request({
    url: "/v1/platform/web/open/user/updatePwd",
    method: "post",
    data,
  });
}

/**
 * 忘记密码
 */
 export function forgetPassword(data) {
  return request({
    url: "/v1/platform/web/open/forgetPassword",
    method: "post",
    data,
  });
}

/**
 * 企业认证信息获取
 * @param
 * @returns {*企业认证信息*}
 */
export function getCompanyCertification() {
  return request({
    url: "/v1/platform/web/open/company/auth",
    method: "get",
  });
}

/**
 * 更新基本信息
 */
export function updateCompanyCertification(data) {
  return request({
    url: "/v1/platform/web/open/company/auth",
    method: "post",
    data,
  });
}

/**
 * 获取企业信息
 * @param
 * @returns {*获取企业信息*}
 */
export function getCompanyInfo() {
  return request({
    url: "/v1/platform/web/open/getCompanyInfo",
    method: "get",
  });
}

/**
 * 企业联系人新增
 */
export function addCompanyContacts(data) {
  return request({
    url: "/v1/platform/web/open/company/connect",
    method: "post",
    data,
  });
}

/**
 * 企业联系人修改
 */
export function changeCompanyContacts(data) {
  return request({
    url: "/v1/platform/web/open/company/connect/update",
    method: "post",
    data,
  });
}

/**
 * 企业联系人删除
 * @param {*} data 参数
 * @returns
 */
export function deleteCompanyContacts(data) {
  return request({
    url: "/v1/platform/web/open/company/connect/delete?id="+data,
    method: "post",
  });
}

/**
 * 企业名称变更
 */
export function companyChangename(data) {
  return request({
    url: "/v1/platform/web/open/company/changeName",
    method: "post",
    data,
  });
}

