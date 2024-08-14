<template>
  <!-- <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
    </template>
  </a-result> -->
</template>

<script>
import { removeAvoidLogin } from '@/utils/avoidLogin'
export default {
  name: 'Exception404',
  beforeCreate() {
    this.$store.dispatch("Logout").then(() => {
      removeAvoidLogin()
      this.$router.push({ name: "login" });
    })
  },
  methods: {
    // toHome () {
      // this.$router.push({ path: '/user/login' })
    // }
  }
}
</script>
