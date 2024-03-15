import cookies from "@/utils/cookies"
import storage from "store";

// 设置免登录token
export function setAvoidLogin(data){
  if(!storage.get('securityTime')) return
  cookies.setCookie('token', data, storage.get('securityTime')/60/60/24)
}

// 移除免登录token
export function removeAvoidLogin(){
  cookies.removeCookie('token')
}

// 获取免登录token
export function getAvoidLoginToken(){
  return cookies.getCookie('token')
}