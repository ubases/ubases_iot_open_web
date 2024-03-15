<template>
  <section class="page-wrap no-padding" @click="showAppSearch = false">
    <a-page-header :title="$t('problemType.title')">
      <template>
        <app-change @dataChange="appChange"/>
        <section class="content">
          <p>{{$t('problemType.tips')}}</p>
          <div class="table-operator">
            <a-button type="primary" class="grean-button" @click="handleAdd">
              <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
              {{$t('problemType.button.add')}}
            </a-button>
          </div>
          <!-- 表格 -->
          <a-table
            size="small"
            rowKey="id"
            :data-source="dataSource"
            :columns="columns"
            :loading="loading"
            :pagination="false"
          >
            <template  slot="updatedAt" slot-scope="text, record">
              {{ record.updatedAt | momentFilter }}
            </template>
            <template v-slot:action="item">
              <a-button type="link" size="small" @click="handleEdit(item)">{{$t('public.edit')}}</a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="handleDelete(item)">{{$t('public.delete')}}</a-button>
            </template>
          </a-table>
        </section>
      </template>
    </a-page-header>
    <a-modal
      :title="(editType === 'add'?$t('public.add'):$t('public.edit')) + $t('problemType.edit.title')"
      :width="680"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form-model  ref="ruleForm" class="regular-form" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
          <a-form-model-item :label="$t('problemType.label.sort')" prop="sort">
            <a-input-number v-model="form.sort" :min="0" :precision="0" :placeholder="$t('problemType.placeholder.sort')"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('problemType.label.zh')" prop="name">
            <a-input v-model="form.name" :maxLength="20" :placeholder="$t('problemType.placeholder')"/>
          </a-form-model-item>
          <a-form-model-item :label="item.langName" v-for="item in langsList" :prop="item.lang" :key="item.lang">
            <a-input v-model="form[item.lang]" :maxLength="50" :placeholder="$t('problemType.placeholder')"/>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </section>
</template>
<script>
import AppChange from "@/components/detailChange/AppChange.vue"
import { addProblemType, editProblemType, getProblemTypeList, getProblemTypeDetail, deleteProblemType } from "@/api/problemType"
import { getPubLangs } from '@/api/helpCenter'

export default {
  name: "ProblemType",
  components: {
    AppChange,
  },
  data() {
    return {
      appId: "",
      columns: [
        {
          dataIndex: "name",
          title: this.$t('problemType.column.classify'),
        },
        {
          dataIndex: "sort",
          title: this.$t('problemType.column.sort'),
        },
        {
          dataIndex: "updatedAt",
          title: this.$t('problemType.column.updateTime'),
          scopedSlots: { customRender: "updatedAt" },
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
      editType: '',
      visible: false,
      confirmLoading:false,
      form:{},
      rules:{
        sort:[{ required: true, message: this.$t('problemType.rule.sort'), trigger: '' }],
        name:[{ required: true, message: this.$t('problemType.rule.zh'), trigger: '' }],
      },
      langsList:[]
    };
  },
  mounted(){
    this.getPubLangs()
  },
  methods: {
    // app切换
    appChange(data){
      this.appId = data.appId
      this.getProblemTypeList()
    },

    // 获取问题类型列表
    async getProblemTypeList(){
      const res = await getProblemTypeList({appId: this.appId})
      if(res.code !== 0) return
      this.dataSource = res.data || []
    },

    // 删除
    handleDelete(data){
      this.$WarningModal(this, this.$t('problemType.delete.confirm')).then(async () => {
        const res = await deleteProblemType(data.id)
        this.toast(res)
        if(res.code!==0)return
        this.getProblemTypeList()
      });
    },

    // 获取公版语种
    async getPubLangs(){
      const res = await getPubLangs()
      if(res.code !== 0)return
      this.langsList = res.data.filter(item=>item.lang !== 'zh')
    },

    // 添加
    handleAdd(){
      this.editType = 'add'
      this.form = {appId: this.appId}
      this.visible = true
    },

    // 编辑
    async handleEdit(data){
      this.editType = 'edit'
      // 获取详情
      const res = await getProblemTypeDetail(data.id)
      if(res.code !== 0) return
      const { id,name,sort} = {...res.data}
      this.form = { id,name,sort}
      if(res.data?.docDirLangs && res.data.docDirLangs.length > 0){
        this.langsList.forEach(lang=>{
          const name = res.data.docDirLangs.filter(item=>item.lang===lang.lang)?.pop()?.dirName
          if(name){
            this.$set(this.form,lang.lang,name)
          }
        })
      }
      this.visible = true
    },

    // 确认
    handleOk(){
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) return
        const docDirLangs = this.langsList.map(item=>{
          return {
            dirName: this.form[item.lang] || '',
            lang: item.lang,
            langName: item.langName,
          }
        })
        const params = {
          ...this.form,
          docDirLangs
        }
        this.confirmLoading = true
        const res =this.editType === 'add' ? await addProblemType(params) : await editProblemType(params)
        this.confirmLoading = false
        if(res.code !==0)return
        this.visible = false
        this.getProblemTypeList()
      })
    },

    // 取消
    handleCancel(){
      this.visible = false
    }
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
}
/deep/.ant-input-number{
  width: 100%;
}
</style>
