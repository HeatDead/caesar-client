<script setup>
import {useAuthStore} from "@/stores/user";

const test = () => {
  console.log(useAuthStore().userDetails)
}
</script>

<template>
  <el-button @click="test"></el-button>
  home
</template>
