<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  height: 5rem;
  background-color: rosybrown;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 0 2rem;
}

a {
  font-size: 1.5rem;
  text-decoration: none;
  color: #dedeed;
  margin: 0 2rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid black;
  border-radius: 8px;
}
</style>
