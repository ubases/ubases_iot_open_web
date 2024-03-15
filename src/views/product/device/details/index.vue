<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('device.detail.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <template v-for="(form,index) in detailsList">
          <h3 :key="`${form.title}-${index}`" v-text="form.title" class="title"></h3>
          <template v-if="form.name !== 'deviceStatus'">
            <a-form :label-col="labelCol" :wrapper-col="wrapperCol"  :key="`${form.name}-${index}`">
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
          
          <!-- 设备运行状态 -->
          <template v-if="form.name === 'deviceStatus'">
            <a-form  :label-col="labelCol" :wrapper-col="wrapperCol" :key="`${form.name}-${index}`">
              <a-row :gutter="24">
                <a-col :xs="24" :md="11" v-for="(item,key) in detailsData[form.name]" :key="`${item.attrValueName}-${key}`">
                  <a-form-item :label="item.attrKeyName">
                    {{item.attrValueName}}
                  </a-form-item>
                </a-col>
              </a-row>
              
            </a-form>
          </template>
          <a-divider v-if="index < 2" :key="`divider-${index}`"/>
        </template>
      </section>
    </a-page-header>
 </section>
</template>
<script>
import { getDeviceDetailsGroup} from '@/api/device'

export default {
  name: "DeviceDetails",
  data() {
    return {
      did: 0,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      detailsList:[
        {
          title:this.$t('device.detail.deviceInfo'),
          name:"deviceInfo",
          list:[
            { label:this.$t('device.detail.label.deviceName'), value:'deviceName'},
            { label:this.$t('device.detail.label.did'), value:'did'},
            { label:this.$t('device.detail.label.id'), value:'id'},
            { label:this.$t('device.detail.label.productName'), value:'productName'},
            { label:this.$t('device.detail.label.productKey'), value:'productKey'},
            { label:this.$t('device.detail.label.firmwallKey'), value:'firmwallKey'},
            { label:this.$t('device.detail.label.firmwallVersion'), value:'firmwallVersion'},
            { label:this.$t('device.detail.label.mcuFirmwallKey'), value:'mcuFirmwallKey'},
            { label:this.$t('device.detail.label.mcuFirmwallVersion'), value:'mcuFirmwallVersion'},
            // { label:this.$t('device.detail.label.moduleSN'), value:'moduleSN'},
            { label:this.$t('device.detail.label.deviceSN'), value:'deviceSN'},
          ]
        }, {
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
        activeInfo: {},
        deviceStatus: {}
      }
    };
  },
  async created() {
    this.did = this.$route.query.did
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
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }
  h3{
    padding: 0 0 10px;
    color: @aithings-text-color-black;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
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
</style>
