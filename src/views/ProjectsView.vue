<script setup>
import {computed, onMounted} from "vue";
import {ref} from "vue";
import projectF from "../api/projectApi"
import router from "@/router";
import {Close, Collection, MoreFilled, Plus, Search} from "@element-plus/icons-vue";
import ProjectStatus from "@/components/project/ProjectStatus.vue";

let projects = ref([])
const search = ref('')
const visible = ref(false)

const newProjectName = ref('')
const getProjects = async () => {
  projects.value = await projectF.getProjects()
}

const filterTableData = computed(() =>
    projects.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const addProject = () => {
  projectF.addProject(newProjectName.value).then(() => {
    visible.value = false
    newProjectName.value = ''
    getProjects()
  })
}

const toProjectTasks = (id) => {
  router.push('/tasks?project=' + id)
}

const cellClick = (cell) => {
  console.log(cell)
}

onMounted(() => {
  getProjects()
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>Проекты</el-breadcrumb-item>
  </el-breadcrumb>
  <h2>Проекты</h2>
  <el-input :prefix-icon="Search" v-model="search" style="width: 400px" placeholder="Поиск" />
  <el-table :data="filterTableData" style="width: 100%" >
    <el-table-column prop="name" label="Название" width="310">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="router.push('/projects/' + scope.row.id)"> <!-- Клик на проект -->
          <el-icon><Collection /></el-icon>
          <span style="margin-left: 10px"> {{scope.row.name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="" label="Статус" width="134">
      <template #default="scope">
        <ProjectStatus/>
      </template>
    </el-table-column>
    <el-table-column prop="" label="Автор" width="180"/>
    <el-table-column prop="" label="Ответственный" width="180"/>
    <el-table-column prop="" label="Старт" width="150"/>
    <el-table-column prop="" label="Дедлайн" width="150"/>
    <el-table-column fixed="right" width="60">
      <template #header>
        <el-popover :visible="visible" placement="left-start" :width="300"> <!-- Создание проекта -->
          <header class="crp-header">
            <h3 style="margin: 0">Создать проект</h3>
            <el-button style="width: 32px" text @click="visible = false"><el-icon><Close/></el-icon></el-button>
          </header>
          <el-input v-model="newProjectName" style="margin-bottom: 10px" type="text" placeholder="Название проекта"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button :disabled="!newProjectName" type="primary" @click="addProject"
            >Создать</el-button>
          </div>
          <template #reference>
            <el-button @click="visible = true" class="button" type="success" style="width: 35px" text bg><el-icon><Plus/></el-icon></el-button>
          </template>
        </el-popover>
      </template>
      <template #default="scope">
        <el-popover placement="right-start" hide-after="0" :width="250" trigger="click"> <!-- Настройки проекта -->
          <template #reference>
            <el-button style="width: 35px" bg text><el-icon><MoreFilled/></el-icon></el-button>
          </template>
          <div class="settings">
            <el-button @click="router.push('/projects/' + scope.row.id)" class="setting_button">Подробнее</el-button>
            <el-button class="setting_button" style="margin-top: 5px">Изменить</el-button>
            <el-button class="setting_button" style="margin-top: 5px" type="danger">Удалить</el-button>
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