<script setup>
import {ref} from "vue";
import axios from "axios";
import router from "@/router";
import projectF from "../../api/projectApi"

let project = ref({
  name: "",
  description: ""
})

const addProject = () => {
  projectF.addProject(project.value)
}
</script>

<template>
  <RouterLink to="/admin/projects">Назад</RouterLink>
  <el-input v-model="project.name" class="w-100 m-2" placeholder="Название" />
  <el-input
      v-model="project.description"
      :rows="2"
      type="textarea"
      placeholder="Описание"
  />
  <el-button @click="addProject">Добавить</el-button>
</template>

<style scoped>

</style>