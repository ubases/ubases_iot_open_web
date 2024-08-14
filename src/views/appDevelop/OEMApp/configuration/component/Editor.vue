<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" class="regular-form" :model="form" :rules="rules">
        <a-form-model-item :label="$t('editor.label.version')" prop="version"  :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }">
          {{ form.version }}
        </a-form-model-item>
        <a-form-model-item v-if="contentType!=3" :label="$t('editor.label.remindType')" prop="remindMode"  :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }">
          <a-radio-group :disabled="editType=='check'" :options="$DictList('protocol_remind_type')" v-model="form.remindMode"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('editor.label.lang')" prop="lang"  :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }">
          <a-select v-model="form.lang" :placeholder="$t('editor.placeholder.lang')" :options="langList" @change="langChange"/>
        </a-form-model-item>
        <a-form-model-item prop="content" label="">
          <section class="wrap" v-if="visible">
            <quill-editor :value="form.content" :readOnly="readOnly" @change="editorChange" />
          </section>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button key="cancel"  @click="handleCancel">{{$t('public.cancel')}}</a-button>
      <a-button v-if="!readOnly" key="submit" type="primary"  @click="handleOk">{{$t('public.save')}}</a-button>
    </template>
  </a-modal>
</template>

<script>
import QuillEditor from "@/components/Editor/QuillEditor.vue"
import { getAppDocumentDetail, addAppDocument, editAppDocument} from "@/api/appExploit"

export default ({
  name:"Editor",
  props:{
    appId: { type: String, default: '' },
    visible: { type: Boolean, default: false },
    data:{ type: Object, default: () => {}},
    title: { type: String, default: '' },
    contentType: { type: Number, default: 1 },
    readOnly: { type: Boolean, default: false },
    editType: { type: String, default: '' },
  },
  components:{
    QuillEditor
  },

  data () {
    return {
      confirmLoading:false,
      rules:{
        remindMode:[{ required: true, message: this.$t('editor.rules.remindType'), trigger: 'change' }],
        lang:[{ required: true, message: this.$t('editor.rules.lang'), trigger: 'change' }],
        content:[
          { required: true, message: this.$t('editor.rules.content.1'), trigger: 'change' },
          { max:"10000", message: this.$t('editor.rules.content.2'), trigger: 'change' },
        ],
      },
      form:{},
      langList:[],
      currentLang:1
    }
  },
  watch:{
    visible(val){
      if(!val) return
      this.currentLang = 'zh'
      if(this.editType !== 'add'){
        this.getAppDocumentDetail()
      } else{
        this.form = {remindMode:1, ...this.data, lang:this.currentLang}
      }
    },
  },
  mounted(){
    this.langList = this.$DictList('language_type')
  },
  methods:{
    async getAppDocumentDetail(remindMode){
      this.confirmLoading = true
      const { appId, contentType, version } = this.data
      const res = await getAppDocumentDetail({ appId, contentType, version, lang:this.currentLang })
      if(res.code !== 0 ) return
      this.$nextTick(()=>{
        this.form = {...res.data, remindMode:remindMode?remindMode:res.data.remindMode || 1}
        this.$nextTick(()=>{
          this.confirmLoading = false
        })
      })
    },

    editorChange(html){
      this.$set(this.form,'content',html)
    },

    // 切换语种
    langChange(val){
      this.currentLang = val
      this.$set(this.form,'content','')
      this.getAppDocumentDetail(this.form.remindMode)
    },

    handleCancel(){
      this.$emit('cancel')
    },

    handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = this.editType == 'add'? await addAppDocument({...this.form}) : await editAppDocument({...this.form})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumit')
      });
      
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
/deep/.ant-editor-quill{
  width: 100%;
  .ql-container{
    height: 500px;
  }
  .ql-toolbar.ql-snow,.ql-container.ql-snow{
    border: 0;
  }
  .ql-container.ql-snow{
    border-top: 1px solid @aithings-border-color;
  }
}
.wrap{
  position: relative;
  width: 88%;
  margin: 0 auto;
}
</style>