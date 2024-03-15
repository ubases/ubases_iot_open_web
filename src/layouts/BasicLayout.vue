<template>
  <a-layout class="basicLayout">
    <a-layout-header class="layout-header">
      <div class="logo tap-pointer" >
        <span @click="backIndex">
          <!-- <logo-white-icon style="transform: translateY(10px); margin-right: 17px;"></logo-white-icon> -->
          <img src="../assets/logo_white.png" class="logo-img"/>
          <span>{{$t('system.title')}}</span>
          <version/>
        </span>
      </div>
      <right-content />
    </a-layout-header>
    <a-layout :hasSider="true">
      <a-layout-sider theme="light" :trigger="null" v-model="collapsed" collapsible defaultCollapsed collapsedWidth="80" :width="isMobile?80:255">
        <div class="menus">
          <div class="menu-left">
            <div v-show="!menu.hidden" :class="{'menu-item': true,'menu-active': menuPath==menu.path}" v-for="(menu, index) in menus" :key="index">
              <div v-if="menu.isFrame !== 1" @click="onClickMenu(menu)">
                <icon-font style="font-size: 24px;" :type="menuPath==menu.path ? `${menu.meta.icon}_active` :menu.meta.icon" />
                <div class="title">{{ menu.meta.title }}</div>
              </div>
              <a v-if="menu.isFrame === 1" :href="menu.path || 'javascript:;'" target="_blank" class="external-link">
                <icon-font style="font-size: 24px;" :type="menuPath==menu.path ? `${menu.meta.icon}_active` :menu.meta.icon" />
                <div class="title">{{ menu.meta.title }}</div>
              </a>
            </div>

          </div>
          <div v-show="!collapsed" :class="['menu-right',{mobile: isMobile},{'show-submenu':showMobileSubMenu}]">
            <div class="menu-title"> {{menu.meta.title}} </div>
            <div class="sub-menus">
              <div v-show="!secondMenu.hidden" v-for="(secondMenu, index) in menu.children" :key="index">
                <!-- 二级菜单 -->
                <div :class="{'title': !!secondMenu.children,'sub-item': !secondMenu.children,'sub-active': subMenuPath==secondMenu.path}" >
                  <div v-if="secondMenu.isFrame !== 1" @click="handelSubMenu(secondMenu)">{{secondMenu.meta.title}}</div>
                  <a v-if="secondMenu.isFrame === 1" :href="secondMenu.path || 'javascript:;'" target="_blank" class="external-link sub-menu-link">{{secondMenu.meta.title}}</a>
                </div>
                
                <!-- 三级菜单 -->
                <div 
                  :class="{'sub-item': true,'sub-active': subMenuPath==submenu.path}" 
                  v-show="!submenu.hidden" v-for="(submenu, index) in secondMenu.children" :key="index"
                  >
                  <div v-if="submenu.isFrame !== 1" @click="handelSubMenu(submenu)">{{submenu.meta.title}}</div>
                  <a v-if="submenu.isFrame === 1" :href="submenu.path || 'javascript:;'" target="_blank" class="external-link sub-menu-link">{{submenu.meta.title}}</a>
                </div>
              </div>
            </div>
          </div>
          <div v-show="menu.children && !isMobile" @click="handelCollapsed" class="trigger">
            <img :src="require(`../assets/image/${collapsed ? 'right' : 'left'}.png`)"/>
          </div>
        </div>
      </a-layout-sider>
      <a-layout-content v-if="$route.path !== '/dashboard/index'" class="layout-content" >
        <router-view />
      </a-layout-content>
      <a-layout-content v-if="$route.path === '/dashboard/index'">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapState } from "vuex";
import RightContent from "@/components/GlobalHeader/RightContent";
import { LogoWhiteIcon } from '@/core/icons'
import { isMobile } from "@/utils/util"
import Version from "@/components/GlobalHeader/Version.vue";

export default {
  name: "BasicLayout",
  components: {
    LogoWhiteIcon,
    RightContent,
    Version
  },
  data() {
    return {
      menu: {},
      collapsed: true,// 侧栏收起状态
      menuPath: '', // 选择的1级菜单路径
      subMenuPath: '', // 选择的2级菜单路径
      showMobileSubMenu: false, // 移动端默认不显示二级菜单
    };
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters,
    }),
    menus(){
      const routes = this.mainMenu.find((item) => item.path === "/")
      return (routes && routes.children) || []
    },
    isMobile(){
      return isMobile()
    }
  },
  watch:{
    '$route':function (){
      this.showMobileSubMenu= false
      this.menuVisitor()
    },
  },
  created() {
    this.menuVisitor()
  },
  mounted() {
  },
  methods: {
    backIndex(){
      this.$router.push({path:'/dashboard/index'})
    },

    // 菜单回显
    menuVisitor(){
      let parentMenu = this.$route.meta.parent
      if(!parentMenu){// 域名根路径访问 如：http://192.168.50.91:8000/
        this.menuState(this.menus[0])
      }else if(parentMenu.name == 'index'){// 一级菜单访问 如：http://192.168.50.91:8000/dashboard/index
        this.menuState(this.$route)
      }else if(parentMenu.meta.parent.name == 'index'){// 二级菜单访问 http://192.168.50.91:8000/authority/index
        this.menuState(parentMenu, this.$route)
      }else{
        this.menuState(parentMenu.meta.parent, this.$route)// 三级菜单访问 如：http://192.168.50.91:8000/product/product/index
      }
    },

    menuState(menu, submenu){
      this.menu = menu
      this.menuPath = this.menu.path
      if(this.menu.children){
        this.collapsed = false
        const submenuValue = submenu??this.menu.children[0]
        this.subMenuPath = submenuValue.children ? submenuValue.children[0].path : submenuValue.path
      }else{
        this.collapsed = true
        this.subMenuPath = ''
      }
    },


    onClickMenu(menu, submenu) {
      
      if(this.isMobile){
        // 移动端点击一级菜单不自动跳转
        if(menu.children){
          
          if(menu.path == this.menu.path){
            this.showMobileSubMenu=!this.showMobileSubMenu
          } else {
            this.showMobileSubMenu=true
          }
          this.menu = menu
          this.collapsed = false
          
        }else {
          this.menu = menu
          this.menuPath = this.menu.path
          this.collapsed = true
          this.$router.push({path: menu.path})
          this.showMobileSubMenu=false
        }
      } else {
        this.menu = menu
        this.menuPath = this.menu.path
        if(this.menu.children){
          this.collapsed = false
          this.handelSubMenu(submenu??this.menu.children[0])
        }else{
          this.collapsed = true
          this.$router.push({path: menu.path})
        }
      }
      
      
    },
    handelCollapsed(){
      this.collapsed = !this.collapsed
    },
    handelSubMenu(submenu){
      if(submenu.children){
        this.subMenuPath = submenu.children.filter(item=>!item.hidden)?.shift()?.path || ''
        this.$router.push({path: this.subMenuPath ?? this.subMenuPath.path})
      }else{
        this.subMenuPath = submenu.path
        this.$router.push({path: submenu.path})
          
      }
    }
  },
};
</script>

<style lang="less" scoped>
@import "../global.less";
.basicLayout{
  height: 100%;
  .logo-img{
    margin: -1px 20px 0 0;
    width: 44px;
    height: 44px;
  }
  .layout-header{
    display: flex;
    justify-content: space-between;
    background: linear-gradient(118deg, #0B5CFF 0%, #73BAFF 100%);
    box-shadow: 0px 4px 8px 0px rgba(166, 196, 255, 0.4);
    color:#fff;
    font-size: 20px;
    padding: 0 24px 0 16px
  }
  .layout-content{
    width: 100%;
    
    background: #FFFFFF;
    box-shadow: 0px 0px 6px 0px rgba(166, 196, 255, 0.22);
    border-radius: 4px;
    &.margin20{
      margin: 20px;
    }
  }
  .ant-layout-sider{
    transition: width 0.2s;
  }
  .ant-layout-sider-light{
    z-index: 999;
    box-shadow: 2px 0px 9px 0px rgba(166, 196, 255, 0.22);
  }
  .menus{
    width: 100%;
    min-width: 100px;
    display: flex;
    position: relative;
    
    .menu-left{
      width: 80px;
      height: calc(100vh - 64px);
      background: @aithings-search-bg-color;
      box-shadow: 2px 0px 9px 0px rgba(166, 196, 255, 0.22);
      .menu-item{
        .aaaaa{
          color: red;
        }
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 70px;
        text-align: center;
        color: @aithings-text-color-black;
        cursor: pointer;
        .title{
          font-size: 13px;
          font-weight: 400;
          line-height: 18px;
          margin-top: 5px;
        }
        &:hover{
          background: #FFFFFF;  
        }
      }
      .menu-active{
        font-weight: 600;
        color: @primary-color;
        background: #FFFFFF;
      }
    }
    .menu-right{
      position: relative;
      width: 175px;
      height: calc(100vh - 64px);
      background: #FFFFFF;
      box-shadow: 2px 0px 9px 0px rgba(166, 196, 255, 0.22);
      &.mobile{
        position: absolute;
        left: 80px;
        top: 0;
        display: none;

      }
      &.show-submenu{
        display: block;
      }
      .menu-title{
        height: 52px;
        padding: 20px 0 10px 16px;
        box-sizing: border-box;
        border-bottom: 1px solid @aithings-border-color;
        font-size: 16px;
        font-weight: 600;
        color: @aithings-text-color-black;
        line-height: 22px;
      }
      .sub-menus{
        padding: 8px 10px;
        .title{
          font-size: 14px;
          font-weight: 600;
          color: @aithings-text-color-gray;
          line-height: 22px;
          padding: 10px 5px;
        }
        .sub-item{
          height: 36px;
          color: @aithings-text-color-gray;
          font-size: 14px;
          font-weight: 400;
          padding: 7px 5px;
          &:hover{
            color: @primary-color;
            cursor: pointer;
          }
        }
        .sub-active{
          background: @aithings-search-bg-color;
          font-size: 14px;
          color: @primary-color;
        }
      }
    }
    .trigger{
      display: flex;
      justify-content: center;
      align-items: center;
      position:absolute;
      top: calc(50vh - 60px);
      left: 100%;
      width: 14px;
      height: 60px;
      border: 9px solid transparent;
      border-left: 14px solid @aithings-border-color;
      cursor: pointer;
      img {
        width: 8px;
        height: 13px;
        margin-left: -14px;
      }
      &:hover{
        border-left-color: #CADCF8;
      }
    }
  }
  .external-link{
    display: block;
    color: @aithings-text-color-black;
    
  }
  .sub-menu-link{
    &:hover{
      color: @primary-color;
    }
  }
}
</style>
