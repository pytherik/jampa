import {
  type Headers,
  type SignInCredentials,
  type SignUpCredentials,
  type UserType
} from '@/authentication'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserType>()
  const errorMessage = ref('')

  const getHeaders = (addBearer: boolean) => {
    const headers: Headers = { 'Content-Type': 'application/json' }
    if (addBearer) {
      const access_token: string = JSON.parse(localStorage.getItem('access_token'))
      headers.Authorization = `Bearer ${access_token}`
    }
    return headers
  }

  const getUserByToken = async (access_token: string) => {
    try {
      const res = await fetch('http://localhost:3000/users/me', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      })
      return await res.json()
    } catch (error) {
      console.log(error)
    }
  }

  const signIn = async (credentials: SignInCredentials) => {
    const content = JSON.stringify(credentials)
    const headers = getHeaders(false)
    const data = await doRequest('POST', headers, content, '/auth/signin')

    user.value = await getUserByToken(data.access_token)
    localStorage.setItem('access_token', JSON.stringify(data.access_token))
    return user.value
  }

  const signUp = async (credentials: SignUpCredentials) => {
    const content = JSON.stringify(credentials)
    const data = await doRequest(
      'POST',
      { 'Content-Type': 'application/json' },
      content,
      '/auth/signup'
    )

    user.value = await getUserByToken(data.access_token)
    localStorage.setItem('access_token', JSON.stringify(data.access_token))
    return user.value
  }

  const editUser = async (userToEdit: UserType) => {
    const access_token = JSON.parse(localStorage.getItem('access_token'))
    const content = JSON.stringify(userToEdit)
    const headers = getHeaders(true)

    await doRequest('PATCH', headers, content, '/users')

    user.value = await getUserByToken(access_token)

    return user.value
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
    user,
    errorMessage,
    signIn,
    signUp,
    getUserByToken,
    editUser
  }
})
