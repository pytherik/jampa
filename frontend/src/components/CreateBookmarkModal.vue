<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Bookmark } from '@/bookmark'
import { useBookmarksStore } from '@/stores/bookmarks'

const open = ref(false)
const errorMessage = ref('')
const bookmark = reactive<Bookmark>({})
const bookmarkStore = useBookmarksStore()
const { createBookmark } = bookmarkStore
const handleCloseModal = () => {
  open.value = false
  // errorMessage.value = ''
}
const handleSubmit = () => {
  console.log(bookmark.description)
  createBookmark(bookmark)
  handleCloseModal()
}
</script>

<template>
  <button @click="open = true">Neues Lesezeichen</button>
  <div class="modal" v-show="open">
    <div class="inner-modal">
      <span class="close" @click="handleCloseModal">&#10008;</span>
      <h3>{{ 'Edit User' }}</h3>
      <span class="error-msg">{{ errorMessage }}</span>
      <input v-model="bookmark.title" type="text" placeholder="Titel" />
      <input v-model="bookmark.link" type="text" placeholder="Url" />
      <textarea v-model="bookmark.description" placeholder="Beschreibung" />
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
  background-color: #fce09b;
  color: #333;
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
