import { type Headers } from '@/authentication'
import { type Bookmark } from '@/bookmark'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarks = ref<Bookmark>([])
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

    await doRequest('POST', headers, content, '/bookmarks')
    bookmarks.value = { ...bookmarks, bookmark }
    return
  }

  // const editUser = async (userToEdit: UserType) => {
  //   const access_token = JSON.parse(localStorage.getItem('access_token')!)
  //   const content = JSON.stringify(userToEdit)
  //   const headers = getHeaders(true)
  //
  //   await doRequest('PATCH', headers, content, '/users')
  //
  //   user.value = await getUserByToken(access_token)
  //
  //   return user.value
  // }
  //
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
