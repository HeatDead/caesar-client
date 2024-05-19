<script setup>
import {onMounted} from "vue";
import axios from "axios";
import {ref} from "vue";
import * as userApi from "@/api/userApi";

let users = ref([])
const getUsers = async () => {
  users.value = await userApi.getUsers()
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <h3>Пользователи</h3>
  <RouterLink to="/users/add">
    <el-button>Добавить</el-button>
  </RouterLink>
  <el-table height="600" :data="users" style="width: 100%; height: 600px">
    <el-table-column prop="login" label="Логин" width="150"/>
    <el-table-column prop="surname" label="Фамилия" width="180"/>
    <el-table-column prop="name" label="Имя" width="180"/>
    <el-table-column prop="patronymic" label="Отчество" width="180"/>
    <el-table-column prop="roles" label="Роли" width="180"/>
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