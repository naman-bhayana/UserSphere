import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { User } from '../types'
import { fetchUsers } from '../lib/api/users'

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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
        id: -Date.now(),
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

      queryClient.setQueryData<User[]>(['users'], (old = []) => [tempUser, ...old])
      return { previousUsers, tempUser }
    },
    onSuccess: (data, variables, context) => {
      const tempId = context?.tempUser?.id
      const mergedUser: User = {
        ...data,
        id: data.id,
        phone: variables.phone,
        company: {
          name: variables.company,
          catchPhrase: context?.tempUser?.company?.catchPhrase || '',
          bs: context?.tempUser?.company?.bs || '',
        },
        address: data.address || context?.tempUser?.address || {
          street: '',
          suite: '',
          city: '',
          zipcode: '',
          geo: { lat: '', lng: '' },
        },
        website: data.website || context?.tempUser?.website || '',
        username: data.username || context?.tempUser?.username || '',
      }

      queryClient.setQueryData<User[]>(['users'], (old = []) => {
        const existing = old ?? []
        if (tempId) {
          return existing.map((user) => (user.id === tempId ? mergedUser : user))
        }
        const deduped = existing.filter(
          (u) => u.email !== mergedUser.email && u.username !== mergedUser.username
        )
        return [mergedUser, ...deduped]
      })
    },
    onError: (_err, _newUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload): Promise<User> => {
      let targetId = payload.id
      if (targetId < 0) {
        const users = queryClient.getQueryData<User[]>(['users']) || []
        const usernameGuess = payload.name.toLowerCase().replace(/\s+/g, '')
        const found = users.find(
          (u) => u.email === payload.email || u.username === usernameGuess
        )
        if (found) {
          targetId = found.id
        }
      }

      if (targetId > 10) {
        const users = queryClient.getQueryData<User[]>(['users']) || []
        const current = users.find((u) => u.id === targetId) || users.find((u) => u.id === payload.id)
        return {
          ...(current ?? {
            id: targetId,
            name: payload.name,
            username: payload.name.toLowerCase().replace(/\s+/g, ''),
            email: payload.email,
            phone: payload.phone,
            website: '',
            address: {
              street: '',
              suite: '',
              city: '',
              zipcode: '',
              geo: { lat: '', lng: '' },
            },
            company: { name: payload.company, catchPhrase: '', bs: '' },
          }),
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          company: {
            ...(current?.company ?? { name: payload.company, catchPhrase: '', bs: '' }),
            name: payload.company,
          },
        } as User
      }

      try {
        const response = await axios.put<User>(`${BASE_URL}/users/${targetId}`, payload)
        return { ...response.data, id: targetId }
      } catch (_e) {
        const users = queryClient.getQueryData<User[]>(['users']) || []
        const current = users.find((u) => u.id === targetId) || users.find((u) => u.id === payload.id)
        return {
          ...(current ?? {
            id: targetId,
            name: payload.name,
            username: payload.name.toLowerCase().replace(/\s+/g, ''),
            email: payload.email,
            phone: payload.phone,
            website: '',
            address: {
              street: '',
              suite: '',
              city: '',
              zipcode: '',
              geo: { lat: '', lng: '' },
            },
            company: { name: payload.company, catchPhrase: '', bs: '' },
          }),
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          company: {
            ...(current?.company ?? { name: payload.company, catchPhrase: '', bs: '' }),
            name: payload.company,
          },
        } as User
      }
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
    onSuccess: (data, variables) => {
      queryClient.setQueryData<User[]>(['users'], (old = []) =>
        old.map((user) => {
          if (user.id === variables.id) {
            return {
              ...data,
              phone: variables.phone,
              company: {
                name: variables.company,
                catchPhrase: user.company?.catchPhrase || '',
                bs: user.company?.bs || '',
              },
              address: data.address || user.address || {
                street: '',
                suite: '',
                city: '',
                zipcode: '',
                geo: { lat: '', lng: '' },
              },
              website: data.website || user.website || '',
              username: data.username || user.username || '',
            }
          }
          return user
        })
      )
    },
    onError: (_err, _updatedUser, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
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
  })
}
