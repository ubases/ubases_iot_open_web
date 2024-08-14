<template>
  <a-modal
    :title="$t('device.export.triple.title')"
    :width="600"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <section>
        <a-form>
          <a-row :gutter="10">
            <a-col :md="12" :sm="24">
              <a-form-item>
                <a-select v-model="queryParam.productId" :placeholder="$t('device.export.triple.placeholder.productId')">
                  <a-select-option v-for="v in productOptions" :key="v.id" :value="v.id"> {{v.name}} </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item>
                <a-input-number v-model="queryParam.batch" :min="0" :precision="0" :placeholder="$t('device.export.triple.placeholder.batch')" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :md="12" :sm="24">
              <a-form-item>
                <a-input v-model="queryParam.serialNumber" :placeholder="$t('device.export.triple.placeholder.serialNumber')" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item>
                <a-select v-model="queryParam.activeStatus"  :placeholder="$t('device.export.triple.placeholder.activeStatus')"  :options="$DictList('active_status')" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :md="5" :sm="24">
              <a-form-item>
                <a-button type="primary" @click="queryList"> {{$t('public.search.button')}} </a-button> 
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item>
                <a-button class="regular-button" @click="resetParam"> {{$t('public.reset')}} </a-button> 
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <p>{{$t('device.export.total.check')}}{{totalNum}}{{$t('device.export.isExport.data')}}</p>
          </a-row>
        </a-form>
      </section>
    </a-spin>
  </a-modal>
</template>

<script>
import { getProductList } from "@/api/product"
import { triadExportCount } from "@/api/device";

export default ({
  name: "ExportData",
  props:{
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      confirmLoading: false,
      totalNum: 0,
      queryParam:{},
      productOptions:[],
    }
  },
  created() {
    this.init()
  },
  methods:{
    async init(){
      const res = await getProductList({})
      if(res.code !== 0) return
      this.productOptions = res.data.list
    },

    // 查询列表
    async queryList(){
      const res = await triadExportCount({ ...this.queryParam})
      if (res.code !== 0 ) return
      this.totalNum = res.data
    },

    resetParam(){
      this.queryParam = {query:{}}
      this.totalNum = 0
    },

    handleCancel(){
      this.$emit('handleClose')
      this.queryParam = {}
      this.totalNum = 0
    },

    async handleOk(){
      this.confirmLoading = true
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/iot/activeDevice/triadExport`,
          ...this.queryParam
        },
        this.$t('device.export.triple.fileName') + ".csv",
        "get"
      ).then(()=>{
        this.confirmLoading = false
        this.$emit('handleClose')
        this.queryParam = {}
        this.totalNum = 0
      })
    },
  }
})
</script>
<style lang="less" scoped>
  @import "../../../../global.less";

  .ant-form-item-children{
    .ant-btn{
      padding: 0 28px;
    }
    .regular-button{
      border: 1px solid @primary-color;
      color: @primary-color;
    }
  }
  /deep/.ant-input-number{
    width: 100%;
  }
  
</style>