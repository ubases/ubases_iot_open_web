import request from "@/utils/request";

/**
 * 添加自定义app版本
 */
export function addCustomizedAppVerion(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/add",
    method: "post",
    data,
  });
}

/**
 * 编辑自定义app版本
 */
export function editCustomizedAppVerion(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/edit",
    method: "post",
    data,
  });
}

/**
 * 设置自定义app版本
 */
export function setCustomizedAppVerion(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/set",
    method: "post",
    data,
  });
}

/**
 * 删除自定义app版本
 */
export function deleteCustomizedAppVerion(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/del",
    method: "post",
    data,
  });
}

/**
 * 获取自定义app版本列表
 */
export function getCustomizedAppVerionList(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/list",
    method: "post",
    data,
  });
}


/**
 * 获取自定义app版本
 */
export function getCustomizedAppVerionDetails(params) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/detail",
    method: "get",
    params,
  });
}

/**
 * 更新上架记录
 */
export function editLaunchMarkets(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/editLaunchMarkets",
    method: "post",
    data,
  });
}

/**
 * 更改提醒方式
 */
export function setRemindMode(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/editRemindMode",
    method: "post",
    data,
  });
}



/**
 * 更新描述
 */
export function editRemark(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/version/editRemark",
    method: "post",
    data,
  });
}





/**
 * 获取自定义app包二维码链接
 */
export function getCustomizedAppQrCodeUrl(params) {
  return request({
    url: "/v1/platform/web/open/oem/app/custom/qrCodeUrl",
    method: "get",
    params,
  });
}