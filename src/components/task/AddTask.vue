<script setup>
import {onMounted, ref} from "vue";
import projectF from "@/api/projectApi";
import taskApi from "@/api/taskApi";

let projects = ref([])
const getProjects = async () => {
  projects.value = await projectF.getProjects()
}

let task = ref({
  name: null,
  description: null,
  projectId: null
})

const addTask = () => {
  if (task.value.name && task.value.description && task.value.projectId) {
    taskApi.addTask(task.value)
  }
}

onMounted(() => {
  getProjects()
})
</script>

<template>
  <RouterLink to="/tasks">Назад</RouterLink>
  <el-input v-model="task.name" class="w-100 m-2" placeholder="Название" />
  <el-input
      v-model="task.description"
      :rows="2"
      type="textarea"
      placeholder="Описание"
  />
  <el-select v-model="task.projectId" class="m-2" placeholder="Проект">
    <el-option
        v-for="project in projects"
        :key="project.id"
        :label="project.name"
        :value="project.id"
    />
  </el-select>
  <el-button @click="addTask">Добавить</el-button>
</template>

<style scoped>

</style>