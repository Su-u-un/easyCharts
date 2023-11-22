<template>
    <div id="app">
        <main-navbar/>
        <main-sidebar/>
        <main-content/>
    </div>
</template>
  
<script setup>
import MainNavbar from './layout/_common_top'
import MainSidebar from './layout/_common_left'
import MainContent from './layout/_common_center'
import {ref} from 'vue'
</script>

<style lang="scss" scoped>

</style>
  