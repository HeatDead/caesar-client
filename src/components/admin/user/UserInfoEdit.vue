<script setup>
import {Edit, SemiSelect} from "@element-plus/icons-vue";
import {defineExpose, ref} from "vue";
import * as userApi from "@/api/userApi";
import {ElMessage, ElMessageBox} from "element-plus";
import {throwSuccess} from "@/config/notifications";
import groupApi from "@/api/groupApi";

const drawer = ref(false)
const edit = ref(false)
const newPass = ref()

const groups = ref()

const editUser = ref()
const selectedGroups = ref([])

const open = async () => {
  await getGroups()
  selectedGroups.value = []
  for (let i = 0; i < props.user.groups.length; i++)
    selectedGroups.value.push(props.user.groups[i].id)
  drawer.value = true
}

const openEdit = async () => {
  await open()
  startEdit()
}

const getGroups = async () => {
  groupApi.getGroups().then((data) => {
    groups.value = data
  })
}

defineExpose({
  open,
  openEdit
})

const startEdit = () => {
  edit.value = true
  editUser.value = {...props.user}
  selectedGroups.value = []
  for (let i = 0; i < editUser.value.groups.length; i++)
    selectedGroups.value.push(editUser.value.groups[i].id)
}

const cancelEdit = () => {
  edit.value = false;
}

const saveEdit = async () => {
  await userApi.editUser(editUser.value, selectedGroups.value).then(() => {
    props.reload()
    edit.value = false;
  })
}

let props = defineProps({
  user: Object,
  roles: Object,
  reload: Function
})

const editPassword = async () => {
  ElMessageBox.confirm(
      'Вы собираетесь изменить пароль пользователя. Продложить?',
      'Внимание',
      {
        confirmButtonText: 'Принять',
        cancelButtonText: 'Отменить',
        type: 'warning',
      }
  )
      .then(async () => {
        await userApi.editPassword({username:props.user.username, password:newPass.value})
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Операция отменена',
        })
      })
}

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
      <div style="display: flex">
        <el-button v-if="!edit" @click="startEdit" type="info" class="w-20" link>
          <el-icon>
            <Edit/>
          </el-icon>
        </el-button>
        <h2 style="color: var(--el-text-color-primary); margin-left: 10px">Пользователь</h2>
      </div>
    </template>
    <div v-if="user" class="container">
      <el-divider/>
      <div class="task-container">
        <div class="box-item">
          <span>Фамилия</span>
          <span v-if="!edit" class="item-value">
              <el-icon v-if="!user.surname"><SemiSelect/></el-icon>
              <span v-else>{{user.surname}}</span>
            </span>
          <span v-else class="item-value"><el-input v-model="editUser.surname"></el-input></span>
        </div>
        <div class="box-item">
          <span>Имя</span>
          <span v-if="!edit" class="item-value">
              <el-icon v-if="!user.name"><SemiSelect/></el-icon>
              <span v-else>{{user.name}}</span>
            </span>
          <span v-else class="item-value"><el-input v-model="editUser.name"></el-input></span>
        </div>
        <div class="box-item">
          <span>Отчество</span>
          <span v-if="!edit" class="item-value">
              <el-icon v-if="!user.patronymic"><SemiSelect/></el-icon>
              <span v-else>{{user.patronymic}}</span>
            </span>
          <span v-else class="item-value"><el-input v-model="editUser.patronymic"></el-input></span>
        </div>
        <div class="box-item">
          <span>Роль</span>
          <span v-if="!edit" class="item-value">
              <el-icon v-if="!user.role"><SemiSelect/></el-icon>
              <span v-else>{{user.role.name}}</span>
            </span>
          <span v-else class="item-value"><el-select
              v-model="editUser.role.id"
              placeholder="Роль"
              style="width: 100%; margin-bottom: 10px"
          >
            <el-option
                v-for="role in roles"
                :key="role.id"
                :label="role.name"
                :value="role.id"
            />
          </el-select></span>
        </div>
        <div class="box-item">
          <span>Группы</span>
          <span v-if="!edit" class="item-value">
              <el-icon v-if="!user.groups"><SemiSelect/></el-icon>
              <span v-else><el-select
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  filterable
                  disabled
                  v-model="selectedGroups"
                  placeholder="Группы"
                  style="width: 100%; margin-bottom: 10px"
              >
            <el-option
                v-for="group in groups"
                :key="group.id"
                :label="group.name"
                :value="group.id"
            />
          </el-select></span>
            </span>
          <span v-else class="item-value"><el-select
              multiple
              collapse-tags
              collapse-tags-tooltip
              filterable
              v-model="selectedGroups"
              placeholder="Группы"
              style="width: 100%; margin-bottom: 10px"
          >
            <el-option
                v-for="group in groups"
                :key="group.id"
                :label="group.name"
                :value="group.id"
            />
          </el-select></span>
        </div>
        <div v-if="edit" class="box-item">
          <el-input style="width: 250px" v-model="newPass" type="password" show-password></el-input>
          <el-button @click="editPassword" class="item-value" type="danger">Сменить пароль</el-button>
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
</style>