<template>
  <a-modal
    :title="`${data.name}`+$t('optionalConfig.editor.support')"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" class="regular-form" :model="form" :rules="rules"   :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
        <a-form-model-item :label="$t('optionalConfig.editor.label.lang')" prop="lang"  :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-select v-model="form.lang" :placeholder="$t('optionalConfig.editor.placeholder.lang')" :options="langList" @change="langChange"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('optionalConfig.editor.label.guide')" prop="abstract">
          <a-textarea v-model="form.abstract" :auto-size="{ minRows: 3}" :maxLength="500" :placeholder="$t('optionalConfig.editor.placeholder.guide')"/>
        </a-form-model-item>
        <a-form-model-item prop="content" :label="$t('optionalConfig.editor.label.content')">
          <section class="wrap">
            <quill-editor :value="form.content || ''" :readOnly="readOnly" @change="editorChange" />
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
import { getVoiceDoc, editVoiceDoc} from "@/api/optionalConfig"

export default ({
  name:"Editor",
  props:{
    visible: { type: Boolean, default: false },
    data:{ type: Object, default: () => {}},
    readOnly: { type: Boolean, default: false },
  },
  components:{
    QuillEditor
  },

  data () {
    return {
      confirmLoading:false,
      rules:{
        lang: [{ required: true, message: this.$t('optionalConfig.editor.rules.lang'), trigger: 'change' }],
        abstract:[{ required: true, message: this.$t('optionalConfig.editor.rules.guide'), trigger: '' }],
        content: [
          { required: true, message: this.$t('optionalConfig.editor.rules.content.required'), trigger: 'change' },
          { max:"10000", message: this.$t('optionalConfig.editor.rules.content.max'), trigger: 'change' },
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
      this.form['lang'] = 'zh'
      this.getVoiceDoc()
    },
  },
  mounted(){
    this.langList = this.$DictList('language_type')
  },
  methods:{
    async getVoiceDoc(){
      const res = await getVoiceDoc({ ...this.data, lang:this.currentLang })
      if(res.code !== 0 ) return
      this.form = res.data
    },

    editorChange(html){
      this.$set(this.form,'content',html)
    },

    // 切换语种
    langChange(val){
      this.currentLang = val
      this.getVoiceDoc()
    },

    handleCancel(){
      this.$emit('cancel')
      this.$refs.form?.resetFields()
      this.form = {}
    },

    handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await editVoiceDoc({...this.form})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumit')
        this.$refs.form?.resetFields()
        this.form = {}
      });
      
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
/deep/.ant-editor-quill{
  width: 100%;
  border: 1px solid @aithings-border-color;
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
</style>