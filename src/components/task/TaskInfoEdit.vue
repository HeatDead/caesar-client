<script setup>
import {Close, Edit, Plus, Search, SemiSelect} from "@element-plus/icons-vue";
import {ref, defineExpose} from "vue";
import ProjectStatus from "@/components/project/ProjectStatus.vue";
import taskApi from "@/api/taskApi";
import TaskStatus from "@/components/task/TaskStatus.vue";
import UserPanel from "@/components/UserPanel.vue";
import TaskType from "@/components/task/TaskType.vue";
import TaskPriority from "@/components/task/TaskPriority.vue";
import groupApi from "@/api/groupApi";

const drawer = ref(false)
const edit = ref(false)

const groups = ref()

const autoVisible = ref(false)

const editTask = ref()

const distribution = ref({difficulty: 0,
projectId: null,
groupId: null})

const disabledDate = (time) => {
  return time.getTime() < (Date.now() - 3600 * 1000 * 24)
}

const open = async () => {
  await getGroups()
  drawer.value = true
}

const openEdit = async () => {
  await open()
  startEdit()
}

const updateTask = async () => {
  props.task = await taskApi.getTask(props.task.id);
}

defineExpose({
  open,
  openEdit
})

const startEdit = () => {
  edit.value = true
  editTask.value = {...props.task}
  if (editTask.value.assignee)
    editTask.value.assignee = editTask.value.assignee.username
  if (editTask.value.group)
    editTask.value.group = editTask.value.group.id
}

const cancelEdit = () => {
  edit.value = false;
  autoVisible.value = false;
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

const getGroups = async () => {
  groupApi.getGroups().then((data) => {
    groups.value = data
  })
}

const distribute = async () => {
  distribution.value.projectId = props.task.projectEntity.id
  if (editTask.value.group)
    distribution.value.groupId = editTask.value.group.id
  distribution.value.difficulty = editTask.value.difficulty
  await taskApi.distribute(distribution.value).then((data) => {
    if (data)
      editTask.value.assignee = data.username
  })
}

const handleClose = () => {
  edit.value = false;
  drawer.value = false;
  autoVisible.value = false;
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
    <div v-if="task" class="container">
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
            <span v-if="!edit" class="item-value"><TaskType :type="task.type"/></span>
            <span v-else class="item-value"><el-select v-model="editTask.type" style="width: 220px">
              <el-option
                  type="primary"
                  key="TASK"
                  label="Задача"
                  value="TASK"/>
              <el-option
                  key="BUG"
                  label="Баг"
                  value="BUG"/>
            </el-select></span>
          </div>
          <div class="box-item">
            <span>Приоритет</span>
            <span v-if="!edit" class="item-value"><TaskPriority :priority="task.priority"/></span>
            <span v-else class="item-value"><el-select v-model="editTask.priority" style="width: 220px">
              <el-option
                  key="BLOCKER"
                  label="Блокер"
                  value="BLOCKER"/>
              <el-option
                  key="CRITICAL"
                  label="Критичный"
                  value="CRITICAL"/>
              <el-option
                  key="AVERAGE"
                  label="Средний"
                  value="AVERAGE"/>
              <el-option
                  key="LOW"
                  label="Низкий"
                  value="LOW"/>
              <el-option
                  key="MINOR"
                  label="Незначительный"
                  value="MINOR"/>
            </el-select></span>
          </div>
          <div class="box-item">
            <span>Группа</span>
            <span v-if="!edit" class="item-value">
                  <el-icon v-if="!task.group"><SemiSelect/></el-icon>
                  <span v-else> <UserPanel :name="task.group.name"/></span>
            </span>
            <span v-else class="item-value">
              <el-select
                  v-model="editTask.group"
                  clearable
                  placeholder="Выберете группу"
                  style="width: 220px"
              >
              <el-option
                  v-for="group in groups"
                  :key="group.id"
                  :label="group.name"
                  :value="group.id"
              />
            </el-select>
            </span>
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
              <span v-else><UserPanel
                  :name="`${task.author.surname} ${task.author.name} ${task.author.patronymic}`"/></span>
            </span>
          </div>
          <div class="box-item">
            <span>Исполнитель</span>
            <span v-if="!edit" class="item-value">
                  <el-icon v-if="!task.assignee"><SemiSelect/></el-icon>
                  <span v-else> <UserPanel
                      :name="`${task.assignee.surname} ${task.assignee.name} ${task.assignee.patronymic}`"/></span>
            </span>
            <span v-else class="item-value assignee">
                                            <el-select
                                                v-model="editTask.assignee"
                                                disabled
                                                placeholder="Выберете исполнителя"
                                                style="width: 220px"
                                            >
                <el-option
                    v-for="user in task.projectEntity.employees"
                    :key="user.username"
                    :label="`${user.surname} ${user.name} ${user.patronymic}`"
                    :value="user.username"
                />
                                                            </el-select>
              <el-popover :visible="autoVisible" placement="left-start" :width="300"> <!-- Создание проекта -->
                <header class="crp-header">
                  <h3 style="margin: 0">Автораспределение</h3>
                  <el-button style="width: 32px" text @click="autoVisible = false"><el-icon><Close/></el-icon></el-button>
                </header>
                          <div class="slider-demo-block">
    <span class="demonstration">Сложность</span>
    <el-slider v-model="editTask.difficulty" :step="1" :max="5" show-stops />
  </div>
                              <el-select
                                  v-model="editTask.assignee"
                                  clearable
                                  placeholder="Выберете исполнителя"
                                  style="width: 220px"
                              >
                <el-option
                    v-for="user in task.projectEntity.employees"
                    :key="user.username"
                    :label="`${user.surname} ${user.name} ${user.patronymic}`"
                    :value="user.username"
                />
              </el-select>
                        <div style="text-align: right; margin: 0">
                          <el-button :disabled="false" type="primary" @click="distribute">Определить</el-button>
                        </div>
                        <template #reference>
                          <el-button @click="autoVisible = true" style="width: 32px"><el-icon><Search/></el-icon></el-button>
                        </template>
                      </el-popover>
            </span>
          </div>
          <div class="box-item">
            <span>Проект</span>
            <span class="item-value">{{ task.projectEntity.name }}</span>
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
@import "@/assets/infoEdit.css";

.assignee {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
</style>