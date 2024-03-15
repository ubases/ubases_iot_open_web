<template>
  <div class="content user-layout-register">
    <h1>{{$t('user.forget.password.title')}}</h1>
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item v-if="type==0" prop="userName">
        <a-input v-model="form.userName" class="phone-input" autocomplete="off" :placeholder="$t('user.register.phone.placeholder')"></a-input>
      </a-form-model-item>
      <a-form-model-item v-else prop="userName">
       {{ userInfo.userName }}
       <a-input v-show="false" :value="form.userName =userInfo.userName" ></a-input>
      </a-form-model-item>
      <a-form-model-item prop="userPassword">
        <a-input
          autocomplete="off"
          :type="showPassword ?'text':'password'"
          :placeholder="$t('user.register.password.placeholder')"
          v-model="form.userPassword"
        >
          <open-eyes-icon slot="suffix" v-if="showPassword" @click="showPassword= !showPassword"></open-eyes-icon>
          <close-eyes-icon slot="suffix" v-if="!showPassword" @click="showPassword= !showPassword"></close-eyes-icon>
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="passwordSecond">
        <a-input
          autocomplete="off"
          :type="showPasswordSecond ?'text':'password'"
          :placeholder="$t('user.register.password-again.placeholder')"
          v-model="form.passwordSecond"
        >
          <open-eyes-icon slot="suffix" v-if="showPasswordSecond" @click="showPasswordSecond= !showPasswordSecond"></open-eyes-icon>
          <close-eyes-icon slot="suffix" v-if="!showPasswordSecond" @click="showPasswordSecond= !showPasswordSecond"></close-eyes-icon>
        </a-input>
      </a-form-model-item>
      <a-form-model-item class="captcha-form-item" prop="verifyCode">
        <a-input type="text" v-model="form.verifyCode" :placeholder="$t('user.register.verification-code.label')" class="captcha-input">
          <a-button
            class="getCaptcha"
            slot="addonAfter"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            >
            {{ !state.smsSendBtn ? $t('user.register.get-verification-code'):(state.time+' s') }}
          </a-button>
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="register-button"
          :loading="disabled"
          @click.stop.prevent="handleSubmit"
          :disabled="disabled">{{ $t('public.submit') }}
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <modal :visible="visible" :title="$t('user.forget.password.reset.succeed')"/>
  </div>
</template>

<script>
import { getVerificationCodeForExists } from '@/api/login'
import { updateUserPwd, forgetPassword} from '@/api/account'
import { deviceMixin } from '@/store/device-mixin'
import { PHONE_REG, EMAIl_REG, PassWordRules} from '@/utils/validate'
import { OpenEyesIcon,CloseEyesIcon } from '@/core/icons'
import Modal from "./component/Modal.vue"
import { mapGetters } from "vuex";
export default {
  name: 'Register',
  components: {
    OpenEyesIcon,
    CloseEyesIcon,
    Modal,
  },
  mixins: [deviceMixin],
  data () {
    return {
      type:'', // 1 安全设置-修改密码页面  0 login/登录 页面
      form: { 
        userName:'',
        verifyCode:'',
        userPassword:'',
        passwordSecond:'',
      },
      state: {
        time: 60,
        level: 0,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      disabled: false,
      showPassword:false,
      showPasswordSecond:false,
      rules:{
        userName: [
          { required: true, message: this.$t('user.register.phone.valid'), trigger: 'blur' },
          { validator: this.validPhone, trigger: 'blur'}
          ],
        verifyCode:[{ required: true, message: this.$t('user.register.verification-code.valid'), trigger: 'blur' }],
        userPassword: PassWordRules(this.$t('user.register.password.valid')),
        passwordSecond:[
          { required: true, message: this.$t('user.register.password-again.placeholder'), trigger: 'blur' },
          { validator:(rule, value, callback) => { value==this.form.userPassword? callback():callback(this.$t('user.register.password-again.valid'))},  trigger: 'blur' }
          ],
      },
      visible: false
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.type = this.$route.query.type;
  },
  methods: {
    // 校验手机/邮箱
    validPhone(rule, value, callback){
      if(!PHONE_REG.test(value) && !EMAIl_REG.test(value)){callback(this.$t('user.register.phone.correct')) }
      callback()        
    },
     // 提交
    handleSubmit () {
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        const md5 = require('md5')
        const param = {
          userName:this.form.userName,
          verifyCode:this.form.verifyCode,
          newPassword:md5(this.form.passwordSecond)
        }
        const res = this.type == 1? await updateUserPwd(param) : await forgetPassword(param)
        if(res.code == 0) this.visible = true
      });
    },
    //获取验证码
    getCaptcha (e) {
      e.preventDefault()
      this.$refs.form.validateField(['userName'],
        async (err, values) => {
          if (err) return
          this.state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (this.state.time-- <= 0) {
              this.state.time = 60
              this.state.smsSendBtn = false
              window.clearInterval(interval)
            } 
          }, 1000)

          const hide = this.$message.loading(this.$t('user.register.verificationCode.sending'), 0)
          const res = await getVerificationCodeForExists({ userName: this.form.userName, type:this.type == 1 ? 3:2 })
          if( res.code === 0){
            setTimeout(hide, 5000)
          } else {
            setTimeout(hide, 1)
            window.clearInterval(interval)
            this.state.time = 60
            this.state.smsSendBtn = false
          }
          
        }
      )
    },
  },
}
</script>
<style lang="less" scoped>
@import "../../global.less";

  h1{
    margin-bottom: 30px;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    color: @aithings-text-color-black;
    line-height: 40px;
  }
  .content{
    width: 600px;
    margin: 60px auto 0;
    padding: 50px 100px 48px;
    background: #fff;
    box-shadow: 0px 2px 6px 4px rgba(224, 232, 244, 0.4);
    border-radius: 4px;
  }
  .user-layout-register {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
  .user-layout-register {
    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .pre-phone{
      display: block;
      width: 46px;
      
    }
    /deep/.ant-input-group-addon{
      background: 0;
    }
    .phone-input{
      flex: 1;
    }
    .captcha-input{
      flex:1;
    }
    .getCaptcha {
      width: 91px;
      height: 32px;
      border: 0;
      color:@primary-color;
    }

    .register-button {
      width: 100%;
    }
  }
  /deep/.ant-input{
    height: 40px;
    border: 1px solid @aithings-border-color;
  }
  /deep/.ant-btn{
    height: 40px;
  }
  /deep/.ant-input-group-addon{
    border-color: @aithings-border-color;
  }
  /deep/.ant-input::placeholder{
    color: @aithings-text-tips-color;
  }
  /deep/.has-error{
    .ant-input, .ant-input:hover,.ant-input-group-addon{
      border-color: @aithings-color-F5222D;
    }
  } 
  @media (max-width: @screen-xl) {
    .content{
      margin: 20px auto 0;
    }
  }
</style>
