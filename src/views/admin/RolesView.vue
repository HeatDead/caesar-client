<script setup>
import {
  Close,
  DataBoard,
  MoreFilled,
  Plus,
  Search,
    Star
} from "@element-plus/icons-vue";
import {computed, onMounted, ref} from "vue";
import * as userApi from "@/api/userApi";
import RoleInfoEdit from "@/components/admin/role/RoleInfoEdit.vue";
import deskApi from "@/api/deskApi";

let roles = ref()
const role = ref()
const childComponentRef = ref()
const search = ref('')

const newRoleName = ref('')
const visible = ref(false)

const getRoles = async () => {
  await userApi.getRoles().then((data) => {
    roles.value = data;
  })
}

const loadRole = async (id) => {
  role.value = await userApi.getRole(id)
  childComponentRef.value.open()
}

const loadRoleEdit = async (id) => {
  role.value = await userApi.getRole(id)
  childComponentRef.value.openEdit()
}

const reload = async () => {
  await getRoles()
  role.value = await userApi.getRole(role.value.id)
}

const filterTableData = computed(() => {
  if(roles.value)
    return  roles.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
  return null}
)

const addRole = async () => {
  await userApi.addRole(newRoleName.value).then(() => {
    visible.value = false
    getRoles()
    newRoleName.value = ''
  })
}

const deleteRole = async (id) => {
  await userApi.deleteRole(id)
  await getRoles()
}

onMounted(() => {
  getRoles()
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Caesar</el-breadcrumb-item>
    <el-breadcrumb-item>Роли</el-breadcrumb-item>
  </el-breadcrumb>
  <h2>Роли</h2>
  <el-input :prefix-icon="Search" v-model="search" style="width: 400px" placeholder="Поиск" />
  <el-table width="100%" height="600" :data="filterTableData" style="width: 100%">
    <template #empty>
      <div class="flex items-center justify-center h-100%">
        <el-empty description="Нет данных"/>
      </div>
    </template>
    <el-table-column prop="name" label="Название" width="600">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="loadRole(scope.row.id)"> <!-- Клик на проект -->
          <el-icon><Star /></el-icon>
          <span style="margin-left: 10px"> {{scope.row.name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="ID" width="180"/>
    <el-table-column prop="permissions" label="Разрешения" width="324"/>
    <el-table-column fixed="right" width="60">
      <template #header>
        <el-popover :visible="visible" placement="left-start" :width="300"> <!-- Создание проекта -->
          <header class="crp-header">
            <h3 style="margin: 0">Создать роль</h3>
            <el-button style="width: 32px" text @click="visible = false"><el-icon><Close/></el-icon></el-button>
          </header>
          <el-input v-model="newRoleName" style="margin-bottom: 10px" type="text" placeholder="Название роли"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button :disabled="!newRoleName" type="primary" @click="addRole"
            >Создать</el-button>
          </div>
          <template #reference>
            <el-button @click="visible = true" class="button" type="success" style="width: 35px" text bg><el-icon><Plus/></el-icon></el-button>
          </template>
        </el-popover>
      </template>
      <template #default="scope">
        <el-popover placement="right-start" :width="250" trigger="click">
          <template #reference>
            <el-button style="width: 35px" bg text><el-icon><MoreFilled/></el-icon></el-button>
          </template>
          <div class="settings">
            <el-button @click="loadRole(scope.row.id)" class="setting_button">Подробнее</el-button>
            <el-button @click="loadRoleEdit(scope.row.id)" class="setting_button" style="margin-top: 5px">Изменить</el-button>
            <el-button @click="deleteRole(scope.row.id)" class="setting_button" style="margin-top: 5px" type="danger">Удалить из проекта</el-button>
          </div>

        </el-popover>
      </template>
    </el-table-column>
  </el-table>
  <RoleInfoEdit :role="role" :reload="reload" ref="childComponentRef"/>
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

.crp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px !important;
  font-family: 'Roboto', sans-serif;
}

.settings {
  display: flex;
  flex-direction: column;
}

.el-button.setting_button {
  padding: 0;
  margin: 0;
}
</style>