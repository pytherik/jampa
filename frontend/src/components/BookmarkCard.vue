<script setup lang="ts">
import { ref } from 'vue'
import EditBookmarkModal from '@/components/EditBookmarkModal.vue'
import { useBookmarksStore } from '@/stores/bookmarks'

const { bookmark } = defineProps(['bookmark'])

const bookmarksStore = useBookmarksStore()
const { deleteBookmark } = bookmarksStore

const handleDelete = (bookmarkId: number) => {
  deleteBookmark(bookmarkId)
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ bookmark.title }}</h3>
    </div>
    <div class="card-body" v-if="bookmark.description">
      <p>{{ bookmark.description }}</p>
    </div>
    <div class="card-body" v-else>
      <p>Keine Beschreibung.</p>
    </div>
    <div class="link">
      <a :href="`${bookmark.link}`" target="_blank">{{ bookmark.link }}</a>
      <div class="footer">
        <EditBookmarkModal :bookmarkId="bookmark.id" />
        <img @click="handleDelete(bookmark.id)" src="delete.png" alt="loeschen" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 200px;
  height: 300px;
  margin: 10px 10px;
  padding: 10px;
  border: 1px solid #aaa;
  border-radius: 5px;
}

.card-header {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #aaa;
  padding: 2rem 0;
}

.card-body {
  width: 100%;
  text-align: center;
}

.link {
  width: 100%;
  text-align: center;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
img {
  width: 23px;
}

img:hover {
  border: 1px solid #aaa;
  border-radius: 3px;
}

a {
  color: #dedeed;
}

a:hover {
  color: #fce09b;
  border: 1px solid #aaa;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
}
</style>
