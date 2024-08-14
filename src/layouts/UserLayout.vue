<template>
  <div id="userLayout" :class="['user-layout-wrapper', 'desktop']">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="javascript:;" class="">
            <img src="../assets/logo.png" class="logo-img"/>
            <span class="title">
              {{$t('system.title')}}
            </span>
            <version style="color:#343A40;"/>
          </a>
        </div>
      </div>
      <div class="page-wrap">
        <route-view></route-view>
      </div>
      <div class="footer" style="background: none; height:20px; font-size: 1.3em; font-family: '微软雅黑'; color:#70757D;">
        Copyright @2021 深圳市安信可科技有限公司 <a href="https://beian.miit.gov.cn/#/Integrated/recordQuery" class="AQ footer-link">粤ICP备13001817号-2</a>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from "./RouteView";
import SelectLang from "@/components/SelectLang";
import Version from "@/components/GlobalHeader/Version.vue";

export default {
  name: "UserLayout",
  components: { RouteView, SelectLang, Version },
  data() {
    return {};
  },
  mounted() {
    document.body.classList.add("userLayout");
  },
  beforeDestroy() {
    document.body.classList.remove("userLayout");
  },
};
</script>

<style lang="less" scoped>
@import "../global.less";
#userLayout.user-layout-wrapper {
  height: 100%;
  

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
        height: 100%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background: @aithings-search-bg-color;
    background-size: 100%;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header {
        margin: 50px 42px;
        a{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title {
          padding-left:22px;
          font-size: 20px; 
          color: @aithings-text-color-black;
          font-weight: 500;
          line-height: 28px;
        }
      }
      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 99%;
      bottom: 0;
      padding: 10px 20px;
      margin: 48px 0 50px;
      text-align: center;

      // .links {
      //   margin-bottom: 8px;
      //   font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      // }
      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
}
div {
  border: 0px solid blue;
}
.page-wrap{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  // width: 960px;
  height: auto;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0px 0px 12px rgba(71, 91, 239, 0.2);
}
.logo-img{
    width: 44px;
    height: 44px;
  }

/* 小屏幕 */
@media (max-width: 1200px) { 
  #userLayout.user-layout-wrapper .container .top .header{
    margin: 30px 20px;
  }
  #userLayout.user-layout-wrapper .container .footer{
    margin: 30px 0;
  }
}
</style>
