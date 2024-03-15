<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('basicInfo.title')">
      <section class="content">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item :label="$t('basicInfo.userName.label')">
            {{ form.userName }}
          </a-form-model-item>
          <a-form-model-item :label="$t('basicInfo.isRealName.label')">
            {{$DictName('is_real_name', form.isRealName)}}
          </a-form-model-item>
          <a-form-model-item :label="$t('basicInfo.accountType.label')">
            {{$DictName('account_type',form.accountType)}}
          </a-form-model-item>
          <a-form-model-item :label="$t('basicInfo.area.label')" prop="area">
            <a-cascader
              :field-names="{ label: 'chineseName', value: 'id', children:'children'}"
              :options="areaOptions"
              v-model="form.area"
              placeholder="Please select"
            />
          </a-form-model-item>
          <a-form-model-item :label="$t('basicInfo.companyName.label')" prop="companyName">
            <!-- 企业账户处于认证中和认证成功后不可变更名称 -->
            <a-input :disabled="form.accountType == '1' && form.status != 1" v-model="form.companyName" :maxLength="50" />
          </a-form-model-item>
          <a-form-model-item :label="$t('basicInfo.phone.label')" prop="phone">
            <a-input v-model="form.phone"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('basicInfo.email.label')" prop="email">
            <a-input v-model="form.email"></a-input>
          </a-form-model-item>
          <a-form-model-item :label="$t('basicInfo.address.label')" :maxLength="250" prop="address">
            <a-input v-model="form.address"></a-input>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 10, offset: 3 }">
            <a-button type="primary" @click="update">{{$t('public.update')}}</a-button>
          </a-form-model-item>
        </a-form-model>
      </section>
    </a-page-header>
  </section>
</template>
<script>
import { PHONE_REG, EMAIl_REG } from "@/utils/validate";
import { getBaseInfo, updateBaseInfo, } from "@/api/account";
import { areaTreeData } from "@/api/common"
import { mapActions } from "vuex";
export default {
  name: "BasicInfo",
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      areaOptions: [],
      form: {},
      rules: {
        phone: [
          {
            pattern: PHONE_REG,
            message: this.$t('basicInfo.phone.rules'),
          },
        ],
        email: [
          {
            pattern: EMAIl_REG,
            message: this.$t('basicInfo.email.rules'),
          },
        ],
      },
    };
  },
  created() {
    this.getAuthentication()
    this.areaTreeData()
  },
  methods: {
    ...mapActions(["GetInfo"]),
    
    // 获取基本用户信息
    async getAuthentication() {
      const res = await getBaseInfo()
      if (res.code !== 0) return
      this.form = res.data
    },

    // 区域树形结构
    async areaTreeData(){
      const res = await areaTreeData(0,true)
      if(res.code !== 0 ) return
      this.areaOptions = res.data
    },

    // 更新
    update() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return;
        const res = await updateBaseInfo(this.form)
        if(res.code !== 0) return
        this.$message.success(this.$t('public.update.success'))
        this.GetInfo()
      });
    },
  },
};
</script>

<style lang="less" scoped>
  @import "../../../global.less";
  @import "../../../utils/utils.less";
  .ant-form{
    .ant-form();
    .ant-btn{
      padding: 0 28px;
      background: @primary-color;
      border: 1px solid @primary-color;
    }
  }
</style>