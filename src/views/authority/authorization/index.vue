<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('authorization.title')" @back="back">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <p>{{$t('authorization.for.account')}}：{{userName}} {{$t('authorization.allocation')}}</p>
        <h3>{{$t('authorization.choose.role.type')}}</h3>
        <p class="tips">{{$t('authorization.tips')}}</p>
        <h4>{{$t('authorization.default.role.type')}}</h4>
        <a-radio-group v-model="selectedRole" @change="changeRole">
          <a-radio-button v-for="item in roleList" :key="item.roleId" :value="item.roleId">
            {{item.roleName}}
          </a-radio-button>
        </a-radio-group>
        <h4>{{$t('authorization.customRole')}}</h4>
        <a-radio-group v-model="selectedRole" @change="changeRole">
          <a-radio-button v-for="item in customRoleList" :key="item.roleId" :value="item.roleId">
            {{item.roleName}}
            <a-icon type="close" @click="deleteRole(item.roleId)"/>
          </a-radio-button>
          <a-button icon="plus" class="add-role" @click="addCustomRole">{{$t('authorization.customRole')}}</a-button>
        </a-radio-group>
        <p class="valid-text" v-if="showValidText">{{$t('authorization.choose.role.type')}}</p>
        <section class="menu-tree">
          <section class="flex y-axis-center title">
            <div> {{$t('authorization.menu')}} </div>
            <a-button v-if="showEidt" type="link" @click="editAuthorization()">{{$t('authorization.edit')}}</a-button>
          </section>
          
          <section>
            <a-row>
              <a-col v-for="(item,index) in treeData" :key="index" :md="6" :sm="24">
                <a-tree
                  checkable
                  disabled
                  checkStrictly
                  defaultExpandAll
                  auto-expand-parent
                  :tree-data="[item]"
                  :checkedKeys="treeCheckedKeys[index]"
                  :replaceFields="{key:'id'}"
                >
                  <i slot="switcherIcon">
                    <arrow-down-icon></arrow-down-icon>
                  </i>
                </a-tree>
              </a-col>
            </a-row>
          </section>
        </section>
        <section class="action-wrap">
          <a-space :size="20">
            <a-button type="primary" @click="handleSave">{{$t('public.save')}}</a-button>
            <a-button @click="handleCancel">{{$t('public.cancel')}}</a-button>
          </a-space>
        </section>
      </section>
    </a-page-header>
  </section>
</template>
    
<script>
import {ArrowDownIcon} from '@/core/icons'
import { deleteRole, getRoleList, getRoleDetails,saveRole} from "@/api/authority"
import { mapGetters } from "vuex";
import { filterTreeData } from "@/utils/util"
  
  export default ({
    name:"Authorization",
    components:{
      ArrowDownIcon
    },
    data(){
      return {
        accountDetails:{},
        selectedRole:'',
        showValidText:false,
        roleList:[
        ],
        customRoleList:[
        ],
        userName:'',
        treeCheckedKeys: []
      }
    },
    computed:{
      showEidt(){
        const role = [...this.roleList, ...this.customRoleList].filter(item => item.roleId == this.selectedRole)
        return role.length && role.pop().isDefault == 2
      },
      ...mapGetters(["roles"]),
      treeData(){
        return this.filterMenu(this.roles)
      }
    },
    mounted(){
      this.selectedRole = this.$route.query.roleId || ''
      this.userName = this.$route.query.userName || ''
      this.getRoleList()
      this.changeRole()
    },
    methods:{
      // 获取角色列表
      async getRoleList(){
        const res = await getRoleList()
        if(res.code !== 0) return
        const list = res.data
        if(list.length > 0){
          // 1 默认类型, 2 自定义类型
          this.roleList = list.filter(item => item.isDefault == 1)
          this.customRoleList = list.filter(item => item.isDefault == 2)
        }
      },

      // 选中角色
      async changeRole(){
        if(this.selectedRole){
          const res = await getRoleDetails({id:this.selectedRole})
          if (res.code !==0) return
          if (!res.data.menuIds || res.data.menuIds.length === 0) return
          this.treeCheckedKeys = filterTreeData(this.treeData,res.data.menuIds,'id').map(item=>item.flat(2)) || []
        }
      },

      // 保存角色
      async handleSave(){
        this.showValidText = this.selectedRole ? false : true
        if(this.showValidText) return
        const res = await saveRole({roleId:this.selectedRole,userName:this.userName})
        if(res.code !==0 ) return
        this.$router.push({path:"/authority/index"})
      },

      // 删除角色
      deleteRole(id){
        this.$WarningModal(this, this.$t("authorization.role.delete.warning"),'',this.$t('public.delete')).then(async() => {
          const res = await deleteRole({id})
          if (res.code !== 0) return
          this.getRoleList()
        })
      },

      // 取消
      handleCancel(){
        this.$router.push({path:"/authority/index"})
      },

      // 自定义角色
      addCustomRole(){
        this.$router.push({path:"/authority/customRole/index",query:{userName:this.userName}})
      },

      // 编辑权限
      editAuthorization(){
        this.$router.push({path:"/authority/customRole/index",query:{roleId:this.selectedRole,userName:this.userName}})
      },

      // 过滤不可见菜单
      filterMenu(menus){
        let visibleMenus = []
        menus.forEach(menu => {
          if(menu.visible == 1){
            if(menu.children){
              menu.children = this.filterMenu(menu.children)
            }
            visibleMenus.push(menu)
          }
        });
        return visibleMenus
      },

      back(){
        this.$router.push({path:'/authority/index'})
      }
    }
  })
</script>
  
<style lang="less" scoped>
  @import "../../../global.less";
  /deep/.ant-page-header-heading{
    display: flex;
    align-items: center;
    padding: 16px 20px !important;
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }
  h3{
    padding: 18px 0 15px;
  }
  h4{
    padding: 15px 0;
  }
  .tips{
    color: @aithings-warning-color;
  }
  /deep/label.ant-radio-button-wrapper,.add-role{
    margin-right: 20px;
    border: 1px solid @aithings-text-tips-color;
    border-radius: 18px;
    color: @aithings-text-color-gray;
  }
  .add-role{
    border: 1px dashed @aithings-text-tips-color;
  }
  /deep/.ant-radio-button-wrapper:not(:first-child)::before{
    width: 0;
  }
  /deep/.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
    border: 1px solid @primary-color;
    color: @primary-color;
  }
  .anticon-close{
    margin-left: 10px;
    font-size: 12px;
    line-height: 14px;
  }
  /deep/.anticon-plus{
    width: 15px;
  }
  .menu-tree{
    max-width: 1000px;
    margin-top: 30px;
    .title{
      padding: 0 20px;
      background: @aithings-search-bg-color;
      line-height: 48px;
      font-weight: 600;
      border: 1px solid @aithings-border-color;
    }
    /deep/ .ant-tree{
      border-left: 1px solid @aithings-border-color;
      border-right: 1px solid @aithings-border-color;
      border-bottom: 1px solid @aithings-border-color;
      li{
        padding: 10px 20px;
       
        span.ant-tree-switcher{
          float: right;
        }
      }
      li+ li{
        border-top: 1px solid @aithings-border-color;
      }
    } 
  }
  .action-wrap{
    margin-top: 40px;
    /deep/ .ant-btn{
      padding: 0 28px;
      border: 1px solid @aithings-text-tips-color;
      color: @aithings-text-tips-color;
    }
    /deep/ .ant-btn-primary{
      background: @primary-color;
      border: 1px solid @primary-color;
      color: #fff;
    }
  }
  .valid-text{
    padding-top: 20px;
    color: @error-color;
  }
</style>