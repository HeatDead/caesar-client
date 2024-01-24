<script setup>
import {ref} from "vue";
import axios from "axios";
import router from "@/router";
let user = ref({
  login: "",
  surname: "",
  name: "",
  patronymic: "",
  password: "",
})
//TODO: Валидация
const addUser = () => {
  axios.post("http://localhost:8080/user", {
    login: user.value.login,
    surname: user.value.surname,
    name: user.value.name,
    patronymic: user.value.patronymic,
    password: user.value.password
  }).then(() => {
    router.push('/admin/users')
  }).catch((e) => {
    console.log(e)
  })
}
</script>
<template>
  <RouterLink to="/admin/users">Назад</RouterLink>
  <el-input v-model="user.login" class="w-100 m-2" placeholder="Логин" />
  <el-input v-model="user.surname" class="w-100 m-2" placeholder="Фамилия" />
  <el-input v-model="user.name" class="w-100 m-2" placeholder="Имя" />
  <el-input v-model="user.patronymic" class="w-100 m-2" placeholder="Отчество" />
  <el-input v-model="user.password" class="w-100 m-2" placeholder="Пароль" />
  <el-button @click="addUser">Добавить</el-button>
</template>

<style scoped>

</style>