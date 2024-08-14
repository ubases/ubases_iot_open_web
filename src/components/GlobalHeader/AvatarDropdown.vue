<template>
  <a-dropdown v-if="$store.getters.userInfo" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar
        size="small"
        :src="`${$store.getters.avatar}` || require('../../assets/image/avatar.png')"
        class="antd-pro-global-header-index-avatar"
      />
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <template>
          <a-menu-item key="account-number" class="user-name">
            <section class="name-wrap">{{userInfo.userName || ''}}</section>
          </a-menu-item>
          <a-menu-item v-if="$store.getters.userInfo.userType == 1" key="settings" @click="handleToSettings">
            <section class="name-wrap">{{$t('avatarDropdown.account.settings')}}</section>
          </a-menu-item>
          <a-menu-item key="logout" @click="handleLogout">
            <section class="name-wrap">{{$t('avatarDropdown.logout')}}</section>
          </a-menu-item>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>

import { mapGetters } from "vuex";
import { removeAvoidLogin } from '@/utils/avoidLogin'

export default {
  name: "AvatarDropdown",

  props: {
    menu: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(["userInfo","tenantList","defaultSpace"]),
  },
  async mounted(){

  },
  methods: {
    handleToSettings() {
      this.$router.push({ path: "/account" });
    },

    // 退出登录
    handleLogout(e) {
      this.$WarningModal(this, this.$t('avatarDropdown.isLogout')).then(async () => {
        this.$store.dispatch("Logout").then(() => {
          removeAvoidLogin()
          this.$router.push({ name: "login" });
        })
      })
    },


  },
};
</script>

<style lang="less" scoped>
@import "../../global.less";
.ant-pro-global-header-index-right .ant-pro-global-header-index-action{
  padding: 0 20px;
}
/deep/ .ant-dropdown {
  margin-top: -20px
}
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }

}
.ant-dropdown-content{
  min-width: 175px;
}
.ant-dropdown-menu-item {
    padding: 0 15px;
    &:hover{
      background: @aithings-search-bg-color;
      border-radius: 2px;
    }
  }
  .name-wrap{
    padding: 13px 0;
    color: @aithings-text-color-gray;
  }
  .user-name{
    background: @aithings-search-bg-color;
    border-radius: 2px;
    .name-wrap{
      font-weight: 600;
      color: @aithings-text-color-black;
    }
  }
  .ant-dropdown-menu-item +.ant-dropdown-menu-item{
    .name-wrap{
      border-top: 1px solid @aithings-search-bg-color;
    }
  }
</style>
