<template>
  <section>
    <a-modal
      :title="$t('public.import')"
      :width="580"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      :footer="null"
    >
      <a-steps direction="vertical" :current="step">
        <!-- 请不要修改首行语种名称，不要更改语言key值 -->
        <a-step :title="stepOneTitle" :description="stepOneDescription" :class="statusIconList[status].class">
          <template slot="icon">
            <component :is="statusIconList[status].icon" />
          </template>
        </a-step>
        <a-step :title="stepSecondTitle" :description="$t('appMultilingual.upload.description')" />
      </a-steps>
      <a-button type="primary" @click="handleOk">
          {{$t('public.confirm.upload')}}
      </a-button>
    </a-modal>

    <!-- 温馨提示弹窗 -->
    <a-modal
      :title="$t('appMultilingual.warmPrompt')"
      :width="380"
      :visible="remindVisible"
      :confirm-loading="remindLoading"
      @ok="remindOk"
      @cancel="remindCancel"
    > 
      <div class="add-remind">
        <div>{{$t('appMultilingual.upload.remind1')}}</div>
        <div>{{$t('appMultilingual.upload.remind2')}}</div>
      </div>
    </a-modal>
  </section>
</template>
<script>
import {BuildingIcon,ErrorLargeIcon,RightCircleIcon,FaultIcon} from '@/core/icons'
import {uploadLang} from '@/api/multilingual'
export default ({
  name:"leadingIn",
  props:{
    visible: { type: Boolean, default: false },
    data:{ type: Object, default: () => {}} ,
    appId: { type: String, default: "" },
    file: [Object,File],
    error: { type: String, default: "" },
    checking:  { type: Boolean, default: false },
  },
  components:{
    BuildingIcon,
    ErrorLargeIcon,
    RightCircleIcon,
    FaultIcon,
  },
  data () {
    return {
      confirmLoading:false,
      remindLoading:false,
      remindVisible:false,
      step:0,
      statusIconList:{
        1:{ icon:"ErrorLargeIcon", class:"error-text" },
        2:{ icon:"BuildingIcon", class:"" },
        3:{ icon:"RightCircleIcon", class:"success-text" },
        4:{ icon:"FaultIcon", class:"fault-text" },
      },
    }
  },
  mounted(){},
  watch: {
  },
  computed:{
    status(){
      this.step = 0
      if(this.checking) return 2
      if(this.error) return 1
      if(!this.error){
        this.step = 1
        return 3
      } 
    },
    stepOneTitle(){
      if(this.checking) return this.$t('appMultilingual.upload.stepOneTitle.check')
      if(this.error) return this.$t('appMultilingual.upload.stepOneTitle.size')
      if(!this.error) return this.$t('appMultilingual.upload.stepOneTitle.type')
    },
    stepOneDescription(){
      if(this.checking) return this.$t('appMultilingual.upload.stepOneDescription.check')
      if(this.error) return this.error
      if(!this.error) return ''
    },
    stepSecondTitle(){
      return this.$t('appMultilingual.upload.stepSecondTitle')
    }
  },
  methods:{
    async handleOk() {
      this.remindVisible=true;
    },
    async remindOk(){
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("appKey", this.appId);
      const res = await uploadLang(formData)
      if(res.code !== 0) return
      this.remindVisible = false;
      this.$emit("handleOk")
    },
    remindCancel(){
      this.remindVisible=false;
    },
    handleCancel() {
      this.$emit("handleCancel")
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
/deep/.ant-steps-item-container{
  margin-top: 30px;
}
.ant-steps{
  padding-left:70px ;
}
/deep/.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-tail::after{
  height: 54px;
  background-color: @aithings-text-tips-color;
}
/deep/.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after{
  height: 38px;
  background-color: @primary-color;
}
/deep/.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-tail::after{
  background-color:@aithings-text-tips-color;
}
/deep/.ant-steps-item-icon{
  border-color:@aithings-text-tips-color;
}
/deep/.ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon{
  color:@aithings-text-tips-color;
}
/deep/.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title, /deep/.ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-description{
  color: @aithings-text-color-gray;
}
/deep/.ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title, /deep/.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title{
  color: @aithings-text-color-black;
}
 /deep/.ant-steps-item-process.error-text > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title{
  color: @aithings-warning-color-FF8E35;
 }

 /deep/.ant-steps-item-process .ant-steps-item-icon{
  background: #fff;
  border-color: @primary-color;
  .ant-steps-icon{
    color: @primary-color;
  }
 }

.ant-btn-primary{
  margin: 3px 0 60px 117px;
}
.add-remind{
  text-align: center;
  padding: 30px 0 28px;
  font-size: 14px;
  font-weight: 400;
  color: @aithings-text-color-gray;
  line-height: 20px;
}
/deep/.ant-steps-icon{
  padding: 1px 0;
  svg{
    width: 36px;
    height: 36px;
  }
}

</style>