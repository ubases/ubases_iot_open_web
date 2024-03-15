import request from "@/utils/request";

/**
 * 我的产品列表（翻译列表）
 */
export function productLangList(params) {
  return request({
    url: "/v1/platform/web/open/product/langList",
    method: "get",
    params,
  });
}

/**
 * 提交语言翻译（产品、配网通用）
 * @param sourceTable
 * @param sourceRowId
 * @returns 
 */
export function saveTranslation(data) {
  return request({
    url: "/v1/platform/web/lang/translation/customSave",
    method: "post",
    data,
  });
}

/**
 * 获取语言翻译（产品、配网通用）会有默认 数据返回。
 * @param sourceTable
 * @param sourceRowId
 * @returns 
 */
export function getTranslation(params) {
  return request({
    url: "/v1/platform/web/lang/translation/getV2",
    method: "get",
    params
  });
}

/**
 * 查询标准功能/自定义功能（翻译列表）
 */
export function langFuncList(params) {
  return request({
    url: "/v1/platform/web/open/product/langFuncList",
    method: "get",
    params
  });
}

/**
 * 查询配网引导详情（翻译列表）
 */
export function getNetworkGuideLang(params) {
  return request({
    url: "/v1/platform/web/open/product/getNetworkGuideLang",
    method: "get",
    params
  });
}


/**
 * 多语言资源上传
 * @param appKey 
 * @param file
 * @returns
 */
export function uploadLang(data) {
  return request({
    url: "/v1/platform/open/lang/customResources/import",
    method: "post",
    data
  });
}

/**
 * 资源翻译列表 - 通用版
 */
 export function getCustomResourceList(params) {
  return request({
    url: "/v1/platform/open/lang/customResources/list",
    method: "get",
    params
  });
}

/**
 * 资源翻译详情 - 通用版
 */
 export function getCustomResourceDetail(params) {
  return request({
    url: "/v1/platform/open/lang/customResources/get",
    method: "get",
    params
  });
}

/**
 * 翻译保存提交 - 通用版
 */
 export function saveCustomResource(data) {
  return request({
    url: "/v1/platform/open/lang/customResources/save",
    method: "post",
    data
  });
}