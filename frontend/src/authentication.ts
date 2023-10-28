export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface UserType {
  id?: number
  firstName: string
  lastName: string
  email: string
}

export interface Headers {
  'Content-Type': string
  Authorization?: string
}
