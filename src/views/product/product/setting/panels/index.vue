<template>
  <section>
    <section class="card-header flex y-axis-center">
      <span v-if="panelSelected.id" class="title" v-text="$t('setting.panels.selected')"></span>
      <span v-if="!panelSelected.id">{{ $t('setting.panels.select.suitable') }}</span>
      <div class="tips" v-if="panelSelected.id && panelSelected.isUpgrade">
        {{ $t('setting.panels.update.tips') }}
        <span class="update-btn" @click="selectPanel(panelSelected || {})">{{ $t('setting.panels.update.now') }}</span>  
      </div>
      <!-- <div class="tips" v-if="panelSelected.id && details.isUpgradeTsl == 1">
        {{ $t('setting.panels.function.update.tips') }}
        <span class="update-btn" @click="handleEditPanel">{{ $t('setting.panels.to.edit') }}</span>  
      </div> -->
    </section>
    <section v-if="panelSelected.id" class="flex y-axis-center">
      <section class="panel-wrap active">
        <section class="preview-image-wrap">
          <img :src="panelSelected.previewUrl || require('../../../../../assets/image/default-bg.png')" class="preview-image"/>
        </section>
        <p class="panel-name" v-text="panelSelected.name"></p>
        <span class="used">{{$t('setting.panels.using')}}</span>
      </section>
      <a-button v-if="panelSelected.id" @click="exchangePanel" class="exchange-panel">{{$t('setting.panels.change')}}</a-button>
    </section>
    <section v-if="!panelSelected.id" class="select-panel-wrap1">
      <select-panel :data="panelClassify" @selectPanel="selectPanel"/>
    </section>
    <a-modal
      :title="$t('setting.panels.switch')"
      :width="1000"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <section class="select-panel-wrap">
          <select-panel :data="panelClassify" :update="visible" :selectedId="panelSelected.id" :selectedType="panelSelected.appPanelType" @selectPanel="selectModalPanel"/>
        </section>
      </a-spin>
    </a-modal>

  </section>
</template>

<script>
import { getPanelList, selectPanel } from "@/api/product"
import SelectPanel from"../../components/SelectPanel.vue"
export default ({
  name:"Panels",
  props:{
    status: { type: Number, default: 0 },
    productId: { type: String, default: '' },
    productTypeId: { type: String, default: '' },
    baseProductId: { type: String, default: '' },
    details:{ type: Object, default: () => {}}
  },
  components:{
    SelectPanel
  },
  data() {
    return {
      panelSelected:{},
      visible:false,
      confirmLoading:false,
      panelClassify:{}
    }
  },
  computed:{
  },
  watch:{
    productId(val){
      if(val){
        this.getPanelList()
      }
    },
    productTypeId(val){
      if(val){
        this.getPanelList()
      }
    },
    details(){
      this.defaultPanel()
    }
  },
  async mounted(){
    if(this.productTypeId && this.baseProductId){
      await this.getPanelList()
    }
    this.defaultPanel()
  },
  methods:{
      // 获取可选择面板
    async getPanelList(){
      const res = await getPanelList({productTypeId:this.productTypeId, baseProductId:this.baseProductId,productId:this.productId})
      if(res.code !==0) return
      const list = res.data || []
      list.forEach(item=>{
        if(!(item.appPanelType ==2 && item.status !==3)){
          // stuio未发布面板不显示
          if(this.panelClassify[item.appPanelType]){
            this.panelClassify[item.appPanelType].push(item)
          } else {
            this.panelClassify[item.appPanelType] = [item]
          }
        }
        
      })
      this.$set(this,'panelClassify',this.$deepClone(this.panelClassify))
    },

    // 已选中的面板初始化
    defaultPanel(){
      this.panelSelected = this.details?.controlPanel?.id ? this.details?.controlPanel : {}
      console.log(this.panelSelected)
    },

    // 选择模板
    async selectPanel(panel) {
      const res = await selectPanel({productId:this.productId,controlPanelId:panel.id, appPanelType:panel.appPanelType})
      if( res.code !== 0) return
      this.$emit('refreshDetails')
    },

    // 弹窗切换模板
    selectModalPanel(panel) {
      this.selectPanel(panel)
      this.visible = false
    },

    // 切换面板
    exchangePanel(){
      this.visible = true
    },

    handleCancel() {
      this.visible = false
    },

    // 前往编辑自定义控制面板
    handleEditPanel(){
    }
  }
})
</script>

<style lang="less" scoped>
@import "../../../../../global.less";
@import "../../../../../utils/utils.less";
  .card-header{
    padding: 20px 0 14px;
    .title{
      font-weight: 600;
      color: @aithings-text-color-black;
    }
  }
  .panel-wrap{
    margin-bottom: 15px;
    padding: 12px 15px 20px;
    border: 2px solid @aithings-border-color;
    box-shadow: 0px 0px 6px 0px rgba(166,196,255,0.22);
    border-radius: 4px;
    text-align: center;
    .radio-card();
    .panel-name{
      padding: 20px 0 10px;
      font-weight: 600;
      color: @aithings-text-color-black;
      line-height: 20px;
    }
    .preview-image-wrap{
      width: 200px;
      height: 356px;
      margin: 0 auto;
    }
    .preview-image{
      max-width: 200px;
      max-height: 356px;
    }
  }
  .ant-btn {
    width: 110px;
    height: 32px;
    border: 1px solid @primary-color;
    color: @primary-color;
    border-radius: 4px;
  }
  .used{
    color: @primary-color;
  }
  .panel-wrap + .panel-wrap{
    margin-left: 30px;
  }
  .exchange-panel{
    margin-left: 70px;
  }
  .tips{
    margin-left: 20px;
    color: @aithings-warning-color-FF8E35;
    .update-btn{
      color: @primary-color;
      margin-left: 6px;
      cursor: pointer;
    }
  }
  .select-panel-wrap{
    height: 600px;
  }
  .select-panel-wrap1{
    height: calc(100vh - 375px);
  }
</style>