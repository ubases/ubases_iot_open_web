<template>
    <!-- 产品详情 -->
  <div class="product-details flex y-axis-center">
    <section class="image-wrap">
      <img :src="productDetails.imageUrl || ''" class="product-image"/>
    </section>
    <section class="details">
      <p v-text="productDetails.name" class="product-name"></p>
      <section>
        <a-row :gutter="40" type="flex">
          <a-col v-for="item in detailList" :key="item">
            {{detailOrigin[item]}}：{{productDetails[item]}}
          </a-col>
        </a-row>
      </section>
    </section>
    <section class="exchange-product-wrap" v-if="exchangeBtn">
      <a-button @click.stop="exchangeProduct"><exchange-icon></exchange-icon>{{$t('productChange.change.product')}}</a-button>
      <a-select class="product-search" v-if="showProductSearch" defaultOpen show-search :placeholder="$t('productChange.placeholder.product.search')" @change="handleProductChange">
        <a-select-option v-for="product in productList" :key="product.id" :value="product.name+'_'+product.id">
          <section class="flex y-axis-center">
            <h4>{{product.name}}</h4>
            <div style="margin-left:10px; height:22px; font-size: 14px; line-height:20px; padding: 0 10px; border: 1px solid #DAE6F8; border-radius:14px;">{{product.powerConsumeTypeDesc}}</div>
          </section>
          <section class="flex y-axis-center x-space-between">
            <span>{{$t('productChange.productKey')}}：{{product.productKey}}</span>
            <span>{{$t('productChange.productTypeName')}}：{{product.productTypeName}}</span>
            <span>{{$t('productChange.networkTypeDesc')}}：{{product.networkTypeDesc}}</span>
          </section>
        </a-select-option>
      </a-select>
    </section>
  </div>
</template>
<script>
import { ExchangeIcon} from '@/core/icons'
import { getProductList } from "@/api/product"
export default {
  props:{
    exchangeBtn:{type: Boolean, default: true},
    productId:{type: String, default: ''},
    detailList:{ type: Array, default: ()=>['productTypeName','productKey','networkTypeDesc','powerConsumeTypeDesc']},
    param:{type:Object, default:()=>{}}
  },
  components: {
    ExchangeIcon,
  },
  data(){
    return {
      productDetails:{},
      productList:[],
      showProductSearch:false,
      detailOrigin:{
        productTypeName: this.$t('productChange.detailOrigin.productTypeName'),
        productKey: this.$t('productChange.detailOrigin.productKey'),
        networkTypeDesc: this.$t('productChange.detailOrigin.networkTypeDesc'),
        powerConsumeTypeDesc: this.$t('productChange.detailOrigin.powerConsumeTypeDesc'),
      }
    }
  },
  created(){
    this.queryProductList()
  },
  methods:{
    // 产品信息列表
    async queryProductList(){
      let params = {page:0}
      if(this.param){
        params = {...params, ...this.param}
      }
      const res = await getProductList(params)
      this.$emit('isData',res.code == 0 && res.data.list && res.data.list.length > 0)
      if(res.code !== 0)return
      this.productList = res.data?.list ?? []
      if(this.productId){
        this.productDetails = this.productList.filter(item => item.id == this.productId).pop() || {}
      } else {
        this.productDetails = this.productList.length>0?this.productList[0]:{}
      }
      this.$emit('dataChange',this.productDetails)
    },
    // 点击切换产品
    exchangeProduct() {
      this.showProductSearch = !this.showProductSearch
    },

    // 切换产品
    handleProductChange(val){
      this.showProductSearch = !this.showProductSearch
      const id = val.split('_').pop()
      //通过id请求产品详情
      this.productDetails = this.productList.filter(item => item.id == id).pop()
      this.$emit('dataChange',this.productDetails)
    },
  }

}
</script>
<style scoped lang="less">
@import "../../global.less";
.product-details{
  padding: 0 20px 25px;
  line-height: 17px;
  border-bottom: 1px solid @aithings-border-color;
  .image-wrap{
    width: 64px;
    height: 64px;
    margin-right: 10px;
    
    .product-image{
      max-width: 64px;
      max-height: 64px;
      border-radius: 4px;
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
  /deep/.ant-btn{
    color: @primary-color;
    border: 1px solid @primary-color;
    svg{
      transform: translateY(3px);
      margin-right: 10px;
    }
  }
  .exchange-product-wrap{
    position: relative;
    .product-search{
      width: 600px;
      max-height: 400px;
      position: absolute;
      right: 0;
      bottom: -40px;
    }
  }
}
</style>