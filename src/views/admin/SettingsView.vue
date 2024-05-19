<script setup>

import {DataAnalysis, Edit, SemiSelect, User} from "@element-plus/icons-vue";
import ProjectStatus from "@/components/project/ProjectStatus.vue";
import UserPanel from "@/components/UserPanel.vue";
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Caesar</el-breadcrumb-item>
    <el-breadcrumb-item>Настройки</el-breadcrumb-item>
  </el-breadcrumb>
  <h2>Настройки</h2>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="Задачи" name="about"></el-tab-pane>
    <el-tab-pane label="Автораспределение" name="tasks"></el-tab-pane>
  </el-tabs>
</template>

<style scoped>

</style>