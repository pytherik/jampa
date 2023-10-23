<script setup lang="ts">
import { useRoute } from 'vue-router'
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Credentials } from '@/authentication'

const userStore = useUserStore()
const { signIn, signUp } = userStore

const credentials = reactive(<Credentials>{})

const route = useRoute()
const { mode } = route.params
document.title = <string>mode

const handleSubmit = (e) => {
  if (!credentials.email || !credentials.password) return
  credentials.username ? signUp(credentials) : signIn(credentials)
  e.preventDefault()
}
</script>

<template>
  <main>
    <div class="form-container">
      <h1>{{ mode }}</h1>
      <input
        type="text"
        v-model="credentials.username"
        v-if="mode === 'signup'"
        placeholder="Benutzername"
      />
      <input type="email" v-model="credentials.email" placeholder="Email" />
      <input type="password" v-model="credentials.password" placeholder="Passwort" />
      <button @click="(e) => handleSubmit(e)">{{ mode }}</button>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  margin-bottom: 20px;
}
.form-container {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  padding: 5px 10px;
  margin: 5px 0;
}

button {
  margin-top: 20px;
  padding: 5px 10px;
  width: 150px;
}
</style>
