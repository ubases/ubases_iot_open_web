<template>
  <a-modal
    :title="title"
    :width="840"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" class="regular-form" :model="form" :rules="rules">
        <a-form-model-item :label="$t('helpCenter.editDoc.label.lang')" prop="lang"  :label-col="{ span: 4 }" :wrapper-col="{ span: 13 }">
          <a-select v-model="form.lang" :placeholder="$t('helpCenter.editDoc.placeholder.lang')" :options="langList" @change="langChange"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.editDoc.label.title')" prop="title"  :label-col="{ span: 4 }" :wrapper-col="{ span: 13 }">
          <a-input :disabled="readOnly" v-model="form.title" :placeholder="$t('helpCenter.editDoc.placeholder.title')" :maxLength="50"/>
        </a-form-model-item>
        <a-form-model-item prop="content" :label="$t('helpCenter.editDoc.label.content')" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
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
import { getEntryDetail, updateEntry,getPublishEntryDetail} from "@/api/helpCenter"

export default ({
  name:"EditDoc",
  props:{
    visible: { type: Boolean, default: false },
    setingId:{ type: String, default: ''},
    dirId:{ type: String, default: ''},
    readOnly: { type: Boolean, default: false },
    title:{ type:String, default:''},
    langList: { type:Array, default:[]},
    isPublic: { type: Boolean, default: false},
  },
  components:{
    QuillEditor
  },

  data () {
    return {
      confirmLoading:false,
      rules:{
        lang:[{ required: true, message: this.$t('helpCenter.editDoc.rules.lang'), trigger: 'change' },],
        title:[{ required: true, message: this.$t('helpCenter.editDoc.rules.title'), trigger: 'change' },],
        content:[
          { required: true, message: this.$t('helpCenter.editDoc.rules.content'), trigger: 'change' },
          { max:"10000", message: this.$t('helpCenter.editDoc.rules.content.word.limit'), trigger: 'change' },
        ],
      },
      form:{},
      currentLang:1
    }
  },
  watch:{
    visible(val){
      if(!val) return
      this.currentLang = 'zh'
      if(this.setingId && this.setingId !=='0') this.getEntryDetail()

    },
  },
  mounted(){
  },
  methods:{
    async getEntryDetail(){
      const param = {
        setingId:this.setingId,
        lang:this.currentLang
      }
      const res = this.isPublic? await getPublishEntryDetail(param) : await getEntryDetail(param)
      if(res.code !== 0 ) return
      this.form = res.data
    },

    editorChange(html){
      this.$set(this.form,'content',html)
    },

    // 切换语种
    langChange(val){
      this.currentLang = val
      if(!this.setingId || this.setingId =='0') return
      this.getEntryDetail()
    },

    handleCancel(){
      this.$emit('cancel')
      this.form = {}
      this.$refs.form?.resetFields()
    },

    handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const param ={
          ...this.form,
          setingId: this.setingId,
          dirId: this.dirId
        }
        const res = await updateEntry(param)
        this.confirmLoading = false
        if(res.code !== 0) return
        this.$emit('sumit')
        this.form = {}
        this.$refs.form?.resetFields()
      });
      
    }
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
/deep/.ant-editor-quill{
  width: 100%;
  border: 1px solid @aithings-border-color;
  .ql-container{
    height: 300px;
  }
  .ql-toolbar.ql-snow,.ql-container.ql-snow{
    border: 0;
  }
}


</style>