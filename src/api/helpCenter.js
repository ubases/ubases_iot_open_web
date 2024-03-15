import request from "@/utils/request";

/**
 * 帮助文档获取接口
 * @returns
 */
export function getAppDocList(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/appDoc",
    method: "get",
    params
  });
}

/**
 * 获取应用app
 * @returns
 */
 export function getAppList(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/appDoc/getApp",
    method: "get",
    params
  });
}

/**
 * 获取公版语种
 * @returns
 */
 export function getPubLangs(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/appDoc/getPubLangs",
    method: "get",
    params
  });
}

/**
 * 创建文档接口
 */
 export function addAppDoc(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/appDoc",
    method: "post",
    data,
  });
}

/**
 * 文档详细接口
 * @returns
 */
 export function appDocDetail(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/appDoc/detail",
    method: "get",
    params
  });
}

/**
 * 修改文档接口
 * @returns
 */
export function editAppDoc(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/appDoc/update",
    method: "post",
    data
  });
}

/**
 * 获取文档支持语种
 * @returns
 */
 export function getSupportLangs(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/appDoc/getSupportLangs",
    method: "get",
    params
  });
}


/**
 * 获取文档目录列表
 * @returns
 */
 export function getDirectoryList(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/directory",
    method: "get",
    params
  });
}

/**
 * 创建文档目录
 */
 export function addDirectory(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/directory",
    method: "post",
    data,
  });
}

/**
 * 文档目录详细
 * @returns
 */
 export function getDirectoryDetail(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/directory/detail",
    method: "get",
    params
  });
}


/**
 * 修改文档目录
 * @returns
 */
 export function editDirectory(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/directory/update",
    method: "post",
    data
  });
}

/**
 * 删除文档目录
 */
 export function deleteDirectory(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/directory/delete",
    method: "post",
    params,
  });
}

/**
 * 词条列表
 * @returns
 */
 export function getEntryList(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/entry/list",
    method: "post",
    data
  });
}


/**
 * 词条保存
 */
 export function updateEntry(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/entry",
    method: "post",
    data,
  });
}

/**
 * 词条设置详细
 * @returns
 */
 export function getEntrySeting(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/entry/seting",
    method: "get",
    params
  });
}


/**
 * 词条设置保存
 * @returns
 */
 export function setingEntry(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/entry/seting",
    method: "post",
    data
  });
}

/**
 * 词条详细
 * @returns
 */
 export function getEntryDetail(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/entry/detail",
    method: "get",
    params
  });
}

/**
 * 词条删除
 * @returns
 */
 export function deleteEntry(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/doc/entry/delete",
    method: "post",
    params
  });
}

/**
 * 公版文档目录列表
 * @returns
 */
 export function getPublishDirectory(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/public/doc/directory",
    method: "get",
    params
  });
}

/**
 * 公版文档目录详细
 * @returns
 */
 export function getPublishDirectoryDetail(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/public/doc/directory/detail",
    method: "get",
    params
  });
}

/**
 * 公版词条列表
 * @returns
 */
 export function getPublishEntryList(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/public/doc/entry/list",
    method: "post",
    data
  });
}

/**
 * 公版词条详细
 * @returns
 */
 export function getPublishEntryDetail(params) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/public/doc/entry/detail",
    method: "get",
    params
  });
}

/**
 * 获取帮助中心列表
 * @returns
 */
 export function getPublishDocList(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/public/helpCenter/list",
    method: "post",
    data
  });
}

/**
 * 删除文档接口
 * @returns
 */
 export function deletePublishDoc(data) {
  return request({
    url: "/v1/platform/web/open/oem/marketing/appDoc/del",
    method: "post",
    data
  });
}