<script setup>
import {onMounted} from "vue";
import axios from "axios";
import {ref} from "vue";
import taskF from "../api/taskApi"

let tasks = ref([])
const getTasks = async () => {
  tasks.value = await taskF.getTasks()
}

onMounted(() => {
  getTasks()
})
</script>

<template>
  <h2>Задачи</h2>
  <RouterLink to="/tasks/add">
    <el-button>Добавить</el-button>
  </RouterLink>
  <el-table :data="tasks" style="width: 100%">
    <el-table-column prop="id" label="ID" width="150"/>
    <el-table-column prop="name" label="Название" width="180"/>
    <el-table-column prop="projectEntity.name" label="Проект" width="180"/>
    <el-table-column fixed="right" label="Операции" width="350">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click="editProject(scope.$index, scope.row.id)"
        >Подробнее
        </el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>