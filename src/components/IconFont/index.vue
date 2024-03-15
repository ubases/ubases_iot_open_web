<template>
  <!-- 一种是ant自带字体图标 一种是阿里图标库引入使用的 通过前缀‘icon-’区分-->
  <ali-icon-font :class="['icon',{spin}]" v-if="type.indexOf('icon-') === 0" :type="type" />
  <a-icon v-else :type="type" :spin="spin"/>
</template>
<script>

import { Icon } from "ant-design-vue";
const AliIconFont = Icon.createFromIconfontCN({
  scriptUrl: require('./iconfont.js'),
});
export default {
  props: {
    type: [String],
    spin: {type: Boolean, default: false},
    project:{ type: String, default:''}
  },
  components: {
    "ali-icon-font": AliIconFont,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
  &.spin{
    animation: rotate 2s infinite linear;
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
