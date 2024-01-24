<script setup>
import {onMounted} from "vue";
import axios from "axios";
import {ref} from "vue";
import projectF from "../api/projectApi"

let projects = ref([])
const getProjects = async () => {
  projects.value = await projectF.getProjects()
}

onMounted(() => {
  getProjects()
})
</script>

<template>
  <h2>Проекты</h2>
  <el-table :data="projects" style="width: 100%">
    <el-table-column prop="name" label="Название" width="180"/>
    <el-table-column fixed="right" label="" width="350">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click="editProject(scope.$index, scope.row.id)"
        >Задачи
        </el-button
        >
        <el-button
            link
            type="primary"
            size="small"
            @click="editProject(scope.$index, scope.row.id)"
        >Доски
        </el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>