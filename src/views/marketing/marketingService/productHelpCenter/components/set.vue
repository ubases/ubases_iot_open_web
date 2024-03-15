<template>
  <a-modal
    :title="$t('helpCenter.setDoc.title')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :okText="$t('public.save')"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" class="regular-form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item :label="$t('productHelpcenter.label.name')" prop="name">
          {{form.productName}}
        </a-form-model-item>
        <a-form-model-item ref="name" :label="$t('productHelpcenter.label.productKey')" prop="productKey">
          {{form.productKey}}
        </a-form-model-item>
        <a-form-model-item :label="$t('productHelpcenter.label.lang')" prop="langs">
          <a-checkbox-group v-model="form.langs" :options="langsOptions" @change="suportLangChange"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('productHelpcenter.label.remainLang')" prop="remainLang">
          <div class="select-wrap">
            <a-select v-model="form.remainLang" :options="remainOptions" :placeholder="$t('productHelpcenter.placeholder.remainLang')" />
          </div>
          <p class="remind">{{$t('helpCenter.createHelpDoc.remainLang.tips')}}</p>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { getHelpDetail, updateHelpConfig } from '@/api/productHelpCenter'
import { getPubLangs } from '@/api/helpCenter'

export default ({
  name:"Set",
  props:{
    visible: { type: Boolean, default: false },
    id: { type: String, default: '' },
  },

  data () {
    return {
      confirmLoading:false,
      form: {
        langs:['zh','en'],
      },
      rules: {
        langs: [{ required: true, message: this.$t('productHelpcenter.rules.suportLang'), trigger: 'change' }],
        remainLang: [{ required: true, message: this.$t('productHelpcenter.placeholder.remainLang'), trigger: 'change' }],
      },
      langsOptions:[],
      originLangs:[]
    }
  },

  watch:{
    visible(val){
      if(!val) return
      this.getEntrySeting()
    }
  },

  computed:{
    remainOptions(){
      if(!this.langsOptions || this.langsOptions.length == 0) return []
      return this.form.langs?.map(item=>{
        const lang = this.langsOptions.filter(option=>option.value === item)?.pop()
        if(lang){
          return {
            label: lang.label,
            value: lang.value
          }
        }
      })
    },
  },

  mounted(){
    this.getPubLangs()
  },
  methods:{

    // 获取公版语种
    async getPubLangs(){
      const res = await getPubLangs()
      if(res.code !== 0)return
      this.originLangs = res.data
      this.langsOptions = res.data?.map(item => {
        if(item.lang == 'zh'|| item.lang == 'en'){
          return {
            value: item.lang,
            label: item.langName,
            disabled: true
          }
        }
        return {
          value: item.lang,
          label: item.langName
        }
      });
    },

    // 设置详情
    async getEntrySeting(){
      const res = await getHelpDetail({id: this.id})
      if(res.code !== 0) return
      const langs = res.data.langs.map(item=> item.lang)
      this.form = {...res.data,langs}
    },

    // 支持语种变化
    suportLangChange(langs){
      if(!this.form.remainLang) return
      if(!langs.some(item=>item == this.form.remainLang)) this.$set(this.form,'remainLang','')
    },

    // 确认
    handleOk() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        const langs = this.form.langs.map(item => {
          return this.originLangs.filter(lang=> lang.lang === item).pop()
        })
        let res = await updateHelpConfig({...this.form,langs})
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.$emit("handleOk")
        this.form = {langs:['zh','en']}
        this.$refs.ruleForm?.resetFields()
      });
    },

    handleCancel() {
      this.$emit("handleCancel")
      this.form = {langs:['zh','en']}
      this.$refs.ruleForm?.resetFields()
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
.regular-form{
  padding-top: 30px;
}
.select-wrap{
  width: 400px;
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
.sort-input{
  width: 100%;
}
</style>