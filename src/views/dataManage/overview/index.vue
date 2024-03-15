<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('overview.title')" >
      <section>
        <h4>{{$t('overview.accumulate')}}</h4>
        <a-row :gutter="20" type="flex">
          <a-col :xs="24" :md="8" v-for="item in countList" :key="item.key">
            <div :class="['card tap-pointer flex y-axis-center',{active:item.key == countActive}]" @click="changeActiveCount(item)">
              <component :is="item.icon" />
              <div class="number-wrap">
                <p v-text="item.title"></p>
                <p class="total-num">{{countData[item.key].total | NumberFormat}}</p>
              </div>
            </div>
          </a-col>
        </a-row>
        <section class="chart-wrap">
          <div id="totalTooltip" class="tooltip"></div>
          <div id="totalChart"></div>
        </section>
      </section>
      <section>
        <h4>{{$t('overview.today')}}</h4>
        <a-row :gutter="20" type="flex">
          <a-col :xs="24" :md="8" v-for="item in todayList" :key="item.key">
            <div :class="['card tap-pointer flex y-axis-center',{active:item.key == todayActive}]" @click="changeActiveToday(item)">
              <component :is="item.icon" />
              <div class="number-wrap">
                <p v-text="item.title"></p>
                <p class="total-num">{{todayData[item.key].total | NumberFormat}}</p>
              </div>
            </div>
          </a-col>
        </a-row>
        <section class="chart-wrap">
          <div id="todayTooltip" class="tooltip"></div>
          <div id="todayChart"></div>
        </section>
      </section>
    </a-page-header>
  </section>
</template>
<script>
import { CountDeviceIcon, CountTroubleIcon, CountUserIcon } from "@/core/icons"
import { Chart } from '@antv/g2';
import { getOverviewAccumulate,getOverviewToday } from '@/api/dataManage'
export default {
  components:{
    CountDeviceIcon,
    CountTroubleIcon,
    CountUserIcon
  },
  data(){
    return{
      countActive:"activeDevice",
      todayActive:"activeDevice",
      totalChart:null,
      todayChart:null,
      countList:[
        {
          icon: "CountDeviceIcon",
          title: this.$t('overview.accumulate.active.device'),
          key: "activeDevice"
        },
        {
          icon: "CountUserIcon",
          title: this.$t('overview.accumulate.app.user'),
          key: "appUser"
        },
        {
          icon: "CountTroubleIcon",
          title: this.$t('overview.accumulate.device.fault'),
          key: "deviceFault"
        }
      ],
      todayList:[
        {
          icon: "CountDeviceIcon",
          title: this.$t('overview.today.active.device'),
          key: "activeDevice"
        },
        {
          icon: "CountUserIcon",
          title: this.$t('overview.today.app.user'),
          key: "appUser"
        },
        {
          icon: "CountTroubleIcon",
          title: this.$t('overview.today.device.fault'),
          key: "deviceFault"
        }
      ],
      countData:{
        appUser:{
          total:'0',
          data:[]
        },
        deviceFault:{
          total:'0',
          data:[]
        },
        activeDevice:{
          total:'0',
          data:[]
        }
      },
      todayData:{
        appUser:{
          total:'0',
          data:[]
        },
        deviceFault:{
          total:'0',
          data:[]
        },
        activeDevice:{
          total:'0',
          data:[]
        }
      },
    }
  },
  mounted(){
    this.getOverviewAccumulate()
    this.getOverviewToday()
  },
  methods:{
    async getOverviewAccumulate(){
      const res = await getOverviewAccumulate()
      if(res.code !== 0) return
      this.countData = res.data || []
      this.initTotalChart()
    },

    async getOverviewToday(){
      const res = await getOverviewToday()
      if(res.code !== 0) return
      this.todayData = res.data || []
      this.initTodayChart()
    },

    // 切换累计数据
    changeActiveCount(item){
      this.countActive = item.key
      this.totalChart.changeData(this.countData[this.countActive].data)
    },

    // 切换今日数据
    changeActiveToday(item){
      this.todayActive = item.key
      this.todayChart.changeData(this.todayData[this.todayActive].data)
    },

    // 初始化累计图表
    initTotalChart(){
      this.totalChart = new Chart({
        container: 'totalChart',
        autoFit: true,
        height: 250,
      });
      this.totalChart.data(this.countData[this.countActive].data);
      this.totalChart.scale('total', {
        nice: true,
      });
      this.showToolTip(this.totalChart,"totalTooltip")
      
      this.chartConfig(this.totalChart)
      this.totalChart.interval().position('time*total').color('l(90) 0:#3B7CFF 1:#ffffff')
      
      this.totalChart.render();
    },

    showToolTip(chart, tooltipName){
      chart.tooltip(false)
      const tooltip = document.getElementById(tooltipName)
      // 鼠标进入柱子
      chart.on('element:mousemove', ev => {
        tooltip.innerHTML = `${ev.data.data.time} ${ev.data.data.total}`
        tooltip.style.left = `${ev.x}px`
        tooltip.style.display = 'block'
      });

      // 鼠标离开柱子
      chart.on('element:mouseleave', ev => {
        tooltip.style.display = 'none'
      });
    },

    // 初始化今日图表
    initTodayChart(){
      this.todayChart = new Chart({
        container: 'todayChart',
        autoFit: true,
        height: 250,
      });
      this.todayChart.data(this.todayData[this.countActive].data);
      this.todayChart.scale('total', {
        nice: true,
      });
      this.showToolTip(this.todayChart,"todayTooltip")
      this.chartConfig(this.todayChart)
      this.todayChart.interaction('active-region');

      this.todayChart.interval().position('time*total').color('l(90) 0:#3B7CFF 1:#ffffff')
      
      this.todayChart.render();
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
          style:{ fill:"#70757D", fontSize: 12 }
        },
        line:{
          style:{ stroke:"#DAE6F8", width:1 }
        },
      })
      chart.interaction('active-region');
    }
  },
  beforeDestroy(){
    this.totalChart?.destroy()
    this.todayChart?.destroy()
  }
}
</script>
<style scoped lang="less">
@import "../../../global.less";
  /deep/.ant-page-header-heading{
    padding: 15px 20px;
    border-bottom: 1px solid @aithings-border-color;
  }
  /deep/.ant-page-header-content{
    padding: 30px 20px;
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
</style>