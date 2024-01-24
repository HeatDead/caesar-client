<script setup>
import {Collection, DataAnalysis, DataBoard, Setting, Tickets, User, Star} from "@element-plus/icons-vue";

</script>

<template>
  <el-aside width="220px">
    <el-col>
      <div class="logo">
        <a class="logo" href="/">
          Caesar
        </a>
      </div>
      <el-menu
          class="el-menu-vertical-demo"
      >
        <RouterLink to="/dashboard">
          <el-menu-item index="1">
            <el-icon><DataAnalysis /></el-icon>
            <span>Дашборд</span>
          </el-menu-item>
        </RouterLink>
        <RouterLink to="/projects">
          <el-menu-item index="2">
            <el-icon><Collection /></el-icon>
            <span>Проекты</span>
          </el-menu-item>
        </RouterLink>
        <RouterLink to="/tasks">
          <el-menu-item index="3">
            <el-icon><Tickets /></el-icon>
            <span>Задачи</span>
          </el-menu-item>
        </RouterLink>
        <el-menu-item index="4">
          <el-icon><DataBoard /></el-icon>
          <span>Доски задач</span>
        </el-menu-item>
        <el-sub-menu index="1-1">
          <template #title>
            <el-icon><setting /></el-icon>
            <span>Администрирование</span>
          </template>
          <RouterLink to="/admin/users">
            <el-menu-item index="5">
              <el-icon><user /></el-icon>
              <span>Пользователи</span>
            </el-menu-item>
          </RouterLink>
          <RouterLink to="/admin/roles">
            <el-menu-item index="6">
              <el-icon><Star /></el-icon>
              <span>Роли</span>
            </el-menu-item>
          </RouterLink>
          <RouterLink to="/admin/projects">
            <el-menu-item index="7">
              <el-icon><Collection /></el-icon>
              <span>Проекты</span>
            </el-menu-item>
          </RouterLink>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-aside>
</template>

<style scoped>
.logo {
  text-decoration: none;
  font-size: 25px;
  padding: 10px 10px 10px 12px;
  color: white;
}
</style>