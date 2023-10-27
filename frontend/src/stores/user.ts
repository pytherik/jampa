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
    const data = await doRequest(
      'POST',
      { 'Content-Type': 'application/json' },
      content,
      '/auth/signin'
    )

    user.value = await getUserByToken(data.access_token)
    localStorage.setItem('access_token', JSON.stringify(data.access_token))
    return user.value
    //   try {
    //     const res = await fetch('http://localhost:3000/auth/signin', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: content
    //     })
    //     const data = await res.json()
    //
    //     if (res.status >= 400) {
    //       if (typeof data.message !== 'string') data.message = 'Irgendwas stimmt hier nicht!'
    //       return (errorMessage.value = data.message)
    //     }
    //
    //     user.value = await getUserByToken(data.access_token)
    //     // console.log(user.value)
    //     localStorage.setItem('access_token', JSON.stringify(data.access_token))
    //     return user.value
    //   } catch (error) {
    //     console.log('ein Fehler: ')
    //     console.log(error)
    //   }
    // }
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
    // try {
    //   const res = await fetch('http://localhost:3000/auth/signup', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: content
    //   })
    //   const data = await res.json()
    //
    //   if (res.status >= 400) {
    //     if (typeof data.message !== 'string') data.message = 'Irgendwas stimmt hier nicht!'
    //     return (errorMessage.value = data.message)
    //   }
    //
    //   user.value = await getUserByToken(data.access_token)
    //   localStorage.setItem('access_token', JSON.stringify(data.access_token))
    //   return user.value
    // } catch (error) {
    //   console.log('ein Fehler: ')
    //   console.log(error)
    // }
  }

  const editUser = async (userToEdit: SignUpCredentials) => {
    const access_token = JSON.parse(localStorage.getItem('access_token'))
    const content = JSON.stringify({
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      email: userToEdit.email
    })

    await doRequest(
      'PATCH',
      { 'Content-Type': 'application/json', Authorization: `Bearer ${access_token}` },
      content,
      '/users'
    )
    user.value = await getUserByToken(access_token)

    return user.value

    // try {
    //   const res = await fetch('http://localhost:3000/users', {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${access_token}`
    //     },
    //     body: content
    //   })
    //   const data = await res.json()
    //
    //   if (res.status >= 400) {
    //     if (typeof data.message !== 'string') data.message = 'Irgendwas stimmt hier nicht!'
    //     return (errorMessage.value = data.message)
    //   }
    //
    //   user.value = await getUserByToken(access_token)
    //   return user.value
    // } catch (error) {
    //   console.log('ein Fehler: ')
    //   console.log(error)
    // }
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
