import { type Headers } from '@/authentication'
import { type Bookmark } from '@/bookmark'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarks = ref([])
  const errorMessage = ref('')

  const getHeaders = (addBearer: boolean) => {
    const headers: Headers = { 'Content-Type': 'application/json' }
    if (addBearer) {
      const access_token: string = JSON.parse(localStorage.getItem('access_token')!)
      headers.Authorization = `Bearer ${access_token}`
    }
    return headers
  }

  const createBookmark = async (bookmark: Bookmark) => {
    const content = JSON.stringify(bookmark)
    const headers = getHeaders(true)

    const newBookmark = await doRequest('POST', headers, content, '/bookmarks')
    bookmarks.value = { ...bookmarks, newBookmark }
    console.log(bookmarks.value[0])
    return
  }

  const BASE_URL = 'http://localhost:3000'
  const doRequest = async (method: string, headers: any, content: any, path: string) => {
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: method,
        headers: headers,
        body: content
      })
      const data = await res.json()

      if (res.status >= 400) {
        if (typeof data.message !== 'string') data.message = 'Irgendwas stimmt hier nicht!'
        return (errorMessage.value = data.message)
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
    createBookmark
  }
})
