<template>
    <a-modal
    :title="$t('helpCenter.setDoc.title')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model  ref="ruleForm" class="regular-form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-model-item :label="$t('helpCenter.setDoc.select.catalog')" prop="dirId">
          <a-row :gutter="10">
            <a-col :md="12">
              <a-select v-model="form.parentId" :options="parentMenuOptions" :placeholder="$t('helpCenter.setDoc.selectLevel1.directory')" @change="changeParentMenu"/>
            </a-col>
            <a-col :md="12">
              <a-select v-model="form.dirId" :options="childMenuOptions" :placeholder="$t('helpCenter.setDoc.selectLevel2.directory')" />
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item ref="name" :label="$t('helpCenter.setDoc.label.sort')" prop="sort">
          <a-input-number v-model="form.sort"  :placeholder="$t('helpCenter.setDoc.placeholder.sort')" :min="0" :max="1000" :precision="0" class="sort-input"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.setDoc.label.isEnable')" prop="isEnable">
          <a-radio-group v-model="form.isEnable" :options="$DictList('is_doc_enable')" />
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.setDoc.label.isNormal')" prop="isNormal">
          <a-radio-group v-model="form.isNormal" :options="$DictList('yes_no')" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { getEntrySeting, setingEntry} from "@/api/helpCenter"

export default ({
  name:"CreateHelpDoc",
  props:{
    visible: { type: Boolean, default: false },
    setingId:{ type: String, default: ''},
    menuTree: { type: Array, default: []},
    parentId: { type: String, default: '' }
  },

  data () {
    return {
      confirmLoading:false,
      form: {},
      rules: {
        dirId: [{ required: true, message: this.$t('helpCenter.setDoc.rules.dirId'), trigger: 'change' },],
        sort: [{ required: true, message: this.$t('helpCenter.setDoc.rules.sort'), trigger: 'blur' },],
        isEnable: [{ required: true, message: this.$t('helpCenter.setDoc.rules.isEnable'), trigger: 'change' }],
        isNormal: [{ required: true, message: this.$t('helpCenter.setDoc.rules.isNormal'), trigger: 'change' },],
      },
      parentMenuOptions:[],
      childMenuOptions:[]
    }
  },
  watch:{
    visible(val){
      if(!val) return
      this.getEntrySeting()
    }
  },
  mounted(){
    
  },
  methods:{
    // 设置详情
    async getEntrySeting(){
      const res = await getEntrySeting({setingId: this.setingId})
      if(res.code !== 0) return
      const parentId = this.parentId
      const dirId = res.data?.dirId
      this.parentMenuOptions = this.menuTree.map(item=>{
        return {
          label: item.docDirName,
          value: item.id
        }
      }) || []
      this.childMenuOptions = this.menuTree.filter(item => item.id === parentId )?.pop()?.children.map(child=>{
        return {
          label: child.docDirName,
          value: child.id
        }
      }) || []
      this.form = {...res.data,parentId,dirId}
    },
    
    // 切换一级目录
    changeParentMenu(val){
      this.childMenuOptions = this.menuTree.filter(item => item.id === val)?.pop()?.children?.map(child=>{
        return {
          label: child.docDirName,
          value: child.id
        }
      }) || []
      this.form.dirId = ''
    },

    // 确认
    handleOk() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        let res = await setingEntry(this.form)
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.$emit("handleOk")
        this.form = {}
        this.$refs.ruleForm?.resetFields()
      });
    },

    handleCancel() {
      this.$emit("handleCancel")
      this.form = {}
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
.sort-input{
  width: 100%;
}
</style>