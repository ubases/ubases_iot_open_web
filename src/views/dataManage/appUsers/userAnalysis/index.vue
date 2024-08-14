<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('user.analysis.title')" >
      <!-- 详情 -->
      <app-change  v-show="!noData" :detailList="['version','appKey']" @dataChange="appChange" @isData="isData"/>
      
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
            <h4>{{$t('user.analysis.count.active')}}</h4>
            <div class="export-text tap-pointer" @click="handleDownload('active',$t('user.analysis.count.active'))">{{ $t('public.export') }}</div>
          </div>
          <section class="chart-wrap">
            <div id="activeTooltip" class="tooltip"></div>
            <div id="activeChart"></div>
          </section>
        </section>
        <section>
          <div class="flex x-space-between">
            <h4>{{$t('user.analysis.count.register')}} {{registerTotal}}</h4>
            <div class="export-text tap-pointer" @click="handleDownload('register',$t('user.analysis.count.register'))">{{ $t('public.export') }}</div>
          </div>
          <section class="chart-wrap">
            <div id="registerTooltip" class="tooltip"></div>
            <div id="registerChart"></div>
          </section>
        </section>
        
      </section>
      <template v-if="noData">
        <no-data :text="$t('user.analysis.noData.text')" :buttonText="$t('user.analysis.noData.button')" path="/appDevelop/customizedApp/index"/>
      </template>
    </a-page-header>
  </section>
</template>
<script>

import AppChange from "@/components/detailChange/AppChange.vue"
import { Chart, Util } from '@antv/g2';
import NoData from "@/components/NoData/index.vue"
import { getAppuser } from "@/api/dataManage"
import moment from "moment";

export default {
  name: "UserAnalysis",
  components: {
    AppChange,
    NoData
  },
  data() {
    return {
      appKey:'',
      registerChart:null,
      activeChart:null,
      activeChartData:[],
      registerChartData:[],
      noData:true,
      registerTotal:'',
      totalData:{},
      totalList:[
        { label:this.$t('UserAnalysis.total.active'), key:'active'},
        { label:this.$t('UserAnalysis.total.register'), key:'register'},
        { label:this.$t('UserAnalysis.total.registerTotal'), key:'registerTotal'}
      ],
      hierarchyData:[
        {type:this.$t('UserAnalysis.hierarchyData1'),value:1, detail:this.$t('UserAnalysis.hierarchyData1.detail'), percent:'20'},
        {type:this.$t('UserAnalysis.hierarchyData2'),value:1, detail:this.$t('UserAnalysis.hierarchyData2.detail'), percent:'20'},
        {type:this.$t('UserAnalysis.hierarchyData3'),value:3, detail:this.$t('UserAnalysis.hierarchyData3.detail'), percent:'60'},
      ],
      hierarchyChart: null
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
      this.activeChartData = res.data?.activeUser?.data || []
      this.registerChartData = res.data?.appUser?.data || []
      this.registerTotal = res.data?.appUser?.total || ''
      this.registerChart ? this.registerChart.changeData(this.registerChartData) : this.initRegisterChart()
      this.activeChart ? this.activeChart.changeData(this.activeChartData) : this.initActiveChart()
      this.totalData = {
        active: res.data?.appUserTodayActive || 0,
        register: res.data?.appUserToday || 0,
        registerTotal: res.data?.appUserAll || 0,
      }
    },

    // 累计注册激活用户
    initRegisterChart(){
      this.registerChart = new Chart({
        container: 'registerChart',
        autoFit: true,
        height: 250,
      });
      this.registerChart.data(this.registerChartData);
      this.registerChart.scale('total', {
        nice: true,
      });
      this.registerChart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        crosshairs:{
          line:{
            fill:'#BDC0C4'
          },
        },
        shared: true,
        showContent:false
        
      });
      const tooltip = document.getElementById("registerTooltip")
      // 鼠标进入辅助线
      this.registerChart.on('tooltip:show', ev => {
        tooltip.innerHTML = `${moment(ev.data.items[0].title).format('M')}`+this.$t('public.month')+` ${ev.data.items[0].value}`
        tooltip.style.left = `${ev.data.items[0].x+7}px`
        tooltip.style.display = 'block'
      });

      // 鼠标离开辅助线
      this.registerChart.on('tooltip:hide', ev => {
        tooltip.style.display = 'none'
      });

      this.chartConfig(this.registerChart)
      this.registerChart.axis('time',{
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
      this.registerChart.interaction('active-region');
      this.registerChart.line().position('time*total').color('#3B7CFF ')
      
      this.registerChart.render();
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
            style:{ stroke:"#DAE6F8", width:1, lineDash: [5] }
          },
        },
        label:{
          style:{ fill:"#70757D", fontSize: 12 }
        },
      })

      chart.axis('time',{
        tickLine:false,
        label:{
          style:{ fill:"#70757D", fontSize: 12 },
        },
        line:{
          style:{ stroke:"#DAE6F8", width:1 }
        },
      })

    },

    // 用户分层
    initHierarchyChart(){
      this.hierarchyChart = new Chart({
        container: 'hierarchyChart',
        autoFit: true,
        height: 250,
      });
      this.hierarchyChart.data(this.hierarchyData)
      this.hierarchyChart.coordinate('theta', {
        radius: 0.75
      });
      this.hierarchyChart.tooltip({
        showMarkers: false
      });
      this.hierarchyChart.legend({
        position: 'right',
        useHtml: true,
        custom:true,
        offsetX: -200,
        itemWidth: 600,
        label:{
          align: 'left'
        },
        items:[
          { id: 1, name: this.$t('UserAnalysis.hierarchyData1') + ' '+ this.$t('UserAnalysis.hierarchyData1.detail'), value: 1, percent: '20', marker:{ symbol: 'square' } },
          { id: 2, name: this.$t('UserAnalysis.hierarchyData2') + ' '+ this.$t('UserAnalysis.hierarchyData2.detail'), value: 1, percent: '20', marker:{ symbol: 'square' } },
          { id: 3, name: this.$t('UserAnalysis.hierarchyData3') + ' '+ this.$t('UserAnalysis.hierarchyData3.detail'), value: 3, percent: '60', marker:{ symbol: 'square' } },
        ],
        containerTpl: '<div class="g2-legend"><table class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;"></table></div>',
        itemTpl: (value, color, checked, index) => {
          console.log(value, color, checked, index)
            checked = checked ? 'checked' : 'unChecked';
            const _data = this.hierarchyData;
            return (
              `<tr
                class="g2-legend-list-item item-${index} g2-legend-list-item-${checked}"
                data-value="${value}"
                data-color="${color}"
                style="cursor: pointer;font-size: 14px;"
              >
                <td
                  width=150
                  style="border: none;padding:0;"
                >
                  <i class="g2-legend-marker"></i>
                  <span class="g2-legend-text ${index}">${_data[index].label}&nbsp;&nbsp;${_data[index].detail}</span>
                </td>
                <td style="text-align: right;border: none;padding:0;color:#343434;font-weight:500;">
                  <span>${_data[index].value}</span>&nbsp;&nbsp;<span>占比${_data[index].percent}%</span>
                </td>
              </tr>`
            );
          },
      });
      const interval = this.hierarchyChart
      .interval()
      .adjust('stack')
      .position('value')
      .color('type', ['#063d8a', '#1770d6', '#47abfc', '#38c060'])
      .style({ opacity: 0.4 })

      this.hierarchyChart.interaction('element-single-selected');
      this.hierarchyChart.render();
    },
    handleDownload(type,name){
      this.$DownloadTemplate(
        this,
        {
          url: `/v1/platform/web/data/open/overview/appUser/export?appKey=${this.appKey}&dataType=${type}`,
        },
        name +".xlsx",
        "get"
      );
    }
  },
  beforeDestroy(){
    this.registerChart?.destroy()
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
  .export-text{
    color: @primary-color;
  }
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
</style>
