<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('customRole.title')" @back="handleCancel">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <h4>{{$t('customRole.title.type')}}</h4>
        <a-row>
          <a-col :md="8" :sm="24">
            <a-input :placeholder="$t('customRole.placeholder.roleName')" :maxLength="50" v-model="roleName"/>
          </a-col>
        </a-row>
        <p class="valid-text" v-if="showValidText">{{$t('customRole.placeholder.roleName')}}</p>
        <h4>{{$t('customRole.menus.title')}}</h4>
        <section class="menu-tree">
          <a-row :gutter="20">
            <a-col v-for="(item,index) in treeData" :key="index" :md="6" :sm="24">
              <a-tree
                v-model="checkedKeys[index]"
                checkable
                checkStrictly
                defaultExpandAll
                :tree-data="[item]"
                :replaceFields="{key:'id'}"
                @check="treeNodeCheck"
              >
                <i slot="switcherIcon">
                  <arrow-down-icon></arrow-down-icon>
                </i>
              </a-tree>
            </a-col>
          </a-row>

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
import { addRole, editRole, getRoleDetails } from "@/api/authority"
import { mapGetters } from "vuex";
import { filterTreeData } from "@/utils/util"
  export default ({
    name:"CustomRole",
    components:{
      ArrowDownIcon
    },
    data(){
      return {
        roleName:'',
        checkedKeys: [],
        showValidText:false,
        roleId:'',
        userName:'',
        treeData: []
      }
    },
    computed:{
      ...mapGetters(["roles"]),
    },
    mounted(){
      this.roleId = this.$route.query.roleId || ''
      this.userName = this.$route.query.userName || ''
      this.treeData = this.filterMenu(this.roles)
      // 如果有id获取角色详情
      if(this.roleId){
        this.getRoleDetails()
      }
    },
    methods:{
      // 获取角色详情
      async getRoleDetails(){
        const res = await getRoleDetails({id:this.roleId})
        if (res.code !==0) return
        this.roleName = res.data.roleName
        if (!res.data.menuIds || res.data.menuIds.length === 0) return
        this.checkedKeys = filterTreeData(this.treeData,res.data.menuIds,'id').map(item=>item.flat(2)) || []
      },

      // 保存角色
      async handleSave(){
        this.showValidText = this.roleName ? false : true
        if(this.showValidText) return
        // 默认已选择概况菜单，其他菜单选填
        //保存数据
        let res = null
        let checkedKeys = this.checkedKeys.map((item=>item.checked??item))
        const menuIds = [...new Set(checkedKeys.flat())].filter(item=>item!==null) ?? []
        if(this.roleId){
          res = await editRole({ roleName:this.roleName, menuIds, id:this.roleId})
        } else {
          res = await addRole({ roleName:this.roleName, menuIds})
        }
        if( res.code !==0) return
        this.$router.push({path:"/authority/authorization/index",query:{userName: this.userName, roleId:this.roleId || ''}})
      },

      // 取消
      handleCancel(){
        this.$router.push({path:"/authority/authorization/index",query:{userName: this.userName, roleId:this.roleId || ''}})
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

      // 子集菜单
      filterReleMenus(node, type){
        let releMenus = []
        if(type == 1 && node.$parent.eventKey){// 添加父节点
          releMenus = [node.eventKey, node.$parent.eventKey]
          releMenus = [...releMenus, ...this.filterReleMenus(node.$parent, 1)]
        }else if(type == 2 && node){// 添加子节点
          releMenus.push(node.id)

          node.children.forEach((children)=>{
            releMenus = [...releMenus, ...this.filterReleMenus(children, 2)]
          })
          
        }
        return releMenus
      },

      // 取消节点逻辑
      deleteReleMenus(checkedKeys, node, type){
        let releMenus = [...checkedKeys]
        if(type == 1 && node.$parent.eventKey){// 取消选择父节点
          let children = node.$parent.getNodeChildren()
          let include = false
          children.forEach(menu=>{
            if(checkedKeys.indexOf(menu.key) != -1){
              include = true
            }
          })
          if(!include){
            let index = releMenus.indexOf(node.$parent.eventKey)
            if(index != -1){
              releMenus.splice(index, 1)
            }
            releMenus = this.deleteReleMenus(releMenus, node.$parent, 1)
          }
        }else if(type == 2 && node){// 取消选择子节点
          node.children.forEach(menu=>{
            let index = releMenus.indexOf(menu.id)
            if(index != -1){
              releMenus.splice(index, 1)
            }
            releMenus = this.deleteReleMenus(releMenus, menu, 2)
          })
        }
        return releMenus
      },

      // 点击复选框触发，自定义逻辑：勾选节点后，父节点和第一个子节点需要勾选；取消选择时子节点要全部取消，父节点要根据是否还存在子节点取消
      treeNodeCheck(checkedKeys, e){
        if(e.checked){
          let parentMenus = this.filterReleMenus(e.node, 1)// 添加父级菜单
          parentMenus = [...checkedKeys.checked, ...parentMenus]
          let childrens = e.node.getNodeChildren()
          let subMenus = []
          if(childrens.length){
            childrens.forEach((children)=>{
              subMenus = [...subMenus, ...this.filterReleMenus(children.data.props.dataRef, 2)]// 添加子级菜单
            })
          }
          console.info(subMenus);
          let allMenus = [...parentMenus, ...subMenus]
          checkedKeys.checked = [...new Set(allMenus)]
        }else{
          let menus = this.deleteReleMenus(checkedKeys.checked, e.node, 1)// 删除父级菜单后的菜单
          menus = this.deleteReleMenus(menus, e.node.dataRef, 2)// 删除子级菜单后的菜单
          checkedKeys.checked = [...new Set(menus)]
        }
      }
    }
  })
</script>
  
<style lang="less" scoped>
  @import "../../../global.less";
  /deep/.ant-page-header-heading{
    padding: 16px 20px !important;
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }
  h4{
    padding: 15px 0;
  }
  .menu-tree{
    max-width: 1000px;
    .title{
      padding: 0 20px;
      background: @aithings-search-bg-color;
      line-height: 48px;
      font-weight: 600;
      color: @primary-color;
      border: 1px solid @aithings-border-color;
    }
    /deep/ .ant-tree{
      border: 1px solid @aithings-border-color;
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
  .ant-input, .ant-select-selection,.ant-input-number{
    border-color: @aithings-border-color;
    color: @aithings-text-color-black;
  }
  .ant-input::placeholder, .ant-select-selection__placeholder,.ant-select-arrow, .ant-calendar-range-picker-input::placeholder,.ant-input-number-input::placeholder{
    color: @aithings-text-tips-color;
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