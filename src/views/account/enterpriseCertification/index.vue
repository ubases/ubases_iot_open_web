<template>
  <section class="page-wrap no-padding">
      <a-page-header :title="$t('certification.title')" :sub-title="type == 1 ? $t('certification.subtitle') : ''" @back="$router.back()">
        <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
        <section class="content">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item :label="$t('certification.companyName.label')" prop="companyName">
              <a-input v-if="type == 1" v-model="form.companyName"></a-input>
              <span v-if="type == 0" v-text="form.companyName"></span>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.nature.label')" prop="nature">
              <a-select v-if="type == 1" :options="$DictList('company_nature')" v-model="form.nature"></a-select>
              <span v-if="type == 0" v-text="$DictName('company_nature',form.nature)"></span>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.licenseNo.label')" prop="licenseNo">
              <a-input v-if="type == 1" v-model="form.licenseNo"></a-input>
              <span v-if="type == 0" v-text="form.licenseNo"></span>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.license.label')" prop="license">
              <section v-if="type == 1" class="flex y-axis-center">
                <a-input v-show="false" v-model="form.license" />
                <upload-button 
                  accept="image/jpeg,image/png,application/pdf,image/x-ms-bmp"
                  :buttonText="$t('certification.license.label')"
                  :acceptList="['image/jpeg','image/png','application/pdf','image/x-ms-bmp']"
                  :limitSize="5"
                  warningFileType="JPEG,PNG,PDF,BMP"
                  :showFile="false"
                  catalogName="license"
                  @uploaded="e=>uploaded(e,'license','license')"
                />
                <a-button type="link" @click="showImageExample('license',$t('certification.license.text'))">{{$t('certification.demo.label')}}</a-button>
              </section>
              <section>
                <img v-if="form.license" :src="form.license" class="upload-img" @click=" $PreviewModal({ url: form.license })"/>
              </section>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.legalPerson.label')" prop="legalPerson">
              <a-input v-if="type == 1" v-model="form.legalPerson"></a-input>
              <span v-if="type == 0" v-text="form.legalPerson"></span>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.applyPerson.label')" prop="applyPerson">
              <a-input v-if="type == 1" v-model="form.applyPerson"></a-input>
              <span v-if="type == 0" v-text="form.applyPerson"></span>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.idcard.label')" prop="idcard">
              <a-input v-if="type == 1" v-model="form.idcard"></a-input>
              <span v-if="type == 0" v-text="form.idcard"></span>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.idcardImg.label')" prop="idcardImg">
              <section v-if="type == 1">
                <a-input v-show="false" v-model="form.idcardFrontImg" />
                <a-space :size="20">
                  <upload-button 
                    accept="image/jpeg,image/png,application/pdf,image/x-ms-bmp"
                    :buttonText="$t('certification.idcardFrontImg.label')"
                    :acceptList="['image/jpeg','image/png','application/pdf','image/x-ms-bmp']"
                    :limitSize="5"
                    warningFileType="JPEG,PNG,PDF,BMP"
                    :showFile="false"
                    catalogName="idcard"
                    @uploaded="e=>uploaded(e,'idcardFrontImg','idcardImg')"
                  />
                  <upload-button 
                    accept="image/jpeg,image/png,application/pdf,image/x-ms-bmp"
                    :buttonText="$t('certification.idcardAfterImg.label')"
                    :acceptList="['image/jpeg','image/png','application/pdf','image/x-ms-bmp']"
                    :limitSize="5"
                    warningFileType="JPEG,PNG,PDF,BMP"
                    :showFile="false"
                    catalogName="idcard"
                    @uploaded="e=>uploaded(e,'idcardAfterImg','idcardImg')"
                  />
                </a-space>
                <a-input v-show="false" v-model="form.idcardAfterImg" />
                <a-button type="link" @click="showImageExample('IDCard',$t('certification.idcard.text'))">{{$t('certification.demo.label')}}</a-button>
              </section>
              <section class="flex y-axis-center">
                <img v-if="form.idcardFrontImg" :src="form.idcardFrontImg" class="upload-img" @click=" $PreviewModal({ url: form.idcardFrontImg })"/>
                <img v-if="form.idcardAfterImg" :src="form.idcardAfterImg" class="upload-img" @click=" $PreviewModal({ url: form.idcardAfterImg })"/>
              </section>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.phone.label')" prop="phone">
              <a-input v-if="type == 1" v-model="form.phone"></a-input>
              <span v-if="type == 0" v-text="form.phone"></span>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.address.label')" prop="address">
              <a-input v-if="type == 1" v-model="form.address"></a-input>
              <span v-if="type == 0" v-text="form.address"></span>
            </a-form-model-item>
            <a-form-model-item v-if="type == 1" :wrapper-col="{ span: 10, offset: 3 }">
              <a-space>
                <a-button class="cancel-button" @click="handleCancel">{{$t('public.cancel')}}</a-button>
                <a-button class="sumit-button" type="primary" @click="handleAuthentication">{{$t('certification.authentication.button')}}</a-button>
              </a-space>
            </a-form-model-item>
            <a-form-model-item :label="$t('certification.authList.label')" prop="authList">
              <template v-if="form.authList && form.authList.length > 0">
                <section v-for="(item,index) in form.authList" :key="index">
                  【{{item.result}}】{{$t('certification.result')}}：{{item.why}}。{{item.opterTime | momentFilter}}
                </section>
              </template>
              <template v-if="!form.authList || form.authList.length == 0">
                {{$t('certification.noAuthList')}}
              </template>
            </a-form-model-item>
          </a-form-model>
        </section>
      </a-page-header>
    <a-modal
      :title="imageTitle"
      :visible="visible"
      :width="900"
      :centered="true"
      @cancel="closeModal"
    >
    <section class="flex x-axis-center">
      <img v-if="imageUrl === 'license'" :src="require('../../../assets/image/license.jpg')"/>
    </section>
    
    <section v-if="imageUrl === 'IDCard'" class="flex x-space-between card-wrap">
      <section>
        <img :src="require('../../../assets/image/IDCard1.jpg')"/>
        <p class="card-text">{{$t('certification.font')}}</p>
      </section>
      <section>
        <img :src="require('../../../assets/image/IDCard2.jpg')"/>
        <p class="card-text">{{$t('certification.back')}}</p>
      </section>
    </section>
    <template slot="footer">
      <a-button @click="closeModal">{{$t('public.close.text')}}</a-button>
    </template>
    </a-modal>
  </section>
</template>
<script>
import {getCompanyCertification, updateCompanyCertification} from '@/api/account'
import {IDCardRules, EnNumberRules, CommonNameRules, ConnetRules} from "@/utils/validate";
import UploadButton from "@/components/uploadButton"

export default ({
  name:"EnterpriseCertification",
  components:{
    UploadButton
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      form:{},
      rules:{
        companyName:CommonNameRules(this.$t('certification.companyName.rules'),50,1,'blur'),
        nature:[{ required: true, message: this.$t('certification.nature.rules'), trigger: 'blur' }],
        licenseNo:EnNumberRules(this.$t('certification.licenseNo.rules'),'blur'),
        license:[{ required: true, message: this.$t('certification.license.rules'), trigger: 'blur' } ],
        legalPerson:CommonNameRules(this.$t('certification.legalPerson.rules')),
        applyPerson:CommonNameRules(this.$t('certification.applyPerson.rules')),
        idcard:IDCardRules(),
        idcardImg:[{ required: true, validator:(rule, value, callback) => { this.form.idcardFrontImg && this.form.idcardAfterImg? callback():callback(this.$t('certification.idcardImg.rules'))}, trigger: 'change' }],
        phone:ConnetRules(),
        address:[{  min: 0, max: 500, message: this.$t('certification.address.rules'), trigger:'blur',} ]
      },
      visible: false,
      imageTitle:'',
      imageUrl:'',
      type:1
    }
  },
  mounted(){
    this.type = this.$route.query.type
    this.getCompanyCertification()
  },
  methods:{

    // 获取企业信息
    async getCompanyCertification(){
      const res = await getCompanyCertification()
      if (res.code !== 0) return
      this.form = res.data
    },

    // 取消
    handleCancel(){
      this.$router.push({path:'/account/enterpriseInfo/index'})
    },

    // 提交认证
    handleAuthentication(){
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        const res = await updateCompanyCertification(this.form)
        if( res.code !== 0) return
        this.$router.push({path:'/account/enterpriseInfo/index'})
      });
    },

    // 图片上传
    uploaded(data,key,valid){
      this.$set(this.form,key,data.fullPath)
      this.$refs["ruleForm"].clearValidate([valid]);
    },

    // 查看示例图片
    showImageExample(name,title){
      this.imageTitle = title + this.$t('certification.demo.label')
      this.imageUrl = name
      this.visible = true
    },

    closeModal(){
      this.visible = false
    }
  }
})
</script>

<style lang="less" scoped>
@import "../../../global.less";
@import "../../../utils/utils.less";
/deep/.ant-page-header-heading-sub-title{
  padding-left: 11px;
  color: @aithings-warning-color-FF8E35;
}
.ant-form{
  .ant-form();
  .cancel-button{
    margin-top: 30px;
    padding: 0 28px;
    border: 1px solid @primary-color;
    color: @primary-color;
  }
  .sumit-button{
    margin-top: 30px;
    border: 1px solid @primary-color;
    background: @primary-color;
  }
  .ant-btn-link{
    padding-left: 30px;
    color: @primary-color;
  }
}
.card-wrap{
  padding: 100px 50px;
}
.card-text{
  text-align: center;
  padding: 44px 0 0;
}
.upload-img{
  height: 100px;
  width: auto;
  max-width: 40%;
}
</style>