import { defineStore } from 'pinia'
import type { Credentials } from '@/authentication'

export const useUserStore = defineStore('user', () => {
  const signIn = async (credentials: Credentials) => {
    console.log('signIn: ')
    const content = JSON.stringify(credentials)
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

  const signUp = async (credentials: Credentials) => {
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
      console.log(error)
    }
  }

  return {
    signIn,
    signUp
  }
})
