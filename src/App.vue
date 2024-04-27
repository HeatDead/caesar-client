<script setup>
import { RouterLink, RouterView } from "vue-router";
import {useAuthStore} from "@/stores/user";
import Sidebar from "@/components/Sidebar.vue";
import {onBeforeMount} from "vue";
import LoginView from "@/views/LoginView.vue";

onBeforeMount(() => {
  useAuthStore().loadToken()
  useAuthStore().loadDetails()
})
</script>

<template>
  <div class="common-layout">
    <el-container v-if="useAuthStore().token">
      <Sidebar/>
      <el-main>
        <el-scrollbar height="90vh">
          <RouterView/>
        </el-scrollbar>
      </el-main>
    </el-container>
    <div v-else>
      <LoginView/>
    </div>
  </div>
</template>


<style>
a {
  text-decoration: none;
}
</style>