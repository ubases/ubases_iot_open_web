<template>
  <section class="content">
    <div class="help-guide">{{$t('multilingual.networkScheme.helpLead.detail')}}</div>
    <a-table
      size="small"
      rowKey="id"
      :data-source="data"
      :columns="columns"
      :loading="loading"
      :pagination="false"
      :scroll="{ x: 1300 }"
    >
      <template v-slot:step="record">
        {{$t('multilingual.networkScheme.step')}}{{record}}
      </template>
      <template v-for="item in langColumnList" :slot="item.code" slot-scope="text, record">
        <a-input :key="item.code" :value="text" :maxLength="200" @change="e => handleChange(e.target.value, record.id, item.code)" @blur="e => saveChange(e.target.value, record.id, item.code)"/>
      </template>
    </a-table>
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
import {getNetworkGuideLang, saveTranslation} from "@/api/multilingual";

export default {
  props: {
    productId: { type: String, default: "" },
  },

  data (){
    return {
      originColumns:[
      {
        title: this.$t('multilingual.networkScheme.column.type'),
        dataIndex: "type",
        width: 100,
        fixed: 'left',
        scopedSlots: { customRender: "type" },
        colSpan: 1,
        customRender: (value, row, index) => {
          const obj = {
            children: this.$DictName('network_guide', value),
            attrs: {},
          };
          obj.attrs.rowSpan = renderContent(this.data, "type", index)[index];
          return obj;
        },
      },
      {
        title: "",
        dataIndex: "step",
        width: 80,
        fixed: 'left',
        scopedSlots: { customRender: "step" },
      },
      {
        title: this.$t('multilingual.column.langKey'),
        dataIndex: "langKey",
        width: 120,
        fixed: 'left',
        scopedSlots: { customRender: "langKey" },
      },
      {
        title: this.$t('multilingual.column.zh'),
        width:240,
        dataIndex: "zh",
        scopedSlots: { customRender: "zh" },
      },
      {
        title: this.$t('multilingual.column.en'),
        width:240,
        dataIndex: "en",
        scopedSlots: { customRender: "en" },
      },
      ],
      columns:[],
      data: [],
      loading: false,
      langColumnList:[]
    }
  },

  watch: {
    productId() {
      this.getNetworkGuideLang()
    },
  },

  mounted(){
    if(this.productId) this.getNetworkGuideLang()
  },

  methods:{
     //获取配网方案表
    async getNetworkGuideLang() {
      this.columns =[]
      const res = await getNetworkGuideLang({ productId: this.productId })
      if (res.code !== 0) return;
      // 表格列的配置描述
      const langTypes = res.data.langTypes || []
      langTypes.forEach(item=>{
        item.title = item.name
        item.dataIndex = item.code
        item.scopedSlots = { customRender: item.code }
      })
      this.columns = [...this.originColumns.slice(0,5),...langTypes]
      this.langColumnList = [...langTypes]
      // 表格数据
      this.data = res.data.list
      const langList = [...langTypes]
      this.data.forEach((value) => {
        langList.forEach((item) => {
          value[item.code] = value[item.code].fieldValue
        });
        value['zh'] = value.instruction
        value['en'] = value.instructionEn
      });
    },

    // 数值变化
    handleChange(value,id,column){
      const newData = [...this.data];
      const target = newData.find(item => id === item.id);
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },

    // 保存数据修改
    async saveChange(value,id){
      const newData = [...this.data];
      const target = newData.find(item => id === item.id);
      const list = this.langColumnList.map((item)=>{
        return {
          fieldName: 'instruction',
          fieldValue: target[item.code],
          lang: item.code,
        }
      })
      let params = {
        sourceTable:"network_guide",
        sourceRowId: `${id}`,
        translateList:list,
      }
      this.loading = true
      const res = await saveTranslation(params)
      this.loading = false
      if(res.code !== 0 ) return
      this.$message.success(this.$t('public.update.succeed'))
      this.getNetworkGuideLang()
    }

  },

}
</script>

<style  lang="less" scoped>
@import "../../../../global.less";
.ant-input{
  height: 54px;
  margin: 4px 0;
}
.ant-btn-link{
  padding-left: 0;
}
.help-guide{
padding-bottom: 20px;
font-size: 12px;
font-weight: 400;
color: @aithings-text-color-gray;
line-height: 18px;
}
</style>