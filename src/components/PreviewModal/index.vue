<template>
  <div class="aithings-previewModal">
    <a-modal
      title=" "
      :visible="previewVisible"
      :footer="null"
      :centered="true"
      @cancel="previewVisible = false"
    >
      <div style="padding: 20px">
        <img style="width: 100%" :src="url" />
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: "image",
      previewVisible: false,
      url: "",
    };
  },
  methods: {},
};
</script>
<style lang="less" scoped></style>
