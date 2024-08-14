
import { ACCESS_TOKEN } from "@/store/mutation-types";
import storage from "store";
import store from "@/store";

let socket = null
let interval = null
class WsService {
  constructor() {
      // 创建WebSocket实例并保存为单例
    if (!socket) {
      const token = storage.get(ACCESS_TOKEN);
      if(!token) return
      const WEBSOCKET_URL = store.getters.userInfo.websocketUrl
      socket = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);
      // 监听连接打开事件
      socket.onopen = function(event) {
        console.info('WebSocket已连接');
        clearInterval(interval)
        interval = setInterval(() => {
          socket.send('ping');
        }, 30*1000); // 30秒作为ping的间隔
      };

      // 监听消息接收事件
      socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        // 使用发布订阅模式分发消息
        if(data.data.unRead){
          store.dispatch('getUnreadMsg', data.data.unRead);
        }
        
      };

      // 监听连接关闭事件
      socket.onclose = function(event) {
        console.info('WebSocket已关闭');
        socket = null
        clearInterval(interval)
        if (store.getters.userInfo.id) {
          store.dispatch('initWs')
        }
      };

      // 监听错误事件
      socket.onerror = function(error) {
        console.error('WebSocket发生错误：', error);
      };
    }
  }

  // 发送消息方法
  sendMessage(message) {
    if (this.isConnected()) {
      this.getInstance().send(JSON.stringify(message));
    } else {
      console.error('WebSocket未连接，无法发送消息');
    }
  }

  // 检查是否连接
  isConnected() {
    return this.getInstance() && this.getInstance().readyState == 1;
  }

  // 获取WebSocket实例
  getInstance() {
    return socket;
  }

  // 当离开页面或者需要断开连接时调用此方法
  closeConnection() {
    
    if (this.isConnected()) {
      console.log('web端关闭连接')
      socket.close();
    }
  }
}

export default WsService;