<template>
  <a-modal
    :title="$t('multilingual.change.operation')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="isCustom ? saveCustomResource() : handleOk()"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 15 }"
      >
        <a-form-model-item ref="languagekey" :label="$t('multilingual.column.langKey')" prop="languagekey">
          {{ isCustom ? langKey : sourceRowId }}
        </a-form-model-item>
        <div v-for="(item, index) in langList" :key="index">
          <a-form-model-item
            ref="simplifiedChinese"
            :label="$DictName('language_type', item.lang)"
            :prop="item.lang"
          >
            <a-input
              v-model="form[item.lang]"
              :maxLength="20"
              :placeholder="$t('multilingual.lang.text.limit')"
            />
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import { getTranslation, saveTranslation, getCustomResourceDetail, saveCustomResource } from "@/api/multilingual";
export default {
  name: "changeOperation",
  props: {
    visible: { type: Boolean, default: false },
    data: { type: Object, default: () => {} },
    sourceRowId: { type: String, default: "" },
    sourceTable: { type: String, default: "" },
    fieldName: { type: String, default: "" },  //产品表：name  功能表：identifier  配网引导：instruction 
    isCustom: { type: Boolean, default: false },
    langKey: { type: String, default: "" },
    belongType: { type: Number, default: 0 },
    belongId: { type: String, default: "" },
    productKey: { type: String, default: "" },
    defaultVal: { type: String, default: "" },
    defaultValEn: { type: String, default: "" },
  },
  data() {
    return {
      confirmLoading: false,
      form: {},
      rules: {
        zh: [{ required: true, message: this.$t('multilingual.lang.zh.rules'), trigger: "" }],
        en: [{ required: true, message: this.$t('multilingual.lang.en.rules'), trigger: "" }],
      },
      langList: [],
      
    };
  },
  mounted() {},
  watch: {
    visible(val) {
      if(!val) return
      this.isCustom ? this.getCustomResourceDetail() : this.getTranslation()
    },
  },
  methods: {
    // 资源翻译详情
    async getCustomResourceDetail(){
      const res = await getCustomResourceDetail({
        belongId: this.belongId,
        belongType: this.belongType,
        langKey: this.langKey,
        productKey: this.productKey
      })
      if (res.code !== 0) return
      this.langList = res.data.translateList
      let form = {}
      res.data.translateList.forEach((v) => {
        form[v.lang] = v.value
      });
      this.form = form
    },

    // 翻译保存提交
    async saveCustomResource(){
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        this.confirmLoading = true
        const list = Object.entries(this.form).map((item)=>{
          return {
            langKey: this.langKey,
            value: item[1],
            lang: item[0],
          }
        })
        let params = {
          belongId: this.belongId,
          belongType: this.belongType,
          translateList: list,
          productKey: this.productKey
        }
        const res = await saveCustomResource(params)
        this.confirmLoading = false
        if(res.code !== 0 ) return
        this.$emit("handleOk")
      })
    },

    // 获取语言翻译
    async getTranslation() {
      const res = await getTranslation({
        sourceTable: this.sourceTable,
        sourceRowId: this.sourceRowId,
        defaultVal: this.defaultVal,
        defaultValEn: this.defaultValEn,
      });
      if (res.code !== 0) return
      this.langList = res.data
      let form = {};
      res.data.forEach((v) => {
        form[v.lang] = v.fieldValue
      });
      this.form = form
    },

    //点击确认修改数据
    handleOk() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.confirmLoading = true;
        const list = Object.entries(this.form).map((item)=>{
          return {
            fieldName: this.fieldName,
            fieldValue: item[1],
            lang: item[0],
          }
        })
        let params = {
          sourceTable: this.sourceTable,
          sourceRowId: this.sourceRowId,
          translateList:list,
        }
        const res = await saveTranslation(params)
        this.confirmLoading = false
        if(res.code !== 0 ) return
        this.$emit("handleOk")
        this.$refs.ruleForm?.resetFields()
      });
    },

    handleCancel() {
      this.$emit("handleCancel")
      this.$refs.ruleForm?.resetFields()
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../../global.less";
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
.ant-radio-wrapper {
  color: @aithings-text-color-black;
}
</style>