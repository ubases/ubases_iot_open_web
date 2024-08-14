<template>
  <section class="page-wrap no-padding" @click="showAppSearch = false">
    <a-page-header :title="$t('appMultilingual.title')">
      <template v-if="!noData">
        <app-change @dataChange="appChange" @isData="isData"/>
        <section class="content">
          <p>{{$t('appMultilingual.details')}}</p>
          <section class="card-content flex y-axis-center">
            <div class="card">
              <img :src="require('../../../../assets/image/icon9.png')" />
              <div class="card-title">01{{$t('appMultilingual.export.title')}}</div>
              <div class="card-remind">{{$t('appMultilingual.export.remind1')}}</div>
              <div class="export tap-pointer" @click="handleExport()">{{$t('public.export')}}</div>
              <div class="card-remind color">{{$t('appMultilingual.export.remind2')}}</div>
            </div>
            <img
              :src="require('../../../../assets/image/jiantou.png')"
              class="next"
            />
            <div class="card">
              <img :src="require('../../../../assets/image/icon10.png')" />
              <div class="card-title">02{{$t('appMultilingual.import.title')}}</div>
              <div class="card-remind">{{$t('appMultilingual.import.remind1')}}</div>
              <div class="card-remind">{{$t('appMultilingual.import.remind2')}}</div>
              <a-upload
                name="file"
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :showUploadList="false"
                :beforeUpload="beforeUpload"
                :customRequest="()=>{}"
              >
                <div class="export exportIn tap-pointer">{{$t('public.import')}}</div>
              </a-upload>
              <div class="card-remind color">{{$t('appMultilingual.export.remind2')}}</div>
            </div>
          </section>
        </section>
      </template>
       <template v-if="noData">
        <no-data :text="$t('appMultilingual.create.app.tips')" :buttonText="$t('appMultilingual.create.app')" path="/appDevelop/customizedApp/index"/>
      </template>
      <!-- 导出语言包弹窗 -->
      <a-modal
        :title="$t('appMultilingual.export.title')"
        :width="400"
        :visible="exportVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <div class="add-remind">
          <div>{{$t('appMultilingual.export.remind3')}}</div>
          <div>{{$t('appMultilingual.export.remind1')}}</div>
        </div>
      </a-modal>
      <!--导入语言包弹窗 -->
      <leading-in
        :appId="appId"
        :file="file"
        :visible="leadingInVisible"
        :error="error"
        :checking="checking"
        @handleOk="okLeadingIn"
        @handleCancel="cancelLeadingIn"
      ></leading-in>
    </a-page-header>
  </section>
</template>
<script>
import AppChange from "@/components/detailChange/AppChange.vue"
import leadingIn from "../components/leadingIn";
import NoData from "@/components/NoData/index.vue"

export default {
  name: "appMultilingual",
  components: {
    AppChange,
    leadingIn,
    NoData
  },
  data() {
    return {
      appId: "",
      file: {},
      exportVisible: false,
      leadingInVisible: false,
      confirmLoading: false,
      error:'',
      checking:false,
      noData:false
    };
  },

  methods: {
    // app切换
    appChange(data){
      this.appId = data.appId
    },
    // 是否有App
    isData(value){
      this.noData = !value
    },
    //点击导出按钮,显示导出弹窗
    handleExport() {
      this.exportVisible = true;
    },
    //确认导出语言包
    handleOk() {
      this.exportVisible = false;
      this.$DownloadTemplate(
        this,
        { url: `/v1/platform/open/lang/customResources/download?appKey=${this.appId}` },
        this.$t('appMultilingual.export.fileName') +".xlsx",
        "get"
      );
    },
    //取消导出语言包
    handleCancel() {
      this.exportVisible = false;
    },

    beforeUpload(file) {
      if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.$message.warning(this.$t('public.uploadFile.right.type'))
        return false
      } 
      this.leadingInVisible = true
      this.error = ''
      this.checking = true
      const isLimit = file.size / 1024 / 1024 > 10
      if (isLimit) {
        this.error = this.$t('public.uploadFile.max') + "10M"
        return false
      }
      this.file = file
      this.checking = false
      return false
    },
    //确认导入语言包
    okLeadingIn() {
      this.leadingInVisible = false;
      this.$message.success(this.$t('public.upload.succeed'))
    },
    //取消导入语言包
    cancelLeadingIn() {
      this.leadingInVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.page-wrap {
  box-shadow: none;
}
.cards-content {
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
}
/deep/.ant-page-header {
  font-size: 12px;
  font-weight: 400;
  color: @aithings-text-color-gray;
  line-height: 17px;
}
/deep/.ant-page-header-heading {
  padding: 20px !important;
}
/deep/.ant-page-header-content {
  padding-top: 0;
}
.content {
  padding: 30px 20px 0;
  .card-content {
    padding-top: 40px;
  }
  .card {
    flex: 1;
    text-align: center;
    padding: 40px 0 43px;
    height: 320px;
    border-radius: 4px;
    border: 1px solid @aithings-border-color;
    img {
      width: 64px;
      height: 64px;
    }
    .card-title {
      margin: 20px 0 10px;
      height: 21px;
      font-size: 15px;
      font-weight: 600;
      color: @aithings-text-color-black;
      line-height: 21px;
    }
    .card-remind {
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: @aithings-text-color-gray;
      line-height: 20px;
    }
    .export {
      padding: 7px 22px;
      margin: 38px auto 10px;
      width: 140px;
      line-height: 20px;
      height: 34px;
      font-size: 14px;
      font-weight: 400;
      color: @primary-color;
      border-radius: 4px;
      border: 1px solid @primary-color;
    }
    .exportIn {
      margin: 18px auto 10px !important;
    }
    .color {
      color: @aithings-text-tips-color;
    }
    &.active {
      box-shadow: 0px 2px 4px 1px rgba(127, 160, 210, 0.4);
      border: 1px solid @primary-color;
    }
  }
  .next {
    height: 66px;
    width: 76px;
    margin: 0 21px 0 8px;
  }
}
.add-remind {
  text-align: center;
  padding: 30px 0 28px;
  font-size: 14px;
  font-weight: 400;
  color: @aithings-text-color-gray;
  line-height: 20px;
}
</style>
