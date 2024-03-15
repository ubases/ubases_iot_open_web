// 产品管理
import request from "@/utils/request";


/**
 * 获取产品列表
 * @param {*} data 查询参数
 * @returns
 */
 export function getProductList(data) {
  return request({
    url: "/v1/platform/web/open/product/list",
    method: "post",
    data,
  });
}

/**
 * 产品详情
 * @param {*} id 查询参数
 * @returns
 */
 export function getProductDetails(id) {
  return request({
    url: "/v1/platform/web/open/product/detail/"+id,
    method: "get",
  });
}

/**
 * 删除产品
 * @returns
 */
 export function deleteProduct(data) {
  return request({
    url: "/v1/platform/web/open/product/delete",
    method: "post",
    data
  });
}

/**
 * 获取产品分类列表
 * @returns
 */
 export function getProductClassifyList() {
  return request({
    url: "/v1/platform/web/open/productType/get",
    method: "get",
  });
}

/**
 * 获取产品方案列表
 * @param {*} data 产品参数
 * @returns
 */
 export function getProjectList(params) {
  return request({
    url: "/v1/platform/web/open/product/getBaseProduct",
    method: "get",
    params,
  });
}

/**
 * 新增产品
 * @param {*} data 产品参数
 * @returns
 */
 export function createProduct(data) {
  return request({
    url: "/v1/platform/web/open/product/save",
    method: "post",
    data,
  });
}

/**
 * 编辑产品
 * @param {*} data 产品参数
 * @returns
 */
 export function editProduct(data) {
  return request({
    url: "/v1/platform/web/open/product/edit",
    method: "post",
    data,
  });
}

/**
 * 查询产品的功能列表（包翻译）
 * @param {*} params 查询参数
 * @returns
 */
export function getTranslateFuncList(params) {
  return request({
    url: "/v1/platform/web/open/product/functions",
    method: "get",
    params
  });
}


/**
 * 查询标准功能/自定义功能
 * @param {*} params 查询参数
 * @returns
 */
 export function getFuncList(params) {
  return request({
    url: "/v1/platform/web/open/product/funcList",
    method: "get",
    params
  });
}

/**
 * 添加标准 - 标准功能列表
 * @param {*} params 查询参数
 * @returns
 */
 export function getStandardFuncList(params) {
  return request({
    url: "/v1/platform/web/open/product/standardFuncList",
    method: "get",
    params
  });
}

/**
 * 添加标准功能
 * @param {*} data 参数
 * @returns
 */
 export function addStandardFunc(data) {
  return request({
    url: "/v1/platform/web/open/product/addStandardFunc",
    method: "post",
    data
  });
}

/**
 * 编辑功能
 * @param {*} data 参数
 * @returns
 */
 export function editFunc(data) {
  return request({
    url: "/v1/platform/web/open/product/editFunc",
    method: "post",
    data
  });
}


/**
 * 新增自定义功能
 * @param {*} data 参数
 * @returns
 */
 export function addCustomFunc(data) {
  return request({
    url: "/v1/platform/web/open/product/addFunc",
    method: "post",
    data
  });
}

/**
 * 删除功能
 * @returns
 */
 export function deleteFunc(data) {
  return request({
    url: "/v1/platform/web/open/product/deleteFunc",
    method: "post",
    data
  });
}

/**
 * 查询可选择的模组
 * @param {*} params 参数
 * @returns
 */
 export function getModuleList(params) {
  return request({
    url: "/v1/platform/web/open/product/queryModules",
    method: "get",
    params
  });
}

/**
 * 选择模组固件
 * @param {*} data 参数
 * @returns
 */
 export function selectModule(data) {
  return request({
    url: "/v1/platform/web/open/product/selectModule",
    method: "post",
    data
  });
}

/**
 * 获取固件更换版本列表
 * @param {*} params 参数
 * @returns
 */
 export function getChangeVersionList(params) {
  return request({
    url: "/v1/platform/web/open/firmware/changeVersionList",
    method: "get",
    params
  });
}

/**
 * 选择固件更换版本提交
 * @param {*} data 参数
 * @returns
 */
 export function changeVersionSubmit(data) {
  return request({
    url: "/v1/platform/web/open/product/changeVersionSubmit",
    method: "post",
    data
  });
}

/**
 * 查询可选择的自定义固件
 * @param {*} params 参数
 * @returns
 */
 export function getCustomizeList(params) {
  return request({
    url: "/v1/platform/web/open/product/queryCustomFirmware",
    method: "get",
    params
  });
}

/**
 * 获取自定义固件更换版本列表
 * @param {*} params 参数
 * @returns
 */
 export function getCustomVersionList(params) {
  return request({
    url: "/v1/platform/web/open/firmware/changeCustomVersionList",
    method: "get",
    params
  });
}

// /**
//  * 选择自定义固件更换版本提交
//  * @param {*} data 参数
//  * @returns
//  */
//  export function changeCustomVersionSubmit(data) {
//   return request({
//     url: "/v1/platform/web/open/product/changeCustomVersionSubmit",
//     method: "post",
//     data
//   });
// }

/**
 * 关联自定义固件
 * @param {*} data 参数
 * @returns
 */
 export function selectCustomerFirmware(data) {
  return request({
    url: "/v1/platform/web/open/product/selectCustomerFirmware",
    method: "post",
    data
  });
}

/**
 * 解除自定义固件
 * @param {*} data 参数
 * @returns
 */
 export function removeCustomerFirmware(data) {
  return request({
    url: "/v1/platform/web/open/product/removeCustomerFirmware",
    method: "post",
    data
  });
}

/**
 * 查询面板列表
 * @param {*} params 参数
 * @returns
 */
 export function getPanelList(params) {
  return request({
    url: "/v1/platform/web/open/product/controlPanelList",
    method: "get",
    params
  });
}

/**
 * 选择面板
 * @param {*} data 参数
 * @returns
 */
 export function selectPanel(data) {
  return request({
    url: "/v1/platform/web/open/product/selectControlPanel",
    method: "post",
    data
  });
}


/**
 * 查询配网引导详情
 * @param {*} params 参数
 * @returns
 */
 export function getNetworkGuide(params) {
  return request({
    url: "/v1/platform/web/open/product/getNetworkGuide",
    method: "get",
    params
  });
}

/**
 * 查询默认配网信息
 * @param {*} params 参数
 * @returns
 */
 export function getDefaultNetworkGuide(params) {
  return request({
    url: "/v1/platform/web/open/product/getDefaultNetworkGuide",
    method: "get",
    params
  });
}

/**
 * 保存配网引导步骤
 * @param {*} data 参数
 * @returns
 */
 export function saveNetworkGuide(data) {
  return request({
    url: "/v1/platform/web/open/product/saveNetworkGuide",
    method: "post",
    data
  });
}

/**
 * 更换配网模式
 * @param {*} data 参数
 * @returns
 */
 export function changeNetworkGuide(data) {
  return request({
    url: "/v1/platform/web/open/product/changeNetworkGuide",
    method: "post",
    data
  });
}

/**
 * 开发完成查询
 * @param {*} params 参数
 * @returns
 */
 export function getCompleteDevelop(params) {
  return request({
    url: "/v1/platform/web/open/product/completeDevelopDetailed",
    method: "get",
    params
  });
}

/**
 * 开发完成
 * @param {*} data 参数
 * @returns
 */
 export function completeDevelop(data) {
  return request({
    url: "/v1/platform/web/open/product/completeDevelop",
    method: "post",
    data
  });
}

/**
 * 返回开发
 * @param {*} data 参数
 * @returns
 */
 export function returnDevelop(data) {
  return request({
    url: "/v1/platform/web/open/product/returnDevelop",
    method: "post",
    data
  });
}

/**
 * 测试用例模板详细信息查询
 * @param {*} params 参数
 * @returns
 */
 export function getTestTemplate(params) {
  return request({
    url: "/v1/platform/web/template/testCaseTpl/download",
    method: "get",
    params
  });
}

/**
 * 产品测试用例查询
 * @param {*} params 参数
 * @returns
 */
 export function getTestReportFile(params) {
  return request({
    url: "/v1/platform/web/open/product/getTestReportFile",
    method: "get",
    params
  });
}

/**
 * 产品测试用例新增
 * @param {*} data 参数
 * @returns
 */
 export function uploadTestReport(data) {
  return request({
    url: "/v1/platform/web/open/product/uploadTestReport",
    method: "post",
    timeout: 30*1000,
    data
  });
}

/**
 * 产品语控配置列表
 * @param {*} params 参数
 * @returns
 */
 export function getVoiceConfigList(data) {
  return request({
    url: "/v1/platform/web/open/product/voice/list",
    method: "post",
    data
  });
}

/**
 * 产品语控配置发布
 * @param {*} params 参数
 * @returns
 */
 export function setVoiceConfigStatus(data) {
  return request({
    url: "/v1/platform/web/open/product/voice/publish",
    method: "post",
    data
  });
}

/**
 * 产品语控配置详细
 * @param {*} params 参数
 * @returns
 */
 export function getVoiceConfigDetail(data) {
  return request({
    url: "/v1/platform/web/open/product/voice/detail",
    method: "post",
    data
  });
}

/**
 * 产品语控配置保存
 * @param {*} data 参数
 * @returns
 */
 export function saveVoiceConfig(data) {
  return request({
    url: "/v1/platform/web/open/product/voice/save",
    method: "post",
    data
  });
}

/**
 * 产品语控发布记录
 * @param {*} params 参数
 * @returns
 */
 export function getPublishRecord(params) {
  return request({
    url: "/v1/platform/web/open/product/voice/publish/record",
    method: "get",
    params
  });
}

/**
 * 语控平台操作步骤描述接口
 * @param {*} params 参数
 * @returns
 */
 export function getVoiceDemo(params) {
  return request({
    url: "/v1/platform/web/open/product/voice/getDoc",
    method: "get",
    params
  });
}

/**
 * 第三方语控平台属性单位列表
 * @param {*} data 参数
 * @returns
 */
 export function getVoiceUnit(data) {
  return request({
    url: "/v1/platform/web/open/product/voice/unitList",
    method: "post",
    data
  });
}

/**
 * 产品导出物模型
 * @param {*} params 参数
 * @returns
 */
export function exportFunctions(params) {
  return request({
    url: "/v1/platform/web/open/product/thingModels/export",
    method: "GET",
    params
  });
}

/**
 * 重置产品标准功能
 * @param {*} params 参数
 * @returns
 */
export function resetStandardFunc(params) {
  return request({
    url: "/v1/platform/web/open/product/resetStandardFunc",
    method: "GET",
    params
  });
}

/**
 * 物模型场景功能设置
 * @param {*} data 参数
 * @returns
 */
export function setSceneFunc(data) {
  return request({
    url: "/v1/platform/web/open/product/setSceneFunc",
    method: "post",
    data
  });
}

/**
 * 设备日志-事件列表
 * @param {*} data 查询参数
 * @returns
 */
 export function getDeviceLogEventList(params) {
  return request({
    url: `/v1/platform/web/open/product/funcList`,
    method: "get",
    params,
  });
}
/**
 * 添加产品说明书
 * @param {*} data 参数
 * @returns
 */
export function addManual(data) {
  return request({
    url: "/v1/platform/web/open/manual/add",
    method: "post",
    data
  });
}

/**
 * 编辑产品说明书
 * @param {*} data 参数
 * @returns
 */
export function editManual(data) {
  return request({
    url: "/v1/platform/web/open/manual/edit",
    method: "post",
    data
  });
}

/**
 * 删除产品说明书
 * @param {*} data 参数
 * @returns
 */
export function deleteManual(data) {
  return request({
    url: "/v1/platform/web/open/manual/del",
    method: "post",
    data
  });
}

/**
 * 获取产品说明书详情
 * @param {*} params 参数
 * @returns
 */
export function getManualDetail(params) {
  return request({
    url: "/v1/platform/web/open/manual/detail",
    method: "GET",
    params
  });
}

/**
 * APP测试账号列表
 * @param {*} data 参数
 * @returns
 */
export function getTestAccount(data) {
  return request({
    url: "/v1/platform/web/open/productTestAccount/list",
    method: "post",
    data
  });
}

/**
 * APP测试账号新增
 * @param {*} data 参数
 * @returns
 */
export function addTestAccount(data) {
  return request({
    url: "/v1/platform/web/open/productTestAccount/add",
    method: "post",
    data
  });
}

/**
 * APP测试账号删除
 * @param {*} id 参数
 * @returns
 */
export function deleteTestAccount(id) {
  return request({
    url: `/v1/platform/web/open/productTestAccount/delete/${id}`,
    method: "post",
  });
}