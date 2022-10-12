<template>
ЭЦП
</template>

<script>
export default {
  beforeRouteLeave(to, from, next) {
    if (to.redirectedFrom && to.redirectedFrom.name === 'logout') {
      this.localStorage.isAuth = false;
    }
    next()
  },
};
</script>

<style scoped>


</style>