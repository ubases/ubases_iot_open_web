<template>
</template>

<script>

export default {
  beforeRouteEnter(to,from,next){
    next(vm =>{
      vm.$router.replace({path:"/dashboard/index"})
    })
  }
}
</script>
