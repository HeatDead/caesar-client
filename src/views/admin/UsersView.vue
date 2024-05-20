<script setup>
import {computed, onMounted, ref} from "vue";
import * as userApi from "@/api/userApi";
import {Close, Lock, MoreFilled, Plus, Search, Unlock, User} from "@element-plus/icons-vue";
import router from "@/router";
import * as authApi from "@/api/authApi";
import UserInfoEdit from "@/components/admin/user/UserInfoEdit.vue";

const childComponentRef = ref()

let users = ref([])
let user = ref([])
const search = ref('')
const visible = ref(false)
const newUserRef = ref({
  lgn:'',
  psw:'',
  name:'',
  surname:'',
  patronymic:'',
  role:''
})
const newUser = ref({
  lgn:'',
  psw:'',
  name:'',
  surname:'',
  patronymic:'',
  role:''
})

const roles = ref()

const filterTableData = computed(() =>
    users.value.filter(
        (data) =>
            !search.value ||
            (`${data.surname} ${data.name} ${data.patronymic}`).toLowerCase().includes(search.value.toLowerCase())
    )
)

const getUsers = async () => {
  users.value = await userApi.getUsers()
}

const getRoles = async () => {
  roles.value = await userApi.getRoles()
}

const addUser = async () => {
  await authApi.register(newUser.value).then((resp) => {
    getUsers()
    closeAdd()
  })
}

const closeAdd = () => {
  visible.value = false
  newUser.value = {...newUserRef}
}

const loadUser = async (username) => {
  user.value = await userApi.getUserByUsername(username)
  console.log(user.value)
  childComponentRef.value.open()
}

const loadUserEdit = async (username) => {
  user.value = await userApi.getUserByUsername(username)
  childComponentRef.value.openEdit()
}

const reload = async () => {
  await getRoles()
  await getUsers()
  user.value = await userApi.getUserByUsername(user.value.username)
}

const blockUser = async (id) => {
  await userApi.blockUser(id)
  await getUsers()
}

const unblockUser = async (id) => {
  await userApi.unblockUser(id)
  await getUsers()
}

onMounted(() => {
  getRoles()
  getUsers()
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Caesar</el-breadcrumb-item>
    <el-breadcrumb-item>Пользователи</el-breadcrumb-item>
  </el-breadcrumb>
  <h2>Пользователи</h2>
  <el-input :prefix-icon="Search" id="search" label="search" name="search" v-model="search" style="width: 400px" placeholder="Поиск" />
  <el-table height="600" :data="filterTableData" style="width: 100%" >
    <template #empty>
      <div class="flex items-center justify-center h-100%">
        <el-empty description="Нет данных"/>
      </div>
    </template>
    <el-table-column sortable prop="username" label="Логин" width="220">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="loadUser(scope.row.username)"> <!-- Клик на проект -->
          <el-icon style="margin-right: 10px"><User /></el-icon>
          <el-icon v-if="scope.row.disabled"><Lock /></el-icon>
          <el-icon v-else><Unlock /></el-icon>
          <span style="margin-left: 10px"> {{scope.row.username}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column sortable prop="surname" label="Фамилия" width="230"/>
    <el-table-column sortable prop="name" label="Имя" width="230"/>
    <el-table-column sortable prop="patronymic" label="Отчество" width="230"/>
    <el-table-column sortable prop="role.name" label="Роль" width="194"/>
    <el-table-column fixed="right" width="60">
      <template #header>
        <el-popover :visible="visible" placement="left-start" :width="300"> <!-- Создание проекта -->
          <header class="crp-header">
            <h3 style="margin: 0">Добавить пользователя</h3>
            <el-button style="width: 32px" text @click="closeAdd"><el-icon><Close/></el-icon></el-button>
          </header>
          <el-input autocomplete="username" clearable v-model="newUser.lgn" style="margin-bottom: 10px" type="text" placeholder="Логин"></el-input>
          <el-input show-password clearable v-model="newUser.psw" style="margin-bottom: 10px" type="password" placeholder="Пароль"></el-input>
          <el-input clearable v-model="newUser.name" style="margin-bottom: 10px" type="text" placeholder="Имя"></el-input>
          <el-input clearable v-model="newUser.surname" style="margin-bottom: 10px" type="text" placeholder="Фамилия"></el-input>
          <el-input clearable v-model="newUser.patronymic" style="margin-bottom: 10px" type="text" placeholder="Отчество"></el-input>
          <el-select
              v-model="newUser.role"
              placeholder="Роль"
              style="width: 100%; margin-bottom: 10px"
          >
            <el-option
                v-for="role in roles"
                :key="role.id"
                :label="role.name"
                :value="role.id"
            />
          </el-select>
          <div style="text-align: right; margin: 0">
            <el-button :disabled="!newUser.lgn || !newUser.psw || !newUser.name || !newUser.surname || !newUser.role" type="primary" @click="addUser"
            >Добавить</el-button>
          </div>
          <template #reference>
            <el-button @click="visible = true" class="button" type="success" style="width: 35px" text bg><el-icon><Plus/></el-icon></el-button>
          </template>
        </el-popover>
      </template>
      <template #default="scope">
        <el-popover placement="right-start" :width="250" trigger="click"> <!-- Настройки проекта -->
          <template #reference>
            <el-button style="width: 35px" bg text><el-icon><MoreFilled/></el-icon></el-button>
          </template>
          <div class="settings">
            <el-button @click="loadUser(scope.row.username)" class="setting_button">Подробнее</el-button>
            <el-button @click="loadUserEdit(scope.row.username)" class="setting_button" style="margin-top: 5px">Изменить</el-button>
            <el-button v-if="!scope.row.disabled" @click="blockUser(scope.row.username)" class="setting_button" style="margin-top: 5px" type="danger">Заблокировать</el-button>
            <el-button v-else @click="unblockUser(scope.row.username)" class="setting_button" style="margin-top: 5px" type="danger">Разблокировать</el-button>
            <!-- <el-button class="setting_button" style="margin-top: 5px" type="danger">Удалить</el-button> !-->
          </div>
        </el-popover>
      </template>
    </el-table-column>
  </el-table>
  <UserInfoEdit :user="user" :roles="roles" :reload="reload" ref="childComponentRef"/>
</template>

<style scoped>
.clickable{
  transition: 0.2s;
  display: block;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.clickable:hover{
  transition: 0.2s;
  color: #409EFF;
}

.settings {
  display: flex;
  flex-direction: column;
}

.crp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px !important;
  font-family: 'Roboto', sans-serif;
}

.el-button.setting_button {
  padding: 0;
  margin: 0;
}

.selectable {
  height: 40px;
  line-height: 40px;
  transition: 0.2s;
}

.project {
  display: inline-block;
  vertical-align: middle;
  line-height: inherit;
  padding-left: 10px;
  width: 260px;
  cursor: pointer;
}

.selectable:hover {
  transition: 0.2s;
  background-color: #393939;
}
</style>