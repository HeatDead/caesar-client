<script setup>
import axios from "axios";

let roles = []

const getRoles = () => {
  axios.get("http://localhost:8080/role").then((response) => {
    roles = response.data
  })
}
</script>

<template>

</template>

<style scoped>

</style>