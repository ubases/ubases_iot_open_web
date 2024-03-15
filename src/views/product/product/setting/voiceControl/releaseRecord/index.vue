<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('setting.voiceControl.release.record')" @back="back">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        
        <!-- 表格 -->
        <a-table
          size="small"
          rowKey="id"
          :data-source="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="false"
        >
          <template slot="createdAt" slot-scope="text, record">
            <span> {{record.createdAt | momentFilter}}</span>
          </template>
        </a-table>
      </section>
    </a-page-header>
 </section>
</template>
<script>
import { getPublishRecord } from "@/api/product"
export default {
  name: "ReleaseRecord",
  data() {
    return {
      productKey: '',
      productId:'',
      voiceNo: '',
      loading: false,
      dataSource: [],
      columns: [
        {
          dataIndex: "productName",
          title: this.$t('setting.voiceControl.releaseRecord.column.productName'),
        },
        {
          dataIndex: "voiceName",
          title: this.$t('setting.voiceControl.releaseRecord.column.voiceName'),
        },
        {
          dataIndex: "attrText",
          title: this.$t('setting.voiceControl.releaseRecord.column.attrText'),
        },
        {
          dataIndex: "createdAt",
          title: this.$t('setting.voiceControl.releaseRecord.column.createdAt'),
          scopedSlots: { customRender: "createdAt" },
        },
      ],
    };
  },
  async created() {
    this.productKey = this.$route.query.productKey
    this.productId = this.$route.query.productId
    this.voiceNo = this.$route.query.voiceNo
    await this.queryList()
  },

  methods: {
    async queryList(){
      const res = await getPublishRecord({productKey:this.productKey, voiceNo:this.voiceNo})
      if(res.code !== 0) return
      this.dataSource = res.data?.map(item => {
        return {
          ...item,
          attrText: item.attrText ? item.attrText.join(',') :''
        }
      })
    },

    // 返回
    back(){
      this.$router.push({ path: '/product/product/setting/index', name:'Setting', query:{productId: this.productId}, params:{tab: 4} })
    },

  },
};
</script>
<style lang="less" scoped>
  @import "../../../../../../global.less";
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }

</style>
