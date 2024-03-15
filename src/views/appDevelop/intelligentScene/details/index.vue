<template>
 <section class="page-wrap no-padding">
    <a-page-header :title="title[type]+$t('intelligentScene.details.title')" @back="$router.back()">
      <icon-font slot="backIcon" type="icon-back_arrow" :style="{ fontSize: '24px' }"/>
      <section class="content">
        <a-form-model ref="form" class="form" :model="form" :rules="rules" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }">
          <a-form-model-item :label="$t('intelligentScene.details.label.name.zh')" prop="title" >
            <a-input :disabled="type==='check'" v-model="form.title" :maxLength="50" :placeholder="$t('intelligentScene.details.placeholder.name.zh')"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('intelligentScene.details.label.name.en')" prop="titleEn" >
            <a-input :disabled="type==='check'" v-model="form.titleEn" :maxLength="50" :placeholder="$t('intelligentScene.details.placeholder.name.en')"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('intelligentScene.details.label.desc.zh')" prop="desc" >
            <a-textarea :disabled="type==='check'" v-model="form.desc" :maxLength="500" :auto-size="{ minRows: 3}" :placeholder="$t('intelligentScene.details.placeholder.desc.zh')"></a-textarea>
          </a-form-model-item>
          <a-form-model-item :label="$t('intelligentScene.details.label.desc.en')" prop="descEn" >
            <a-textarea :disabled="type==='check'" v-model="form.descEn" :maxLength="500" :auto-size="{ minRows: 3}" :placeholder="$t('intelligentScene.details.placeholder.desc.en')"></a-textarea>
          </a-form-model-item>
          <a-form-model-item :label="$t('intelligentScene.details.label.image')" prop="icon" >
            <section class="flex y-axis-center">
              <upload-card 
                accept="image/png,image/jpeg,image/x-ms-bmp"
                :acceptList="['image/png','image/jpeg','image/x-ms-bmp']"
                :limitSize="10"
                limitRatio="1:1"
                warningFileType="JPEG,PNG,BMP"
                catalogName="app"
                :fileUrl="form.icon"
                @uploaded="uploaded"
              />
              <p class="image-tips">{{$t('intelligentScene.details.label.image.tips')}}</p>
            </section>
          </a-form-model-item>
          <a-form-model-item :label="$t('intelligentScene.details.label.apps')" prop="isSpecifyApp" >
            <a-radio-group :disabled="type==='check'" v-model="form.isSpecifyApp" :options="$DictList('fit_app_type')" />
            <a-checkbox-group v-if="form.isSpecifyApp == 2" :disabled="type==='check'" v-model="form.appList" :options="appOptions" @change="appListChange"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('intelligentScene.details.label.type')" prop="type" >
            <a-radio-group :disabled="type==='check'" v-model="form.type" :options="$DictList('scene_type')" />
          </a-form-model-item>
          <a-form-model-item :label="$t('intelligentScene.details.label.setting')" prop="setting" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
            <!-- 设置条件 -->
            <section class="set-wrap" v-if="form.type==2">
              <h4>{{$t('intelligentScene.details.set.condition')}}</h4>
              <a-select :disabled="type==='check'" v-model="form.conditionMode" :options="$DictList('secene_condition_type')" class="condition-type"/>
              <section class="set-item" v-for="(item,index) in conditionListText" :key="index">
                <section class="flex y-axis-center x-space-between">
                  <h4 class="title">{{item.title}}</h4>
                  <section class="action-wrap">
                    <span v-if="type!='check'" class="tap-pointer" @click="handleEdit('condition',conditionList[index],index)">{{$t('public.Modify')}}</span>
                    <span v-if="type!='check'" class="tap-pointer" @click="handleDelete(conditionList,index)">{{$t('public.delete')}}</span>
                  </section>
                </section>
                <section class="list flex y-axis-center">
                  <section class="item">{{item.detail}}</section>
                </section>
              </section>
              <section>
                <a-button v-if="type!='check'" icon="plus" class="add-btn" @click="handleAdd('condition')">{{$t('intelligentScene.details.button.add.condition')}}</a-button>
              </section>
            </section>
            <!-- /设置条件 -->
            <!-- 设置任务 -->
            <section class="set-wrap">
              <h4>{{$t('intelligentScene.details.set.task')}}</h4>
              <section class="set-item" v-for="(item,index) in taskListText" :key="index">
                <section class="flex y-axis-center x-space-between">
                  <h4 class="title">{{item.productName}}</h4>
                  <section class="action-wrap">
                    <span v-if="type!='check'" class="tap-pointer" @click="handleEdit('task',taskList[index],index)">{{$t('public.Modify')}}</span>
                    <span v-if="type!='check'" class="tap-pointer" @click="handleDelete(taskList,index)">{{$t('public.delete')}}</span>
                  </section>
                </section>
                <section class="list flex y-axis-center">
                  <section class="item" v-for="(func,i) in item.functions" :key="i">{{func}}</section>
                </section>
              </section>
              <a-button v-if="type!='check'" icon="plus" class="add-btn" @click="handleAdd('task')">{{$t('intelligentScene.details.button.add.task')}}</a-button>
            </section>
            <!-- /设置任务 -->
          </a-form-model-item>    
          <a-form-model-item label="" :wrapper-col="{ offset: 7 }">
            <a-button @click="handleCancel">{{$t("public.cancel")}}</a-button>
            <a-button v-if="type!=='check'" type="primary" @click="handleSumit"> {{$t('public.sumit')}}</a-button>
          </a-form-model-item>
        </a-form-model>

      </section>
    </a-page-header>
    <add-scene-set :visible="setVisible" :type="editType" :setType="setType" :data="editData" @handleCancel="cancelEdit" @handleOk="sumitEdit"/>
    <set-task :visible="setTaskVisible" :type="editType" :data="editData" :taskList="taskList" @handleCancel="cancelEdit" @handleOk="sumitEdit" />
 </section>
</template>
<script>
import AddSceneSet from "../components/AddSceneSet.vue"
import { addScene, editScene, getSceneDetail } from "@/api/intelligentScene";
import { getAppList } from "@/api/appExploit";
import SetTask from "../components/SetTask.vue";
import { getTranslateFuncList,getProductList } from "@/api/product"
import UploadCard from "@/components/uploadCard"

export default {
  name: "RecommendSceneDetails",
  components: {
    UploadCard,
    AddSceneSet,
    SetTask
  },
  data() {
    return {
      id:'',
      type:'',
      form:{
        conditionMode:1,
        type:2
      },
      rules:{
        title:[{ required: true, message: this.$t('intelligentScene.details.rule.name'), trigger: '' }],
        titleEn:[{ required: true, message: this.$t('intelligentScene.details.rule.nameEn'), trigger: '' }],
        icon:[{ required: true, message: this.$t('intelligentScene.details.rule.image'), trigger: '' }],
        isSpecifyApp:[
          { required: true, message: this.$t('intelligentScene.details.rule.apps'), trigger: '' },
          { validator:(rule, value, callback) => {value == 2 && (!this.form.appList || this.form.appList.length == 0) ? callback(this.$t('intelligentScene.details.rule.apps')) : callback()}, trigger: ''}
        ],
      },
      appOptions: [],
      title:{
        'add':this.$t('public.add'),
        'edit':this.$t('public.edit'),
        'check':this.$t('public.view')
      },
      conditionList:[],
      taskList:[],
      setVisible: false,
      setTaskVisible: false,
      editType:'',
      setType: '',
      editIndex: -1,
      editData: {},
      conditonKey:{
        3:'timer',
        2:'weather',
        4:'statechange'
      },
      productList:[],
      condFuncList:{},
      taskFuncList:{},
      taskListText:[],
      conditionListText:[],
      weatherList:{
        1: { unit:'℃'}, 
        2: { unit:'%'},
        3: { valueOptions: 'weather_status'},// "晴天", "阴天", "雨天", "雪天", "霾天"
        4: { unit:'μg/m³'},
        6: { valueOptions:'sun_status'},
      },
    };
  },
  async created() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    await this.getProductList()
    this.getFitAppList()
    if(this.id) this.getDetails()
  },

  watch:{
    taskList:{
      async handler(taskList) {
        let list = []
        for(let index = 0; index < taskList.length; index++) {
          const item = taskList[index]
          let data = {
            productName: this.getProductName(item.productKey),
            functions:[]
          }
          for (let i = 0; i < item.functions.length; i++) {
            const func = item.functions[i]
            const funcText = await this.getFunctionName('execCond', item.productKey, func.funcKey)
            const props =await this.getFunctionName('execCond', item.productKey, func.funcKey, func.funcValue)
            data['functions'].push(`${funcText} : ${props}`)
          }
          list.push(data)
        }
        this.taskListText = [...list]
      },
      deep:true
    },
    conditionList:{
      async handler(conditionList) {
        let list = []
        for(let index = 0; index < conditionList.length; index++) {
          const item = conditionList[index]
          let data = {}
          if(item.conditionType === 3){
            // 定时
            data['title'] = this.$DictName('scene_condition',item.conditionType)
            let weekText = ''
            if(item.timer?.weeks === ''){
              weekText = '执行一次'
            }else if(item.timer?.weeks === '1,2,3,4,5'){
              weekText = '工作日'
            } else if(item.timer?.weeks === '6,7'){
              weekText = '周末'
            } else {
              const arr = item.timer?.weeks.split(',') || []
              weekText = arr.map(item=> this.$DictName('week',item)).toString()
            }

            data['detail'] = `${item.timer?.value}`+ ' ' + `${weekText}`
          } else if (item.conditionType === 2){
            // 天气变化
            data['title'] = this.$DictName('scene_condition',item.conditionType)
            let value = []
            if(this.weatherList[item.weather.type]?.unit){
              value = this.$DictName('operational_character',item.weather.compare)+`${item.weather.value}${this.weatherList[item.weather.type].unit}`
            } else {
              value = '： ' + this.$DictName(this.weatherList[item.weather.type].valueOptions, item.weather.value)
            }
            data['detail'] = this.$DictName('scene_weather_cond',item.weather.type) + value
          } else if (item.conditionType === 4){
            data['title'] = this.getProductName(item.statechange.productKey)
            const funcText = await this.getFunctionName('triggerCond', item.statechange.productKey, item.statechange.funcKey)
            const props = await this.getFunctionName('triggerCond', item.statechange.productKey, item.statechange.funcKey, item.statechange.funcValue)
            data['detail'] = `${funcText} : ${props}`
          }
          list.push(data)
        }
        this.conditionListText = list
      },
      deep:true 
    }
  },
  methods: {
    // 获取详情
    async getDetails(){
      const res = await getSceneDetail(this.id)
      if(res.code !== 0) return
      const appList = res.data?.appList.map(item=>item.appKey) || []
      this.form ={ conditionMode:1, ...res.data, appList}
      this.taskList = this.form.tasks
      this.conditionList = this.form.conditions
    },

    // 适用app列表
    async getFitAppList(){
      const res = await getAppList({page:0})
      if(res.code !== 0) return
      this.appOptions = res.data?.list?.map(item=>{
        return{
          ...item,
          value:item.appKey,
          label:item.name,
        }
      })
    },

    // 确认保存
    async handleSumit(){
      
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        if(this.form.type == 2 && this.conditionList.length == 0){
          this.toast('请添加场景条件')
          return
        }
        if(this.taskList.length == 0){
          this.toast('请添加场景任务')
          return
        }
        const appList = this.form.appList?.map(item=> {
          const app = this.appOptions.filter(app=>app.appKey === item)?.pop()
          return {
            appKey: app.appKey,
            appName: app.name,
            tenantId: app.tenantId
          }
        }) || []
        const param = {
          ...this.form,
          appList,
          tasks: this.taskList,
          conditions:this.form.type == 2 ? this.conditionList : [{conditionType:1}]
        }
        const res = this.type==='add' ? await addScene(param) : await editScene(param)
        if(res.code !== 0 ) return
        this.$router.back(-1)
      });
    },

    // 修改
    handleEdit(type, item, index){
      this.editType = 'edit'
      this.setType = type
      this.editIndex = index
      this.editData = {...item}
      this.setType == 'condition' ? this.setVisible = true : this.setTaskVisible = true
      
    },

    // 添加
    handleAdd(type){
      this.editType = 'add'
      this.setType = type
      this.editIndex = -1
      this.editData = {}
      this.setType == 'condition' ? this.setVisible = true : this.setTaskVisible = true
    },

    // 取消编辑
    cancelEdit(){
      this.setVisible = false
      this.setTaskVisible = false
    },

    // 确认编辑
    sumitEdit(data){
      this.setVisible = false
      this.setTaskVisible = false
      if(this.setType === 'condition'){
        if(this.editType === 'add'){
          this.conditionList.push(data)
        } else {
          this.conditionList.splice(this.editIndex,1,data)
        }
      } else {
        this.taskList = [...data]
      }
    },

    // 删除
    handleDelete(list,index){

      list.splice(index, 1,)
    },

    handleCancel(){
      this.$router.back(-1)
    },

    // 获取产品列表
    async getProductList(){
      const res = await getProductList({page:0})
      if(res.code !==0) return
      this.productList = res.data?.list || []
    },

    // 获取产品名称
    getProductName(productKey){
      const product = this.productList.filter(item=>item.productKey === productKey)?.pop() || {}
      return product.name
    },

    // 获取功能名称
    async getFunctionName(condType,productKey,dpid,props){
      const product = this.productList.filter(item=>item.productKey === productKey)?.pop() || {}
      const productId = product.id || ''
      let func = {}
      if(condType ==='triggerCond'){
        if(!this.condFuncList[productId]) {
          const res = await getTranslateFuncList({productId,condType})
          this.condFuncList[productId] = res?.data || []
        }
        func = this.condFuncList[productId]?.filter(item=>item.dpId == dpid)?.pop() || {}
      } else {
        if(!this.taskFuncList[productId]) {
          const res = await getTranslateFuncList({productId,condType})
          this.taskFuncList[productId] = res?.data || []
        }
        func = this.taskFuncList[productId]?.filter(item=>item.dpId == dpid)?.pop() || {}
      }
      
      if(props===null || props===undefined)  return func.name
      if(func.dataType === 'ENUM'|| func.dataType == 'FAULT'){
        const list = JSON.parse(func.dataSpecsList)
        return list.filter(item=>item.value == props)?.pop()?.desc || ''
      }else if(func.dataType === 'BOOL'){
        return props || ''
      }
      else if(func.dataType === 'INT' || func.dataType == "DOUBLE" || func.dataType === 'TEXT' || func.dataType == "FLOAT"){
        return props + (func.unit || '')
      }
     
    },
    
    // 图片上传
    uploaded(data){
      this.$set(this.form,'icon',data.fullPath)
      this.$refs.form.clearValidate('icon');
    },

    // 选中适用app
    appListChange(val){
      if(this.form.isSpecifyApp == 2 && val && val.length>0){
        this.$refs['form'].clearValidate('isSpecifyApp')
      }

    }
  },
};
</script>
<style lang="less" scoped>
  @import "../../../../global.less";
  @import "../../../../utils/utils.less";
  /deep/.ant-page-header-heading{
    border-bottom: 1px solid @aithings-border-color;
  }
  .content{
    max-width: 900px;
    padding: 20px 0;
  }
  .form{
    .ant-form();
  }
  .image-tips{
    padding-left: 20px;
    color: @aithings-text-tips-color;
  }
  .flex-item-wrap{
    .ant-form-item{
      flex: 1;
    }
  }
  .ant-btn{
    padding: 0 28px;
    border: 1px solid @aithings-text-tips-color;
    color: @aithings-text-tips-color;
  }
  .ant-btn-primary{
    background: @primary-color;
    border: 1px solid @primary-color;
    color: #fff;
  }
  .ant-btn + .ant-btn {
    margin-left: 20px;
  }
  .set-wrap{
    width: 100%;
    margin-top: 20px;
    padding: 10px 20px;
    background: @aithings-color-F6F6F8;
    border-radius: 4px;
    .add-btn.ant-btn{
      margin-top: 10px;
      padding: 0 12px;
      border: 1px solid @primary-color;
      color: @primary-color;
      border-radius: 20px;
    }
    .condition-type{
      margin-top: 10px;
      width: 280px;
    }
  }
  .set-item{
    margin-top: 10px;
    padding: 0 20px;
    background: #fff;
    border: 1px solid @aithings-border-color;
    .action-wrap{
      color: @primary-color;
      span+span{
        padding-left: 20px;
      }
    }
    .title{
      height: 40px;
      line-height: 40px;
    }
    .item{
      margin: 0 10px 10px 0;
      padding: 6px 20px;
      background: @aithings-color-F6F6F8;
      font-size: 12px;
      color: @aithings-text-color-gray;
      line-height: 18px;
      border-radius: 16px;
      border: 1px solid @aithings-text-color-gray;
    }
    
  }
</style>
