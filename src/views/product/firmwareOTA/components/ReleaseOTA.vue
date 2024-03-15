<template>
    <a-modal
    :title="getTitle"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :okText="getButtonText"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <p class="warning-text">{{$t('firmware.OTA.warning.text')}}</p>
      <a-form-model  ref="ruleForm" class="regular-form" :model="data" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item :label="$t('firmware.OTA.label.productName')" prop="productName" >
          {{data.productName}}
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.OTA.label.firmwareName')" prop="firmwareName" >
          {{data.firmwareName}}
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.OTA.label.version')" prop="version" >
          {{data.version}}
        </a-form-model-item>
        <a-form-model-item :label="$t('firmware.OTA.label.releaseMode')" prop="releaseMode" >
          <a-select :placeholder="$t('firmware.OTA.placeholder.releaseMode')" v-model="data.releaseMode" :options="$DictList('release_mode')">
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="data.releaseMode == 2" :label="$t('firmware.OTA.label.graySetting')" prop="graySetting" >
          <a-select :placeholder="$t('firmware.OTA.placeholder.graySetting')" v-model="data.graySetting" :options="$DictList('gray_type')" @change="handleClearValidate('grayScale')">
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="data.releaseMode == 2 && data.graySetting!=3" :label="data.graySetting==1 ? $t('firmware.OTA.label.grayScale.percent') : $t('firmware.OTA.label.grayScale.number')" prop="grayScale" >
          <a-input-number v-model="data.grayScale" :precision="0" :placeholder="data.graySetting==1 ? $t('firmware.OTA.label.grayScale.percent') : $t('firmware.OTA.label.grayScale.number')" :min="1"  />
          <span v-if="data.graySetting==1"> %</span> 
        </a-form-model-item>
        <a-form-model-item v-if="data.graySetting == 3" :label="$t('firmware.OTA.label.deviceIds')" prop="deviceIds" >
          <section class="numerical-list-map">
            <div class="flex y-axis-center value-wrap" v-for="(item,index) in valueMap" :key="index">
              <a-input v-model="item.value" style="width: 230px;margin-bottom: 5px;" :maxLength="50" :placeholder="$t('firmware.OTA.label.deviceIds')"/>
              <a-button v-if="index !== 0" type="link" @click="handleDeleteMap(index)">{{$t('public.delete')}}</a-button>
            </div>
            <a-button class="add-numerical-button" @click="addMap"><plus-blue-icon /></a-button>
          </section>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { PlusBlueIcon } from '@/core/icons'
import { otaRelease } from '@/api/firmwareOTA'
export default ({
  name:"ReleaseOta",
  props:{
    visible: { type: Boolean, default: false },
    data:{ type: Object, default: () => {}} 
  },
  components:{
    PlusBlueIcon
  },
  data () {
    return {
      confirmLoading:false,
      rules: {
        releaseMode: [{ required: true, message: this.$t('firmware.OTA.rules.releaseMode'), trigger: 'change' }],
        graySetting: [{required: true,message: this.$t('firmware.OTA.rules.graySetting'),trigger: 'change',}],
        grayScale: [{required: true, validator:this.grayScaleValidator, trigger: 'blur'}],
        deviceIds: [{required: true, validator:this.deviceIdsValidator, trigger: 'blur'}],
      },
      valueMap: [{value: ""}]
    }
  },
  computed:{
    getTitle(){
      return this.$t('firmware.OTA.title.publish')
    },
    getButtonText(){
      return this.$t('public.ok')
    },
  },
  mounted(){
  },
  methods:{
    grayScaleValidator(rule, value, callback){
      if(!this.data.grayScale) {
        this.data.graySetting==1 ? callback(this.$t('firmware.OTA.rules.grayScale.percent')) : callback(this.$t('firmware.OTA.rules.grayScale.number'))
      } else{
        callback()
      }
    },
    deviceIdsValidator(rule, value, callback){
      if(!this.valueMap[0].value) {
        callback(this.$t('firmware.OTA.rules.grayScale.deviceId'))
      } else{
        callback()
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        let form = {
          "productId": this.data.productId,
          "firmwareId": this.data.firmwareId,
          "firmwareVersionId": this.data.versionId,
          "releaseMode": this.data.releaseMode,
          "graySetting": this.data.graySetting,
          "grayScale": this.data.grayScale,
          "otaPkgId": this.data.id,
          "publishId": this.data.publishId,
          "deviceIds": this.valueMap.map(item=>item.value)
        }
        let res = await otaRelease(form)
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.$emit("handleOk")
      });
    },
    handleCancel() {
      this.$emit("handleCancel")
    },

    // 清除校验值
    handleClearValidate(type){
      this.$refs?.ruleForm?.clearValidate([type])
    },

    addMap(){
      this.valueMap.push({value: ""})
    },

    handleDeleteMap(index){
      this.valueMap.splice(index, 1)
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.warning-text{
  color:@aithings-warning-color;
}
.add-numerical-button{
  width: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  color: @primary-color;
  border-color: @primary-color;
  svg{
    transform: translateY(2px);
  }
  &:disabled{
    background: none;
    opacity: 0.5;
    color: @primary-color;
    border-color: @primary-color;
  }
}

</style>