<template>
  <section class="page-wrap">
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
    
    <template slot="updatedAt" slot-scope="updatedAt">
        {{ updatedAt | momentFilter }}
      </template>
      <template slot="launchMarkets" slot-scope="launchMarkets">
        {{ launchMarkets?launchMarkets.map(item=>item.name).join("、"):"" }}
      </template>
      <template slot="remindMode" slot-scope="remindMode">
        {{ $DictName('app_shelf_remind_mode', remindMode || 1) }}
      </template>
      
      <template v-slot:action="record">
        <a-button type="link" size="small" @click="handleDownload(record)">{{ $t("public.download") }}</a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" @click="handleChangeRecord(record)">{{ $t("shelfRecord.change.record") }}</a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" @click="handleChangeRemind(record)">{{ $t("shelfRecord.change.remindType") }}</a-button>
        <a-divider type="vertical" />
        <a-button type="link" size="small" @click="handleDesc(record)">{{ $t("shelfRecord.column.desc") }}</a-button>
      </template>
    </a-table>
    <!-- 下载 -->
    <a-modal
      :title="$t('customizedApp.versionManage.download.app')"
      :visible="downloadVisible"
      :width="520"
      :confirm-loading="confirmLoading"
      @cancel="downloadVisible = false"
    >
    <section class="download-content">
      <div class="qrcode-image-wrap">
        <qr-code :text="downloadUrl" :options="{margin:0}"/>
      </div>
      <h4>{{ appName }}</h4>
      <div class="flex x-space-between version-text">
        <p>{{ pkgName[type].name }}</p>
        <p>{{ $t('customizedApp.versionManage.column.version') }}:{{ downloadData.version }}</p>
      </div>
      <p class="detail-text">{{ $t('customizedApp.versionManage.download.detail1') }}</p>
      <p class="detail-text">{{ $t('customizedApp.versionManage.download.detail2') }}</p>
    </section>

      <template slot="footer">
        <a-button key="cancel"  @click="downloadVisible = false">{{$t('optionalConfig.doc.close')}}</a-button>
      </template>
    </a-modal>
    <!-- 更改上架记录 -->
    <a-modal
      :title="$t('shelfRecord.change.record')"
      :width="500"
      :visible="recordVisible"
      :confirm-loading="confirmLoading"
      @ok="handleRecordOk"
      @cancel="recordVisible = false"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model  ref="recordForm" class="regular-form" :model="recordForm" :rules="recordRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
          <a-form-model-item :label="$t('shelfRecord.appName')" prop="launchMarketCodes">
            <a-select mode="multiple" :placeholder="$t('shelfRecord.placeholder.appName')" v-model="recordForm.launchMarketCodes" :options="launchMarketOptions"/>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
    <!-- 更改提醒方式 -->
    <a-modal
      :title="$t('shelfRecord.change.remindType')"
      :width="700"
      :visible="remindVisible"
      :confirm-loading="confirmLoading"
      @ok="handleRemindOk"
      @cancel="remindVisible = false"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model  ref="remindForm" class="regular-form" :model="remindForm" :rules="remindRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
          <a-form-model-item :label="$t('shelfRecord.change.remindType')" prop="remindMode">
            <a-radio-group v-model="remindForm.remindMode" :options="$DictList('app_shelf_remind_mode')"></a-radio-group>
          </a-form-model-item>
          <a-form-model-item v-if="remindForm.remindMode != 1" :label="$t('shelfRecord.change.remindType.text')" prop="desc">
            <a-textarea
              v-model="remindForm.desc"
              :placeholder="$t('shelfRecord.placeholder.remindType.desc')"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
          <a-form-model-item v-if="remindForm.remindMode != 1" :label="$t('shelfRecord.change.remindType.text.en')" prop="descEn">
            <a-textarea
              v-model="remindForm.descEn"
              :placeholder="$t('shelfRecord.placeholder.remindType.desc.en')"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
    <!-- 版本描述 -->
    <a-modal
      :title="$t('shelfRecord.column.desc')"
      :width="500"
      :visible="descVisible"
      :confirm-loading="confirmLoading"
      @ok="handleDescOk"
      @cancel="descVisible = false"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model  ref="descForm" class="regular-form" :model="descForm" :rules="descRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
          <a-form-model-item :label="$t('shelfRecord.column.version')" prop="version">
            {{ descForm.version }}
          </a-form-model-item>
          <a-form-model-item :label="$t('shelfRecord.column.desc')" prop="desc">
            <a-textarea
              v-model="descForm.description"
              :placeholder="$t('shelfRecord.placeholder.desc')"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </section>
</template>
<script>
import { getCustomizedAppVerionList, editLaunchMarkets, editRemark, getCustomizedAppQrCodeUrl,setRemindMode } from '@/api/customizedApp'
import QrCode from "@/components/VueQrCode/index.vue"
import { deepClone } from "@/utils/util"
export default {
  components: {
  },
  props:{
    type: { type: Number, default: 1 },
    appId: { type: String, default: '' },
    appKey: { type: String, default: '' },
    appName: { type: String, default: '' },
    version: { type: String, default: '' },
  },
  components: {
    QrCode
  },
  data(){
    return {
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => this.$t('public.pagination.total')+`:${total}` + this.$t('public.pagination.current') +`:${range[0]}-${range[1]}`,
      },
      columns:[
        {
          title: this.$t('shelfRecord.column.version'),
          dataIndex: "version",
          scopedSlots: { customRender: "version" },
        },
        {
          title: this.$t('shelfRecord.column.updateTime'),
          dataIndex: "updatedAt",
          scopedSlots: { customRender: "updatedAt" },
        },
        {
          title: this.$t('shelfRecord.column.desc'),
          dataIndex: "description",
          ellipsis: true,
          width: '15%',
        },
        {
          title: this.$t('shelfRecord.column.record'),
          dataIndex: "launchMarkets",
          scopedSlots: { customRender: "launchMarkets" },
        },
        {
          title: this.$t('shelfRecord.column.remindMode'),
          dataIndex: "remindMode",
          scopedSlots: { customRender: "remindMode" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "400px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      recordVisible: false,
      confirmLoading: false,
      recordForm:{},
      recordRules:{
        launchMarketCodes:[{ required: true, message: this.$t('shelfRecord.placeholder.appName'), trigger: 'change' },]
      },
      appList:[],
      descVisible:false,
      descForm:{},
      descRules:{
        version:[{ required: true, message: '', trigger: 'change' },],
        description:[{ required: true, message: this.$t('shelfRecord.placeholder.desc'), trigger: 'blur' },]
      },
      downloadVisible: false,
      downloadUrl: '',
      downloadData:'',
      pkgName:{
        1:{type: "ipa", accept:".ipa", name: this.$t('customizedApp.versionManage.tab.label.iosVersion')},
        2:{type: "apk", accept:".apk", name: this.$t('customizedApp.versionManage.tab.label.android1') },
        3:{type: "aab", accept:".aab", name: this.$t('customizedApp.versionManage.tab.label.android2') }
      },
      launchMarketLimit:{
        1:['1'],                    // iOS：App Store
        2:['3','4','5','6','7'],   // Android（国内版本）：应用宝、小米、华为、vivo、OPPO、（可多选）
        3:['2','8','9']            // Android（国外版本）：Google play、三星、荣耀（可多选）
      },   
      remindVisible:false,
      remindForm:{},
      remindRules:{
        remindMode:[{ required: true, message: this.$t('shelfRecord.placeholder.remindType'), trigger: 'change' }],
        desc:[{ required: true, message: this.$t('shelfRecord.placeholder.remindType.desc'), trigger: 'change' }],
        descEn:[{ required: true, message: this.$t('shelfRecord.placeholder.remindType.desc.en'), trigger: 'change' }]
      }
    }
  },
  created () {
    this.query()
  },
  watch:{
    appId(){
      this.query()
    }
  },
  computed:{
    launchMarketOptions(){
      return this.$DictList('release_market').filter(item=>this.launchMarketLimit[this.type].includes(item.value))
    }
  },
  methods: {
    //获取App列表
    async query() {
      const res = await getCustomizedAppVerionList({pageNum:this.pagination.current, pageSize:this.pagination.pageSize, query: {appId: this.appId, os: this.type, status:1}})
      if (res.code !== 0) return
      this.dataSource = res.data.list
      this.pagination.total = res.data.total
    },
    
    onChangePagination(e) {
      this.pagination.current = e.current
      this.pagination.pageSize = e.pageSize
      this.query()
    },

    // 下载
    async handleDownload(data){
      this.downloadData = data
      const res = await getCustomizedAppQrCodeUrl({appId: this.appId, version: data.version, os: this.os})
      if(res.code !== 0) return
      this.downloadUrl = res.data || ''
      this.downloadVisible = true
    },
    
    // 更改上架记录
    handleChangeRecord(data){
      this.$refs.recordForm?.resetFields()
      this.recordVisible = true
      this.recordForm = deepClone(data)
      if(data.launchMarkets){
        this.$set(this.recordForm,'launchMarketCodes',data.launchMarkets.map(item=>item.code))
      }
    },

    // 更改提醒方式
    handleChangeRemind(data){
      this.$refs.remindForm?.resetFields()
      this.remindVisible = true
      this.remindForm = {...data, remindMode:data.remindMode == 0 ? 1 :data.remindMode}
    },

    // 版本描述
    handleDesc(data){
      this.$refs.descForm?.resetFields()
      this.descVisible = true
      this.descForm = deepClone(data)
    },

    // 记录确认
    async handleRecordOk(){
      this.$refs.recordForm.validate(async(valid) => {
        if (!valid) return
        let params = {id: this.recordForm.id, launchMarkets: [] }
        this.recordForm.launchMarketCodes.forEach(value => {
          let releaseMarket = this.$DictList('release_market')
          releaseMarket.forEach(item=>{
            if(item.value == value){
              params.launchMarkets.push({code: item.value, name: item.label})
            }
          })
        });
        const res = await editLaunchMarkets(params)
        if(res.code !==0) return
        this.$message.info(this.$t('public.save.ok'))
        this.recordVisible = false
        this.query()
      });
    },

    // 提醒方式确认
    handleRemindOk(){
      this.$refs.remindForm.validate(async(valid) => {
        if (!valid) return
        const res = await setRemindMode(this.remindForm)
        if(res.code !==0) return
        this.$message.info(this.$t('public.save.ok'))
        this.remindVisible = false
        this.query()
      });
    },

    // 版本描述确认
    handleDescOk(){
      this.$refs.descForm.validate(async(valid) => {
        if (!valid) return
        let params = {id: this.descForm.id, description: this.descForm.description }
        const res = await editRemark(params)
        if(res.code !==0) return
        this.$message.info(this.$t('public.save.ok'))
        this.descVisible = false
        this.query()
      });
    },


  },

}
</script>
<style lang="less" scoped>
@import "../../../../global.less";

.page-wrap{
  padding: 20px;
}

.download-content{
  padding: 0 0 30px;
  text-align: center;
}
.qrcode-image-wrap{
  padding: 30px 0;
}
.version-text{
  margin: 20px auto;
  width: 310px;
}
.detail-text{
  width: 310px;
  margin: 0 auto;
  font-size: 12px;
  text-align: 24px;
  text-align: left;
}

</style>