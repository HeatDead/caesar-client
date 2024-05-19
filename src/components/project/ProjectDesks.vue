<script setup>
import {onMounted, ref, computed} from "vue";
import {
  Close,
  DataBoard,
  MoreFilled,
  Plus,
  Search,
} from "@element-plus/icons-vue";
import router from "@/router";
import taskApi from "@/api/taskApi";
import TaskInfoEdit from "@/components/task/TaskInfoEdit.vue";
import deskApi from "@/api/deskApi";

let props = defineProps({
  projectId: String
})

let desks = ref([])
let loading = ref(true)

const editDesk = ref({
  id: null,
  name: ''
})

const search = ref('')

const visible = ref(false)
const visibleEdit = ref(false)

let desk = ref(null);
const childComponentRef = ref()

const newDeskName = ref('')
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
  if (props.projectId) {
    await deskApi.getDesksByProject(props.projectId).then((value) => {
      desks.value = value
      loading.value = false
    })
  } else {
    await deskApi.getDesks().then((value) => {
      desks.value = value
      loading.value = false
    })
  }
}

const addDesk = async () => {
  await deskApi.addDesk(newDeskName.value, props.projectId).then(() => {
    visible.value = false
    getDesks()
    newDeskName.value = ''
  })
}

const toDesk = (id) => {
  router.push(`/projects/${props.projectId}/desk/${id}`)
}

onMounted(() => {
  getDesks()
})
</script>

<template>
  <el-input :prefix-icon="Search" v-model="search" style="width: 400px" placeholder="Поиск" />
  <el-table table-layout="auto" height="540" v-loading="loading" :data="filterTableData" style="width: 100%">
    <template #empty>
      <div class="flex items-center justify-center h-100%">
        <el-empty />
      </div>
    </template>
    <el-table-column sortable prop="name" label="Название" min-width="600">
      <template #default="scope">
        <div style="display: flex; align-items: center" class="clickable" @click="toDesk(scope.row.id)"> <!-- Клик на проект -->
          <el-icon><DataBoard /></el-icon>
          <span style="margin-left: 10px"> {{scope.row.name}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column sortable prop="id" label="ID" width="180"/>
    <el-table-column fixed="right" width="60">
      <template #header>
        <el-popover :visible="visible" placement="left-start" :width="300"> <!-- Создание проекта -->
          <header class="crp-header">
            <h3 style="margin: 0">Создать доску</h3>
            <el-button style="width: 32px" text @click="visible = false"><el-icon><Close/></el-icon></el-button>
          </header>
          <el-input v-model="newDeskName" style="margin-bottom: 10px" type="text" placeholder="Название доски"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button :disabled="!newDeskName" type="primary" @click="addDesk"
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
            <el-button @click="toDesk(scope.row.id)" class="setting_button">Подробнее</el-button>
            <el-popover :visible="visibleEdit" placement="right-start" :width="250" trigger="click">
              <template #reference>
                <el-button @click="startEdit(scope.row)" class="setting_button" style="margin-top: 5px">Изменить название</el-button>
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
            <el-button class="setting_button" style="margin-top: 5px" type="danger">Удалить из проекта</el-button>
          </div>

        </el-popover>
      </template>
    </el-table-column>
  </el-table>
  <TaskInfoEdit :desk="desk" ref="childComponentRef"/>
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