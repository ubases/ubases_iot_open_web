<template>
  <section class="content">
    <template v-for="(form,index) in detailsList">
      <h3 :key="`${form.name}-title-${index}`" v-text="form.title" class="title"></h3>
      <template v-if="form.name == 'deviceInfo' || form.name == 'activeInfo'">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol" :key="`${form.name}${index}`">
          <a-row :gutter="24">
            <a-col :xs="24" :md="11"  v-for="(item,key) in form.list" :key="`${item.label}-${key}`">
              <a-form-item v-if="item.filter" :label="item.label" >
                {{$DictName(item.filter,detailsData[form.name][item.value]) || ''}}
              </a-form-item>
              <a-form-item v-else-if="item.momentFilter" :label="item.label" >
                <template v-if="detailsData[form.name][item.value]">{{detailsData[form.name][item.value] | momentFilter}}</template>
              </a-form-item>
              <a-form-item v-else :label="item.label" >
                {{ detailsData[form.name][item.value] || ''}}
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <!-- 固件版本信息 -->
      <template v-if="form.name === 'firmwareList'">
        <a-table
        :key="`${form.name}${index}`"
          class="version-table"
          rowKey="key"
          size="small"
          :data-source="detailsData.firmwareList"
          :columns="form.list"
          :pagination="false"
        >
          <template v-slot:type="item">{{ $DictName('firmware_type', item) }}</template>
        </a-table>
      </template>
      <!-- 设备运行状态 -->
      <template v-if="form.name === 'deviceStatus'">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol" :key="`${form.name}${index}`">
          <a-row :gutter="24">
            <a-col :xs="24" :md="11" v-for="(item,key) in detailsData[form.name]" :key="`${item.attrValueName}-${key}`">
              <a-form-item :label="item.attrKeyName">
                {{item.attrValueName}}
              </a-form-item>
            </a-col>
          </a-row>
          
        </a-form>
      </template>
      <a-divider v-if="index < 2" :key="`divider${index}`"/>
    </template>
  </section>
</template>
<script>
 import { getDeviceDetailsGroup} from '@/api/device'
 
 export default {
   name: "Info",
   props:{
    did:{ type:String, default:''},
    activeTab:{ type:String, default:''},
   },
   data() {
     return {
       labelCol: { xs: { span: 24 }, sm: { span: 6 } },
       wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
       detailsList:[
         {
           title:this.$t('device.detail.deviceInfo'),
           name:"deviceInfo",
           list:[
             { label:this.$t('device.detail.label.deviceName'), value:'deviceName'},
             { label:this.$t('device.detail.label.did'), value:'did'},
             { label:this.$t('device.detail.label.id'), value:'id'},
             { label:this.$t('device.detail.label.productName'), value:'productName'},
             { label:this.$t('device.detail.label.productKey'), value:'productId'},
             { label:this.$t('device.detail.label.deviceSN'), value:'deviceSN'},
           ]
         },{
           title: this.$t('device.version.info'),
           name:"firmwareList",
           list:[
             { dataIndex: "name", title: this.$t('firmware.name')},
             { dataIndex: "type", title: this.$t('firmware.type'), scopedSlots: { customRender: "type" }},
             { dataIndex: "key", title: this.$t('firmware.key')},
             { dataIndex: "version", title: this.$t('release.log.column.version') }
           ]
         },{
           title: this.$t('device.detail.activeInfo'),
           name:"activeInfo",
           list:[
             { label:this.$t('device.detail.label.activeStatus'), value:'activeStatus'},
             { label:this.$t('device.detail.label.activatedTime'), value:'activatedTime', momentFilter:true},
             { label:this.$t('device.detail.label.lastActivatedTime'), value:'lastActivatedTime', momentFilter:true},
             { label:this.$t('device.detail.label.updateTime'), value:'updateTime', momentFilter:true},
             { label:this.$t('device.detail.label.onlineStatus'), value:'onlineStatus'},
             { label:this.$t('device.detail.label.activeUser'), value:'activeUser'},
             { label:this.$t('device.detail.label.activeApp'), value:'activeApp'},
             { label:this.$t('device.detail.label.activeLoc'), value:'activeLoc'},
             { label:this.$t('device.detail.label.activeTimeZone'), value:'activeTimeZone'},
             { label:this.$t('device.detail.label.belogOpenUser'), value:'belogOpenUser'},
           ]
         }, {
           title: this.$t('device.detail.deviceStatus'),
           name:"deviceStatus",
           list:[]
         }
       ],
       detailsData:{
         deviceInfo: {},
         firmwareList:[],
         activeInfo: {},
         deviceStatus: []
       }
     };
   },
   watch:{
    activeTab(val){
      if(val == '1'){
        this.getDetails()
      }
    }
  },
   async created() {
     await this.getDetails()
   },
   methods: {
     async getDetails(){
       const res = await getDeviceDetailsGroup(this.did)
       if(res.code !== 0) return
       this.detailsData = res.data
     },
 
   },
 };
 </script>
 <style lang="less" scoped>
   @import "../../../../global.less";
   .content{
    padding: 0 20px 20px;
  }
   h3{
     padding: 0 0 10px;
     color: @aithings-text-color-black;
     font-size: 14px;
     font-weight: 600;
     line-height: 20px;
   }
   /deep/.ant-form-item{
    margin-bottom: 0;
   }
   /deep/ .ant-form-item-label{
     text-align: left;
   }
   /deep/ .ant-form-item label{
     color: @aithings-text-color-gray;
     
   }
   /deep/ .ant-form-item-children{
     color: @aithings-text-color-black;
     padding-left: 20px;
   }
   .version-table{
     margin: 10px 0 40px;
   }
 </style>
 