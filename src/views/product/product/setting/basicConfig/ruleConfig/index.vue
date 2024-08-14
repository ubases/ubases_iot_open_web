<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('setting.basic.config.ruleConfig.title')"  @back="back">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <!-- 产品详情 -->
      <div class="product-details flex y-axis-center">
        <section class="image-wrap">
          <img :src="details.imageUrl || ''" class="product-image"/>
        </section>
        <section class="details">
          <p v-text="details.name" class="product-name"></p>
          <section>
            <a-row :gutter="40" type="flex">
              <a-col>
                {{$t('setting.network.info.details.productTypeName')}}:{{details.productTypeName}}
              </a-col>
              <a-col>
                {{$t('setting.network.info.details.productKey')}}:{{details.productKey}}
              </a-col>
              <a-col>
                {{$t('setting.network.info.details.networkType')}}: {{$DictName('network_type',details.networkType)}}
              </a-col>
              <a-col>
                {{$t('setting.network.info.details.powerConsumeType')}}:{{$DictName('power_consume_type',details.powerConsumeType)}}
              </a-col>
            </a-row>
          </section>
        </section>
      </div>
      <!-- /产品详情 -->
      <div class="scene-content">
        <div class="flex y-axis-center x-space-between">
          <p class="tips-text">
            {{ $t('setting.basic.config.ruleConfig.detail1') }}<br/>
            {{ $t('setting.basic.config.ruleConfig.detail2') }}<br/>
            {{ $t('setting.basic.config.ruleConfig.detail3') }}
          </p>
          <a-button type="primary" @click="handleEdit({},'add')" class="grean-button">
            <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
            {{$t("setting.ruleConfig.addRule.btn")}}
          </a-button>
        </div>
        
        <a-table size="small" rowKey="id" :pagination="false" :data-source="dataSource" :columns="columns">
          <span :class="{enable:record.status == 1}" slot="status" slot-scope="text, record">
            {{ $DictName('rule_set_status', record.status) }}
          </span>
          <section slot="ifSpecsDesc" slot-scope="text, record">
            <p v-for="(item, index) in record.ifSpecsDesc" :key="index">
              {{ item }}
            </p>
          </section>
          <section slot="thenSpecsDesc" slot-scope="text, record">
            <p v-for="(item, index) in record.thenSpecsDesc" :key="index">
              {{ item }}
            </p>
          </section>
          <template v-slot:action="item">
            <section class="action-wrap">
              <a-button v-if="item.status == 2" type="link" size="small" @click="handleSetStatus(item)">
                {{ $t("public.enable") }}
              </a-button>
              <a-button v-if="item.status == 1" type="link" size="small" @click="handleSetStatus(item)">
                {{ $t("public.stop") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="handleEdit(item,'edit')">
                {{ $t("public.edit") }}
              </a-button>
              <a-divider type="vertical" />
              <a-button type="link" size="small" @click="handleDelete(item.id)">
                {{$t("public.delete")}}
              </a-button>
            </section>
          </template>
        </a-table>
      </div>
      <edit-rule 
      :visible="visible" 
      :type="editType" 
      :productId="productId" 
      :productKey="productKey"
      :detail="ruleDetail"
      :funcOptions="funcOptions"
      :dataSource="funcDataSource"
      :dataOrigin="0"
      @handleCancel="visible=false" 
      @handleOk="handleOk"/>
    </a-page-header>
  </section>
</template>

<script>
import { getProductDetails, getTranslateFuncList} from '@/api/product'
import { getRuleSetList, deleteRuleSet, editRuleSetStatus } from '@/api/ruleConfig'
import EditRule from "./components/EditRule.vue"

export default ({
  name:"RuleConfig",
  components:{
    EditRule
  },
  data() {
    return {
      details: {},
      productId: '',
      productKey:'',
      status: 0,  
      from:'',
      dataSource:[],
      columns: [
        { customRender: (item,value,index) => index + 1, title: this.$t('public.sort.number')},
        { dataIndex: "ruleName", title: this.$t('setting.ruleConfig.columns.ruleName')},
        { dataIndex: "ifSpecsDesc", title: this.$t('setting.ruleConfig.columns.if'), scopedSlots: { customRender: "ifSpecsDesc" }},
        { dataIndex: "thenSpecsDesc", title: this.$t('setting.ruleConfig.columns.then'), scopedSlots: { customRender: "thenSpecsDesc" }},
        { dataIndex: "status", title: this.$t('setting.ruleConfig.columns.status'), scopedSlots: { customRender: "status" }},
        { title: this.$t("public.action"), key: "action", align: "center", width: "200px", scopedSlots: { customRender: "action" }},
      ],
      funcOptions:[],
      funcDataSource:{},
      visible:false,
      editType:'',
      ruleDetail:{}
    }
  },
  async mounted() {
    this.productId = this.$route.query.productId || ''
    this.productKey = this.$route.query.productKey || ''
    this.status = this.$route.query.status || 0
    this.from = this.$route.query.from || ''
    if(this.productId) {
      await this.getProductDetails()
      await this.getFuncList()
      this.getList()
    }
  },
  computed:{},

  methods:{

    // 获取产品详情
    async getProductDetails(){
      const res = await getProductDetails(this.productId)
      if(res.code !== 0) return
      this.details = res.data
    },

    // 查询列表
    async getList(){
      const res = await getRuleSetList({productId:this.productId, dataOrigin:0})
      if(res.code !==0) return
      this.dataSource = res.data?.map(item=>{
        const ifSpecs = JSON.parse(item.ifSpecs)
        const thenSpecs = JSON.parse(item.thenSpecs)
        const ifSpecsDesc = ifSpecs.map(t=>{
          const data = this.funcDataSource[t.dpId]
          let value = t.value
          if(t.operate != 5){
            if(data.dataType == 'ENUM'|| data.dataType == 'FAULT' || data.dataType == 'BOOL'){
              value = data.dataSpecsList.filter(f=>f.value == value)?.pop()?.label || ''
            } 
          } else {
            value = ''
          }
          
          return `${data.name}${this.$DictName('rule_if_operation',t.operate)}${value}`
        })
        const thenSpecsDesc = thenSpecs.map(t=>{
          const data = this.funcDataSource[t.dpId]
          let value = ''
          if(t.operate == 1){
            if(data.dataType == 'ENUM'|| data.dataType == 'FAULT' || data.dataType == 'BOOL'){
              value = data.dataSpecsList.filter(f=>f.value == t.value)?.pop()?.label || ''
            } else {
              value = t.value
            }
          } 
          return `${data.name}${this.$DictName('rule_then_operation',t.operate)}${value}`
        })
        return {
          ...item,
          ifSpecs,
          thenSpecs,
          ifSpecsDesc,
          thenSpecsDesc
        }
      }) || []
    },


     // 查询功能列表
     async getFuncList(){
      const res = await getTranslateFuncList({productId:this.productId, condType: 'all'})
      if(res.code !==0) return
      
      this.funcOptions = res.data?.map(item=>{
        this.funcDataSource[item.dpId] = {
          ...item,
          dataSpecs:item.dataSpecs ? JSON.parse(item.dataSpecs) : {},
          dataSpecsList: (item.dataSpecsList ? JSON.parse(item.dataSpecsList) : []).map(item=>{
            return {
              value:item.value,
              label:item.desc||item.name
            }
          })
        }
        return{
          value:item.dpId,
          label:item.name,
          rwFlag:item.rwFlag
        }
      }) || []
    },

    // 编辑
    handleEdit(item,type){
      this.editType = type
      this.visible = true
      this.ruleDetail = {...item, dataOrigin:0}
      
    },
    
    // 编辑保存
    handleOk(){
      this.visible = false
      this.getList()
    },

    // 启用/停用
    async handleSetStatus(item){
      const res = await editRuleSetStatus({id: item.id, status:item.status==1 ? 2: 1})
      if(res.code!==0) return
      this.$message.success(this.$t('public.update.succeed'))
      this.getList()
    },

    // 删除
    async handleDelete(id){
      const res = await deleteRuleSet(id)
      if(res.code!==0) return
      this.$message.success(this.$t('public.delete_success'))
      this.getList()
    },

    // 返回
    back(){
      if(this.from=='product'){
        this.$router.push({ path: '/product/product/setting/index', name:'Setting', query:{productId: this.productId}, params:{tab: 3} })
      } else {
        this.$router.back(-1)
      }
      
    }
  }
})
</script>

<style lang="less" scoped>
@import "../../../../../../global.less";
/deep/ .ant-page-header-content{
  padding-top: 0;
}
.product-details{
  padding: 0 50px 25px;
  line-height: 17px;
  border-bottom: 1px solid @aithings-border-color;
  .image-wrap{
    width: 64px;
    height: 64px;
    margin-right: 10px;
    .product-image{
      max-width: 64px;
      max-height: 64px;
    }
  }
  .details{
    flex: 1;
  }
  .product-name{
    padding-bottom: 10px;
    color: @aithings-text-color-black;
    font-weight: 600;
    line-height: 20px;
  }

}
.enable{
  color: @aithings-green-color-38CB52;
}
.scene-content{
  padding: 30px 20px 15px;
}
.tips-text{
  padding-bottom: 30px;
  line-height: 22px;
}
.button-wrap{
  padding-top: 30px;
  .ant-btn{
    padding-left: 36px;
    padding-right: 36px;
  }
  .ant-btn + .ant-btn{
    margin-left: 10px;
  }
}

</style>
