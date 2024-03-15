<template>
  <section class="page-wrap">
    <a-page-header :title="$t('authority.title')" >
      <div class="table-msg">{{$t('authority.tips')}}</div>
      <!-- 筛选栏 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="10">
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-input
                  v-model="queryParam.userName"
                  :placeholder="$t('authority.userName.placeholder')"
                  :allowClear="true"
                  @keyup.enter.native="query"
                />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.accountType"
                  :placeholder="$t('authority.accountType.placeholder')"
                  default-value="0"
                  :options="$DictList('account_type')"
                  :allowClear="true"
                  @keyup.enter.native="queryList"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-form-item>
                <a-select
                  v-model="queryParam.roleId"
                  :placeholder="$t('authority.roleId.placeholder')"
                  default-value="0"
                  :options="roleList"
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
      <!-- /筛选栏 -->

      <!-- 表格操作栏 -->
      <div class="table-operator">
        <a-button type="primary" @click="handleAdd({},'add')" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{$t('authority.add.button')}}
        </a-button>
      </div>
      <!-- /表格操作栏 -->

      <!-- 表格 -->
      <a-table
        size="small"
        rowKey="id"
        :data-source="dataSource"
        :columns="columns"
        :loading="loading"
        :pagination="false"
      >
        <template  slot="accountType" slot-scope="text, record">
          {{ record.accountType==1 ? $t("authority.accountType.enterprise") : $t("authority.accountType.personal")}}
        </template>
        <template  slot="createdAt" slot-scope="createdAt">
          {{ createdAt | momentFilter }}
        </template>
        <template v-slot:action="item">
          <a-button type="link" size="small" @click="handleDelete(item.id)">
            {{ $t("public.delete") }}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" @click="handleAdd(item,'editRemark')">
            {{$t('authority.edit.remark')}}
          </a-button>
          <a-divider type="vertical" />
          <a-button type="link" size="small" @click="handleEdit(item.userName, item.roleId)">
            {{$t('authority.edit.button')}}
          </a-button>
        </template>
      </a-table>
      <!-- /表格 -->
      <!-- 新增授权弹窗 -->
      <a-modal
        :title="`${actionType == 'add'? $t('authority.add.button') : $t('authority.edit.remark')}`"
        :width="400"
        :visible="addVisible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-spin :spinning="confirmLoading">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
            <a-form-model-item :label="$t('authority.userName.label')" prop="userName" >
              <a-input v-model="form.userName" v-if="actionType == 'add'"/>
              <a-input v-model="form.userName" v-else disabled/>
            </a-form-model-item>
            <a-form-model-item :label="$t('public.remark')" prop="remark" >
              <a-input v-model="form.remark" :maxLength="250"/>
            </a-form-model-item>
          </a-form-model>
        </a-spin>
      </a-modal>
    </a-page-header>
  </section>
</template>
<script>
import { PHONE_REG, EMAIl_REG} from '@/utils/validate'
import { getAuthList, addAuth, editAuth,deleteAuth, getRoleList} from '@/api/authority'

export default {
  name: "Authority",
  components: {
  },
  data() {
    return {
      // 查询参数
      queryParam: {
      },
      columns: [
        {
          dataIndex: "userName",
          title: this.$t('authority.columns.userName'),
        },
        {
          dataIndex: "accountType",
          title: this.$t('authority.columns.accountType'),
          scopedSlots: { customRender: "accountType" },
        },
        {
          dataIndex: "roleName",
          title: this.$t('authority.columns.roleName'),
        },
         {
          dataIndex: "createdAt",
          title: this.$t('authority.columns.createdAt'),
          scopedSlots: { customRender: "createdAt" },
        },
        {
          dataIndex: "companyName",
          title: this.$t('authority.columns.companyName'),
        },
         {
          dataIndex: "remark",
          title: this.$t('authority.columns.remark'),
          width: "19%",
        },
        {
          title: this.$t("public.action"),
          key: "action",
          align: "center",
          width: "260px",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataSource: [],
      loading: false,
      addVisible:false,
      confirmLoading:false,
      form:{},
      rules:{
        userName:[{ required: true, message: this.$t('authority.rules.userName'), trigger: 'blur' }, { validator: this.validPhone, trigger: 'blur'}]
      },
      actionType:'',
      roleList:[]
    };
  },
  created() {
    if (!this.$route.meta.isBack) {
      // 初始化data的值
      Object.assign(this.$data, this.$options.data.call(this))
      this.queryList()
      this.getRoleList()
    }
  },
  beforeRouteEnter (to, from, next) {
    // 上次路由，设置isBack为 true 还是 false
    to.meta.isBack = from.path === '/authority/authorization/index' || from.path === '/dashboard/index'
    next()
  },

  activated () {
    if (this.$route.meta.isBack) {
      this.$route.meta.isBack = false // 重置isBack
      this.queryList()
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList(){
      const res = await getRoleList()
      if(res.code !== 0) return
      this.roleList = res.data?.map(item=>{
        return{ value:item.roleId, label:item.roleName }
      })
    },
    // 校验手机/邮箱
    validPhone(rule, value, callback){
      if(!PHONE_REG.test(value) && !EMAIl_REG.test(value)){callback(this.$t('user.register.phone.correct')) }
      callback()        
    },

    // 重置筛选参数
    reset() {
      this.queryParam = {}
      this.queryList()
    },
    
    // 获取列表
    async queryList() {
      const res = await getAuthList(this.queryParam)
      if(res.code !== 0) return
      this.dataSource =  res.data
    },

    // 新增授权
    handleAdd(data,type){
      this.actionType = type
      this.form = this.$deepClone(data)
      this.addVisible = true
    },

    // 新增授权弹窗取消
    handleCancel() {
      this.addVisible = false
      this.$refs.ruleForm?.resetFields()
    },

    // 新增授权弹窗确认
    handleOk(){
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true;
        let res= null
        if(this.actionType == 'add'){
          res = await addAuth(this.form)
        } else{
          res = await editAuth({"id": this.form.id, "remark": this.form.remark})
        }
        this.confirmLoading = false;
        if(res.code !== 0 ) return
        this.addVisible = false
        this.$refs.ruleForm?.resetFields()
        if(this.actionType == 'add'){
          this.$router.push({path:"/authority/authorization/index",query:{userName:this.form.userName}})
        } else{
          this.queryList()
        }
      });
    },

    // 权限设置
    handleEdit(userName, roleId){
      this.$router.push({path:"/authority/authorization/index",query:{userName, roleId:roleId?roleId:""}})
    },

    // 删除
    handleDelete(id){
      this.$WarningModal(this, this.$t('authority.delete.warning'),'',this.$t('public.delete')).then(async() => {
        const res = await deleteAuth({id})
          if (res.code !== 0) return
          this.queryList()
      })
    }

  },
};
</script>
<style lang="less" scoped>
@import "../../global.less";

.table-msg{
  height: 20px;
  font-size: 14px;
  font-weight: 400;
  color: @aithings-text-color-gray;
  line-height: 20px;
  margin-bottom: 10px;
}
</style>
