<template>
  <section class="content">
    <div class="help-guide">
      <div>{{$t('multilingual.productName.helpLead')}}：</div>
      <div>{{$t('multilingual.productName.helpLead.detail1')}}</div>
      <div>{{$t('multilingual.productName.helpLead.detail2')}}</div>
      <div>{{$t('multilingual.productName.helpLead.detail3')}}</div>
    </div>
    <a-table
      size="small"
      rowKey="id"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="false"
    >
      <template v-slot:operation="record">
        <a-button type="link" size="small" @click="handleCopywriting(record)">
          {{$t('multilingual.change.operation')}}
        </a-button>
      </template>
    </a-table>
    <!-- 修改文案弹窗 -->
    <change-operation 
    fieldName="name" 
    :sourceRowId="sourceRowId" 
    sourceTable="opm_product_name" 
    :defaultVal="defaultVal"
    :defaultValEn="defaultValEn"
    :visible="changeOperationVisible" 
    @handleOk="changeOperation" 
    @handleCancel="cancelChangeOperation"
    ></change-operation>
  </section>
</template>

<script>

import { productLangList } from "@/api/multilingual";
import changeOperation from "../components/changeOperation";

export default {
  props: {
    productId: { type: String, default: "" },
  },

  components: {
    changeOperation,
  },

  data() {
    return {
      originColumns: [
        {
          title: this.$t('multilingual.productName.column.name'),
          dataIndex: "name",
          key: "name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: this.$t('multilingual.column.langKey'),
          dataIndex: "productKey",
          scopedSlots: { customRender: "productKey" },
        },
        {
          title: this.$t('multilingual.column.zh'),
          dataIndex: "zh",
        },
        {
          title: this.$t('multilingual.column.en'),
          dataIndex: "en",
        },
        {
          title: this.$t('public.action'),
          key: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      columns:[],
      sourceRowId:"",
      dataSource: [],
      loading: false,
      changeOperationVisible: false,
      defaultVal:'',
      defaultValEn:''
    };
  },

  watch: {
    productId() {
      this.productLangList();
    },
  },

  mounted(){
    if(this.productId)this.productLangList()
  },

  methods: {

    //获取产品信息
    async productLangList() {
      this.columns = [...this.originColumns]
      const res = await productLangList({ productId: this.productId });
      if (res.code !== 0) return;
      // 表格列的配置描述
      let langTypes = res.data.langTypes || []
      langTypes.forEach(item=>{
        item.title = item.name
        item.dataIndex = item.code
      })
      this.columns.splice(4,0,...langTypes)

      // 表格数据
      this.dataSource = res.data?.list ?? []
      const langList = [...langTypes,{code:'zh'},{code:'en'}]
      this.dataSource.forEach((value) => {
        langList.forEach((item) => {
          value[item.code] = value[item.code].fieldValue
        });
      });
    },

    //点击修改文案按钮
    handleCopywriting(data) {
      this.sourceRowId = data.productKey
      this.defaultVal = data.zh
      this.defaultValEn = data.en
      this.changeOperationVisible = true;
    },

    // 确认修改
    changeOperation() {
      this.changeOperationVisible = false;
      this.productLangList()
    },
    
    //关闭弹窗
    cancelChangeOperation() {
      this.changeOperationVisible = false;
    },
  },
};
</script>

<style  lang="less" scoped>
@import "../../../../global.less";
.ant-btn-link {
  padding-left: 0;
}
.help-guide {
  padding-bottom: 20px;
  font-size: 12px;
  font-weight: 400;
  color: @aithings-text-color-gray;
  line-height: 18px;
}
</style>