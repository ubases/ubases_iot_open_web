import request from "@/utils/request";

// 设备管理

/**
 * 设备数据列表
 * @param {*} data 查询参数
 * @returns
 */
export function getDeviceList(data) {
  return request({
    url: "/v1/platform/web/iot/activeDevice/list",
    method: "post",
    data,
  });
}

/**
 * 三元组生成
 * @param {*} data 新增参数
 * @returns
 */
export function deviceTriad(data) {
  return request({
    url: "/v1/platform/web/iot/deviceTriad/generator",
    method: "post",
    timeout: 120*1000,
    data,
  });
}

/**
 * 三元组导入
 * @param {*} data 新增参数
 * @returns
 */
export function deviceImport(data) {
  return request({
    url: "/v1/platform/web/iot/deviceTriad/import",
    method: "post",
    timeout: 120*1000,
    data,
  });
}

/**
 * 物联设备详细信息（分组信息）
 *  @param {*} id 设备ID
 * @returns
 */
export function getDeviceDetailsGroup(id) {
  return request({
    url: "/v1/platform/web/iot/activeDevice/detail/" + id,
    method: "get",
  });
}

/**
 * 物联设备详细信息
 *  @param {*} id 设备ID
 * @returns
 */
export function getDeviceDetails(id) {
  return request({
    url: "/v1/platform/web/iot/activeDevice/detail/" + id,
    method: "get",
  });
}

/**
 * 物联设备日志列表
 *  @param {*} data 查询参数
 * @returns
 */
export function getLogList(data) {
  return request({
    url: "/v1/platform/web/iot/activeDevice/logList",
    method: "post",
    data,
  });
}

/**
 * 物联设备故障列表
 *  @param {*} data 查询参数
 * @returns
 */
 export function getFailLogList(data) {
  return request({
    url: "/v1/platform/web/data/open/overview/failLoglist",
    method: "post",
    data,
  });
}

/**
 * 物联设备统计
 *  @param {*} data 查询参数
 * @returns
 */
 export function getDeviceCount(data) {
  return request({
    url: "/v1/platform/web/iot/activeDevice/count",
    method: "post",
    data,
  });
}

/**
 * 导出三元组统计
 *  @param {*} 
 * @returns
 */
 export function triadExportCount(params) {
  return request({
    url: "/v1/platform/web/iot/activeDevice/triadExportCount",
    method: "get",
    params,
  });
}


/**
 * 真实测试设备列表/虚拟调试设备列表
 * @param {*} data 查询参数
 * @returns
 */
 export function getTestDeviceList(data) {
  return request({
    url: "/v1/platform/web/iot/device/virtualDeviceList",
    method: "post",
    data,
  });
}

/**
 * 新增真实测试设备
 * @param {*} data 新增参数
 * @returns
 */
export function generatorTestDevice(data) {
  return request({
    url: "/v1/platform/web/iot/device/generatorVirtualDevice",
    method: "post",
    timeout: 30*1000,
    data,
  });
}

/**
 * 删除真实测试设备
 * @param {*} data 查询参数
 * @returns
 */
 export function deleteTestDevice(data) {
  return request({
    url: "/v1/platform/web/iot/device/deleteVirtualDevice",
    method: "post",
    data,
  });
}

/**
 * 添加APP账号
 * @param {*} data 新增参数
 * @returns
 */
 export function AddAppAccount(data) {
  return request({
    url: "/v1/platform/web/iot/device/addAppAccount",
    method: "post",
    data,
  });
}

/**
 * 新增虚拟调试设备
 * @param {*} data 新增参数
 * @returns
 */
 export function addVirtualDevice(data) {
  return request({
    url: "/v1/platform/web/iot/device/addVirtualDevice",
    method: "post",
    timeout: 30*1000,
    data,
  });
}

/**
 * 获取构建包二维码链接
 *  @param {*} 
 * @returns
 */
 export function qrCodeUrl(params) {
  return request({
    url: "/v1/platform/web/iot/app/build/qrCodeUrl",
    method: "get",
    params,
  });
}

/**
 * 生产管理数据列表
 * @param {*} data 查询参数
 * @returns
 */
export function getManufactureList(data) {
  return request({
    url: "/v1/platform/web/iot/activeDevice/produce/list",
    method: "post",
    data,
  });
}