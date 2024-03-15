import request from "@/utils/request";
import requestOss from "@/utils/requestOss"
import {URL_hTTPS} from "@/utils/validate"

/**
 * 图片文件上传
 * @param {*} file 文件
 * @param {*} type 1：单图，2：多图，3：base64图片
 * @param {*} source 3 七牛
 * @param {*} dir 字典图：dic 用户头像：avatar 模组图片： module 模组文档：moduleDoc 产品图片：product 固件图片：firmware
 * @returns
 */
export function uploadFile(file, dir="image", type="1", source="3") {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("source", source);
  formData.append("dir", dir);
  return request({
    url: "/v1/platform/web/common/fileStore/uploadOssFile",
    method: "post",
    data: formData,
    timeout: 10*60*1000,
  });
}

// 文件下载
export function downloadTemplate(params,method = "get") {
  const {url, ...param} = {...params}
  const requestObject = {
    url: url,
    method: method,
    responseType: param.responseType || 'blob', // 返回格式，默认json，可选arraybuffer、blob、document、json、text、stream
    timeout: 30*60*1000,
  }
  if(method == 'post'){
    requestObject.data = param
  } else{
    requestObject.params = param
  }
  if(!URL_hTTPS.test(url)){
    return request(requestObject)
  }else{
    return requestOss(requestObject)
  }
  ;
}


/**
 * 文档接口
 * @param 参数
 * @returns {*文档内容*}
 */
 export function getDocument(params) {
  return request({
    url: "/v1/platform/open/introduce",
    method: "get",
    params
  });
}

/**
 * 区域树型数据
 */
 export function areaTreeData(pid,showChild) {
  return request({
    url: `/v1/platform/web/config/area/treeData/${pid}/${showChild}`,
    method: "get",
  });
}

/**
 * 区域列表查询
 */
 export function areaList(data) {
  return request({
    url: "/v1/platform/web/config/area/list",
    method: "post",
    data
  });
}

/**
 * 支持语言列表查询
 */
 export function langTypeList() {
  return request({
    url: `/v1/platform/web/open/lang/langTypeList`,
    method: "get",
  });
}