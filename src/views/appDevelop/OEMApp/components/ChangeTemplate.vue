<template>
  <a-modal
    :title="$t('oemApp.changeTemplate.title')"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <section class="version-list">
        <table-card type="card" :columnList="columnList" :dataList="versionList">
          <template v-slot:item="{record}">
            <section class="flex y-axis-center x-space-between">
              <section class="details">
                <h3>{{record.version}}</h3>
                <p class="description">{{$t('oemApp.template.version.introdution')}}</p>
                <p class="description">{{record.remark}}</p>
              </section>
              <section class="button-bar">
                <a-button v-if="record.active === 0" @click="handleSelect(record)">{{$t('setting.hardware.develop.select')}}</a-button>
                <a-button v-if="record.active === 1" disabled>{{$t('setting.hardware.develop.selected')}}</a-button>
              </section>
            </section>
          </template>
        </table-card>
      </section>
    </a-spin>
  </a-modal>
</template>

<script>
import TableCard from "@/components/tableCard/index.vue"
import { getAppTemplateList, changeAppTemplate } from "@/api/appExploit"

export default ({
  name: "ChangeTemplate",
  props: {
    data: { type: Object, default: ()=>{} },
    visible: { type: Boolean, default: false },
  },
  components:{
    TableCard,
  },
  data() {
    return {
      confirmLoading: false,
      versionList: [],
      columnList:[
        { name:'', span:"24", slot:"item"},
      ],
      selectVersion:{}
    }
  },
  watch: {
    visible(val){
      if(!val) return
      const { appTemplateId, appTemplateVersion } = {...this.data}
      this.selectVersion = {id: appTemplateId, version: appTemplateVersion}
      this.getAppTemplateList()
    }
  },
  methods: {
    // 获取版本列表
    async getAppTemplateList(){
      const res = await getAppTemplateList({query:{type:this.data.appType}})
      if( res.code !== 0) return
      this.versionList = res.data?.list?.map(item => {
        return {
          ...item,
          active: item.id === this.data.appTemplateId ? 1 : 0
        }
      }) || []
    },

    handleCancel(){
      this.$emit('handleCancel')
    },

    // 选择版本
    handleSelect(record){
      this.selectVersion = record
      this.versionList.forEach(item => {
        item.active = item.id === record.id? 1: 0
      });
    },

    // 确认选中版本
    async handleOk(){
      const param = {
        appId: this.data.appId,
        appType: this.data.appType, 
        appTemplateId: this.selectVersion.id, 
        appTemplateVersion: this.selectVersion.version
      }
      const res = await changeAppTemplate(param)
      if(res.code !== 0) return
      this.$emit('handleSelect')
    }
  }
})
</script>


<style lang="less" scoped>
@import "../../../../global.less";

.details{
  flex:1;
  max-width: 80%;
}
/deep/.card {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid @aithings-border-color;
}
/deep/.ant-btn{
  width: 100px;
  height: 34px;
  border: 1px solid @primary-color;
  color: @primary-color;
  &:disabled{
    border: 1px solid @aithings-color-E9EAEE;
    color: @aithings-text-tips-color;
    background: none;
  }
}
.description{
  padding-top: 8px;
  font-size: 14px;
  color: @aithings-text-color-gray;
}
</style>