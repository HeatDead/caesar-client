<script setup>
import {ref} from "vue";
import {
  CircleCheck,
  CircleClose, CirclePlus, Loading,
  Warning
} from "@element-plus/icons-vue";

let props = defineProps({
  status: String
})
</script>

<template>
  <div v-if="status === 'OPENED'" class="status-base status-new">
    <el-icon><CirclePlus/></el-icon>
    <span style="margin-left: 5px">Открыт</span>
  </div>
  <div v-if="status === 'IN_WORK'" class="status-base status-work">
    <el-icon><Loading/></el-icon>
    <span style="margin-left: 5px">В работе</span>
  </div>
  <div v-if="status === 'COMPLETED'" class="status-base status-completed">
    <el-icon><CircleCheck/></el-icon>
    <span style="margin-left: 5px">Завершен</span>
  </div>
  <div v-if="status === 'NEED_INFO'" class="status-base status-info">
    <el-icon><Warning/></el-icon>
    <span style="margin-left: 5px">Н. Инфо.</span>
  </div>
  <div v-if="status === 'CANCELED'" class="status-base status-canceled">
    <el-icon><CircleClose/></el-icon>
    <span style="margin-left: 5px">Отменен</span>
  </div>
</template>

<style scoped>
@import '@/assets/status.css';
</style>