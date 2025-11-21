import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
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

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`${BASE_URL}/users`)
  return response.data
}

// Fetch user by ID
export const fetchUserById = async (id: number): Promise<User> => {
  const response = await axios.get<User>(`${BASE_URL}/users/${id}`)
  return response.data
}

// Query hook for users list
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Mutation hook for adding user with optimistic update
export const useAddUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUserPayload): Promise<User> => {
      const response = await axios.post<User>(`${BASE_URL}/users`, payload)
      return response.data
    },
    onMutate: async (newUser) => {
      // Cancel outgoing queries to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['users'] })
      // Snapshot previous data for rollback
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      // Create optimistic user with negative temporary ID
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

      // Optimistically prepend new user
      queryClient.setQueryData<User[]>(['users'], (old = []) => [tempUser, ...old])

      return { previousUsers, tempUser }
    },
    onSuccess: (data, variables, context) => {
      // Merge API response with optimistic data to preserve company and other fields
      const mergedUser: User = {
        ...data,
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
      
      // Replace optimistic user with merged real data from API
      queryClient.setQueryData<User[]>(['users'], (old = []) => {
        if (!old) return [mergedUser]
        // Replace temp user (negative ID) with merged user
        const tempId = context?.tempUser?.id
        if (tempId) {
          return old.map((user) => (user.id === tempId ? mergedUser : user))
        }
        return [mergedUser, ...old]
      })
    },
    onError: (_err, _newUser, context) => {
      // Rollback to previous state on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },
  })
}

// Mutation hook for updating user with optimistic update
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload): Promise<User> => {
      const response = await axios.put<User>(`${BASE_URL}/users/${payload.id}`, payload)
      return response.data
    },
    onMutate: async (updatedUser) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['users'] })
      // Snapshot previous data
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      // Optimistically update user by mapping over array
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
      // Merge API response with variables to preserve company and other fields
      queryClient.setQueryData<User[]>(['users'], (old = []) =>
        old.map((user) => {
          if (user.id === data.id) {
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
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },
  })
}

// Mutation hook for deleting user with optimistic update
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await axios.delete(`${BASE_URL}/users/${id}`)
    },
    onMutate: async (id) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['users'] })
      // Snapshot previous data
      const previousUsers = queryClient.getQueryData<User[]>(['users'])

      // Optimistically remove user
      queryClient.setQueryData<User[]>(['users'], (old = []) => old.filter((user) => user.id !== id))

      return { previousUsers }
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers)
      }
    },
    // No onSettled - optimistic removal is already done, no need to refetch
  })
}
