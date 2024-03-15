import request from "@/utils/request";

// 固件OTA管理

/**
 * 固件OTA数据列表
 * @param {*} params 查询参数
 * @returns
 */
export function getFirmwareOTAList(data) {
  return request({
    url: "/v1/platform/web/open/firmware/otaList",
    method: "post",
    data,
  });
}

/**
 * 固件OTA数据详情
 * @param {*} id 固件OTAID
 * @returns
 */
 export function getFirmwareOTADetail(id) {
  return request({
    url: "/v1/platform/web/open/firmware/otaDetail/" + id,
    method: "get",
  });
}

/**
 * 固件OTA数据新增
 * @param {*} params 查询参数
 * @returns
 */
 export function addFirmwareOTA(data) {
  return request({
    url: "/v1/platform/web/open/firmware/otaAdd",
    method: "post",
    data,
  });
}

/**
 * 固件OTA数据编辑
 * @param {*} params 查询参数
 * @returns
 */
 export function editFirmwareOTA(data) {
  return request({
    url: "/v1/platform/web/open/firmware/otaEdit",
    method: "post",
    data,
  });
}

/**
 * 固件OTA数据删除
 * @param {*} params 查询参数
 * @returns
 */
 export function deleteFirmwareOTA(data) {
  return request({
    url: "/v1/platform/web/open/firmware/otaDelete",
    method: "post",
    data,
  });
}

/**
 * 固件OTA发布记录
 * @param {*} params 查询参数
 * @returns
 */
 export function getReleaseRecordList(data) {
  return request({
    url: "/v1/platform/web/open/firmware/releaseRecord",
    method: "post",
    data,
  });
}

/**
 * 固件OTA发布
 * @param {*} params 查询参数
 * @returns
 */
 export function otaRelease(data) {
  return request({
    url: "/v1/platform/web/open/firmware/otaRelease",
    method: "post",
    data,
  });
}

/**
 * 固件OTA发布暂停
 * @param {*} params 查询参数
 * @returns
 */
 export function otaStop(data) {
  return request({
    url: "/v1/platform/web/open/firmware/otaStop",
    method: "post",
    data,
  });
}

/**
 * 固件OTA恢复发布
 * @param {*} params 查询参数
 * @returns
 */
 export function otaRecoveryRelease(data) {
  return request({
    url: "/v1/platform/web/open/firmware/otaRecoveryRelease",
    method: "post",
    data,
  });
}

/**
 * 通过产品Key获取可升级固件类型
 * @param {*} params 查询参数
 * @returns
 */
 export function getFirmwareTypeList(params) {
  return request({
    url: "/v1/platform/web/open/product/firmwareTypeList",
    method: "get",
    params,
  });
}

/**
 * 固件列表查询
 * @param {*} params 查询参数
 * @returns
 */
 export function getFirmwareList(params) {
  return request({
    url: "/v1/platform/web/open/product/firmwareList",
    method: "get",
    params,
  });
}

/**
 * 固件版本列表查询
 * @param {*} params 查询参数
 * @returns
 */
 export function getFirmwareVersionList(params) {
  return request({
    url: "/v1/platform/web/open/product/firmwareVersionList",
    method: "get",
    params,
  });
}

/**
 * 获取产品的固件版本列表
 * @param {*} params 查询参数
 * @returns
 */
 export function getUpgradableVersions(params) {
  return request({
    url: "/v1/platform/web/open/firmware/upgradableVersions",
    method: "get",
    params,
  });
}

/**
 * 获取产品的固件升级区域列表
 * @param {*} params 查询参数
 * @returns
 */
 export function getUpgradableAreas(params) {
  return request({
    url: "/v1/platform/web/open/firmware/upgradableAreas",
    method: "get",
    params,
  });
}

/**
 * 获取OTA发布结果（发布详情
 * @param {*} publishId 发布编号
 * @returns
 */
 export function getPublishDetail(publishId,params) {
  return request({
    url: "/v1/platform/web/open/firmware/otaResult/"+publishId,
    method: "get",
    timeout: 60*1000,
    params
  });
}

