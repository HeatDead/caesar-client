<script setup>
import {ref} from "vue";
let userInput = ref({
  login: "",
  password: ""
})
</script>

<template>
  <div class="container">
    <div class="loginPlate">
      <el-form>
        <h1>Вход</h1>
        <el-form-item label="Логин">
          <el-input v-model="userInput.login" placeholder="Введите логин"></el-input>
        </el-form-item>
        <el-form-item label="Пароль">
          <el-input
              v-model="userInput.password"
              placeholder="Введите пароль"
              type="password"
          ></el-input>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button type="primary" @click="login">Войти</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>

</style>