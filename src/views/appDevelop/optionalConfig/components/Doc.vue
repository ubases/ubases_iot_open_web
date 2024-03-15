<template>
  <a-modal
    :title="$t('optionalConfig.doc.title')"
    :width="800"
    :visible="visible"
    @cancel="handleCancel"
  >
    <section v-html="content" class="content">
    </section>
    <template slot="footer">
      <a-button key="cancel"  @click="handleCancel">{{$t('optionalConfig.doc.close')}}</a-button>
    </template>
  </a-modal>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { getVoiceDoc} from "@/api/optionalConfig"

export default ({
  name:"Doc",
  props:{
    visible: { type: Boolean, default: false },
    lang: { type: String, default: ''},
    data: { type: Object, default: () => {}},
  },

  data () {
    return {
      content:''
    }
  },

  watch:{
    visible(val){
      if(!val) return
      this.getVoiceDoc()
    },
  },
  
  methods:{

    async getVoiceDoc(){
      const res = await getVoiceDoc({ ...this.data, lang:this.lang })
      if(res.code !== 0 ) return
      this.content = res.data?.content
    },

    handleCancel(){
      this.$emit('cancel')
      this.content = ''
    },

  }
})
</script>
<style lang="less" scoped>
  .content{
    min-height: 300px;
  }
</style>