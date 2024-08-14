<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('UsageAnalysis.title')" >
      <!-- 详情 -->
      <app-change  v-show="!noData" :detailList="['version','appKey']" @dataChange="appChange" @isData="isData"/>
      
      <section v-if="!noData" class="content">
        <a-row :gutter="20">
          <a-col :xs="24" :md="6" v-for="item in totalList" :key="item.key">
            <div class="card">
              <div class="number-wrap">
                <p v-text="item.label"></p>
                <p class="total-num">{{totalData[item.key] | NumberFormat}}</p>
              </div>
            </div>
          </a-col>
        </a-row>
        <section class="chart-block">
          <h4>{{ $t('UsageAnalysis.app.usageData.last30days') }}</h4>
          <div class="flex x-space-between tab-block">
            <a-button-group>
              <a-button>{{ $t('UsageAnalysis.tab1') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.tab2') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.tab3') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.tab4') }}</a-button>
            </a-button-group>
            <a-button type="link" class="export-btn">{{ $t('public.export') }}</a-button>
          </div>
          <section class="chart-wrap">
            <div id="tooltip1" class="tooltip"></div>
            <div id="chart1"></div>
          </section>
        </section>
        <section>
          <h4>{{ $t('UsageAnalysis.app.function.use') }}</h4>
          <div class="flex x-space-between tab-block">
            <a-button-group>
              <a-button>{{ $t('UsageAnalysis.app.function.tab1') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.app.function.tab2') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.app.function.tab3') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.app.function.tab4') }}</a-button>
            </a-button-group>
            <a-button type="link" class="export-btn">{{ $t('public.export') }}</a-button>
          </div>
          <section class="chart-wrap">
            <div id="tooltip2" class="tooltip"></div>
            <div id="chart2"></div>
          </section>
        </section>
        <section>
          <div class="flex x-space-between tab-block">
            <a-button-group>
              <a-button>{{ $t('UsageAnalysis.new.trend') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.delete.trend') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.increase.trend') }}</a-button>
              <a-button>{{ $t('UsageAnalysis.share.family') }}</a-button>
            </a-button-group>
            <a-button type="link" class="export-btn">{{ $t('public.export') }}</a-button>
          </div>
          <section class="chart-wrap">
            <div id="tooltip3" class="tooltip"></div>
            <div id="chart3"></div>
          </section>
        </section>
        
      </section>
      <template v-if="noData">
        <no-data :text="$t('user.analysis.noData.text')" :buttonText="$t('user.analysis.noData.button')" path="/appDevelop/OEMApp/index"/>
      </template>
    </a-page-header>
  </section>
</template>
<script>

import AppChange from "@/components/detailChange/AppChange.vue"
import { Chart } from '@antv/g2';
import NoData from "@/components/NoData/index.vue"
import { getAppuser } from "@/api/dataManage"
import moment from "moment";

export default {
  name: "UsageAnalysis",
  components: {
    AppChange,
    NoData
  },
  data() {
    return {
      appKey:'',
      chart1:null,
      chart2:null,
      chart3:null,
      chart1Data:[],
      chart2Data:[
        { time: '03-19', type: this.$t('UsageAnalysis.autoexec'), value: 32000 },
        { time: '03-19', type: this.$t('UsageAnalysis.manual.execution'), value: 30000 },
        { time: '03-20', type: this.$t('UsageAnalysis.autoexec'), value: 35000 },
        { time: '03-20', type: this.$t('UsageAnalysis.manual.execution'), value: 32000 },
        { time: '03-21', type: this.$t('UsageAnalysis.autoexec'), value: 39000 },
        { time: '03-21', type: this.$t('UsageAnalysis.manual.execution'), value: 37000 },
        { time: '03-22', type: this.$t('UsageAnalysis.autoexec'), value: 44000 },
        { time: '03-22', type: this.$t('UsageAnalysis.manual.execution'), value: 42000 },
        { time: '03-23', type: this.$t('UsageAnalysis.autoexec'), value: 47000 },
        { time: '03-23', type: this.$t('UsageAnalysis.manual.execution'), value: 44000 },
        { time: '03-24', type: this.$t('UsageAnalysis.autoexec'), value: 48000 },
        { time: '03-24', type: this.$t('UsageAnalysis.manual.execution'), value: 46000 },
        { time: '03-25', type: this.$t('UsageAnalysis.autoexec'), value: 50000 },
        { time: '03-25', type: this.$t('UsageAnalysis.manual.execution'), value: 48000 },
      ],
      chart3Data:[],
      noData:true,
      registerTotal:'',
      totalData:{},
      totalList:[
        { label:this.$t('UsageAnalysis.total.label1'), key:'userAccount'},
        { label:this.$t('UsageAnalysis.total.label2'), key:'numberAccount'},
        { label:this.$t('UsageAnalysis.total.label3'), key:'activeTime'},
        { label:this.$t('UsageAnalysis.total.label4'), key:'userTime'}
      ],

    };
  },

  mounted() {},
  methods: {

    //是否有数据
    isData(val){
      this.noData = !val
    },

    // 切换app
    appChange(data){
      this.appKey = data.appKey
      this.getAppuser()
    },

    // 获取图表数据
    async getAppuser(){
      const res = await getAppuser({ appKey: this.appKey })
      if(res.code !== 0)return
      this.chart1Data = res.data?.activeUser?.data || []
      this.registerTotal = res.data?.appUser?.total || ''
      this.chart1 ? this.chart1.changeData(this.chart1Data) : this.initChart1()
      this.chart2 ? this.chart2.changeData(this.chart2Data) : this.initChart2()
      this.chart3 ? this.chart3.changeData(this.chart3Data) : this.initChart3()
    },

    initChart1(){
      this.chart1 = new Chart({
        container: 'chart1',
        autoFit: true,
        height: 250,
      });
      this.chart1.data(this.chart1Data);
      this.chart1.scale('total', {
        nice: true,
      });
      
      this.showToolTip(this.chart1,"tooltip1")
      this.chartConfig(this.chart1)
      this.chart1.interaction('active-region');

      this.chart1.interval().position('time*total').color('l(90) 0:#3B7CFF 1:#ffffff')
      
      this.chart1.render();
    },

    initChart2(){
      this.chart2 = new Chart({
        container: 'chart2',
        autoFit: true,
        height: 300,
      });
      this.chart2.data(this.chart2Data);
      this.chart2.legend({
        position: 'top-left',
      });

      this.chart2.tooltip({
        shared: true,
        showMarkers: false,
        title: (title, datum) => {
          const list = this.chart2Data.filter(item=>item.time == datum.time)
          return this.$t('UsageAnalysis.total.scene')+`：${list.reduce(((pre,cur)=> cur.value + pre),0)}`
        }
      });
      this.chartConfig(this.chart2)
      this.chart2.interaction('active-region');

      this.chart2
        .interval()
        .adjust('stack')
        .position('time*value')
        .color('type', ['#40a9ff', '#1890ff', '#096dd9', '#0050b3']);

      this.chart2.render();

    },

    initChart3(){
      this.chart3 = new Chart({
        container: 'chart3',
        autoFit: true,
        height: 250,
      });
      this.chart3.data(this.chart3Data);
      this.chart3.scale('total', {
        nice: true,
      });
      this.chart3.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        crosshairs:{
          line:{
            fill:'#BDC0C4'
          },
        },
        shared: true,
        showContent:false
        
      });
      const tooltip = document.getElementById("tooltip2")
      // 鼠标进入辅助线
      this.chart3.on('tooltip:show', ev => {
        tooltip.innerHTML = `${moment(ev.data.items[0].title).format('M')}月 ${ev.data.items[0].value}`
        tooltip.style.left = `${ev.data.items[0].x+7}px`
        tooltip.style.display = 'block'
      });

      // 鼠标离开辅助线
      this.chart3.on('tooltip:hide', ev => {
        tooltip.style.display = 'none'
      });

      this.chartConfig(this.chart3)
      this.chart3.axis('time',{
        tickLine:false,
        label:{
          style:{
            fill:"#70757D",
            fontSize: 12,
          },
          formatter:(text) => {
            return moment(text).format('M') + this.$t('public.month')
          }
        },
        line:{
          style:{
            stroke:"#DAE6F8",
            width:1,
          }
        },
      })
      this.chart3.interaction('active-region');
      this.chart3.line().position('time*total').color('#3B7CFF ')
      
      this.chart3.render();
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
            fontSize: 12,
          },
        },
        line:{
          style:{
            stroke:"#DAE6F8",
            width:1,
          }
        },
      })

    },
  },
  beforeDestroy(){
    this.chart2?.destroy()
    this.chart1?.destroy()
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
  .chart-block{
    padding-top: 30px;
  }
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
.tab-block{
  padding: 20px 0;
}
</style>
