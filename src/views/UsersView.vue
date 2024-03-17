<script setup>
import {onMounted} from "vue";
import axios from "axios";
import {ref} from "vue";
import userApi from "@/api/userApi";

let users = ref([])
const getUsers = async () => {
  users.value = await userApi.getUsers()
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Caesar</el-breadcrumb-item>
    <el-breadcrumb-item>Пользователи</el-breadcrumb-item>
  </el-breadcrumb>
  <h2>Пользователи</h2>
  <RouterLink to="/users/add">
    <el-button>Добавить</el-button>
  </RouterLink>
  <el-table :data="users" style="width: 100%">
    <el-table-column prop="username" label="Логин" width="150"/>
    <el-table-column prop="surname" label="Фамилия" width="180"/>
    <el-table-column prop="name" label="Имя" width="180"/>
    <el-table-column prop="patronymic" label="Отчество" width="180"/>
    <el-table-column prop="role.name" label="Роль" width="180"/>
    <el-table-column fixed="right" label="Операции" width="350">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click="editModel(scope.$index, scope.row.id)"
        >Изменить
        </el-button
        >
        <el-button
            link
            type="danger"
            size="small"
            @click="deleteModel(scope.row.id)"
        >Заморозить
        </el-button>
        <el-button
            link
            type="danger"
            size="small"
            @click="deleteModel(scope.row.id)"
        >Разморозить
        </el-button>
        <el-button
            link
            type="danger"
            size="small"
            @click="deleteModel(scope.row.id)"
        >Удалить
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>

</style>