<template>
  <section class="app-account-test">
    <h4>{{$t('setting.test.service.app.test.account')}}</h4>
    <div class="flex y-axis-center x-space-between detail-row">
      <p class="details">{{$t('setting.test.service.app.test.detail')}}</p>
      <a-button class="grean-button" @click="addTestAccount"> <icon-font type="icon-add" :style="{ fontSize: '18px' }" />{{$t('setting.test.service.add.app.test.account')}}</a-button>
    </div>
    <!-- 表格 -->
    <a-table
      size="small"
      rowKey="did"
      :data-source="dataSource"
      :columns="columns"
      :loading="loading"
      :pagination="false"
    >
      <template v-slot:action="record">
        <a-button
          type="link"
          size="small"
          @click="handleDelete(record)"
        >
          {{$t('public.delete')}}
        </a-button>
      </template>
    </a-table>
    <!-- 添加APP测试账号 -->
    <a-modal
      :title="$t('setting.test.service.add.app.test.account')"
      :visible="visible"
      :width="480"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="visible = false"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="form" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-model-item prop="appkey" :label="$t('setting.test.service.select.app')">
            <a-select v-model="form.appkey" :options="appList" :placeholder="$t('setting.test.service.select.app.placeholder')"/>
          </a-form-model-item>
          <a-form-model-item prop="account" :label="$t('setting.test.service.account.label')">
            <a-input v-model="form.account" :placeholder="$t('setting.test.service.account.placeholder')"/>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </section>
</template>

<script>
import { getTestAccount, addTestAccount, deleteTestAccount} from "@/api/product"
import { getAppList } from '@/api/appExploit'
export default {
  props:{
    productId: { type: String, default: '' },
  },
  components:{
  },
  data(){
    return{
      dataSource:[],
      columns:[
        {
          dataIndex: "appName",
          title: 'APP',
        },
        {
          dataIndex: "account",
          title: this.$t('setting.test.service.app.account'),
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "left",
          width: "100px",
          scopedSlots: { customRender: "action" },
        },
      ],
      loading: false,
      appList: [],
      form:{},
      rules:{
        appkey:[{ required: true, message: this.$t('setting.test.service.select.app.placeholder'), trigger: 'change' },],
        account:[{ required: true, message: this.$t('setting.test.service.account.placeholder'), trigger: 'change' },]
      },
      visible: false,
      confirmLoading: false
    }
  },
  async mounted(){
    await this.getAppList()
    this.getAppAccountList()
  },
  methods:{
    // 获取全部应用
    async getAppList(){
      const res = await getAppList()
      if (res.code !==0) return
      this.appList = res.data?.list?.map(item=>{
        return{
          label: item.name,
          value: item.appKey
        }
      })
    },
    // 添加app测试账号
    addTestAccount(){
      this.visible =true
      this.$refs.form?.resetFields()
    },

    // 获取测试账号列表
    async getAppAccountList(){
      const res = await getTestAccount({page:1, limit:100, query:{productId:this.productId}})
      if(res.code !== 0) return
      const list = res.data.list || []
      this.dataSource = list.map(item=>{
        return {
          ...item,
          appName:this.appList.filter(t=>t.value == item.appKey)?.pop()?.label || ''
        }
      })

    },

    // 删除账号
    handleDelete(data){
      this.$ConfirmModal(this, this.$t('helpCenter.catalog.delete.content'), this.$t('public.ready_delete'),this.$t('public.sumit')).then(async() => {
        const res = await deleteTestAccount(data.id)
        if(res.code !== 0) return
        this.$message.success(this.$t('public.action.succeed'))
        this.getAppAccountList()
      })
    },

    // 确认添加
    handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await addTestAccount({...this.form, productId:this.productId})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.visible = false
        this.getAppAccountList()
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../../../global.less";
.app-account-test{
    margin-top: 30px;
    h4{
      padding: 10px 0;
      font-size: 15px;
    }
    .detail-row{
      margin-bottom: 20px;
    }
  }
</style>