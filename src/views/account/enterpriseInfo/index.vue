<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('enterpriseInfo.title')">
      <section class="content">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item :label="$t('enterpriseInfo.companyName.label')">
            {{form.companyName}}
            <a-button type="link" :disabled="form.status == 2 || form.status == 3" @click="changeName">{{$t('enterpriseInfo.change.button')}}</a-button>
          </a-form-item>
            <a-form-item :label="$t('enterpriseInfo.status.label')">
            {{$DictName('auth_status',form.status)}}
            <a-button type="link" v-if="form.status != 2 && form.status != 3" @click="toAuthentication(1)">{{$t('enterpriseInfo.toAuthentication.button')}}</a-button>
            <a-button type="link" v-if="form.status == 2 || form.status == 3" @click="toAuthentication(0)">{{$t('enterpriseInfo.checkAuthentication.button')}}</a-button>
          </a-form-item>
        </a-form>
        <h2>{{$t('enterpriseInfo.contect.title')}}</h2>
        <div class="table-operator">
          <a-button type="primary" @click="handleAdd" class="grean-button">
            <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
            {{$t('enterpriseInfo.add.contect')}}
          </a-button>
        </div>
            <!-- 表格 -->
        <a-table
          rowKey="id"
          size="small"
          :data-source="dataSource"
          :columns="columns"
          :loading="loading"
          :pagination="false"
        >
          <template v-slot:action="record">
            <a-button type="link" size="small" @click="handleEdit(record)">{{$t("public.edit")}}</a-button>
            <a-button type="link" size="small" @click="handleDelete(record)">{{$t("public.delete")}}</a-button>
          </template>
        </a-table>
      </section>
    </a-page-header>
    <!-- 企业名称变更 -->
    <a-modal
      :title="$t('enterpriseInfo.changeModal.title')"
      :visible="nameVisible"
      :width="250"
      :confirm-loading="confirmLoading"
      @ok="handleNameOk"
      @cancel="handleNameCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="nameForm" :model="nameForm" :rules="nameRules" :wrapper-col="{span: 24}">
          <a-form-model-item prop="companyName" label="">
            <a-input v-model="nameForm.companyName" :maxLength="50" :placeholder="$t('enterpriseInfo.companyName.editLabel')"/>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>

    <!-- 新增/编辑联系人 -->
    <a-modal
      :title="editTitle"
      :visible="contactVisible"
      :width="460"
      :confirm-loading="confirmLoading"
      @ok="handleContactOk"
      @cancel="handleContactCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model ref="contactForm" :model="contactForm"  :rules="contactRules" :label-col="{ span: 6 }" :wrapper-col="{span: 18}">
          <a-form-model-item prop="name" :label="$t('enterpriseInfo.name.editLabel')">
            <a-input v-model="contactForm.name" :maxLength="50" :placeholder="$t('enterpriseInfo.companyName.placeholder')" />
          </a-form-model-item>
          <a-form-model-item prop="account" :label="$t('enterpriseInfo.account.editLabel')">
            <a-input v-model="contactForm.account" :maxLength="50" :placeholder="$t('enterpriseInfo.account.placeholder')" />
          </a-form-model-item>
          <a-form-model-item prop="phone" :label="$t('enterpriseInfo.phone.editLabel')">
            <a-input v-model="contactForm.phone" :placeholder="$t('enterpriseInfo.phone.placeholder')" />
          </a-form-model-item>
          <!-- <a-form-model-item prop="email" label="邮箱">
            <a-input v-model="contactForm.email" placeholder="请输入邮箱" />
          </a-form-model-item> -->
          <a-form-model-item prop="address" :label="$t('enterpriseInfo.address.editLabel')">
            <a-input v-model="contactForm.address" :maxLength="150" :placeholder="$t('enterpriseInfo.address.placeholder')" />
          </a-form-model-item>
          <a-form-model-item prop="job" :label="$t('enterpriseInfo.job.editLabel')">
            <a-input v-model="contactForm.job" :maxLength="150" :placeholder="$t('enterpriseInfo.job.placeholder')" />
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </section>
</template>
<script>
import { getCompanyInfo,addCompanyContacts,changeCompanyContacts,deleteCompanyContacts,companyChangename} from '@/api/account'
import { PHONE_REG } from "@/utils/validate";
export default {
  name:"EnterpriseInfo",
  components: {
  },
  data(){
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      form:{},
      // pagination: {
      //   showSizeChanger: true,
      //   current: 1,
      //   pageSize: 10,
      //   total: 0,
      //   showTotal: (total, range) =>
      //     `总数:${total} 当前:${range[0]}-${range[1]}`,
      // },
      columns: [
        {
          dataIndex: "name",
          title: this.$t('enterpriseInfo.name.columnTitle'),
        },
        {
          dataIndex: "account",
          title: this.$t('enterpriseInfo.account.columnTitle'),
        },
        {
          dataIndex: "phone",
          title: this.$t('enterpriseInfo.phone.columnTitle'),
        },
        {
          dataIndex: "address",
          title: this.$t('enterpriseInfo.address.columnTitle'),
          width: "19%",
          scopedSlots: { customRender: "address" },
        },
        {
          dataIndex: "job",
          title: this.$t('enterpriseInfo.job.columnTitle'),
          width: "19%",
          scopedSlots: { customRender: "job" },
        },
        {
          title: this.$t('public.action'),
          key: "action",
          align: "left",
          width: "220px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      nameVisible: false,
      nameForm: {companyName:''},
      nameRules: {
        companyName:[{ required: true, message: this.$t('enterpriseInfo.companyName.rules'), trigger: '' },]
      },
      editTitle:'',
      contactVisible:false,
      contactForm: {},
      contactRules: {
        name:[
          { required: true, message: this.$t('enterpriseInfo.name.rules'), trigger: 'blur' },
        ],
        account:[
          { required: true, message: this.$t('enterpriseInfo.account.rules'), trigger: 'blur' },
        ],
        phone:[
          { required: true, message: this.$t('enterpriseInfo.phone.rules1'), trigger: 'blur' },
          { pattern: PHONE_REG, message: this.$t('enterpriseInfo.phone.rules2') },
        ],
        // email:[
        //   { required: true, message: '请输入邮箱', trigger: 'blur' },
        // ],
      },
      confirmLoading: false,
      
    }
  },
  mounted(){
    // this.getList();
    this.getCompanyBase();
  },
  methods:{
    // 去认证
    toAuthentication(type){
      this.$router.push({name:"EnterpriseCertification",query:{type}})
    },
    //获取企业基本信息
    async getCompanyBase(){
      const res = await getCompanyInfo()
      if(res.code !== 0) return
      this.form = res.data;
      this.dataSource=res.data.connect
    },

    // onChangePagination(e) {
    //   this.pagination.current = e.current
    // },

    // 获取联系人列表
    // async getList () {
      // const res = await 
    // },

    // 新增联系人
    handleAdd(){
      this.editTitle = this.$t('enterpriseInfo.addTitle')
      this.contactForm = {}
      this.contactVisible = true
    },

    // 编辑
    handleEdit(data){
      this.editTitle = this.$t('enterpriseInfo.editTitle')
      this.contactForm = {...data}
      this.contactVisible = true
    },

    // 删除
    handleDelete(data){
      this.$WarningModal(this, this.$t('public.confirm.delete')+`${data.name}?`).then(async () => {
        const res = await deleteCompanyContacts(data.id)
        this.toast(res)
        if(res.code!==0)return
        this.getCompanyBase()
      });
    },

    // 提交新建/编辑联系人 contactForm.id判断
    handleContactOk(){
      this.$refs.contactForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = this.contactForm.id ? await changeCompanyContacts(this.contactForm) : await addCompanyContacts(this.contactForm)
        this.confirmLoading = false
        if(res.code !== 0) return
        this.contactVisible = false
        this.getCompanyBase()
      });
    },

    // 取消编辑联系人
    handleContactCancel() {
      this.contactVisible = false
    },

    // 变更企业名称
    changeName(){
      this.nameForm['companyName'] = this.form.companyName
      this.nameVisible = true
    },

    // 更改企业名称提交
    handleNameOk(){
      this.$refs.nameForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await companyChangename({id:this.form.id,companyName:this.nameForm.companyName})
        this.confirmLoading = false
        if(res.code !== 0) return
        this.nameVisible = false
        this.getCompanyBase()
      });
    },
    // 更改企业名称取消
    handleNameCancel(){
      this.confirmLoading = false
      this.nameVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../global.less";
.content{
  padding: 0 20px;
}
/deep/.ant-btn-link:disabled{
    color: rgba(0,0,0,.25);
  }
</style>