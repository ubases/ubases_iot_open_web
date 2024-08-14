<template>
    <a-modal
    :title="$t('createOemApp.title')"
    :width="840"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button key="submit" type="primary"  @click="handleOk">{{$t('createOemApp.immediately.create')}}</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <p class="warning-text">{{$t('createOemApp.warning.text')}}</p>
      <a-form-model  ref="ruleForm" class="regular-form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item ref="name" :label="$t('createOemApp.label.name')" prop="name">
          <a-input v-model="form.name" :maxLength="20" :placeholder="$t('createOemApp.placeholder.name')"/>
          <div class="remind">{{$t('createOemApp.remind.name')}}</div>
        </a-form-model-item>
        <a-form-model-item ref="iosName" :label="$t('createOemApp.label.iosName')" prop="iosName">
          <a-input v-model="form.iosName" :maxLength="50" placeholder="com.xxx.xxx"/>
          <div class="remind">{{$t('createOemApp.remind.iosName')}}</div>
        </a-form-model-item>
        <a-form-model-item ref="androidName" :label="$t('createOemApp.label.androidName')" prop="androidName">
          <a-input v-model="form.androidName" :maxLength="50" placeholder="com.xxx.xxx"/>
          <div class="remind">{{$t('createOemApp.remind.androidName')}}</div>
        </a-form-model-item>
        <a-form-model-item ref="channelName" :label="$t('createOemApp.label.channelName')" prop="channelName">
          <a-input v-model="form.channelName" :maxLength="50"/>
          <div class="remind">{{$t('createOemApp.remind.channelName')}}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('createOemApp.label.region')" prop="region">
          <a-radio-group v-model="form.region" :options="$DictList('oem_region')" >
          </a-radio-group>
          <div class="remind add-color">{{$t('createOemApp.remind.region')}}</div>
        </a-form-model-item>
        <a-form-model-item class="agree" prop="agree">
          <a-checkbox v-model="form.agree">
              {{$t('user.register.agree')}}
              <router-link class="file" target="_blank" :to="{path:'/doc/appUsageLicense'}">{{$t('user.register.use-agreement')}}</router-link>
          </a-checkbox>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { addApp } from "@/api/appExploit"
import { IOSPACKAGE_REG,ANDROIDPACKAGE_REG} from "@/utils/validate"
export default ({
  name:"creatApp",
  props:{
    visible: { type: Boolean, default: false },
  },

  data () {
    return {
      confirmLoading:false,
      agree:false,
      form: {},
      rules: {
        name: [{ required: true, message: this.$t('createOemApp.rules.name'), trigger: 'blur' },],
        iosName: [{ required: true, pattern:IOSPACKAGE_REG, message: this.$t('createOemApp.rules.iosName'), trigger: 'blur' },],
        androidName: [{ required: true, pattern:ANDROIDPACKAGE_REG, message: this.$t('createOemApp.rules.androidName'), trigger: 'blur' }],
        region: [{ required: true, message: this.$t('createOemApp.rules.region'), trigger: 'change' },],
        agree:[{ validator:(rule, value, callback) => {value? callback():callback(this.$t('user.register.agree.valid.use-agreement'))},  trigger: 'change' }],
      },
    }
  },
  mounted(){},
  methods:{
    handleOk() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        if(this.form.agree==false) return
        let res = await addApp({...this.form, appDevType:1})
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.$router.push({path:"/appDevelop/OEMApp/configuration/index",query:{appId:res.data.appId}})
        this.$emit("handleOk")
        this.$refs.ruleForm?.resetFields()
        this.form = {}
      });
    },
    handleCancel() {
      this.$refs.ruleForm?.resetFields()
      this.$emit("handleCancel")
      this.form = {}
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