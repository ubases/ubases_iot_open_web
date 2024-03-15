<template>
  <section class="page-wrap">
    <section class="flex container">
      <section class="login-main-left">
        <div class="login-main-left-top">
          <a-row type="flex" justify="center">
            <a-col class="login-title" :span="24">{{$t("login.title")}}</a-col>
            <a-col class="desc-item" :span="24"><div>{{$t("login.desc")}}</div></a-col>
          </a-row>
        </div>
        <div class="login-main-left-bottom"></div>
      </section>
      <section class="login-wrap">
        <h1 class="login-name">{{$t("login.name")}}</h1>
        <a-form-model id="formLogin" class="user-layout-login" ref="formLogin" :rules="rules" :model="form">
          <a-form-model-item class="username-item" prop="username">
            <a-input
              size="large"
              type="text"
              autocomplete="false"
              :placeholder="$t('login.account')"
              v-model="form.username"
              @keydown.enter="handleSubmit"
            >
              <account-icon slot="prefix"></account-icon>
            </a-input>
          </a-form-model-item>
          <a-form-model-item class="password-item" prop="password">
            <a-input
              size="large"
              :type="showPassword?'text':'password'"
              autocomplete="false"
              :placeholder="$t('login.password')"
              v-model="form.password"
              @keydown.enter="handleSubmit"
            >
            <password-icon slot="prefix"></password-icon>
            <open-eyes-icon slot="suffix" v-if="showPassword" @click="showPassword= !showPassword"></open-eyes-icon>
            <close-eyes-icon slot="suffix" v-if="!showPassword" @click="showPassword= !showPassword"></close-eyes-icon>
            </a-input>
          </a-form-model-item>
          <a-form-model-item class="rememberpassword-item">
            <section class="rememberpassword-wrap">
              <a-checkbox v-model="rememberMe">{{ $t('login.rememberpassword') }}</a-checkbox>
              <span class="fogot-password" @click="toFogotPassword">{{$t('login.fogot.password')}}</span>
            </section>
          </a-form-model-item>
          <a-form-model-item class="login-item">
            <a-button
              size="large"
              type="primary"
              @click="handleSubmit"
              class="login-button"
              :loading="loginLoading"
              :disabled="loginLoading"
              >{{ $t("login.submit") }}</a-button>
          </a-form-model-item>
        </a-form-model>
      </section>
    </section>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { timeFix } from "@/utils/util";
import { AccountIcon,PasswordIcon,OpenEyesIcon,CloseEyesIcon } from '@/core/icons'
import cookies from '@/utils/cookies'
import { setAvoidLogin } from '@/utils/avoidLogin'
import { PHONE_REG, EMAIl_REG,PassWordRules} from '@/utils/validate'
export default {
  data() {
    return {
      form: {
        username:'',
        password:''
      },
      loginLoading: false,
      showPassword: false,
      rememberMe:false,
      rules:{
        username: [{ required: true, message: this.$t('login.please input login account'),trigger: '' },  { required: true, validator: this.validPhone,trigger: ''},  ],
        password: PassWordRules(this.$t('login.please input login password'))
      }
    };
  },
  components:{
    AccountIcon,
    PasswordIcon,
    OpenEyesIcon,
    CloseEyesIcon
  },
  computed:{
    ...mapGetters(["securityTime"]),
  },
  mounted() {
    this.form.username = cookies.getCookie('username') || ''
    this.form.password = cookies.getCookie('password') || ''
    this.rememberMe = cookies.getCookie('rememberMe') == 'true' ? true : false
  },
  methods: {
    ...mapActions(["Login"]),
    handleSubmit() {
      this.loginLoading = true;
      this.$refs.formLogin.validate(async(valid) => {
        this.loginLoading = false;
        if (!valid) return
        const md5 = require('md5')
        const password = md5(this.form.password)
        const loginParams = { ...this.form, password, channel:"pc" , platformtype: "open" };
        loginParams.verifyCode = '9999'; // 验证码
        const res = await this.Login(loginParams)
        if(this.rememberMe){
          cookies.setCookie('username', this.form.username, 30)
          cookies.setCookie('password', this.form.password, 30)
          cookies.setCookie('rememberMe', true, 30)
        } else{
          cookies.setCookie('username', '', 30)
          cookies.setCookie('password', '', 30)
          cookies.setCookie('rememberMe', false, 30)
        }
        if(this.securityTime){
          setAvoidLogin(res.data.token)
        }
        this.loginSuccess(res)   
      });
    },
    loginSuccess(res) {
      this.toast(res);
      if (res.code === 0) {
        this.$router.push({ path: "/dashboard/index" });
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            key:'login',
            message: this.$t('login.welcome'),
            description: `${timeFix()}，`+this.$t('login.welcome.back'),
          });
        }, 1000);
      }
    },

    // 校验手机/邮箱
    validPhone(rule, value, callback){
      if(!PHONE_REG.test(value) && !EMAIl_REG.test(value)){callback(this.$t('user.register.phone.correct')) }
      callback()        
    },

    toFogotPassword(){
      this.$router.push({name:"forgotPassword",query:{type: 0}})
    },

  },
};
</script>

<style lang="less" scoped>
@import "../../global.less";

.page-wrap{
  width: 960px;
  overflow: hidden;
  border-radius: 4px;
}
.container{
  padding: 0px; 
  height: 540px
}
.login-main-left {
  text-align: center;
  background: #fff;
  padding: 0px;
  height: 100%;
  width: 460px;
  background: linear-gradient(317deg, #73BAFF 0%, #0B5CFF 100%);
  background: -webkit-linear-gradient(317deg, #73BAFF 0%, #0B5CFF 100%);
  background: -o-linear-gradient(317deg, #73BAFF 0%, #0B5CFF 100%);
  background: -moz-linear-gradient(317deg, #73BAFF 0%, #0B5CFF 100%);
  box-shadow: 0px 4px 8px 0px rgba(166,196,255,0.4000);

}

.login-main-left .login-main-left-top {
  height: 133px;
}
.login-main-left .login-main-left-top > div > div {
  font-size: 1.8em;
  color: #fff;
}
.login-main-left .login-main-left-top > div > .desc-item {
  color: #fff;
  text-align: left;
  font-size: 16px;
}
.login-main-left .login-main-left-bottom {
  height: calc(100% - 133px);
  border: 0px solid blue;
  background: url(../../assets/image/login_left.png);
  background-repeat: no-repeat;
  background-position: center;
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
    .register {
      float: right;
    }
  }
}
/deep/ .ant-input{
  height: 40px;
  border: 1px solid @aithings-border-color;
  color: @aithings-text-tips-color;
}
/deep/.ant-checkbox + span{
  color: @aithings-text-color-gray;
}
/deep/ .ant-input-affix-wrapper .ant-input:not(:first-child){
  padding-left: 44px;
}
/deep/ .has-error .ant-form-explain, .has-error .ant-form-split{
  text-align: left;
}
.to-register-wrap{
  text-align: center;
}
/deep/.ant-checkbox-checked .ant-checkbox-inner{
  color: @primary-color;
}
.login-title{
  font-size: 24px;
  color: #fff;
  text-align: left;
  line-height: 33px;
  margin-bottom: 0px;
  padding-left: 30px;
  padding-top: 40px;
  font-weight: 400;
}
.desc-item {
  font-size: 14px;
  margin-top: 15px;
  padding-left: 30px;
  line-height: 20px;
}
.login-wrap {
  text-align: center; 
  padding: 90px 99px; 
  width: 500px;
}
.login-name{
  color: @primary-color;
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 50px;
  line-height: 33px;
}
.username-item {
  margin-bottom: 18px;
}
.password-item,.rememberpassword-item {
  margin-bottom: 6px;
}
.rememberpassword-wrap {
  display:flex;
  justify-content: space-between;
}
.fogot-password {
  color:@primary-color;
  cursor: pointer;
}
.login-item {
  margin-top: 20px
}
.to-register {
  color:@aithings-text-color-gray;
}
.to-register-btn {
  color:@primary-color;
  cursor: pointer;
}
/* 移动端（平板，小于等于 1200px） */
@media (max-width: 1200px) { 
  .container{
    height: 400px;
  }
  .page-wrap{
    width: 640px;
  }
  .login-main-left{
    display: none;
  }
  .login-wrap{
    padding: 30px 30px 0 30px;
    width: 100%;
    height: 90%;
  }
  .login-name{
    margin-bottom: 30px;
  }
 
}
/* 移动端（平板，小于等于 991px） */
@media (max-width: 767px) { 
  .container{
    height: 400px;
  }
  .page-wrap{
    width: 340px;
  }
  .login-wrap{
    padding: 40px 20px 0 30px;
  }
}
</style>
