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
      <p class="warning-text">{{$t('customizedApp.createAPP.details')}}</p>
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
        <a-form-model-item ref="iosTeamId" :label="$t('createOemApp.label.teamId')" prop="iosTeamId">
          <a-input v-model="form.iosTeamId" :maxLength="50"/>
          <div class="remind">{{$t('createOemApp.remind.teamId')}}</div>
        </a-form-model-item>
        <a-form-model-item :label="$t('customizedApp.createAPP.label.appIcon')" prop="appIconUrl">
          <upload-button 
            accept="image/png"
            :acceptList="['image/png']"
            :limitSize="2"
            :limitWidth="1024"
            :limitHeight="1024"
            warningFileType="PNG"
            catalogName="app"
            :fileUrl="form.appIconUrl"
            @uploaded="uploaded"
          />
          <div class="remind">
            <p>{{$t('customizedApp.createAPP.remind1.appIcon')}}</p>
            <p>{{$t('customizedApp.createAPP.remind2.appIcon')}}</p>
          </div>
        </a-form-model-item>
        <a-form-model-item class="agree" prop="agree">
          <a-checkbox v-model="form.agree">
              {{$t('user.register.agree')}}
              <router-link class="file" target="_blank" :to="{path:'/doc/appUsageLicense'}">{{$t('customizedApp.createAPP.protocol.name')}}</router-link>
          </a-checkbox>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { addApp } from "@/api/appExploit"
import { IOSPACKAGE_REG,ANDROIDPACKAGE_REG} from "@/utils/validate"
import UploadButton from "@/components/uploadButton"

export default ({
  name:"CreateApp",
  props:{
    visible: { type: Boolean, default: false },
    data:{ type: Object, default: () => {}} 
  },
  components:{
    UploadButton
  },
  data () {
    return {
      confirmLoading:false,
      agree:false,
      form: {
        name: '',
        iosName:'',
        androidName: '',
        channelName:'',
        appIconUrl:'',
        agree:false,
      },
      rules: {
        name: [{ required: true, message: this.$t('createOemApp.rules.name'), trigger: 'blur' },],
        iosName: [{ required: true, pattern:IOSPACKAGE_REG, message: this.$t('createOemApp.rules.iosName'), trigger: 'blur' },],
        androidName: [{ required: true, pattern:ANDROIDPACKAGE_REG, message: this.$t('createOemApp.rules.androidName'), trigger: 'blur' }],
        appIconUrl: [{ required: true, message: this.$t('customizedApp.createAPP.rules.appIcon'), trigger: 'change' },],
        agree:[{ validator:(rule, value, callback) => {value? callback():callback(this.$t('customizedApp.createAPP.rules.protocol'))},  trigger: 'change' }],
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
        let res = await addApp({...this.form, appDevType:2})
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

    // 图片上传
    uploaded(data){
      this.$set(this.form,'appIconUrl',data.fullPath)
      this.$refs.ruleForm.clearValidate('appIconUrl');
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
.agree{
  margin-left: 196px;
}
.file{
  color: @primary-color;
}

</style>