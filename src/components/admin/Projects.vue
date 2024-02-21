<script setup>
import {onMounted} from "vue";
import axios from "axios";
import {ref} from "vue";
import projectF from "../../api/projectApi"

let projects = ref([])
const getProjects = async () => {
  projects.value = await projectF.getProjects()
}

onMounted(() => {
  getProjects()
})
</script>

<template>
  <h3>Проекты</h3>
  <el-table :data="projects" style="width: 100%">
    <el-table-column prop="id" label="ID" width="150"/>
    <el-table-column prop="name" label="Название" width="180"/>
    <el-table-column fixed="right" label="Операции" width="350">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click="editProject(scope.$index, scope.row.id)"
        >Изменить
        </el-button
        >
        <el-button
            link
            type="danger"
            size="small"
            @click="frozeProject(scope.row.id)"
        >Заморозить
        </el-button>
        <el-button
            link
            type="danger"
            size="small"
            @click="unfrozeProject(scope.row.id)"
        >Разморозить
        </el-button>
        <el-button
            link
            type="danger"
            size="small"
            @click="deleteProject(scope.row.id)"
        >Удалить
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>