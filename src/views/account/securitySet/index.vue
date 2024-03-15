<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('securitySet.title')">
      <section class="content">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item :label="$t('securitySet.password.label')">
            *******
            <a-button type="link" @click="editPassword">{{$t('securitySet.editPassword.button')}}</a-button>
          </a-form-item>
          <a-form-item :label="$t('securitySet.avoidLogin.label')">
            {{$DictName('avoid_login',securityTime) || $t('securitySet.avoidLogin.default')}}
            <a-button type="link" @click="handleChange">{{$t('securitySet.change.button')}}</a-button>
          </a-form-item>
        </a-form>
      </section>
    </a-page-header>
    <a-modal
      :title="$t('securitySet.changeLogin.title')"
      :visible="visible"
      :width="250"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          :wrapper-col="{ span: 24 }"
        >
          <a-form-model-item prop="loginType">
            <a-select v-model="loginForm.loginType" :options="$DictList('avoid_login')">
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </section>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "SecuritySet",
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
      form: {},
      visible: false,
      confirmLoading: false,
      loginForm: {
        loginType: "",
      },
      rules: {
        loginType: [{ required: true, message: this.$t('securitySet.loginType.rules'), trigger: "blur" }],
      },
    };
  },
  created() {
    this.loginForm.loginType = this.securityTime;
  },
  computed: {
    ...mapGetters(["securityTime"]),
  },
  methods: {
    ...mapMutations(["SET_SECURITY_TIME"]),
    handleChange() {
      this.visible = true;
    },

    editPassword() {
      this.$router.push({ name: "forgotPassword", query: { type: 1 } });
    },
    handleOk() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return;
        await this.SET_SECURITY_TIME(this.loginForm.loginType);
        
        this.visible = false;
      });
    },

    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
</style>