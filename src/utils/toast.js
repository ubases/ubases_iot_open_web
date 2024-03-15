import { message } from "ant-design-vue";

export function toast(res, duration = 2) {
  if (res.code === 200 || res.code === 0) {
    message.success(res.msg, duration);
  } else {
    message.error(res.msg || res, duration);
  }
}
