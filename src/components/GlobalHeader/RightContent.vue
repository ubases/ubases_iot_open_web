<template>
  <div :class="wrpCls">
    <space-dropdown />
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SpaceDropdown from './SpaceDropdown.vue'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SpaceDropdown
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {},
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.currentUser = {
        name: 'Serati Ma'
      }
    }, 1500)
  },
  methods:{
    linkPage (path) {
      this.$router.push(path)
    },
  },

}
</script>

<style scoped type="less">
.work-order {
  position: relative;
  padding-right: 30px;
  font-size: 14px;
  color: #fff;
}
.redDot::after{
  content: '';
  width: 5px;
  height: 5px;
  background: #f5222d;
  border-radius: 100%;
  display: block;
  position: absolute;
  top: -2px;
  right: 25px;
}
</style>