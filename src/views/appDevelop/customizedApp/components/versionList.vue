<template>
  <section>
    <div class="table-operator flex y-axis-center x-space-between">
      <a-button type="primary" @click="handleAdd" class="grean-button">
        <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
        {{$t('UserAgreement.add.version')}}
      </a-button>
    </div>
    <a-table
      size="small"
      rowKey="id"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="false"
    >
      <span slot="createdAt" slot-scope="createdAt">
        {{ createdAt | momentFilter }}
      </span>
      <span slot="updatedAt" slot-scope="updatedAt">
        {{ updatedAt | momentFilter }}
      </span>
      <span slot="status" slot-scope="text, record" :style="{color:statusTextColor[record.status]}">
        {{$DictName('user_agreement_status',record.status)}}
      </span>
      <template v-slot:action="record">
        <a-button v-if="record.status == 2" type="link" size="small" @click="handleEnable(record)">
          {{$t('public.enable')}}
        </a-button>
        <a-divider v-if="record.status == 2" type="vertical" />
        <a-button type="link" size="small" @click="handleDownload(record)">
          {{$t('public.download')}}
        </a-button>
        <a-divider v-if="record.status == 2" type="vertical" />
        <a-button v-if="record.status == 2" type="link" size="small" @click="handleEdit(record)">
          {{$t("public.edit")}}
        </a-button>
        
      </template>
    </a-table>
    <!-- 添加/编辑版本 -->
    <a-modal
      v-if="visible"
      :title="editType == 'add' ? $t('customizedApp.versionManage.add.title') : $t('customizedApp.versionManage.edit.title')"
      :visible="visible"
      :width="520"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="form" :model="form"  :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{span: 18}">
          <a-form-model-item prop="version" :label="$t('UserAgreement.label.version')">
            <section class="flex y-axis-center">
              <a-input v-model="form.version" :placeholder="$t('UserAgreement.placeholder.version')" :maxLength="12" class="item-input"/>
              <p class="item-tips">{{$t('UserAgreement.version.tips')}}</p>
            </section>
          </a-form-model-item>
          <a-form-model-item prop="description" :label="$t('customizedApp.versionManage.columns.desc')">
            <a-textarea v-model="form.description" :maxLength="255"  :auto-size="{ minRows: 3}"/>
          </a-form-model-item>
          <a-form-model-item prop="pkgUrl" :label="$t('customizedApp.versionManage.label.package',{name:pkgName[os].type})">
          <upload-button 
            type="file"
            :accept="pkgName[os].accept"
            :acceptList="[pkgName[os].accept]"
            :limitSize="200"
            :buttonText="form.pkgUrl ? $t('public.reupload') : $t('public.upload.file')"
            :warningFileType="pkgName[os].type"
            catalogName="app"
            :fileUrl="form.pkgUrl"
            :fileName="`${appName}.${pkgName[os].type}`"
            :suffixValid="true"
            @uploaded="uploaded"
          />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>

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
        <p>{{ pkgName[os].name }}</p>
        <p>{{ $t('customizedApp.versionManage.column.version') }}:{{ downloadData.version }}</p>
      </div>
      <p class="detail-text">{{ $t('customizedApp.versionManage.download.detail1') }}</p>
      <p class="detail-text">{{ $t('customizedApp.versionManage.download.detail2') }}</p>
    </section>

      <template slot="footer">
        <a-button key="cancel"  @click="downloadVisible = false">{{$t('optionalConfig.doc.close')}}</a-button>
      </template>
    </a-modal>
  </section>
</template>

<script>
import { VersionRules} from "@/utils/validate"
import UploadButton from "@/components/uploadButton"
import QrCode from "@/components/VueQrCode/index.vue"
import { addCustomizedAppVerion, editCustomizedAppVerion, setCustomizedAppVerion, getCustomizedAppQrCodeUrl, getCustomizedAppVerionList } from "@/api/customizedApp"
  export default ({
    name: "versionList",
    props:{
      os: { type: Number, default: 1},
      appId: { type: String, default: ''},
      appName: { type: String, default: ''},
    },
    components: {
      UploadButton,
      QrCode
    },
    data() {
      return {
        dataSource:[],
        columns:[
          {
            dataIndex: "version",
            title: this.$t('customizedApp.versionManage.column.version'),
          },
          {
            dataIndex: "createdAt",
            title: this.$t('UserAgreement.columns.createdAt'),
            scopedSlots: { customRender: 'createdAt' }
          },
          {
            dataIndex: "updatedAt",
            title: this.$t('UserAgreement.columns.updatedAt'),
            scopedSlots: { customRender: 'updatedAt' }
          },
          {
            dataIndex: "status",
            title: this.$t('customizedApp.versionManage.columns.status'),
            key: "status",
            scopedSlots: { customRender: 'status' }
          },
          {
            dataIndex: "description",
            ellipsis: true,
            title: this.$t('customizedApp.versionManage.columns.desc'),
          },
          {
            title: this.$t("public.action"),
            key: "action",
            width: "210px",
            scopedSlots: { customRender: "action" },
          },
        ],
        loading: false,
        visible:false,
        confirmLoading:false,
        form:{},
        rules:{
          version: VersionRules(),
          pkgUrl: [{ required: true, message: this.$t('customizedApp.versionManage.rules.package'), trigger: 'change' },]
        },
        editType:'',
        pkgName:{
          1:{type: "ipa", accept:".ipa", name: this.$t('customizedApp.versionManage.tab.label.iosVersion')},
          2:{type: "apk", accept:".apk", name: this.$t('customizedApp.versionManage.tab.label.android1') },
          3:{type: "aab", accept:".aab", name: this.$t('customizedApp.versionManage.tab.label.android2') }
        },
        statusTextColor:{
          1: '#38CB52',
          2: '#70757D',
          3: '#FF3333',
        },
        downloadVisible: false,
        downloadUrl: '',
        downloadData:''
      }
    },
    mounted(){
      if(this.appId){
        this.getCustomizedAppVerionList()
      }
    },
    watch:{
      appId(){
        this.getCustomizedAppVerionList()
      }
    },
    methods:{
      async getCustomizedAppVerionList(){
        const res = await getCustomizedAppVerionList({query:{os: this.os, appId:this.appId}, sortField:'version',sort:'desc'})
        if (res.code !== 0) return
        this.dataSource = res.data?.list || []
      },

      // 新增版本
      handleAdd(){
        this.editType = 'add'
        this.form = {}
        this.visible = true
      },

      handleCancel(){
        this.visible = false
      },

      // 新增确定
      handleOk(){
        this.$refs.form.validate(async(valid) => {
          if (!valid) return
          this.confirmLoading = true
          const params = {appId:this.appId, os: this.os, status:2, ...this.form}
          const res = this.editType == 'add' ? await addCustomizedAppVerion(params) : await editCustomizedAppVerion(params)
          this.confirmLoading = false
          if(res.code !==0) return
          this.$message.info(this.$t('public.save.ok'))
          this.getCustomizedAppVerionList()
          this.visible = false
        });
      },

      // 编辑
      handleEdit(data){
        this.form = {...data}
        this.editType = 'edit'
        this.visible = true
      },

      // 启用
      async handleEnable(data){
        const res = await setCustomizedAppVerion({id: data.id, status: 1})
        if(res.code !==0) return
        this.$message.info(this.$t('public.action.succeed'))
        this.getCustomizedAppVerionList()
      },

      // 下载
      async handleDownload(data){
        this.downloadData = data
        const res = await getCustomizedAppQrCodeUrl({appId: this.appId, version: data.version, os: this.os})
        if(res.code !== 0) return
        this.downloadUrl = res.data || ''
        this.downloadVisible = true
      },

      uploaded(data){
        this.$set(this.form,'pkgUrl', data.fullPath)
        this.$set(this.form,'pkgMd5', data.key)
        this.$refs.form.clearValidate('pkgUrl');
      }
    }
  })

</script>

<style lang="less" scoped>
@import "../../.././../global.less";

.item-input{
  width:50%
}
.item-tips{
  padding-left: 20px;
  font-size: 12px;
  color: @aithings-text-tips-color;
}
.file-wrap{
  padding-right: 20px;
  text-decoration: underline;
  color: @primary-color;
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