<script setup>
import {Edit, SemiSelect} from "@element-plus/icons-vue";
import {ref, defineExpose, reactive} from "vue";
import ProjectStatus from "@/components/project/ProjectStatus.vue";
import taskApi from "@/api/taskApi";
import * as userApi from "@/api/userApi";

const drawer = ref(false)
const edit = ref(false)

const editRole = ref()

const permissions = ref({})

const open = async () => {
  drawer.value = true
  await loadPermissions()
}

const openEdit = async () => {
  await open()
  startEdit()
}

const loadPermissions = async () => {
  userApi.getPermissions().then((data) => {
    permissions.value = data;
  })
}

defineExpose({
  open,
  openEdit
})

const startEdit = () => {
  edit.value = true
  editRole.value = {...props.role}
}

const cancelEdit = () => {
  edit.value = false;
}

const saveEdit = async () => {
  await userApi.editRole(editRole.value).then(() => {
    props.reload()
    edit.value = false;
  })
}

let props = defineProps({
  role: Object,
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
        <h2 v-if="role" style="color: var(--el-text-color-primary); margin-left: 10px">{{ role.name }}</h2>
      </div>
      <div v-else>
        <el-input maxlength="25" show-word-limit v-model="editRole.name"
                  style="width: 300px; font-size: 24px; font-weight: bold" size="large"></el-input>
      </div>
    </template>
    <div v-if="role" class="container">
      <el-divider/>
      <div class="task-container">
        <div>
          <h3>Разрешения</h3>
          <div v-if="!edit" v-for="permission in role.permissions" class="box-item">
            {{permission}}
          </div>
          <el-checkbox-group v-else v-model="editRole.permissions">
            <el-checkbox v-for="permission in permissions" :label="permission" :value="permission"/>
          </el-checkbox-group>
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