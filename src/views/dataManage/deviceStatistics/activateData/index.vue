<template>
  <section class="page-wrap no-padding" @click="showSearch=false">
    <a-page-header :title="$t('device.statistics.title')" >
      <product-change v-show="!noData" :detailList="['productTypeName','networkTypeDesc']" @dataChange="productChange" @isData="isData"/>
      <section v-if="!noData" class="content">
        <a-row :gutter="20">
          <a-col :xs="24" :md="8" v-for="item in totalList" :key="item.key">
            <div class="card">
              <div class="number-wrap">
                <p v-text="item.label"></p>
                <p class="total-num">{{totalData[item.key] | NumberFormat}}</p>
              </div>
            </div>
          </a-col>
        </a-row>
        <section class="chart-block">
          <div class="flex x-space-between">
            <h4>{{$t('device.statistics.active.title')}}</h4>
          </div>
          <section class="chart-wrap">
            <div id="activeTooltip" class="tooltip"></div>
            <div id="activeChart"></div>
          </section>
        </section>
        <section>
          <div class="flex x-space-between">
            <h4>{{$t('device.statistics.count.title')}} {{countTotal}}</h4>
          </div>
          <section class="chart-wrap">
            <div id="countTooltip" class="tooltip"></div>
            <div id="countChart"></div>
          </section>
        </section>
        
      </section>
      <template v-if="noData">
        <no-data :text="$t('device.statistics.noData.text')" :buttonText="$t('device.statistics.noData.button')" path="/product/product/createProduct/index"/>
      </template>
    </a-page-header>
  </section>
</template>
<script>
import { Chart } from '@antv/g2';
import ProductChange from '@/components/detailChange/ProductChange.vue'
import NoData from "@/components/NoData/index.vue"
import {getDeviceActive} from "@/api/dataManage"

export default {
  components: {
    ProductChange,
    NoData
  },
  data() {
    return {
      productKey:'',
      countChart:null,
      activeChart:null,
      activeChartData:[],
      countChartData:[],
      noData:true,
      countTotal:'',
      totalData:{},
      totalList:[
        { label:this.$t('activateData.total.today'), key:'today'},
        { label:this.$t('activateData.total.sevenDays'), key:'sevenDays'},
        { label:this.$t('activateData.total.total'), key:'total'},
      ],
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
      this.getDeviceActive()
    },
    
    // 获取图表数据
    async getDeviceActive(){
      const res = await getDeviceActive({productKey:this.productKey})
      if(res.code !== 0)return
      this.countChartData = res.data?.deviceMonActive?.data || []
      this.countTotal = res.data?.deviceMonActive?.total || ''
      this.activeChartData = res.data?.deviceDayActive?.data || []
      this.countChart ? this.countChart.changeData(this.countChartData) : this.initcountChart()
      this.activeChart ? this.activeChart.changeData(this.activeChartData) : this.initActiveChart()
      this.totalData = {
        today: res.data?.deviceTodayActive || 0,
        sevenDays: res.data?.device7DayActive || 0,
        total: res.data?.deviceActiveAll || 0,
      }
    },

    // 累计注册激活用户
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
      });
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

    // 近30天的活跃用户
    initActiveChart(){
      this.activeChart = new Chart({
        container: 'activeChart',
        autoFit: true,
        height: 250,
      });
      this.activeChart.data(this.activeChartData);
      this.activeChart.scale('total', {
        nice: true,
      });
      
      this.showToolTip(this.activeChart,"activeTooltip")  
      this.chartConfig(this.activeChart)
      this.activeChart.interaction('active-region');

      this.activeChart.interval().position('time*total').color('l(90) 0:#3B7CFF 1:#ffffff')
      
      this.activeChart.render();
    },    

    showToolTip(chart, tooltipName){
      chart.tooltip(false)
      const tooltip = document.getElementById(tooltipName)
      // 鼠标进入柱子
      chart.on('element:mousemove', ev => {
        tooltip.innerHTML = `${ev.data.data.time.split(' ').shift()} ${ev.data.data.total}`
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
    this.activeChart?.destroy()
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
      height: 28px;
      position: absolute;
      top:0;
      transform: translateX(-50%);
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
        top: 27px;
        border-color: @primary-color transparent transparent;
      }
      &::after{
        top: 26px;
        border-color: #fff transparent transparent;
      }
    }
  }
}
/deep/.ant-row-flex{
    padding: 20px 0;
  }
.card{
  padding: 22px 20px 23px;
  height: 100px;
  border-radius: 4px;
  border: 1px solid @aithings-border-color;
  .number-wrap{
    padding-left: 15px;
  }
  .total-num{
    padding-top: 7px;
    font-size: 20px;
    font-weight: 500;
    color: @primary-color;
    line-height: 28px;
  }
  &.active{
    box-shadow: 0px 2px 4px 1px rgba(127, 160, 210, 0.4);
    border: 1px solid @primary-color;
  }
}
.chart-block{
  padding-top: 30px;
}
</style>
