<script setup lang="ts">
import { onMounted } from 'vue'
import { useBookmarksStore } from '@/stores/bookmarks'
import { storeToRefs } from 'pinia'
import BookmarkCard from '@/components/BookmarkCard.vue'

document.title = 'Home'

const bookmarksStore = useBookmarksStore()
const { bookmarks } = storeToRefs(bookmarksStore)
const { getAllBookmarks } = bookmarksStore

const fetchData = async () => {
  try {
    bookmarks.value = await getAllBookmarks()
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => fetchData())
</script>

<template>
  <main>
    <h1>Deine Lesezeichen</h1>
    <div class="row" v-if="bookmarks">
      <BookmarkCard v-for="bookmark in bookmarks" :key="bookmark.id" :bookmark="bookmark" />
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

h1 {
  margin-top: 2rem;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 85%;
  margin-top: 3rem;
}
</style>
