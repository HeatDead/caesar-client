<script setup>
import {computed, onMounted} from "vue";
import axios from "axios";
import {ref} from "vue";
import router from "@/router";
import {Close, DataBoard, MoreFilled, Plus, Search} from "@element-plus/icons-vue";
import taskApi from "@/api/taskApi";
import deskApi from "@/api/deskApi";
import {useAuthStore} from "@/stores/user";
import projectApi from "@/api/projectApi";
let desks = ref([])
let loading = ref(true)

const search = ref('')

const projects = ref()

const visible = ref(false)
const visibleEdit = ref(false)

const editDesk = ref({
  id: null,
  name: ''
})

let desk = ref(null);
const childComponentRef = ref()

const newDeskName = ref('')
const newDesksProject = ref()
const loadDesk = (id) => {
  childComponentRef.value.open()
  getDesk(id)
}

const filterTableData = computed(() =>
    desks.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const startEdit = (desk) => {
  editDesk.value.id = desk.id
  editDesk.value.name = desk.name
  visibleEdit.value = true
}

const getProjects = async () => {
  projects.value = await projectApi.getProjects();
}

const saveEdit = async () => {
  visibleEdit.value = false
  await deskApi.editDesk(editDesk.value)
  await getDesks()
}

const getDesk = async (id) => {
  desk.value = await taskApi.getTask(id);
  loading.value = false;
}

const getDesks = async () => {
    await deskApi.getDesks().then((value) => {
      desks.value = value
      loading.value = false
    })
}

const addDesk = async () => {
  await deskApi.addDesk(newDeskName.value, newDesksProject.value).then(() => {
    visible.value = false
    getDesks()
    newDeskName.value = ''
    newDesksProject.value = null
  })
}

const toDesk = (desk) => {
  router.push(`/desk/${desk.id}`)
}

const deleteDesk = async (id) => {
  await deskApi.deleteDesk(id)
  await getDesks()
}

onMounted(() => {
  getDesks()
  getProjects()
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Caesar</el-breadcrumb-item>
    <el-breadcrumb-item>Доски задач</el-breadcrumb-item>
  </el-breadcrumb>
  <h2>Доски задач</h2>
  <el-input :prefix-icon="Search" v-model="search" style="width: 400px" placeholder="Поиск" />
  <el-table table-layout="auto" height="540" v-loading="loading" :data="filterTableData" style="width: 100%">
    <template #empty>
      <div class="flex items-center justify-center h-100%">
        <el-empty description="Нет данных"/>
      </div>
    </template>
    <el-table-column sortable prop="name" label="Название" width="600">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="toDesk(scope.row)"> <!-- Клик на проект -->
          <el-icon><DataBoard /></el-icon>
          <span style="margin-left: 10px"> {{scope.row.name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column sortable prop="projectEntity.name" label="Проект"/>
    <el-table-column sortable prop="id" label="ID"/>
    <el-table-column fixed="right" width="60">
      <template #header>
        <el-popover :visible="visible" placement="left-start" :width="300"> <!-- Создание проекта -->
          <header class="crp-header">
            <h3 style="margin: 0">Создать доску</h3>
            <el-button style="width: 32px" text @click="visible = false"><el-icon><Close/></el-icon></el-button>
          </header>
          <el-input minlength="2" maxlength="25" show-word-limit v-model="newDeskName" style="margin-bottom: 10px" type="text" placeholder="Название доски"></el-input>
          <el-select
              v-model="newDesksProject"
              placeholder="Проект"
              style="width: 274px; margin-bottom: 10px"
          >
            <el-option
                v-for="project in projects"
                :key="project.id"
                :label="project.name"
                :value="project.id"
            />
          </el-select>
          <div style="text-align: right; margin: 0">
            <el-button :disabled="!newDeskName || newDeskName.length < 2 || !newDesksProject" type="primary" @click="addDesk"
            >Создать</el-button>
          </div>
          <template #reference>
            <el-button v-if="useAuthStore().checkPermission('DESK_CREATE')" @click="visible = true" class="button" type="success" style="width: 35px" text bg><el-icon><Plus/></el-icon></el-button>
          </template>
        </el-popover>
      </template>
      <template #default="scope">
        <el-popover placement="right-start" :width="250" trigger="click">
          <template #reference>
            <el-button style="width: 35px" bg text><el-icon><MoreFilled/></el-icon></el-button>
          </template>
          <div class="settings">
            <el-button @click="toDesk(scope.row)" class="setting_button">Подробнее</el-button>
            <el-popover :visible="visibleEdit" placement="right-start" :width="250" trigger="click">
              <template #reference>
                <el-button v-if="useAuthStore().checkPermission('DESK_UPDATE')" @click="startEdit(scope.row)" class="setting_button" style="margin-top: 5px">Изменить название</el-button>
              </template>
              <header class="crp-header">
                <h3 style="margin: 0">Изменить название</h3>
              </header>
              <el-input v-model="editDesk.name" style="margin-bottom: 10px" type="text" placeholder="Название доски"></el-input>
              <div style="text-align: right; margin: 0">
                <el-button :disabled="!editDesk.name" type="primary" @click="saveEdit"
                >Сохранить</el-button>
              </div>
            </el-popover>
            <el-button v-if="useAuthStore().checkPermission('DESK_DELETE')" @click="deleteDesk(scope.row.id)" class="setting_button" style="margin-top: 5px" type="danger">Удалить из проекта</el-button>
          </div>

        </el-popover>
      </template>
    </el-table-column>
  </el-table>
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