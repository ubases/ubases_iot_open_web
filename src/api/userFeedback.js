import request from "@/utils/request";

/**
 * App用户反馈列表
 */
 export function getFeedbackList(data) {
  return request({
    url: "/v1/platform/web/open/feedback/list",
    method: "post",
    data,
  });
}

/**
 * App用户反馈详情
 */
 export function getFeedbackDetail(id) {
  return request({
    url: "/v1/platform/web/open/feedback/detail/"+id,
    method: "get",
  });
}

/**
 * App用户反馈-提交回复
 */
 export function getFeedbackReply(data) {
  return request({
    url: "/v1/platform/web/open/feedback/reply",
    method: "post",
    data,
  });
}