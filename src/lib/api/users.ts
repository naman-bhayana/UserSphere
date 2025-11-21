import axios from 'axios'
import type { User } from '../../types'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`${BASE_URL}/users`)
  return response.data
}

export const fetchUserById = async (id: number): Promise<User> => {
  const response = await axios.get<User>(`${BASE_URL}/users/${id}`)
  return response.data
}

