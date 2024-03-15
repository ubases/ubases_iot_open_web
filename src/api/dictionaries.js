// 字典
import request from "@/utils/request";


/**
 * 字典数据列表
 * @param {*} params 查询参数
 * @returns
 */
export function getDictList(params) {
  return request({
    url: "/v1/platform/web/basedata/dictdata/list",
    method: "get",
    params,
  });
}
