<template>
  <section class="content">
    <div class="help-guide">
      <div>{{$t('multilingual.panel.helpLead.detail')}}</div>
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
        <a-button type="link" size="small" @click="handleCopywriting(record.langKey)">
          {{$t('multilingual.change.operation')}}
        </a-button>
      </template>
    </a-table>
    <!-- 修改文案弹窗 -->
    <change-operation 
      :isCustom="true" 
      :belongId="productDetail.controlPanelId" 
      :productKey="productDetail.productKey"
      :belongType="4" 
      :langKey="langKey" 
      :visible="changeOperationVisible" 
      @handleOk="changeOperation" 
      @handleCancel="cancelChangeOperation"
    ></change-operation>
  </section>
</template>

<script>
import { getCustomResourceList } from "@/api/multilingual";
import changeOperation from "../components/changeOperation";

export default {

  props: {
    productId: { type: String, default: "" },
    productDetail: { type: Object, default: ()=>{}}
  },

  components: {
    changeOperation,
  },

  data() {
    return {
      columns: [
        {
          title: this.$t('multilingual.column.langKey'),
          dataIndex: "langKey",
          scopedSlots: { customRender: "langKey" },
        },
        {
          title: this.$t('multilingual.column.zh'),
          dataIndex: "name",
        },
        {
          title: this.$t('multilingual.column.en'),
          dataIndex: "nameEn",
        },
        {
          title: this.$t('public.action'),
          key: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      langKey:"",
      dataSource: [],
      loading: false,
      changeOperationVisible: false,
    };
  },

  watch: {
    productId() {
      if(this.productDetail.controlPanelId) this.panelLangList()
    },
  },

  mounted(){
    if(this.productDetail.controlPanelId) this.panelLangList()
  },
  
  methods: {

    //获取产品信息
    async panelLangList() {
      const res = await getCustomResourceList({ belongId: this.productDetail.controlPanelId, belongType:4, productKey: this.productDetail.productKey });
      if (res.code !== 0) return
      // 表格数据
      this.dataSource = res.data || []
    },

    //点击修改文案按钮
    handleCopywriting(key) {
      this.langKey = key
      this.changeOperationVisible = true;
    },
    
    // 确认修改
    changeOperation() {
      this.changeOperationVisible = false;
      this.panelLangList()
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