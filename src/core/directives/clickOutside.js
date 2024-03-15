import Vue from 'vue'

/**
 * v-click-outside 实现点击区域外部可触发事件
 */
const clickOutside = Vue.directive('click-outside',{
  bind(el, binding, vnode) {
    function eventHandler(e) {
      if (el.contains(e.target)) {
        return false
      }
      // 如果绑定的参数是函数，正常情况也应该是函数，执行
      if (binding.value && typeof binding.value === 'function') {
        binding.value(e)
      }
    }
    // 用于销毁前注销事件监听
    el.__click_outside__ = eventHandler
    // 添加事件监听
    document.addEventListener('click', eventHandler)
  },

  unbind(el, binding, vnode) {
    // 移除事件监听
    document.removeEventListener('click', el.__click_outside__)
    // 删除无用属性
    delete el.__click_outside__
  },
},
)


export default clickOutside