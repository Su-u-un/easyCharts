<template>
    <div class="container">
        <el-button @click="test1">show</el-button>
        <el-button @click="test2">http2</el-button>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import {ElButton} from 'element-plus'

const test1 = function(){
    axios.post('/api/echarts/show', {name: 'test6'}).then(res => {
        console.log(res.data);
    })
}

const test2 = function(){
    axios.post('/api/echarts/delete', {name: 'test6'}).then(res => {
        console.log(res.data);
    })
}


</script>

<style>
.container{
    display: flex;
    flex-direction: row;
}
</style>