<template>
  <a-modal
    :title="docId? $t('helpCenter.createHelpDoc.title.edit') : $t('helpCenter.createHelpDoc.title.create')"
    :width="840"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model  ref="ruleForm" class="regular-form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item ref="name" :label="$t('helpCenter.createHelpDoc.label.name')" prop="name">
          <a-input v-model="form.name" :maxLength="20" :placeholder="$t('helpCenter.createHelpDoc.placeholder.name')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.createHelpDoc.label.apps')" prop="apps">
          <a-checkbox-group v-model="form.apps" :options="appOptions" />
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.createHelpDoc.label.langs')" prop="langs">
          <a-checkbox-group v-model="form.langs" :options="langsOptions" @change="suportLangChange"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.createHelpDoc.label.remainLang')" prop="remainLang">
          <div class="select-wrap">
            <a-select v-model="form.remainLang" :options="remainOptions" :placeholder="$t('helpCenter.createHelpDoc.placeholder.remainLang')" />
          </div>
          <p class="remind">{{$t('helpCenter.createHelpDoc.remainLang.tips')}}</p>
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.createHelpDoc.label.isSucceedPUbDoc')" prop="isSucceedPUbDoc">
          <div v-if="docId">{{$DictName('yes_no',form.isSucceedPUbDoc)}}</div>
          <a-radio-group v-if="!docId" v-model="form.isSucceedPUbDoc" :options="$DictList('yes_no')" />
        </a-form-model-item>
        <a-form-model-item v-if="form.isSucceedPUbDoc === 1" :label="$t('helpCenter.createHelpDoc.label.selectOEM')" prop="id">
          <div v-if="docId">{{form.helpCenterName + ' ' + form.version}}</div>
          <div class="select-wrap" v-if="!docId">
            <a-select v-model="form.id" :options="oemDomOptions" :placeholder="$t('helpCenter.createHelpDoc.placeholder.selectOEM')" />
          </div>
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.createHelpDoc.label.succeedPubDoc')" prop="succeedPubDoc">
          <a-checkbox-group v-model="form.succeedPubDoc" :options="pubOptions" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col = "{ span: 15, offset: 6 }">
          <section class="btn-wrap flex">
            <a-button type="primary" :loading="confirmLoading" @click="handleOk">
              {{$t('public.sumit')}}
            </a-button>
            <a-button @click="handleDelete">
              {{$t('public.delete')}}
            </a-button>
            <a-button @click="handleCancel">
              {{$t('public.cancel')}}
            </a-button>
          </section>
          
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { getAppList,getPubLangs,addAppDoc,editAppDoc,appDocDetail, getPublishDocList,deletePublishDoc } from '@/api/helpCenter'

export default ({
  name:"CreateHelpDoc",
  props:{
    visible: { type: Boolean, default: false },
    docId: { type: String, default: ''}
  },

  data () {
    return {
      confirmLoading:false,
      form: {
        langs:['zh','en'],
        succeedPubDoc:['zh','en'],
      },
      rules: {
        name: [{ required: true, message: this.$t('helpCenter.createHelpDoc.rules.name'), trigger: 'change' }],
        apps: [{ required: true, message: this.$t('helpCenter.createHelpDoc.rules.apps'), trigger: 'change' }],
        langs: [{ required: true, message: this.$t('helpCenter.createHelpDoc.rules.langs'), trigger: 'change' }],
        remainLang: [{ required: true, message: this.$t('helpCenter.createHelpDoc.rules.remainLang'), trigger: 'change' }],
        isSucceedPUbDoc: [{ required: true, message: this.$t('helpCenter.createHelpDoc.rules.isSucceedPUbDoc'), trigger: 'change' },],
        id: [{ required: true, message: this.$t('helpCenter.createHelpDoc.rules.selectOEM'), trigger: 'change' }],
        succeedPubDoc: [{ required: true, message: this.$t('helpCenter.createHelpDoc.rules.succeedPubDoc'), trigger: 'change' }],
      },
      originApps:[],
      originLangs:[],
      appOptions:[],
      langsOptions:[],
      oemDomOptions:[]
    }
  },
  mounted(){
    this.getPubLangs()
  },

  watch:{
    visible(val){
      if(!val) return
      this.getAppList()
      this.getPublishDocList()
      if(!this.docId) return
      this.appDocDetail()
    }
  },
  computed:{
    remainOptions(){
      if(!this.langsOptions || this.langsOptions.length == 0) return []
      return this.form.langs?.map(item=>{
        const lang =  this.langsOptions.filter(option=>option.value === item)?.pop()
        if(lang){
          return {
            label: lang.label,
            value: lang.value
          }
        }
      })
    },
    pubOptions(){
      if(!this.langsOptions || this.langsOptions.length == 0) return []
      return this.form.langs?.map(item=>{
        return this.langsOptions.filter(option=>option.value === item)?.pop()
      })
    }
  },
  methods:{
    // 获取公版文档
    async getPublishDocList(){
      const res = await getPublishDocList({page:0})
      if(res.code !== 0) return
      this.oemDomOptions = res.data?.list?.map(item => {
        return {
          value: item.id,
          label: `${item.name}${item.version}`,
          version: item.version,
          name: item.name,
        }
      }) || []
    },

    // 获取文档详情
    async appDocDetail(){
      const res = await appDocDetail({docId: this.docId})
      if(res.code !== 0 ) return
      const data =  res.data
      const apps = data.apps.map(item=> item.appId)
      const langs = data.langs.map(item=> item.lang)
      const succeedPubDoc = data.succeedPubDoc.map(item=> item.lang)
      this.form = {
        ...res.data,
        apps,
        langs,
        succeedPubDoc
      }
    },

    // 确认
    handleOk() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        const apps = this.form.apps.map(item => {
          return this.originApps.filter(app=> app.appId === item).pop()
        })
        const langs = this.form.langs.map(item => {
          return this.originLangs.filter(lang=> lang.lang === item).pop()
        })
        const succeedPubDoc = this.form.succeedPubDoc.map(item => {
          return this.originLangs.filter(lang=> lang.lang === item).pop()
        })
        const params = {
          ...this.form,
          apps,
          langs,
          succeedPubDoc,
        }
        if(this.form.id && !this.docId){
          const data = this.oemDomOptions?.filter(item=>item.value === this.form.id)?.pop() || ''
          params['version'] = data.version
          params['helpCenterName'] = data.name
        }
        let res = this.docId ? await editAppDoc(params) : await addAppDoc(params)
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.$emit("handleOk")
        this.form = {
          langs:['zh','en'],
          succeedPubDoc:['zh','en'],
        }
        this.$refs.ruleForm?.resetFields()
      });
    },

    handleCancel() {
      this.$emit("handleCancel")
      this.form = {
        langs:['zh','en'],
        succeedPubDoc:['zh','en'],
      }
      this.$refs.ruleForm?.resetFields()
    },


    // 获取全部应用
    async getAppList(){
      const params = {}
      if(this.docId) params.docId = this.docId
      const res = await getAppList(params)
      if (res.code !==0) return
      this.originApps = res.data
      this.appOptions = res.data?.map(item=>{
        return{
          label: item.appName,
          value: item.appId
        }
      })
    },

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

    // 支持语种变化
    suportLangChange(langs){
      if(!this.form.remainLang || this.form.succeedPubDoc.length < 3) return
      if(!langs.some(item=>item == this.form.remainLang)){
        this.$set(this.form,'remainLang','')
      } 
      this.form.succeedPubDoc = this.form.succeedPubDoc.filter(item => langs.some(lang => lang == item))
    },

    // 删除
    handleDelete(){
      this.$ConfirmModal(this, this.$t('helpCenter.catalog.delete.content'), this.$t('helpCenter.catalog.delete.title'),this.$t('public.sumit')).then(async() => {
          const res = await deletePublishDoc({id:this.docId})
          if(res.code !== 0) return
          this.$message.success(this.$t('public.action.succeed'))
          this.$emit("handleOk")
          this.$refs.ruleForm?.resetFields()
        })
      

    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
.regular-form{
  padding-top: 30px;
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
/deep/.ant-input, .select-wrap{
  width: 400px;
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
.btn-wrap{
  .ant-btn+.ant-btn{
    margin-left: 20px;
  }
}

</style>