<template>
  <section class="config-content flex x-space-between">
    <section class="config-wrap">
      <section class="flex y-axis-center x-space-between">
        <h4 class="config-title">{{$t('appFooterBar.title')}}</h4>
        <a-button class="back-default" :disabled="editDisabled" @click="resetDefault">{{$t('public.restore.default')}}</a-button>
      </section>
      <!-- 文字色 -->
      <p class="config-tips">{{$t('appFooterBar.tips.1')}}</p>
      <h4 class="title">{{$t('appFooterBar.word.color')}}</h4>
      <section class="text-color flex y-axis-center">
        <p class="label">{{$t('appFooterBar.word.color.selected')}}</p>
        <color-picker :color="selectedColor" :size="{width:32,height:32}" :disabled="editDisabled" @sumitColor="handleSelectedColor"/>
      </section>
      <section class="text-color flex y-axis-center">
        <p class="label">{{$t('appFooterBar.word.color.default')}}</p>
        <color-picker :color="defaultColor" :size="{width:32,height:32}" :disabled="editDisabled" @sumitColor="handleDefaultColor"/>
      </section>
      <!-- /文字色 -->
      <!-- 默认菜单 -->
      <h4 class="title">{{$t('appFooterBar.default.menu')}}</h4>
      <p class="config-tips">{{$t('appFooterBar.default.menu.tips')}}</p>
      <a-table
        size="small"
        rowKey="position"
        :data-source="defaultDataList"
        :columns="defaultColumnList"
        :loading="loading"
        :pagination="false"
      >
        <template v-slot:defImage="record">
          <a-upload
            name="file"
            :disabled="editDisabled"
            :multiple="false"
            :showUploadList="false"
            accept="image/png"
            :beforeUpload="beforeUpload"
            :customRequest="e => customRequest(e,'defImage',record)"
          >
            <section class="image-wrap">
              <img v-if="record.defImage" :src="record.defImage" class="image"/>
            </section>
          </a-upload>
        </template>
        <template v-slot:selImage="record">
          <a-upload
            name="file"
            :disabled="editDisabled"
            :multiple="false"
            :showUploadList="false"
            accept="image/png"
            :beforeUpload="beforeUpload"
            :customRequest="e => customRequest(e,'selImage',record)"
          >
            <section class="image-wrap">
              <img v-if="record.selImage" :src="record.selImage" class="image"/>
            </section>
          </a-upload>
        </template>
        <template slot="required" slot-scope="required">
          {{$DictName('menu_icon_required',required)}}
        </template>
      </a-table>
      <!-- /默认菜单 -->
      <!-- 自定义菜单 -->
      <h4 class="title">{{$t('appFooterBar.custom.menu')}}</h4>
      <p class="config-tips">{{$t('appFooterBar.custom.menu.tips')}}</p>
      <div class="table-operator">
        <a-button  type="primary" :disabled="customDataList.length >= 2 || editDisabled" @click="handleAdd" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t('appFooterBar.custom.menu.add')}}
        </a-button>
      </div>
      <a-table
        size="small"
        rowKey="position"
        :data-source="customDataList"
        :columns="customColumnList"
        :loading="loading"
        :pagination="false"
      >
        <template v-slot:defImage="record">
          <a-spin :spinning="imgLoading1" wrapperClassName="spin-ele">
            <a-upload
              name="file"
              :disabled="editDisabled"
              :multiple="false"
              :showUploadList="false"
              accept="image/png"
              :beforeUpload="beforeUpload"
              :customRequest="e => customRequest(e,'defImage',record,1)"
            >
              <section class="image-wrap">
                <img v-if="record.defImage" :src="record.defImage" class="image"/>
              </section>
            </a-upload>
          </a-spin>
        </template>
        <template v-slot:selImage="record">
          <a-spin :spinning="imgLoading2" wrapperClassName="spin-ele">
            <a-upload
              name="file"
              :disabled="editDisabled"
              :multiple="false"
              :showUploadList="false"
              accept="image/png"
              :beforeUpload="beforeUpload"
              :customRequest="e => customRequest(e,'selImage',record,2)"
            >
              <section class="image-wrap">
                <img v-if="record.selImage" :src="record.selImage" class="image"/>
              </section>
            </a-upload>
          </a-spin>
        </template>
        <template v-slot:action="record">
          <a-button :disabled="editDisabled" type="link" size="small" @click="editIcon(record.menuId)">{{$t("public.edit")}}</a-button>
          <a-divider type="vertical" />
          <a-button :disabled="editDisabled" type="link" size="small" @click="deleteIcon(record.menuId)">{{$t("public.delete")}}</a-button>
        </template>
      </a-table>
      <!-- /自定义菜单 -->
    </section>
    <!-- 效果预览 -->
    <section class="preview-wrap">
       <h4 class="config-title">{{$t('public.previewResults')}}</h4>
       <section class="preview-phone-wrap iphone-xs-max-shell">
         <section class="phone-bg">
           <section class="flex y-axis-center footer-menu">
             <div class="tap-pointer menu" v-for="(item,index) in menuList" :key="index" @click="activeMenu = item.position">
               <div class="icon" :style="{ background: `url(${activeMenu == item.position ? item.selImage:item.defImage}) center/100% no-repeat`}"></div>
                <p class="name" v-text="item.name" :style="{color:activeMenu == item.position ? selectedColor: defaultColor}"></p>
             </div>
           </section>
         </section>
       </section>
    </section>
    <!-- /效果预览 -->
    <edit-custom-menu :visible="editVisible" :data="editData" :sortList="sortList" :id="datas.id" @sumit="sumitEdit" @cancel="cancelEdit"/>
  </section>
</template>

<script>
import ColorPicker from "../component/ColorPicker.vue"
import EditCustomMenu  from "../component/EditCustomMenu.vue"
import {beforeUpload } from "@/utils/validate"
import { uploadFile } from "@/api/common"
import { getAppMenu, updateFontColor,editCustomMenu,deleteCustomMenu, resetDefault } from "@/api/appExploit"

export default {
  props:{
    appId:{ type:String, default:''},
    version:{ type:String, default:''},
    editDisabled:{ type:Boolean, default:false},
  },
  components:{
    ColorPicker,
    EditCustomMenu
  },
  data (){
    return {
      datas:{},
      selectedColor:"#3B7CFF",
      defaultColor:"#343A40",
      defaultColumnList:[
        { title: this.$t('appFooterBar.defaultColumn.position'), dataIndex:"position"},
        { title: this.$t('appFooterBar.defaultColumn.name'), dataIndex:"name"},
        { title: this.$t('appFooterBar.defaultColumn.defImage'), key:"defImage", scopedSlots: { customRender: 'defImage' }},
        { title: this.$t('appFooterBar.defaultColumn.selImage'), key:"selImage", scopedSlots: { customRender: 'selImage' }},
        { title: this.$t('appFooterBar.defaultColumn.required'), dataIndex:"required", scopedSlots: { customRender: 'required' }}
      ],
      defaultDataList:[],
      customColumnList:[
        { title: this.$t('appFooterBar.defaultColumn.position'), dataIndex:"position"},
        { title: this.$t('appFooterBar.defaultColumn.name'), dataIndex:"name"},
        { title: this.$t('appFooterBar.defaultColumn.defImage'), key:"defImage", scopedSlots: { customRender: 'defImage' }},
        { title: this.$t('appFooterBar.defaultColumn.selImage'), key:"selImage", scopedSlots: { customRender: 'selImage' }},
        { title: this.$t('public.action'), key:"action", scopedSlots: { customRender: 'action' }}
      ],
      customDataList:[],
      menuList:[],
      editVisible:false,
      editData:{},
      activeMenu:null,
      loading:false,
      sortList:[],
      imgLoading1: false,
      imgLoading2: false
    }
  },
  mounted(){
    this.getAppMenu()
  },
  methods:{
    // 获取数据
    async getAppMenu(){
      const res = await getAppMenu({appId:this.appId, version:this.version})
      if(res.code !==0) return
      this.datas = res.data
      this.selectedColor = res.data.selColor
      this.defaultColor = res.data.defColor
      this.menuList = res.data.menuList.sort(this.sortData)
      this.defaultDataList = this.menuList.filter(item=>item.position == 1 || item.position == 2 || item.position == 5).sort(this.sortData)
      this.customDataList = this.menuList.filter(item=>item.position == 3 || item.position == 4).sort(this.sortData)
    },

    // 恢复默认
    async resetDefault(){
      const res = await resetDefault({appId:this.appId, version:this.version, defType:1, id:this.datas.id})
      if (res.code !== 0) return
      this.$message.success(this.$t('appFooterBar.restore.default.succeed'))
      this.getAppMenu()
    },

    // 选中时候文字颜色
    async handleSelectedColor(color){
      const selColor = typeof(color) === 'string' ? color : color.hex
      const res = await updateFontColor({ id: this.datas.id ,selColor, defColor: this.datas.defColor})
      if( res.code !==0 ) return
      this.getAppMenu()
    },

    // 默认时候文字颜色
    async handleDefaultColor(color){
      const defColor = typeof(color) === 'string' ? color : color.hex
      const res = await updateFontColor({id:this.datas.id ,selColor:this.datas.selColor, defColor: defColor})
      if( res.code !==0 ) return
      this.getAppMenu()
    },

    // 添加自定义菜单
    handleAdd(){
      this.editData = {}
      this.sortList = this.getSortList(this.customDataList)
      this.editVisible = true
    },
    
    // 编辑自定义菜单
    editIcon(menuId){
      this.editData = {...this.customDataList.filter(item=>item.menuId == menuId).pop()}
      const list = this.customDataList.filter(item=>item.menuId != menuId)
      this.sortList = this.getSortList(list)
      this.editVisible = true
    },

    //获取位置列表
    getSortList(list){
      return [3,4].filter((num)=>{
        return !list.some((item)=> item.position == num )
      }).map((item)=>{
        return { label:item, value:item }
      })  
    },

    // 确认保存自定义菜单
    async sumitEdit(){
      this.editVisible = false
      this.getAppMenu()
    },

    cancelEdit(){
      this.editVisible = false
    },

    // 删除自定义菜单
    deleteIcon(id){
      this.$WarningModal(this, this.$t('appFooterBar.isConfirm.delete')).then(async () => {
        const res = await deleteCustomMenu({menuId:id, id:this.datas.id})
        if(res.code!==0)return
        this.getAppMenu()
      });
    },

    beforeUpload(file){
      if (file.type !== 'image/png') {
        this.$message.warning(this.$t('app.config.img.type'))
        return false
      } 
      return beforeUpload(this,file,false,72,72)
    },

    // 图片上传
    async customRequest(fileData,type,data,loading){
      const file = fileData.file
      if(loading === 1){
        this.imgLoading1 = true
      } else if(loading === 2) {
        this.imgLoading2 = true
      }
      const res = await uploadFile(file,'app')
      if(loading === 1){
        this.imgLoading1 = false
      } else if(loading === 2) {
        this.imgLoading2 = false
      }
      if (res.code !== 0) return
      data[type] = res.data.fullPath
      const res1 = await editCustomMenu({...data},this.datas.id)
      if(res1.code !==0 )return
      this.$message.success(this.$t('public.uploadImg.succeed'));
      this.getAppMenu()
    },


    // 排序
    sortData(a, b) {
      return a.position - b.position
    },
  }

}
</script>

<style  lang="less" scoped>
@import "../../../../../global.less";
@import "./common.less";

.text-color{
  padding-top: 5px;
  .label{
    padding-right: 20px;
    color: @aithings-text-color-gray;
  }
}
.text-color+.text-color{
  margin-top: 15px;
}
.title{
  padding: 31px 0 10px;
}
.image-wrap{
  position: relative;
  width: 36px;
  height: 36px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid @aithings-color-BDBDBD;
  .image{
    width: 100%;
    height: 100%;
  }
  &:hover{
    &::after{
      content: '';
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.4) url("../../../../../assets/icons/upload_white_24.svg") center no-repeat;
      border-radius: 3px;
    }
  }
}
/deep/.ant-btn{
  &:disabled{
    opacity: 0.4;
  }
}
/deep/.ant-btn-link{
  &:disabled{
    opacity: 1;
  }
}
.grean-button:disabled{
  color: #fff;
}

.preview-phone-wrap{
  margin-top: 18px;
  .phone-bg{
    position: relative;
    background: @aithings-search-bg-color;
  }
  .footer-menu{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 2px 0;
    background: #fff;
    .menu{
      flex: 1;
      text-align: center;
      .icon{
        margin-top: 2px;
        width: 12px;
        height: 12px;
        margin: 0 auto;
      }
      .name{
        padding-top: 4px;
        line-height: 8px;
        font-size: 12px;
        zoom: 0.5;
      }
    }
  }
}

</style>