<template>
  <a-card class="dashboard-page" :bordered="false">
    <a-page-header :title="$t('dashboard.title')">
      <section class="flex y-axis-center">
        <section v-for="v in topTabbar" :key="v.type" class="select-part">
          <a-card class="card">
            <img class="image" :src="$DictName('open_dashboard_icons', v.imgName, 'listimg') || ''" />
            <h2 class="title">{{v.title}}</h2>
            <p class="info">{{v.remind}}</p>
            <a :href="$DictValue('open_document_url',v.docUrl)" target="_blank" class="know-more-button">{{$t('dashboard.quickKnow')}}</a>
          </a-card>
        </section>
      </section>
      <a-card class="work-place-wrap">
        <h2>{{$t('dashboard.workPlace.title')}}</h2>
        <section class="flex">
          <div v-for="v in roles" :key="v.type" class="menu-item">
            <div class="work-place">
              <div class="tap-pointer work-place-details" @click="handleClick(v)">
                <img class="image" :src="$DictName('open_dashboard_icons', v.name, 'listimg') || ''" />
                <h3 class="title">{{v.title}}</h3>
              </div>
            </div>
          </div>
        </section>
      </a-card>
      <a-card class="help-card">
        <div class="help-title">
          <h2>{{$t('dashboard.helpCenter.title')}}</h2>
          <a :href="$DictValue('open_document_url','helpCenter')" target="_blank" class="more-text">{{$t('public.more')}}</a>
        </div>
        <a-row type="flex" justify="space-between" class="help-content">
          <a-col :span="10" v-for="(item,index) in leftList" :key="`left_${index}`">
            <a class="link-title" v-text="item.label" :href="item.value" target="_blank"></a>
          </a-col>
          <a-col :span="10" v-for="(item,index) in rightList" :key="`right_${index}`">
            <a class="link-title" v-text="item.label" :href="item.value" target="_blank"></a>
          </a-col>
        </a-row>
      </a-card>
    </a-page-header>
  </a-card>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      topTabbar: [
        {
          type: 1,
          title:this.$t('dashboard.topTabbar.title1'),
          remind:this.$t('dashboard.topTabbar.remind1'),
          docUrl:'product',
          imgName:'product_manage'
        },
        {
          type: 2,
          title:this.$t('dashboard.topTabbar.title2'),
          remind:this.$t('dashboard.topTabbar.remind2'),
          docUrl:'app',
          imgName:'app_manage'
        },
        {
          type: 3,
          title:this.$t('dashboard.topTabbar.title3'),
          remind:this.$t('dashboard.topTabbar.remind3'),
          docUrl:'cloudService',
          imgName:'cloud_manage'
        },
        {
          type: 4,
          title:this.$t('dashboard.topTabbar.title4'),
          remind:this.$t('dashboard.topTabbar.remind4'),
          docUrl:'dataManage',
          imgName:'data_center'
        },
      ],
      helpCenterList:[],
      leftList:[],
      rightList:[]
    };
  },
  computed:{
  ...mapGetters(["roles"]),
  },
  mounted (){
    this.helpCenterList = this.$DictList('open_default_document').sort((a,b)=>{return a.dictSort - b.dictSort})
    this.leftList = this.helpCenterList.slice(0,5)
    this.rightList = this.helpCenterList.slice(5,10)
  },
  methods: {
    handleClick(v){
      this.$router.push({path:v.children[0].path})
    }
  },
};
</script>
<style lang="less" scoped>
@import "../../global.less";
@import "../../utils/utils.less";

.dashboard-page{
  height: 100%;
  background:@aithings-search-bg-color
}
/deep/.ant-page-header{
  padding: 8px 20px 0;
}
/deep/.ant-page-header-content{
  padding-top: 20px;
  overflow: visible;
}
/deep/.ant-card{
  border-radius: 4px;
  border: 1px solid @aithings-border-color; 

}
/deep/.ant-card-body{
  padding: 20px;
}
.ant-btn-primary{
  background: #fff;
  color: @primary-color;
  border:1px solid @primary-color;
}

.select-part{
  flex:1;
  .card{
    text-align: center;
    &:hover,&:focus{
      box-shadow: 0px 2px 4px 1px rgba(127, 160, 210, 0.4);
    }
  }
  .image{
    width: 64px;
    height:64px;
    margin-top:18px;
  }
  .title{
    padding: 15px 0 10px;
  }
  .info{
    height:44px; 
    color:@aithings-text-color-gray; 
    margin-bottom: 12px;
    .textOverflowMulti2(2)
  }
  .know-more-button {
    display: block;
    width: 100%;
    height: 34px;
    line-height: 34px;
    color: @primary-color;
    border: 1px solid @primary-color;
    &:hover {
      background: @primary-color;
      color: #fff;
    }
  }
}
.select-part+.select-part{
  margin-left: 20px;
}
.ant-btn-primary:hover, .ant-btn-primary:focus{
  background: @primary-color;
  color: #fff;
}
.work-place-wrap{
  margin-top: 20px;
}
.menu-item{
  flex: 1;
}
.work-place{
  text-align: center;
  padding: 35px 0 5px;
  .work-place-details{
    width: 100px;
    margin: 0 auto;
  }
  .image{
    width: 48px; 
    height: 48px;
  }
  .title{
    text-align: center; 
    padding: 10px 0;
  }
}
.help-card{
  margin-top: 20px;
  .more-text{
    cursor: pointer; 
    height: 20px;
    color: @primary-color;
    line-height: 20px;
  }
  .link-title{
    cursor: pointer;
    line-height:28px;
    color:@aithings-text-color-gray;
  }
}
.help-title{
  display: flex;
  justify-content: space-between;
}
.help-content{
  padding: 20px 0 15px;
}
</style>
