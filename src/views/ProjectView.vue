<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import projectApi from "@/api/projectApi";
import {Collection, Edit, Plus, SemiSelect} from "@element-plus/icons-vue";
import router from "@/router";
import ProjectStatus from "@/components/project/ProjectStatus.vue";

const route = useRoute()
const id = route.params.id;
let project = ref(null)
let loading = ref(true)

const activeName = ref('about')

const getProject = async () => {
  project.value = await projectApi.getProject(id)
  loading.value = false;
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

onMounted(() => {
  tabCheck()
  getProject()
})
</script>

<template>
  <el-breadcrumb separator="/">
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
            <p class="description">{{project.description}}</p>
            <el-button class="button" style="width: 32px; margin-right: 10px" text bg><el-icon><Edit/></el-icon></el-button>
            <el-card class="box-card">
              <div class="box-item">
                <span>Статус</span>
                <span class="item-value"><ProjectStatus/></span>
              </div>
              <div class="box-item">
                <span>Дата начала</span>
                <span class="item-value"><el-icon><SemiSelect/></el-icon></span>
              </div>
              <div class="box-item">
                <span>Дедлайн</span>
                <span class="item-value"><el-icon><SemiSelect/></el-icon></span>
              </div>
              <div class="box-item">
                <span>Автор</span>
                <span class="item-value"><el-icon><SemiSelect/></el-icon></span>
              </div>
              <div class="box-item">
                <span>Ответственный</span>
                <span class="item-value"><el-icon><SemiSelect/></el-icon></span>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Список задач" name="tasks"><RouterView :project-id="id"/></el-tab-pane>
        <el-tab-pane label="Доски задач" name="desks"><RouterView :project-id="id"/></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.name_change {
  width: auto;
}

.box-card {
  width: 520px;
  height: 250px;
}

.box-item {
  display: flex;
  margin-bottom: 25px;
  justify-content: space-between;
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