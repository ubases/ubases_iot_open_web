<template>
  <section class="tree-wrap">
    <ul class="tree-list">
      <li class="tree-item-wrap" v-for="item in treeData" :key="item.id">
        <section class="flex y-axis-center tree-item tap-pointer" @click="toggleMenu(item)">
          <div :class="['icon',expandId == item.id ? 'arrow-down' : 'arrow-right']"></div>
          <div class="img-wrap"><img :src="item.dirImg || defaultFirstMenu" /></div>
          <p :class="['title',{active:activeParentId == item.id && activeMenuId == ''}]">{{item.docDirName}}</p>
          <div v-if="type== 'edit'" class="action flex">
            <edit-doc-icon @click="e=>editMenu(e,item)"/>
            <add-circle-icon @click="e=>addSubMenu(e,item)"/>
            <delete-doc-icon @click="e=>deleteMenu(e,item)"/>
          </div>
        </section>
        <ul v-if="expandId == item.id && item.children" class="sub-menu-wrap">
          <li v-for="child in item.children" :key="child.id" class="flex y-axis-center sub-menu tap-pointer" @click="toggleSubMenu(child)">
            <div class="img-wrap"><img :src="child.dirImg || defaultSecondMenu" /></div>
            <p :class="['title',{active:activeMenuId == child.id}]">{{child.docDirName}}</p>
            <div v-if="type== 'edit'" class="action flex">
              <edit-doc-icon @click="e=>editMenu(e,child)"/>
              <delete-doc-icon @click="e=>deleteMenu(e,child)"/>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <a-button v-if="type== 'edit'" class="add-menu" @click="addMenu">
      <add-circle-icon/>
      {{$t('helpCenter.catalog.add')}}
    </a-button>
    <edit-menu :id="editId" :parentId="parentIdEdit" :docId="docId" :visible="editMenuVisible" :langList="langList" @handleCancel="cancelMenu" @handleOk="sumitMenu"/>
  </section>
</template>
<script>
import{ AddCircleIcon, EditDocIcon, DeleteDocIcon} from '@/core/icons'
import EditMenu from './EditMenu.vue'
import { getDirectoryList, deleteDirectory, getPublishDirectory } from "@/api/helpCenter"
import{ arrToTree,ascendingOrder} from "@/utils/util"


export default {
  name:'Catalog',
  props:{
    docId: { type:String, default:''},
    type: { type:String, default:''},
    langList:{ type:Array, default:[]}
  },
  components:{
    AddCircleIcon,
    EditDocIcon,
    DeleteDocIcon,
    EditMenu,
  },
  data(){
    return {
      treeData:[],
      activeMenuId:'',
      activeParentId:'',
      editMenuVisible:false,
      editId:'',
      parentIdEdit:'',
      defaultFirstMenu: require(`../../../../../assets/image/first_menu.png`),
      defaultSecondMenu: require(`../../../../../assets/image/second_menu.png`),
      expandId: ''
    }
  },
  watch:{
    docId(id){
      if(!id) return
      this.getMenuList()
    },
  },
  created(){
    if(this.docId) this.getMenuList()
  },
  methods:{

    // 获取目录数组
    async getMenuList(){
      const res = this.type == 'edit' ? await getDirectoryList({lang:'zh', docId:this.docId}) : await getPublishDirectory({lang:'zh',helpId:this.docId})
      if(res.code !== 0) return
      const list = res.data.sort(ascendingOrder)
      this.treeData = arrToTree(list || [], 'id', 'parentId')
      this.$emit('getTreeData',this.treeData)
      if(!this.activeParentId){
        this.activeParentId =  this.treeData[0].id || ''
        this.$emit('menuChange', {parentId: this.activeParentId || '', dirId: this.activeMenuId})
      }
    },

    // 点击一级目录
    toggleMenu(menu){
      this.expandId = this.expandId == menu.id ? '' : menu.id
      if(this.activeParentId === menu.id && this.activeMenuId == '') return
      this.activeParentId = menu.id
      this.activeMenuId = ''
       this.$emit('menuChange',{ parentId: menu.id, dirId: ''})
    },

    // 点击二级目录
    toggleSubMenu(child){
      if(this.activeMenuId === child.id) return
      this.activeMenuId = child.id
      this.activeParentId = child.parentId
      this.$emit('menuChange',{ parentId: child.parentId, dirId: child.id})
    },

    // 添加一级目录
    addMenu(){
      this.editId = ''
      this.parentIdEdit = '0'
      this.editMenuVisible = true
    },

    // 添加二级目录
    addSubMenu(e,item){
      e.stopPropagation();
      this.editId = ''
      this.parentIdEdit = item.id
      this.editMenuVisible = true
    },

    // 编辑目录
    editMenu(e,item){
      e.stopPropagation();
      this.editId = item.id
      this.parentIdEdit = item.parentId || '0'
      this.editMenuVisible = true
    },

    // 取消编辑目录
    cancelMenu(){
      this.editMenuVisible = false
    },

    // 确认编辑目录
    sumitMenu(){
      this.editMenuVisible = false
      this.getMenuList()
    },

    // 删除目录
    deleteMenu(e,item){
      e.stopPropagation();
      if(item.children && item.children.length >0 ){
        const content = `“${item.docDirName}”`+this.$t('helpCenter.catalog.cannot.delete.content')
        this.$InfoModal(this, content,this.$t('helpCenter.catalog.cannot.delete.title'),this.$t('public.close.text'))
      } else {
        this.$ConfirmModal(this, this.$t('helpCenter.catalog.delete.content'), this.$t('helpCenter.catalog.delete.title'),this.$t('public.sumit')).then(async() => {
          const res = await deleteDirectory({id:item.id})
          if(res.code !== 0) return
          this.$message.success(this.$t('public.action.succeed'))
          this.getMenuList()
        })
      }
    },
  }
}
</script>
<style scoped lang="less">
@import "../../../../../global.less";
@import "../../../../../utils/utils.less";
ul,li{ 
  padding:0;
  margin:0;
  list-style:none
}
.tree-item-wrap{
  padding-top: 10px;
}
.tree-item{
  height: 56px;
  padding-right: 10px;
  background: @aithings-table-thread-color;
  .icon{
    border-style: solid;
  }
  .arrow-right{
    margin-left: 4px;
    border-width: 7px 0 7px 8px;
    border-color: transparent transparent transparent @aithings-text-tips-color;
  }
  .arrow-down{
    transform: translateY(4px);
    margin: 0 2px 0 2px;
    border-width: 8px 7px 0 7px;
    border-color: @aithings-text-tips-color transparent transparent transparent;
  }
  .title{
    flex: 1;
    width: 110px;
    .textOverflow();
    font-size: 15px;
    font-weight: 500;
    color: @aithings-text-color-black;
    line-height: 21px;
    &.active{
      color: @primary-color;
    }
  }
  .action{
    display: none;
    padding-top: 4px;
    svg+svg{
      margin-left: 8px;
    }
  }
}
  .img-wrap{
    width: 40px;
    height: 40px;
    margin-right: 5px;
    img{
      max-width: 40px;
      max-height: 40px;
      text-align: center;
      line-height: 40px;
    }
  }
.sub-menu-wrap{
  padding: 0 0 15px 17px;
  .sub-menu{
    margin-top: 15px;
    .title{
      width: 137px;
      color: @aithings-text-color-gray;
      line-height: 20px;
      .textOverflow();
      &.active{
        color: @primary-color;
      }
    }
    .action{
      display: none;
      padding-top: 4px;
      svg+svg{
        margin-left: 8px;
      }
    }
  }
}
  .tree-item:hover > .action, .sub-menu:hover > .action{
    display: block;
  }
.add-menu{
  margin-top: 15px;
  width: 230px;
  height: 42px;
  border-radius: 2px;
  border: 1px solid @aithings-border-color;
  font-weight: 500;
  color: @aithings-text-color-gray;
  svg{
    margin-right: 8px;
    transform: translateY(4px);
  }
}

</style>