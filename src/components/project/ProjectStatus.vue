<script setup>
import {Document, DocumentAdd, DocumentChecked, DocumentDelete} from "@element-plus/icons-vue";
import {ref} from "vue";

const status = ref('Новый')
</script>

<template>
  <div v-if="status === 'Новый'" class="status-base status-new">
    <el-icon><DocumentAdd/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
  <div v-if="status === 'В работе'" class="status-base status-work">
    <el-icon><Document/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
  <div v-if="status === 'Завершен'" class="status-base status-completed">
    <el-icon><DocumentChecked/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
  <div v-if="status === 'Отменен'" class="status-base status-canceled">
    <el-icon><DocumentDelete/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
</template>

<style scoped>
@import '@/assets/status.css';
</style>