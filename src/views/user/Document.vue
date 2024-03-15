<template>
  <section class="page-wrap no-padding">
    <section class="content" v-html="htmlContent">
    </section>
  </section>
</template>
<script>
import { getDocument } from "@/api/common"

export default ({
  name:"Document",
  data () {
    return {
      htmlContent:'',
      code:''
    }
  },
  mounted(){
    this.code = this.$route.query?.code || ''
    this.getDocumentDetails()
  },
  methods:{
    async getDocumentDetails(){
      const res = await getDocument({platformType:1, code:this.code})
      if(res.code !==0)return
      this.htmlContent = res.data.content
    }

  }
})
</script>

<style lang="less" scoped>
  .page-wrap{
    width: 100%;
    height: 100%;
    padding: 40px 0;
    background: transparent;
  }
  .content {
    max-width: 1180px;
    margin: 0 auto;
    height: 100%;
    background: #fff;
    overflow-y: auto;
  }
</style>