<template>
  <div class="left">
    <el-menu
      :default-active="activeIndex"
      @select="handleSelect">
      <el-menu-item index="echartsList">我的图表</el-menu-item>
      <el-menu-item index="dataSourceList">数据源管理</el-menu-item>
      <el-menu-item index="dataSetList">数据集管理</el-menu-item>
      <el-menu-item index="dataTable">数据库管理</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import {ElMenu,ElMenuItem,ElSubMenu} from 'element-plus'
import {useRouter} from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const activeIndex = ref(router.currentRoute.value.name)
const handleSelect = (key, keyPath) => {
  router.push(key)
}

</script>

<style lang="scss" scoped>
.left{
  float: left;
  width: 200px;
  height: calc(100% - 67px);
}



</style>