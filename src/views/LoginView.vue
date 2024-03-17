<script setup>
import {ref} from "vue";
import authApi from "@/api/authApi";
import {useAuthStore} from "@/stores/user";

const ruleFormRef = ref()

let ruleForm = ref({
  login: "",
  password: ""
})

const login = () => {
  authApi.login(ruleForm.value.login, ruleForm.value.password).then((res) => {
    useAuthStore().setToken(res.token)
  })
}

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Введите пароль'))
  } else {
    if (ruleForm.value.password !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}

const rules = ref({
  password: [{ validator: validatePass, trigger: 'blur' }]
})
</script>

<template>
  <el-card class="container" style="max-width: 600px">
    <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
    >
      <h1 style="margin-left: auto; width: 55%">Вход</h1>
      <el-form-item label="Логин">
        <el-input v-model="ruleForm.login" placeholder="Введите логин"></el-input>
      </el-form-item>
      <el-form-item label="Пароль" prop="password">
        <el-input
            v-model="ruleForm.password"
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
  </el-card>
</template>

<style scoped>
.container {
  height: fit-content;
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;

  margin: auto;
}
</style>