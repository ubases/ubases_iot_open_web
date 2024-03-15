<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="$t('firmware.details.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <a-tabs v-model="activeTab">
          <!-- 固件基本信息 -->
          <a-tab-pane key="1" :tab="$t('firmware.details.basic.msg')">
            <a-form class="firmware-msg-form" v-if="type !== 'edit'" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-item v-for="(item,index) in basicMsg" :key="index" :label="item.label">
                {{item.filter ?$DictName(item.filter,editForm[item.value]): editForm[item.value]}}
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 20, offset: 2 }">
                <a-button type="primary" @click="editMsg">{{$t("public.Modify")}}</a-button>
                <a-button @click="deleteFirmware">{{$t("public.delete")}}</a-button>
                <a-button @click="back">{{$t("public.back")}}</a-button>
              </a-form-item>
            </a-form>
            <a-form-model class="firmware-msg-form" v-if="type === 'edit'" ref="ruleForm" :model="editForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-model-item :label="$t('firmware.details.label.name')" prop="name" >
                <a-input v-model="editForm.name" :maxLength="50"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('firmware.details.label.id')" prop="id" >
                {{editForm.id}}
              </a-form-model-item>
              <a-form-model-item :label="$t('firmware.details.label.flag')" prop="flag" >
                <a-input v-model="editForm.flag"/>
              </a-form-model-item>
              <a-form-model-item :label="$t('firmware.details.label.type')" prop="type" >
                <a-select v-model="editForm.type" default-value="" :options="$DictList('firmware_type')">
                </a-select>
              </a-form-model-item>
              <a-form-model-item :label="$t('firmware.details.label.flash')" prop="flashSize" >
                <a-select v-model="editForm.flashSize" default-value="" :options="$DictList('flash_size')" />
              </a-form-model-item>
              <a-form-model-item :label="$t('firmware.details.label.upgradeOvertime')" prop="upgradeOvertime" >
                <a-input-number
                    v-model="editForm.upgradeOvertime"
                    :precision="0"
                    :min="1"
                    :max="300"
                  />
                  <span class="ant-form-text">{{$t("firmware.second")}}</span>
              </a-form-model-item>
              <a-form-model-item :label="$t('public.remark')" prop="remark" >
                <a-textarea v-model="editForm.remark" :auto-size="{ minRows: 2}" :maxLength="500"/>
              </a-form-model-item>
              <a-form-item :wrapper-col="{ span: 20, offset: 2 }">
                <a-button type="primary" @click="sumitEdit"> {{$t('public.sumit')}}</a-button>
                <a-button @click="deleteFirmware">{{$t("public.delete")}}</a-button>
                <a-button @click="cancelEdit">{{$t('public.cancel')}}</a-button>
              </a-form-item>
            </a-form-model>
          </a-tab-pane>
          <!-- /固件基本信息 -->

          <!-- 固件版本信息 -->
          <a-tab-pane key="2" :tab="$t('firmware.details.version.msg')">
            <!-- 表格操作栏 -->
            <div class="table-operator">
              <a-button type="primary" @click="editVersion({})" class="grean-button">
                <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
                {{$t('firmware.details.version.add')}}
              </a-button>
            </div>
            <a-table
              size="small"
              rowKey="id"
              :pagination="false"
              :data-source="dataSource"
              :columns="columns"
              :loading="loading"
            >
            <template slot="status" slot-scope="text, record">
              {{$DictName('version_status',record.status)}}
            </template>
            <template slot="upgradeMode" slot-scope="text, record">
              {{$DictName('upgrade_pkg_mode',record.upgradeMode)}}
            </template>
            <template slot="isMust" slot-scope="text, record">
              {{$DictName('yes_no',record.isMust)}}
            </template>
            <template slot="updatedAt" slot-scope="text, record">
              {{ record.updatedAt | momentFilter }}
            </template>
            
              <template v-slot:action="record">
                <a-button v-if="record.status != 1" type="link"  size="small"  @click="handlePublish(record)"  >
                  {{ $t("firmware.putaway") }}
                </a-button>
                 <a-divider v-if="record.status != 1" type="vertical" />
                <a-button type="link"  size="small"  @click="editVersion(record)"  >
                  {{ $t("public.edit") }}
                </a-button>
                 <a-divider type="vertical" />
                <a-button :disabled="record.status == 1" v-if="true" type="link" size="small" @click="deleteVersion(record.id)">
                  {{$t("public.delete")}}
                </a-button>
              </template>
            </a-table>
          </a-tab-pane>
          <!-- /固件版本信息 -->
        </a-tabs>
      <publish-version :visible="publishVisible" :firmwareVersionData="firmwareVersionData" :firmwareId="id" @handleCancel="cancelPublish" @handleOk="sumitPublish"></publish-version>
      <edit-version :visible="editVersionVisible" :data="firmwareVersionData" :firmwareId="id" @cancelEdit="cancelEditVersion" @sumitEdit="sumitEditVersion"></edit-version>
      </section>
    </a-page-header>
 </section>
</template>
<script>
import { getFirmwareDetail,deleteFirmware,editFirmware,getFirmwareVersionList,deleteFirmwareVersion } from "@/api/firmware";
import PublishVersion from '../component/PublishVersion.vue';
import EditVersion from '../component/EditVersion.vue'
import { CommonNameRules} from "@/utils/validate"

export default {
  name: "FirmwareDetails",
  components: {
    PublishVersion,
    EditVersion
  },
  data() {
    return {
      activeTab:"1",
      id: "",
      type:"",
      firmwareData:{},
      editForm:{},
      basicMsg:[
        {label:this.$t('firmware.firmwareName'), value:'name'},
        {label:this.$t('firmware.key'), value:'id'},
        {label:this.$t('firmware.flag'), value:'flag'},
        {label:this.$t('firmware.type'), value:'type',filter:"firmware_type"},
        {label:this.$t('firmware.flashSize'), value:'flashSize',filter:"flash_size"},
        {label:this.$t('firmware.upgradeOvertime'), value:'upgradeOvertime'},
        {label:this.$t('public.remark'), value:'remark'},
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        xl: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      // 表格
      loading: false,
      dataSource: [],
      publishVisible:false,
      firmwareVersionData:{},
      editVersionVisible:false,
      columns: [
        {
          dataIndex: "version",
          title: this.$t("firmware.version"),
        },
        {
          dataIndex: "desc",
          title: this.$t("firmware.versionDetails"),
          width: '20%'
        },
        {
          dataIndex: "upgradeMode",
          title: this.$t("firmware.upgradeType"),
          scopedSlots: { customRender: 'upgradeMode' }
        },
        {
          dataIndex: "isMust",
          title: this.$t("firmware.keyVersion"),
          scopedSlots: { customRender: 'isMust' }
        },
        {
          dataIndex: "upgradeFileSize",
          title: this.$t("firmware.size"),
        },
        {
          dataIndex: "updatedAt",
          title: this.$t("firmware.updateTime"),
          scopedSlots: { customRender: 'updatedAt' }
        },
        {
          dataIndex: "status",
          title: this.$t("firmware.status"),
          scopedSlots: { customRender: "status" },
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "left",
          width: "200px",
          scopedSlots: { customRender: "action" },
        },
      ],
      rules: {
        name: CommonNameRules(this.$t("firmware.inputName")),
        flag: CommonNameRules(this.$t("firmware.inputFlag")),
        type: [{ required: true, message: this.$t("firmware.inputType"), trigger: 'change' }],
        flashSize: [{required: true,message: this.$t("firmware.inputFlashSize"),trigger: 'change',}],
        upgradeOvertime: [{ required: true, message: this.$t("firmware.inputUpgradeTime"), trigger: 'blur' }],
        remark:[ { max:500, message: this.$t('firmware.version.rule.versionDesc'), trigger: 'blur' },]
      },
    };
  },

  mounted() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    if (this.type === "addVersion") this.activeTab = "2"  // 加版本
    this.getFirmwareDetails()
    this.getFirmwareVersionList()
  },
  methods: {
    // 获取固件详情
    async getFirmwareDetails() {
      const res = await getFirmwareDetail(this.id)
      if(res.code !==0) return
      this.editForm = res.data
      this.firmwareData = res.data
    },

    // 获取固件版本列表
    async getFirmwareVersionList(){
      const res = await getFirmwareVersionList({query: {firmwareId:this.id}})
       if(res.code !==0) return
       this.dataSource = res.data.list
    },

    // 点击修改固件基础信息
    editMsg(){
      this.type = "edit"
      this.editForm = this.firmwareData
    },

    // 确认修改固件信息
    sumitEdit(){
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        const res = await editFirmware(this.editForm)
        if(res.code !== 0 ) return
        this.getFirmwareDetails()
        this.type = "details"
      });
     
    },
    // 取消修改固件信息
    cancelEdit(){
      this.type = "details"
    },

    // 删除固件
    deleteFirmware() {
      this.$WarningModal(this, this.$t('firmware.delete.firmware.confirm')).then(async() => {
        const res = await deleteFirmware({'id':this.id})
        if(res.code !== 0) return
        this.$router.push({path:'/product/firmware/index'})
      })
    },

    // 版本上架
    handlePublish(data){
      this.firmwareVersionData = {...data}
      this.publishVisible = true
    },

    // 版本确认上架
    sumitPublish(){
      this.publishVisible = false
      this.getFirmwareVersionList()
    },

    // 取消上架
    cancelPublish() {
      this.publishVisible = false
    },

    // 点击新建/编辑版本
    editVersion(data) {
      this.firmwareVersionData = {...data}
      this.editVersionVisible = true
    },

    // 取消新建/编辑版本
    cancelEditVersion() {
      this.editVersionVisible = false
    },

    // 确认编辑版本
    sumitEditVersion(){
      this.editVersionVisible = false
      this.getFirmwareVersionList()
    },

    //删除版本
    deleteVersion(id) {
      this.$WarningModal(this, this.$t('firmware.delete.firmware.version.confirm')).then(async() => {
        const res = await deleteFirmwareVersion({id})
        if(res.code !== 0) return
        this.getFirmwareVersionList()
      })
    },

    // 返回
    back() {
      this.$router.push({path:'/product/firmware/index'})
    }
  },
};
</script>
<style lang="less" scoped>
  @import "../../../../global.less";
  @import "../../../../utils/utils.less";
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    padding: 20px;
  }
  
  /deep/.firmware-msg-form.ant-form{
    .ant-form();
    .ant-btn{
      padding: 0 28px;
      border: 1px solid @aithings-text-tips-color;
      color: @aithings-text-tips-color;
    }
    .ant-btn-primary{
      background: @primary-color;
      border: 1px solid @primary-color;
      color: #fff;
    }
  }

  /deep/ .ant-tabs-bar{
    border: 0;
  }

  .ant-btn + .ant-btn {
    margin-left: 20px;
  }
  .ant-btn-link{
    color: @primary-color;
  }
  .ant-btn-link:disabled{
    color: @aithings-color-E9EAEE;
  }

</style>
