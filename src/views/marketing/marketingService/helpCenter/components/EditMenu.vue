<template>
  <a-modal
    :title="`${id ? $t('public.edit'):$t('public.add')}${parentId == '0' ? $t('helpCenter.editMenu.Level1.title'):$t('helpCenter.editMenu.Level2.title')}`"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-model-item :label="$t('helpCenter.editMenu.label.dirImg')" prop="dirImg">
          <upload-button 
              accept="image/jpeg,image/png,image/x-ms-bmp"
              :acceptList="['image/png','image/jpeg','image/x-ms-bmp']"
              :limitSize="1"
              :limitWidth="120"
              :limitHeight="120"
              warningFileType="JPG,GPEG,PNG,BMP"
              catalogName="helpCenter"
              :imgWrapWidth="64"
              :imgWrapHeight="64"
              :fileUrl="form.dirImg || showDefaultImg()"
              :buttonText="$t('public.upload.icon')"
              @uploaded="uploaded"
            />
          <p class="image-tips">{{$t('helpCenter.editMenu.dirImg.limit')}}</p>
          <p class="image-tips">{{$t('helpCenter.editMenu.dirImg.use')}}</p>
        </a-form-model-item>
        <a-form-model-item :label="$t('helpCenter.catalog.sort')" prop="sort">
          <a-input-number
              v-model="form.sort"
              :precision="0"
              :min="0"
              :max="150"
              :placeholder="$t('helpCenter.setDoc.placeholder.sort')"
            />
        </a-form-model-item>
        <div v-for="(item, index) in langList" :key="index">
          <a-form-model-item
            ref="simplifiedChinese"
            :label="item.langName"
            :prop="item.lang"
          >
            <a-input
              v-model="form[item.lang]"
              :maxLength="50"
              :placeholder="$t('helpCenter.editMenu.rules.word.limit')"
            />
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { getDirectoryDetail, addDirectory, editDirectory } from "@/api/helpCenter";
import UploadButton from "@/components/uploadButton"
import { ZhEnNumberRules, EnNumberBlankRules } from "@/utils/validate"
export default {
  name: "EditMenu",
  components:{
    UploadButton
  },
  props: {
    visible: { type: Boolean, default: false },
    id: { type: String, default: '' },
    parentId: { type:String, default:''},
    docId: { type: String, default: '' },
    langList:{ type:Array, default:[]}
  },
  data() {
    return {
      confirmLoading: false,
      form: {},
      rules: {
        zh: ZhEnNumberRules(this.$t('helpCenter.editMenu.rules.zh')),
        en: EnNumberBlankRules(this.$t('helpCenter.editMenu.rules.en')),
      },
      defaultFirstMenu: 'https://osspublic.aithinker.com/helps/dir1.png',
      defaultSecondMenu: 'https://osspublic.aithinker.com/helps/dir2.png',
      // isLoading:false,
    };
  },
  mounted() {},
  watch: {
    visible(val) {
      if(!val) return
      if(this.id)this.getDirectoryDetail()
    },
  },
  methods: {
    // 获取语言翻译
    async getDirectoryDetail() {
      const res = await getDirectoryDetail({ id: this.id})
      if (res.code !== 0) return
      let form = {
        dirImg: res.data.dirImg || '',
        sort:  res.data.sort ?? 0
      }
      res.data?.docDirLangs?.forEach((v) => {
        form[v.lang] = v.dirName
      });
      this.form = form;
    },

    //点击确认修改数据
    handleOk() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        const list = this.langList.map(item=>{
          return {
            lang: item.lang,
            langName: item.langName,
            dirName: this.form[item.lang],
          }
        })
        let params = {
          id:this.id,
          docId: this.docId,
          parentId: this.parentId,
          dirImg: this.form.dirImg || (this.parentId == '0' ? this.defaultFirstMenu : this.defaultSecondMenu),
          sort: this.form.sort,
          docDirLangs: list
        }
        const res = this.id ? await editDirectory(params) : await addDirectory(params)
        this.confirmLoading = false
        if(res.code !== 0 ) return
        this.$emit("handleOk");
        this.$refs.ruleForm?.resetFields()
        this.form={}
      });
    },

    handleCancel() {
      this.$emit("handleCancel")
      this.$refs.ruleForm?.resetFields()
      this.form={}
    },

    // 显示默认图片
    showDefaultImg(){
      if(this.parentId == '0'){
        return this.defaultFirstMenu
      } else {
        return this.defaultSecondMenu
      }
    },

    // 图片上传
    uploaded(data){
      this.$set(this.form,'dirImg',data.fullPath)
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../../../../global.less";
.ant-modal .ant-modal-body .ant-form-item {
  margin-bottom: 20px;
}
/deep/.ant-modal-header {
  padding: 26px 35px 23px;
}
/deep/.ant-form-item-label {
  line-height: 34px;
}
/deep/.ant-form-item-control {
  line-height: 34px;
}
/deep/.upload-button-wrap{
  margin-bottom: 10px;
}
.image-tips{
  line-height: 24px;
  color: @aithings-text-tips-color;
}
.ant-input-number{
  width: 100%;
}
</style>