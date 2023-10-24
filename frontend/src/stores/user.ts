import { defineStore } from 'pinia'
import { type SignInCredentials, type SignUpCredentials } from '@/authentication'

export const useUserStore = defineStore('user', () => {
  const signIn = async (credentials: SignInCredentials) => {
    const content = JSON.stringify(credentials)
    console.log('signIn: ', content)
    try {
      await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: content
      })
    } catch (error) {
      console.log(error)
    }
  }

  const signUp = async (credentials: SignUpCredentials) => {
    const content = JSON.stringify(credentials)
    try {
      await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: content
      })
    } catch (error) {
      console.log('ein Fehler: ')
      console.log(error)
    }
  }

  return {
    signIn,
    signUp
  }
})
