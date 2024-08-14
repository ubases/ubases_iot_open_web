<template>
  <a-modal
    :title="$t('manufacture.detail.title')"
    :width="800"
    :visible="visible"
    @cancel="handleCancel"
  >
    <h3>{{ $t('manufacture.detail.baseMsg') }}</h3>
    <a-form-model class="regular-form" :model="data" :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }">
      <a-form-model-item :label="$t('manufacture.columns.did')" >
        {{data.did}}
      </a-form-model-item>
      <a-form-model-item :label="$t('manufacture.columns.username')" >
        {{data.userName}}
      </a-form-model-item>
      <a-form-model-item :label="$t('manufacture.columns.password')" >
        {{data.passward}}
      </a-form-model-item>
      <a-form-model-item :label="$t('manufacture.columns.sn')" >
        {{data.sn}}
      </a-form-model-item>
      <a-form-model-item :label="$t('manufacture.columns.batchId')" >
        {{data.batchId}}
      </a-form-model-item>
      <a-form-model-item :label="$t('manufacture.columns.productName')" >
        {{data.productName}}
      </a-form-model-item>
      <a-form-model-item :label="$t('manufacture.columns.isActived')" >
        {{$DictName('active_status',data.activeStatus)}}
      </a-form-model-item>
      <a-form-model-item :label="$t('manufacture.columns.createTime')" >
        {{data.createdAt | momentFilter}}
      </a-form-model-item>
    </a-form-model>
    <h3>{{ $t('manufacture.detail.exportDetail') }}</h3>
    <a-form-model class="regular-form" :model="data" :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }">
      <a-form-model-item :label="$t('manufacture.columns.exportTimes')" >
        {{data.exportCount}}
      </a-form-model-item>
      <a-form-model-item :label="$t('manufacture.detail.exportTime')" v-for="(item,index) in data.exportList || []" :key="index">
        {{ item }}
      </a-form-model-item>
    </a-form-model>
    <section slot="footer" class="ant-modal-footer">
      <a-button @click="handleCancel">{{$t('public.close.text')}}</a-button>
    </section>
  </a-modal>
</template>

<script>

export default ({
  name: "ManufactureDetail",
  props:{
    visible: { type: Boolean, default: false },
    data: { type: Object, default: ()=> {}}
  },
  data() {
    return {
      
    }
  },
  created() {
  
  },
  methods:{
   
    handleCancel(){
      this.$emit('handleClose')
    },

  }
})
</script>
<style lang="less" scoped>
  
</style>