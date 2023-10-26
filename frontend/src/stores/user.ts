import { defineStore } from 'pinia'
import { type SignInCredentials, type SignUpCredentials, type UserType } from '@/authentication'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserType>()
  const errorMessage = ref('')

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
    try {
      const res = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: content
      })
      const data = await res.json()

      if (res.status >= 400) {
        if (typeof data.message !== 'string') data.message = 'Irgendwas stimmt hier nicht!'
        return (errorMessage.value = data.message)
      }

      user.value = await getUserByToken(data.access_token)
      // console.log(user.value)
      return user.value
    } catch (error) {
      console.log('ein Fehler: ')
      console.log(error)
    }
  }

  const signUp = async (credentials: SignUpCredentials) => {
    const content = JSON.stringify(credentials)
    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: content
      })
      const data = await res.json()

      if (res.status >= 400) {
        if (typeof data.message !== 'string') data.message = 'Irgendwas stimmt hier nicht!'
        return (errorMessage.value = data.message)
      }

      user.value = await getUserByToken(data.access_token)
      return user.value
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
    getUserByToken
  }
})
