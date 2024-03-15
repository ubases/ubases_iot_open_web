import axios from "axios";
import store from "@/store";
import storage from "store";
import { Notification } from "ant-design-vue";
import { VueAxios } from "./axios";
import { ACCESS_TOKEN } from "@/store/mutation-types";
const NOTIFICATION_KEY = "request_hint"

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: "/api",
  timeout: 10*1000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const token = storage.get(ACCESS_TOKEN);
    if (!token) {
      if (!storage.get("error_notification")) {
        storage.set("error_notification", true, 1000);
        Notification.error({
          key: NOTIFICATION_KEY,
          message: "登陆失效，请重新登录",
        });
        store.dispatch("Logout").then(() => {
          router.push({ path: "/user/login" });
        });
      }
      return Promise.resolve({
        code: -1,
        msg: "请求异常",
      });
    } else {
      var res = error.response;
      if ((res.data && res.data.code == 20001) || res.data.code == 400) {
        if (!storage.get("error_notification")) {
          storage.set("error_notification", true, 1000);
          Notification.error({
            key: NOTIFICATION_KEY,
            message: "登陆失效，请重新登录",
          });
          store.dispatch("Logout").then(() => {
            router.push({ path: "/user/login" });
          });
        }
        return Promise.resolve({
          code: -1,
          msg: "请求异常",
        });
      } else {
        Notification.error({
          key: NOTIFICATION_KEY,
          message: '请求异常',
        });
      }
    }
  } else {
    if (error.request.responseType && error.request.responseType == "blob") {
      let reader = new FileReader();
      reader.onload = (e) => {
        let errData = JSON.parse(e.target.result);
      };
      reader.readAsText(error.response.data);
    }
  }
  return Promise.resolve(error);
};

// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN);
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers = {
      authorization: "Bearer " + token,
      lang: store.getters.lang,
    };
  } else {
    config.headers = {
      lang: store.getters.lang,
    };
  }
  return config;
}, errorHandler);

// 响应拦截
request.interceptors.response.use((response) => {
  if (response.data.code === 0) {
    
    // 判断token过期 五分钟之内更新token
    store.dispatch("UpdateToken");

    return Promise.resolve(response.data);
  } else if(response.data.code === 400){
    // 登录失效
    store.dispatch("Logout", true)
    router.replace({ path: "/user/login" });

    Notification.error({
      key: NOTIFICATION_KEY,
      message: "登录失效,请重新登录",
    });
  } else if (response.data.msg) {
    Notification.error({
      key: NOTIFICATION_KEY,
      message: response.data.msg,
    });
    return response.data;
  }
  return response.data;
}, errorHandler);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };
