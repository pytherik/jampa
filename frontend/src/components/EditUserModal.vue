<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const props = defineProps(['user'])
const { user } = toRefs(props)
const open = ref(false)
const userStore = useUserStore()
const { editUser } = userStore
const { errorMessage } = storeToRefs(userStore)

const handleCloseModal = () => {
  open.value = false
  errorMessage.value = ''
}

const handleSubmit = () => {
  editUser({
    firstName: user?.value.firstName,
    lastName: user?.value.lastName,
    email: user?.value.email
  })
  handleCloseModal()
}
</script>

<template>
  <button @click="open = true">{{ user.firstName }}</button>
  <div class="modal" v-show="open">
    <div class="inner-modal">
      <span class="close" @click="handleCloseModal">&#10008;</span>
      <h3>{{ 'Edit User' }}</h3>
      <span class="error-msg">{{ errorMessage }}</span>
      <input v-model="user.firstName" type="text" placeholder="Vorname" />
      <input v-model="user.lastName" type="text" placeholder="Nachname" />
      <input v-model="user.email" type="email" placeholder="Email" />
      <button class="btn-submit" @click="handleSubmit">Submit</button>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000066;
  display: flex;
  justify-content: center;
  align-items: start;
}

.inner-modal {
  margin-top: 10rem;

  padding: 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 350px;
  height: 300px;
  border-radius: 8px;
  background-color: #666;
  color: #deeded;
}

h3 {
  margin-bottom: 2rem;
}

.error-msg {
  margin-bottom: 3px;
  color: rosybrown;
}
input {
  width: 100%;
  font-size: 1rem;
  padding: 3px 5px;
  margin-bottom: 8px;
  border: none;
  border-radius: 5px;
  outline: 1px solid #ccc;
}

button {
  font-size: 1.5rem;
  background-color: cadetblue;
  color: #dedeed;
  margin: 0 0.5rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid black;
}

button:hover {
  filter: brightness(120%);
}

.btn-submit {
  width: 100%;
  font-size: 1rem;
  background-color: cadetblue;
  margin-top: 2rem;
  padding: 0.2rem 0.5rem;
  border: none;
  border-radius: 5px;
}

.close {
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
