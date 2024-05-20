<script setup>
import {Close, MessageBox, MoreFilled, Plus, Search, Star} from "@element-plus/icons-vue";
import {computed, onMounted, ref} from "vue";
import groupApi from "@/api/groupApi";

const groups = ref()
const role = ref()

const search = ref('')

const newGroupName = ref('')
const visible = ref(false)

const getGroups = async () => {
  await groupApi.getGroups().then((data) => {
    groups.value = data
  })
}

const addGroup = async () => {
  await groupApi.addGroup(newGroupName.value)
  await getGroups()
}

const filterTableData = computed(() => {
  if(groups.value)
    return  groups.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
  return null}
)

onMounted(() => {
  getGroups()
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Caesar</el-breadcrumb-item>
    <el-breadcrumb-item>Группы</el-breadcrumb-item>
  </el-breadcrumb>
  <h2>Группы</h2>
  <el-input :prefix-icon="Search" v-model="search" style="width: 400px" placeholder="Поиск" />
  <el-table table-layout="auto" width="100%" height="600" :data="filterTableData" style="width: 100%">
    <template #empty>
      <div class="flex items-center justify-center h-100%">
        <el-empty description="Нет данных"/>
      </div>
    </template>
    <el-table-column prop="name" label="Название" width="600">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="loadRole(scope.row.id)"> <!-- Клик на проект -->
          <el-icon><MessageBox /></el-icon>
          <span style="margin-left: 10px"> {{scope.row.name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="ID"/>
    <el-table-column fixed="right" width="60">
      <template #header>
        <el-popover :visible="visible" placement="left-start" :width="300"> <!-- Создание проекта -->
          <header class="crp-header">
            <h3 style="margin: 0">Создать группу</h3>
            <el-button style="width: 32px" text @click="visible = false"><el-icon><Close/></el-icon></el-button>
          </header>
          <el-input v-model="newGroupName" style="margin-bottom: 10px" type="text" placeholder="Название группы"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button :disabled="!newGroupName" type="primary" @click="addGroup"
            >Создать</el-button>
          </div>
          <template #reference>
            <el-button @click="visible = true" class="button" type="success" style="width: 35px" text bg><el-icon><Plus/></el-icon></el-button>
          </template>
        </el-popover>
      </template>
      <template #default="scope">
        <el-popover placement="right-start" :width="250" trigger="click">
          <template #reference>
            <el-button style="width: 35px" bg text><el-icon><MoreFilled/></el-icon></el-button>
          </template>
          <div class="settings">
            <el-button @click="loadRole(scope.row.id)" class="setting_button">Подробнее</el-button>
            <el-button class="setting_button" style="margin-top: 5px">Изменить</el-button>
            <el-button class="setting_button" style="margin-top: 5px" type="danger">Удалить из проекта</el-button>
          </div>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
@import "@/assets/table.css";
</style>