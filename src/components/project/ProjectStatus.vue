<script setup>
import {Document, DocumentAdd, DocumentChecked, DocumentDelete} from "@element-plus/icons-vue";
import {ref} from "vue";

let props = defineProps({
  status: String
})
</script>

<template>
  <div v-if="status === 'NEW'" class="status-base status-new">
    <el-icon><DocumentAdd/></el-icon>
    <span style="margin-left: 5px">Новый</span>
  </div>
  <div v-if="status === 'IN_WORK'" class="status-base status-work">
    <el-icon><Document/></el-icon>
    <span style="margin-left: 5px">В работе</span>
  </div>
  <div v-if="status === 'COMPLETED'" class="status-base status-completed">
    <el-icon><DocumentChecked/></el-icon>
    <span style="margin-left: 5px">Завершен</span>
  </div>
  <div v-if="status === 'CANCELED'" class="status-base status-canceled">
    <el-icon><DocumentDelete/></el-icon>
    <span style="margin-left: 5px">Отменен</span>
  </div>
</template>

<style scoped>
@import '@/assets/status.css';
</style>