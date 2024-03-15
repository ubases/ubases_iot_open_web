<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('setting.sceneLinkage.title')"  @back="back">
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
            {{ $t('setting.sceneLinkage.tips1') }}<br/>
            {{ $t('setting.sceneLinkage.tips2') }}<br/>
            {{ $t('setting.sceneLinkage.tips3') }}
          </p>
          <a-button type="primary" @click="handleRuleset" class="grean-button">
            <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
            {{$t("setting.basic.config.ruleConfig.title")}}
          </a-button>
        </div>
        
        <a-table
          size="small"
          rowKey="id"
          :pagination="false"
          :data-source="instructData"
          :columns="instructColumns"
        >
          <template slot="triggerCond" slot-scope="text, item, index">
            <a-checkbox
              v-if="item.rwFlag === 'READ' || item.rwFlag === 'READ_WRITE'"
              v-model="item.triggerCond"
              @change="onChangeCheckbox($event, index, 'triggerCond')"
            >
            </a-checkbox>
            <div v-else>{{ $t('setting.sceneLinkage.notAllow.set') }}</div>
          </template>
          <template slot="execCond" slot-scope="text, item, index">
            <a-checkbox
              v-if="item.rwFlag === 'WRITE' || item.rwFlag === 'READ_WRITE'"
              v-model="item.execCond"
              @change="onChangeCheckbox($event, index, 'execCond')"
            >
            </a-checkbox>
            <div v-else>{{ $t('setting.sceneLinkage.notAllow.set') }}</div>
          </template>
        </a-table>
        <div class="button-wrap">
          <a-button type="primary" @click="handleSave">{{ $t('public.save') }}</a-button>
          <a-button @click="back">{{ $t('public.cancel') }}</a-button>
        </div>
      </div>
    </a-page-header>
  </section>
</template>

<script>
import { setSceneFunc, getProductDetails, getFuncList} from '@/api/product'

export default ({
  name:"SceneLinkage",
  components:{
  },
  data() {
    return {
      details: {},
      productId: '',
      productKey:'',
      status: 0,
      instructData:[],
      instructColumns: [
        {
          dataIndex: "dpid",
          title: "DP ID",
        },
        {
          dataIndex: "name",
          title: this.$t('setting.function.definition.columns.name'),
        },
        {
          dataIndex: "dataSpecsDesc",
          title: this.$t('setting.function.definition.columns.dataSpecsDesc'),
          ellipsis: true,
        },
        {
          dataIndex: "triggerCond",
          title: this.$t('setting.sceneLinkage.triggerCond'),
          scopedSlots: { customRender: "triggerCond" },
        },
        {
          dataIndex: "execCond",
          title: this.$t('setting.sceneLinkage.execCond'),
          scopedSlots: { customRender: "execCond" },
        },
      ],
    }
  },
  async mounted() {
    this.productId = this.$route.query.productId || ''
    this.status = this.$route.query.status || 0
    this.productKey = this.$route.query.productKey ||''
    if(this.productId) 
    await this.getProductDetails()
    this.getFuncList()
  },
  computed:{
  },

  methods:{

    // 获取产品详情
    async getProductDetails(){
      const res = await getProductDetails(this.productId)
      if(res.code !== 0) return
      this.details = res.data
    },

    // 查询配网引导详情
    async getFuncList(){
      const res = await getFuncList({productId:this.productId,custom:-1})
      if(res.code !==0) return
      this.instructData = res.data?.list.map(item=>{
        return{
          ...item,
          triggerCond: item.triggerCond == 1,
          execCond: item.execCond == 1
        }
      }) || []
    },

    onChangeCheckbox(data, index, type) {
      this.instructData[index][type] = data.target.checked;
    },

    // 保存
    async handleSave(){
      const list = this.instructData.map(item=>{
        return {
          id: item.id,
          triggerCond: item.triggerCond ? 1 : 0,
          execCond: item.execCond ? 1 : 0
        }
      })
      const res = await setSceneFunc({funcList:list, productId:this.productId})
      if(res.code !== 0) return
      this.$message.info(this.$t('public.action.succeed'))
      this.getFuncList()
    },
    
    // 规则设置
    handleRuleset(){
      this.$router.push({path:'/product/product/setting/basicConfig/ruleConfig/index',query:{productId:this.productId, productKey:this.productKey, status: this.status, from:'SceneLinkage'}})
    },

    // 返回
    back(){
      this.$router.push({ path: '/product/product/setting/index', name:'Setting', query:{productId: this.productId}, params:{tab: 3} })
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
