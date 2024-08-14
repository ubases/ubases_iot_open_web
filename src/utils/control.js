import mqtt from 'mqtt'
import { debounce } from "@/utils/index";
import { randomString } from "@/utils/util"
import * as moment from 'moment';

let Control = {
  mqttServer: "",   //mqtt服务地址
  productKey: "",   //产品key
  deviceId: "",    //设备key
  secretkey:"",     //局域网加密秘钥
  timeout: null,    //请求超时任务
  options: {
    keepalive: 90, //单位为秒，数值类型，默认为 60 秒，设置为 0 时禁止
    clientId: "webdbg_" + randomString(32), //默认为 'mqttjs_' + Math.random().toString(16).substr(2, 8)，可以支持自定义修改的字符串
    protocolVersion: 4, //MQTT 协议版本号，默认为 4（v3.1.1）可以修改为 3（v3.1）和 5（v5.0）
    clean: true, //默认为 true，是否清除会话。当设置为 true 时，断开连接后将清除会话，订阅过的 Topics 也将失效。当设置为 false 时，离线状态下也能收到 QoS 为 1 和 2 的消息
    reconnectPeriod: 10*1000, //重连间隔时间，单位为毫秒，默认为 1000 毫秒，注意：当设置为 0 以后将取消自动重连
    connectTimeout: 10*1000, //连接超时时长，收到 CONNACK 前的等待时间，单位为毫秒，默认 30000 毫秒
    username: "", //认证用户名，如果 Broker 要求用户名认证的话，请设置该值
    password: "", //认证密码，如果 Broker 要求密码认证的话，请设置该值
    reschedulePings:true,   // 在发送数据包后重新安排ping消息(默认为' true ')
  },
  client: null, 
  isConnect:false,  // 是否连接
  registerQueryPropCallBack: ()=>{},
  registerDeviceInfoCallBack: ()=>{},
  registerRestoreCallBack: ()=>{},
  registerRebootCallBack: ()=>{},
  registerReportCallBack: ()=>{},
  registerOnlineCallBack: ()=>{},
  registerOtaInfoCallBack: ()=>{},
  registerOtaProgressCallBack: ()=>{},
  registerControlReportCallBack: ()=>{},
  registerQueryReportCallBack: ()=>{},
  sendMsgContentCallBack: ()=>{},

  init(param, options) {
    this.mqttServer = param.mqttServer
    this.productKey = param.productKey
    this.deviceId = param.deviceId
    this.options = Object.assign(this.options, options)
  },
  start(){
    console.log( this.options)
    this.client = mqtt.connect(`${this.mqttServer}`, this.options)
    this.client.on('connect', () => {
      console.info('MQTT 连接成功',this.options.clientId)
      this.isConnect = true
      this.client.subscribe(`${this.productKey}/${this.deviceId}/control`, {qos: 0});         //App控制指令
      this.client.subscribe(`${this.productKey}/${this.deviceId}/control/ack`, {qos: 0});     //控制指令响应
      this.client.subscribe(`${this.productKey}/${this.deviceId}/query/ack`, {qos: 0});       //获取设备状态信息响应
      this.client.subscribe(`${this.productKey}/${this.deviceId}/info/report`, {qos: 0});     //获取设备配置信息响应
      this.client.subscribe(`${this.productKey}/${this.deviceId}/online`, {qos: 0});          //在线状态，遗嘱消息、上线消息
      this.client.subscribe(`${this.productKey}/${this.deviceId}/upgrade/ack`, {qos: 0});     //OTA升级信息响应
      this.client.subscribe(`${this.productKey}/${this.deviceId}/upgrade/report`, {qos: 0});  //OTA升级进度主动上报
      this.client.subscribe(`${this.productKey}/${this.deviceId}/report`, {qos: 0});          //设备上报事件
      this.deviceInfo()//获取设备信息
      // this.client.on('packetsend', function(packet){
      //   console.log(`${packet.cmd}-${moment().format('YYYY-MM-DD HH:mm:ss')}`)
      // })
      // this.client.on('packetreceive', function(packet){
      //   console.log(`${packet.cmd}-${moment().format('YYYY-MM-DD HH:mm:ss')}`)
      // })
    })

    this.client.on('message', (topic, message) => { 
      console.log("topic:", topic);
      console.log("message:", String(message));
      message = JSON.parse(String(message));
      this.handleMessage(message,topic)
    })

    this.client.on('error', function (error) {
      console.info('连接失败或发生错误', error);
    });

    this.client.on('reconnect', ()=>{ 
      console.info('MQTT 重新连接')
    });
    
    this.client.on('disconnect', function () { 
      console.info('MQTT 收到断开连接报文');
      this.isConnect=false
      // this.end()
    });
    
    this.client.on('close', function () {
      console.info('MQTT 断开连接')
      this.isConnect=false
      // this.end()
    });

    this.client.on('offline', function () {
      console.log('MQTT 客户端下线')
      this.isConnect=false
      // this.end()
    })
  },

  handleMessage(message,topic){
    let header = message.header
    let payload = message.payload
    console.log(topic,message)
    if(header.ns=="iot.device.query" && header.name=="query"){//获取属性
      let props = payload.code == 0 ? payload.device : {}
      this.registerQueryPropCallBack(props,topic,message)
    }else if(header.ns=="iot.device.info" && header.name=="info"){//获取设备信息
      this.registerDeviceInfoCallBack(payload,topic,message)
    }else if(header.ns=="iot.device.control" && header.name=="control"){//App控制指令
      this.registerDeviceInfoCallBack(payload,topic,message)
    }else if(header.ns=="iot.device.control" && header.name=="restore"){//恢复出厂
      this.registerRestoreCallBack(payload,topic,message)
    }else if(header.ns=="iot.device.control" && header.name=="reboot"){//设备重启
      this.registerRebootCallBack(payload,topic,message)
    }else if(header.ns=="iot.device.report" && header.name=="report"){//设备上报：属性变化
      console.log('设备上报：'+payload.device,topic,message)
      this.registerReportCallBack(payload.device,topic,message)
    }else if(header.ns=="iot.device.report" && header.name=="online"){ //监听在线状态
      console.info("设备在线状态：", payload.onlineStatus);
      let online = payload.onlineStatus == 'offline' ? 0 : 1
      this.registerOnlineCallBack(online,topic,message)
    }else if(header.ns=="iot.device.upgrade" && header.name=="ota_info"){//OTA升级信息
      this.registerOtaInfoCallBack(payload,topic,message)
    }else if(header.ns=="iot.device.upgrade" && header.name=="ota_progress"){ //固件升级进度报告
      this.registerOtaProgressCallBack(payload,topic,message)
    }else if(header.ns=="iot.device.report" && header.name=="control"){ //虚拟设备--控制触发上报
      this.registerControlReportCallBack(payload.device,topic,message)
    }else if(header.ns=="iot.device.report" && header.name=="query"){ //虚拟设备--查询触发上报
      this.registerQueryReportCallBack(payload.device,topic,message)
    }
  },
  /**
   * 获取设备信息
   */
  deviceInfo() {
    console.log('发送获取设备消息')
    let request = {
      "header":{
        "ns":"iot.device.info",
        "name":"info",
        "mid": Math.random().toString(16),
        "ts": moment().unix(),
        "ver":"1.0.0",
        "gid":""
      }
    }
    let requestJson = JSON.stringify(request)
    this.client.publish(`${this.productKey}/${this.deviceId}/info`,requestJson, {qos: 0}); 
  },
  /**
   * 获取设备属性(多个)
   * @param {*} props --属性名称集合 例：['speed','mode','switch']
   */
  getProps(props) {
    let request = {
      "header":{
        "ns":"iot.device.query",
        "name":"query",
        "mid": Math.random().toString(16),
        "ts": moment().unix(),
        "ver":"1.0.0",
        "gid":""
      },
      "payload":{
        "param":{
          "props": props
        }
      }
    }
    let requestJson = JSON.stringify(request)
    this.client.publish(`${this.productKey}/${this.deviceId}/query`, requestJson, {qos: 0}); 
  },
  /**
   * 获取所有设备属性
   */
  getPropAll() {
    let request = {
      "header":{
        "ns":"iot.device.queryAll",
        "name":"queryAll",
        "mid": Math.random().toString(16),
        "ts": moment().unix(),
        "ver":"1.0.0",
        "gid":""
      }
    }
    let requestJson = JSON.stringify(request)
    this.client.publish(`${this.productKey}/${this.deviceId}/query`, requestJson, {qos: 0}); 
  },
  /**
   * 设置属性 (设备控制),会有同时下发多属性的情况
   * @param {*} name    --物模型中的code 例：'switch'
   * @param {*} props --属性名称集合 例：{"switch": true, "mode": "auto", "speed": "1"}
   */
  setProps: debounce(function(props){
    let request = {
      "header":{
        "ns":"iot.device.control",
        "name": "control",
        "mid": Math.random().toString(16),
        "ts": moment().unix(),
        "ver":"1.0.0",
        "gid":""
      },
      "payload":{
        "control": props
      }
    }
    if(this.isConnect && this.client){
      this.sendMsgContentCallBack(JSON.stringify(request))
      this.client.publish(`${this.productKey}/${this.deviceId}/control`, JSON.stringify(request), {qos: 2}); 
    } 
    
  }, 400),
  /**
   * 重启设备
   */
  reboot(){
    let request = {
      "header":{
        "ns":"iot.device.control",
        "name":"reboot",
        "mid": Math.random().toString(16),
        "ts": moment().unix(),
        "ver":"1.0.0",
        "gid":""
      }
    }
    let requestJson = JSON.stringify(request)
    this.client.publish(`${this.productKey}/${this.deviceId}/control`,requestJson,{qos: 2}); 
  },
  /**
   * 设备恢复出厂设置
   */
  restore(){
    let request = {
      "header":{
        "ns":"iot.device.control",
        "name":"restore",
        "mid": Math.random().toString(16),
        "ts": moment().unix(),
        "ver":"1.0.0",
        "gid":""
      }
    }
    let requestJson = JSON.stringify(request)
    this.client.publish(`${this.productKey}/${this.deviceId}/control`,requestJson,{qos: 2}); 
  },
  /**
   * OTA升级信息
   * @param {*} param 
   */
  otaInfo(param){
    let request = {
      "header":{
        "ns":"iot.device.upgrade",
        "name":"ota_info",
        "mid": Math.random().toString(16),
        "ts": moment().unix(),
        "ver":"1.0.0",
        "gid":""
      },
      "payload":{
        param 
      }
    }
    this.client.publish(`${this.productKey}/${this.deviceId}/upgrade`,JSON.stringify(request),{qos: 0}); 
  },
  end() {//结束MQTT、COAP连接
    if (this.client) {
      this.client && this.client.end(false)
      this.client = null
    }
    this.isConnect=false
  },
}

window.Control = Control
export default Control