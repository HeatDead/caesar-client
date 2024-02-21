<script setup>
import {useRoute} from "vue-router";
import taskApi from "@/api/taskApi";
import {ref} from "vue";
import {onMounted} from "vue";

const route = useRoute()
const id = route.params.id;

let task = ref(null);
let loading = ref(true)

const getTask = async () => {
  task.value = await taskApi.getTask(id);
  loading.value = false;
}

onMounted(() => {
  getTask()
})
</script>

<template>
  <div v-loading="loading">
    <div  v-if="task">
      <h3>{{task.name}}</h3>
      <p>{{task.description}}</p>
    </div>
  </div>
</template>

<style scoped>

</style>