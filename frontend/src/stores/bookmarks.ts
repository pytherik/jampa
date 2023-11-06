import { type Headers } from '@/authentication'
import { type Bookmark } from '@/bookmark'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const BASE_URL = 'http://localhost:3000'
  const bookmarks = ref<Bookmark[] | null>()
  const errorMessage = ref('')

  const getHeaders = (addBearer: boolean) => {
    const headers: Headers = { 'Content-Type': 'application/json' }
    if (addBearer) {
      const access_token: string = JSON.parse(localStorage.getItem('access_token')!)
      headers.Authorization = `Bearer ${access_token}`
    }
    return headers
  }

  const getAllBookmarks = async () => {
    const headers = getHeaders(true)
    bookmarks.value = await doRequest('GET', '/bookmarks', headers, null)
    return bookmarks.value
  }

  const getBookmarkById = async (bookmarkId: number) => {
    const headers = getHeaders(true)
    return await doRequest('GET', `/bookmarks/${bookmarkId}`, headers, null)
  }

  const createBookmark = async (bookmark: Bookmark) => {
    const content = JSON.stringify(bookmark)
    const headers = getHeaders(true)

    const newBookmark: Bookmark = await doRequest('POST', '/bookmarks', headers, content)
    bookmarks.value = { ...bookmarks.value, newBookmark }
  }

  const editBookmark = async (bookmark: Bookmark) => {
    const content = JSON.stringify(bookmark)
    const headers = getHeaders(true)
    await doRequest('PATCH', `/bookmarks/${bookmark.id}`, headers, content)
    bookmarks.value = await getAllBookmarks()
  }

  const deleteBookmark = async (bookmarkId: number) => {
    const headers = getHeaders(true)
    await doRequest('DELETE', `/bookmarks/${bookmarkId}`, headers, null)
    bookmarks.value = await getAllBookmarks()
  }

  const doRequest = async (method: string, path: string, headers: any, content: any | null) => {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: method,
        headers: headers,
        body: content
      })
      const data = await res.json()

      if (res.status >= 400) {
        if (typeof data.message !== 'string') {
          data.message = 'Irgendwas stimmt hier nicht!'
          errorMessage.value = data.message
        }
        return []
      }
      return data
    } catch (error) {
      console.log('ein Fehler: ')
      console.log(error)
    }
  }

  return {
    errorMessage,
    bookmarks,
    createBookmark,
    getAllBookmarks,
    getBookmarkById,
    editBookmark,
    deleteBookmark
  }
})
