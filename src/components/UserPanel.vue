<script setup>
import {CirclePlus} from "@element-plus/icons-vue";

let props = defineProps({
  name: String
})
</script>

<template>
  <div class="base">
    <span class="user-name" style="margin-left: 5px">{{ name }}</span>
  </div>
</template>

<style scoped>
@import '@/assets/status.css';
.user-name {
  text-overflow: ellipsis;
  white-space:nowrap;
  overflow: hidden;
}

.base {
  display: flex;
  border-radius: calc(var(--el-border-radius-base) - 1px);
  height: 32px;
  width: 150px;
  box-sizing: border-box;
  border: 1px solid var(--el-border-color);
  color: var(--el-text-color-primary);;
  font-size: 14px;
  padding: 2px 8px;
  align-items: center;
  text-align: center;
  justify-content: center;
}
</style>