<script setup>
import {CirclePlus, Loading, Tickets} from "@element-plus/icons-vue";
import { Bug } from '@vicons/tabler'


let props = defineProps({
  type: String
})
</script>

<template>
  <div v-if="type === 'TASK'" class="status-base status-new">
    <el-icon><Tickets/></el-icon>
    <span style="margin-left: 5px">Задача</span>
  </div>
  <div v-if="type === 'BUG'" class="status-base status-canceled">
    <el-icon><Bug/></el-icon>
    <span style="margin-left: 5px">Баг</span>
  </div>
</template>

<style scoped>
@import '@/assets/status.css';

.status-base {
  width: 220px;
}
</style>