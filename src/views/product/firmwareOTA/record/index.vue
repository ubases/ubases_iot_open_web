<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('release.log.title')" @back="back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <a-table
          size="small"
          rowKey="id"
          :data-source="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @change="onChangePagination"
        >
          <template v-slot:status="item">
            {{ item.status == 3 ? `${item.succesCount}/${item.totalCount}` : $DictName('ota_release_status',item.status) }}
          </template>
          <template v-slot:more="item">
            <a-button type="link" @click="checkDetail(item.id)">{{$t('release.log.column.checkDetail')}}</a-button>
          </template>
        </a-table>
      </section>
    </a-page-header>
    <release-detail :visible="detailVisible" :productId="productId" :productKey="productKey" :detailId="detailId" @handleCancel="closeDetail" />
  </section>
</template>

<script>
import { getReleaseRecordList } from '@/api/firmwareOTA'
import releaseDetail from "../components/releaseDetail.vue"

export default ({
  name:"releaseLog",
  components:{
    releaseDetail
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
      columns: [
        {
          title: this.$t('release.log.column.productName'),
          dataIndex: "productName",
        },
        {
          dataIndex: "firmwareName",
          title: this.$t('release.log.column.firmwareName'),
        },
        {
          dataIndex: "version",
          title: this.$t('release.log.column.version'),
        },
        {
          dataIndex: "releaseModeName",
          title: this.$t('release.log.column.releaseModeName'),
        },
        {
          dataIndex: "releaseDesc",
          title: this.$t('release.log.column.releaseDesc'),
        },
        {
          key: "status",
          title: this.$t('release.record.column.status'),
          scopedSlots: { customRender: "status" },
        },
        {
          dataIndex: "operTime",
          title: this.$t('release.log.column.operTime'),
        },
        {
          key: "more",
          title: this.$t('public.more'),
          scopedSlots: { customRender: "more" },
        },
      ],
      dataSource: [],
      loading: false,
      detailVisible: false,
      detailId: '',
      otaPkgId:'',
      productId: '',
      productKey: '',
    }
  },

  mounted(){
    this.otaPkgId = this.$route.query.id || ''
    this.productId = this.$route.query.productId || ''
    this.productKey = this.$route.query.productKey || ''
    this.getRecord()
  },

  methods:{
    // 获取记录
    async getRecord(){
      let res = await getReleaseRecordList({ page: this.pagination.current, limit: this.pagination.pageSize, query: { "otaPkgId": this.otaPkgId } })
      if(res.code !==0 ) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
    },

    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.getRecord()
    },

    // 查看明细
    checkDetail(id){
      this.detailId = id
      this.detailVisible = true
    },

    closeDetail(){
      this.detailVisible = false
    },

    // 返回上一页
    back(){
      this.$router.replace({name:'firmwareOTA', params:{productId: this.productId }})
    }
  }
})
</script>

<style lang="less" scoped>
@import "../../../../global.less";
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }
</style>