import request from "@/utils/request";

/**
 * 面板列表
 * @param {*} params 查询数据
 * @returns
 */
export function getPanelList(data) {
  return request({
    url: "/v1/platform/web/open/panel/list",
    method: "post",
    data
  });
}

/**
 * 新增面板
 * @param {*} params 查询数据
 * @returns
 */
 export function addPanel(data) {

  let formData = new FormData();
  formData.append("name", data.name);
  formData.append("baseProductId", data.baseProductId);
  formData.append("panelType", data.panelType);
  if(data.panelPreview){
    formData.append("panelPreview", data.panelPreview);
  }
  if(data.panelFile){
    formData.append("panelFile", data.panelFile);
  }
  if(data.langFile){
    formData.append("langFile", data.langFile);
  }
  if(data.productId){
    formData.append("productId", data.productId);
  }
  if(data.desc){
    formData.append("desc", data.desc);
  }
  return request({
    url: "/v1/platform/web/open/panel/addCustom",
    method: "post",
    data: formData,
    timeout: 10*60*1000,
  });
}

/**
 * 编辑面板
 * @param {*} params 查询数据
 * @returns
 */
 export function editPanel(data) {
  let formData = new FormData();
  formData.append("id", data.id);
  formData.append("name", data.name);
  formData.append("baseProductId", data.baseProductId);
  formData.append("panelType", data.panelType);
  formData.append("productId", data.productId || '');
  formData.append("desc", data.desc || '');
  if(data.panelPreview){
    formData.append("panelPreview", data.panelPreview);
  }
  if(data.panelFile){
    formData.append("panelFile", data.panelFile);
  }
  if(data.langFile){
    formData.append("langFile", data.langFile);
  }
  return request({
    url: "/v1/platform/web/open/panel/editCustom",
    method: "post",
    data: formData,
    timeout: 10*60*1000,
  });
}

/**
 * 删除面板
 * @param {*} params 查询数据
 * @returns
 */
 export function deletePanel(id) {
  return request({
    url: `/v1/platform/web/open/panel/delete/${id}`,
    method: "post",
  });
}

/**
 * 获取面板设计页详情
 * @param id 面板ID
 * @returns 面板详情
 */
export function getPanelDetail(id) {
  return request({
    url: `/v1/platform/web/open/panel/detail/${id}`,
    method: "get",
  });
}

/**
 * 面板保存
 */
export function savePanel(data) {
  return request({
    url: "/v1/platform/web/open/panel/edit",
    method: "post",
    data,
    timeout: 30*60*1000,
  });
}

/**
 * 面板状态修改
 */
export function setPanelStatus(data) {
  return request({
    url: "/v1/platform/web/open/panel/setStatus",
    method: "post",
    data,
  });
}





















