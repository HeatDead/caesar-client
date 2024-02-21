<script setup>
import {onMounted, ref, computed} from "vue";
import taskF from "@/api/taskApi";
import {MoreFilled, Plus, Search, Tickets} from "@element-plus/icons-vue";
import router from "@/router";
import taskApi from "@/api/taskApi";
import TaskStatus from "@/components/task/TaskStatus.vue";
import TaskInfoEdit from "@/components/task/TaskInfoEdit.vue";

let props = defineProps({
  projectId: String
})

let tasks = ref([])
let loading = ref(true)
const drawer = ref(false)

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

const getTasks = async () => {
  if (props.projectId) {
    await taskF.getTasksByProject(props.projectId).then((value) => {
      tasks.value = value
      loading.value = false
    })
  } else {
    await taskF.getTasks().then((value) => {
      tasks.value = value
      loading.value = false
    })
  }
}

const taskInfo = (id) => {
  router.push(`/task/${id}`)
}

onMounted(() => {
  getTasks()
})
</script>

<template>
  <el-input :prefix-icon="Search" v-model="search" style="width: 400px" placeholder="Поиск по названию задачи" />
  <el-table v-loading="loading" :data="filterTableData" style="width: 100%">
    <el-table-column prop="name" label="Задача" width="284">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="loadTask(scope.row.id)"> <!-- Клик на проект -->
          <el-icon><Tickets /></el-icon>
          <span style="margin-left: 10px"> {{scope.row.name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="" label="Группа" width="150"/>
    <el-table-column prop="" label="Статус" width="134">
      <template #default="scope">
        <TaskStatus/>
      </template>
    </el-table-column>
    <el-table-column prop="" label="Исполнитель" width="180"/>
    <el-table-column prop="" label="Дата начала" width="180"/>
    <el-table-column prop="" label="Дата завершения" width="176"/>
    <el-table-column fixed="right" width="60">
      <template #header>
        <el-button class="button" type="success" style="width: 35px" text bg><el-icon><Plus/></el-icon></el-button>
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
  <TaskInfoEdit :task="task" ref="childComponentRef"/>
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

.el-button.setting_button {
  padding: 0;
  margin: 0;
}
</style>