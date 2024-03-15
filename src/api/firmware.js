import request from "@/utils/request";

// 固件管理

/**
 * 固件数据列表
 * @param {*} data 查询参数
 * @returns
 */
export function getFirmwareList(data) {
  return request({
    url: "/v1/platform/web/open/firmware/list",
    method: "post",
    data,
  });
}

/**
 * 固件数据详情
 * @param {*} id 固件ID
 * @returns
 */
 export function getFirmwareDetail(id) {
  return request({
    url: "/v1/platform/web/open/firmware/detail/" + id,
    method: "get",
  });
}

/**
 * 固件数据新增
 * @param {*} params 查询参数
 * @returns
 */
 export function addFirmware(data) {
  return request({
    url: "/v1/platform/web/open/firmware/add",
    method: "post",
    data,
  });
}

/**
 * 固件数据编辑
 * @param {*} data 参数
 * @returns
 */
 export function editFirmware(data) {
  return request({
    url: "/v1/platform/web/open/firmware/edit",
    method: "post",
    data,
  });
}

/**
 * 固件数据删除
 * @param {*} data 参数
 * @returns
 */
 export function deleteFirmware(data) {
  return request({
    url: "/v1/platform/web/open/firmware/delete",
    method: "post",
    data,
  });
}

/**
 * 固件启用/禁用
 * @param {*} data 参数
 * @returns
 */
 export function switchFirmware(data) {
  return request({
    url: "/v1/platform/web/open/firmware/setStatus",
    method: "post",
    data,
  });
}


/**
 * 固件版本数据列表
 * @param {*} data 参数
 * @returns
 */
 export function getFirmwareVersionList(data) {
  return request({
    url: "/v1/platform/web/open/firmwareVersion/list",
    method: "post",
    data,
  });
}

/**
 * 固件版本数据详情
 * @param {*} id 固件版本ID
 * @returns
 */
 export function getFirmwareVersionDetail(id) {
  return request({
    url: "/v1/platform/web/open/firmwareVersion/detail/" + id,
    method: "get",
  });
}

/**
 * 固件版本数据新增
 * @param {*} data 参数
 * @returns
 */
 export function addFirmwareVersion(data) {
  return request({
    url: "/v1/platform/web/open/firmwareVersion/add",
    method: "post",
    data,
  });
}

/**
 * 固件版本数据编辑
 * @param {*} data 参数
 * @returns
 */
 export function editFirmwareVersion(data) {
  return request({
    url: "/v1/platform/web/open/firmwareVersion/edit",
    method: "post",
    data,
  });
}

/**
 * 固件版本数据删除
 * @param {*} data 参数
 * @returns
 */
 export function deleteFirmwareVersion(data) {
  return request({
    url: "/v1/platform/web/open/firmwareVersion/delete",
    method: "post",
    data,
  });
}

/**
 * 固件版本启用/禁用
 * @param {*} data 参数
 * @returns
 */
 export function switchFirmwareVersion(data) {
  return request({
    url: "/v1/platform/web/open/firmwareVersion/setStatus",
    method: "post",
    data,
  });
}

/**
 * 固件版本上架
 * @param {*} data 参数
 * @returns
 */
 export function onShelfFirmwareVersion(data) {
  return request({
    url: "/v1/platform/web/open/firmwareVersion/onShelf",
    method: "post",
    data,
  });
}

/**
 * 固件版本下架
 * @param {*} data 参数
 * @returns
 */
 export function unShelfFirmwareVersion(data) {
  return request({
    url: "/v1/platform/web/open/firmwareVersion/unShelf",
    method: "post",
    data,
  });
}