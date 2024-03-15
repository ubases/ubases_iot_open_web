<template>
  <a-dropdown>
    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
      {{defaultSpace.companyName || $t('spaceDropdown.my.space')}} <a-icon type="down" />
    </a>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
         <a-menu-item v-for="item in tenantList" :key="item.tenantId">
           <section @click="selectSpace(item.tenantId)" class="space-name-wrap flex y-axis-center x-space-between">
              <div>
                <div class="flex y-axis-center">
                  <p :class="['space-name',{'active':item.tenantId == defaultSpace.tenantId}]">{{item.companyName || $t('spaceDropdown.my.space')}}</p>
                  <p v-if="item.userType === 1" class="default-icon">{{$t('spaceDropdown.default.space')}}</p>
                </div>
                <p class="tenantId">{{ $t('spaceDropdown.tenantId') }}：{{ item.tenantId }}</p>
                
              </div>
              <finished-icon  v-if="item.tenantId == defaultSpace.tenantId"/>
           </section>
         </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script>
import { mapGetters } from "vuex";
import {FinishedIcon} from '@/core/icons'

export default {
  name: "SpaceDropdown",
  props: {},
  components:{
    FinishedIcon,
  },
  computed: {
    ...mapGetters(["tenantList","defaultSpace","roles","addRouters"]),
  },
  methods: {
    // 选中空间
    async selectSpace(tenantId){
      if(tenantId == this.defaultSpace.tenantId) {
        this.$router.replace({path:"/dashboard/index"})
        return
      }
      await this.$store.dispatch("ChangeSpace",tenantId)
      this.$store.dispatch("ClearRoles")
      this.$router.replace({path: '/refresh'})
    },

  },
};
</script>

<style lang="less" scoped>
  @import "../../global.less";
  @import "../../utils/utils.less";
  .ant-dropdown-link{
    padding: 24px 16px;
    
    font-size: 14px;
    color: #fff;
    &:hover{
      background: rgba(0, 0, 0, 0.04);
    }

  }
  .ant-dropdown-content{
    width: 240px;
  }
  .ant-dropdown-menu-item {
    padding: 0 15px;
    &:hover{
      background: @aithings-search-bg-color;
      border-radius: 2px;
    }
  }
  .space-name-wrap{
    padding: 13px 0;
    color: @aithings-text-color-gray;
  }
  .ant-dropdown-menu-item +.ant-dropdown-menu-item{
    .space-name-wrap{
      border-top: 1px solid @aithings-search-bg-color;
    }
    
  }
  .space-name{
    max-width: 100px;
    font-weight: 600;
    .textOverflow();
  }
  .active{
    color: @primary-color;
  }

  .default-icon{
    margin-left: 10px;
    padding: 0 8px;
    height: 22px;
    border: 1px solid @primary-color;
    font-size: 10px;
    line-height: 20px;
    color: @primary-color;
    border-radius: 10px;
  }
  .tenantId{
    font-size: 12px;
    color: @aithings-text-tips-color;
  }

// }
</style>
