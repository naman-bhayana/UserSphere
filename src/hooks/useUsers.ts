import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { fetchUsers } from '../lib/api/users'
import type { User } from '../types'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

interface CreateUserPayload {
  name: string
  email: string
  phone: string
  company: string
}

interface UpdateUserPayload extends CreateUserPayload {
  id: number
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}

export const useAddUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUserPayload): Promise<User> => {
      const response = await axios.post<User>(`${BASE_URL}/users`, payload)
      return response.data
    },
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      const tempUser: User = {
        id: Date.now(),
        name: newUser.name,
        username: newUser.name.toLowerCase().replace(/\s+/g, ''),
        email: newUser.email,
        phone: newUser.phone,
        website: '',
        address: {
          street: '',
          suite: '',
          city: '',
          zipcode: '',
          geo: {
            lat: '',
            lng: '',
          },
        },
        company: {
          name: newUser.company,
          catchPhrase: '',
          bs: '',
        },
      }

      queryClient.setQueryData<User[]>(['users'], (old = []) => [...old, tempUser])

      return { previousUsers }
    },
    onError: (_err, _newUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload): Promise<User> => {
      const response = await axios.put<User>(`${BASE_URL}/users/${payload.id}`, payload)
      return response.data
    },
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      queryClient.setQueryData<User[]>(['users'], (old = []) =>
        old.map((user) =>
          user.id === updatedUser.id
            ? {
                ...user,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                company: {
                  ...user.company,
                  name: updatedUser.company,
                },
              }
            : user
        )
      )

      return { previousUsers }
    },
    onError: (_err, _updatedUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axios.delete(`${BASE_URL}/users/${id}`)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      queryClient.setQueryData<User[]>(['users'], (old = []) => old.filter((user) => user.id !== id))

      return { previousUsers }
    },
    onError: (_err, _id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

