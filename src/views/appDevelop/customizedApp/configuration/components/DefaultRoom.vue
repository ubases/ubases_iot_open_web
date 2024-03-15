<template>
  <section class="config-content flex x-space-between">
    <section class="config-wrap">
      <section class="flex y-axis-center x-space-between">
        <h4 class="config-title">{{$t('DefaultRoom.roomManage')}}</h4>
        <a-button class="back-default" :disabled="editDisabled" @click="resetDefault">{{$t('public.restore.default')}}</a-button>
      </section>
      <p class="config-tips">{{$t('DefaultRoom.tips.1')}}</p>
      <h4 class="config-title subtitle">{{$t('DefaultRoom.title')}}</h4>
      <p class="config-tips">{{$t('DefaultRoom.tips.2')}}</p>
      <div class="table-operator">
        <a-button type="primary" :disabled="roomList.length >= 20 || editDisabled" @click="handleAdd" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t('DefaultRoom.addRoom')}}
        </a-button>
      </div>
      <!-- 默认房间列表 -->
      <a-table
        size="small"
        rowKey="roomId"
        :data-source="roomList"
        :columns="columnList"
        :loading="loading"
        :pagination="false"
      >
        <template v-slot:roomImage="record">
          <a-upload
            name="file"
            :disabled="editDisabled"
            :multiple="false"
            :showUploadList="false"
            accept="image/png"
            :beforeUpload="beforeUpload"
            :customRequest="e => customRequest(e,'roomImage',record)"
          >
            <section class="image-wrap">
              <img v-if="record.roomImage" :src="record.roomImage" class="image"/>
            </section>
          </a-upload>
        </template>
        <template slot="action" slot-scope="action">
          <a-button :disabled="editDisabled" type="link" size="small" @click="handleEdit(action)">{{$t("public.edit")}}</a-button>
          <a-divider type="vertical" />
          <a-button :disabled="editDisabled" type="link" size="small" @click="handleEditLang(action)">{{$t("DefaultRoom.button.lang")}}</a-button>
          <a-divider type="vertical" />
          <a-button :disabled="editDisabled" type="link" size="small" @click="handleDelete(action)">{{$t('public.delete')}}</a-button>
        </template>
      </a-table>
      <!-- /默认房间列表 -->
      <!-- 自定义房间图标 -->
      <h4 class="config-title subtitle">{{$t('DefaultRoom.customizeRoomIcon')}}</h4>
      <p class="config-tips">{{$t('DefaultRoom.tips.3')}}</p>
      <section class="flex custom-wrap">
        <template v-for="(item,index) in customizeIconList">
          <a-upload
            name="file"
            :disabled="editDisabled"
            :multiple="false"
            :showUploadList="false"
            accept="image/png"
            :beforeUpload="beforeUpload"
            :customRequest="e=>customizeCustomRequest(e,index)"
            :key="item"
          >
            <section class="image-wrap customize-icon-wrap">
              <img :src="item" class="image"/>
              <delete-red-icon :class="['delete-icon', editDisabled ? 'disabled':'tap-pointer']" @click="deleteIcon(index)"/>
            </section>
          </a-upload>

        </template>
        <template v-if="customizeIconList.length < 15">
            <a-upload
              name="file"
              list-type="picture-card"
              class="image-uploader"
              :disabled="editDisabled"
              :multiple="false"
              :showUploadList="false"
              accept="image/png"
              :beforeUpload="beforeUpload"
              :customRequest="e=>customizeCustomRequest(e,-1)"
            >
              <div>
                <plus-icon />
                <div class="ant-upload-text">
                  {{$t('public.upload')}}
                </div>
              </div>
            </a-upload>
          </template>
      </section>
      <!-- /自定义房间图标 -->
    </section>
    <!-- 效果预览 -->
    <section class="preview-wrap">
        <h4 class="config-title">{{$t('public.previewResults')}}</h4>
        <div class="phone-radio-group">
          <a-radio-group v-model="tabType">
            <a-radio-button v-for="item in tabList" :key="item.type" :value="item.type">
              {{item.label}}
            </a-radio-button>
          </a-radio-group>
        </div>
       <section class="preview-phone-wrap iphone-xs-max-shell">
          <section :class="['phone-bg',tabType]">
            <section v-show="tabType === 'defaultRoom'" class="room-list">
              <section 
                class="room-item flex y-axis-center x-space-between" 
                v-for="item in roomList" 
                :key="item.roomId"
                @click="handleCheckedRoom(item)"
                >
                <div class="flex y-axis-center">
                  <img :src="item.roomImage" class="room-icon"/>
                  <p class="room-name" v-text="item.roomName"></p>
                </div>
                <template v-if="checkedRoom === item.roomId">
                  <radio-checked-icon class="radio-checked-icon"/>
                </template>
                <div v-else class="unchecked-circle"></div>
              </section>
              <section class="room-item add-other-room tap-pointer">
                添加其他房间
              </section>
            </section>
            <section v-show="tabType === 'selectRoomIcon'" class="icon-list flex y-axis-center">
              <section 
                :class="['icon-item',{'checked': selectedIconIndex === index}]"
                v-for="(item,index) in customizeIconList"
                :key="index"
                @click="handleSelectIcon(index)"
                >
                <img :src="item" class="room-icon-select"/>
              </section>
            </section>
          </section>
       </section>
       <p class="tips">{{$t('app.config.preview.tips')}}</p>
    </section>
    <!-- /效果预览 -->
    <edit-room-icon :visible="editVisible" :data="editData" :id="this.datas.id" @cancel="cancelEdit" @sumit="sumitEdit"/>
    <change-operation 
    :visible="langVisible" 
    :sourceRowId="editLangRoom.roomId" 
    :defaultVal = "editLangRoom.roomName"
    :sourceTable="`oem_app_rooms_${appKey}`"  
    fieldName="name" 
    @handleCancel="langVisible = false"
    @handleOk = "langVisible = false"
    />
  </section>
</template>

<script>
import { beforeUpload } from "@/utils/validate"
import { uploadFile } from "@/api/common"
import { getDefaultRoomList, getRoomIconList, deleteDefaultRoom, saveRoomIcon, restoreDefaultRoom } from "@/api/appExploit"
import { PlusIcon, RadioCheckedIcon, DeleteRedIcon } from "@/core/icons"
import EditRoomIcon from "../../components/EditRoomIcon.vue"
import changeOperation from "../../../multilingual/components/changeOperation.vue"

export default {
  props:{
    appId: { type:String, default:'' },
    appKey: { type:String, default:'' },
    version: { type:String, default:'' },
    editDisabled: { type:Boolean, default:false },
  },
  components:{
    PlusIcon,
    EditRoomIcon,
    RadioCheckedIcon,
    DeleteRedIcon,
    changeOperation
  },
  data (){
    return {
      datas: {},
      columnList: [
        { title: this.$t('DefaultRoom.column.order'), dataIndex: "roomSort"},
        { title: this.$t('DefaultRoom.column.roomName'), dataIndex: "roomName"},
        { title: this.$t('DefaultRoom.column.icon'), key: "roomImage", scopedSlots: { customRender: 'roomImage' }},
        { title: this.$t('public.action'), key: "action", scopedSlots: { customRender: 'action' }, width: "240px",}
      ],
      roomList: [],
      loading: false,
      customizeIconList: [],
      editVisible: false,
      editData: {},
      tabType: 'defaultRoom',
      tabList: [{ label: '默认房间', type: "defaultRoom" },{ label: '自定义房间图标', type: "selectRoomIcon" }],
      checkedRoom: '',
      selectedIconIndex: 0,
      langVisible:false,
      editLangRoom:''
    }
  },
  mounted(){
    this.getDefaultRoomList()
    this.getRoomIconList()
  },
  methods:{

    // 获取默认房间列表
    async getDefaultRoomList(){
      const res = await getDefaultRoomList({ appId: this.appId, version: this.version })
      if(res.code !==0) return
      this.datas = res.data
      this.roomList = res.data.roomList?.sort(this.sortData) || []
    },

    // 获取房间自定义图标列表
    async getRoomIconList(){
      const res = await getRoomIconList({ appId: this.appId, version: this.version })
      if(res.code !==0) return
      this.customizeIconList = res.data?.roomIcons || []
    },

    // 恢复默认
    async resetDefault(){
      const res = await restoreDefaultRoom({ id: this.datas.id })
      if (res.code !== 0) return
      this.$message.success(this.$t('appFooterBar.restore.default.succeed'))
      this.getDefaultRoomList()
      this.getRoomIconList()
    },

    // 编辑房间
    async handleEdit(data){
      this.editVisible = true
      this.editData = {...data}
    },

    // 添加房间
    handleAdd(){
      this.editVisible = true
      this.editData = {}
    },

    // 取消编辑
    cancelEdit(){
      this.editVisible = false
    },

    // 确认编辑
    sumitEdit(){
      this.editVisible = false
      this.getDefaultRoomList()
    },

    // 删除房间
    handleDelete(data){
      this.$WarningModal(this, this.$t('DefaultRoom.isConfirm.delete')).then(async () => {
        const res = await deleteDefaultRoom({ roomId: data.roomId, id: this.datas.id })
        if(res.code!==0)return
        this.$message.success(this.$t('public.delete_success'))
        this.getDefaultRoomList()
      });
    },

    beforeUpload(file){
      if (file.type !== 'image/png') {
        this.$message.warning(this.$t('app.config.img.type'))
        return false
      } 
      return beforeUpload(this,file,false,108,108)
    },

    // 图片上传
    async customRequest(fileData,type,data){
      const file = fileData.file
      const res = await uploadFile(file,'app')
      if (res.code !== 0) return
      data[type] = res.data.fullPath
      const res1 = await editCustomMenu({...data},this.datas.id)
      if(res1.code !==0 )return
      this.$message.success(this.$t('public.uploadImg.succeed'))
      this.getDefaultRoomList()
    },

    // 自定义图标上传
    async customizeCustomRequest(fileData, index){
      const file = fileData.file
      const res = await uploadFile(file,'app')
      if (res.code !== 0) return
      if(index === -1) {
        this.customizeIconList.push(res.data.fullPath)
      } else {
        this.customizeIconList.splice(index, 1, res.data.fullPath)
      }
      this.saveRoomIcon()
    },
    
    // 删除自定义图标
    deleteIcon(index){
      if(this.editDisabled) return
      this.customizeIconList.splice(index,1)
      this.saveRoomIcon()
    },

    // 保存自定义图标
    async saveRoomIcon(){
      const res = await saveRoomIcon({id: this.datas.id, roomIcons: this.customizeIconList})
      if( res.code !== 0 ) return
      this.$message.success(this.$t('public.save.ok'))
    },

    // 排序
    sortData(a, b) {
      return a.position - b.position
    },

    // 选中效果预览的房间
    handleCheckedRoom(item){
      this.checkedRoom = item.roomId
    },

    // 选中效果预览的图标
    handleSelectIcon(index){
      this.selectedIconIndex = index
    },

    // 点击编辑多语言
    handleEditLang(item){
      this.editLangRoom = item
      this.langVisible = true
    }
  }

}
</script>

<style  lang="less" scoped>
@import "../../../../../global.less";
@import "./common.less";

.title{
  padding: 31px 0 10px;
}
.subtitle{
  padding-top: 30px;
}
.image-wrap{
  overflow: hidden;
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 4px;
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
.customize-icon-wrap{
  position: relative;
  overflow: visible;
  margin: 20px 20px 0 0;
  width: 72px;
  height: 72px;
  .delete-icon{
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px;
    height: 16px;
  }
  .delete-icon.disabled{
    cursor: not-allowed;
  }
  .image{
    border-radius: 2px;
  }
}
.custom-wrap{
  /deep/.ant-upload-picture-card-wrapper{
    margin: 20px 20px 0 0;
    width: 72px;
  }
  /deep/.ant-upload.ant-upload-select-picture-card{
    width: 70px;
    height: 70px;
    border: 1px dashed @primary-color;
    background: transparent;
    img{
      width: 70px;
    }
  }
  .ant-upload-text{
    color: @primary-color;
    line-height: 20px;
    font-size: 14px;
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
  .defaultRoom{
    background: url("../../../../../assets/image/defaultRoom.png") no-repeat;
    background-size: 100% 100%;
  }
  .selectRoomIcon{
    background: url("../../../../../assets/image/selectRoomIcon.png") no-repeat;
    background-size: 100% 100%;
  }
  .room-list{
    position: absolute;
    left: 0;
    top: 116px;
    width: 99%;
    height: 230px;
    overflow-y: auto;
    background: #fff;
  }
  .room-item{
    padding: 6px 8px 6px 10px;
  }
  .radio-checked-icon{
    width: 8px;
    height: 8px;
  }
  .unchecked-circle{
    width: 6px;
    height: 6px;
    border: 1px solid @aithings-border-color;
    border-radius: 50%;
  }
  .room-icon{
    width: 18px;
    height: 18px;
    border-radius: 4px;
  }
  .room-name{
    font-size: 14px;
    text-indent: 8px;
    line-height: 9px;
    color: @aithings-text-color-gray;
    zoom: 0.5;
  }
  .icon-list{
    position: absolute;
    left: 0;
    top: 45px;
    width: 100%;
    padding-left: 9px;
  }
  .icon-item{
    width: 24px;
    height: 24px;
    margin: 0 7px 10px 0;
    padding: 2px;
    overflow: hidden;
    background: #FFFFFF;
    border: 1px solid #fff;
    border-radius: 50%;
    &.checked{
      box-shadow: 0px 1px 4px 0px rgba(200,200,200,0.2);
      border: 1px solid @primary-color;
    }
  }
  .room-icon-select{
    width: 18px;
    height: 18px;
    display: block;
  }
  .add-other-room{
    padding: 18px 20px;
    color: @primary-color;
    font-size: 14px;
    zoom: 0.5;
  }
}
.tips{
  font-size: 12px;
  color: @aithings-text-tips-color;
  line-height: 17px;
}

</style>