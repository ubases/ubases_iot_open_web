import { downloadTemplate } from '@/api/common'
import { deepClone } from '@/utils/util';
import storage from "store";

export default {
  install (Vue, options) {
    // 有黄色感叹号图标
    Vue.prototype.$WarningModal = function (that, msg, title = '',okText = that.$t('public.ok')) {
      const icon = require('../assets/image/warning.png')
      return new Promise((resolve, reject) => {
        var content = msg ||'确认删除?'
        that.$confirm({
          width:'360',
          title,
          content: h=><div style="width:224px;text-align:center;margin:0 38px;color:#343A40;">{content}</div>,
          icon: h=><div style="float:none;text-align:center;padding-top:16px;"><img src={icon}/></div>,
          centered:true,
          okText: okText,
          okType: 'primary',
          cancelText: that.$t('public.cancel'),
          class:'global-delete-modal',
          onOk: () => {
            resolve()
          },
          onCancel () {
            reject()
          }
        })
      })
    }

    // 无黄色感叹号图标
    Vue.prototype.$ConfirmModal = function (that, msg='', title = '',okText = that.$t('public.ok'),cancelText=that.$t('public.cancel')) {
      return new Promise((resolve, reject) => {
        that.$confirm({
          width:'420',
          title,
          content: h=><div style="width:300px;text-align:center;color:#343A40;">{msg}</div>,
          icon: h=>'',
          centered:true,
          okText,
          okType: 'primary',
          cancelText,
          class:'global-delete-modal',
          onOk: () => {
            resolve()
          },
          onCancel () {}
        })
      })
    }

    // info信息，只有一个按钮
    Vue.prototype.$InfoModal = function (that, msg='', title = '',okText = that.$t('public.ok')) {
      return new Promise((resolve, reject) => {
        that.$info({
          width:'420',
          title,
          content: h=><div style="width:300px;text-align:center;color:#343A40;">{msg}</div>,
          icon: h=>'',
          centered:true,
          okText: okText,
          okType: 'info',
          class:'global-delete-modal',
          onOk: () => {
            resolve()
          },
        })
      })
    }

    // info信息，自定义内容、按钮
    Vue.prototype.$ConfirmCustomModal = function (that, content='', title = '',okText = that.$t('public.ok'),cancelText=that.$t('public.cancel')) {
      return new Promise((resolve, reject) => {
        that.$confirm({
          width:'420',
          title,
          content,
          icon: h=>'',
          centered:true,
          okText,
          okType: 'primary',
          cancelText,
          class:'global-delete-modal',
          onOk: () => {
            resolve()
          },
          onCancel () {
            reject()
          }
        })
      })
    }

    Vue.prototype.$DownloadTemplate = function (that, params, downloadfilename,method,loading="confirmLoading") {
      return new Promise((resolve, reject) => {
        downloadTemplate(params,method)
          .then((res) => {
            that[loading] = false
            if (res.type == 'application/json') {
              const blob = new Blob([res])
              var reader = new FileReader()
              reader.onload = function (event) {
                var content = reader.result// 内容就在这里、
                var resObj = JSON.parse(content)
                that.$message.error(resObj.msg)
              }
              reader.readAsText(blob)
            } else {
              const blob = new Blob([res])
              const downloadElement = document.createElement('a')
              const href = window.URL.createObjectURL(blob)
              downloadElement.href = href
              downloadElement.download = downloadfilename // xxx.xls/xxx.xlsx
              document.body.appendChild(downloadElement)
              downloadElement.click()
              document.body.removeChild(downloadElement)
              window.URL.revokeObjectURL(href)
            }
          })
          .catch((err) => {
            that[loading] = false
            that.$message.error('服务器连接错误！')
          })
      })
    }
    
    /**
     * 获取字典类型list
     * @param {*} type 字典类型
     * @returns 
     */
    Vue.prototype.$DictList = function (type) {
      let dictList = storage.get("app_dict_list") || [];
      let filterList = dictList.filter(dict=>dict.dictType.trim() == type )
      return filterList.map(dict=>{return {label:dict.dictLabel, value:dict.dictValue}})
    }

    /**
     * 获取字典名称
     * @param {*} type 字典类型
     * @param {*} value 字典值
     * @returns 
     */
    Vue.prototype.$DictName = function (type, value, key="dictLabel") {
      let dictList = storage.get("app_dict_list") || [];
      let list = dictList.filter((dict)=>{ return dict.dictType.trim() == type });
      for (let i = 0; i <list.length; i++){
        if(list[i].dictValue == value){
          return list[i][key] || "";
        }
      }
    }

    /**
     * 获取字典值
     * @param {*} type 字典类型
     * @param {*} label 字典名称
     * @returns 
     */
    Vue.prototype.$DictValue = function (type, label) {
      let dictList = storage.get("app_dict_list") || [];
      let list = dictList.filter((dict)=>{ return dict.dictType.trim() == type });
      for (let i = 0; i <list.length; i++){
        if(list[i].dictLabel == label){
          return list[i].dictValue || "";
        }
      }
    }

    /**
     * 通过value值筛选列表对应的label
     * @param {*} list 列表
     * @param {*} value 值
     * @returns 
     */
    Vue.prototype.$FilterLabel = function (list, value,valueKey='value',labelKey='label') {
      return list.find(item=>item[valueKey] == value)?.[labelKey] ?? ''
    }

    /**
     * 日期格式转化为时间戳
     * @param {*} value 日期的值
     * @returns 
     */
    Vue.prototype.$TransformTimestamp = function (value) {
      return Date.parse(value._d) / 1000
    }

    /**
     * 对象深拷贝
     */
     Vue.prototype.$deepClone = deepClone
  }
}
