<template>
  <section class="page-wrap no-padding" @click="showSearch=false">
    <a-page-header :title="$t('fault.statistics.title')" >
      <product-change v-show="!noData" :detailList="['productTypeName','networkTypeDesc']" @dataChange="productChange" @isData="isData" />
      <section v-if="!noData" class="content">
        <section>
          <div class="flex x-space-between">
            <h4>{{$t('fault.statistics.count.title')}}</h4>
          </div>
          <section class="chart-wrap">
            <div id="countTooltip" class="tooltip"></div>
            <div id="countChart"></div>
          </section>
        </section>
        <section>
          <div class="flex x-space-between">
            <h4>{{$t('fault.statistics.count.type')}}</h4>
          </div>
          <section class="chart-wrap">
            <div id="typeTooltip" class="tooltip"></div>
            <div id="typeChart"></div>
          </section>
        </section>
      </section>
      <template v-if="noData">
        <no-data :text="$t('fault.statistics.noData.text')" :buttonText="$t('fault.statistics.noData.button')" path="/product/product/createProduct/index"/>
      </template>
    </a-page-header>
  </section>
</template>
<script>
import { Chart } from '@antv/g2'
import ProductChange from '@/components/detailChange/ProductChange.vue'
import NoData from "@/components/NoData/index.vue"
import {getDeviceFault} from "@/api/dataManage"

export default {
  components: {
    ProductChange,
    NoData
  },
  data() {
    return {
      productKey:'',
      countChart:null,
      typeChart:null,
      typeChartData:[],
      countChartData:[],
      noData:true
    };
  },
 
  mounted() {},
  methods: {

    //是否有数据
    isData(val){
      this.noData = !val
    },

    // 产品切换
    productChange(data){
      this.productKey = data.productKey
      this.getDeviceFault()
    },
        
    // 获取图表数据
    async getDeviceFault(){
      const res = await getDeviceFault({productKey:this.productKey})
      if(res.code !== 0)return
      this.countChartData = res.data?.deviceMonFault?.data || []
      this.typeChartData = res.data?.deviceFaultType?.data || []
      this.countChart ? this.countChart.changeData(this.countChartData) : this.initcountChart()
      this.typeChart ? this.typeChart.changeData(this.typeChartData) : this.inittypeChart()
    },

    // 累计故障总数
    initcountChart(){
      this.countChart = new Chart({
        container: 'countChart',
        autoFit: true,
        height: 250,
      });
      this.countChart.data(this.countChartData);
      this.countChart.scale('total', {
        nice: true,
      });
      this.countChart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        crosshairs:{
          line:{
            fill:'#BDC0C4'
          },
        },
        shared: true,
        showContent:false
      })
      const tooltip = document.getElementById("countTooltip")
      // 鼠标进入辅助线
      this.countChart.on('tooltip:show', ev => {
        tooltip.innerHTML = `${ev.data.items[0].title} ${ev.data.items[0].value}`
        tooltip.style.left = `${ev.data.items[0].x+7}px`
        tooltip.style.display = 'block'
      });

      // 鼠标离开辅助线
      this.countChart.on('tooltip:hide', ev => {
        tooltip.style.display = 'none'
      });
      this.chartConfig(this.countChart)
      this.countChart.interaction('active-region');
      this.countChart.line().position('time*total').color('#3B7CFF ')
      
      this.countChart.render();
    },

    // 故障类型
    inittypeChart(){
      this.typeChart = new Chart({
        container: 'typeChart',
        autoFit: true,
        height: 250,
      });
      this.typeChart.data(this.typeChartData);
      this.typeChart.scale('total', {
        nice: true,
      });
      this.showToolTip(this.typeChart,"typeTooltip") 
      this.chartConfig(this.typeChart)
      this.typeChart.interaction('active-region');

      this.typeChart.interval().position('faultType*total').color('l(90) 0:#3B7CFF 1:#ffffff').size(30)
      
      this.typeChart.render();
      },

    showToolTip(chart, tooltipName){
      chart.tooltip(false)
      const tooltip = document.getElementById(tooltipName)
      // 鼠标进入柱子
      chart.on('element:mousemove', ev => {
        tooltip.innerHTML = `${ev.data.data.faultType} ${ev.data.data.total}`
        tooltip.style.left = `${ev.x}px`
        tooltip.style.display = 'block'
      });

      // 鼠标离开柱子
      chart.on('element:mouseleave', ev => {
        tooltip.style.display = 'none'
      });
    },
        // 统一配置
    chartConfig(chart){
      // 配置坐标轴
      chart.axis('total',{
        grid: {
          line:{
            style:{
              stroke:"#DAE6F8",
              width:1,
              lineDash: [5],
            }
          },
        },
        label:{
          style:{
            fill:"#70757D",
            fontSize: 12
          }
        },
      })

      chart.axis('time',{
        tickLine:false,
        label:{
          style:{
            fill:"#70757D",
            fontSize: 12
          }
        },
        line:{
          style:{
            stroke:"#DAE6F8",
            width:1,
          }
        },
      })
    }
  },
  beforeDestroy(){
    this.countChart?.destroy()
    this.typeChart?.destroy()
  }
};
</script>
<style lang="less" scoped>
@import "../../../../global.less";
/deep/.ant-page-header-content{
  padding-top: 0;
}
.content{
  padding: 25px 20px 20px;
  .chart-wrap{
    padding: 43px 20px 43px 10px;
    position: relative;
    .tooltip{
      display: none;
      min-width: 110px;
      min-height: 28px;
      white-space:nowrap;
      position: absolute;
      padding: 0 5px;
      top:0;
      transform: translate(-50%,0);
      background: #FFFFFF;
      box-shadow: 0px 2px 1px 0px rgba(127, 160, 210, 0.4);
      border: 1px solid @primary-color;
      text-align: center;
      line-height: 28px;
      &::after,&::before{
        position: absolute;
        content: '';
        border: 5px solid;
        left: 50%;
        transform: translateX(-3px);
      }
      &::before{
        bottom: -10px;
        border-color: @primary-color transparent transparent;
      }
      &::after{
        bottom: -9px;
        border-color: #fff transparent transparent;
      }
    }
  }
}
</style>
