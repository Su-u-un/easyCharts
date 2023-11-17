<template>
    <div id="app" class="jp-wrapper">
        <template>
            <main-navbar ref="navbar" @showRight="showRight" />
            <main-sidebar/>
            <div class="jp-content__wrapper">
            <main-content/>
            </div>
            <main-right ref="mainRight"/>
        </template>
    </div>
</template>
  
<script setup>
import MainNavbar from './layout/_common_top'
import MainSidebar from './layout/_common_left'
import MainContent from './layout/_common_center'
import MainRight from './layout/_common_right'
import configService from '@/api/sys/configService'
import userService from '@/api/sys/userService'
import {ref} from 'vue'

const isRightVisible = ref(false)

const mainRight = ref()

const showRight = (flag)=>{
    mainRight.value.showRight()
    isRightVisible.value = flag
}
</script>
  