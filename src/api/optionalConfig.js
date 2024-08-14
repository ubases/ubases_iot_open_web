import request from "@/utils/request";

/**
 * 语音服务获取
 * @returns
 */
export function getVoice(params) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/voice",
    method: "get",
    params
  });
}

/**
 * 语音服务保存
 */
 export function saveVoice(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/voice",
    method: "post",
    data,
  });
}

/**
 * 语音助手文档新增
 */
 export function addVoiceDoc(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/voice/doc",
    method: "post",
    data,
  });
}

/**
 * 语音助手文档修改
 */
 export function editVoiceDoc(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/voice/doc/update",
    method: "post",
    data,
  });
}

/**
 * 语音助手文档获取
 * @returns
 */
 export function getVoiceDoc(params) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/voice/doc",
    method: "get",
    params
  });
}

/**
 * 三方服务获取
 * @returns
 */
 export function getThirdService(params) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/thirdService",
    method: "get",
    params
  });
}

/**
 * 三方服务保存
 */
 export function saveThirdService(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/thirdService",
    method: "post",
    data,
  });
}

/**
 * 语控授权url
 * @returns
 */
 export function getVoiceAuthUrl(params) {
  return request({
    url: "/v1/platform/web/open/app/voice/oauthUrl",
    method: "get",
    params
  });
}

/**
 * 获取APP自动升级
 * @returns
 */
 export function getAutoUpgrade(params) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/autoUpgrade",
    method: "get",
    params
  });
}

/**
 * 保存APP自动升级
 */
 export function saveAutoUpgrade(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/functionConfig/autoUpgrade",
    method: "post",
    data,
  });
}

/**
 * APP更新团队ID
 */
export function editTeamId(data) {
  return request({
    url: "/v1/platform/web/open/oem/app/editTeamId",
    method: "post",
    data,
  });
}