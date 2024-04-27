<script setup>
import {onMounted, ref, computed} from "vue";
import {Close, MoreFilled, Plus, Search, Tickets} from "@element-plus/icons-vue";
import router from "@/router";
import taskApi from "@/api/taskApi";
import TaskStatus from "@/components/task/TaskStatus.vue";
import TaskInfoEdit from "@/components/task/TaskInfoEdit.vue";
import {throwSuccess} from "@/config/notifications";

let props = defineProps({
  projectId: String
})

let tasks = ref([])
let loading = ref(true)
const drawer = ref(false)
const visible = ref(false)
const newTaskName = ref('')

const search = ref('')

let task = ref(null);
const childComponentRef = ref()
const loadTask = (id) => {
  childComponentRef.value.open()
  getTask(id)
}

const filterTableData = computed(() =>
    tasks.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const getTask = async (id) => {
  task.value = await taskApi.getTask(id);
  loading.value = false;
}

const reload = async () => {
  await getTasks()
  task.value = await taskApi.getTask(task.value.id);
}

const getTasks = async () => {
  if (props.projectId) {
    await taskApi.getTasksByProject(props.projectId).then((value) => {
      tasks.value = value
      loading.value = false
    })
  } else {
    await taskApi.getTasks().then((value) => {
      tasks.value = value
      loading.value = false
    })
  }
}

const addTask = async () => {
  await taskApi.addTask(newTaskName.value, props.projectId).then(() => {
    getTasks()
    newTaskName.value = ''
    visible.value = false
  })
}

const taskInfo = (id) => {
  router.push(`/task/${id}`)
}

onMounted(() => {
  getTasks()
})
</script>

<template>
  <el-input :prefix-icon="Search" v-model="search" style="width: 400px" placeholder="Поиск" />
  <el-table v-loading="loading" :data="filterTableData" style="width: 100%">
    <el-table-column sortable prop="name" label="Задача" width="284">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="loadTask(scope.row.id)"> <!-- Клик на проект -->
          <el-icon><Tickets /></el-icon>
          <span style="margin-left: 10px"> {{scope.row.name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column sortable prop="" label="Группа" width="150"/>
    <el-table-column prop="" label="Статус" width="134">
      <template #default="scope">
        <TaskStatus/>
      </template>
    </el-table-column>
    <el-table-column prop="assignee" label="Исполнитель" width="180"/>
    <el-table-column sortable prop="startDate" label="Дата начала" width="180">
      <template #default="scope">
        <el-date-picker
            style="width: 120px"
            format="DD.MM.YYYY"
            readonly
            v-model="scope.row.startDate"
            type="date"
        />
      </template>
    </el-table-column>
    <el-table-column sortable prop="deadline" label="Дата завершения" width="176">
      <template #default="scope">
        <el-date-picker
            style="width: 120px"
            format="DD.MM.YYYY"
            readonly
            v-model="scope.row.deadline"
            type="date"
        />
      </template>
    </el-table-column>
    <el-table-column fixed="right" width="60">
      <template #header>
        <el-popover :visible="visible" placement="left-start" :width="300"> <!-- Создание проекта -->
          <header class="crp-header">
            <h3 style="margin: 0">Создать задачу</h3>
            <el-button style="width: 32px" text @click="visible = false"><el-icon><Close/></el-icon></el-button>
          </header>
          <el-input v-model="newTaskName" style="margin-bottom: 10px" type="text" placeholder="Название задачи"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button :disabled="!newTaskName" type="primary" @click="addTask"
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
          <el-button @click="loadTask(scope.row.id)" class="setting_button">Подробнее</el-button>
          <el-button class="setting_button" style="margin-top: 5px">Изменить</el-button>
          <el-button class="setting_button" style="margin-top: 5px" type="danger">Удалить из проекта</el-button>
        </div>

      </el-popover>
      </template>
    </el-table-column>
  </el-table>
  <TaskInfoEdit :task="task" :reload="reload" ref="childComponentRef"/>
</template>

<style scoped>
.crp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px !important;
  font-family: 'Roboto', sans-serif;
}

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

.el-button.setting_button {
  padding: 0;
  margin: 0;
}
</style>