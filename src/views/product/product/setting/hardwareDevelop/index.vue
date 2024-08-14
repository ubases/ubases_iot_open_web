<template>
  <section>
    <section class="card-header flex y-axis-center x-space-between">
      <span class="title" v-text="moduleSelected.length === 0 ? $t('setting.hardware.develop.select.module') : $t('setting.hardware.develop.selected.module')"></span>
      <div class="flex">
        <a-button v-if="status == 2 && moduleSelected.length > 0" class="exchange-button" @click="cancelModule">{{$t('setting.hardware.develop.selected.module.cancel')}}</a-button>
        <a-button v-if="status == 2 && moduleSelected.length > 0" class="exchange-button" @click="exchangeModule">{{$t('public.exchange')}}</a-button>
      </div>
    </section>
    <section>
      <a-table
        rowKey="id"
        size="small"
        :data-source="dataSource"
        :columns="columnList"
        :loading="customLoading"
        :pagination="false"
      >
        <div slot="version" slot-scope="text, record">
          <p>{{record.version || '无版本'}}</p>
          
          <a-button v-if="(status == 2 && record.versionCount > 1)" size="small" type="link" @click="changeVersion('module')">{{$t('setting.hardware.develop.button.changeVersion')}}</a-button>
        </div>
        <template v-slot:action="record">
          <a-button type="link" v-if="moduleSelected.length !== 0" :disabled="!record.firmwareUrl" size="small" @click="downloadFirmware(record)">{{$t("setting.hardware.develop.button.downloadFirmware")}}</a-button>
          <a-button type="link" v-if="status == 2 && moduleSelected.length === 0" @click="handleSelectModule(record)">{{$t('setting.hardware.develop.select')}}</a-button>
        </template>
      </a-table>
    </section>
    <section class="card-header flex y-axis-center x-space-between">
      <span class="title">{{$t('setting.hardware.develop.customize.firmware')}}</span>
      <section :class="['customize-button-wrap',{'line': customizeData.length === 0}]">
        <a-button v-if="status == 2" class="add-button" @click="addCustomFirmware">{{$t('setting.hardware.develop.button.add.customize.firmware')}}</a-button>
        <a-button v-if="status == 2" class="relevance-button" @click="relevanceCustomFirmware">{{$t('setting.hardware.develop.button.relevance.firmware')}}</a-button>
      </section>
    </section>
    <section class="customize-list" v-if="customizeData.length > 0">
      <a-table
        rowKey="id"
        size="small"
        :data-source="customizeData"
        :columns="customizeColumns"
        :loading="customLoading"
        :pagination="false"
      >
        <div slot="firmwareInfo">
          {{$t('setting.hardware.develop.firmwareInfo.text')}}
        </div>
        <div slot="firmwareType" slot-scope="firmwareType">
          {{$DictName('firmware_type',firmwareType)}}
        </div>
        <template v-slot:version="record">
          <p>{{record.version || '无版本'}}</p>
          <a-button v-if="!record.version && record.versionCount ==0 " size="small" type="link" @click="addVersion(record)">{{$t('firmware.details.version.add')}}</a-button>
          <a-button v-if="status == 2 && (record.versionCount > 1 || (!record.version && record.versionCount > 0))" size="small" type="link" @click="changeVersion('custom',record)">{{$t('setting.hardware.develop.button.changeVersion')}}</a-button>
        </template>
        <template v-slot:action="record" v-if="status == 2">
          <a-button type="link" size="small" @click="disassociate(record)">{{$t("setting.hardware.develop.button.disassociate")}}</a-button>
        </template>
      </a-table>
    </section>

    <section class="card-header">
      <span class="title">{{$t('setting.hardware.develop.data.download')}}</span>
    </section>
    <p class="warning-text">{{$t('setting.hardware.develop.warning.text')}}</p>
    <section v-if="downloadList.length > 0">
      <a-row :gutter="[20, 10]">
        <a-col v-for="item in downloadList" :key="item.type" :span="12">
          <button-card :data="item" @handleClick="downLoad(item)"/>
        </a-col>
      </a-row>
    </section>
    <!-- 更换模组 -->
    <a-modal
      class="change-modal"
      :title="changeType === 'module'? $t('setting.hardware.develop.replace.module'): $t('setting.hardware.develop.relevance.firmware.title')"
      :width="1060"
      :visible="exchangeVisible"
      :confirm-loading="confirmLoading"
      @cancel="handleCancel"
      @ok="handleModalSumit"
    >
      <a-spin :spinning="confirmLoading">
        <hardware-table-card 
          :columnList="exchangeColumnList" 
          :dataList="exchangeDataList" 
          type="table" 
          :productId ="productId"
          @handleSelect="handleModalSelect"
          >
        </hardware-table-card>
      </a-spin>
    </a-modal>
    <!-- /更换模组 -->
    <change-version 
      class="change-modal"
      :visible="changeVersionVisible"
      :data="versionData"
      :productId="productId"
      :type="versionEditType"
      @handleCancel="cancelChangeVersion"
      @handleSelect="sumitChangeVersion"
    />
    <add-firmware :visible="addFirmwareVisible" :productId="productId" :disabledType="disabledType" @sumitEdit="sumitAddFirmware" @cancelEdit="cancelAddFirmware"/>
    <edit-version :visible="editVersionVisible" :data="firmwareVersionData" :firmwareId="firmwareVersionId" :source="1" @cancelEdit="editVersionVisible=false" @sumitEdit="sumitEditVersion"></edit-version>
  </section>

</template>

<script>
import HardwareTableCard from "./HardwareTableCard.vue"
import ButtonCard from "../../components/ButtonCard.vue"
import ChangeVersion from "./ChangeVersion.vue"
import { getModuleList, selectModule, getCustomizeList, removeCustomerFirmware,selectCustomerFirmware } from "@/api/product"
import AddFirmware from "../../../firmware/component/addFirmware.vue"
import EditVersion from '../../../firmware/component/EditVersion.vue'
import moment from 'moment'

export default({
  name: "HardwareDevelop",
  props:{
    status: { type: Number, default: 0 },
    productId: { type: String, default: '' },
    productTypeId: { type: String, default: '' },
    baseProductId: { type: String, default: '' },
    details:{ type: Object, default: () => {}}
  },
  components:{
    HardwareTableCard,
    ButtonCard,
    ChangeVersion,
    AddFirmware,
    EditVersion
  },
  data() {
    return {
      moduleSelected:[],
      exchangeVisible:false,
      moduleList:[],
      originColumnList: [
        { title:this.$t('setting.hardware.develop.column.moduleName'), dataIndex:"moduleName", width: '18%'},
        { title:this.$t('setting.hardware.develop.column.firmwareTypeName'), dataIndex:"firmwareTypeName", width: '18%'},
        { title:this.$t('setting.hardware.develop.column.firmwareName'), dataIndex:"firmwareName", width: '18%'},
        { title:this.$t('setting.hardware.develop.column.firmwareNameEn'), dataIndex:"firmwareNameEn", width: '18%'},
        { title:this.$t('setting.hardware.develop.column.firmwareId'), dataIndex:"firmwareKey", width: '18%'},
        { title:this.$t('setting.hardware.develop.column.currentVersion'), dataIndex:"version",scopedSlots: { customRender: "version" }, width: '18%'},
        { title:this.$t('public.action'), key: "action", scopedSlots:{ customRender: "action" }, width: '10%'}
      ],
      columnList:[],
      changeColumn:[
        { name:this.$t('setting.hardware.develop.column.moduleName'), span:"5", slot:"moduleName"},
        { name:this.$t('setting.hardware.develop.column.firmwareTypeName'), span:"4", slot:"firmwareTypeName"},
        { name:this.$t('setting.hardware.develop.column.firmwareName'), span:"4", slot:"firmwareName"},
        { name:this.$t('setting.hardware.develop.column.firmwareNameEn'), span:"4", slot:"firmwareNameEn"},
        { name:this.$t('setting.hardware.develop.column.firmwareId'), span:"4", slot:"firmwareKey"},
        { name:this.$t('public.action'), span:"2", slot:"action"}
      ],
      downloadList:[{
        title:"MCU SDK",
        details:this.$t('setting.hardware.develop.download.details'),
        buttonText:this.$t('public.download'),
        type:"MCU_SDK.zip",
        url: '/v1/platform/web/open/product/sdk/download?productId='+this.productId
      }],
      changeVersionVisible: false,
      versionData: {},
      customizeData:[],
      customizeColumns:[
        { title: this.$t('setting.hardware.develop.columns.firmwareInfo'), dataIndex: "firmwareInfo", scopedSlots: { customRender: "firmwareInfo" }, width: '18%'},
        { title: this.$t('setting.hardware.develop.columns.firmwareType'), dataIndex: "firmwareType", scopedSlots: { customRender: "firmwareType" }, width: '18%'},
        { title: this.$t('setting.hardware.develop.columns.firmwareName'), dataIndex: "firmwareName", width: '18%'},
        { title:this.$t('setting.hardware.develop.column.firmwareNameEn'), dataIndex:"firmwareNameEn", width: '18%'},
        { title: this.$t('setting.hardware.develop.columns.firmwareKey'), dataIndex: "firmwareKey", width: '18%'},
        { title: this.$t('setting.hardware.develop.columns.currentVersion'), key: "version", scopedSlots: { customRender: "version" }, width: '18%'},
        { title: this.$t('public.action'), key: "action", scopedSlots: { customRender: "action" }, width: '10%'},
      ],
      customLoading: false,
      addFirmwareVisible: false,
      changeType:'',
      customizeColumnList:[
        { name: this.$t('setting.hardware.develop.columns.firmwareName'), slot: "name", span: 4},
        { name:this.$t('setting.hardware.develop.column.firmwareNameEn'), slot:"firmwareNameEn", span: 4},
        { name: this.$t('setting.hardware.develop.columns.firmwareKey'), slot: "firmwareKey", span: 4},
        { name: this.$t('setting.hardware.develop.columns.firmwareType'), slot: "type", span: 4},
        { name: this.$t('setting.hardware.develop.columns.newestVersion'), slot: "version", span: 3},
        { name: this.$t('setting.hardware.develop.columns.firmwareIdentifName'), slot: "flag", span: 3},
        { name: this.$t('public.action'), slot: "action", span: 2},
      ],
      exchangeDataList:[],
      exchangeColumnList:[],
      confirmLoading: false,
      associatedList:[],
      versionEditType: '',
      disabledType:[],
      editVersionVisible:false,
      firmwareVersionId:'',
      firmwareVersionData:{}
      // isSuportMulti:false
    }
  },
  computed:{
    dataSource(){
      // 模组显示列表
      return this.moduleSelected.length === 0 ? this.moduleList : this.moduleSelected
    },
    selectedType(){
      // 已关联的自定义固件
      return this.customizeData.map(item=>item.firmwareType)
    }
  },
  watch:{
    productId(val){
      if(!val) return
      this.getModuleList()
    },
    details(){
      this.getCustomizeData()
      this.defaultModule()
    },
    
  },
  async mounted(){
    if(this.productTypeId && this.baseProductId){
      await this.getModuleList()
    }
    this.getCustomizeData()
    this.defaultModule()
  },
  methods:{
    // 获取已选择的自定义固件
    async getCustomizeData(){
      this.customizeData = this.details?.firmwares || []
    },

    // 获取可选择模组列表
    async getModuleList(){
      const res = await getModuleList({productTypeId:this.productTypeId, baseProductId:this.baseProductId})
      if(res.code !==0) return
      const list = res.data || []
      this.columnList = this.originColumnList.filter(item=>item.dataIndex !== 'version')
      this.moduleList = list.map(item => {
        return { ...item, active: 0}
      })
    },

    // 选择模组
    handleSelect(record){
      record.active = 1
      this.moduleSelected = [record]
      this.columnList = this.$deepClone(this.originColumnList) 
      this.moduleList.forEach(item=>item.id == record.id ? item.active = 1 :item.active = 0)
      this.getDownloadList()
    },

    // 选中模组/固件
    handleModalSelect(data) {
      this.exchangeDataList.forEach(item=>{
        item.active = item.id == data.id? 1 : 0
      })
    },
    // 确认更换模组/关联固件
    async handleModalSumit(){
      const data = this.exchangeDataList.filter(item=>item.active == 1)
      if(data.length === 0){
        this.exchangeVisible = false
        return
      }
      let param ={}
      const selectedModule = data?.pop()
      if(this.changeType === 'module'){
        param = {productId:this.productId, moduleId:`${selectedModule.id}`, firmwareId: selectedModule.firmwareId}
      } else {
        param = {productId:this.productId, firmwareId: selectedModule.id}
      }
      const res = this.changeType === 'module' ?  await selectModule(param): await selectCustomerFirmware(param)
      if(res.code !== 0) return
      this.$emit('refreshDetails')
      this.exchangeVisible = false
    },

    // 点击选择模组
    async handleSelectModule(data){
      if(this.selectedType.some(type=>type == data.firmwareType)){
        this.$InfoModal(this,this.$t('setting.hardware.develop.undisassociate.tips'),this.$t('public.prompt'),this.$t('public.know'))
        return
      }
      const res = await selectModule({productId:this.productId, moduleId:`${data.id}`, firmwareId: data.firmwareId})
      if(res.code !== 0) return
      this.$emit('refreshDetails')
    },

    // 取消选择模组
    async cancelModule(){
      const res = await removeCustomerFirmware({productId: this.productId, id: this.moduleSelected[0].relationId})
        if(res.code!==0)return
        this.$message.info(this.$t('public.action.succeed'))
        this.$emit('refreshDetails')
    },

    handleCancel() {
      this.exchangeVisible = false
    },

    // 下载
    downLoad(item){
      this.$DownloadTemplate(
        this,
        {
          url: item.url,
        },
        item.type,
        "get",
      );
    },

    // 更换模组
    exchangeModule() {
      this.exchangeColumnList = [...this.changeColumn]
      this.exchangeDataList = this.moduleList.map(item=>{
        if(this.selectedType.some(type=>type == item.firmwareType)){
          item.disabled = true
        }
        return item 
      })
      this.changeType = 'module'
      this.exchangeVisible = true
    },

    // 查询已选择的模组
    defaultModule(){
      if(!this.details?.moduleId || !this.details?.module){
        this.moduleSelected = []
      } else{
        this.handleSelect(this.details.module)
      }
    },

    // 显示资料下载
    getDownloadList(){
      if (this.moduleSelected.length === 0 ) return
      const data = this.moduleSelected[0]
      if(data.fileUrl){
        this.downloadList.splice( 1, 1, {
          title:this.$t('setting.hardware.develop.download.title'),
          details:this.$t('setting.hardware.develop.download.details1'),
          buttonText:this.$t('public.download'),
          type:this.$t('setting.hardware.develop.download.type'),
          url: data.fileUrl
        })
      }
    },

    // 下载固件
    downloadFirmware(){
      const data = this.moduleSelected[0]
      this.downLoad({ url: data.firmwareUrl || '', type: `fm${data.firmwareKey}${moment(Date.now()).format("YYYYMMDDHHmm")}.zip` || '' })
    },

    // 点击切换版本按钮
    changeVersion(type,data){
      this.versionEditType = type
      this.versionData = data ? data : this.moduleSelected[0]
      this.changeVersionVisible = true
    },

    // 添加版本
    addVersion(data){
      this.firmwareVersionData = { productId: data.productId, relationId: data.id }
      this.firmwareVersionId = data.firmwareId
      this.editVersionVisible = true
    },

    //确认添加版本
    sumitEditVersion(){
      this.editVersionVisible = false
      this.$emit('refreshDetails')
    },

    // 确认切换版本
    sumitChangeVersion(){
      this.$emit('refreshDetails')
      this.changeVersionVisible = false
    },

    // 取消修改版本
    cancelChangeVersion(){
      this.changeVersionVisible = false
    },

    // 解除关联
    disassociate(data){
      this.$WarningModal(this, this.$t('setting.hardware.develop.disassociate.tips')).then(async () => {
        const res = await removeCustomerFirmware({productId: this.productId, id: data.id})
        if(res.code!==0)return
        this.$message.info(this.$t('public.action.succeed'))
        this.$emit('refreshDetails')
      });
    },

    // 新增自定义固件
    addCustomFirmware(){
      const moduleData = this.$deepClone(this.moduleSelected)
      this.disabledType = moduleData.length >0 ? [...this.selectedType, moduleData?.pop()?.firmwareType] :[...this.selectedType]
      this.disabledType = this.disabledType.filter(item=>item != 6)
      this.addFirmwareVisible = true
    },

    // 确定新增固件
    sumitAddFirmware(){
      this.addFirmwareVisible = false
      this.$emit('refreshDetails')
    },

    // 取消新增固件
    cancelAddFirmware(){
      this.addFirmwareVisible = false
    },

    // 关联自定义固件
    async relevanceCustomFirmware(){
      this.changeType = 'customize'
      const moduleData = this.$deepClone(this.moduleSelected)
      const type = moduleData.length >0 ? [...this.selectedType, moduleData?.pop()?.firmwareType] :[...this.selectedType]
      this.exchangeColumnList = [...this.customizeColumnList]
      // 获取自定义固件选择列表
      const res = await getCustomizeList({productId:this.productId})
      if(res.code !== 0) return
      const list = res.data.list
      this.exchangeDataList = list.map(item=>{
        
        if(type.some(t=>item.type==t) && item.type !=6){
          item.disabled = true
        } else {
          item.active = 0
        }
        if(this.customizeData.some(d=>d.firmwareId == item.id)) {
          item.associated = true
          item.disabled = true
        }
        return item 
      })
      this.exchangeVisible = true
    },

    // 同固件类型是否支持多个
    // handleMultiChange(){
    //   // this.isSuportMulti
    //   const type = ''
    //   this.$InfoModal(this, this.$t('setting.hardware.develop.multi.tips',{type}), this.$t('setting.hardware.develop.closed.fault'), this.$t('setting.hardware.develop.know')).then(async() => {
    //   })
    // }

  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
  .card-header{
    padding: 30px 0 14px;
    .title{
      font-weight: 600;
      color: @aithings-text-color-black;
    }
    .exchange-button{
      margin-left: 10px;
      padding: 0 33px;
      border: 1px solid @primary-color;
      color: @primary-color;
    }
    .add-button,.relevance-button{
      padding: 0 16px;
      border: 1px solid @primary-color;
      color: @primary-color;
    }
    .relevance-button{
      margin-left: 10px;
    }
    .line{
      width: 100%;
      margin-top: 15px;
    }
  }
  .warning-text{
    padding-bottom: 15px;
    color: @aithings-warning-color;
    line-height: 20px;
  }
  .change-modal /deep/ .ant-modal-body{
    padding: 11px 20px 64px;
  }
  .change-version{
    color: @primary-color;
  }
  /deep/ .ant-btn-link{
    padding: 0;
    &:focus{
      border: 0;
    }
  }
  .multi-switch{
    padding-right: 20px;
  }
</style>