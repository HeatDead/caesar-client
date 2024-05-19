<script setup>
import {
  ArrowDown,
  ArrowDownBold,
  ArrowUp,
  ArrowUpBold,
  SemiSelect,
  Tickets,
  WarningFilled
} from "@element-plus/icons-vue";
import {Bug} from "@vicons/tabler";

let props = defineProps({
  priority: String
})
</script>

<template>
  <div v-if="priority === 'BLOCKER'" class="status-base status-canceled">
    <el-icon><WarningFilled/></el-icon>
    <span style="margin-left: 5px">Блокер</span>
  </div>
  <div v-if="priority === 'CRITICAL'" class="status-base status-info">
    <el-icon><ArrowUpBold/></el-icon>
    <span style="margin-left: 5px">Критический</span>
  </div>
  <div v-if="priority === 'AVERAGE'" class="status-base status-completed">
    <el-icon><SemiSelect/></el-icon>
    <span style="margin-left: 5px">Средний</span>
  </div>
  <div v-if="priority === 'LOW'" class="status-base status-work">
    <el-icon><ArrowDown/></el-icon>
    <span style="margin-left: 5px">Низкий</span>
  </div>
  <div v-if="priority === 'MINOR'" class="status-base status-new">
    <el-icon><ArrowDownBold/></el-icon>
    <span style="margin-left: 5px">Незначительный</span>
  </div>
</template>

<style scoped>
@import '@/assets/status.css';

.status-base {
  width: 220px;
}
</style>