<template>
  <section class="flex panel-content">
    <div class="left-side">
      <div 
      :class="['panel-info tap-pointer',{active: currentType == item.type}]" 
      v-for="item in panelTypeList" 
      :key="item.type"
      @click="selectType(item.type)"
      >
        <h5 class="name">{{ item.name }}</h5>
        <p class="desc">{{ item.desc }}</p>
      </div>
    </div>
    <div class="right-side">
      <div class="flex y-axis-center x-space-between header-bar">
        <h4 class="panel-type">{{ currentName }}</h4>
        <!-- <a-button v-if="currentType!==1" type="primary" @click="handleCreate" class="grean-button">
          <icon-font type="icon-add" :style="{ fontSize: '18px' }" />
          {{ $t('setting.panels.create.panel') }}
        </a-button> -->
      </div>
      <div class="panel-list flex">
        <div :class="['panel',{active:item.id ==selectedId }]" v-for="item in panelList" :key="item.id">
          <section class="preview-image-wrap flex xy-axis-center">
            <img :src="item.previewUrl || require('../../../../assets/image/default-bg.png')" class="panel-img"/>
          </section>
          <h5 class="panel-name">{{ item.name }}</h5>
          <div class="btn" @click="selectPanel(item)">{{$t('setting.panels.select.this.model')}}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default ({
    name:"SelectPanel",
    props:{
      data: { type: Object, default:()=>{}},
      selectedId: { type: String | null, default:null},
      selectedType: { type: Number | null, default: null},
      update: { type: Boolean, default: false}
    },

    data () {
      return {
        panelTypeList:[
          { name:this.$t('setting.panels.type.public.name'), desc:this.$t('setting.panels.type.public.desc'), type:1 },
          // { name:this.$t('setting.panels.type.custom.name'), desc:this.$t('setting.panels.type.custom.desc'), type:2 },
        ],
        currentType: 1,
      }
    },
    computed:{
      currentName(){
        return this.panelTypeList.filter(item=>item.type == this.currentType)?.pop()?.name || ''
      },
      panelList(){
        return this.$deepClone(this.data[this.currentType] || [])
      }
    },
    watch: {
      selectedType(){
        if(!this.selectedType) return
        this.currentType = this.selectedType
      },
      update(){
        if(this.update && this.selectedType){
          this.currentType = this.selectedType
        }
      }
    },
    mounted(){
      if(!this.selectedType) return
      this.currentType = this.selectedType
    },
    methods:{
      selectType(type){
        this.currentType = type
      },
      selectPanel(panel){
        this.$emit('selectPanel',panel)
      },
      // 创建面板
      // handleCreate(){
        // if(this.currentType==2){
        //   this.$router.push({path:'/panel/studioPanel/index.vue'})
        // }
      // }
    }
  })

</script>
<style lang="less" scoped>
@import "../../../../global.less";
@import "../../../../utils/utils.less";
.panel-content{
  width: 100%;
  height: 100%;
}
.left-side{
  width: 176px;
  padding-right: 11px;
  height: 100%;
  overflow-y: auto;
  .panel-info{
    position: relative;
    padding: 15px 10px;
    .name{
      padding-bottom: 6px;
      font-size: 15px;
      font-weight: 600;
      color: @aithings-text-color-black;
      line-height: 21px;
    }
    .desc{
      font-size: 12px;
      font-weight: 400;
      color: @aithings-text-color-gray;
      line-height: 17px;
    }
    &.active{
      background: #F1F6FE;
      &::after{
        content:'';
        width: 0;
        height: 0;
        border-left: 7px solid @primary-color;
        border-top: 7px solid transparent;
        border-bottom: 7px solid transparent;
        position: absolute;
        right: 10px;
        top: 30px;
      }
      .name{
        color: @primary-color;
      }
    }
    
  }
}
.right-side{
  flex: 1;
  padding: 19px 0 19px 19px;
  height: 100%;
  overflow-y: auto;
  border: 1px solid @aithings-border-color;
  .panel-type{
    
    font-size: 16px;
    font-weight: 600;
    color: @aithings-text-color-black;
    line-height: 22px;
  }

  .header-bar{
    padding-right: 28px;
  }
  .panel{
    margin: 15px 20px 0 0;
    width: 230px;
    height: 470px;
    padding: 12px 15px 20px;
    box-shadow: 0px 0px 6px 0px rgba(166,196,255,0.22);
    border-radius: 4px;
    border: 2px solid @aithings-border-color;
    .radio-card();
  }
  .preview-image-wrap{
    width: 200px;
    height: 356px;
  }
  .panel-img{
    max-width: 200px;
    max-height: 356px;
  }
  .panel-name{
    padding: 20px 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: @aithings-text-color-black;
    line-height: 20px;
    text-align: center;
    .textOverflow()
  }
  .btn{
    margin: 0 auto;
    width: 110px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid @primary-color;
    color: @primary-color;
    line-height: 30px;
    text-align: center;
  }
}
</style>