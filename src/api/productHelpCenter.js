import request from "@/utils/request";

/**
 * 产品帮助中心配置列表
 */
 export function getHelpList(data) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/conf/list",
    method: "post",
    data,
  });
}

/**
 * 产品帮助中心配置详情
 * @returns
 */
 export function getHelpDetail(params) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/conf/detail",
    method: "get",
    params
  });
}

/**
 * 更新产品帮助中心配置
 */
 export function updateHelpConfig(data) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/conf/edit",
    method: "post",
    data,
  });
}

/**
 * 启停产品帮助中心配置
 */
 export function enableHelpConfig(data) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/conf/set",
    method: "post",
    data,
  });
}

/**
 * 产品帮助中心文档列表
 */
 export function getHelpDocList(data) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/doc/list",
    method: "post",
    data,
  });
}

/**
 * 产品帮助中心文档详情
 * @returns
 */
 export function getHelpDocDetail(params) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/doc/detail",
    method: "get",
    params
  });
}

/**
 * 删除产品帮助中心文档
 */
 export function deleteHelpDoc(data) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/doc/del",
    method: "post",
    data,
  });
}

/**
 * 添加产品帮助中心文档
 */
 export function addHelpDoc(data) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/doc/add",
    method: "post",
    data,
  });
}

/**
 * 更新产品帮助中心文档
 */
 export function updateHelpDoc(data) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/doc/edit",
    method: "post",
    data,
  });
}


/**
 * 启停产品帮助中心文档
 */
 export function enableHelpDoc(data) {
  return request({
    url: "/v1/platform/web/open/marketing/product/help/doc/set",
    method: "post",
    data,
  });
}