<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import {onMounted, ref} from "vue";
import {instance} from "@/config/axiosConfig";
import {useSettingsStore} from "@/stores/settings";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
const options = {
  responsive: false,
  maintainAspectRatio: true,
  scales: {
    x: {
      grid: {
        color: () => getColor.value,
      },
      beginAtZero: false,
    },
    y: {
      grid: {
        color: () => getColor.value,
      },
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value}`,
        stepSize: 1,
      },
    }
  }
}

const getColor = ref(() => {
  if (useSettingsStore().isDark)
    return '#424346'
  return '#c6c8d0'
})

const tasksData = ref()

const getTasksData = async () => {
  tasksData.value = (await instance.get("/charts/tasks")).data
  tasksData.value.datasets[0].backgroundColor = '#19e823'
  console.log(tasksData.value)
}

onMounted(() => {
  getTasksData()
})
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Caesar</el-breadcrumb-item>
    <el-breadcrumb-item>Дашборд</el-breadcrumb-item>
  </el-breadcrumb>
  <h2>Дашборд</h2>
  <el-card v-if="tasksData" style="width: fit-content; height: fit-content">
    <Line style="width: 600px; height: 300px" :data="tasksData" :options="options"/>
  </el-card>
</template>

<style scoped>

</style>