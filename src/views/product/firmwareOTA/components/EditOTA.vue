<template>
  <a-modal
    :title="getTitle"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p v-if="type == 'add'" class="warning-text">{{$t('edit.ota.warning.text')}}</p>
      <a-form-model ref="otaData" class="regular-form" :model="otaData" :rules="rules" :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }">
        <a-form-model-item :label="$t('edit.ota.label.product')" prop="product" >
          {{otaData.productName?otaData.productName:""}}
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.firmwareId')" prop="firmwareId" >
          <a-row v-if="type !== 'check'" :gutter="20">
            <a-col :xs="24" :md="8">
              <a-select :disabled="type=='edit'" v-model="otaData.firmwareType" :options="firmwareTypeOptions" :placeholder="$t('edit.ota.placeholder.firmwareType')" @change="firmwareTypeChange" />
            </a-col>
            <a-col :xs="24" :md="8">
              <a-select :disabled="type=='edit'" v-model="otaData.firmwareId" showSearch option-filter-prop="children" 
              :options="firmwareNameOptions" :placeholder="$t('edit.ota.placeholder.firmwareId')" allowClear @change="firmwareChange" />
            </a-col>
            <a-col :xs="24" :md="8">
              <a-select :disabled="type=='edit'" v-model="otaData.firmwareId" showSearch option-filter-prop="children" 
              :options="firmwareKeyOptions" :dropdownMatchSelectWidth="false" :placeholder="$t('edit.ota.placeholder.firmwareKey')" allowClear @change="firmwareChange" />
            </a-col>
          </a-row>
          <div v-else>{{ otaData.firmwareTypeName }}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.versionId')" prop="versionId" >
          <a-select v-if="type !== 'check'" :disabled="type=='edit'" v-model="otaData.versionId" :options="firmwareVersionOptions" :placeholder="$t('edit.ota.placeholder.versionId')" @change="versionChange" />
          <div v-else>{{ otaData.version }}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.isMust')" prop="isMust" v-if="otaData.versionId">
          <a-radio-group v-if="type !== 'check'" disabled :value="otaData.isMust || 2" :options="$DictList('yes_no')" />
          <div v-else>{{ $DictName('yes_no', otaData.isMust || 2)}}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.upgradeMode')" prop="upgradeMode" >
          <a-select v-if="type !== 'check'" v-model="otaData.upgradeMode" :options="upgradeModeOptions" :placeholder="$t('edit.ota.placeholder.upgradeMode')" />
          <div v-else>{{ otaData.upgradeModeName }}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.isAuto')" prop="isAuto" >
          <a-radio-group v-if="type !== 'check'" :options="$DictList('yes_no')" v-model="otaData.isAuto"/>
          <p v-if="type !== 'check'" class="tips">{{$t('edit.ota.isAuto.tips')}}</p>
          <div v-else>{{ $DictName('yes_no',otaData.isAuto) }}</div>
        </a-form-model-item>
        <a-form-model-item v-if="otaData.isAuto == 1" :label="$t('edit.ota.label.autoTime')" prop="upgradeTimeMode" >
          <a-radio-group v-if="type !== 'check'" :options="$DictList('auto_upgrade_time_mode')" v-model="otaData.upgradeTimeMode"/>
          <section v-if="type !== 'check'" v-show="otaData.upgradeTimeMode == '2'">
            <a-time-picker valueFormat="HH:mm:ss" v-model="otaData.upgradeStartTime" :placeholder="$t('public.start.time')" @change="handleValidate('upgradeTimeMode')">
              <icon-font slot="suffixIcon" type="icon-date" :style="{ fontSize: '23px' }" />
            </a-time-picker>
            ——
            <a-time-picker valueFormat="HH:mm:ss" v-model="otaData.upgradeEndTime" :placeholder="$t('public.end.time')" @change="handleValidate('upgradeTimeMode')">
              <icon-font slot="suffixIcon" type="icon-date" :style="{ fontSize: '23px' }" />
            </a-time-picker>
          </section>
          <div v-else> {{ $DictName('auto_upgrade_time_mode',otaData.upgradeTimeMode)  }}
            <span v-if="otaData.upgradeTimeMode == '2'" class="padding-left-10">{{ `${otaData.upgradeStartTime} - ${otaData.upgradeEndTime}`}}</span>
          </div>
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.upgradeDesc')" prop="upgradeDesc" >
          <a-textarea v-if="type !== 'check'" v-model="otaData.upgradeDesc" :maxLength="250"></a-textarea>
          <div v-else>{{ otaData.upgradeDesc }}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.upgradeDescEn')" prop="upgradeDescEn" >
          <a-textarea v-if="type !== 'check'" v-model="otaData.upgradeDescEn" :maxLength="250"></a-textarea>
          <div v-else>{{ otaData.upgradeDescEn }}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.specifiedVersionMode')" prop="specifiedVersionMode" >
          <a-row v-if="type !== 'check'" :gutter="20">
            <a-col :xs="24" :md="12">
              <a-select v-model="otaData.specifiedVersionMode" :placeholder="$t('edit.ota.placeholder.specifiedVersionMode')" :options="specifiedVersionModeOptions" @change="handleClearValidate('specifiedVersionMode')"/>
            </a-col>
            <a-col v-show="otaData.specifiedVersionMode == 2" :xs="24" :md="12">
              <a-select
                :value="otaData.specifiedVersionArr"
                mode="multiple"
                optionFilterProp="label"
                :placeholder="$t('edit.ota.placeholder.specifiedVersionMode')"
                @change="specifiedVersionArrChange"
              >
                <a-select-option v-for="item in specifiedVersionOptions" :value="item.value" :key="item.key" :label="item.key">
                  {{item.label}}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <div v-else>
            {{ $DictName('specified_version_mode',otaData.specifiedVersionMode) }}
            <span v-if="otaData.specifiedVersionMode == 2" class="padding-left-10">
              {{ otaData.specifiedVersion }}
            </span>
          </div>
        </a-form-model-item>
        <a-form-model-item :label="$t('edit.ota.label.specifiedAreaMode')" prop="specifiedAreaMode" >
          <a-row v-if="type !== 'check'" :gutter="20">
            <a-col :xs="24" :md="12">
              <a-select v-model="otaData.specifiedAreaMode" :placeholder="$t('edit.ota.placeholder.specifiedAreaMode')" :options="specifiedAreaModeOptions" @change="handleClearValidate('specifiedAreaMode')" />
            </a-col>
            <a-col v-show="otaData.specifiedAreaMode == 2" :xs="24" :md="12">
              <a-select
                :value="otaData.specifiedAreaArr"
                mode="multiple"
                optionFilterProp="label"
                :placeholder="$t('edit.ota.placeholder.specifiedAreaMode')"
                @change="specifiedAreaArrChange"
              >
                <a-select-option v-for="item in areaOptions" :value="item.value" :key="item.key" :label="item.key">
                  {{item.label}}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <div v-else>
            {{ $DictName('specified_area_mode',otaData.specifiedAreaMode) }}
            <span v-if="otaData.specifiedAreaMode == 2" class="padding-left-10">
              {{ otaData.specifiedArea }}
            </span>
          </div>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button v-if="type =='check'" key="back" @click="handleCancel">{{$t('public.close.text')}}</a-button>
      <a-button v-if="type !=='check'" key="back" @click="handleCancel">{{$t('public.cancel')}}</a-button>
      <a-button v-if="type !=='check'" key="submit" type="primary" @click="handleOk">{{$t('public.sumit')}}</a-button>
    </template>
  </a-modal>
</template>
<script>

import { getFirmwareTypeList, getUpgradableVersions, getUpgradableAreas, getFirmwareList, getFirmwareVersionList, addFirmwareOTA, editFirmwareOTA } from "@/api/firmwareOTA"

export default ({
  name:"EditOta",
  props:{
    visible: { type: Boolean, default: false },
    firmwareOtaData:{ type: Object, default: () => {}},
    type: { type: String, default: 'add' }, //  add 新增， edit 编辑
    moduleId: { type: String, default: '' },
    productKey: { type: String, default: '' },
    productId: { type: String, default: '' },
  },

  data () {
    return {
      confirmLoading:false,
      otaData:{},
      firmwareTypeOptions: [],
      firmwareNameOptions:[],
      firmwareKeyOriginOptions:[],
      firmwareKeyOptions:[],
      firmwareVersionOptions:[],
      upgradeModeOptions: [],
      specifiedVersionModeOptions:[],
      specifiedAreaModeOptions:[],
      areaOptions:[],
      specifiedVersionOptions:[],
      rules: {
        firmwareId: [{required: true,message: this.$t('edit.ota.rule.firmwareId'),trigger: '',}],
        versionId: [{required: true,message: this.$t('edit.ota.rule.versionId'),trigger: 'change',}],
        upgradeMode: [{ required: true, message: this.$t('edit.ota.rule.upgradeMode'), trigger: 'change' }],
        isAuto: [{ required: true, message: this.$t('edit.ota.rule.isAuto'), trigger: 'change' }],
        upgradeTimeMode: [
          { required: true, message: this.$t('edit.ota.rule.autoTime'), trigger: 'change' },
          { validator:(rule, value, callback) => { this.otaData.upgradeTimeMode == 2 && (!this.otaData.upgradeStartTime || !this.otaData.upgradeEndTime) ? callback(this.$t('edit.ota.rule.autoTime')):callback()},  trigger: '' }
        ],
        upgradeTextZh: [{ required: true, message: this.$t('edit.ota.rule.upgradeTextZh'), trigger: 'blur' }],
        upgradeTextEn: [{ required: true, message: this.$t('edit.ota.rule.upgradeTextEn'), trigger: 'blur' }],
        specifiedVersionMode: [
          { required: true, message: this.$t('edit.ota.rule.specifiedVersionMode'), trigger: 'change' },
          { validator:(rule, value, callback) => { this.otaData.specifiedVersionMode == 2 && (!this.otaData.specifiedVersionArr ||this.otaData.specifiedVersionArr.length === 0) ? callback(this.$t('edit.ota.rule.specifiedVersionMode')):callback()},  trigger: 'change' }
        ],
        specifiedAreaMode: [
          { required: true, message: this.$t('edit.ota.rule.specifiedAreaMode'), trigger: 'change' },
          { validator:(rule, value, callback) => { this.otaData.specifiedAreaMode == 2 && (!this.otaData.specifiedAreaArr ||this.otaData.specifiedAreaArr.length === 0) ? callback(this.$t('edit.ota.rule.specifiedAreaMode')):callback()},  trigger: 'change' }
        ],
      },
    }
  },
  computed:{
    getTitle(){
      if(this.type == "add"){
        return this.$t('edit.ota.add.title')
      } else if(this.type == "edit"){
        return this.$t('edit.ota.edit.title')
      } else if(this.type == "check"){
        return this.$t('check.ota.title')
      } 
    },
  },
  watch: {
    async 'otaData.firmwareId'(value){
      if(this.type == 'check') return
      //请求指定升级版本
      this.getUpgradableVersions()
      if(!this.firmwareVersionOptions.length){
        // status:1 已上架的固件版本
        if(this.otaData.firmwareType) await this.queryFirmwareList(this.otaData.firmwareType)
        const isCustom = this.firmwareNameOptions.filter(item=>item.value === value)?.pop()?.isCustom || 0
        const res = await getFirmwareVersionList({productId: this.productId, firmwareId: value || "-1", moduleId: this.moduleId,isCustom})
        if(res.code !==0) return
        this.firmwareVersionOptions = res.data?.map(item => { return {"label":item.name,"value":`${item.id}`, "isMust":item.isMust} }) || []
      }
    },
    visible(val){
      if(!val) return
      this.otaData = {...this.firmwareOtaData}
      if(this.type == 'check') return
      this.getFirmwareTypeList()
      this.getAreaList()
    }
  },
  mounted(){
    this.specifiedAreaModeOptions = this.$DictList('specified_area_mode')
    this.specifiedVersionModeOptions = this.$DictList('specified_version_mode')
    this.upgradeModeOptions = this.$DictList('upgrade_mode')
    if(this.type == 'check') return
    if(this.otaData.firmwareType)this.queryFirmwareList(this.otaData.firmwareType)
    if(this.otaData.firmwareId)this.getUpgradableVersions()
  },
  methods:{
    // 获取固件类型列表
    async getFirmwareTypeList(){
      const res = await getFirmwareTypeList({moduleId:this.moduleId, productId: this.productId})
      if(res.code !== 0) return
      this.firmwareTypeOptions = res.data?.map(item=>{
        return {
          value: Number(item.code),
          label: item.name
        }
      })
    },

    // 切换固件类型
    firmwareTypeChange(value){
      this.otaData.firmware = value
      this.queryFirmwareList(value)
      this.otaData.firmwareId = undefined
      this.otaData.versionId = undefined
    },

    // 切换固件
    async firmwareChange(value){
      this.otaData.firmwareId = value
      if(value){
        this.$refs?.otaData?.clearValidate(['firmwareId'])
      }
      this.firmwareKeyOptions = this.firmwareKeyOriginOptions.filter(item=>item.value === value)
      const isCustom = this.firmwareNameOptions.filter(item=>item.value === value)?.pop()?.isCustom || 0
      this.otaData.isCustom = isCustom
      // 获取固件版本列表
      // status:1 已上架的固件版本
      const res = await getFirmwareVersionList({productId: this.productId, firmwareId: value || "-1", moduleId: this.moduleId,isCustom})
      if(res.code !==0) return
      this.firmwareVersionOptions = res.data?.map(item => {return {"label":item.name,"value":`${item.id}`,'isMust':item.isMust}}) || []
      this.otaData.versionId = undefined
    },

    // 获取固件列表
    async queryFirmwareList(firmwareType) {
      this.loading = true;
      const res = await getFirmwareList({'type': firmwareType, productId: this.productId })
      this.loading = false;
      if (res.code !== 0) return
      this.firmwareNameOptions = res.data?.map(item => {return {"label":item.name, "value":`${item.id}`, isCustom:item.isCustom || 0}}) || []
      this.firmwareKeyOriginOptions = res.data?.map(item => {return {"label":`${item.id}`, "value":`${item.id}`}}) || []
      this.firmwareKeyOptions = [...this.firmwareKeyOriginOptions]
      this.firmwareVersionOptions = []
    },

    // 获取区域列表
    async getAreaList(){
      const res = await getUpgradableAreas({productKey: this.productKey, productId: this.productId })
      if( res.code !== 0 ) return
      this.areaOptions = res.data?.map(item=>{
        return {
          value: item.Code,
          label: item.Name,
          key: item.Name
        }
      }) || []
    },

    // 获取产品的固件版本列表
    async getUpgradableVersions(){
      const res = await getUpgradableVersions({productKey: this.productKey, productId: this.productId, firmwareId: this.otaData.firmwareId})
      if( res.code !== 0 ) return
      this.specifiedVersionOptions = res.data?.map(item=>{
        return {
          value: item,
          label: item,
          key: item
        }
      }) || []
    },

    versionChange(value){
      this.otaData.versionId = value
      this.otaData.isMust = this.firmwareVersionOptions.filter(item=>item.value == value)?.pop()?.isMust || 2
    },

    handleOk() {
      this.$refs.otaData.validate(async(valid) => {
        if (!valid) return
        this.otaData.version = this.firmwareVersionOptions.filter(item => item.value == this.otaData.versionId)?.pop()?.label || this.otaData.version
        this.otaData.specifiedVersion = this.otaData.specifiedVersionArr?.toString() || ''
        this.otaData.specifiedArea = this.otaData.specifiedAreaArr?.toString() || ''
        this.otaData.firmwareType = Number(this.otaData.firmwareType)
        this.confirmLoading = true
        let res = this.type=='edit' ? await editFirmwareOTA({...this.otaData}) : await addFirmwareOTA({...this.otaData})
        this.confirmLoading = false
        if(res.code !==0 ) return
        this.$emit("handleOk")
        this.$refs.otaData?.resetFields()
        this.otaData = {}
      });
    },
    handleCancel() {
      this.$emit("handleCancel")
      this.$refs.otaData?.resetFields()
      this.otaData = {}
    },

    // 切换指定版本
    specifiedVersionArrChange(value){
      this.otaData.specifiedVersionArr = value
      if(this.otaData.specifiedVersionArr && this.otaData.specifiedVersionArr.length > 0){
        this.$refs?.otaData?.clearValidate(["specifiedVersionMode"])
      }
    },

    // 切换指定区域
    specifiedAreaArrChange(value){
      this.otaData.specifiedAreaArr = value
      if(this.otaData.specifiedAreaArr && this.otaData.specifiedAreaArr.length > 0){
        this.$refs?.otaData?.clearValidate(["specifiedAreaMode"])
      }
    },

    // 清除校验值
    handleClearValidate(type){
      if(this.otaData[type] == 1){
        this.$refs?.otaData?.clearValidate([type])
      }
      
    },

    // 校验该项
    handleValidate(type){
      this.$refs.otaData?.validateField([type])
    }

  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.warning-text{
  color:@aithings-warning-color;
}
.tips{
  font-size: 14px;
  color: @aithings-text-tips-color;
  line-height: 20px;
}
.padding-left-10{
  padding-left: 10px;
}
</style>