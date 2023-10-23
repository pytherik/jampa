<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isAuthenticating = ref(false)

const status = ref('')
const handleSignin = () => {
  isAuthenticating.value = true
  router.push('auth/signin')
}

const hanleSignup = () => {
  isAuthenticating.value = true
  router.push('/auth/signup')
}

const handleGoBack = () => {
  isAuthenticating.value = false
  router.push('/')
}
</script>

<template>
  <nav>
    <div>
      <RouterLink to="/" :status="status" @click="isAuthenticating = false">Home</RouterLink>
      <RouterLink to="/about" @click="isAuthenticating = false">About</RouterLink>
    </div>
    <div v-if="!isAuthenticating">
      <button @click="handleSignin">Signin</button>
      <button @click="hanleSignup">Signup</button>
    </div>
    <div v-else>
      <button @click="handleGoBack">Zurück</button>
    </div>
  </nav>
  <h2>{{ status }}</h2>
</template>

<style scoped>
nav {
  height: 5rem;
  background-color: rosybrown;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

a,
button {
  font-size: 1.5rem;
  text-decoration: none;
  color: #dedeed;
  margin: 0 2rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid black;
  border-radius: 8px;
}
</style>
