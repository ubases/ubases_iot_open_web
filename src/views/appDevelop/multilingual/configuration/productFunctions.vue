<template>
  <section class="content">
    <div class="help-guide">{{$t('multilingual.productFunction.helpLead.detail')}}</div>
    <a-table
      size="small"
      :data-source="data"
      :columns="columns"
      :loading="loading"
      :pagination="false"
    >
      <template v-slot:operation="record">
        <a-button
          type="link"
          size="small"
          @click="handleCopywriting(record)"
        >
          {{$t('multilingual.change.operation')}}
        </a-button>
      </template>
    </a-table>
    <!-- 修改文案弹窗 -->
    <change-operation
      :visible="changeOperationVisible"
      :sourceRowId="sourceRowId"
      :defaultVal="defaultVal"
      :defaultValEn="defaultValEn"
      sourceTable="opm_product_things_model"
      fieldName="name"
      @handleOk="changeOperation"
      @handleCancel="cancelChangeOperation"
    ></change-operation>
  </section>
</template>

<script>
const renderContent = (data, key) => {
  var spanArr = [];
  var position = 0;
  data.map((item, index) => {
    if (index === 0) {
      spanArr.push(1);
      position = 0;
    } else {
      if (data[index][key] === data[index - 1][key]) {
        spanArr[position] += 1;
        spanArr.push(0);
      } else {
        spanArr.push(1);
        position = index;
      }
    }
  });
  return spanArr;
};

import changeOperation from "../components/changeOperation";
import { langFuncList } from "@/api/multilingual";

export default {
  props: {
    productId: { type: String, default: "" },
    productKey: { type: String, default: "" },
  },
  components: {
    changeOperation,
  },
  data() {
    return {
      originColumns: [
        {
          title: this.$t('multilingual.productFunction.column.identifier'),
          dataIndex: "identifier",
          scopedSlots: { customRender: "identifier" },
          customRender: (value, row, index) => {
            const obj = {
              children: `${row.name}\r\n${row.identifier}`,
              attrs: {},
            };
            obj.attrs.rowSpan = renderContent(this.data, "identifier", index)[index];
            return obj;
          },
          width: "13%",
        },
        {
          title: this.$t('multilingual.productFunction.column.name'),
          dataIndex: "funcValue",
          width: "10%",
        },
        {
          title: this.$t('multilingual.column.langKey'),
          dataIndex: "langKey",
          width: "13%",
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
      data: [],
      loading: false,
      changeOperationVisible: false,
      sourceRowId:'',
      defaultVal:'',
      defaultValEn:''
    };
  },

  watch: {
    productId() {
      this.langFuncList();
    },
  },

  mounted(){
    if(this.productId)this.langFuncList()
  },

  methods: {
    //获取标准功能列表
    async langFuncList() {
      this.columns = [...this.originColumns]
      const res = await langFuncList({ productId: this.productId });
      if (res.code !== 0) return;
      // 表格列的配置描述
      const langTypes = res.data.langTypes || []
      langTypes.forEach(item=>{
        item.title = item.name
        item.dataIndex = item.code
      })
      this.columns.splice(5,0,...langTypes)

      // 表格数据
      this.data = res.data?.list ?? [];
      const langList = [...langTypes,{code:'zh'},{code:'en'}]
      this.data.forEach((value) => {
        langList.forEach((item) => {
          value[item.code] = value[item.code].fieldValue
        })
      })
    },

    //点击修改文案按钮
    handleCopywriting(data) {
      this.sourceRowId = data.langKey
      this.defaultVal = data.zh
      this.defaultValEn = data.en
      this.changeOperationVisible = true
    },

    //  确认修改
    changeOperation() {
      this.changeOperationVisible = false
      this.langFuncList()
    },
    
    //关闭弹窗
    cancelChangeOperation() {
      this.changeOperationVisible = false
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