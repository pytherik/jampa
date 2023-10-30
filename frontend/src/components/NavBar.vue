<script setup lang="ts">
import AuthModal from '@/components/AuthModal.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import EditUserModal from '@/components/EditUserModal.vue'
import CreateBookmarkModal from '@/components/CreateBookmarkModal.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<template>
  <nav>
    <div class="left-btn">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </div>
    <div class="right-btn" v-if="!user">
      <AuthModal :signup="true" />
      <AuthModal :signup="false" />
    </div>
    <div class="right-btn" v-else>
      <CreateBookmarkModal />
      <EditUserModal :user="user" />
    </div>
  </nav>
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
  background-color: cadetblue;
  color: #dedeed;
  margin: 0 0.5rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid black;
}
</style>
