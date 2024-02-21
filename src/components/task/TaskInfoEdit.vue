<script setup>
import {Edit, SemiSelect} from "@element-plus/icons-vue";
import {ref, defineExpose} from "vue";
import ProjectStatus from "@/components/project/ProjectStatus.vue";

const drawer = ref(false)
const edit = ref(false)

const startDate = ref('')
const deadlineDate = ref('')

const shortcuts = [
  {
    text: 'Сегодня',
    value: new Date(),
  },
  {
    text: 'Вчера',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'Через неделю',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

const disabledDate = (time) => {
  return time.getTime() < (Date.now() - 3600 * 1000 * 24)
}

const open = () => {
  drawer.value = true
}

defineExpose({
  open
})

const cancelEdit = () => {
  edit.value = false;
}

let props = defineProps({
  task: Object
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
        <el-button @click="edit=true" type="info" class="w-20" link><el-icon><Edit/></el-icon></el-button>
        <h2 v-if="task" style="color: white; margin-left: 10px">{{ task.name }}</h2>
      </div>
      <div v-else><el-input v-model="task.name" style="width: 300px; font-size: 24px; font-weight: bold" size="large"></el-input></div>
    </template>
    <div v-if="task" style="height: 90%">
      <div>
        <el-input v-if="edit" type="textarea" v-model="task.description"></el-input>
        <p v-else>{{task.description}}</p>
      </div>
      <el-divider/>
      <div class="task-container">
        <div>
          <div class="box-item">
            <span>Статус</span>
            <span v-if="!edit" class="item-value"><ProjectStatus/></span>
            <span v-else class="item-value"><el-select style="width: 220px"></el-select></span>
          </div>
          <div class="box-item">
            <span>Тип</span>
            <span v-if="!edit" class="item-value"><el-icon><SemiSelect/></el-icon></span>
            <span v-else class="item-value"><el-select style="width: 220px"></el-select></span>
          </div>
          <div class="box-item">
            <span>Дата начала</span>
            <span v-if="!edit" class="item-value"><el-icon><SemiSelect/></el-icon></span>
            <span v-else class="item-value">
                          <el-date-picker
                              v-model="startDate"
                              type="date"
                              placeholder="Выберете дату начала"
                              :disabled-date="disabledDate"
                              :shortcuts="shortcuts"
                              size="default"
                          />
            </span>
          </div>
          <div class="box-item">
            <span>Дедлайн</span>
            <span v-if="!edit" class="item-value"><el-icon><SemiSelect/></el-icon></span>
            <span v-else class="item-value">
                          <el-date-picker
                              v-model="deadlineDate"
                              type="date"
                              placeholder="Выберете дату дедлайна"
                              :disabled-date="disabledDate"
                              :shortcuts="shortcuts"
                              size="default"
                          />
            </span>
          </div>
          <div class="box-item">
            <span>Автор</span>
            <span class="item-value"><el-icon><SemiSelect/></el-icon></span>
          </div>
          <div class="box-item">
            <span>Исполнитель</span>
            <span class="item-value"><el-icon><SemiSelect/></el-icon></span>
          </div>
          <div class="box-item">
            <span>Проект</span>
            <span class="item-value">{{task.projectEntity.name}}</span>
          </div>
          <div class="box-item">
            <span>Доски</span>
            <span class="item-value"><el-icon><SemiSelect/></el-icon></span>
          </div>
        </div>
        <div v-if="edit" class="task-buttons">
          <el-button>Изменить</el-button>
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

.box-item {
  display: flex;
  margin-bottom: 25px;
  justify-content: space-between;
}

.item-value {
  width: 250px;
}
</style>