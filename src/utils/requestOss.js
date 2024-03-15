import axios from "axios";
import { VueAxios } from "./axios";

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: "/",
  timeout: 10*1000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    if (error.request.responseType && error.request.responseType == "blob") {
      let reader = new FileReader();
      reader.onload = (e) => {
      };
      reader.readAsText(error.response.data);
    }
  }
  return Promise.resolve(error);
};

// 响应拦截
request.interceptors.response.use((response) => {
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
