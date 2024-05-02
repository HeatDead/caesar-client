<script setup>
import {Close, DataBoard, Edit, MoreFilled, Plus, SemiSelect, Tools, User} from "@element-plus/icons-vue";
import {ref, defineExpose, computed} from "vue";
import ProjectStatus from "@/components/project/ProjectStatus.vue";
import taskApi from "@/api/taskApi";
import * as userApi from "@/api/userApi";
import TaskStatus from "@/components/task/TaskStatus.vue";
import projectApi from "@/api/projectApi";

const drawer = ref(false)
const edit = ref(false)

const projectUsers = ref('')
const selectedUsers = ref([])
const users = ref()

const visible = ref(false)

const filterTableData = computed(() =>
    desks.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const disabledDate = (time) => {
  return time.getTime() < (Date.now() - 3600 * 1000 * 24)
}

const open = async () => {
  projectApi.getEmployees(props.project.id).then((data) => {
    projectUsers.value = data
    for (let i = 0; i < data.length; i++) {
      selectedUsers.value.push(data[i].username)
    }
  })
  users.value = await userApi.getUsers()
  drawer.value = true
}

const change = async () => {
  await projectApi.addEmployees(props.project.id, selectedUsers.value)
  await update()
}

const update = async () => {
  visible.value = false
  selectedUsers.value = []
  projectApi.getEmployees(props.project.id).then((data) => {
    projectUsers.value = data
    for (let i = 0; i < data.length; i++) {
      selectedUsers.value.push(data[i].username)
    }
  })
}

const updateTask = async () => {
  props.task = await taskApi.getTask(props.task.id);
}

defineExpose({
  open
})

const startEdit = () => {
  edit.value = true
  editTask.value = {...props.task}
}

const cancelEdit = () => {
  edit.value = false;
}

const saveEdit = async () => {
  await taskApi.editTask(editTask.value).then(() => {
    props.reload()
    edit.value = false;
  })
}

let props = defineProps({
  project: Object,
  reload: Function
})

const handleClose = () => {
  console.log(projectUsers.value)
  visible.value = false
  edit.value = false;
  drawer.value = false;
  projectUsers.value = null
}
</script>

<template>
  <el-drawer
      v-model="drawer"
      direction="rtl"
      :before-close="handleClose"
      size="600px"
  >
    <template #header>
      <div style="display: flex">
        <h2 style="color: var(--el-text-color-primary); margin-left: 10px">Сотрудники проекта</h2>
      </div>
    </template>
    <div style="height: 90%">
      <el-table table-layout="auto" height="600" v-loading="loading" :data="projectUsers" style="width: 100%">
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty />
          </div>
        </template>
        <el-table-column sortable prop="surname" label="Сотрудник">
          <template #default="scope">
            <div style="display: flex; align-items: center"> <!-- Клик на проект -->
              <el-icon><User /></el-icon>
              <span style="margin-left: 10px"> {{scope.row.surname}} {{scope.row.name}} {{scope.row.patronymic}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column sortable prop="role.name" label="Роль"/>
        <el-table-column fixed="right" width="60">
          <template #header>
            <el-popover :visible="visible" placement="left-start" :width="325"> <!-- Создание проекта -->
              <header class="crp-header">
                <h3 style="margin: 0">Сотрудники проекта</h3>
                <el-button style="width: 32px" text @click="visible = false"><el-icon><Close/></el-icon></el-button>
              </header>
              <el-select
                  v-model="selectedUsers"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  filterable
                  placeholder="Выберите сотрудников"
                  style="width: 300px"
              >
                <el-option
                    v-for="user in users"
                    :key="user.username"
                    :label="`${user.surname} ${user.name} ${user.patronymic}`"
                    :value="user.username"
                />
              </el-select>
              <div style="text-align: right; margin-top: 10px">
                <el-button type="primary" @click="change"
                >Принять</el-button>
              </div>
              <template #reference>
                <el-button @click="visible = true" class="button" style="width: 35px" text bg><el-icon><Tools/></el-icon></el-button>
              </template>
            </el-popover>
          </template>
          <template #default="scope">
            <el-popover placement="right-start" :width="250" trigger="click">
              <template #reference>
                <el-button style="width: 35px" bg text><el-icon><MoreFilled/></el-icon></el-button>
              </template>
              <div class="settings">
                <el-button @click="toDesk(scope.row.id)" class="setting_button">Подробнее</el-button>
                <el-button class="setting_button" style="margin-top: 5px" type="danger">Убрать с проекта</el-button>
              </div>

            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<style scoped>
.task-buttons {
  margin-top: auto;
  margin-left: auto;
}

.task-container {
  display: flex;
  flex-direction: column;
  height: 95%;
}

.description {
  max-width: 100px;
}

.box-item {
  display: flex;
  margin-bottom: 25px;
  justify-content: space-between;
}

.item-value {
  width: 250px;
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