<script setup>
import {Edit, SemiSelect} from "@element-plus/icons-vue";
import {ref, defineExpose} from "vue";
import ProjectStatus from "@/components/project/ProjectStatus.vue";
import taskApi from "@/api/taskApi";
import TaskStatus from "@/components/task/TaskStatus.vue";
import UserPanel from "@/components/UserPanel.vue";

const drawer = ref(false)
const edit = ref(false)

const editTask = ref()

const disabledDate = (time) => {
  return time.getTime() < (Date.now() - 3600 * 1000 * 24)
}

const open = () => {
  drawer.value = true
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
  task: Object,
  reload: Function
})

const handleClose = () => {
  edit.value = false;
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
      <div v-if="!edit" style="display: flex">
        <el-button @click="startEdit" type="info" class="w-20" link>
          <el-icon>
            <Edit/>
          </el-icon>
        </el-button>
        <h2 v-if="task" style="color: var(--el-text-color-primary); margin-left: 10px">{{ task.name }}</h2>
      </div>
      <div v-else>
        <el-input maxlength="25" show-word-limit v-model="editTask.name"
                  style="width: 300px; font-size: 24px; font-weight: bold" size="large"></el-input>
      </div>
    </template>
    <div v-if="task" style="height: 90%">
      <div>
        <el-input style="padding-bottom: 25px" placeholder="Описание" maxlength="2048" show-word-limit v-if="edit"
                  type="textarea" v-model="editTask.description" :autosize="{ minRows: 5 }" resize="none"></el-input>
        <el-input v-else type="textarea" placeholder="Описание" v-model="task.description" :autosize="{ minRows: 5 }"
                  resize="none" readonly></el-input>
      </div>
      <el-divider/>
      <div class="task-container">
        <div>
          <div class="box-item">
            <span>Статус</span>
            <span v-if="!edit" class="item-value"><TaskStatus :status="task.status"/></span>
            <span v-else class="item-value"><el-select v-model="editTask.status" style="width: 220px">
              <el-option
                  type="primary"
                  key="OPENED"
                  label="Открыт"
                  value="OPENED"/>
              <el-option
                  key="IN_WORK"
                  label="В работе"
                  value="IN_WORK"/>
              <el-option
                  key="COMPLETED"
                  label="Завершен"
                  value="COMPLETED"/>
              <el-option
                  key="NEED_INFO"
                  label="Нужна информация"
                  value="NEED_INFO"/>
              <el-option
                  key="CANCELED"
                  label="Отменен"
                  value="CANCELED"/>
            </el-select></span>
          </div>
          <div class="box-item">
            <span>Тип</span>
            <span v-if="!edit" class="item-value"><el-icon><SemiSelect/></el-icon></span>
            <span v-else class="item-value"><el-select style="width: 220px"></el-select></span>
          </div>
          <div class="box-item">
            <span>Дата начала</span>
            <span v-if="!edit" class="item-value">
              <el-icon v-if="!task.startDate"><SemiSelect/></el-icon>
              <span v-else>                          <el-date-picker
                  readonly
                  v-model="task.startDate"
                  type="date"
                  format="DD.MM.YYYY"
                  placeholder="Выберете дату начала"
                  :disabled-date="disabledDate"
                  size="default"
              /></span>
            </span>
            <span v-else class="item-value">
                          <el-date-picker
                              v-model="editTask.startDate"
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
            <span v-if="!edit" class="item-value">
              <el-icon v-if="!task.deadline"><SemiSelect/></el-icon>
              <span v-else>                          <el-date-picker
                  readonly
                  v-model="task.deadline"
                  type="date"
                  placeholder="Выберете дату дедлайна"
                  format="DD.MM.YYYY"
                  :disabled-date="disabledDate"
                  size="default"
              /></span>
            </span>
            <span v-else class="item-value">
                          <el-date-picker
                              v-model="editTask.deadline"
                              type="date"
                              placeholder="Выберете дату дедлайна"
                              format="DD.MM.YYYY"
                              :disabled-date="disabledDate"
                              size="default"
                          />
            </span>
          </div>
          <div class="box-item">
            <span>Автор</span>
            <span class="item-value">
              <el-icon v-if="!task.author"><SemiSelect/></el-icon>
              <span v-else><UserPanel :name="`${task.author.surname} ${task.author.name} ${task.author.patronymic}`"/></span>
            </span>
          </div>
          <div class="box-item">
            <span>Исполнитель</span>
            <span class="item-value">
                            <el-icon v-if="!task.assignee"><SemiSelect/></el-icon>
                  <span v-else>{{ task.assignee.username }}</span>
            </span>
          </div>
          <div class="box-item">
            <span>Проект</span>
            <span class="item-value">{{ task.projectEntity.name }}</span>
          </div>
          <div class="box-item">
            <span>Доски</span>
            <span class="item-value"><el-icon><SemiSelect/></el-icon></span>
          </div>
        </div>
        <div v-if="edit" class="task-buttons">
          <el-button @click="saveEdit">Изменить</el-button>
          <el-button @click="cancelEdit" type="danger">Отмена</el-button>
        </div>
      </div>
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
  margin-bottom: 15px;
  justify-content: space-between;
  align-items: center;
  height: 32px;
}

.item-value {
  width: 250px;
}

.user-name {
  max-width: 210px;
}

.base {
  width: 220px;
}
</style>