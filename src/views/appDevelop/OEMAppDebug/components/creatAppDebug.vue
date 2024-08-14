<template>
    <a-modal
    :title="$t('oemAppDebug.create.title')"
    :width="540"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="submit" type="primary"  @click="handleOk">{{$t('oemAppDebug.create.add')}}</a-button>
      <a-button key="back" @click="handleCancel">{{$t('public.cancel')}}</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form-model  ref="ruleForm" class="regular-form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item ref="appKey" :label="$t('oemAppDebug.create.appName')" prop="appKey">
          <a-select
            v-model="form.appKey"
            :placeholder="$t('oemAppDebug.create.appName')"
            default-value=""
            :options="appOptions"
            :allowClear="true"
          >
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="regionId" :label="$t('oemAppDebug.create.region')" prop="regionId">
          <a-select v-model="form.regionId" optionFilterProp="label" :placeholder="$t('oemAppDebug.create.region')" >
            <a-select-option v-for="item in areaOptions" :value="item.value" :key="item.value" :label="item.value">
              {{item.label}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="userName" :label="$t('oemAppDebug.create.userName')" prop="userName">
          <a-input v-model="form.userName" :maxLength="50" :placeholder="$t('oemAppDebug.create.placeholder.userName')"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { createAppDebugger } from "@/api/oemAppDebug"
export default ({
  name:"creatApp",
  props:{
    visible: { type: Boolean, default: false },
    data: { type: Object, default: () => {}},
    areaOptions: { type: Array, default: () => []},
    appOptions: { type: Array, default: () => []},
  },

  data () {
    return {
      confirmLoading:false,
      agree:false,
      form: {
        userName: '',
      },
      rules: {
        appKey: [{ required: true, message: this.$t('oemAppDebug.create.placeholder.appName'), trigger: 'blur' },],
        regionId: [{ required: true, message: this.$t('oemAppDebug.create.placeholder.region'), trigger: 'blur' },],
        userName: [{ required: true, message: this.$t('oemAppDebug.create.placeholder.userName'), trigger: 'blur' },],
      },
    }
  },
  mounted(){},
  methods:{
    handleOk() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        const regionId = String(this.form.regionId)
        let res = await createAppDebugger({...this.form,regionId})
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.$emit("handleOk")
        this.$refs.ruleForm?.resetFields()
        this.form = {}
      });
    },
    handleCancel() {
      this.$refs.ruleForm?.resetFields()
      this.$emit("handleCancel")
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.warning-text{
  margin: 15px 0 28px;
  height: 33px;
  font-size: 24px;
  font-weight: 500;
  color: @aithings-text-color-black;
  line-height: 33px;
}
.remind{
  margin-top: 10px;
  font-size: 12px;
  font-weight: 400;
  color: @aithings-text-tips-color;
  line-height: 17px;
}
.ant-modal .ant-modal-body .ant-form-item{
  margin-bottom: 20px;
}
/deep/.ant-checkbox-inner{
  border-radius: 50%;
  width: 16px;
  height: 16px;
  border: 1px solid @aithings-text-tips-color;
}
/deep/.ant-form-item-label{
  line-height: 34px;
}
/deep/.ant-form-item-control{
  line-height: 34px;
}
.ant-radio-wrapper{
  color: @aithings-text-color-black;
}
.add-color{
  color: @aithings-warning-color-FF8E35;
}
.agree{
  margin-left: 196px;
}
.file{
  color: @primary-color;
}
</style>