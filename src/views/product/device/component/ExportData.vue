<template>
  <a-modal
    :title="$t('device.export.data.title')"
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
                <a-input v-model="queryParam.searchKey" :placeholder="$t('device.export.placeholder.searchKey')" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item>
                <a-select v-model="queryParam.query.productId" :placeholder="$t('device.export.placeholder.productId')">
                  <a-select-option v-for="v in productOptions" :key="v.id" :value="v.id"> {{v.name}} </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :md="6" :sm="24">
              <a-form-item>
                <a-select v-model="queryParam.query.isActive"  :placeholder="$t('device.export.placeholder.isActive')"  :options="$DictList('active_status')" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item>
                <a-select  v-model="queryParam.query.isOnline"  :placeholder="$t('device.export.placeholder.isOnline')"  :options="$DictList('online_status')"  />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item>
                <a-range-picker @change="dateChange" @calendarChange="calendarChange" @openChange="openChange"  v-model="queryParam.aliveTime" :disabled-date="disabledDate" :placeholder="[$t('device.export.placeholder.activeTime'),$t('device.export.placeholder.activeTime')]" separator="—">
                  <icon-font slot="suffixIcon" type="icon-date" :style="{ fontSize: '23px' }" />
                </a-range-picker>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="10">
            <a-col :md="12" :sm="24">
              <a-form-item>
                <a-input v-model="queryParam.query.serialNumber" :placeholder="$t('device.export.placeholder.serialNumber')" />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item>
                <a-input-number v-model="queryParam.query.batch" :min="0" :precision="0" :placeholder="$t('device.export.placeholder.batch')" />
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
import { getDeviceList } from "@/api/device";
import { DateIcon} from '@/core/icons'
import moment from "moment";
export default ({
  name: "ExportData",
  props:{
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      confirmLoading: false,
      totalNum: 0,
      queryParam:{
        query:{}
      },
      productOptions:[],
      disabledCurrent:null,
      date:[]
    }
  },
  components:{
    DateIcon,
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
      const { query, searchKey=''} = {...this.queryParam}
      const res = await getDeviceList({ query, searchKey})
      if (res.code !== 0 ) return
      this.totalNum = res.data.total
    },

    // 日期选项变化
    dateChange(e){
      this.date = e
      if( e.length > 0){
        this.queryParam.query.startTime = this.$TransformTimestamp(e[0])
        this.queryParam.query.endTime = this.$TransformTimestamp(e[1])
      } else {
        this.queryParam.query.startTime = ''
        this.queryParam.query.endTime = ''
      }
    },

    // 清空禁用时间段的设置
    openChange () {
      this.disabledCurrent = this.date[0] ?? null
    },

    // 获取手动选择的时间段起始值
    calendarChange (dates) {
      this.disabledCurrent = dates[0]
    },

     //时间限制范围 开始时间~结束时间不能超过7天，且禁选超过当前日期时间
    disabledDate(current){
      if (!this.disabledCurrent) return current > moment()
      return current > moment(this.disabledCurrent).add(6, 'days').endOf('day') || current < moment(this.disabledCurrent).subtract(7, 'days').endOf('day') || current > moment()
    },

    resetParam(){
      this.queryParam = {query:{}}
      this.queryList()
    },

    handleCancel(){
      this.$emit('handleClose')
    },

    async handleOk(){
      this.confirmLoading = true
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/iot/activeDevice/export`,
          searchKey: this.queryParam.searchKey ?? '',
          query: this.queryParam.query,
        },
        this.$t('device.export.device.data') + ".xlsx",
        "post"
      );
      this.confirmLoading = false
      this.$emit('handleClose')
    },
  }
})
</script>
<style lang="less" scoped>
  @import "../../../../global.less";
  /deep/ .ant-calendar-picker{
    width: 100%;
  }
  /deep/ .ant-form .ant-calendar-range-picker-input{
    width: 105px;
  }
  /deep/ .ant-calendar-range-picker-separator{
    color: @aithings-border-color;
  }
  .ant-calendar-picker-clear, .ant-calendar-picker-icon{
    right: 8px;
    width: 23px;
    height: 23px;
    margin-top: -11px;
  }
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