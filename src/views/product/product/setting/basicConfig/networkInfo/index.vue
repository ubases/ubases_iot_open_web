<template>
  <section class="page-wrap no-padding">
    <a-page-header :title="$t('setting.network.info.title')"  @back="back">
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

      <!-- 配网切换 -->
      <section class="network-type ">
        <section class="flex y-axis-center x-space-between">
          <section class="flex y-axis-center network-button">
            <a-button 
            v-for="item in selectedNetwork" 
            :key="item" 
            :type="item === currentNetworkType?'primary':'default'"
            @click="changeNetworkType(item)"
            >{{ networkTypeLabel(item) }}</a-button>
          </section>
          <a-dropdown @visibleChange="handleVisibleChange">
            <a class="ant-dropdown-link" @click.prevent>{{$t('setting.network.info.change.network.type')}}</a>
            <a-menu slot="overlay">
              <a-menu-item>
                <section @click.stop>
                  <a-checkbox-group
                    name="checkboxgroup"
                    :options="networkList"
                    v-model="selectedNetworkCheckbox"
                    @change="menuCheckboxChange"
                  />
                </section>

              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </section>
      <p class="lead-text">{{$t('setting.network.info.operational.guideline')}}</p>
      </section>
      <!-- /配网切换 -->

      <section class="step-list-wrap">
        <a-row :gutter="20">
          <!-- 配网步骤编辑 -->
          <a-col :span="16">
            <section class="edit-step-wrap">
              <section class="edit-step">
                <section class="card-header flex y-axis-center x-space-between">
                  <span class="title">{{$t('setting.network.info.steps.configuration')}}</span>
                  <a-button type="link" class="reset" @click="resetNetwork">{{$t('setting.network.info.restore.config.info')}}</a-button>
                </section>
                <template v-if="stepList.length > 0">
                <section class="step-wrap" v-for="(form,index) in stepList" :key="index">
                  <input v-show="false" :value="form.sort = index+1"/>
                  <section class="sort flex y-axis-center x-space-between">
                    <p>{{$t('setting.network.info.step')}}{{index+1}}</p>
                    <delete-icon @click="deleteStep(index)"></delete-icon>
                  </section>
                  <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-form-model-item :label="$t('setting.network.info.label.instruction')" prop="instruction" >
                      <a-input v-model="form.instruction" :maxLength="200"/>
                    </a-form-model-item>
                    <a-form-model-item :label="$t('setting.network.info.label.instructionEn')" prop="instructionEn" >
                      <a-input v-model="form.instructionEn" :maxLength="200"/>
                    </a-form-model-item>
                    <a-form-model-item :label="$t('setting.network.info.label.media')" prop="media">
                      <input v-show="false" v-model="form.media" />
                      <section class="flex y-axis-center">
                        <section class="media-wrap">
                          <img v-if="form.imageUrl" :src="form.imageUrl || ''" />
                          <video v-if="!form.imageUrl && form.videoUrl" controls>
                            <source :src="form.videoUrl">
                          </video>
                        </section>
                        <section class="media-action">
                          <p class="tips">{{$t('setting.network.info.image.tips')}}</p>
                          <p class="tips">{{$t('setting.network.info.vedio.tips')}}</p>
                          <template>
                            <media-upload  @uploaded="uploaded($event, index)"/>
                            <a-button size="small" class="delete" @click="deleteMedia(index)">{{$t("public.delete")}}</a-button>
                          </template>
                        </section>
                      </section>
                    </a-form-model-item>

                  </a-form-model>
                </section>
                </template>
              </section>
              <!-- 限制最多只能上传4个步骤 -->
              <section v-if="stepList.length < 4" class="add-step" @click="addStep">{{$t('setting.network.info.add.step')}}</section>
              <section class="sumit-wrap">
                <a-button type="primary" class="save-btn" @click="saveStep">{{$t('public.save')}}</a-button>
              </section>
            </section>
          </a-col>
          <!-- /配网步骤编辑 -->

          <!-- 配网步骤预览 -->
          <a-col :span="8">
            <section class="preview-step">
              <section class="card-header">
                <span class="title">{{$t('setting.network.info.results.preview')}}</span>
              </section>
              <section class="flex x-axis-center">
                <a-radio-group v-model="langType">
                  <a-radio-button value="instruction">
                    {{$t('setting.network.info.instruction')}}
                  </a-radio-button>
                  <a-radio-button value="instructionEn">
                    {{$t('setting.network.info.instructionEn')}}
                  </a-radio-button>
               </a-radio-group>
              </section>
              <section class="viewport">
                <div class="title">{{$t('setting.network.info.connecting.device')}}</div>
                <template v-if="stepList.length > 0">
                <section class="steps-wrap flex x-axis-center">
                  <a-steps size="small" :current="currentIndex">
                    <a-step v-for="(step,index) in stepList" :key="index"/>
                  </a-steps>
                </section>
                <p class="step-text" v-text="stepList[currentIndex][langType]"></p>
                <section class="preview-media-wrap">
                  <img v-if="stepList[currentIndex].imageUrl" :src="stepList[currentIndex].imageUrl" />
                  <video v-if="!stepList[currentIndex].imageUrl && stepList[currentIndex].videoUrl" controls>
                    <source :src="stepList[currentIndex].videoUrl">
                  </video>
                </section>
                <section class="page-button flex x-axis-center">
                  <a-button @click="changePage(-1)" :disabled="currentIndex==0" class="last-step-button">{{$t('setting.network.info.last.step')}}</a-button>
                  <a-button type="primary" @click="changePage(1)" :disabled="currentIndex==stepList.length-1">{{$t('setting.network.info.next.step')}}</a-button>
                </section>
                </template>
              </section>
            </section>
          </a-col>
          <!-- /配网步骤预览 -->
        </a-row>
      </section>

      <!-- 多语言管理 -->
      <section class="language-manage-wrap">
        <button-card :data="languageManage" @handleClick="toMultilangual"></button-card>
      </section>
      <!-- /多语言管理 -->
    </a-page-header>
  </section>
</template>

<script>
import { DeleteIcon} from '@/core/icons'
import ButtonCard from "../../../components/ButtonCard.vue"
import { getNetworkGuide, saveNetworkGuide, getProductDetails, getDefaultNetworkGuide, changeNetworkGuide} from '@/api/product'
import MediaUpload from '@/views/product/product/components/MediaUpload.vue'

export default ({
  name:"NetworkInfo",
  components:{
    DeleteIcon,
    ButtonCard,
    MediaUpload
  },
  data() {
    return {
      selectedNetwork: [],
      currentNetworkType: 1,
      rules:{
        instruction: [{ required: true, message: this.$t('setting.network.info.rules.instruction'), trigger: 'blur' }],
        instructionEn: [{ required: true, message: this.$t('setting.network.info.rules.instructionEn'), trigger: 'blur' }],
        media: [{ required: true, message: this.$t('setting.network.info.rules.media'), trigger: 'change' }]
      },
      langType: 'instruction',
      currentIndex: 0,
      stepList: [
        {instruction:'',instructionEn:'',imageUrl:'',videoUrl:''},
        {instruction:'',instructionEn:'',imageUrl:'',videoUrl:''},
        {instruction:'',instructionEn:'',imageUrl:'',videoUrl:''},
      ],
      originStepList: [
        {instruction:'',instructionEn:'',imageUrl:'',videoUrl:''},
        {instruction:'',instructionEn:'',imageUrl:'',videoUrl:''},
        {instruction:'',instructionEn:'',imageUrl:'',videoUrl:''},
      ],
      languageManage: {
        title: this.$t('setting.network.info.languageManage.title'),
        details: this.$t('setting.network.info.languageManage.details'),
        buttonText: this.$t('setting.network.info.languageManage.buttonText'),
      },
      details: {},
      networkData: [],
      productId: '',
      selectedNetworkCheckbox: [],
      isNetworkChange: false,
      networkList: this.$DictList('network_guide'),
      menuCheckboxflag: false,
      // status: 0
    }
  },
  async mounted() {
    this.productId = this.$route.query.productId
    // this.status = this.$route.query.status
    if(this.productId) 
    await this.getProductDetails()
    this.getNetworkGuide()
  },

  methods:{

    // 获取产品详情
    async getProductDetails(){
      const res = await getProductDetails(this.productId)
      if(res.code !== 0) return
      this.details = res.data
    },

    // 查询配网引导详情
    async getNetworkGuide(){
      const res = await getNetworkGuide({productId:this.productId})
      if(res.code !==0) return
      this.networkData = res.data ?? []
      this.networkData.sort((a,b)=>{return a.type - b.type})
      this.selectedNetwork = this.networkData.map(item=> item.type)
      this.selectedNetworkCheckbox = this.selectedNetwork
      this.currentNetworkType = this.currentNetworkType && this.selectedNetwork.some(item=>item==this.currentNetworkType) ?this.currentNetworkType : this.selectedNetwork[0] || 0
      let steps =  this.networkData.filter(item=>item.type == this.currentNetworkType)?.pop()?.steps 
      this.handleStepsList(steps)
    },

    
    // 切换配网标签
    changeNetworkType(item){
      this.currentNetworkType = item
      let steps =  this.networkData.filter(item=>item.type == this.currentNetworkType)?.pop()?.steps 
      this.handleStepsList(steps)
    },

    // 恢复默认配网信息
    async resetNetwork() {
      const res = await getDefaultNetworkGuide({productId:this.productId ,type:this.currentNetworkType})
      if (res.code !== 0) return
      let steps = res.data?.steps || []
      this.handleStepsList(steps)
    },

    // 处理步骤数据的渲染
    handleStepsList(steps){
      if(!steps || steps.length == 0){
        this.stepList = [{instruction:'',instructionEn:'',imageUrl:'',videoUrl:'',},]
      } else{
        steps.sort((a,b)=>{return a.sort - b.sort})
        this.stepList =steps.map(item=>{
          return {
            ...item,
            media:item.imageUrl || item.videoUrl
          }
        })

      }
    },

    // 查询配网方式的名称
    networkTypeLabel(val) {
      return this.networkList.filter(item => item.value == val )?.pop()?.label || ''
    },

    // 预览翻页
    changePage(num){
      this.currentIndex=this.currentIndex+ num
    },

    // 切换配网列表
    async handleVisibleChange(visiable){
      if(visiable) {
        this.menuCheckboxflag = false
        return
      }
      if(!this.menuCheckboxflag) return
      // 判断是否有变化
      this.selectedNetworkCheckbox.sort().toString() == this.selectedNetwork.sort().toString()
      const res = await changeNetworkGuide({types:this.selectedNetworkCheckbox, productId:this.productId})
      if( res.code !== 0) return
      this.getNetworkGuide()
    },
    // 配网多选框变化
    menuCheckboxChange(){
      this.menuCheckboxflag = true
    },

    // 切换配网方式
    networkTypeChange(){
      this.isNetworkChange = true
    },


    // 添加步骤
    addStep() {
      if(this.stepList.length > 3){
        this.$message.success(this.$t('setting.network.info.step.limit'))
        return
      }
      this.stepList.push({
        instruction:'',
        instructionEn:'',
        imageUrl:'',
        videoUrl:''
      })
    },

    // 删除步骤
    deleteStep(index) {
      this.stepList.splice(index,1)
    },

    // 保存步骤
    async saveStep(){
      const formList = this.$refs.ruleForm
      let flag = true
      formList.forEach((form)=>{
        form.validate((valid) => {
          if (!valid) {
            flag = false
            return
          }
        });
      })
      if(!flag) return
      const res = await saveNetworkGuide({productId:this.productId, type:Number(this.currentNetworkType), steps:this.stepList})
      if(res.code !== 0 ) return
      this.$message.success(this.$t('public.save.ok'))
      this.getNetworkGuide()
    }, 

    // 跳转多语言
    toMultilangual(){
      this.$router.push({path:'/appDevelop/multilingual/index',query:{productId:this.productId}})
    },

    // 删除图片
    deleteMedia(index) {
      this.stepList[index].imageUrl = ''
      this.stepList[index].videoUrl = ''
    },
 
    // 图片上传
    async uploaded(res,index) {
        if(res.type === 'video'){
          this.stepList[index].videoUrl = res.data.fullPath;
          this.stepList[index].imageUrl = ''
          this.$set(this.stepList[index],"media",res.data.fullPath)
        } else{
          this.stepList[index].imageUrl = res.data.fullPath;
          this.stepList[index].videoUrl = ''
          this.$set(this.stepList[index],"media",res.data.fullPath)
        }
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
.network-type{
  padding: 30px 20px 15px;
  border-bottom: 1px solid @aithings-border-color;
  .network-button {
    .ant-btn {
      color: @primary-color;
      border-color: @primary-color;
      border-radius: 0;
    }
    .ant-btn-primary{
      color: #fff;
    }
    .ant-btn:first-child{
      border-radius: 4px 0 0 4px;
    }
    .ant-btn +.ant-btn{
      border-left: 0;
    }
    .ant-btn:last-child {
      border-radius: 0 4px 4px 0;
    }
  }
  .lead-text{
    padding-top: 13px;
    color: @aithings-warning-color-FF8E35;
  }
}
.step-list-wrap{
 background: @aithings-table-thread-color;
}
.edit-step-wrap{
  padding: 0 20px;
}
.card-header{
  padding: 10px 0 14px;
  .title{
    font-weight: 600;
    color: @aithings-text-color-black;
  }
  /deep/.ant-btn-link{
    height: auto;
  }
}
.step-wrap{
  .sort{
    height: 42px;
    padding: 0 15px;
    background: @aithings-table-thread-color;
    font-weight: 600;
    color: @aithings-text-color-black;
  }
  /deep/ .ant-form{
    padding: 30px 0 0;
  }
  /deep/ .ant-form-item-label > label{
    color: @aithings-text-color-gray;
  }
  .media-wrap{
    width: 100px;
    height: 100px;
    img,video{
      max-width: 100px;
      max-height: 100px;
    }
  }
  .media-action{
    padding-left: 15px;
    line-height: 17px;
    font-size: 12px;
    color: @aithings-text-tips-color;
    /deep/ .ant-btn{
      width: 80px;
      margin-top: 17px;
    }
  }
  .ant-input{
    border: 1px solid @aithings-border-color;
  }
}
.add-step{
   height: 42px;
   background: @aithings-table-thread-color;
   text-align: center;
   line-height: 42px;
   color: @primary-color;
   cursor: pointer;
}
.sumit-wrap{
  padding: 30px 0;
  text-align: center;
  .save-btn{
    width: 132px;
  }
}
.edit-step-wrap{
  background: #fff;
}
/deep/ .ant-radio-button-wrapper{
  padding: 0 30px;
  border: 1px solid @aithings-text-color-gray;
  color: @aithings-text-color-gray;
  background: #fff;
}
/deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
  border: 1px solid @primary-color;
  color: @primary-color;
}
/deep/.ant-radio-button-wrapper + .ant-radio-button-wrapper{
  border-left: 0;
}
.viewport{
  margin-top: 36px;
  padding: 0 20px 22px;
  background: #fff;
  .title{
    padding: 20px 0;
    text-align: center;
    font-weight: 600;
    line-height: 25px;
    color: @aithings-text-color-black;
  }
  .steps-wrap{
    margin-bottom: 10px;
    /deep/.ant-steps{
      max-width: 80%;
    }
  }
  /deep/.ant-steps-item-process .ant-steps-item-icon{
    border-color: @primary-color;
    background: @primary-color;
  }
  /deep/.ant-steps-item-finish .ant-steps-item-icon{
    border-color: @primary-color;
    
  }
  /deep/.ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon{
    color: @primary-color;
  }
  /deep/.ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after{
    background-color: @primary-color;
  }
  .step-text{
    line-height: 20px;
  }
  .preview-media-wrap{
    width: 100%;
    height: auto;
    img,video{
      max-width: 100%;
    }
  }
  .page-button{
    padding-top: 53px;
    .ant-btn + .ant-btn {
      margin-left: 10px;
    }
    /deep/.last-step-button.ant-btn:not(:disabled):hover, /deep/.last-step-button.ant-btn:not(:disabled):focus{
      border-color: @primary-color;
      color: @primary-color;
    }
  }
}
.language-manage-wrap{
  border-top: 20px solid @aithings-table-thread-color;
  .card-wrap{
    border: 0;
  }
}
.reset{
  padding: 0;
}
</style>
