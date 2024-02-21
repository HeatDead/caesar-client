<script setup>
import {ref} from "vue";
import {
  CircleCheck,
  CircleClose, CirclePlus, Loading,
  Warning
} from "@element-plus/icons-vue";

const status = ref('Открыт')
</script>

<template>
  <div v-if="status === 'Открыт'" class="status-base status-new">
    <el-icon><CirclePlus/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
  <div v-if="status === 'В работе'" class="status-base status-work">
    <el-icon><Loading/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
  <div v-if="status === 'Завершен'" class="status-base status-completed">
    <el-icon><CircleCheck/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
  <div v-if="status === 'Н. Инфо.'" class="status-base status-info">
    <el-icon><Warning/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
  <div v-if="status === 'Отменен'" class="status-base status-canceled">
    <el-icon><CircleClose/></el-icon>
    <span style="margin-left: 5px">{{status}}</span>
  </div>
</template>

<style scoped>
@import '@/assets/status.css';
</style>