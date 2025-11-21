import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import * as Select from '@radix-ui/react-select'
import { fetchUsers } from '../../src/lib/api/users'
import { useAddUser, useUpdateUser } from '../../src/hooks/useUsers'
import UserDialog from '../../src/components/UserDialog'
import type { User } from '../../src/types'

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

type EmailSortOrder = 'asc' | 'desc' | null

export default function UsersPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [emailSortOrder, setEmailSortOrder] = useState<EmailSortOrder>(null)
  const [selectedCompany, setSelectedCompany] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined)

  const addUserMutation = useAddUser()
  const updateUserMutation = useUpdateUser()

  const companies = useMemo(() => {
    if (!users) return []
    const uniqueCompanies = Array.from(new Set(users.map((user) => user.company.name)))
    return uniqueCompanies.sort()
  }, [users])

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return []

    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCompany !== 'all') {
      filtered = filtered.filter((user) => user.company.name === selectedCompany)
    }

    if (emailSortOrder) {
      filtered = [...filtered].sort((a, b) => {
        if (emailSortOrder === 'asc') {
          return a.email.localeCompare(b.email)
        } else {
          return b.email.localeCompare(a.email)
        }
      })
    }

    return filtered
  }, [users, searchTerm, selectedCompany, emailSortOrder])

  const validateForm = (name: string, email: string): boolean => {
    if (!name.trim()) {
      alert('Name is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = (payload: { name: string; email: string; phone: string; company: string }) => {
    if (!validateForm(payload.name, payload.email)) {
      return
    }

    if (editingUser) {
      updateUserMutation.mutate(
        { ...payload, id: editingUser.id },
        {
          onSuccess: () => {
            setDialogOpen(false)
            setEditingUser(undefined)
          },
        }
      )
    } else {
      addUserMutation.mutate(payload, {
        onSuccess: () => {
          setDialogOpen(false)
        },
      })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingUser(undefined)
    setDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-600 dark:text-red-400">Error loading users</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add User
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search by name
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4">
          <Select.Root value={selectedCompany} onValueChange={setSelectedCompany}>
            <Select.Trigger
              className="inline-flex items-center justify-between px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by company"
            >
              <Select.Value placeholder="All Companies" />
              <Select.Icon className="text-gray-500 dark:text-gray-400">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M4 6H11L7.5 10.5L4 6Z"
                    fill="currentColor"
                  />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="all"
                    className="relative px-4 py-2 rounded-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none cursor-pointer"
                  >
                    <Select.ItemText>All Companies</Select.ItemText>
                  </Select.Item>
                  {companies.map((company) => (
                    <Select.Item
                      key={company}
                      value={company}
                      className="relative px-4 py-2 rounded-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none cursor-pointer"
                    >
                      <Select.ItemText>{company}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <button
            onClick={() => {
              if (emailSortOrder === null) {
                setEmailSortOrder('asc')
              } else if (emailSortOrder === 'asc') {
                setEmailSortOrder('desc')
              } else {
                setEmailSortOrder(null)
              }
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sort by email"
          >
            Email {emailSortOrder === 'asc' ? '↑' : emailSortOrder === 'desc' ? '↓' : '↕'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Avatar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filteredAndSortedUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {getInitials(user.name)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.company.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editingUser}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

