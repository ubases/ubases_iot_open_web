<template>
  <section class="page-wrap">
    <a-page-header :title="$t('firmware.title')" >
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input
                  v-model="queryParam.query.name"
                  :placeholder="$t('firmware.name')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input
                  v-model="queryParam.query.firmwareKey"
                  :placeholder="$t('firmware.inputKey')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.query.type"
                  :placeholder="$t('firmware.type')"
                  :options="$DictList('firmware_type')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space :size="10">
                  <a-button type="primary" @click="query">{{$t("public.query")}}</a-button>
                  <a-button  class="regular-button" @click="reset">{{$t("public.reset")}}</a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 表格操作栏 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleVisiable" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t("firmware.new-built")}}
          </a-button>
      </div>

      <!-- 表格 -->
      <a-table
        size="small"
        rowKey="id"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        @change="onChangePagination"
      >
        <span slot="name" slot-scope="text, record" class="firmware-name tap-pointer"  @click="handleDetails(record.id)">
          {{record.name}}
        </span>
        <span slot="type" slot-scope="text, record">
          {{$DictName('firmware_type',record.type)}}
        </span>
        <template v-slot:action="record">
          <a-button type="link" size="small" @click="handleEdit(record.id)">
            {{ $t("public.edit") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small"  @click="handleAddVersion(record.id)">
            {{$t("firmware.addVersion")}}
          </a-button>
        </template>
      </a-table>
      <!-- 新增固件弹窗 -->
      <add-firmware :visible="addVisiable" @cancelEdit="handleVisiable" @sumitEdit="sumitEdit"/>
    </a-page-header>
  </section>
</template>
<script>
import { getFirmwareList } from "@/api/firmware";
import addFirmware from './component/addFirmware.vue'
export default {
  name: "Firmware",
  components: {
    addFirmware
  },
  data() {
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
        page: 1,
        limit: 10,
        query:{}
        },
      columns: [
        {
          title: this.$t("firmware.sort"),
          customRender: (item,value,index) => index + 1
        },
        {
          dataIndex: "name",
          title: this.$t("firmware.name"),
          scopedSlots: { customRender: 'name' }
        },
        {
          dataIndex: "firmwareKey",
          title: this.$t("firmware.key"),
        },
        {
          dataIndex: "type",
          title: this.$t("firmware.type"),
          scopedSlots: { customRender: 'type' }
        },
        {
          dataIndex: "version",
          title: this.$t("firmware.latestVersion"),
        },
         {
          dataIndex: "flag",
          title: this.$t("firmware.identify"),
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "180px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      addVisiable:false,
    };
  },
  created() {
    if (!this.$route.meta.isBack) {
      // 初始化data的值
      Object.assign(this.$data, this.$options.data.call(this))
      this.queryList()
    }
  },
  beforeRouteEnter (to, from, next) {
    // 上次路由，设置isBack为 true 还是 false
    to.meta.isBack = from.path === '/product/firmware/details/index' || from.path === '/dashboard/index'
    next()
  },

  activated () {
    if (this.$route.meta.isBack) {
      this.$route.meta.isBack = false // 重置isBack
      this.queryList()
    }
  },
  methods: {
    onChangePagination(e) {
      this.queryParam.page = e.current
      this.queryParam.limit  = e.pageSize
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    },

    query() {
      this.queryParam.page = 1
      this.pagination.current = 1
      this.queryList()
    },

    // 重置筛选参数
    reset() {
      this.queryParam = {page:1, limit:this.queryParam.limit,query:{}}
      this.queryList()
    },
    
    // 获取固件列表
    async queryList() {
      this.loading = true;
      const res = await getFirmwareList(this.queryParam)
      this.loading = false;
      if (res.code !== 0) return
      this.dataSource = res.data.list;
      this.pagination.total = res.data.total
    },

    // 新增固件弹窗开启/关闭
    handleVisiable(){
      this.addVisiable = !this.addVisiable
    },

    // 提交新建弹窗
    sumitEdit(){
      this.queryList()
      this.addVisiable = false
    },

    // 加版本
    handleAddVersion(id){
      this.$router.push({path:"/product/firmware/details/index",query:{id,type:'addVersion'}})
    },

    // 固件编辑弹窗
    async handleEdit(id) {
      this.$router.push({path:"/product/firmware/details/index",query:{id,type:'edit'}})
    },

    // 跳转详情
    async handleDetails(id){
      this.$router.push({path:"/product/firmware/details/index",query:{id,type:'details'}})
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../../global.less";
.firmware-name{
  color: @primary-color;
}
</style>
