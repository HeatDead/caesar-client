<script setup>
import { RouterLink, RouterView } from "vue-router";

import {
  Document,
  Menu as IconMenu,
  Location,
  Collection,
  Setting,
  DataAnalysis,
  Tickets,
  DataBoard
} from "@element-plus/icons-vue";
import Sidebar from "@/components/Sidebar.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <Sidebar/>
      <el-main>
        <el-scrollbar height="90vh">
          <RouterView/>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>


<style>
a {
  text-decoration: none;
}
</style>