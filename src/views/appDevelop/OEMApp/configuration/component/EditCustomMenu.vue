<template>
    <a-modal
    :title="$t('editCustomMenu.title')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" class="regular-form" :model="data" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-model-item :label="$t('editCustomMenu.label.name')" prop="name" >
          <a-input v-model="data.name" :maxLength="10" :placeholder="$t('editCustomMenu.placeholder.name')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('editCustomMenu.label.webUrl')" prop="webUrl" >
          <a-input v-model="data.webUrl" :placeholder="$t('editCustomMenu.placeholder.webUrl')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('editCustomMenu.label.position')" prop="position" >
          <a-select v-model="data.position" :options="sortList" />
        </a-form-model-item>
        <a-form-model-item :label="$t('public.default.state')" prop="defImage" >
          <section class="flex y-axis-center">
            <upload-card 
              accept="image/png"
              :acceptList="['image/png']"
              :limitWidth="72"
              :limitHeight="72"
              warningFileType="PNG"
              catalogName="app"
              :fileUrl="data.defImage"
              @uploaded="e=>uploaded(e,'defImage')"
            />
            <p class="tips">{{$t('editCustomMenu.image.size')}}</p>
          </section>
        </a-form-model-item>
        <a-form-model-item :label="$t('editCustomMenu.label.selImage')" prop="selImage" >
          <section class="flex y-axis-center">
            <upload-card 
              accept="image/png"
              :acceptList="['image/png']"
              :limitWidth="72"
              :limitHeight="72"
              warningFileType="PNG"
              catalogName="app"
              :fileUrl="data.selImage"
              @uploaded="e=>uploaded(e,'selImage')"
            />
            <p class="tips">{{$t('editCustomMenu.image.size')}}</p>
          </section>
        </a-form-model-item>
        <a-form-model-item :label="$t('editCustomMenu.label.langKey')" v-if="data.position">
          <p>index_tab_{{data.position}}</p>
          <p class="key-tips">{{$t('editCustomMenu.tips')}}</p>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>

import {WEBURL_REG } from "@/utils/validate"
import UploadCard from "@/components/uploadCard"
import { addCustomMenu,editCustomMenu} from "@/api/appExploit"

export default ({
  name:"EditCustomMenu",
  props:{
    visible: { type: Boolean, default: false },
    data:{ type: Object, default: () => {}},
    sortList:{ type: Array, default: () => []},
    id:{ type: String, default:''}
  },
  components:{
    UploadCard,
  },

  data () {
    return {
      confirmLoading:false,
      rules: {
        name: [{required: true, message: this.$t('editCustomMenu.rules.name'), trigger: '',}],
        webUrl: [
          {required: true, message: this.$t('editCustomMenu.rules.webUrl.1'), trigger: '',},
          {pattern: WEBURL_REG, message: this.$t('editCustomMenu.rules.webUrl.2'), trigger: '',}
        ],
        position: [{required: true,message: this.$t('editCustomMenu.rules.position'),trigger: '',}],
        defImage: [{ required: true, message: this.$t('editCustomMenu.rules.defImage'), trigger: 'change' }],
        selImage: [{ required: true, message: this.$t('editCustomMenu.rules.selImage'), trigger: 'change' }],
      },
    }
  },
  methods:{
    async handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = this.data.menuId ? await editCustomMenu({ ...this.data},this.id) : await addCustomMenu({menuId:'', ...this.data},this.id) 
        this.confirmLoading = false
        if(res.code !==0)return
        this.$emit('sumit')
      })
    },
    handleCancel(){
      this.$refs.form?.resetFields()
      this.$emit('cancel')
    },
    
    uploaded(data,type){
      this.$set(this.data,type,data.fullPath)
      this.$refs["form"].clearValidate([type]);
    },
  }
})
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
.tips{
  padding-left: 20px;
  color: @aithings-text-tips-color;
}
.key-tips{
  line-height: 22px;
  color: @aithings-warning-color-FF8E35;
}
</style>