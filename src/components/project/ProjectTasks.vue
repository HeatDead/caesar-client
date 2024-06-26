<script setup>
import {onMounted, ref, computed} from "vue";
import {
  ArrowDown, ArrowDownBold,
  ArrowUpBold,
  Close,
  MoreFilled,
  Plus,
  Search,
  SemiSelect,
  Tickets,
  WarningFilled
} from "@element-plus/icons-vue";
import router from "@/router";
import taskApi from "@/api/taskApi";
import TaskStatus from "@/components/task/TaskStatus.vue";
import TaskInfoEdit from "@/components/task/TaskInfoEdit.vue";
import {throwSuccess} from "@/config/notifications";
import {Bug} from '@vicons/tabler'
import UserPanel from "@/components/UserPanel.vue";
import {useAuthStore} from "@/stores/user";

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
const loadTask = async (id) => {
  await getTask(id)
  childComponentRef.value.open()
}

const editTask = async (id) => {
  await getTask(id)
  childComponentRef.value.openEdit()
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

const deleteTask = (id) => {
  taskApi.deleteTask(id).then(() => {
    getTasks()
  })
}

const filterHandler = (
    value,
    row
) => {
  return row.status === value
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
  <el-table v-loading="loading" :data="filterTableData" table-layout="auto" style="width: 100%">
    <template #empty>
      <div class="flex items-center justify-center h-100%">
        <el-empty description="Нет данных"/>
      </div>
    </template>
    <el-table-column min-width="220" sortable prop="name" label="Задача">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="loadTask(scope.row.id)"> <!-- Клик на проект -->
          <el-icon>
            <Tickets v-if="scope.row.type === 'TASK'" />
            <Bug v-if="scope.row.type === 'BUG'" />
          </el-icon>
          <el-icon style="margin-left: 8px">
            <WarningFilled v-if="scope.row.priority === 'BLOCKER'" />
            <ArrowUpBold v-if="scope.row.priority === 'CRITICAL'" />
            <SemiSelect v-if="scope.row.priority === 'AVERAGE'" />
            <ArrowDown v-if="scope.row.priority === 'LOW'" />
            <ArrowDownBold v-if="scope.row.priority === 'MINOR'" />
          </el-icon>
          <span style="margin-left: 10px"> {{scope.row.name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column sortable prop="" label="Группа" width="170">
      <template #default="scope">
        <UserPanel :name="scope.row.group ? scope.row.group.name : ''"/>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="Статус" width="134"
                     :filters="[
                         { text: 'Открыт', value: 'OPENED' },
                         { text: 'В работе', value: 'IN_WORK' },
                         { text: 'Завершен', value: 'COMPLETED' },
                         { text: 'Нужна информация', value: 'NEED_INFO' },
                         { text: 'Отменен', value: 'CANCELED' },]"
                     :filter-method="filterHandler">
      <template #default="scope">
        <TaskStatus :status="scope.row.status"/>
      </template>
    </el-table-column>
    <el-table-column prop="assignee" label="Исполнитель" width="210">
      <template #default="scope">
        <UserPanel :name="scope.row.assignee ? `${scope.row.assignee.surname} ${scope.row.assignee.name} ${scope.row.assignee.patronymic}` : ''"/>
      </template>
    </el-table-column>
    <el-table-column sortable prop="startDate" label="Дата начала" width="150">
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
    <el-table-column sortable prop="deadline" label="Дедлайн" width="150">
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
          <el-input maxlength="25" show-word-limit v-model="newTaskName" style="margin-bottom: 10px" type="text" placeholder="Название задачи"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button :disabled="!newTaskName || newTaskName.length < 4" type="primary" @click="addTask"
            >Создать</el-button>
          </div>
          <template #reference>
            <el-button v-if="useAuthStore().checkPermission('TASK_CREATE')" @click="visible = true" class="button" type="success" style="width: 35px" text bg><el-icon><Plus/></el-icon></el-button>
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
          <el-button v-if="useAuthStore().checkPermission('TASK_UPDATE')" @click="editTask(scope.row.id)" class="setting_button" style="margin-top: 5px">Изменить</el-button>
          <el-button v-if="useAuthStore().checkPermission('TASK_DELETE')" @click="deleteTask(scope.row.id)" class="setting_button" style="margin-top: 5px" type="danger">Удалить из проекта</el-button>
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