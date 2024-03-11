<script setup>
import {ArrowDownBold, Close, MoreFilled, Plus} from "@element-plus/icons-vue";
import TaskStatus from "@/components/task/TaskStatus.vue";
import {onMounted, ref} from "vue";
import deskApi from "@/api/deskApi";
import {useRoute} from "vue-router";
import taskF from "@/api/taskApi";
import projectApi from "@/api/projectApi";
import taskApi from "@/api/taskApi";

const route = useRoute()
const id = route.params.deskId;
const pjId = route.params.projectId;
const project = ref()
const desk = ref()
const projectId = ref()
let panels = ref()

const loading = ref(true)

const newPanelName = ref('');

const newPanelVisible = ref(false)

let tasks = ref([])

const options = ref([])

const getPanels = async () => {
  await deskApi.getPanelsByDesk(id).then((value) => {
    panels.value = value
    loading.value = false

    panels.value.forEach((panel) => {
      panel.addTaskVisible = false
      panel.addTaskSelected = null
      panel.addTab = 'ex'
      panel.newTaskName = ''
    })
  })
}

const getDesk = async () => {
  await deskApi.getDesk(id).then((value) => {
    desk.value = value
    projectId.value = desk.value.projectEntity.id
    getTasks()
  })
}

const getTasks = async () => {
  await taskF.getTasksByProject(projectId.value).then((value) => {
    tasks.value = value
    options.value = Array.from({ length: tasks.value.length }).map((_, idx) => ({
      value: `${tasks.value[idx].id}`,
      label: `${tasks.value[idx].name}`,
    }))
  })
}

const getProject = async () => {
  project.value = await projectApi.getProject(pjId)
}

const addPanel = async () => {
  await deskApi.addPanel(newPanelName.value, id).then(() => {
    getPanels()
    newPanelVisible.value = false
    newPanelName.value = ''
  })
}

const addTask = async (panelId, taskId) => {
  await deskApi.addTaskToPanel(panelId, taskId).then(() => {
    getPanels()
  })
}

const addTaskToPanel = async (taskName, projectId, panelId) => {
  await taskApi.addTaskToPanel(taskName, projectId, panelId).then(() => {
    getPanels()
  })
}

const removeFromPanel = (panelId, taskId) => {
  deskApi.removeTaskFromPanel(panelId, taskId).then(() => {
    getPanels()
  })
}

const startDrag = (evt, panelId, taskId) => {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('taskId', taskId)
  evt.dataTransfer.setData('panelId', panelId)
}

const onDrop = (evt, panelId) => {
  const taskId = evt.dataTransfer.getData('taskId')
  const sPanelId = evt.dataTransfer.getData('panelId')
  deskApi.removeTaskFromPanel(sPanelId, taskId).then(() => {
    deskApi.addTaskToPanel(panelId, taskId).then(() => {
      getPanels()
    })
  })
}

onMounted(() => {
  getDesk()
  getPanels()
  if (pjId)
    getProject()
})
</script>

<template>
  <el-breadcrumb v-if="pjId" separator="/">
    <el-breadcrumb-item :to="{ path: '/projects/list' }">Проекты</el-breadcrumb-item>
    <el-breadcrumb-item v-if="project" :to="{ path: `/projects/${pjId}/desks` }">{{project.name}}</el-breadcrumb-item>
    <el-breadcrumb-item><a v-if="desk">{{desk.name}}</a></el-breadcrumb-item>
  </el-breadcrumb>
  <el-breadcrumb v-else separator="/">
    <el-breadcrumb-item :to="{ path: '/desks' }">Доски задач</el-breadcrumb-item>
    <el-breadcrumb-item><a v-if="desk">{{desk.name}}</a></el-breadcrumb-item>
  </el-breadcrumb>
  <div v-if="desk">
    <h2>{{desk.name}}</h2>
    <div class="desk">
      <el-card v-for="panel in panels" class="box-card"> <!-- Панели -->
        <template #header>
          <div class="card-header">
            <span class="task-name">{{panel.name}}</span>
            <div>
              <el-popover :visible="panel.addTaskVisible" placement="left-start" :width="300"> <!-- Создание проекта -->
                <header class="crp-header">
                  <h3 style="margin: 0">Добавить задачу</h3>
                  <el-button style="width: 32px" text @click="panel.addTaskVisible = false; panel.addTaskSelected = null"><el-icon><Close/></el-icon></el-button>
                </header>
                <el-radio-group v-model="panel.addTab" style="margin-bottom: 10px">
                  <el-radio-button label="ex">Существующая</el-radio-button>
                  <el-radio-button @click="panel.addTaskSelected = null" label="new">Новая</el-radio-button>
                </el-radio-group>
                <div v-if="panel.addTab === 'ex'">
                  <el-select-v2
                      v-model="panel.addTaskSelected"
                      filterable
                      :options="options"
                      placeholder="Название задачи"
                      style="margin-bottom: 10px; width: 100%"
                  />
                  <div style="text-align: right; margin: 0">
                    <el-button :disabled="!panel.addTaskSelected" type="primary" @click="addTask(panel.id, panel.addTaskSelected)"
                    >Добавить</el-button>
                  </div>
                </div>
                <div v-else>
                  <el-input v-model="panel.newTaskName" style="margin-bottom: 10px" type="text" placeholder="Название задачи"></el-input>
                  <div style="text-align: right; margin: 0">
                    <el-button :disabled="!panel.newTaskName" type="primary" @click="addTaskToPanel(panel.newTaskName, pjId, panel.id)"
                    >Создать и добавить</el-button>
                  </div>
                </div>
                <template #reference>
                  <el-button @click="panel.addTaskVisible = true" class="button" type="success" style="width: 35px" text><el-icon><Plus/></el-icon></el-button>
                </template>
              </el-popover>
              <el-button class="button" style="width: 35px; margin-left: 5px" text><el-icon><MoreFilled/></el-icon></el-button>
            </div>
          </div>
        </template>
        <div class="panel-items drop-zone"  @drop="onDrop($event, panel.id)" @dragover.prevent
             @dragenter.prevent>
          <el-card v-for="task in panel.tasks" :key="task" class="text item drag-el" draggable="true" @dragstart="startDrag($event, panel.id, task.id)">  <!-- Задачи -->
            <div class="card-header" style="margin-bottom: 5px">
              <span class="task-name" style="margin-top: 0">{{task.name}}</span>
              <el-popover placement="right-start" :width="250" trigger="click">
                <template #reference>
                  <el-button class="button" style="width: 35px" text><el-icon><MoreFilled/></el-icon></el-button>
                </template>
                <div class="settings">
                  <el-button @click="loadTask(task.id)" class="setting_button">Подробнее</el-button>
                  <el-button class="setting_button" style="margin-top: 5px">Изменить</el-button>
                  <el-button @click="removeFromPanel(panel.id, task.id)" class="setting_button" style="margin-top: 5px" type="danger">Удалить с панели</el-button>
                  <el-button class="setting_button" style="margin-top: 5px" type="danger">Удалить из проекта</el-button>
                </div>

              </el-popover>
            </div>
            <TaskStatus/>
          </el-card>
          <el-icon class="more-arrow" v-if="panel.tasks.length > 4"><ArrowDownBold/></el-icon>
        </div>
      </el-card>
      <el-popover :visible="newPanelVisible" placement="left-start" :width="300"> <!-- Создание панели -->
        <header class="crp-header">
          <h3 style="margin: 0">Создать панель</h3>
          <el-button style="width: 32px" text @click="newPanelVisible = false"><el-icon><Close/></el-icon></el-button>
        </header>
        <el-input v-model="newPanelName" style="margin-bottom: 10px" type="text" placeholder="Название панели"></el-input>
        <div style="text-align: right; margin: 0">
          <el-button :disabled="!newPanelName" type="primary" @click="addPanel"
          >Создать</el-button>
        </div>
        <template #reference>
          <el-button @click="newPanelVisible = true" class="button" type="success" style="width: 35px" text bg><el-icon><Plus/></el-icon></el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style scoped>
.crp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px !important;
  font-family: 'Roboto', sans-serif;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-arrow {
  position: absolute;
  bottom: 10px;
  width: 340px;
}

.text {
  font-size: 14px;
}

.task-name {
  font-weight: bold;
  font-size: 18px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  position: relative;
  min-width: 380px;
  height: 590px;
}

.panel-items {
  overflow: scroll;
  height: 490px;
}

.desk {
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: scroll;
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