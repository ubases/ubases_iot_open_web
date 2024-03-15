<template>
  <a-modal
    :title="$t('release.detail.title')"
    :width="900"
    :confirm-loading="confirmLoading"
    :visible="visible"
    @cancel="handleCancel"
  >
  <a-spin :spinning="confirmLoading">
  
    <div class="details">
      <a-descriptions size="small" :column="3">
        <a-descriptions-item :label="$t('release.detail.label.name')">
          {{detail.productName}}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('release.detail.label.firmwareName')">
          {{detail.firmwareName}}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('release.detail.label.firmwareVersion')">
          {{detail.version}}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('release.detail.label.releaseType')">
          {{detail.releaseModeName}}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('release.detail.label.releaseDetail')">
          {{detail.releaseDesc}}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('release.detail.label.operTime')">
          {{detail.operTime}}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('release.detail.label.deviceCount')">
          {{detail.total}}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('release.detail.label.upgraded')">
          {{detail.successTotal + detail.failTotal}}（{{$t('release.record.success')}}{{detail.successTotal}}，{{$t('release.record.error')}}{{detail.failTotal}}）
        </a-descriptions-item>
      </a-descriptions>
    </div>
    <!-- 筛选栏 -->
    <div class="table-page-search-wrapper" style="background: #FFFFFF;padding:0">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-input 
                v-model="queryParam.deviceId" 
                :placeholder="$t('release.detail.column.deviceId')"
                :allowClear="true"
                @keyup.enter.native="query"
                />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select
                v-model="queryParam.status"
                :placeholder="$t('release.detail.column.isUpgrade')"
                default-value=""
                :options="$DictList('ota_upgrade_status')"
                :allowClear="true"
                @keyup.enter.native="query"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select
                v-model="queryParam.result"
                :placeholder="$t('release.detail.column.upgradeResult')"
                default-value=""
                :options="$DictList('ota_upgrade_result')"
                :allowClear="true"
                @keyup.enter.native="query"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item>
              <a-select
                v-model="queryParam.area"
                optionFilterProp="label"
                :placeholder="$t('release.detail.column.area')"
              >
                <a-select-option v-for="item in areaOptions" :value="item.value" :key="item.key" :label="item.key">
                  {{item.label}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-space :size="10">
                <a-button type="primary" @click="query"> {{$t('public.search')}} </a-button>
                <a-button class="regular-button" @click="reset"> {{$t('public.reset')}} </a-button>
              </a-space>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- /筛选栏 -->
    <a-table
      size="small"
      rowKey="id"
      :data-source="dataSource"
      :columns="columns"
      :pagination="pagination"
      @change="onChangePagination"
    >
      <template v-slot:status="record">
        {{$DictName('ota_upgrade_status',record)}}
      </template>
    </a-table>
  </a-spin>
    <section slot="footer" class="ant-modal-footer">
      <a-button type="primary" @click="handleCancel">{{$t('public.close.text')}}</a-button>
    </section>
  </a-modal>
</template>
<script>
import { getPublishDetail, getUpgradableAreas } from '@/api/firmwareOTA'

export default ({
  name:"releaseDetail",
  props:{
    visible: { type: Boolean, default: false },
    detailId:{ type: String, default: '' },
    productId:{ type: String, default: '' },
    productKey:{ type: String, default: '' } 
  },

  data () {
    return {
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total')+`:${total}` + this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      // 查询参数
      queryParam: {
        query:{}
      },
      columns: [
        {
          title: this.$t('release.detail.column.deviceId'),
          dataIndex: "deviceId",
        },
        {
          dataIndex: "status",
          title: this.$t('release.detail.column.isUpgrade'),
          scopedSlots: { customRender: 'status' }
        },
        {
          dataIndex: "result",
          title: this.$t('release.detail.column.upgradeResult'),
        },
        {
          dataIndex: "areaName",
          title: this.$t('release.detail.column.area'),
        },
      ],
      dataSource: [],
      areaOptions:[],
      confirmLoading: false,
      detail:{
        successTotal: 0,
        failTotal: 0
      }
    }
  },
  watch:{
    visible(val){
      if(!val) return
      this.getRecord()
      this.getAreaList()
    }
  },

  mounted(){

  },
  methods:{
    async getRecord(queryParam){
      this.confirmLoading = true
      let res = await getPublishDetail(this.detailId,{page:this.pagination.current,limit:this.pagination.pageSize, ...queryParam})
      this.confirmLoading = false
      if( res.code !== 0 ) return
      const { failTotal, successTotal, total } = { ...res.data }
      this.detail = { ...res.data.details, failTotal, successTotal, total }
      this.dataSource = res.data.deviceList
      this.pagination.total = res.data.total
    },

    query() {
      this.queryParam.page = 1
      this.queryParam.limit = 10
      this.getRecord(this.queryParam)
    },

    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.getRecord(this.queryParam)
    },

    handleCancel() {
      this.$emit("handleCancel")
    },

    // 获取区域列表
    async getAreaList(){
      const res = await getUpgradableAreas({productKey: this.productKey, productId: this.productId })
      if( res.code !== 0 ) return
      this.areaOptions = res.data?.map(item=>{
        return {
          value: item.Code,
          label: item.Name,
          key: item.Name
        }
      }) || []
    },

    // 重置筛选参数
    reset() {
      this.queryParam = {page: 1, limit: 10, query:{}}
      this.getRecord(this.queryParam)
    },
  }
})
</script>
<style lang="less" scoped>
  .details{
    padding-bottom: 10px;
  }
</style>