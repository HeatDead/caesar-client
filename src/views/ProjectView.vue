<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import projectApi from "@/api/projectApi";
import {Collection, DataAnalysis, Edit, Plus, SemiSelect, User} from "@element-plus/icons-vue";
import router from "@/router";
import ProjectStatus from "@/components/project/ProjectStatus.vue";
import RoleInfoEdit from "@/components/admin/role/RoleInfoEdit.vue";
import ProjectInfoEdit from "@/components/project/ProjectInfoEdit.vue";
import * as userApi from "@/api/userApi";
import ProjectEmployees from "@/components/project/ProjectEmployees.vue";
import UserPanel from "@/components/UserPanel.vue";

const route = useRoute()
const id = route.params.id;
let project = ref(null)
let loading = ref(true)

const childComponentRef = ref()
const employeesComponentRef = ref()

const activeName = ref('about')

const getProject = async () => {
  project.value = await projectApi.getProject(id)
  loading.value = false;
}

const loadEmployees = () => {
  employeesComponentRef.value.open()
}

const loadProject = async () => {
  childComponentRef.value.open()
}

const handleClick = (tab, event) => {
  if(tab.props.name === "about")
    router.push(`/projects/${id}`)
  else router.push(`/projects/${id}/${tab.props.name}`)
}

const tabCheck = () => {
  if(route.path.endsWith("tasks"))
    activeName.value = "tasks"
  if(route.path.endsWith("desks"))
    activeName.value = "desks"
}

const reload = async () => {
  await getProject()
}

onMounted(() => {
  tabCheck()
  getProject()
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Caesar</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/projects/list' }">Проекты</el-breadcrumb-item>
    <el-breadcrumb-item><a v-if="project">{{project.name}}</a></el-breadcrumb-item>
  </el-breadcrumb>
  <div v-loading="loading">
    <div v-if="project">
      <h2 style="display: flex; align-items: center"><el-icon><Collection /></el-icon>
        <span
          style="margin-left: 10px"
        >{{project.name}}</span></h2>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="О проекте" name="about">
          <div class="about">
            <el-input style="margin-right: 10px" placeholder="Описание" type="textarea" v-model="project.description" :autosize="{ minRows: 11 }" resize="none" readonly></el-input>
            <div class="options">
              <el-button @click="loadProject" class="button" style="width: 32px" text bg><el-icon><Edit/></el-icon></el-button>
              <el-button @click="loadEmployees" class="button" style="width: 32px; margin-left: 0; margin-top: 8px" text bg><el-icon><user/></el-icon></el-button>
              <el-button class="button" style="width: 32px; margin-left: 0; margin-top: 8px" text bg><el-icon><DataAnalysis/></el-icon></el-button>
            </div>
            <el-card class="box-card">
              <div class="box-item">
                <span>Статус</span>
                <span class="item-value"><ProjectStatus :status="project.status"/></span>
              </div>
              <div class="box-item">
                <span>Дата начала</span>
                <span class="item-value">
                  <el-icon v-if="!project.startDate"><SemiSelect/></el-icon>
              <span v-else>                          <el-date-picker
                  style="width: 150px"
                  readonly
                  v-model="project.startDate"
                  type="date"
                  format="DD.MM.YYYY"
                  size="default"
              /></span>
                </span>
              </div>
              <div class="box-item">
                <span>Дедлайн</span>
                <span class="item-value">
                  <el-icon v-if="!project.deadline"><SemiSelect/></el-icon>
              <span v-else>                          <el-date-picker
                  style="width: 150px"
                  readonly
                  v-model="project.deadline"
                  type="date"
                  format="DD.MM.YYYY"
                  size="default"
              /></span>
                </span>
              </div>
              <div class="box-item">
                <span>Автор</span>
                <span class="item-value">
                  <el-icon v-if="!project.author.username"><SemiSelect/></el-icon>
                  <span v-else> <UserPanel :name="`${project.author.surname} ${project.author.name} ${project.author.patronymic}`"/></span>
                </span>
              </div>
              <div style="margin-bottom: 0" class="box-item">
                <span>Ответственный</span>
                <span class="item-value">
                  <el-icon v-if="!project.responsible"><SemiSelect/></el-icon>
                  <span v-else> <UserPanel :name="`${project.responsible.surname} ${project.responsible.name} ${project.responsible.patronymic}`"/></span>
                </span>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Список задач" name="tasks"><RouterView :project-id="id"/></el-tab-pane>
        <el-tab-pane label="Доски задач" name="desks"><RouterView :project-id="id"/></el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <ProjectInfoEdit :project="project" :reload="reload" ref="childComponentRef"/>
  <ProjectEmployees :project="project" :reload="reload" ref="employeesComponentRef"/>
</template>

<style scoped>
.name_change {
  width: auto;
}

.box-card {
  width: 520px;
  height: fit-content;
}

.box-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  align-items: center;
  height: 32px;
}

.options {
  display: flex;
  flex-direction: column;
  margin-right: 10px
}

.item-value {
  width: 150px;
}

.description {
  width: 100%;
}

.about {
  display: flex;
}
</style>