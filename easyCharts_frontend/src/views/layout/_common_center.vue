<template>
  <div class="center">
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.center{
  float: right;
  width: calc(100% - 200px);
  height: calc(100% - 67px);
  background-color: rgb(235, 238, 245);
}
.wrapper{
  border-radius:3px;
  margin: 20px;
  height: calc(100% - 42px);
}
</style>