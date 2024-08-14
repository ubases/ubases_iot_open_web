<template>
  <section class="page-wrap no-padding" @click="showProductSearch=false">
    <a-page-header :title="$t('firmware.OTA.title')" >
      <template v-if="!noData">
        <product-change :productId="defaultProductId" @dataChange="productChange" @isData="isData"/>
        <section class="content">
          <!-- 筛选栏 -->
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="10">
                <a-col :md="4" :sm="24">
                  <a-form-item>
                    <a-input
                      v-model="queryParam.query.firmwareName"
                      :placeholder="$t('firmware.inputName')"
                      :allowClear="true"
                      @keyup.enter.native="queryList"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="4" :sm="24">
                  <a-form-item>
                    <a-input
                      v-model="queryParam.query.id"
                      :placeholder="$t('firmware.inputKey')"
                      :allowClear="true"
                      @keyup.enter.native="queryList"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="4" :sm="24">
                  <a-form-item>
                    <a-select
                      v-model="queryParam.query.firmwareType"
                      :placeholder="$t('firmware.type')"
                      default-value="0"
                      :options="$DictList('firmware_type')"
                      :allowClear="true"
                      @keyup.enter.native="queryList"
                    >
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="4" :sm="24">
                  <span class="table-page-search-submitButtons">
                    <a-space :size="10">
                      <a-button type="primary" @click="queryList">{{$t("public.query")}}</a-button>
                      <a-button class="regular-button" @click="reset">{{$t("public.reset")}}</a-button>
                    </a-space>
                  </span>
                </a-col>
              </a-row>
            </a-form>
          </div>

          <!-- 表格操作栏 -->
          <div class="table-operator">
            <a-button type="primary" @click="handleEdit({},'add')" class="grean-button">
              <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
              {{$t("firmware.new-built.OTA")}}
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
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="firmwareName" slot-scope="text,item" class="firmware-name" @click="handleEdit(item,'check')">
              {{ text }}
            </span>
            <template v-slot:status="item">
              {{$DictName('ota_release_status',item.status)}}
            </template>
            <template v-slot:action="item">
              <section class="action-wrap">
                <a-button v-if="item.status == 3" type="link" size="small" @click="stopRelease(item.id)">
                  {{$t('public.stoped')}}
                </a-button>
                <a-divider type="vertical"  v-if="item.status == 3"/>
                <a-button type="link" size="small" style="width:70px" @click="handleRelease(item)">
                  {{$DictName('ota_release_button_status',item.status)}}
                </a-button>
                <a-divider type="vertical" />
                <a-button type="link" size="small"  @click="handleRecord(item)">
                  {{$t("public.record")}}
                </a-button>
                <a-divider type="vertical" />
                <a-button type="link" size="small" :disabled="!item.url" @click="handleDownload(item)">
                  {{$t("public.download")}}
                </a-button>
                <a-divider type="vertical" />
                <a-button type="link" size="small" :disabled="item.status !== 1" @click="handleEdit(item,'edit')">
                  {{ $t("public.edit") }}
                </a-button>
                <a-divider type="vertical" />
                <a-button type="link" size="small" :disabled="item.status !== 1"  @click="handleDelete(item.id)">
                  {{$t("public.delete")}}
                </a-button>
              </section>
            </template>
          </a-table>
        </section>
      </template>
      <template v-if="noData">
        <no-data :text="$t('firmware.OTA.noData.text')" :buttonText="$t('firmware.OTA.noData.title')" path="/product/product/createProduct/index"/>
      </template>
        <!-- 发布固件OTA弹窗 -->
      <release-ota :visible="releaseOTAVisible" :data="releaseOTAData" @handleCancel="cancelRelease" @handleOk="sumitRelease"></release-ota>
      <!-- 新建/编辑/详情OTA弹窗 -->
      <edit-ota 
        :moduleId="productDetails.moduleId" 
        :productKey="productDetails.productKey" 
        :productId="productDetails.id"
        :visible="editOTAVisible" 
        :firmwareOtaData="otaData" 
        :type="OTAEditType" 
        @handleOk="sumitEdit" 
        @handleCancel="cancelEdit"
        >
      </edit-ota>
    </a-page-header>
  </section>
</template>
<script>
import ReleaseOta from './components/ReleaseOTA.vue'
import EditOta from './components/EditOTA.vue'
import { getFirmwareOTAList, deleteFirmwareOTA ,otaStop} from '@/api/firmwareOTA'
import ProductChange from '@/components/detailChange/ProductChange.vue'
import NoData from "@/components/NoData/index.vue"

export default {
  name: "Firmware",
  components: {
    ReleaseOta,
    EditOta,
    ProductChange,
    NoData
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
          scopedSlots: { customRender: 'serial' }
        },
        {
          dataIndex: "firmwareName",
          title: this.$t("firmware.name"),
          scopedSlots: { customRender: 'firmwareName' }
        },
        {
          dataIndex: "firmwareKey",
          title: this.$t("firmware.key"),
        },
        {
          dataIndex: "firmwareTypeName",
          title: this.$t("firmware.type"),
        },
        {
          dataIndex: "version",
          title: this.$t("firmware.version"),
        },
         {
          dataIndex: "upgradeModeName",
          title: this.$t("firmware.upgradeType"),
        },
        {
          title: this.$t("firmware.status"),
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "440px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      releaseOTAVisible:false,
      releaseOTAData:{},
      editOTAVisible:false,
      otaData:{"versionId": undefined},
      OTAEditType:'',
      productDetails:'',
      noData:false,
      defaultProductId:''
    };
  },
  created() {
    if (this.$route.meta.isBack) {
      const query = getPageQuery(this.$route)
      if(query){
        this.$set(this,'defaultProductId', query.defaultProductId)
        this.$set(this,'queryParam', query.queryParam)
      }
    }
  },

  methods: {
    // 产品切换
    productChange(data){
      this.productDetails = data
      this.queryParam.page = 1
      this.queryList()
    },

    // 是否有产品
    isData(value){
      this.noData = !value
    }, 

    onChangePagination(e) {
      this.queryParam.page = e.current
      this.queryParam.limit  = e.pageSize
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.queryList()
    },

    // 重置筛选参数
    reset() {
      this.queryParam = {page: 1, limit: 10, query:{}}
      this.queryList()
    },
    
    // 获取固件列表
    queryList() {
      this.queryParam.query.productId = this.productDetails.id
      getFirmwareOTAList(this.queryParam).then((res) => {
        if (res.code !== 0) return
        this.dataSource = res.data.list;
      });
    },
    
    // 点击发布OTA
    handleRelease(data){
      this.releaseOTAData = data
      this.releaseOTAData.productName = this.productDetails.name
      this.releaseOTAVisible = true
    },
    // 关闭发布OTA弹窗
    cancelRelease() {
      this.releaseOTAVisible = false
    },
    // 提交发布OTA操作
    sumitRelease() {
      this.releaseOTAVisible = false
      this.queryList()
    },

    // 停止发布
    async stopRelease(id){
      this.$WarningModal(this, this.$t('firmware.OTA.isStop.public')).then(async() => {
        const res = await otaStop({id})
        if(res.code !==0) return
        this.queryList()
      })
    },

    // 点击记录
    async handleRecord(row){
      this.$router.push({path: '/product/firmwareOTA/record/index', query:{ id: row.id, productId: this.productDetails.id, productKey: this.productDetails.id}})
    },

    // 新建/编辑固件OTA弹窗
    async handleEdit(data,type) {
     
      if(type == 'add'){
        this.otaData = {"versionId": undefined, specifiedAreaArr:[], specifiedVersionArr:[]}
      }else{
        this.otaData = {isMust:2, ...data}
        if(data.specifiedArea){
          this.otaData.specifiedAreaArr = data.specifiedArea.split(",") || []
        }
        if(data.specifiedVersion){
          this.otaData.specifiedVersionArr = data.specifiedVersion.split(",") || []
        }
      }
      this.otaData.productId = this.productDetails.id
      this.otaData.productName = this.productDetails.name
      this.OTAEditType = type
      this.editOTAVisible = true
    },
    // 取消 新建/编辑固件OTA弹窗
    cancelEdit(){
      this.editOTAVisible = false
    },
    // 提交 新建/编辑固件OTA弹窗
    async sumitEdit(){
      this.queryList()
      this.editOTAVisible = false
    },

    // 删除固件OTA
    handleDelete(id) {
      this.$WarningModal(this, this.$t('firmware.OTA.isDelete.ota')).then(async() => {
        const res = await deleteFirmwareOTA({id})
        if (res.code !== 0) return
        if(this.dataSource.length==1 && this.queryParam.page != 1){
          this.queryParam.page --
          this.pagination.current --
        }
        this.queryList()
      })
    },

    handleDownload(data){
      if(data.url){
        this.$DownloadTemplate( this, {url: data.url}, `${data.firmwareName}.bin`, "get");
      }
    }
  },

  beforeRouteEnter (to, from, next) {
    to.meta.isBack = from.path === '/product/firmwareOTA/record/index' 
    next()
  },

  beforeRouteLeave(to, from, next) {
    Storage.set("pageQuery", {[from.name]:{queryParam:this.queryParam, defaultProductId:this.productDetails.id}})
    next();
  }
};
</script>
<style lang="less" scoped>
@import "../../../global.less";
/deep/.ant-page-header-content{
  padding-top: 0;
}
.content{
  padding: 20px;
}
.action-wrap{
  text-align: right;
}
.firmware-name{
  color: @primary-color;
  cursor: pointer;
}
</style>
