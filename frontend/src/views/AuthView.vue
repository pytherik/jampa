<script setup lang="ts">
import { useRoute } from 'vue-router'
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { type SignInCredentials, type SignUpCredentials } from '@/authentication'

const route = useRoute()
const { mode } = route.params
document.title = <string>mode

const userStore = useUserStore()
const { signIn, signUp } = userStore

const credentials =
  mode === 'singnup' ? reactive(<SignUpCredentials>{}) : reactive(<SignInCredentials>{})

const handleSubmit = () => {
  if (!credentials.email || !credentials.password) return
  mode === 'signup' ? signUp(credentials) : signIn(credentials)
}
</script>

<template>
  <main>
    <div class="form-container">
      <h1>{{ mode }}</h1>
      <input
        v-if="mode === 'signup'"
        type="text"
        v-model="credentials.username"
        placeholder="Benutzername"
      />
      <input type="email" v-model="credentials.email" placeholder="Email" />
      <input type="password" v-model="credentials.password" placeholder="Passwort" />
      <button @click="handleSubmit">{{ mode }}</button>
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
