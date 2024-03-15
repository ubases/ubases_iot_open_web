<template>
    <a-modal
    :title="$t('editCustomMenu.title')"
    :width="680"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :okText="$t('public.save')"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" class="regular-form" :model="data" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-model-item :label="$t('DefaultRoom.column.roomName')" prop="roomName" >
          <a-input v-model="data.roomName" :maxLength="10" :placeholder="$t('DefaultRoom.placeholder.roomName')"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('DefaultRoom.label.sort')" prop="roomSort" >
          <a-input-number v-model="data.roomSort"  :placeholder="$t('DefaultRoom.placeholder.sort')" :min="0" :max="1000" :precision="0" class="sort-input"/>
        </a-form-model-item>
        <a-form-model-item :label="$t('DefaultRoom.label.image')" prop="roomImage" >
          <section class="flex y-axis-center">
            <upload-card 
              accept="image/png"
              :acceptList="['image/png']"
              :limitWidth="108"
              :limitHeight="108"
              warningFileType="PNG"
              catalogName="app"
              :fileUrl="data.roomImage"
              @uploaded="e=>uploaded(e,'roomImage')"
            />
            <p class="tips">{{$t('DefaultRoom.label.image.limit')}}</p>
          </section>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
import UploadCard from "@/components/uploadCard"
import { saveDefaultRoom } from "@/api/appExploit"

export default ({
  name:"EditRoomIcon",
  props:{
    visible: { type: Boolean, default: false },
    data:{ type: Object, default: () => {}},
    id:{ type: String, default:''}
  },
  components:{
    UploadCard
  },

  data () {
    return {
      confirmLoading:false,
      rules: {
        roomName: [{required: true, message: this.$t('editCustomMenu.rules.name'), trigger: '',}],
        roomSort: [{required: true, message: this.$t('DefaultRoom.rules.sort'), trigger: '',}],
        roomImage: [{ required: true, message: this.$t('DefaultRoom.rules.image'), trigger: 'change' }],
      },
    }
  },
  methods:{
    async handleOk(){
      this.$refs.form.validate(async(valid) => {
        if (!valid) return
        this.confirmLoading = true
        const res = await saveDefaultRoom({ room: this.data, id: this.id}) 
        this.confirmLoading = false
        if(res.code !==0)return
        this.$emit('sumit')
      })
    },
    handleCancel(){
      this.$refs.form?.resetFields()
      this.$emit('cancel')
    },

    uploaded(data, type){
      this.$set(this.data,type,data.fullPath)
      this.$refs["form"].clearValidate([type]);
    },

  }
})
</script>
<style lang="less" scoped>
@import "../../../../global.less";
.tips{
  padding-left: 10px;
  color: @aithings-text-tips-color;
}
.key-tips{
  line-height: 22px;
  color: @aithings-warning-color-FF8E35;
}
.sort-input{
  width: 100%;
}
</style>