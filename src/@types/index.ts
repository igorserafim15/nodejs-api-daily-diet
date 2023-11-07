export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt?: Date
}

export interface Meal {
  id: string
  userId: string
  name: string
  description: string
  hours: number
  isDiet: boolean
}
