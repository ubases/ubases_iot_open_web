<template>
  <a-modal
    :title="$t('setting.hardware.develop.modalTitle.version')"
    :width="800"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <h4>{{data.firmwareName}}</h4>
      <section class="version-list">
        <table-card type="card" :columnList="columnList" :dataList="versionList">
          <template v-slot:item="{record}">
            <section class="flex y-axis-center x-space-between">
              <section class="details">
                <h3>{{record.version}}</h3>
                <p class="description">{{$t('setting.hardware.develop.version.intro')}}：{{record.desc}}</p>
                <p class="description">{{$t('setting.hardware.develop.space.size')}}：{{type == 'custom' ? parseInt(record.upgradeFileSize/1024 || 0) :parseInt(record.fileSize/1024 || 0) }}K</p>
                <p class="description">{{$t('setting.hardware.develop.onstore.time')}}：{{record.updatedAt | momentFilter}}</p>
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
import { getChangeVersionList, changeVersionSubmit, getCustomVersionList } from "@/api/product"

export default ({
  name: "ChangeVersion",
  props: {
    productId: { type: String, default: '' },
    data: { type: Object, default: ()=>{} },
    visible: { type: Boolean, default: false },
    type: { type: String, default: 'module' }  // module: 更换模组, custom: 自定义
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
      this.getChangeVersionList()
    }
  },
  methods: {
    // 获取版本列表
    async getChangeVersionList(){
      const res = this.type === 'module' ? await getChangeVersionList({moduleId:this.data.id}) : await getCustomVersionList({firmwareId:this.data.firmwareId})
      if( res.code !== 0) return
      this.versionList = res.data?.list?.map(item => {
        if(item.version === this.data.version){
          this.selectVersion = item
        }
        return {
          ...item,
          active: item.version === this.data.version ? 1 : 0
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
        item.active = item.version === record.version? 1: 0
      });
    },

    // 确认选中版本
    async handleOk(){
      const param = {
        firmwareVersionId: this.selectVersion.id,
        firmwareId: this.data.firmwareId, 
        firmwareVersion: this.selectVersion.version, 
        id: this.productId
      }
      const res = await changeVersionSubmit(param)
      if(res.code !== 0) return
      this.$emit('handleSelect',this.selectVersion)
    }
  }
})
</script>


<style lang="less" scoped>
@import "../../../../../global.less";

.details{
  flex:1;
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