<script setup lang="ts">
import { onMounted, ref } from 'vue'

const hello = ref('')
const fetchData = async () => {
  try {
    const res = await fetch('http://localhost:3000', { method: 'GET' })
    hello.value = await res.text()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => fetchData())
</script>

<template>
  <main>
    <h1>This is the Home Page</h1>
    <h1>{{ hello }}</h1>
  </main>
</template>
