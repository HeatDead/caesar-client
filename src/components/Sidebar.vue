<script setup>
import {
  Collection,
  DataAnalysis,
  DataBoard,
  Setting,
  Tickets,
  User,
  Star,
  MessageBox,
  Moon, Sunny
} from "@element-plus/icons-vue";
import {useAuthStore} from "@/stores/user";
import { useDark, useToggle } from '@vueuse/core'
import {black, white} from "chalk";

const isDark = useDark()
const toggleDark = useToggle(isDark)

const logout = () => {
  useAuthStore().logout()
}
</script>

<template>
  <el-aside width="220px">
    <el-col style="height: 86%">
      <RouterLink class="logo" to="/">
        <svg width="30px" height="30px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--emojione-monotone" preserveAspectRatio="xMidYMid meet"><path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m-4.592 37.521c1.316 1.621 2.988 2.431 5.018 2.431c2.078 0 3.664-.695 4.756-2.086c.604-.748 1.104-1.87 1.502-3.366h6.023c-.52 3.163-1.848 5.735-3.982 7.717c-2.137 1.981-4.871 2.972-8.209 2.972c-4.129 0-7.375-1.338-9.736-4.016c-2.363-2.689-3.545-6.378-3.545-11.063c0-5.066 1.344-8.971 4.031-11.713c2.338-2.389 5.311-3.583 8.92-3.583c4.83 0 8.361 1.601 10.594 4.804c1.234 1.798 1.896 3.602 1.986 5.413h-6.063c-.387-1.392-.881-2.44-1.484-3.149c-1.08-1.26-2.682-1.891-4.803-1.891c-2.16 0-3.863.89-5.111 2.668c-1.246 1.778-1.869 4.295-1.869 7.549c0 3.254.658 5.691 1.972 7.313" :fill="isDark ? 'white' : 'black'"></path></svg>
        <span style="margin-left: 10px;">Caesar</span>
      </RouterLink>
      <el-menu
          class="el-menu-vertical-demo c-aside"
      >
        <RouterLink to="/dashboard">
          <el-menu-item index="1">
            <el-icon><DataAnalysis /></el-icon>
            <span>Дашборд</span>
          </el-menu-item>
        </RouterLink>
        <RouterLink to="/projects/list">
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
        <RouterLink to="/desks">
          <el-menu-item index="4">
            <el-icon><DataBoard /></el-icon>
            <span>Доски задач</span>
          </el-menu-item>
        </RouterLink>
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
              <el-icon><MessageBox /></el-icon>
              <span>Группы</span>
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
        <el-popover
            :width="300"
            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
        >
          <template #reference>
            <el-menu-item class="account">
              <el-avatar :size="50" src="https://avatars.githubusercontent.com/u/72015883?v=4" />
              <span style="margin-left: 15px">Учетная запись</span>
            </el-menu-item>
          </template>
          <template #default>
            <div
                class="demo-rich-conent"
                style="display: flex; gap: 16px; flex-direction: column"
            >
              <div class="user-details">
                <el-avatar
                    :size="60"
                    src="https://avatars.githubusercontent.com/u/72015883?v=4"
                    style="margin-bottom: 8px"
                />
                <div style="margin-left: 15px">
                  <p
                      class="demo-rich-content__name"
                      style="margin: 0; font-weight: 500"
                  >
                    Имя Фамилия
                  </p>
                  <p class="demo-rich-content__mention"
                     style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                    @username
                  </p>
                </div>
              </div>
              <el-button type="danger" @click="logout">Выйти</el-button>
            </div>
          </template>
        </el-popover>
      </el-menu>
      <el-switch
          v-model="isDark"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sunny"
      />
    </el-col>
  </el-aside>
</template>

<style scoped>
.c-aside {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user-details{
  display: flex;
}

.account {
  margin-top: auto;
}
.logo {
  display: flex;
  text-decoration: none;
  font-size: 25px;
  padding: 10px 10px 10px 12px;
  color: var(--el-table-text-color);
}
</style>