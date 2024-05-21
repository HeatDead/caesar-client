<script setup>
import {Edit, SemiSelect} from "@element-plus/icons-vue";
import {ref, defineExpose, reactive} from "vue";
import ProjectStatus from "@/components/project/ProjectStatus.vue";
import taskApi from "@/api/taskApi";
import * as userApi from "@/api/userApi";
import projectApi from "@/api/projectApi";

const drawer = ref(false)
const edit = ref(true)

const editProject = ref()
const projectUsers = ref()

const disabledDate = (time) => {
  return time.getTime() < (Date.now() - 3600 * 1000 * 24)
}

const open = async () => {
  drawer.value = true
  edit.value = true
  editProject.value = {...props.project}
  if(editProject.value.responsible)
    editProject.value.responsible = editProject.value.responsible.username
  projectUsers.value = await projectApi.getEmployees(props.project.id)
}

defineExpose({
  open
})

const cancelEdit = () => {
  handleClose()
}

const saveEdit = async () => {
  console.log(editProject.value)
  await projectApi.editProject(editProject.value).then(() => {
    props.reload()
    handleClose()
  })
}

let props = defineProps({
  project: Object,
  role: Object,
  reload: Function
})

const handleClose = () => {
  drawer.value = false;
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
      <div>
        <el-input v-if="editProject" maxlength="25" show-word-limit v-model="editProject.name"
                  style="width: 300px; font-size: 24px; font-weight: bold" size="large"></el-input>
      </div>
    </template>
    <div>
      <el-input style="padding-bottom: 25px" placeholder="Описание" maxlength="4096" show-word-limit v-if="edit" type="textarea" v-model="editProject.description" :autosize="{ minRows: 5 }" resize="none"></el-input>
    </div>
    <div v-if="project" class="container">
      <el-divider/>
      <div class="task-container">
        <div class="box-item">
          <span>Статус</span>
          <span class="item-value"><el-select v-model="editProject.status" style="width: 220px">
              <el-option
                  key="NEW"
                  label="Новый"
                  value="NEW"/>
              <el-option
                  key="IN_WORK"
                  label="В работе"
                  value="IN_WORK"/>
              <el-option
                  key="COMPLETED"
                  label="Завершен"
                  value="COMPLETED"/>
              <el-option
                  key="CANCELED"
                  label="Отменен"
                  value="CANCELED"/>
            </el-select></span>
        </div>
        <div class="box-item">
          <span>Дата начала</span>
          <span class="item-value">
                          <el-date-picker
                              v-model="editProject.startDate"
                              type="date"
                              format="DD.MM.YYYY"
                              placeholder="Выберете дату начала"
                              :disabled-date="disabledDate"
                              size="default"
                          />
            </span>
        </div>
        <div class="box-item">
          <span>Дедлайн</span>
          <span class="item-value">
                          <el-date-picker
                              v-model="editProject.deadline"
                              type="date"
                              placeholder="Выберете дату дедлайна"
                              format="DD.MM.YYYY"
                              :disabled-date="disabledDate"
                              size="default"
                          />
            </span>
        </div>
        <div class="box-item">
          <span>Ответственный</span>
          <span class="item-value">
            <el-select
                v-model="editProject.responsible"
                clearable
                placeholder="Ответственный"
                style="width: 220px"
            >
              <el-option
                  v-for="user in projectUsers"
                  :key="user.username"
                  :label="`${user.surname} ${user.name} ${user.patronymic}`"
                  :value="user.username"
              />
            </el-select>
          </span>
        </div>
        <div v-if="edit" class="task-buttons">
          <el-button :disabled="editProject.name.length < 4" @click="saveEdit">Изменить</el-button>
          <el-button @click="cancelEdit" type="danger">Отмена</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped>
@import "@/assets/infoEdit.css";
</style>