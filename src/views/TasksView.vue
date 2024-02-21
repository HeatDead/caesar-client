<script setup>
import {onMounted} from "vue";
import {ref} from "vue";
import taskF from "../api/taskApi"
import router from "@/router";
import {useRoute} from "vue-router";

let tasks = ref([])
let loading = ref(true)

const route = useRoute()
const id = route.query.project;

const getTasks = async () => {
  if (id) {
    await taskF.getTasksByProject(id).then((value) => {
      tasks.value = value
      loading.value = false
    })
  } else {
    await taskF.getTasks().then((value) => {
      tasks.value = value
      loading.value = false
    })
  }
}

const taskInfo = (id) => {
  router.push('/task?id=' + id)
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
  <el-table v-loading="loading" :data="tasks" style="width: 100%">
    <el-table-column prop="id" label="ID" width="150"/>
    <el-table-column prop="name" label="Название" width="180"/>
    <el-table-column prop="projectEntity.name" label="Проект" width="180"/>
    <el-table-column fixed="right" label="Операции" width="350">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click="taskInfo(scope.row.id)"
        >Подробнее
        </el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>